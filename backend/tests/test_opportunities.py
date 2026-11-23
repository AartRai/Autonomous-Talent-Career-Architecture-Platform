import uuid

from httpx import AsyncClient

OPPORTUNITY_PAYLOAD = {
    "title": "Industrial Sabbatical in Data Systems",
    "type": "Sabbatical",
    "description": "Six-month industry collaboration on data infrastructure.",
    "organization": "Synapse Demo Corp",
    "location": "Bengaluru",
}


def _auth(body: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {body['access_token']}"}


async def _create_opportunity(client: AsyncClient, poster: dict) -> dict:
    response = await client.post(
        "/api/v1/opportunities", headers=_auth(poster), json=OPPORTUNITY_PAYLOAD
    )
    assert response.status_code == 201
    return response.json()


async def test_create_opportunity_faculty_and_recruiter(
    client: AsyncClient, make_user
) -> None:
    faculty = await make_user("opp-fac@example.com", role="faculty")
    created = await _create_opportunity(client, faculty)
    assert created["type"] == "Sabbatical"
    assert created["status"] == "open"

    recruiter = await make_user("opp-rec@example.com", role="recruiter")
    second = await _create_opportunity(client, recruiter)
    assert second["id"] != created["id"]


async def test_create_opportunity_rejects_student(client: AsyncClient, make_user) -> None:
    student = await make_user("opp-stu@example.com")

    response = await client.post(
        "/api/v1/opportunities", headers=_auth(student), json=OPPORTUNITY_PAYLOAD
    )

    assert response.status_code == 403
    assert (
        await client.post("/api/v1/opportunities", json=OPPORTUNITY_PAYLOAD)
    ).status_code == 401


async def test_list_opportunities_with_filters(client: AsyncClient, make_user) -> None:
    faculty = await make_user("opp-list@example.com", role="faculty")
    await _create_opportunity(client, faculty)
    await client.post(
        "/api/v1/opportunities",
        headers=_auth(faculty),
        json={
            **OPPORTUNITY_PAYLOAD,
            "title": "FDP on Teaching ML",
            "type": "FDP",
            "organization": "IIT Bombay",
        },
    )

    all_items = await client.get("/api/v1/opportunities", headers=_auth(faculty))
    assert len(all_items.json()) == 2

    by_type = await client.get(
        "/api/v1/opportunities", headers=_auth(faculty), params={"type": "FDP"}
    )
    assert len(by_type.json()) == 1
    assert by_type.json()[0]["title"] == "FDP on Teaching ML"

    by_query = await client.get(
        "/api/v1/opportunities", headers=_auth(faculty), params={"q": "iit"}
    )
    assert len(by_query.json()) == 1

    assert (await client.get("/api/v1/opportunities")).status_code == 401


async def test_apply_and_duplicate_conflict(client: AsyncClient, make_user) -> None:
    recruiter = await make_user("opp-apply-rec@example.com", role="recruiter")
    opportunity = await _create_opportunity(client, recruiter)
    faculty = await make_user("opp-apply-fac@example.com", role="faculty")

    response = await client.post(
        f"/api/v1/opportunities/{opportunity['id']}/apply",
        headers=_auth(faculty),
        json={"note": "I am interested."},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "Applied"
    assert body["opportunity"]["title"] == OPPORTUNITY_PAYLOAD["title"]
    assert body["applied_date"]

    duplicate = await client.post(
        f"/api/v1/opportunities/{opportunity['id']}/apply",
        headers=_auth(faculty),
        json={},
    )
    assert duplicate.status_code == 409


async def test_apply_unknown_opportunity_404(client: AsyncClient, make_user) -> None:
    faculty = await make_user("opp-404-fac@example.com", role="faculty")

    response = await client.post(
        f"/api/v1/opportunities/{uuid.uuid4()}/apply", headers=_auth(faculty), json={}
    )

    assert response.status_code == 404


async def test_my_applications_list(client: AsyncClient, make_user) -> None:
    recruiter = await make_user("opp-my-rec@example.com", role="recruiter")
    opportunity = await _create_opportunity(client, recruiter)
    faculty = await make_user("opp-my-fac@example.com", role="faculty")
    other_faculty = await make_user("opp-my-fac2@example.com", role="faculty")

    await client.post(
        f"/api/v1/opportunities/{opportunity['id']}/apply",
        headers=_auth(faculty),
        json={},
    )

    mine = await client.get("/api/v1/opportunities/applications", headers=_auth(faculty))
    assert len(mine.json()) == 1
    assert mine.json()[0]["opportunity"]["id"] == opportunity["id"]

    others = await client.get(
        "/api/v1/opportunities/applications", headers=_auth(other_faculty)
    )
    assert others.json() == []


async def test_opportunities_role_guards(client: AsyncClient, make_user) -> None:
    recruiter = await make_user("opp-guard-rec@example.com", role="recruiter")
    opportunity = await _create_opportunity(client, recruiter)
    student = await make_user("opp-guard-stu@example.com")

    assert (
        await client.post(
            f"/api/v1/opportunities/{opportunity['id']}/apply",
            headers=_auth(student),
            json={},
        )
    ).status_code == 403
    assert (
        await client.get("/api/v1/opportunities/applications", headers=_auth(student))
    ).status_code == 403
    assert (
        await client.post(
            f"/api/v1/opportunities/{opportunity['id']}/apply", json={}
        )
    ).status_code == 401
