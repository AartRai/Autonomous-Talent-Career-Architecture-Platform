from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.skill import Skill, SkillSource

MAX_SKILL_NAME_LENGTH = 100
SKILL_SEARCH_LIMIT = 20


def validate_skill_name(value: str) -> str:
    normalized = value.strip().lower()
    if not normalized:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Skill name cannot be empty",
        )
    if len(normalized) > MAX_SKILL_NAME_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Skill name must be at most {MAX_SKILL_NAME_LENGTH} characters",
        )
    return normalized


async def get_or_create_skill(db: AsyncSession, value: str, source: SkillSource) -> Skill:
    normalized = validate_skill_name(value)
    display_name = value.strip()[:MAX_SKILL_NAME_LENGTH] or normalized

    existing = await db.scalar(select(Skill).where(Skill.name == normalized))
    if existing is not None:
        return existing

    skill = Skill(name=normalized, display_name=display_name, source=source)
    db.add(skill)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        existing = await db.scalar(select(Skill).where(Skill.name == normalized))
        if existing is not None:
            return existing
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Skill already exists"
        ) from exc
    await db.refresh(skill)
    return skill


async def get_or_create_skills(
    db: AsyncSession, values: list[str], source: SkillSource
) -> list[Skill]:
    skills: list[Skill] = []
    seen: set[str] = set()
    for value in values:
        normalized = value.strip().lower()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        skills.append(await get_or_create_skill(db, value, source))
    return skills


async def search_skills(db: AsyncSession, query: str) -> list[Skill]:
    pattern = f"%{query.strip().lower()}%"
    result = await db.scalars(
        select(Skill)
        .where(Skill.name.like(pattern))
        .order_by(Skill.name)
        .limit(SKILL_SEARCH_LIMIT)
    )
    return list(result)


async def skills_by_names(db: AsyncSession, names: list[str]) -> dict[str, Skill]:
    if not names:
        return {}
    result = await db.scalars(select(Skill).where(Skill.name.in_(names)))
    return {skill.name: skill for skill in result}
