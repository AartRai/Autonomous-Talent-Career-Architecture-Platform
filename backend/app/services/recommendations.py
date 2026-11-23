from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ml.skill_match import normalize_skill
from app.models.course import Course
from app.models.user import User
from app.schemas.courses import CourseRecommendationsResponse, RecommendedCourse
from app.services import matches as matches_service
from app.services import profiles as profile_service

TOP_MATCHES_FOR_GAPS = 3
DEFAULT_LIMIT = 10


async def get_course_recommendations(
    db: AsyncSession, user: User, limit: int = DEFAULT_LIMIT
) -> CourseRecommendationsResponse:
    top_matches = await matches_service.get_matches(db, user, TOP_MATCHES_FOR_GAPS)
    missing = {
        normalize_skill(name)
        for match in top_matches.matches
        for name in match.missing_skills
    }

    profile = await profile_service.get_or_create_profile(db, user)
    profile_skill_names = {skill.name for skill in profile.skills}

    courses = list(await db.scalars(select(Course)))
    scored: list[tuple[int, str, Course, list[str]]] = []
    for course in courses:
        course_skill_names = {skill.name for skill in course.skills}
        if missing:
            matched = sorted(missing & course_skill_names)
            if not matched:
                title = course.title.lower()
                matched = sorted(name for name in missing if name in title)
        else:
            matched = sorted(profile_skill_names & course_skill_names)
        if not matched:
            continue
        scored.append((len(matched), course.title.lower(), course, matched))

    scored.sort(key=lambda item: (-item[0], item[1]))
    courses_out = [
        RecommendedCourse(
            id=course.id,
            title=course.title,
            provider=course.provider,
            url=course.url,
            description=course.description,
            rating=None,
            duration=None,
            level=None,
            skills=[skill.display_name for skill in course.skills],
            matched_skills=matched,
        )
        for _, _, course, matched in scored[:limit]
    ]
    return CourseRecommendationsResponse(
        missing_skills=sorted(missing), courses=courses_out
    )
