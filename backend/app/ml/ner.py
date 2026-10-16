from functools import lru_cache

import spacy
from spacy.language import Language
from spacy.matcher import PhraseMatcher

SPACY_MODEL = "en_core_web_sm"


class SpacyModelUnavailable(RuntimeError):
    """Raised when the spaCy model has not been downloaded."""


@lru_cache
def get_nlp() -> Language:
    try:
        return spacy.load(SPACY_MODEL)
    except OSError as exc:
        raise SpacyModelUnavailable(
            f"spaCy model '{SPACY_MODEL}' is not installed. "
            f"Run: python -m spacy download {SPACY_MODEL}"
        ) from exc


class SkillMatcher:
    """PhraseMatcher-based skill extraction over a fixed vocabulary.

    Two matchers run in parallel: one on lowercased token text, one on
    lemmas (so "deploying python apps" matches "python"). Generic NER is
    deliberately not used as a filter: the small English model mislabels
    tech terms (Django, Julia, Flask) as PERSON/GPE.
    """

    def __init__(self, nlp: Language, skill_terms: list[str]) -> None:
        self._nlp = nlp
        self._lower_matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
        self._lemma_matcher = PhraseMatcher(nlp.vocab, attr="LEMMA")

        for term in skill_terms:
            normalized = term.strip().lower()
            if not normalized:
                continue
            self._lower_matcher.add(normalized, [nlp.make_doc(normalized)])
            self._lemma_matcher.add(normalized, [nlp(normalized)])

    def extract(self, text: str) -> dict[str, int]:
        doc = self._nlp(text)

        spans: list[tuple[str, int, int]] = []
        seen: set[tuple[str, int, int]] = set()
        for matcher in (self._lower_matcher, self._lemma_matcher):
            for match_id, start, end in matcher(doc):
                term = self._nlp.vocab.strings[match_id]
                span = (term, start, end)
                if span not in seen:
                    seen.add(span)
                    spans.append(span)

        spans.sort(key=lambda span: (span[1], -(span[2] - span[1])))

        kept: list[tuple[int, int]] = []
        counts: dict[str, int] = {}
        for term, start, end in spans:
            if any(k_start <= start and end <= k_end for k_start, k_end in kept):
                continue
            kept.append((start, end))
            counts[term] = counts.get(term, 0) + 1

        return counts
