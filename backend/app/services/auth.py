import uuid

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import security
from app.core.config import get_settings
from app.models.user import RoleEnum, User
from app.schemas.auth import SignupRequest

INVALID_CREDENTIALS_DETAIL = "Invalid email or password"


async def create_user(db: AsyncSession, data: SignupRequest) -> User:
    existing = await db.scalar(select(User).where(User.email == data.email))
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )

    user = User(
        email=data.email,
        hashed_password=await security.hash_password(data.password),
        full_name=data.full_name,
        role=RoleEnum(data.role.value),
    )
    db.add(user)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        ) from exc
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
    user = await db.scalar(select(User).where(User.email == email))
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_CREDENTIALS_DETAIL
        )
    if not await security.verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_CREDENTIALS_DETAIL
        )
    return user


def create_token_pair(user: User, remember_me: bool = False) -> tuple[str, str]:
    access_token = security.create_access_token(user.id)
    refresh_token = security.create_refresh_token(user.id, remember_me=remember_me)
    return access_token, refresh_token


async def refresh_access_token(refresh_token: str) -> str:
    settings = get_settings()
    try:
        payload = security.decode_token(
            refresh_token, settings.jwt_refresh_secret.get_secret_value(), "refresh"
        )
    except security.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        ) from exc
    return security.create_access_token(uuid.UUID(payload["sub"]))
