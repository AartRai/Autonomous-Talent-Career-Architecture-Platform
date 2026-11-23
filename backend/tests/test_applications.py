import uuid

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import Job, JobStatus

JOB_PAYLOAD = {
    "title": "Backend Engineer",
    "company_name": "Acme Corp",
    "location": "Bengaluru, India",
    "work_mode": "Hybrid",
    "job_type": "Full-time",
    "experience_level": "1–3 years",
    "salary_range": "₹10–15 LPA",
    "openings_count": 2,
    "description": "Build backend services.",
    "responsibilities": "Own a service end to end.",
    "qualifications": "B.Tech in Computer Science.",
    "required_skills": ["Python"],
    "preferred_skills": [],
}


def _auth(body: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {body['access_token']}"}


async def _recruiter(client: AsyncClient, make_user, email: str = "app-rec@example.com") -> dict:
    return await make_user(email, role="recruiter")


async def _post_job(client: AsyncClient, headers: dict) -> dict:
    response = await client.post("/api/v1/recruiter/jobs", headers=headers, json=JOB_PAYLOAD)
    assert response.status_code == 201
    return response.json()


async def _apply(client: AsyncClient, student: dict, job_id: str, **extra):
    payload = {"cover_note": "I am excited about this role.", **extra}
    return await client.post(
        f"/api/v1/jobs/{job_id}/apply", headers=_auth(student), json=payload
    )


async def test_apply_success(client: AsyncClient, make_user, fake_embeddings) -> None:
    recruiter = await _recruiter(client, make_user)
    job = await _post_job(client, _auth(recruiter))
    student = await make_user("app-stu@example.com")

    response = await _apply(client, student, job["id"])

    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "Applied"
    assert body["job"]["title"] == "Backend Engineer"
    assert body["job"]["employmentType"] == "Full-time • Hybrid"
    assert body["applicationDate"]  # formatted date
    assert body["coverNote"] == "I am excited about this role."


async def test_apply_duplicate_conflict(client: AsyncClient, make_user, fake_embeddings) -> None:
    recruiter = await _recruiter(client, make_user)
    job = await _post_job(client, _auth(recruiter))
    student = await make_user("app-dup@example.com")

    assert (await _apply(client, student, job["id"])).status_code == 201
    duplicate = await _apply(client, student, job["id"])

    assert duplicate.status_code == 409


async def test_apply_unknown_job_404(client: AsyncClient, make_user) -> None:
    student = await make_user("app-404@example.com")

    response = await _apply(client, student, str(uuid.uuid4()))

    assert response.status_code == 404


async def test_apply_closed_job_422(
    client: AsyncClient, make_user, db_session: AsyncSession, fake_embeddings
) -> None:
    recruiter = await _recruiter(client, make_user)
    job = await _post_job(client, _auth(recruiter))
    db_job = await db_session.get(Job, uuid.UUID(job["id"]))
    db_job.status = JobStatus.closed
    await db_session.commit()

    student = await make_user("app-closed@example.com")
    response = await _apply(client, student, job["id"])

    assert response.status_code == 422


async def test_student_applications_own_only(
    client: AsyncClient, make_user, fake_embeddings
) -> None:
    recruiter = await _recruiter(client, make_user)
    job = await _post_job(client, _auth(recruiter))
    student_a = await make_user("app-own-a@example.com")
    student_b = await make_user("app-own-b@example.com")

    await _apply(client, student_a, job["id"])

    list_a = await client.get("/api/v1/applications", headers=_auth(student_a))
    assert len(list_a.json()) == 1
    assert list_a.json()[0]["job"]["id"] == job["id"]

    list_b = await client.get("/api/v1/applications", headers=_auth(student_b))
    assert list_b.json() == []


async def test_recruiter_applications_shape(
    client: AsyncClient, make_user, fake_embeddings
) -> None:
    recruiter = await _recruiter(client, make_user)
    job = await _post_job(client, _auth(recruiter))
    student = await make_user("app-shape@example.com")
    profile_response = await client.put(
        "/api/v1/profiles/me",
        headers=_auth(student),
        json={"headline": "Backend engineer", "education_degree": "B.Tech"},
    )
    assert profile_response.status_code == 200
    await _apply(client, student, job["id"])

    response = await client.get("/api/v1/recruiter/applications", headers=_auth(recruiter))

    assert response.status_code == 200
    item = response.json()[0]
    assert item["candidateName"] == "Test User"
    assert item["appliedJob"] == "Backend Engineer"
    assert item["department"] == "Acme Corp"
    assert item["status"] == "Applied"
    assert item["education"] == "B.Tech"
    assert item["initials"] == "TU"


async def test_recruiter_updates_status(client: AsyncClient, make_user, fake_embeddings) -> None:
    recruiter = await _recruiter(client, make_user)
    other_recruiter = await _recruiter(client, make_user, email="app-rec2@example.com")
    job = await _post_job(client, _auth(recruiter))
    student = await make_user("app-status@example.com")
    application = (await _apply(client, student, job["id"])).json()

    other_response = await client.patch(
        f"/api/v1/recruiter/applications/{application['id']}/status",
        headers=_auth(other_recruiter),
        json={"status": "Shortlisted"},
    )
    assert other_response.status_code == 404

    update = await client.patch(
        f"/api/v1/recruiter/applications/{application['id']}/status",
        headers=_auth(recruiter),
        json={"status": "Shortlisted"},
    )
    assert update.status_code == 200
    assert update.json()["status"] == "Shortlisted"


async def test_applications_role_guards(client: AsyncClient, make_user, fake_embeddings) -> None:
    recruiter = await _recruiter(client, make_user)
    job = await _post_job(client, _auth(recruiter))
    faculty = await make_user("app-fac@example.com", role="faculty")

    assert (
        await client.post(
            f"/api/v1/jobs/{job['id']}/apply", headers=_auth(faculty), json={}
        )
    ).status_code == 403
    assert (
        await client.get("/api/v1/applications", headers=_auth(recruiter))
    ).status_code == 403
    assert (
        await client.post(f"/api/v1/jobs/{job['id']}/apply", json={})
    ).status_code == 401
    assert (await client.get("/api/v1/recruiter/applications")).status_code == 401
