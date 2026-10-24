from httpx import AsyncClient

JOB_PAYLOAD = {
    "title": "Software Development Engineer Intern",
    "company_name": "Acme Corp",
    "location": "Bengaluru, India",
    "work_mode": "Hybrid",
    "job_type": "Internship",
    "experience_level": "Fresher",
    "salary_range": "₹6–10 LPA",
    "openings_count": 3,
    "description": "Build and ship backend services.",
    "responsibilities": "Own a service end to end.",
    "qualifications": "B.Tech in Computer Science.",
    "required_skills": ["Python", " FastAPI ", "Python"],
    "preferred_skills": ["Docker"],
}


def _auth(body: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {body['access_token']}"}


async def _recruiter(client: AsyncClient, make_user) -> dict:
    return await make_user("jobs-rec@example.com", role="recruiter")


async def test_create_job_success(client: AsyncClient, make_user) -> None:
    recruiter = await _recruiter(client, make_user)

    response = await client.post(
        "/api/v1/recruiter/jobs", headers=_auth(recruiter), json=JOB_PAYLOAD
    )

    assert response.status_code == 201
    body = response.json()
    assert body["title"] == JOB_PAYLOAD["title"]
    assert body["company_name"] == "Acme Corp"
    assert body["work_mode"] == "Hybrid"
    assert body["status"] == "active"
    assert body["openings_count"] == 3

    required_names = [skill["name"] for skill in body["required_skills"]]
    assert required_names == ["fastapi", "python"]
    assert body["required_skills"][1]["display_name"] == "Python"

    preferred_names = [skill["name"] for skill in body["preferred_skills"]]
    assert preferred_names == ["docker"]


async def test_create_job_missing_title(client: AsyncClient, make_user) -> None:
    recruiter = await _recruiter(client, make_user)

    response = await client.post(
        "/api/v1/recruiter/jobs",
        headers=_auth(recruiter),
        json={**JOB_PAYLOAD, "title": ""},
    )

    assert response.status_code == 422


async def test_create_job_invalid_openings(client: AsyncClient, make_user) -> None:
    recruiter = await _recruiter(client, make_user)

    response = await client.post(
        "/api/v1/recruiter/jobs",
        headers=_auth(recruiter),
        json={**JOB_PAYLOAD, "openings_count": 0},
    )

    assert response.status_code == 422


async def test_create_job_invalid_work_mode(client: AsyncClient, make_user) -> None:
    recruiter = await _recruiter(client, make_user)

    response = await client.post(
        "/api/v1/recruiter/jobs",
        headers=_auth(recruiter),
        json={**JOB_PAYLOAD, "work_mode": "From the moon"},
    )

    assert response.status_code == 422


async def test_create_job_requires_skills(client: AsyncClient, make_user) -> None:
    recruiter = await _recruiter(client, make_user)

    response = await client.post(
        "/api/v1/recruiter/jobs",
        headers=_auth(recruiter),
        json={**JOB_PAYLOAD, "required_skills": []},
    )

    assert response.status_code == 422

    response = await client.post(
        "/api/v1/recruiter/jobs",
        headers=_auth(recruiter),
        json={**JOB_PAYLOAD, "required_skills": ["   "]},
    )

    assert response.status_code == 422


async def test_create_job_requires_recruiter_role(client: AsyncClient, make_user) -> None:
    student = await make_user("jobs-stu@example.com", role="student")
    faculty = await make_user("jobs-fac@example.com", role="faculty")

    student_response = await client.post(
        "/api/v1/recruiter/jobs", headers=_auth(student), json=JOB_PAYLOAD
    )
    assert student_response.status_code == 403

    faculty_response = await client.post(
        "/api/v1/recruiter/jobs", headers=_auth(faculty), json=JOB_PAYLOAD
    )
    assert faculty_response.status_code == 403


async def test_create_job_requires_auth(client: AsyncClient) -> None:
    response = await client.post("/api/v1/recruiter/jobs", json=JOB_PAYLOAD)

    assert response.status_code == 401
