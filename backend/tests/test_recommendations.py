from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.course import Course
from app.models.skill import Skill

JOB_PYTHON = {
    "title": "Python Backend Engineer",
    "company_name": "Acme Corp",
    "location": "Bengaluru, India",
    "work_mode": "Hybrid",
    "job_type": "Full-time",
    "experience_level": "1–3 years",
    "salary_range": "₹10–15 LPA",
    "openings_count": 2,
    "description": "Build backend services with Python and Machine Learning.",
    "responsibilities": "Own a service end to end.",
    "qualifications": "B.Tech in Computer Science.",
    "required_skills": ["Python", "Machine Learning"],
    "preferred_skills": [],
}


def _auth(body: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {body['access_token']}"}


async def _course(db_session: AsyncSession, title: str, url: str, skill: Skill) -> None:
    course = Course(title=title, provider="freecodecamp", url=url, description=title)
    course.skills = [skill]
    db_session.add(course)
    await db_session.commit()


async def _make_student_with_skills(
    client: AsyncClient, make_user, email: str, skills: list[str]
) -> dict:
    student = await make_user(email)
    response = await client.put(
        "/api/v1/profiles/me", headers=_auth(student), json={"headline": "Python developer"}
    )
    assert response.status_code == 200
    response = await client.put(
        "/api/v1/profiles/me/skills", headers=_auth(student), json={"skills": skills}
    )
    assert response.status_code == 200
    return student


async def test_recommends_courses_for_missing_skills(
    client: AsyncClient, make_user, db_session: AsyncSession, fake_embeddings
) -> None:
    student = await _make_student_with_skills(
        client, make_user, "rec-stu@example.com", ["Python"]
    )
    recruiter = await make_user("rec-cr@example.com", role="recruiter")
    response = await client.post(
        "/api/v1/recruiter/jobs", headers=_auth(recruiter), json=JOB_PYTHON
    )
    assert response.status_code == 201

    ml_skill = await db_session.scalar(select(Skill).where(Skill.name == "machine learning"))
    await _course(db_session, "Machine Learning with Python", "https://fcc/ml", ml_skill)

    python_skill = await db_session.scalar(select(Skill).where(Skill.name == "python"))
    await _course(db_session, "Python for Everybody", "https://fcc/python", python_skill)

    response = await client.get("/api/v1/recommendations/courses", headers=_auth(student))

    assert response.status_code == 200
    body = response.json()
    assert "machine learning" in body["missing_skills"]
    titles = [course["title"] for course in body["courses"]]
    assert titles[0] == "Machine Learning with Python"
    assert body["courses"][0]["matched_skills"] == ["machine learning"]


async def test_recommendations_fall_back_to_profile_skills(
    client: AsyncClient, make_user, db_session: AsyncSession, fake_embeddings
) -> None:
    student = await _make_student_with_skills(
        client, make_user, "rec-fb@example.com", ["Python", "Machine Learning"]
    )
    recruiter = await make_user("rec-fb-cr@example.com", role="recruiter")
    response = await client.post(
        "/api/v1/recruiter/jobs", headers=_auth(recruiter), json=JOB_PYTHON
    )
    assert response.status_code == 201

    python_skill = await db_session.scalar(select(Skill).where(Skill.name == "python"))
    await _course(db_session, "Python for Everybody", "https://fcc/python2", python_skill)

    response = await client.get("/api/v1/recommendations/courses", headers=_auth(student))

    assert response.status_code == 200
    body = response.json()
    assert body["missing_skills"] == []
    titles = [course["title"] for course in body["courses"]]
    assert titles == ["Python for Everybody"]
    assert body["courses"][0]["matched_skills"] == ["python"]


async def test_recommendations_require_student(client: AsyncClient, make_user) -> None:
    faculty = await make_user("rec-guard@example.com", role="faculty")

    assert (
        await client.get("/api/v1/recommendations/courses", headers=_auth(faculty))
    ).status_code == 403
    assert (await client.get("/api/v1/recommendations/courses")).status_code == 401
