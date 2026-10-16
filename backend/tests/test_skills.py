from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.skill import Skill, SkillSource
from app.services import skills as skill_service


def _auth(body: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {body['access_token']}"}


async def test_get_or_create_skill_normalizes_and_dedups(db_session: AsyncSession) -> None:
    first = await skill_service.get_or_create_skill(db_session, "  React  ", SkillSource.user)
    second = await skill_service.get_or_create_skill(db_session, "react", SkillSource.user)

    assert first.id == second.id
    assert first.name == "react"
    assert first.display_name == "React"

    rows = list(await db_session.scalars(select(Skill).where(Skill.name == "react")))
    assert len(rows) == 1


async def test_search_skills_substring_case_insensitive(
    client: AsyncClient, make_user, db_session: AsyncSession
) -> None:
    user = await make_user("skills-1@example.com")
    for name in ["python", "pytorch", "typescript"]:
        db_session.add(
            Skill(name=name, display_name=name.title(), source=SkillSource.seed)
        )
    await db_session.commit()

    response = await client.get(
        "/api/v1/skills", params={"q": "PY"}, headers=_auth(user)
    )

    assert response.status_code == 200
    names = [skill["name"] for skill in response.json()["skills"]]
    assert names == ["python", "pytorch"]


async def test_search_skills_limits_to_20(
    client: AsyncClient, make_user, db_session: AsyncSession
) -> None:
    user = await make_user("skills-2@example.com")
    for index in range(25):
        db_session.add(
            Skill(
                name=f"sk{index:02d}",
                display_name=f"SK{index:02d}",
                source=SkillSource.seed,
            )
        )
    await db_session.commit()

    response = await client.get("/api/v1/skills", params={"q": "sk"}, headers=_auth(user))

    assert response.status_code == 200
    assert len(response.json()["skills"]) == 20


async def test_search_skills_requires_query_and_auth(client: AsyncClient, make_user) -> None:
    user = await make_user("skills-3@example.com")

    response = await client.get("/api/v1/skills", headers=_auth(user))
    assert response.status_code == 422

    response = await client.get("/api/v1/skills", params={"q": "py"})
    assert response.status_code == 401
