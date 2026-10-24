from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import Job, JobStatus
from app.models.user import User
from app.schemas.recruiter import (
    RecentCandidateItem,
    RecentJobItem,
    RecruiterStat,
    SkillDistributionItem,
    StatTrend,
)

RECENT_JOBS_LIMIT = 5

_STAT_CARDS = [
    ("total-candidates", "Total Candidates", "candidates", "blue", "+0", "vs last month"),
    ("new-applications", "New Applications", "applications", "emerald", "+0", "new this week"),
    ("active-jobs", "Active Job Posts", "jobs", "purple", "0 roles", "closing soon"),
    ("top-matches", "Top Matches", "matches", "rose", "0%", "skill alignment"),
]


async def dashboard_stats(db: AsyncSession, recruiter: User) -> list[RecruiterStat]:
    active_jobs = await db.scalar(
        select(func.count())
        .select_from(Job)
        .where(Job.recruiter_id == recruiter.id, Job.status == JobStatus.active)
    )
    cards: list[RecruiterStat] = []
    for card_id, title, icon, tone, trend_value, trend_label in _STAT_CARDS:
        if card_id == "active-jobs":
            value = str(active_jobs)
            trend_value = f"{active_jobs} roles"
        else:
            value = "0"
        cards.append(
            RecruiterStat(
                id=card_id,
                title=title,
                value=value,
                icon=icon,
                tone=tone,
                trend=StatTrend(value=trend_value, label=trend_label, isPositive=None),
            )
        )
    return cards


async def recent_jobs(db: AsyncSession, recruiter: User) -> list[RecentJobItem]:
    jobs = list(
        await db.scalars(
            select(Job)
            .where(Job.recruiter_id == recruiter.id)
            .order_by(Job.created_at.desc())
            .limit(RECENT_JOBS_LIMIT)
        )
    )
    return [
        RecentJobItem(
            id=str(job.id),
            title=job.title,
            department=job.company_name,
            employmentType=f"{job.job_type.value} • {job.work_mode.value}",
            applicationsCount=0,
            newApplications=0,
            status=job.status.value.capitalize(),
            postedDate=job.created_at.strftime("%b %d, %Y"),
        )
        for job in jobs
    ]


async def recent_candidates(db: AsyncSession, recruiter: User) -> list[RecentCandidateItem]:
    """No candidate concept exists until P3 — always empty for now."""
    return []


async def skill_distribution(db: AsyncSession, recruiter: User) -> list[SkillDistributionItem]:
    """Skill distribution needs candidates (P3) — always empty for now."""
    return []
