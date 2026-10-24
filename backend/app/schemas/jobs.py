import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.job import ExperienceLevel, JobStatus, JobType, WorkMode
from app.schemas.skills import SkillOut, clean_skill_names

MAX_SKILLS_PER_JOB = 50


class JobCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    company_name: str = Field(min_length=1, max_length=150)
    location: str = Field(min_length=1, max_length=150)
    work_mode: WorkMode
    job_type: JobType
    experience_level: ExperienceLevel
    salary_range: str | None = Field(default=None, max_length=100)
    openings_count: int = Field(ge=1, le=1000)
    description: str = Field(min_length=1, max_length=20000)
    responsibilities: str = Field(min_length=1, max_length=20000)
    qualifications: str = Field(min_length=1, max_length=20000)
    required_skills: list[str] = Field(min_length=1, max_length=MAX_SKILLS_PER_JOB)
    preferred_skills: list[str] = Field(default_factory=list, max_length=MAX_SKILLS_PER_JOB)

    @field_validator("title", "company_name", "location")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()

    @field_validator("required_skills", "preferred_skills")
    @classmethod
    def clean_skills(cls, values: list[str]) -> list[str]:
        return clean_skill_names(values)


class JobOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    company_name: str
    location: str
    work_mode: WorkMode
    job_type: JobType
    experience_level: ExperienceLevel
    salary_range: str | None
    openings_count: int
    description: str
    responsibilities: str
    qualifications: str
    status: JobStatus
    required_skills: list[SkillOut]
    preferred_skills: list[SkillOut]
    created_at: datetime
    updated_at: datetime
