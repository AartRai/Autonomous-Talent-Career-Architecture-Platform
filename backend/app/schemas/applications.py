import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.application import ApplicationStatus


class JobSummaryOut(BaseModel):
    id: uuid.UUID
    title: str
    company_name: str
    location: str
    employmentType: str


class StudentApplicationOut(BaseModel):
    id: uuid.UUID
    job: JobSummaryOut
    status: ApplicationStatus
    coverNote: str | None
    applicationDate: str
    created_at: datetime


class ApplyRequest(BaseModel):
    cover_note: str | None = Field(default=None, max_length=5000)


class RecruiterApplicationOut(BaseModel):
    id: str
    candidateName: str
    initials: str
    email: str
    appliedJob: str
    department: str
    applicationDate: str
    status: str
    education: str
    experience: str
    location: str
    workMode: str
    skills: list[str]
    summary: str
    coverNote: str | None
    tone: str


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
