from pydantic import BaseModel

from app.schemas.jobs import JobOut


class MatchedSkill(BaseModel):
    skill: str
    similarity: float


class JobMatch(BaseModel):
    job: JobOut
    match_score: int
    method: str
    matched_skills: list[MatchedSkill]
    missing_skills: list[str]


class MatchesResponse(BaseModel):
    matches: list[JobMatch]
