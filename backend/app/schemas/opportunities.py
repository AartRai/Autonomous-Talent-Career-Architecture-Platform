import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.opportunity import (
    OpportunityApplicationStatus,
    OpportunityStatus,
    OpportunityType,
)


class OpportunityCreate(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    type: OpportunityType
    description: str = Field(min_length=1, max_length=10000)
    organization: str = Field(min_length=1, max_length=200)
    location: str | None = Field(default=None, max_length=150)


class OpportunityOut(BaseModel):
    id: uuid.UUID
    title: str
    type: OpportunityType
    description: str
    organization: str
    location: str | None
    status: OpportunityStatus
    created_at: datetime


class OpportunityApplyRequest(BaseModel):
    note: str | None = Field(default=None, max_length=5000)


class OpportunityApplicationOut(BaseModel):
    id: uuid.UUID
    opportunity: OpportunityOut
    status: OpportunityApplicationStatus
    note: str | None
    applied_date: str
    created_at: datetime
