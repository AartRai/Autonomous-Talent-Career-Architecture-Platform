"""Seed demo recruiter, profile, and sample jobs. Idempotent.

Run: python -m scripts.seed_demo
"""
import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import security
from app.db.session import async_session_factory
from app.models.job import ExperienceLevel, Job, JobStatus, JobType, WorkMode
from app.models.profile import Profile
from app.models.skill import SkillSource
from app.models.user import RoleEnum, User
from app.services import jobs as job_service
from app.services import skills as skill_service

DEMO_EMAIL = "demo.recruiter@synapse.dev"
DEMO_PASSWORD = "demo12345"

JOBS = [
    {
        "title": "Software Development Engineer Intern",
        "location": "Bengaluru, India",
        "work_mode": WorkMode.hybrid,
        "job_type": JobType.internship,
        "experience_level": ExperienceLevel.fresher,
        "salary_range": "₹6–10 LPA",
        "openings_count": 3,
        "description": "Build backend services that power the Synapse platform.",
        "responsibilities": "Design and ship APIs, write tests, and take part in code reviews.",
        "qualifications": "Pursuing B.Tech in Computer Science or equivalent.",
        "required_skills": ["Python", "FastAPI", "PostgreSQL"],
        "preferred_skills": ["Docker", "AWS"],
    },
    {
        "title": "Data Analyst",
        "location": "Mumbai, India",
        "work_mode": WorkMode.on_site,
        "job_type": JobType.full_time,
        "experience_level": ExperienceLevel.junior,
        "salary_range": "₹8–12 LPA",
        "openings_count": 2,
        "description": "Turn product and market data into actionable insights.",
        "responsibilities": "Build dashboards, run analyses, and own reporting pipelines.",
        "qualifications": "B.Sc/B.Tech with strong statistics fundamentals.",
        "required_skills": ["SQL", "Excel", "Power BI"],
        "preferred_skills": ["Python", "Tableau"],
    },
    {
        "title": "Frontend Developer",
        "location": "Remote",
        "work_mode": WorkMode.remote,
        "job_type": JobType.full_time,
        "experience_level": ExperienceLevel.mid,
        "salary_range": "₹15–20 LPA",
        "openings_count": 1,
        "description": "Own the Synapse web experience end to end.",
        "responsibilities": "Build accessible React components and optimize performance.",
        "qualifications": "3+ years building production React applications.",
        "required_skills": ["React", "TypeScript", "Tailwind CSS"],
        "preferred_skills": ["Next.js", "GraphQL"],
    },
]


async def seed(session: AsyncSession) -> tuple[bool, int]:
    """Return (created_new_recruiter, embeddings_backfilled)."""
    existing = await session.scalar(select(User).where(User.email == DEMO_EMAIL))
    if existing is None:
        recruiter = User(
            email=DEMO_EMAIL,
            hashed_password=await security.hash_password(DEMO_PASSWORD),
            full_name="Demo Recruiter",
            role=RoleEnum.recruiter,
        )
        session.add(recruiter)
        await session.commit()
        await session.refresh(recruiter)

        session.add(
            Profile(
                user_id=recruiter.id,
                company_name="Synapse Demo Corp",
                job_title="Talent Lead",
            )
        )

        for data in JOBS:
            required_skills = await skill_service.get_or_create_skills(
                session, data["required_skills"], SkillSource.user
            )
            preferred_skills = await skill_service.get_or_create_skills(
                session, data["preferred_skills"], SkillSource.user
            )
            job = Job(
                recruiter_id=recruiter.id,
                title=data["title"],
                company_name="Synapse Demo Corp",
                location=data["location"],
                work_mode=data["work_mode"],
                job_type=data["job_type"],
                experience_level=data["experience_level"],
                salary_range=data["salary_range"],
                openings_count=data["openings_count"],
                description=data["description"],
                responsibilities=data["responsibilities"],
                qualifications=data["qualifications"],
                status=JobStatus.active,
            )
            job.required_skills = required_skills
            job.preferred_skills = preferred_skills
            await job_service.embed_job(job)
            session.add(job)

        await session.commit()
        return True, 0

    return False, await backfill_embeddings(session)


async def backfill_embeddings(session: AsyncSession) -> int:
    jobs = list(
        await session.scalars(
            select(Job).where(Job.company_name == "Synapse Demo Corp", Job.embedding.is_(None))
        )
    )
    for job in jobs:
        await job_service.embed_job(job)
    await session.commit()
    return sum(1 for job in jobs if job.embedding is not None)


async def main() -> None:
    async with async_session_factory() as session:
        created, backfilled = await seed(session)
    if created:
        print(f"Demo recruiter created: {DEMO_EMAIL} / {DEMO_PASSWORD}")
        print(f"Seeded {len(JOBS)} demo jobs.")
    else:
        print("Demo recruiter already exists; nothing to do.")
        if backfilled:
            print(f"Backfilled embeddings for {backfilled} demo jobs.")


if __name__ == "__main__":
    asyncio.run(main())
