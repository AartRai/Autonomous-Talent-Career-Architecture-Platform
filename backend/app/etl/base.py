from typing import Any, Protocol

import httpx


class Collector(Protocol):
    name: str

    async def fetch(self, client: httpx.AsyncClient) -> list[dict[str, Any]]:
        """Return raw records; may raise httpx.HTTPError on network trouble."""
        ...
