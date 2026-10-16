import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.ml.ner import SpacyModelUnavailable, get_nlp
from app.routers import api_v1
from app.routers.health import router as health_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        get_nlp()
        logger.info("spaCy model loaded")
    except SpacyModelUnavailable as exc:
        logger.warning("%s", exc)
    yield


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title="Synapse API", version="0.2.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(api_v1)

    return app


app = create_app()
