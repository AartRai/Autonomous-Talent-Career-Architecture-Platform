import zipfile
from io import BytesIO

from docx import Document
from fastapi import HTTPException, status
from pypdf import PdfReader
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ml.ner import SkillMatcher, SpacyModelUnavailable, get_nlp
from app.models.skill import Skill, SkillSource

MAX_PDF_PAGES = 50
MAX_EXTRACTED_CHARS = 200_000
MAX_DOCX_UNCOMPRESSED_BYTES = 20 * 1024 * 1024

PDF_SIGNATURE = b"%PDF-"
ZIP_SIGNATURE = b"PK\x03\x04"

UNSUPPORTED_TYPE_DETAIL = "Unsupported file type. Allowed: PDF, DOCX, TXT"


def detect_type(content: bytes) -> tuple[str, str, str]:
    """Return (kind, extension, content_type), or raise 415 on unknown bytes."""
    if content.startswith(PDF_SIGNATURE):
        return "pdf", "pdf", "application/pdf"
    if content.startswith(ZIP_SIGNATURE):
        return "docx", "docx", (
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    try:
        content.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=UNSUPPORTED_TYPE_DETAIL,
        ) from exc
    return "txt", "txt", "text/plain"


def extract_text(content: bytes, kind: str) -> str:
    if kind == "pdf":
        return _extract_pdf_text(content)
    if kind == "docx":
        return _extract_docx_text(content)
    return content.decode("utf-8")[:MAX_EXTRACTED_CHARS]


async def parse_skills(db: AsyncSession, text: str) -> dict[str, int]:
    try:
        nlp = get_nlp()
    except SpacyModelUnavailable as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
        ) from exc

    seed_names = list(
        await db.scalars(select(Skill.name).where(Skill.source == SkillSource.seed))
    )
    matcher = SkillMatcher(nlp, seed_names)
    return matcher.extract(text[:MAX_EXTRACTED_CHARS])


def _extract_pdf_text(content: bytes) -> str:
    try:
        reader = PdfReader(BytesIO(content))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail="Could not read PDF file"
        ) from exc

    if len(reader.pages) > MAX_PDF_PAGES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"PDF exceeds the {MAX_PDF_PAGES}-page limit",
        )

    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    if not text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="No extractable text found in PDF (scanned image PDFs are not supported yet)",
        )
    return text[:MAX_EXTRACTED_CHARS]


def _extract_docx_text(content: bytes) -> str:
    _check_docx_zip_sizes(content)
    try:
        document = Document(BytesIO(content))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail="Could not read DOCX file"
        ) from exc

    text = "\n".join(paragraph.text for paragraph in document.paragraphs)
    return text[:MAX_EXTRACTED_CHARS]


def _check_docx_zip_sizes(content: bytes) -> None:
    try:
        with zipfile.ZipFile(BytesIO(content)) as archive:
            total_uncompressed = sum(info.file_size for info in archive.infolist())
    except zipfile.BadZipFile as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail="Could not read DOCX file"
        ) from exc

    if total_uncompressed > MAX_DOCX_UNCOMPRESSED_BYTES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail="DOCX content is too large"
        )
