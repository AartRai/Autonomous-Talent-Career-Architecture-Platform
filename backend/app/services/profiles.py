from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import Profile
from app.models.skill import SkillSource
from app.models.user import User
from app.services import skills as skill_service


async def get_or_create_profile(db: AsyncSession, user: User) -> Profile:
    profile = await db.scalar(select(Profile).where(Profile.user_id == user.id))
    if profile is not None:
        return profile

    profile = Profile(user_id=user.id)
    db.add(profile)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        profile = await db.scalar(select(Profile).where(Profile.user_id == user.id))
        if profile is not None:
            return profile
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Profile already exists"
        ) from exc
    await db.refresh(profile)
    return profile


async def update_profile(db: AsyncSession, profile: Profile, values: dict[str, Any]) -> Profile:
    for key, value in values.items():
        setattr(profile, key, value)
    await db.commit()
    await db.refresh(profile)
    return profile


async def replace_profile_skills(db: AsyncSession, profile: Profile, names: list[str]) -> Profile:
    skills = await skill_service.get_or_create_skills(db, names, SkillSource.user)
    profile.skills = skills
    await db.commit()
    await db.refresh(profile)
    return profile
