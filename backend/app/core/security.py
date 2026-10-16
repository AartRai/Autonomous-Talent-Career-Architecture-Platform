import uuid
from datetime import UTC, datetime, timedelta

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerificationError
from fastapi.concurrency import run_in_threadpool

from app.core.config import get_settings

ALGORITHM = "HS256"

password_hasher = PasswordHasher()


class InvalidTokenError(Exception):
    """Raised when a JWT is malformed, expired, or has the wrong type."""


async def hash_password(password: str) -> str:
    return await run_in_threadpool(password_hasher.hash, password)


async def verify_password(password: str, hashed_password: str) -> bool:
    def _verify() -> bool:
        try:
            return password_hasher.verify(hashed_password, password)
        except VerificationError:
            return False

    return await run_in_threadpool(_verify)


def create_access_token(user_id: uuid.UUID) -> str:
    settings = get_settings()
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    return _create_token(
        sub=str(user_id),
        token_type="access",
        secret=settings.jwt_access_secret.get_secret_value(),
        expires_delta=expires_delta,
    )


def create_refresh_token(user_id: uuid.UUID, remember_me: bool = False) -> str:
    settings = get_settings()
    days = (
        settings.refresh_token_expire_days_remember
        if remember_me
        else settings.refresh_token_expire_days
    )
    return _create_token(
        sub=str(user_id),
        token_type="refresh",
        secret=settings.jwt_refresh_secret.get_secret_value(),
        expires_delta=timedelta(days=days),
    )


def decode_token(token: str, secret: str, expected_type: str) -> dict:
    try:
        payload = jwt.decode(token, secret, algorithms=[ALGORITHM])
    except jwt.PyJWTError as exc:
        raise InvalidTokenError from exc
    if payload.get("type") != expected_type or not payload.get("sub"):
        raise InvalidTokenError
    return payload


def _create_token(*, sub: str, token_type: str, secret: str, expires_delta: timedelta) -> str:
    now = datetime.now(UTC)
    payload = {
        "sub": sub,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(payload, secret, algorithm=ALGORITHM)
