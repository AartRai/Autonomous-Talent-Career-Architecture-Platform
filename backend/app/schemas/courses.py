import uuid

from pydantic import BaseModel


class RecommendedCourse(BaseModel):
    id: uuid.UUID
    title: str
    provider: str
    url: str
    description: str | None
    rating: float | None
    duration: str | None
    level: str | None
    skills: list[str]
    matched_skills: list[str]


class CourseRecommendationsResponse(BaseModel):
    missing_skills: list[str]
    courses: list[RecommendedCourse]
