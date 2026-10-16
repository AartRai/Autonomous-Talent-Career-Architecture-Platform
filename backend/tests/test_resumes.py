import io
import uuid
import zipfile
from pathlib import Path

from docx import Document
from httpx import AsyncClient
from pypdf import PdfWriter
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.resume import Resume

TXT_RESUME = (
    "Aarav Patel\n"
    "Backend developer with Python and FastAPI experience.\n"
    "Skills: Python, machine learning, FastAPI, Docker, CustomStack\n"
)

DOCX_CONTENT_TYPE = (
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)


def _auth(body: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {body['access_token']}"}


async def _upload(client, headers, filename, content, content_type):
    return await client.post(
        "/api/v1/resumes",
        headers=headers,
        files={"file": (filename, content, content_type)},
    )


def build_text_pdf(text: str) -> bytes:
    stream = f"BT /F1 12 Tf 72 720 Td ({text}) Tj ET".encode()
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        (
            b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R "
            b"/Resources << /Font << /F1 5 0 R >> >> >>"
        ),
        b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    out = bytearray(b"%PDF-1.4\n")
    offsets = []
    for index, obj in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f"{index} 0 obj\n".encode() + obj + b"\nendobj\n"
    xref_pos = len(out)
    out += f"xref\n0 {len(objects) + 1}\n".encode()
    out += b"0000000000 65535 f \n"
    for offset in offsets:
        out += f"{offset:010d} 00000 n \n".encode()
    out += (
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
        f"startxref\n{xref_pos}\n%%EOF\n"
    ).encode()
    return bytes(out)


def build_docx(text: str) -> bytes:
    buffer = io.BytesIO()
    document = Document()
    for line in text.splitlines():
        document.add_paragraph(line)
    document.save(buffer)
    return buffer.getvalue()


def build_zip_bomb(uncompressed_size: int) -> bytes:
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("word/document.xml", b"A" * uncompressed_size)
    return buffer.getvalue()


async def test_upload_txt_success(client: AsyncClient, make_user, db_session: AsyncSession) -> None:
    student = await make_user("up-txt@example.com")

    response = await _upload(
        client, _auth(student), "resume.txt", TXT_RESUME.encode(), "text/plain"
    )

    assert response.status_code == 201
    body = response.json()
    assert body["original_filename"] == "resume.txt"
    assert body["content_type"] == "text/plain"

    resume = await db_session.get(Resume, uuid.UUID(body["id"]))
    assert "FastAPI" in resume.extracted_text
    stored_path = Path(get_settings().resume_storage_dir) / resume.stored_filename
    assert stored_path.exists()


async def test_upload_docx_success(
    client: AsyncClient, make_user, db_session: AsyncSession
) -> None:
    student = await make_user("up-docx@example.com")

    response = await _upload(
        client,
        _auth(student),
        "resume.docx",
        build_docx("Aarav Patel\nSkills: Python and Docker"),
        DOCX_CONTENT_TYPE,
    )

    assert response.status_code == 201
    resume = await db_session.get(Resume, uuid.UUID(response.json()["id"]))
    assert "Python" in resume.extracted_text


async def test_upload_pdf_with_text_success(
    client: AsyncClient, make_user, db_session: AsyncSession
) -> None:
    student = await make_user("up-pdf@example.com")

    response = await _upload(
        client,
        _auth(student),
        "resume.pdf",
        build_text_pdf("Skills: Python and Docker"),
        "application/pdf",
    )

    assert response.status_code == 201
    resume = await db_session.get(Resume, uuid.UUID(response.json()["id"]))
    assert "Python" in resume.extracted_text


async def test_upload_rejects_spoofed_extension(client: AsyncClient, make_user) -> None:
    student = await make_user("spoof@example.com")
    png_bytes = b"\x89PNG\r\n\x1a\n" + b"\x00" * 64

    response = await _upload(
        client, _auth(student), "fake.pdf", png_bytes, "application/pdf"
    )

    assert response.status_code == 415


async def test_upload_rejects_binary_txt(client: AsyncClient, make_user) -> None:
    student = await make_user("bin@example.com")

    response = await _upload(
        client, _auth(student), "junk.txt", b"\x00\x01\x02\xff\xfe" * 10, "text/plain"
    )

    assert response.status_code == 415


async def test_upload_rejects_oversized_file(client: AsyncClient, make_user) -> None:
    student = await make_user("big@example.com")

    response = await _upload(
        client,
        _auth(student),
        "big.txt",
        b"A" * (5 * 1024 * 1024 + 1),
        "text/plain",
    )

    assert response.status_code == 413


async def test_upload_rejects_too_many_pdf_pages(client: AsyncClient, make_user) -> None:
    student = await make_user("pages@example.com")
    writer = PdfWriter()
    for _ in range(51):
        writer.add_blank_page(width=612, height=792)
    buffer = io.BytesIO()
    writer.write(buffer)

    response = await _upload(
        client, _auth(student), "long.pdf", buffer.getvalue(), "application/pdf"
    )

    assert response.status_code == 422
    assert "50-page" in response.json()["detail"]


async def test_upload_rejects_blank_pdf(client: AsyncClient, make_user) -> None:
    student = await make_user("blank@example.com")
    writer = PdfWriter()
    writer.add_blank_page(width=612, height=792)
    buffer = io.BytesIO()
    writer.write(buffer)

    response = await _upload(
        client, _auth(student), "blank.pdf", buffer.getvalue(), "application/pdf"
    )

    assert response.status_code == 422
    assert "No extractable text" in response.json()["detail"]


async def test_upload_rejects_docx_zip_bomb(client: AsyncClient, make_user) -> None:
    student = await make_user("bomb@example.com")

    response = await _upload(
        client,
        _auth(student),
        "bomb.docx",
        build_zip_bomb(21 * 1024 * 1024),
        DOCX_CONTENT_TYPE,
    )

    assert response.status_code == 422
    assert "too large" in response.json()["detail"]


async def test_upload_requires_student_role(client: AsyncClient, make_user) -> None:
    recruiter = await make_user("rec-up@example.com", role="recruiter")

    response = await _upload(
        client, _auth(recruiter), "r.txt", b"hello", "text/plain"
    )

    assert response.status_code == 403


async def test_list_own_resumes_metadata_only(client: AsyncClient, make_user) -> None:
    student_a = await make_user("own-a@example.com")
    student_b = await make_user("own-b@example.com")

    await _upload(client, _auth(student_a), "a.txt", TXT_RESUME.encode(), "text/plain")

    response_a = await client.get("/api/v1/resumes/me", headers=_auth(student_a))
    assert response_a.status_code == 200
    items = response_a.json()
    assert len(items) == 1
    assert items[0]["original_filename"] == "a.txt"
    assert "extracted_text" not in items[0]

    response_b = await client.get("/api/v1/resumes/me", headers=_auth(student_b))
    assert response_b.json() == []


async def test_parse_returns_suggestions_only(
    client: AsyncClient, make_user, seed_skills
) -> None:
    student = await make_user("parse@example.com")
    headers = _auth(student)

    upload = await _upload(
        client, headers, "resume.txt", TXT_RESUME.encode(), "text/plain"
    )
    resume_id = upload.json()["id"]

    response = await client.post(f"/api/v1/resumes/{resume_id}/parse", headers=headers)

    assert response.status_code == 200
    body = response.json()
    assert body["resume_id"] == resume_id
    names = {skill["name"] for skill in body["skills"]}
    assert {"python", "machine learning", "fastapi", "docker"} <= names
    assert "customstack" not in names

    profile = await client.get("/api/v1/profiles/me", headers=headers)
    assert profile.json()["skills"] == []


async def test_parse_someone_elses_resume_returns_404(client: AsyncClient, make_user) -> None:
    student_a = await make_user("parse-a@example.com")
    student_b = await make_user("parse-b@example.com")

    upload = await _upload(
        client, _auth(student_a), "a.txt", TXT_RESUME.encode(), "text/plain"
    )

    response = await client.post(
        f"/api/v1/resumes/{upload.json()['id']}/parse", headers=_auth(student_b)
    )

    assert response.status_code == 404


async def test_parse_requires_auth(client: AsyncClient, make_user) -> None:
    student = await make_user("parse-u@example.com")
    upload = await _upload(
        client, _auth(student), "a.txt", TXT_RESUME.encode(), "text/plain"
    )

    response = await client.post(f"/api/v1/resumes/{upload.json()['id']}/parse")

    assert response.status_code == 401
