import uuid

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.application import Application, ApplicationStatus
from app.models.job import Job, JobStatus
from app.models.profile import Profile
from app.models.user import User
from app.schemas.applications import RecruiterApplicationOut


def _initials(name: str) -> str:
    parts = name.split()
    return "".join(part[0] for part in parts[:2]).upper()


async def apply_to_job(
    db: AsyncSession, student: User, job_id: uuid.UUID, cover_note: str | None
) -> Application:
    job = await db.get(Job, job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if job.status != JobStatus.active:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="This job is not accepting applications",
        )

    existing = await db.scalar(
        select(Application).where(
            Application.student_id == student.id, Application.job_id == job_id
        )
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already applied to this job",
        )

    application = Application(
        student_id=student.id,
        job_id=job_id,
        cover_note=cover_note,
        status=ApplicationStatus.applied,
    )
    db.add(application)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already applied to this job",
        ) from exc
    await db.refresh(application)
    return application


async def list_own_applications(db: AsyncSession, student: User) -> list[Application]:
    result = await db.scalars(
        select(Application)
        .where(Application.student_id == student.id)
        .order_by(Application.created_at.desc())
    )
    return list(result)


async def recruiter_applications(
    db: AsyncSession, recruiter: User
) -> list[RecruiterApplicationOut]:
    rows = (
        await db.execute(
            select(Application, Job, User, Profile)
            .join(Job, Job.id == Application.job_id)
            .join(User, User.id == Application.student_id)
            .outerjoin(Profile, Profile.user_id == User.id)
            .where(Job.recruiter_id == recruiter.id)
            .order_by(Application.created_at.desc())
        )
    ).all()

    items: list[RecruiterApplicationOut] = []
    for application, job, student, profile in rows:
        skills = [skill.display_name for skill in profile.skills] if profile else []
        items.append(
            RecruiterApplicationOut(
                id=str(application.id),
                candidateName=student.full_name,
                initials=_initials(student.full_name),
                email=student.email,
                appliedJob=job.title,
                department=job.company_name,
                applicationDate=application.created_at.strftime("%b %d, %Y"),
                status=application.status.value,
                education=" ".join(
                    part
                    for part in (
                        profile.education_degree if profile else None,
                        profile.education_institution if profile else None,
                    )
                    if part
                )
                or "—",
                experience="—",
                location=job.location,
                workMode=job.work_mode.value,
                skills=skills,
                summary=(profile.headline or profile.bio) if profile else "—",
                coverNote=application.cover_note,
                tone="blue",
            )
        )
    return items


async def update_application_status(
    db: AsyncSession, recruiter: User, application_id: uuid.UUID, new_status: ApplicationStatus
) -> Application:
    application = await db.scalar(
        select(Application)
        .join(Job, Job.id == Application.job_id)
        .where(Application.id == application_id, Job.recruiter_id == recruiter.id)
    )
    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Application not found"
        )
    application.status = new_status
    await db.commit()
    await db.refresh(application)
    return application
