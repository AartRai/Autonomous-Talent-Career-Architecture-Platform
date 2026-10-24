"""Skill matching: rule-based baseline + semantic (embedding) comparison.

Ported from the team's standalone ai/ package (ai/skill_matcher.py,
ai/semantic_matcher.py) and adapted for the FastAPI backend: the semantic
path uses the shared embedder (app.ml.embedder) and a configurable
threshold, and falls back to the dependency-free rule-based baseline when
the embedding model is unavailable.
"""
from __future__ import annotations

import re
from collections.abc import Iterable

import numpy as np

from app.core.config import get_settings
from app.ml.embedder import EmbedderUnavailable, embed_texts

# Normalize common variants so obvious synonyms/abbreviations match.
ALIASES = {
    "ml": "machine learning",
    "machine-learning": "machine learning",
    "natural language processing": "nlp",
    "natural-language-processing": "nlp",
    "js": "javascript",
    "postgres": "postgresql",
    "postgresql database": "postgresql",
}

METHOD_SEMANTIC = "cosine_embedding"
METHOD_BASELINE = "normalized_skill_overlap_baseline"


def normalize_skill(skill: str) -> str:
    """Normalize whitespace, case, and a small set of known aliases."""
    value = re.sub(r"\s+", " ", skill.strip().lower())
    return ALIASES.get(value, value)


def analyze_skill_match(
    student_skills: Iterable[str],
    required_skills: Iterable[str],
) -> dict:
    """Rule-based baseline: matched skills, gaps, and a transparent percentage.

    Score = matched required skills / total required skills * 100.
    Duplicate names are ignored after normalization. Not a trained ML prediction.
    """
    student_map = {
        normalize_skill(skill): skill.strip() for skill in student_skills if skill.strip()
    }
    required_map = {
        normalize_skill(skill): skill.strip() for skill in required_skills if skill.strip()
    }

    student_keys = set(student_map)
    required_keys = set(required_map)
    matched_keys = student_keys & required_keys
    missing_keys = required_keys - student_keys

    score = round((len(matched_keys) / len(required_keys)) * 100) if required_keys else 0

    return {
        "match_percentage": score,
        "matched_skills": sorted(required_map[key] for key in matched_keys),
        "missing_skills": sorted(required_map[key] for key in missing_keys),
        "matched_count": len(matched_keys),
        "required_count": len(required_keys),
        "method": METHOD_BASELINE,
        "note": "Baseline rule-based score; not a trained ML prediction.",
    }


async def compare_skills(
    student_skills: Iterable[str],
    required_skills: Iterable[str],
) -> dict:
    """Semantic comparison of skill names via sentence embeddings.

    Each required skill matches the closest student skill; similarity >=
    settings.skill_match_threshold counts as matched. Aliases are normalized
    before embedding (ML -> machine learning). Falls back to the rule-based
    baseline when the embedding model is unavailable.
    """
    required = [skill.strip() for skill in required_skills if skill.strip()]
    student = [skill.strip() for skill in student_skills if skill.strip()]
    if not required:
        return {
            "match_percentage": 0,
            "matched_skills": [],
            "missing_skills": [],
            "method": METHOD_SEMANTIC,
        }

    threshold = get_settings().skill_match_threshold

    try:
        required_embeddings = await embed_texts([normalize_skill(skill) for skill in required])
        student_embeddings = (
            await embed_texts([normalize_skill(skill) for skill in student]) if student else []
        )
    except EmbedderUnavailable:
        return analyze_skill_match(student, required)

    student_matrix = np.array(student_embeddings) if student_embeddings else None

    matched: list[dict] = []
    missing: list[str] = []
    for index, skill in enumerate(required):
        if student_matrix is not None:
            best_score = float((student_matrix @ np.array(required_embeddings[index])).max())
        else:
            best_score = 0.0

        if best_score >= threshold:
            matched.append({"skill": skill, "similarity": round(best_score, 3)})
        else:
            missing.append(skill)

    return {
        "match_percentage": round(len(matched) / len(required) * 100),
        "matched_skills": matched,
        "missing_skills": missing,
        "method": METHOD_SEMANTIC,
    }
