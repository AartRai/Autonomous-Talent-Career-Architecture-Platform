from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_roles
from app.db.session import get_db
from app.models.user import RoleEnum, User
from app.schemas.matches import MatchesResponse
from app.services import matches as matches_service
from app.services.matches import MATCHES_DEFAULT_LIMIT

router = APIRouter(prefix="/matches", tags=["matches"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
StudentUser = Annotated[User, Depends(require_roles(RoleEnum.student))]


@router.get("", response_model=MatchesResponse)
async def get_matches(
    db: DbSession,
    current_user: StudentUser,
    limit: Annotated[int, Query(ge=1, le=100)] = MATCHES_DEFAULT_LIMIT,
) -> MatchesResponse:
    return await matches_service.get_matches(db, current_user, limit)
