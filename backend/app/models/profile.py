import uuid
from datetime import datetime

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
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.skill import Skill

profile_skills = Table(
    "profile_skills",
    Base.metadata,
    Column("profile_id", ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )

    headline: Mapped[str | None] = mapped_column(String(200))
    bio: Mapped[str | None] = mapped_column(Text)
    education_institution: Mapped[str | None] = mapped_column(String(150))
    education_degree: Mapped[str | None] = mapped_column(String(150))
    graduation_year: Mapped[int | None] = mapped_column(Integer)
    target_role: Mapped[str | None] = mapped_column(String(150))

    department: Mapped[str | None] = mapped_column(String(150))
    designation: Mapped[str | None] = mapped_column(String(150))
    institution: Mapped[str | None] = mapped_column(String(150))

    company_name: Mapped[str | None] = mapped_column(String(150))
    job_title: Mapped[str | None] = mapped_column(String(150))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    skills: Mapped[list[Skill]] = relationship(
        secondary=profile_skills, lazy="selectin", order_by=Skill.name
    )
