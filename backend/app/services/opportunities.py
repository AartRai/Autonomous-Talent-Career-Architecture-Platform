import uuid

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.opportunity import (
    Opportunity,
    OpportunityApplication,
    OpportunityApplicationStatus,
    OpportunityType,
)
from app.models.user import User
from app.schemas.opportunities import OpportunityCreate


async def list_opportunities(
    db: AsyncSession, type_filter: str | None, query: str | None
) -> list[Opportunity]:
    statement = select(Opportunity).order_by(Opportunity.created_at.desc())
    if type_filter:
        try:
            statement = statement.where(Opportunity.type == OpportunityType(type_filter))
        except ValueError:
            statement = statement.where(Opportunity.type.is_(None))
    if query:
        pattern = f"%{query.lower()}%"
        statement = statement.where(
            Opportunity.title.ilike(pattern)
            | Opportunity.description.ilike(pattern)
            | Opportunity.organization.ilike(pattern)
        )
    return list(await db.scalars(statement))


async def create_opportunity(
    db: AsyncSession, user: User, data: OpportunityCreate
) -> Opportunity:
    opportunity = Opportunity(
        title=data.title,
        type=data.type,
        description=data.description,
        organization=data.organization,
        location=data.location,
        posted_by_id=user.id,
    )
    db.add(opportunity)
    await db.commit()
    await db.refresh(opportunity)
    return opportunity


async def apply_to_opportunity(
    db: AsyncSession, faculty: User, opportunity_id: uuid.UUID, note: str | None
) -> OpportunityApplication:
    opportunity = await db.get(Opportunity, opportunity_id)
    if opportunity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found"
        )

    existing = await db.scalar(
        select(OpportunityApplication).where(
            OpportunityApplication.opportunity_id == opportunity_id,
            OpportunityApplication.faculty_id == faculty.id,
        )
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already applied to this opportunity",
        )

    application = OpportunityApplication(
        opportunity_id=opportunity_id,
        faculty_id=faculty.id,
        note=note,
        status=OpportunityApplicationStatus.applied,
    )
    db.add(application)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already applied to this opportunity",
        ) from exc
    await db.refresh(application)
    return application


async def list_my_applications(
    db: AsyncSession, faculty: User
) -> list[OpportunityApplication]:
    result = await db.scalars(
        select(OpportunityApplication)
        .where(OpportunityApplication.faculty_id == faculty.id)
        .order_by(OpportunityApplication.created_at.desc())
    )
    return list(result)
