import uuid

from pydantic import BaseModel, ConfigDict


class SkillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    display_name: str


class SkillSearchResponse(BaseModel):
    skills: list[SkillOut]
