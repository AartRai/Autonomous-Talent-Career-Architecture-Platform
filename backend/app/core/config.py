from functools import lru_cache

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql+asyncpg://synapse:synapse@localhost:5432/synapse"
    redis_url: str = "redis://localhost:6379/0"
    cors_origins: list[str] = ["http://localhost:5173"]

    jwt_access_secret: SecretStr = SecretStr("dev-access-secret-change-me-0123456789abcdef")
    jwt_refresh_secret: SecretStr = SecretStr("dev-refresh-secret-change-me-0123456789abcdef")
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    refresh_token_expire_days_remember: int = 30
    resume_storage_dir: str = "storage/resumes"
    max_resume_upload_mb: int = 5


@lru_cache
def get_settings() -> Settings:
    return Settings()
