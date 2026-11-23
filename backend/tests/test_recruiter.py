import re

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
    "required_skills": ["Python", "FastAPI"],
    "preferred_skills": ["Docker"],
}


def _auth(body: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {body['access_token']}"}


async def _recruiter(client: AsyncClient, make_user, email: str = "dash-rec@example.com") -> dict:
    return await make_user(email, role="recruiter")


async def _post_job(client: AsyncClient, headers: dict, overrides: dict | None = None) -> dict:
    payload = {**JOB_PAYLOAD, **(overrides or {})}
    response = await client.post("/api/v1/recruiter/jobs", headers=headers, json=payload)
    assert response.status_code == 201
    return response.json()


async def test_stats_zero_state(client: AsyncClient, make_user) -> None:
    recruiter = await _recruiter(client, make_user)

    response = await client.get(
        "/api/v1/recruiter/dashboard/stats", headers=_auth(recruiter)
    )

    assert response.status_code == 200
    cards = {card["id"]: card for card in response.json()}
    assert set(cards) == {"total-candidates", "new-applications", "active-jobs", "top-matches"}
    assert cards["active-jobs"]["value"] == "0"
    assert cards["total-candidates"]["value"] == "0"
    assert cards["top-matches"]["value"] == "0"
    assert cards["total-candidates"]["trend"]["isPositive"] is None
    assert cards["active-jobs"]["trend"]["value"] == "0 roles"


async def test_stats_counts_active_jobs(client: AsyncClient, make_user) -> None:
    recruiter = await _recruiter(client, make_user)
    headers = _auth(recruiter)

    await _post_job(client, headers)
    await _post_job(client, headers, overrides={"title": "Second Job"})

    response = await client.get("/api/v1/recruiter/dashboard/stats", headers=headers)

    cards = {card["id"]: card for card in response.json()}
    assert cards["active-jobs"]["value"] == "2"
    assert cards["active-jobs"]["trend"]["value"] == "2 roles"


async def test_jobs_recent_mapping_and_order(client: AsyncClient, make_user) -> None:
    recruiter = await _recruiter(client, make_user)
    headers = _auth(recruiter)

    first = await _post_job(client, headers)
    await _post_job(client, headers, overrides={"title": "Second Job"})

    response = await client.get("/api/v1/recruiter/jobs/recent", headers=headers)

    assert response.status_code == 200
    items = response.json()
    assert len(items) == 2
    assert items[0]["title"] == "Second Job"
    assert items[0]["id"] != first["id"]

    item = items[1]
    assert item["id"] == first["id"]
    assert item["title"] == JOB_PAYLOAD["title"]
    assert item["department"] == "Acme Corp"
    assert item["employmentType"] == "Internship • Hybrid"
    assert item["status"] == "Active"
    assert item["applicationsCount"] == 0
    assert item["newApplications"] == 0
    assert re.fullmatch(r"[A-Z][a-z]{2} \d{2}, \d{4}", item["postedDate"])


async def test_jobs_recent_own_only(client: AsyncClient, make_user) -> None:
    recruiter_a = await _recruiter(client, make_user, email="dash-a@example.com")
    recruiter_b = await _recruiter(client, make_user, email="dash-b@example.com")

    await _post_job(client, _auth(recruiter_a))

    response = await client.get("/api/v1/recruiter/jobs/recent", headers=_auth(recruiter_b))

    assert response.json() == []


async def test_jobs_recent_limits_to_5(client: AsyncClient, make_user) -> None:
    recruiter = await _recruiter(client, make_user)
    headers = _auth(recruiter)

    for index in range(6):
        await _post_job(client, headers, overrides={"title": f"Job {index}"})

    response = await client.get("/api/v1/recruiter/jobs/recent", headers=headers)

    assert len(response.json()) == 5
    assert response.json()[0]["title"] == "Job 5"


async def _make_student(client: AsyncClient, make_user, email: str, **profile) -> dict:
    student = await make_user(email)
    headers = _auth(student)
    if profile:
        response = await client.put("/api/v1/profiles/me", headers=headers, json=profile)
        assert response.status_code == 200
    return student


async def test_candidates_and_analytics_with_students(
    client: AsyncClient, make_user, fake_embeddings
) -> None:
    student_a = await _make_student(
        client, make_user, "rec-cand-a@example.com", headline="Python dev"
    )
    await client.put(
        "/api/v1/profiles/me/skills", headers=_auth(student_a), json={"skills": ["Python"]}
    )
    await _make_student(client, make_user, "rec-cand-b@example.com", headline="React dev")
    recruiter = await make_user("rec-dash2@example.com", role="recruiter")

    candidates = await client.get(
        "/api/v1/recruiter/candidates/recent", headers=_auth(recruiter)
    )
    assert candidates.status_code == 200
    items = candidates.json()
    assert len(items) == 2
    assert items[0]["initials"]  # initials computed
    assert "Python" in items[0]["skills"] or "Python" in items[1]["skills"]

    analytics = await client.get("/api/v1/recruiter/analytics/skills", headers=_auth(recruiter))
    assert analytics.status_code == 200
    skills = analytics.json()
    assert len(skills) == 1
    assert skills[0]["skill"] == "Python"
    assert skills[0]["candidateCount"] == 1
    assert skills[0]["percentage"] == 50


async def test_talent_search_filters_by_skills_and_query(
    client: AsyncClient, make_user, fake_embeddings
) -> None:
    python_student = await _make_student(
        client, make_user, "ts-python@example.com", headline="Python backend engineer"
    )
    await client.put(
        "/api/v1/profiles/me/skills", headers=_auth(python_student), json={"skills": ["Python"]}
    )
    react_student = await _make_student(
        client, make_user, "ts-react@example.com", headline="React frontend engineer"
    )
    await client.put(
        "/api/v1/profiles/me/skills", headers=_auth(react_student), json={"skills": ["React"]}
    )
    recruiter = await make_user("ts-rec@example.com", role="recruiter")
    headers = _auth(recruiter)

    by_skill = await client.get(
        "/api/v1/recruiter/talent-search", headers=headers, params={"skills": "python"}
    )
    assert by_skill.status_code == 200
    assert len(by_skill.json()) == 1
    assert by_skill.json()[0]["skills"] == ["Python"]

    by_query = await client.get(
        "/api/v1/recruiter/talent-search", headers=headers, params={"q": "react"}
    )
    assert len(by_query.json()) == 1
    assert by_query.json()[0]["skills"] == ["React"]


async def test_talent_search_scores_and_shape(
    client: AsyncClient, make_user, fake_embeddings
) -> None:
    python_student = await _make_student(
        client, make_user, "ts-score@example.com",
        headline="Python developer",
        bio="Loves building APIs with Python.",
    )
    await client.put(
        "/api/v1/profiles/me/skills", headers=_auth(python_student), json={"skills": ["Python"]}
    )
    recruiter = await make_user("ts-rec2@example.com", role="recruiter")

    response = await client.get(
        "/api/v1/recruiter/talent-search", headers=_auth(recruiter), params={"q": "python"}
    )

    assert response.status_code == 200
    item = response.json()[0]
    assert item["demoMatchScore"] > 0
    assert item["role"] == "Python developer"
    assert item["summary"] == "Loves building APIs with Python."
    assert item["tone"] == "blue"


async def test_talent_search_requires_recruiter_role(client: AsyncClient, make_user) -> None:
    student = await make_user("ts-guard@example.com")
    assert (
        await client.get("/api/v1/recruiter/talent-search", headers=_auth(student))
    ).status_code == 403
    assert (await client.get("/api/v1/recruiter/talent-search")).status_code == 401


async def test_dashboard_requires_recruiter_role(client: AsyncClient, make_user) -> None:
    student = await make_user("dash-stu@example.com")

    for path in ["/dashboard/stats", "/candidates/recent", "/jobs/recent", "/analytics/skills"]:
        response = await client.get(f"/api/v1/recruiter{path}", headers=_auth(student))
        assert response.status_code == 403

    response = await client.get("/api/v1/recruiter/dashboard/stats")
    assert response.status_code == 401
