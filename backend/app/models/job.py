import uuid
from datetime import datetime
from enum import StrEnum

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    Uuid,
    func,
)
from sqlalchemy import Enum as SaEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.skill import Skill


class WorkMode(StrEnum):
    on_site = "On-site"
    hybrid = "Hybrid"
    remote = "Remote"


class JobType(StrEnum):
    full_time = "Full-time"
    internship = "Internship"
    part_time = "Part-time"
    contract = "Contract"


class ExperienceLevel(StrEnum):
    fresher = "Fresher"
    entry = "0–1 years"
    junior = "1–3 years"
    mid = "3–5 years"
    senior = "5+ years"


class JobStatus(StrEnum):
    draft = "draft"
    active = "active"
    closed = "closed"


def _enum_values(enum_cls: type[StrEnum]) -> list[str]:
    """Persist enum values (e.g. 'Hybrid') instead of member names ('hybrid')."""
    return [member.value for member in enum_cls]


job_required_skills = Table(
    "job_required_skills",
    Base.metadata,
    Column("job_id", ForeignKey("jobs.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)

job_preferred_skills = Table(
    "job_preferred_skills",
    Base.metadata,
    Column("job_id", ForeignKey("jobs.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    recruiter_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    company_name: Mapped[str] = mapped_column(String(150), nullable=False)
    location: Mapped[str] = mapped_column(String(150), nullable=False)
    work_mode: Mapped[WorkMode] = mapped_column(
        SaEnum(WorkMode, native_enum=False, length=16, values_callable=_enum_values),
        nullable=False,
    )
    job_type: Mapped[JobType] = mapped_column(
        SaEnum(JobType, native_enum=False, length=16, values_callable=_enum_values),
        nullable=False,
    )
    experience_level: Mapped[ExperienceLevel] = mapped_column(
        SaEnum(ExperienceLevel, native_enum=False, length=16, values_callable=_enum_values),
        nullable=False,
    )
    salary_range: Mapped[str | None] = mapped_column(String(100))
    openings_count: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    responsibilities: Mapped[str] = mapped_column(Text, nullable=False)
    qualifications: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[JobStatus] = mapped_column(
        SaEnum(JobStatus, native_enum=False, length=16),
        nullable=False,
        server_default=JobStatus.active.value,
        default=JobStatus.active,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    required_skills: Mapped[list[Skill]] = relationship(
        secondary=job_required_skills, lazy="selectin", order_by=Skill.name
    )
    preferred_skills: Mapped[list[Skill]] = relationship(
        secondary=job_preferred_skills, lazy="selectin", order_by=Skill.name
    )
