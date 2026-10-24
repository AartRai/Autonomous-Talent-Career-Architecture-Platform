from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_roles
from app.db.session import get_db
from app.models.user import RoleEnum, User
from app.schemas.recruiter import (
    RecentCandidateItem,
    RecentJobItem,
    RecruiterStat,
    SkillDistributionItem,
)
from app.services import recruiter as recruiter_service

router = APIRouter(prefix="/recruiter", tags=["recruiter"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
RecruiterUser = Annotated[User, Depends(require_roles(RoleEnum.recruiter))]


@router.get("/dashboard/stats", response_model=list[RecruiterStat])
async def dashboard_stats(db: DbSession, current_user: RecruiterUser) -> list[RecruiterStat]:
    return await recruiter_service.dashboard_stats(db, current_user)


@router.get("/candidates/recent", response_model=list[RecentCandidateItem])
async def recent_candidates(
    db: DbSession, current_user: RecruiterUser
) -> list[RecentCandidateItem]:
    return await recruiter_service.recent_candidates(db, current_user)


@router.get("/jobs/recent", response_model=list[RecentJobItem])
async def recent_jobs(db: DbSession, current_user: RecruiterUser) -> list[RecentJobItem]:
    return await recruiter_service.recent_jobs(db, current_user)


@router.get("/analytics/skills", response_model=list[SkillDistributionItem])
async def analytics_skills(
    db: DbSession, current_user: RecruiterUser
) -> list[SkillDistributionItem]:
    return await recruiter_service.skill_distribution(db, current_user)
