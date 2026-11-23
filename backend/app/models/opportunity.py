import uuid
from datetime import datetime
from enum import StrEnum

from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint, Uuid, func
from sqlalchemy import Enum as SaEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def _enum_values(enum_cls: type[StrEnum]) -> list[str]:
    return [member.value for member in enum_cls]


class OpportunityType(StrEnum):
    sabbatical = "Sabbatical"
    fdp = "FDP"
    consultancy_rfp = "Consultancy RFP"
    research_project = "Research Project"


class OpportunityStatus(StrEnum):
    open = "open"
    closed = "closed"


class Opportunity(Base):
    __tablename__ = "opportunities"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    type: Mapped[OpportunityType] = mapped_column(
        SaEnum(OpportunityType, native_enum=False, length=20, values_callable=_enum_values),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    organization: Mapped[str] = mapped_column(String(200), nullable=False)
    location: Mapped[str | None] = mapped_column(String(150))
    status: Mapped[OpportunityStatus] = mapped_column(
        SaEnum(OpportunityStatus, native_enum=False, length=8, values_callable=_enum_values),
        nullable=False,
        server_default=OpportunityStatus.open.value,
        default=OpportunityStatus.open,
    )
    posted_by_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class OpportunityApplicationStatus(StrEnum):
    applied = "Applied"
    accepted = "Accepted"
    rejected = "Rejected"


class OpportunityApplication(Base):
    __tablename__ = "opportunity_applications"
    __table_args__ = (
        UniqueConstraint("opportunity_id", "faculty_id", name="uq_opportunity_applications"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    opportunity_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False
    )
    faculty_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    note: Mapped[str | None] = mapped_column(Text)
    status: Mapped[OpportunityApplicationStatus] = mapped_column(
        SaEnum(
            OpportunityApplicationStatus,
            native_enum=False,
            length=12,
            values_callable=_enum_values,
        ),
        nullable=False,
        server_default=OpportunityApplicationStatus.applied.value,
        default=OpportunityApplicationStatus.applied,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    opportunity: Mapped[Opportunity] = relationship(lazy="selectin")
