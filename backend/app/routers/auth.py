from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RefreshRequest,
    RefreshResponse,
    SignupRequest,
    TokenPairResponse,
    UserOut,
)
from app.services import auth as auth_service

router = APIRouter(prefix="/auth", tags=["auth"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post(
    "/signup", response_model=TokenPairResponse, status_code=status.HTTP_201_CREATED
)
async def signup(data: SignupRequest, db: DbSession) -> TokenPairResponse:
    user = await auth_service.create_user(db, data)
    access_token, refresh_token = auth_service.create_token_pair(user)
    return TokenPairResponse(
        user=UserOut.model_validate(user),
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/login", response_model=TokenPairResponse)
async def login(data: LoginRequest, db: DbSession) -> TokenPairResponse:
    user = await auth_service.authenticate_user(db, data.email, data.password)
    access_token, refresh_token = auth_service.create_token_pair(
        user, remember_me=data.remember_me
    )
    return TokenPairResponse(
        user=UserOut.model_validate(user),
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/refresh", response_model=RefreshResponse)
async def refresh(data: RefreshRequest) -> RefreshResponse:
    access_token = await auth_service.refresh_access_token(data.refresh_token)
    return RefreshResponse(access_token=access_token)


@router.get("/me", response_model=UserOut)
async def me(current_user: CurrentUser) -> UserOut:
    return UserOut.model_validate(current_user)
