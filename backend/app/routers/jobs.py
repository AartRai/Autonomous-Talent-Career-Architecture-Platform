from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_roles
from app.db.session import get_db
from app.models.user import RoleEnum, User
from app.schemas.jobs import JobCreate, JobOut
from app.services import jobs as job_service

router = APIRouter(prefix="/recruiter/jobs", tags=["jobs"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
RecruiterUser = Annotated[User, Depends(require_roles(RoleEnum.recruiter))]


@router.post("", response_model=JobOut, status_code=status.HTTP_201_CREATED)
async def create_job(
    data: JobCreate, db: DbSession, current_user: RecruiterUser
) -> JobOut:
    job = await job_service.create_job(db, current_user, data)
    return JobOut.model_validate(job)
