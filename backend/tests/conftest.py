import asyncio
from collections.abc import AsyncIterator

import asyncpg
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_db
from app.main import create_app

TEST_DATABASE_URL = "postgresql+asyncpg://synapse:synapse@localhost:5432/synapse_test"


@pytest.fixture(scope="session", autouse=True)
def prepare_test_database() -> None:
    asyncio.run(_ensure_test_database())


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
