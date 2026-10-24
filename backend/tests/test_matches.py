import uuid

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.ml.embedder import EmbedderUnavailable
from app.models.job import Job

JOB_PYTHON = {
    "title": "Python Backend Engineer",
    "company_name": "Acme Corp",
    "location": "Bengaluru, India",
    "work_mode": "Hybrid",
    "job_type": "Full-time",
    "experience_level": "1–3 years",
    "salary_range": "₹10–15 LPA",
    "openings_count": 2,
    "description": "Build backend services with Python.",
    "responsibilities": "Own a service end to end.",
    "qualifications": "B.Tech in Computer Science.",
    "required_skills": ["Python"],
    "preferred_skills": [],
}

JOB_REACT = {
    **JOB_PYTHON,
    "title": "React Frontend Engineer",
    "description": "Build interfaces with React.",
    "required_skills": ["React"],
}


def _auth(body: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {body['access_token']}"}


async def _make_student(client: AsyncClient, make_user, email: str = "m-stu@example.com") -> dict:
    student = await make_user(email)
    headers = _auth(student)
    response = await client.put(
        "/api/v1/profiles/me",
        headers=headers,
        json={"headline": "Python developer", "target_role": "Backend Engineer"},
    )
    assert response.status_code == 200
    response = await client.put(
        "/api/v1/profiles/me/skills", headers=headers, json={"skills": ["Python"]}
    )
    assert response.status_code == 200
    return student


async def _make_jobs(client: AsyncClient, make_user, email: str = "m-rec@example.com") -> dict:
    recruiter = await make_user(email, role="recruiter")
    headers = _auth(recruiter)
    for payload in (JOB_PYTHON, JOB_REACT):
        response = await client.post("/api/v1/recruiter/jobs", headers=headers, json=payload)
        assert response.status_code == 201
    return recruiter


async def test_matches_requires_student_role(client: AsyncClient, make_user) -> None:
    assert (await client.get("/api/v1/matches")).status_code == 401

    faculty = await make_user("m-fac@example.com", role="faculty")
    response = await client.get("/api/v1/matches", headers=_auth(faculty))
    assert response.status_code == 403


async def test_matches_ranked_by_embedding(
    client: AsyncClient, make_user, fake_embeddings
) -> None:
    student = await _make_student(client, make_user)
    await _make_jobs(client, make_user)

    response = await client.get("/api/v1/matches", headers=_auth(student))

    assert response.status_code == 200
    matches = response.json()["matches"]
    assert len(matches) == 2
    assert matches[0]["job"]["title"] == "Python Backend Engineer"
    assert matches[1]["job"]["title"] == "React Frontend Engineer"
    assert matches[0]["match_score"] > matches[1]["match_score"]
    assert matches[0]["method"] == "cosine_embedding"
    for match in matches:
        assert 0 <= match["match_score"] <= 100


async def test_matches_excludes_jobs_without_embedding(
    client: AsyncClient, make_user, db_session: AsyncSession, fake_embeddings
) -> None:
    student = await _make_student(client, make_user)
    await _make_jobs(client, make_user)

    jobs = list(await db_session.execute(Job.__table__.select()))
    for job in jobs:
        job_id = job.id
        break
    job = await db_session.get(Job, job_id)
    job.embedding = None
    await db_session.commit()

    response = await client.get("/api/v1/matches", headers=_auth(student))

    matches = response.json()["matches"]
    assert len(matches) == 1
    assert all(match["job"]["id"] != str(job_id) for match in matches)


async def test_matches_gap_analysis_with_aliases(
    client: AsyncClient, make_user, fake_embeddings
) -> None:
    student = await make_user("m-alias@example.com")
    headers = _auth(student)
    response = await client.put(
        "/api/v1/profiles/me/skills", headers=headers, json={"skills": ["ML"]}
    )
    assert response.status_code == 200
    await _make_jobs(client, make_user, email="m-alias-rec@example.com")

    response = await client.get("/api/v1/matches", headers=headers)

    python_match = next(
        match for match in response.json()["matches"]
        if match["job"]["title"] == "Python Backend Engineer"
    )
    assert "Python" in python_match["missing_skills"]

    # find the match for a job requiring Machine Learning via direct service check
    from app.ml.skill_match import compare_skills

    gap = await compare_skills(["ML"], ["Machine Learning"])
    assert gap["matched_skills"] and gap["matched_skills"][0]["skill"] == "Machine Learning"
    assert gap["missing_skills"] == []


async def test_matches_threshold_respected(
    client: AsyncClient, make_user, fake_embeddings
) -> None:
    from app.ml.skill_match import compare_skills

    gap = await compare_skills(["Java"], ["Python"])
    assert gap["matched_skills"] == []
    assert gap["missing_skills"] == ["Python"]


async def test_matches_fallback_to_rule_based(
    client: AsyncClient, make_user, fake_embeddings, monkeypatch
) -> None:
    student = await _make_student(client, make_user)
    await _make_jobs(client, make_user)

    async def unavailable(text: str) -> list[float]:
        raise EmbedderUnavailable("no model")

    monkeypatch.setattr("app.services.matches.embed_text", unavailable)

    response = await client.get("/api/v1/matches", headers=_auth(student))

    assert response.status_code == 200
    matches = response.json()["matches"]
    assert matches[0]["method"] == "normalized_skill_overlap_baseline"
    python_match = next(
        match for match in matches
        if match["job"]["title"] == "Python Backend Engineer"
    )
    assert python_match["match_score"] == 100
    react_match = next(
        match for match in matches
        if match["job"]["title"] == "React Frontend Engineer"
    )
    assert react_match["match_score"] == 0


async def test_create_job_persists_embedding(
    client: AsyncClient, make_user, db_session: AsyncSession, fake_embeddings
) -> None:
    recruiter = await make_user("m-emb@example.com", role="recruiter")

    response = await client.post(
        "/api/v1/recruiter/jobs", headers=_auth(recruiter), json=JOB_PYTHON
    )

    assert response.status_code == 201
    job = await db_session.get(Job, uuid.UUID(response.json()["id"]))
    assert job.embedding is not None
    assert len(job.embedding) == 384
