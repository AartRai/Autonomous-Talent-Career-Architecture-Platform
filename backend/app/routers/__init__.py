from fastapi import APIRouter

from app.routers.auth import router as auth_router
from app.routers.profiles import router as profiles_router
from app.routers.resumes import router as resumes_router
from app.routers.skills import router as skills_router

api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(auth_router)
api_v1.include_router(skills_router)
api_v1.include_router(profiles_router)
api_v1.include_router(resumes_router)
