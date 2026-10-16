import uuid
from typing import Annotated

import jwt
from fastapi import APIRouter, Depends
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import security
from app.core.deps import require_roles
from app.models.user import RoleEnum, User

STUDENT_SIGNUP = {
    "email": "student@example.com",
    "password": "password123",
    "full_name": "Test Student",
    "role": "student",
}


async def _signup(client: AsyncClient) -> dict:
    response = await client.post("/api/v1/auth/signup", json=STUDENT_SIGNUP)
    assert response.status_code == 201
    return response.json()


async def _login(client: AsyncClient, remember_me: bool = False) -> dict:
    payload = {
        "email": "student@example.com",
        "password": "password123",
        "remember_me": remember_me,
    }
    response = await client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    return response.json()


async def test_signup_success(client: AsyncClient) -> None:
    response = await client.post("/api/v1/auth/signup", json=STUDENT_SIGNUP)

    assert response.status_code == 201
    body = response.json()
    assert body["user"]["email"] == "student@example.com"
    assert body["user"]["full_name"] == "Test Student"
    assert body["user"]["role"] == "student"
    assert body["user"]["is_active"] is True
    uuid.UUID(body["user"]["id"])
    assert body["access_token"]
    assert body["refresh_token"]
    assert "hashed_password" not in body["user"]


async def test_signup_duplicate_email(client: AsyncClient) -> None:
    await _signup(client)

    response = await client.post("/api/v1/auth/signup", json=STUDENT_SIGNUP)
    assert response.status_code == 409
    assert response.json() == {"detail": "Email already registered"}

    response = await client.post(
        "/api/v1/auth/signup", json={**STUDENT_SIGNUP, "email": "STUDENT@Example.com"}
    )
    assert response.status_code == 409


async def test_signup_weak_password(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/auth/signup", json={**STUDENT_SIGNUP, "password": "short"}
    )

    assert response.status_code == 422


async def test_signup_admin_role_rejected(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/auth/signup", json={**STUDENT_SIGNUP, "role": "admin"}
    )

    assert response.status_code == 422


async def test_login_success_case_insensitive_email(client: AsyncClient) -> None:
    await _signup(client)

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "STUDENT@Example.com", "password": "password123"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["user"]["email"] == "student@example.com"
    assert body["access_token"]
    assert body["refresh_token"]


async def test_login_wrong_password(client: AsyncClient) -> None:
    await _signup(client)

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid email or password"}


async def test_login_unknown_email(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@example.com", "password": "password123"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid email or password"}


async def test_login_empty_password(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/auth/login", json={"email": "student@example.com", "password": ""}
    )

    assert response.status_code == 422


async def test_refresh_success_and_remember_me_expiry(client: AsyncClient) -> None:
    signup_body = await _signup(client)

    response = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": signup_body["refresh_token"]}
    )

    assert response.status_code == 200
    access_token = response.json()["access_token"]
    access_payload = jwt.decode(access_token, options={"verify_signature": False})
    assert access_payload["type"] == "access"
    assert access_payload["sub"] == signup_body["user"]["id"]

    default_body = await _login(client)
    default_payload = jwt.decode(
        default_body["refresh_token"], options={"verify_signature": False}
    )
    assert default_payload["type"] == "refresh"
    default_days = (default_payload["exp"] - default_payload["iat"]) / 86400
    assert 6 <= default_days <= 8

    remember_body = await _login(client, remember_me=True)
    remember_payload = jwt.decode(
        remember_body["refresh_token"], options={"verify_signature": False}
    )
    remember_days = (remember_payload["exp"] - remember_payload["iat"]) / 86400
    assert 29 <= remember_days <= 31


async def test_refresh_invalid_token(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": "not-a-jwt"}
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid refresh token"}


async def test_refresh_rejects_access_token(client: AsyncClient) -> None:
    signup_body = await _signup(client)

    response = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": signup_body["access_token"]}
    )

    assert response.status_code == 401


async def test_me_with_token(client: AsyncClient) -> None:
    signup_body = await _signup(client)

    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {signup_body['access_token']}"},
    )

    assert response.status_code == 200
    assert response.json()["email"] == "student@example.com"


async def test_me_without_token(client: AsyncClient) -> None:
    response = await client.get("/api/v1/auth/me")

    assert response.status_code == 401


async def test_require_roles_guard(
    app, db_session: AsyncSession, client: AsyncClient
) -> None:
    router = APIRouter()

    @router.get("/api/v1/test/admin-only")
    async def admin_only(
        current_user: Annotated[User, Depends(require_roles(RoleEnum.admin))],
    ) -> dict[str, bool]:
        return {"ok": True}

    app.include_router(router)

    admin = User(
        email="admin@example.com",
        hashed_password=await security.hash_password("password123"),
        full_name="Platform Admin",
        role=RoleEnum.admin,
    )
    db_session.add(admin)
    await db_session.commit()
    await db_session.refresh(admin)
    admin_token = security.create_access_token(admin.id)

    student_body = await _signup(client)

    student_response = await client.get(
        "/api/v1/test/admin-only",
        headers={"Authorization": f"Bearer {student_body['access_token']}"},
    )
    assert student_response.status_code == 403

    admin_response = await client.get(
        "/api/v1/test/admin-only",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert admin_response.status_code == 200
    assert admin_response.json() == {"ok": True}
