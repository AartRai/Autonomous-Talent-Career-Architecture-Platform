import uuid

from pydantic import BaseModel, ConfigDict

MAX_SKILL_NAME_LENGTH = 100


def clean_skill_names(values: list[str]) -> list[str]:
    """Strip and validate skill names, raising ValueError on empty/oversized entries."""
    cleaned: list[str] = []
    for value in values:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Skill names cannot be empty")
        if len(stripped) > MAX_SKILL_NAME_LENGTH:
            raise ValueError(f"Skill name must be at most {MAX_SKILL_NAME_LENGTH} characters")
        cleaned.append(stripped)
    return cleaned


class SkillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    display_name: str


class SkillSearchResponse(BaseModel):
    skills: list[SkillOut]
