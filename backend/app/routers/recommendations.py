from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_roles
from app.db.session import get_db
from app.models.user import RoleEnum, User
from app.schemas.courses import CourseRecommendationsResponse
from app.services import recommendations as recommendations_service
from app.services.recommendations import DEFAULT_LIMIT

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
StudentUser = Annotated[User, Depends(require_roles(RoleEnum.student))]


@router.get("/courses", response_model=CourseRecommendationsResponse)
async def course_recommendations(
    db: DbSession,
    current_user: StudentUser,
    limit: Annotated[int, Query(ge=1, le=50)] = DEFAULT_LIMIT,
) -> CourseRecommendationsResponse:
    return await recommendations_service.get_course_recommendations(db, current_user, limit)
