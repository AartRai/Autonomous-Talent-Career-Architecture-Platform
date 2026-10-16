from typing import Annotated, Any

from fastapi import APIRouter, Body, Depends
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_roles
from app.db.session import get_db
from app.models.profile import Profile
from app.models.user import RoleEnum, User
from app.schemas.profiles import (
    FacultyProfileIn,
    ProfileOut,
    ProfileSkillsIn,
    RecruiterProfileIn,
    StudentProfileIn,
)
from app.schemas.skills import SkillOut
from app.services import profiles as profile_service

router = APIRouter(prefix="/profiles", tags=["profiles"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
ProfileUser = Annotated[
    User,
    Depends(require_roles(RoleEnum.student, RoleEnum.faculty, RoleEnum.recruiter)),
]
SkillsUser = Annotated[User, Depends(require_roles(RoleEnum.student, RoleEnum.faculty))]

_SCHEMA_BY_ROLE = {
    RoleEnum.student: StudentProfileIn,
    RoleEnum.faculty: FacultyProfileIn,
    RoleEnum.recruiter: RecruiterProfileIn,
}


def _to_out(profile: Profile, role: RoleEnum) -> ProfileOut:
    return ProfileOut(
        role=role,
        headline=profile.headline,
        bio=profile.bio,
        education_institution=profile.education_institution,
        education_degree=profile.education_degree,
        graduation_year=profile.graduation_year,
        target_role=profile.target_role,
        department=profile.department,
        designation=profile.designation,
        institution=profile.institution,
        company_name=profile.company_name,
        job_title=profile.job_title,
        skills=[SkillOut.model_validate(skill) for skill in profile.skills],
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )


@router.get("/me", response_model=ProfileOut)
async def get_my_profile(db: DbSession, current_user: ProfileUser) -> ProfileOut:
    profile = await profile_service.get_or_create_profile(db, current_user)
    return _to_out(profile, current_user.role)


@router.put("/me", response_model=ProfileOut)
async def update_my_profile(
    payload: Annotated[dict[str, Any], Body()],
    db: DbSession,
    current_user: ProfileUser,
) -> ProfileOut:
    schema = _SCHEMA_BY_ROLE[current_user.role]
    try:
        data = schema.model_validate(payload)
    except ValidationError as exc:
        raise RequestValidationError(exc.errors()) from exc

    profile = await profile_service.get_or_create_profile(db, current_user)
    values = {
        key: value
        for key, value in data.model_dump().items()
        if key in data.model_fields_set
    }
    profile = await profile_service.update_profile(db, profile, values)
    return _to_out(profile, current_user.role)


@router.put("/me/skills", response_model=ProfileOut)
async def replace_my_skills(
    data: ProfileSkillsIn, db: DbSession, current_user: SkillsUser
) -> ProfileOut:
    profile = await profile_service.get_or_create_profile(db, current_user)
    profile = await profile_service.replace_profile_skills(db, profile, data.skills)
    return _to_out(profile, current_user.role)
