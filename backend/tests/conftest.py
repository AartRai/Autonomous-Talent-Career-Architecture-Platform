import asyncio
import os
import tempfile
import zlib
from collections.abc import AsyncIterator, Callable
from pathlib import Path

import asyncpg
import pytest
from alembic import command
from alembic.config import Config
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

os.environ["RESUME_STORAGE_DIR"] = tempfile.mkdtemp(prefix="synapse-test-storage-")

from app.db.base import Base  # noqa: E402
from app.db.session import get_db  # noqa: E402
from app.main import create_app  # noqa: E402
from app.models.skill import Skill, SkillSource  # noqa: E402

TEST_DATABASE_URL = "postgresql+asyncpg://synapse:synapse@localhost:5432/synapse_test"


@pytest.fixture(scope="session", autouse=True)
def prepare_test_database() -> None:
    asyncio.run(_ensure_test_database())
    config = Config(str(Path(__file__).parent.parent / "alembic.ini"))
    config.set_main_option("sqlalchemy.url", TEST_DATABASE_URL)
    command.upgrade(config, "head")


async def _ensure_test_database() -> None:
    conn = await asyncpg.connect(
        database="synapse", user="synapse", password="synapse", host="localhost", port=5432
    )
    try:
        exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = 'synapse_test'")
        if not exists:
            await conn.execute("CREATE DATABASE synapse_test")
    finally:
        await conn.close()

    conn = await asyncpg.connect(
        database="synapse_test", user="synapse", password="synapse", host="localhost", port=5432
    )
    try:
        await conn.execute("DROP SCHEMA public CASCADE")
        await conn.execute("CREATE SCHEMA public")
        await conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
    finally:
        await conn.close()


@pytest.fixture
async def db_session() -> AsyncIterator[AsyncSession]:
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    async with session_factory() as session:
        for table in reversed(Base.metadata.sorted_tables):
            await session.execute(table.delete())
        await session.commit()
        yield session

    await engine.dispose()


@pytest.fixture
async def app(db_session: AsyncSession):
    application = create_app()

    async def override_get_db() -> AsyncIterator[AsyncSession]:
        yield db_session

    application.dependency_overrides[get_db] = override_get_db
    yield application
    application.dependency_overrides.clear()


@pytest.fixture
async def client(app) -> AsyncIterator[AsyncClient]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.fixture
def make_user(client: AsyncClient) -> Callable:
    async def _make(email: str, role: str = "student") -> dict:
        response = await client.post(
            "/api/v1/auth/signup",
            json={
                "email": email,
                "password": "password123",
                "full_name": "Test User",
                "role": role,
            },
        )
        assert response.status_code == 201
        return response.json()

    return _make


@pytest.fixture
async def seed_skills(db_session: AsyncSession) -> list[str]:
    names = [
        "python",
        "machine learning",
        "fastapi",
        "docker",
        "react",
        "typescript",
        "aws",
        "kubernetes",
        "sql",
        "excel",
    ]
    for name in names:
        db_session.add(
            Skill(name=name, display_name=name.title(), source=SkillSource.seed)
        )
    db_session.add(
        Skill(name="customstack", display_name="CustomStack", source=SkillSource.user)
    )
    await db_session.commit()
    return names


def _text_vector(text: str) -> list[float]:
    """Deterministic fake embedding: same normalized text -> same vector.

    Distinct words hash to different buckets, so unrelated texts are
    (near-)orthogonal and shared words produce positive cosine similarity.
    """
    vector = [0.0] * 384
    for word in sorted(set(text.split())):
        bucket = zlib.crc32(word.encode("utf-8")) % 384
        vector[bucket] += 1.0
    norm = sum(value * value for value in vector) ** 0.5 or 1.0
    return [value / norm for value in vector]


@pytest.fixture
def fake_embeddings(monkeypatch):
    async def fake_embed_text(text: str) -> list[float]:
        return _text_vector(text)

    async def fake_embed_texts(texts: list[str]) -> list[list[float]]:
        return [_text_vector(text) for text in texts]

    monkeypatch.setattr("app.services.matches.embed_text", fake_embed_text)
    monkeypatch.setattr("app.ml.skill_match.embed_texts", fake_embed_texts)
    monkeypatch.setattr("app.services.jobs.embed_text", fake_embed_text)
    return _text_vector
