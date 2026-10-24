import httpx

FCC_CERTIFICATIONS_URL = (
    "https://api.github.com/repos/freeCodeCamp/freeCodeCamp/contents/"
    "curriculum/challenges/english/certifications"
)

# Language courses (a1/a2/b1) and legacy certifications are not part of the
# current developer curriculum we want in the catalog.
_SKIP_PREFIXES = ("legacy-", "a1-", "a2-", "b1-")


def parse_certification(content: str) -> dict | None:
    """Parse the flat key-value certification YAML (title + certification)."""
    title = None
    certification = None
    for line in content.splitlines():
        if line.startswith("title:") and title is None:
            title = line.split(":", 1)[1].strip()
        elif line.startswith("certification:") and certification is None:
            certification = line.split(":", 1)[1].strip()
    if not title or not certification:
        return None
    return {
        "title": title,
        "url": f"https://www.freecodecamp.org/learn/{certification}/",
        "description": "",
    }


class FreeCodeCampCollector:
    """Open-source freeCodeCamp curriculum (BSD-3), ingested from GitHub."""

    name = "freecodecamp"

    async def fetch(self, client: httpx.AsyncClient) -> list[dict]:
        listing_response = await client.get(FCC_CERTIFICATIONS_URL)
        listing_response.raise_for_status()

        records: list[dict] = []
        for entry in listing_response.json():
            name = entry.get("name", "")
            if not name.endswith(".yml") or name.startswith(_SKIP_PREFIXES):
                continue
            file_response = await client.get(entry["download_url"])
            file_response.raise_for_status()
            record = parse_certification(file_response.text)
            if record:
                records.append(record)
        return records
