from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.skills import SkillOut, SkillSearchResponse
from app.services import skills as skill_service

router = APIRouter(prefix="/skills", tags=["skills"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("", response_model=SkillSearchResponse)
async def search_skills(
    q: Annotated[str, Query(min_length=1, max_length=100)],
    db: DbSession,
    current_user: CurrentUser,
) -> SkillSearchResponse:
    skills = await skill_service.search_skills(db, q)
    return SkillSearchResponse(skills=[SkillOut.model_validate(skill) for skill in skills])
