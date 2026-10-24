from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import Job, JobStatus
from app.models.skill import SkillSource
from app.models.user import User
from app.schemas.jobs import JobCreate
from app.services import skills as skill_service


async def create_job(db: AsyncSession, recruiter: User, data: JobCreate) -> Job:
    required_skills = await skill_service.get_or_create_skills(
        db, data.required_skills, SkillSource.user
    )
    preferred_skills = await skill_service.get_or_create_skills(
        db, data.preferred_skills, SkillSource.user
    )

    job = Job(
        recruiter_id=recruiter.id,
        title=data.title,
        company_name=data.company_name,
        location=data.location,
        work_mode=data.work_mode,
        job_type=data.job_type,
        experience_level=data.experience_level,
        salary_range=data.salary_range,
        openings_count=data.openings_count,
        description=data.description,
        responsibilities=data.responsibilities,
        qualifications=data.qualifications,
        status=JobStatus.active,
    )
    job.required_skills = required_skills
    job.preferred_skills = preferred_skills
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job
