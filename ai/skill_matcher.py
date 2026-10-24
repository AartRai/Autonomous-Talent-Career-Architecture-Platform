"""Baseline skill matching for Synapse.

This is a transparent rule-based baseline, not a trained ML model.
It can later be replaced or enhanced with semantic embeddings.
"""
from __future__ import annotations

import re
from typing import Iterable

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


def normalize_skill(skill: str) -> str:
    """Normalize whitespace, case, and a small set of known aliases."""
    value = re.sub(r"\s+", " ", skill.strip().lower())
    return ALIASES.get(value, value)


def analyze_skill_match(
    student_skills: Iterable[str],
    required_skills: Iterable[str],
) -> dict:
    """Return matched skills, skill gaps, and a transparent match percentage.

    The score is matched required skills / total required skills * 100.
    Duplicate skill names are ignored after normalization.
    """
    student_map = {normalize_skill(skill): skill.strip() for skill in student_skills if skill.strip()}
    required_map = {normalize_skill(skill): skill.strip() for skill in required_skills if skill.strip()}

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
        "method": "normalized_skill_overlap_baseline",
        "note": "Baseline rule-based score; not a trained ML prediction.",
    }


def json_pretty(data: dict) -> str:
    """Pretty JSON output for the command-line demo."""
    import json
    return json.dumps(data, indent=2)


if __name__ == "__main__":
    student = ["Python", "SQL", "Machine Learning", "JavaScript"]
    job = ["Python", "SQL", "NLP", "ML"]
    print(json_pretty(analyze_skill_match(student, job)))
