import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.opportunity import Opportunity, OpportunityApplication
from app.models.user import RoleEnum, User
from app.schemas.opportunities import (
    OpportunityApplicationOut,
    OpportunityApplyRequest,
    OpportunityCreate,
    OpportunityOut,
)
from app.services import opportunities as opportunity_service

router = APIRouter(prefix="/opportunities", tags=["opportunities"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
AnyUser = Annotated[User, Depends(get_current_user)]
PosterUser = Annotated[User, Depends(require_roles(RoleEnum.faculty, RoleEnum.recruiter))]
FacultyUser = Annotated[User, Depends(require_roles(RoleEnum.faculty))]


def _to_out(opportunity: Opportunity) -> OpportunityOut:
    return OpportunityOut(
        id=opportunity.id,
        title=opportunity.title,
        type=opportunity.type,
        description=opportunity.description,
        organization=opportunity.organization,
        location=opportunity.location,
        status=opportunity.status,
        created_at=opportunity.created_at,
    )


def _application_to_out(application: OpportunityApplication) -> OpportunityApplicationOut:
    return OpportunityApplicationOut(
        id=application.id,
        opportunity=_to_out(application.opportunity),
        status=application.status,
        note=application.note,
        applied_date=application.created_at.strftime("%b %d, %Y"),
        created_at=application.created_at,
    )


@router.get("", response_model=list[OpportunityOut])
async def list_opportunities(
    db: DbSession,
    current_user: AnyUser,
    type: Annotated[str | None, Query(max_length=30)] = None,
    q: Annotated[str | None, Query(max_length=200)] = None,
) -> list[OpportunityOut]:
    opportunities = await opportunity_service.list_opportunities(db, type, q)
    return [_to_out(opportunity) for opportunity in opportunities]


@router.post("", response_model=OpportunityOut, status_code=status.HTTP_201_CREATED)
async def create_opportunity(
    data: OpportunityCreate, db: DbSession, current_user: PosterUser
) -> OpportunityOut:
    opportunity = await opportunity_service.create_opportunity(db, current_user, data)
    return _to_out(opportunity)


@router.get("/applications", response_model=list[OpportunityApplicationOut])
async def list_my_opportunity_applications(
    db: DbSession, current_user: FacultyUser
) -> list[OpportunityApplicationOut]:
    applications = await opportunity_service.list_my_applications(db, current_user)
    return [_application_to_out(application) for application in applications]


@router.post(
    "/{opportunity_id}/apply",
    response_model=OpportunityApplicationOut,
    status_code=status.HTTP_201_CREATED,
)
async def apply_to_opportunity(
    opportunity_id: uuid.UUID,
    data: OpportunityApplyRequest,
    db: DbSession,
    current_user: FacultyUser,
) -> OpportunityApplicationOut:
    application = await opportunity_service.apply_to_opportunity(
        db, current_user, opportunity_id, data.note
    )
    return _application_to_out(application)
