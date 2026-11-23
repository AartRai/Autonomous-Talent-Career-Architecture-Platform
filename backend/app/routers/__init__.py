from fastapi import APIRouter

from app.routers.applications import router as applications_router
from app.routers.auth import router as auth_router
from app.routers.jobs import router as jobs_router
from app.routers.matches import router as matches_router
from app.routers.opportunities import router as opportunities_router
from app.routers.profiles import router as profiles_router
from app.routers.recommendations import router as recommendations_router
from app.routers.recruiter import router as recruiter_router
from app.routers.resumes import router as resumes_router
from app.routers.skills import router as skills_router

api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(auth_router)
api_v1.include_router(skills_router)
api_v1.include_router(profiles_router)
api_v1.include_router(resumes_router)
api_v1.include_router(jobs_router)
api_v1.include_router(recruiter_router)
api_v1.include_router(matches_router)
api_v1.include_router(applications_router)
api_v1.include_router(opportunities_router)
api_v1.include_router(recommendations_router)
