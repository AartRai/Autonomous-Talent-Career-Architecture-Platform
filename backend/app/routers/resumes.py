import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.deps import require_roles
from app.db.session import get_db
from app.models.user import RoleEnum, User
from app.schemas.resumes import ParsedSkillOut, ResumeOut, ResumeParseResponse
from app.services import resume_parser
from app.services import resumes as resume_service
from app.services import skills as skill_service

router = APIRouter(prefix="/resumes", tags=["resumes"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
StudentUser = Annotated[User, Depends(require_roles(RoleEnum.student))]


@router.post("", response_model=ResumeOut, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile, db: DbSession, current_user: StudentUser
) -> ResumeOut:
    settings = get_settings()
    max_bytes = settings.max_resume_upload_mb * 1024 * 1024
    content = await file.read(max_bytes + 1)
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"File exceeds the {settings.max_resume_upload_mb} MB limit",
        )

    resume = await resume_service.save_resume(
        db, current_user, file.filename or "resume", content
    )
    return ResumeOut.model_validate(resume)


@router.get("/me", response_model=list[ResumeOut])
async def list_my_resumes(db: DbSession, current_user: StudentUser) -> list[ResumeOut]:
    resumes = await resume_service.list_own_resumes(db, current_user)
    return [ResumeOut.model_validate(resume) for resume in resumes]


@router.post("/{resume_id}/parse", response_model=ResumeParseResponse)
async def parse_resume(
    resume_id: uuid.UUID, db: DbSession, current_user: StudentUser
) -> ResumeParseResponse:
    resume = await resume_service.get_own_resume(db, current_user, resume_id)
    if not resume.extracted_text:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="No text was extracted from this resume",
        )

    counts = await resume_parser.parse_skills(db, resume.extracted_text)
    skills_by_name = await skill_service.skills_by_names(db, list(counts))
    parsed = [
        ParsedSkillOut(
            id=skill.id,
            name=skill.name,
            display_name=skill.display_name,
            count=counts[skill.name],
        )
        for skill in skills_by_name.values()
    ]
    parsed.sort(key=lambda item: (-item.count, item.name))
    return ResumeParseResponse(resume_id=resume.id, skills=parsed)
