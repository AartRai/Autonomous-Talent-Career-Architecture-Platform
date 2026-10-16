import uuid
from pathlib import Path

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.resume import Resume
from app.models.user import User
from app.services import resume_parser


async def save_resume(
    db: AsyncSession, user: User, original_filename: str, content: bytes
) -> Resume:
    kind, extension, content_type = resume_parser.detect_type(content)
    extracted_text = resume_parser.extract_text(content, kind)

    stored_filename = f"{uuid.uuid4().hex}.{extension}"
    storage_dir = Path(get_settings().resume_storage_dir)
    storage_dir.mkdir(parents=True, exist_ok=True)
    (storage_dir / stored_filename).write_bytes(content)

    resume = Resume(
        user_id=user.id,
        original_filename=original_filename[:255],
        stored_filename=stored_filename,
        content_type=content_type,
        file_size=len(content),
        extracted_text=extracted_text,
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    return resume


async def list_own_resumes(db: AsyncSession, user: User) -> list[Resume]:
    result = await db.scalars(
        select(Resume).where(Resume.user_id == user.id).order_by(Resume.created_at.desc())
    )
    return list(result)


async def get_own_resume(db: AsyncSession, user: User, resume_id: uuid.UUID) -> Resume:
    resume = await db.get(Resume, resume_id)
    if resume is None or resume.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume
