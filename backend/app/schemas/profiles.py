from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.user import RoleEnum
from app.schemas.skills import SkillOut


class _StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class StudentProfileIn(_StrictModel):
    headline: str | None = Field(default=None, max_length=200)
    bio: str | None = Field(default=None, max_length=5000)
    education_institution: str | None = Field(default=None, max_length=150)
    education_degree: str | None = Field(default=None, max_length=150)
    graduation_year: int | None = Field(default=None, ge=1950, le=2100)
    target_role: str | None = Field(default=None, max_length=150)


class FacultyProfileIn(_StrictModel):
    department: str | None = Field(default=None, max_length=150)
    designation: str | None = Field(default=None, max_length=150)
    institution: str | None = Field(default=None, max_length=150)


class RecruiterProfileIn(_StrictModel):
    company_name: str | None = Field(default=None, max_length=150)
    job_title: str | None = Field(default=None, max_length=150)


class ProfileOut(BaseModel):
    role: RoleEnum
    headline: str | None
    bio: str | None
    education_institution: str | None
    education_degree: str | None
    graduation_year: int | None
    target_role: str | None
    department: str | None
    designation: str | None
    institution: str | None
    company_name: str | None
    job_title: str | None
    skills: list[SkillOut]
    created_at: datetime
    updated_at: datetime


class ProfileSkillsIn(BaseModel):
    skills: list[str] = Field(max_length=50)

    @field_validator("skills")
    @classmethod
    def clean_skills(cls, values: list[str]) -> list[str]:
        cleaned: list[str] = []
        for value in values:
            stripped = value.strip()
            if not stripped:
                raise ValueError("Skill names cannot be empty")
            if len(stripped) > 100:
                raise ValueError("Skill name must be at most 100 characters")
            cleaned.append(stripped)
        return cleaned
