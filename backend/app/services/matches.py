from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ml.embedder import EmbedderUnavailable, embed_text
from app.ml.skill_match import (
    METHOD_BASELINE,
    METHOD_SEMANTIC,
    analyze_skill_match,
    compare_skills,
)
from app.models.job import Job, JobStatus
from app.models.profile import Profile
from app.models.user import User
from app.schemas.jobs import JobOut
from app.schemas.matches import JobMatch, MatchedSkill, MatchesResponse
from app.services import profiles as profile_service

MATCHES_DEFAULT_LIMIT = 20


def profile_text(profile: Profile) -> str:
    """Text used to embed a student profile (documented formula).

    headline + bio + target_role + skill display names.
    """
    parts = [
        profile.headline,
        profile.bio,
        profile.target_role,
        *[skill.display_name for skill in profile.skills],
    ]
    return "\n".join(part for part in parts if part)


def _student_skill_names(profile: Profile) -> list[str]:
    return [skill.display_name for skill in profile.skills]


def _required_skill_names(job: Job) -> list[str]:
    return [skill.display_name for skill in job.required_skills]


async def get_matches(
    db: AsyncSession, user: User, limit: int = MATCHES_DEFAULT_LIMIT
) -> MatchesResponse:
    profile = await profile_service.get_or_create_profile(db, user)
    student_skills = _student_skill_names(profile)

    try:
        profile_embedding = await embed_text(profile_text(profile))
        ranked = await _rank_by_embedding(db, profile_embedding, limit)
    except EmbedderUnavailable:
        ranked = await _rank_by_overlap(db, student_skills, limit)

    matches: list[JobMatch] = []
    for job, score, method in ranked:
        gap = await compare_skills(student_skills, _required_skill_names(job))
        matches.append(
            JobMatch(
                job=JobOut.model_validate(job),
                match_score=score,
                method=method,
                matched_skills=[MatchedSkill(**item) for item in gap["matched_skills"]],
                missing_skills=gap["missing_skills"],
            )
        )

    matches.sort(key=lambda item: item.match_score, reverse=True)
    return MatchesResponse(matches=matches)


async def _rank_by_embedding(
    db: AsyncSession, profile_embedding: list[float], limit: int
) -> list[tuple[Job, int, str]]:
    distance = Job.embedding.cosine_distance(profile_embedding)
    rows = (
        await db.execute(
            select(Job, distance.label("distance"))
            .where(Job.status == JobStatus.active, Job.embedding.is_not(None))
            .order_by(distance)
            .limit(limit)
        )
    ).all()
    return [
        (job, round((1 - float(distance_value)) * 100), METHOD_SEMANTIC)
        for job, distance_value in rows
    ]


async def _rank_by_overlap(
    db: AsyncSession, student_skills: list[str], limit: int
) -> list[tuple[Job, int, str]]:
    jobs = list(await db.scalars(select(Job).where(Job.status == JobStatus.active)))
    scored = [
        (
            job,
            analyze_skill_match(student_skills, _required_skill_names(job))["match_percentage"],
            METHOD_BASELINE,
        )
        for job in jobs
    ]
    scored.sort(key=lambda item: item[1], reverse=True)
    return scored[:limit]
