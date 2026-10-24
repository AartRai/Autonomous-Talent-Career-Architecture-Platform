"""Skill extraction for ETL records, reusing the seed-vocabulary SkillMatcher.

The matcher is cached per process and rebuilt only when the seed skill set
changes, so bulk collection doesn't pay the matcher-construction cost per
record.
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ml.ner import SkillMatcher, get_nlp
from app.models.skill import Skill, SkillSource

MAX_SKILLS_PER_RECORD = 20
MAX_TEXT_CHARS = 200_000

_matcher_cache: tuple[frozenset[str], SkillMatcher] | None = None


async def get_matcher(db: AsyncSession) -> SkillMatcher:
    global _matcher_cache
    seed_names = frozenset(
        await db.scalars(select(Skill.name).where(Skill.source == SkillSource.seed))
    )
    if _matcher_cache is None or _matcher_cache[0] != seed_names:
        _matcher_cache = (seed_names, SkillMatcher(get_nlp(), sorted(seed_names)))
    return _matcher_cache[1]


async def extract_skill_names(db: AsyncSession, text: str) -> list[str]:
    matcher = await get_matcher(db)
    counts = matcher.extract(text[:MAX_TEXT_CHARS])
    return sorted(counts, key=lambda name: -counts[name])[:MAX_SKILLS_PER_RECORD]
