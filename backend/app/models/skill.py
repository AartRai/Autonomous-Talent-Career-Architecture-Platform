import uuid
from enum import StrEnum

from sqlalchemy import Enum as SaEnum
from sqlalchemy import String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SkillSource(StrEnum):
    seed = "seed"
    user = "user"


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    source: Mapped[SkillSource] = mapped_column(
        SaEnum(SkillSource, native_enum=False, length=8),
        nullable=False,
        server_default="seed",
        default=SkillSource.seed,
    )
