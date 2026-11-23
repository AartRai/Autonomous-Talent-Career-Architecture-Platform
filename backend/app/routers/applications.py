import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_roles
from app.db.session import get_db
from app.models.user import RoleEnum, User
from app.schemas.applications import (
    ApplicationStatusUpdate,
    ApplyRequest,
    JobSummaryOut,
    RecruiterApplicationOut,
    StudentApplicationOut,
)
from app.services import applications as application_service

router = APIRouter(tags=["applications"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
StudentUser = Annotated[User, Depends(require_roles(RoleEnum.student))]
RecruiterUser = Annotated[User, Depends(require_roles(RoleEnum.recruiter))]


def _to_student_out(application) -> StudentApplicationOut:
    job = application.job
    return StudentApplicationOut(
        id=application.id,
        job=JobSummaryOut(
            id=job.id,
            title=job.title,
            company_name=job.company_name,
            location=job.location,
            employmentType=f"{job.job_type.value} • {job.work_mode.value}",
        ),
        status=application.status,
        coverNote=application.cover_note,
        applicationDate=application.created_at.strftime("%b %d, %Y"),
        created_at=application.created_at,
    )


@router.post(
    "/jobs/{job_id}/apply",
    response_model=StudentApplicationOut,
    status_code=status.HTTP_201_CREATED,
)
async def apply_to_job(
    job_id: uuid.UUID, data: ApplyRequest, db: DbSession, current_user: StudentUser
) -> StudentApplicationOut:
    application = await application_service.apply_to_job(db, current_user, job_id, data.cover_note)
    return _to_student_out(application)


@router.get("/applications", response_model=list[StudentApplicationOut])
async def list_my_applications(
    db: DbSession, current_user: StudentUser
) -> list[StudentApplicationOut]:
    applications = await application_service.list_own_applications(db, current_user)
    return [_to_student_out(application) for application in applications]


@router.get("/recruiter/applications", response_model=list[RecruiterApplicationOut])
async def recruiter_applications(
    db: DbSession, current_user: RecruiterUser
) -> list[RecruiterApplicationOut]:
    return await application_service.recruiter_applications(db, current_user)


@router.patch(
    "/recruiter/applications/{application_id}/status",
    response_model=StudentApplicationOut,
)
async def update_application_status(
    application_id: uuid.UUID,
    data: ApplicationStatusUpdate,
    db: DbSession,
    current_user: RecruiterUser,
) -> StudentApplicationOut:
    application = await application_service.update_application_status(
        db, current_user, application_id, data.status
    )
    return _to_student_out(application)
