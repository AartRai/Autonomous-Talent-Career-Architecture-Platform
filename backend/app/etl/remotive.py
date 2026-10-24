import httpx

REMOTIVE_JOBS_URL = "https://remotive.com/api/remote-jobs"


class RemotiveCollector:
    """Public Remotive jobs API (no key required)."""

    name = "remotive"

    async def fetch(self, client: httpx.AsyncClient) -> list[dict]:
        response = await client.get(REMOTIVE_JOBS_URL)
        response.raise_for_status()
        return list(response.json().get("jobs", []))
