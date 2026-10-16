from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import security
from app.models.user import RoleEnum, User


def _auth(body: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {body['access_token']}"}


async def test_profile_lazy_creation(client: AsyncClient, make_user) -> None:
    student = await make_user("lazy@example.com")

    response = await client.get("/api/v1/profiles/me", headers=_auth(student))

    assert response.status_code == 200
    body = response.json()
    assert body["role"] == "student"
    assert body["headline"] is None
    assert body["company_name"] is None
    assert body["skills"] == []


async def test_student_profile_update(client: AsyncClient, make_user) -> None:
    student = await make_user("stu@example.com")

    response = await client.put(
        "/api/v1/profiles/me",
        headers=_auth(student),
        json={"headline": "CS undergrad", "graduation_year": 2027, "bio": "hi"},
    )

    assert response.status_code == 200
    assert response.json()["headline"] == "CS undergrad"
    assert response.json()["graduation_year"] == 2027

    get_response = await client.get("/api/v1/profiles/me", headers=_auth(student))
    assert get_response.json()["bio"] == "hi"


async def test_student_rejects_recruiter_fields(client: AsyncClient, make_user) -> None:
    student = await make_user("stu2@example.com")

    response = await client.put(
        "/api/v1/profiles/me",
        headers=_auth(student),
        json={"company_name": "Acme"},
    )

    assert response.status_code == 422


async def test_faculty_and_recruiter_profiles(client: AsyncClient, make_user) -> None:
    faculty = await make_user("fac@example.com", role="faculty")
    response = await client.put(
        "/api/v1/profiles/me",
        headers=_auth(faculty),
        json={"department": "CSE", "designation": "Professor", "institution": "IIT"},
    )
    assert response.status_code == 200
    assert response.json()["department"] == "CSE"

    recruiter = await make_user("rec@example.com", role="recruiter")
    response = await client.put(
        "/api/v1/profiles/me",
        headers=_auth(recruiter),
        json={"company_name": "Acme", "job_title": "Talent Lead"},
    )
    assert response.status_code == 200
    assert response.json()["company_name"] == "Acme"

    response = await client.put(
        "/api/v1/profiles/me",
        headers=_auth(recruiter),
        json={"department": "CSE"},
    )
    assert response.status_code == 422


async def test_profile_skills_replace(client: AsyncClient, make_user) -> None:
    student = await make_user("sk@example.com")
    headers = _auth(student)

    response = await client.put(
        "/api/v1/profiles/me/skills",
        headers=headers,
        json={"skills": ["Python", " machine learning ", "Python", "Docker"]},
    )
    assert response.status_code == 200
    names = sorted(skill["name"] for skill in response.json()["skills"])
    assert names == ["docker", "machine learning", "python"]

    response = await client.put(
        "/api/v1/profiles/me/skills",
        headers=headers,
        json={"skills": ["Docker"]},
    )
    assert response.status_code == 200
    assert [skill["name"] for skill in response.json()["skills"]] == ["docker"]


async def test_profile_skills_rejects_over_limit_and_blank(
    client: AsyncClient, make_user
) -> None:
    student = await make_user("lim@example.com")
    headers = _auth(student)

    response = await client.put(
        "/api/v1/profiles/me/skills",
        headers=headers,
        json={"skills": [f"skill{i}" for i in range(51)]},
    )
    assert response.status_code == 422

    response = await client.put(
        "/api/v1/profiles/me/skills",
        headers=headers,
        json={"skills": ["   "]},
    )
    assert response.status_code == 422


async def test_recruiter_blocked_from_skills(client: AsyncClient, make_user) -> None:
    recruiter = await make_user("rec2@example.com", role="recruiter")

    response = await client.put(
        "/api/v1/profiles/me/skills",
        headers=_auth(recruiter),
        json={"skills": ["Python"]},
    )

    assert response.status_code == 403


async def test_admin_blocked_from_profiles(client: AsyncClient, db_session: AsyncSession) -> None:
    admin = User(
        email="admin2@example.com",
        hashed_password=await security.hash_password("password123"),
        full_name="Admin",
        role=RoleEnum.admin,
    )
    db_session.add(admin)
    await db_session.commit()
    await db_session.refresh(admin)
    headers = {"Authorization": f"Bearer {security.create_access_token(admin.id)}"}

    response = await client.get("/api/v1/profiles/me", headers=headers)
    assert response.status_code == 403


async def test_profiles_require_auth(client: AsyncClient) -> None:
    assert (await client.get("/api/v1/profiles/me")).status_code == 401
    assert (await client.put("/api/v1/profiles/me", json={})).status_code == 401
    assert (
        await client.put("/api/v1/profiles/me/skills", json={"skills": []})
    ).status_code == 401
