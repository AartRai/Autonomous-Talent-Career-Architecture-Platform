import httpx

ARBEITNOW_JOBS_URL = "https://www.arbeitnow.com/api/job-board-api"


class ArbeitnowCollector:
    """Public Arbeitnow job board API (no key required)."""

    name = "arbeitnow"

    async def fetch(self, client: httpx.AsyncClient) -> list[dict]:
        response = await client.get(ARBEITNOW_JOBS_URL)
        response.raise_for_status()
        return list(response.json().get("data", []))
