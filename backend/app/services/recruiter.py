import numpy as np
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ml.embedder import EmbedderUnavailable, embed_text
from app.ml.skill_match import analyze_skill_match, normalize_skill
from app.models.job import Job, JobStatus
from app.models.profile import Profile, profile_skills
from app.models.skill import Skill
from app.models.user import RoleEnum, User
from app.schemas.recruiter import (
    RecentCandidateItem,
    RecentJobItem,
    RecruiterStat,
    SkillDistributionItem,
    StatTrend,
    TalentSearchCandidate,
)
from app.services.jobs import job_embedding_text
from app.services.matches import profile_text

RECENT_JOBS_LIMIT = 5
RECENT_CANDIDATES_LIMIT = 5
TALENT_SEARCH_LIMIT = 20
ANALYTICS_SKILLS_LIMIT = 10

_SKILL_TONES = ["blue", "purple", "emerald", "rose", "amber"]

_STAT_CARDS = [
    ("total-candidates", "Total Candidates", "candidates", "blue", "+0", "vs last month"),
    ("new-applications", "New Applications", "applications", "emerald", "+0", "new this week"),
    ("active-jobs", "Active Job Posts", "jobs", "purple", "0 roles", "closing soon"),
    ("top-matches", "Top Matches", "matches", "rose", "0%", "skill alignment"),
]


def _cosine(a: list[float], b: list[float]) -> float:
    a_array = np.array(a)
    b_array = np.array(b)
    denominator = float(np.linalg.norm(a_array) * np.linalg.norm(b_array))
    if denominator == 0:
        return 0.0
    return float(np.dot(a_array, b_array) / denominator)


def _initials(name: str) -> str:
    parts = name.split()
    return "".join(part[0] for part in parts[:2]).upper()


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


async def _student_rows(
    db: AsyncSession, limit: int | None = None
) -> list[tuple[User, Profile]]:
    statement = (
        select(User, Profile)
        .join(Profile, Profile.user_id == User.id)
        .where(User.role == RoleEnum.student)
        .order_by(Profile.created_at.desc())
    )
    if limit is not None:
        statement = statement.limit(limit)
    return list((await db.execute(statement)).all())


async def recent_candidates(db: AsyncSession, recruiter: User) -> list[RecentCandidateItem]:
    rows = await _student_rows(db, limit=RECENT_CANDIDATES_LIMIT)

    latest_job = await db.scalar(
        select(Job)
        .where(Job.recruiter_id == recruiter.id, Job.status == JobStatus.active)
        .order_by(Job.created_at.desc())
        .limit(1)
    )
    job_embedding = None
    if latest_job is not None:
        try:
            job_embedding = await embed_text(job_embedding_text(latest_job))
        except EmbedderUnavailable:
            job_embedding = None

    items: list[RecentCandidateItem] = []
    for user, profile in rows:
        score = 0
        if job_embedding is not None:
            score = round(_cosine(job_embedding, await embed_text(profile_text(profile))) * 100)
        items.append(
            RecentCandidateItem(
                id=str(user.id),
                name=user.full_name,
                initials=_initials(user.full_name),
                role=profile.headline or profile.target_role or "Student",
                experience=" — ".join(
                    part
                    for part in (profile.education_degree, profile.education_institution)
                    if part
                )
                or "—",
                skills=[skill.display_name for skill in profile.skills],
                matchScore=score,
                shortlisted=False,
                tone="blue",
            )
        )
    return items


async def talent_search(
    db: AsyncSession, recruiter: User, query: str, skills_raw: str, limit: int
) -> list[TalentSearchCandidate]:
    skill_names = [
        normalize_skill(skill) for skill in skills_raw.split(",") if skill.strip()
    ]

    rows = await _student_rows(db)
    candidates: list[tuple[User, Profile]] = []
    for user, profile in rows:
        profile_skill_names = {skill.name for skill in profile.skills}
        if skill_names and not set(skill_names) <= profile_skill_names:
            continue
        if query:
            searchable = " ".join(
                part
                for part in (user.full_name, profile.headline, profile.bio, profile.target_role)
                if part
            ).lower()
            if query.lower() not in searchable:
                continue
        candidates.append((user, profile))

    query_text = f"{query} {' '.join(skill_names)}".strip()
    scores: dict[str, int] = {}
    if query_text:
        try:
            query_embedding = await embed_text(query_text)
            for user, profile in candidates:
                profile_embedding = await embed_text(profile_text(profile))
                scores[str(user.id)] = round(_cosine(query_embedding, profile_embedding) * 100)
        except EmbedderUnavailable:
            for user, profile in candidates:
                result = analyze_skill_match(
                    skill_names, [skill.name for skill in profile.skills]
                )
                scores[str(user.id)] = result["match_percentage"]

    candidates.sort(key=lambda pair: scores.get(str(pair[0].id), 0), reverse=True)
    result: list[TalentSearchCandidate] = []
    for user, profile in candidates[:limit]:
        result.append(
            TalentSearchCandidate(
                id=str(user.id),
                name=user.full_name,
                initials=_initials(user.full_name),
                role=profile.headline or profile.target_role or "Student",
                education=" ".join(
                    part
                    for part in (profile.education_degree, profile.education_institution)
                    if part
                )
                or "—",
                educationDegree=profile.education_degree or "—",
                experienceLevel="Not specified",
                experienceYears="—",
                location="Not specified",
                workMode="Not specified",
                skills=[skill.display_name for skill in profile.skills],
                demoMatchScore=scores.get(str(user.id), 0),
                summary=profile.bio or "—",
                tone="blue",
            )
        )
    return result


async def skill_distribution(db: AsyncSession, recruiter: User) -> list[SkillDistributionItem]:
    counts = (
        await db.execute(
            select(Skill, func.count(Profile.id).label("candidate_count"))
            .select_from(Skill)
            .join(profile_skills, profile_skills.c.skill_id == Skill.id)
            .join(Profile, Profile.id == profile_skills.c.profile_id)
            .group_by(Skill.id)
            .order_by(func.count(Profile.id).desc(), Skill.name)
            .limit(ANALYTICS_SKILLS_LIMIT)
        )
    ).all()
    total_students = await db.scalar(
        select(func.count())
        .select_from(Profile)
        .join(User, User.id == Profile.user_id)
        .where(User.role == RoleEnum.student)
    )
    total_students = total_students or 1

    items: list[SkillDistributionItem] = []
    for index, (skill, count) in enumerate(counts):
        items.append(
            SkillDistributionItem(
                id=f"skill-{skill.name}",
                skill=skill.display_name,
                candidateCount=count,
                percentage=round(count / total_students * 100),
                tone=_SKILL_TONES[index % len(_SKILL_TONES)],
            )
        )
    return items
