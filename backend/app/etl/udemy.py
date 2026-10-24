import logging

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)

UDEMY_COURSES_URL = "https://www.udemy.com/api-2.0/courses/"
UDEMY_PAGE_SIZE = 100


class UdemyCollector:
    """Official Udemy Affiliate API; skipped when credentials are not set."""

    name = "udemy"

    async def fetch(self, client: httpx.AsyncClient) -> list[dict]:
        settings = get_settings()
        if not settings.udemy_client_id or not settings.udemy_client_secret:
            logger.info("Udemy credentials not configured; skipping course collection")
            return []

        auth = (
            settings.udemy_client_id.get_secret_value(),
            settings.udemy_client_secret.get_secret_value(),
        )
        response = await client.get(
            UDEMY_COURSES_URL, params={"page_size": UDEMY_PAGE_SIZE}, auth=auth
        )
        response.raise_for_status()
        return list(response.json().get("results", []))
