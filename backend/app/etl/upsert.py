import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.etl.normalize import normalize_course, normalize_job
from app.etl.skills_from_text import extract_skill_names
from app.models.course import Course
from app.models.job import Job, JobSource
from app.models.skill import SkillSource
from app.services import skills as skill_service
from app.services.jobs import embed_job

logger = logging.getLogger(__name__)


async def upsert_job(db: AsyncSession, raw: dict, collector_name: str) -> tuple[str, bool]:
    """Insert or update a scraped job (deduped by source_url). Returns (url, created)."""
    data = normalize_job(raw)
    source_url = data.pop("source_url")
    skill_text = data.pop("skill_text")

    job = None
    if source_url:
        job = await db.scalar(select(Job).where(Job.source_url == source_url))
    created = job is None
    if job is None:
        job = Job(
            recruiter_id=None, source=JobSource.scraped, source_url=source_url, **data
        )
        job.required_skills = await skill_service.get_or_create_skills(
            db, await extract_skill_names(db, skill_text), SkillSource.user
        )
        db.add(job)
    else:
        for key, value in data.items():
            setattr(job, key, value)
        job.required_skills = await skill_service.get_or_create_skills(
            db, await extract_skill_names(db, skill_text), SkillSource.user
        )
    await embed_job(job)
    await db.commit()
    logger.info("Upserted %s job %s (created=%s)", collector_name, job.title, created)
    return source_url or "", created


async def upsert_course(db: AsyncSession, raw: dict, provider: str) -> tuple[str, bool]:
    """Insert or update a course (deduped by url). Returns (url, created)."""
    data = normalize_course(raw, provider)
    url = data.pop("url")
    skill_text = data.pop("skill_text")

    course = await db.scalar(select(Course).where(Course.url == url))
    created = course is None
    if course is None:
        course = Course(**data, url=url)
        course.skills = await skill_service.get_or_create_skills(
            db, await extract_skill_names(db, skill_text), SkillSource.user
        )
        db.add(course)
    else:
        for key, value in data.items():
            setattr(course, key, value)
        course.skills = await skill_service.get_or_create_skills(
            db, await extract_skill_names(db, skill_text), SkillSource.user
        )
    await db.commit()
    logger.info("Upserted %s course %s (created=%s)", provider, course.title, created)
    return url, created
