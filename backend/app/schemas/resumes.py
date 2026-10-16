import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResumeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    original_filename: str
    content_type: str
    file_size: int
    created_at: datetime


class ParsedSkillOut(BaseModel):
    id: uuid.UUID
    name: str
    display_name: str
    count: int


class ResumeParseResponse(BaseModel):
    resume_id: uuid.UUID
    skills: list[ParsedSkillOut]
