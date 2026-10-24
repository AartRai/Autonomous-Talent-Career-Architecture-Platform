import httpx
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.etl.arbeitnow import ArbeitnowCollector
from app.etl.freecodecamp import FreeCodeCampCollector
from app.etl.normalize import detect_job_type, normalize_job
from app.etl.remotive import RemotiveCollector
from app.etl.udemy import UdemyCollector
from app.etl.upsert import upsert_course, upsert_job
from app.models.course import Course
from app.models.job import ExperienceLevel, Job, JobSource, JobType, WorkMode

REMOTIVE_RAW = {
    "url": "https://remotive.com/remote-jobs/software-dev/1",
    "title": "Python Backend Developer",
    "company_name": "Acme Remote",
    "candidate_required_location": "Worldwide",
    "salary": "$60k–$90k",
    "description": "<p>Build APIs with <b>Python</b>, Docker and FastAPI.</p>",
}

ARBEITNOW_RAW = {
    "slug": "on-site-engineer",
    "title": "Data Engineer",
    "company_name": "Berlin Data GmbH",
    "location": "Berlin",
    "remote": False,
    "url": "https://www.arbeitnow.com/view/data-engineer",
    "description": "SQL, data pipelines and Python.",
}

FCC_LISTING = [
    {
        "name": "responsive-web-design.yml",
        "type": "file",
        "download_url": "https://raw.githubusercontent.com/fcc/responsive-web-design.yml",
    },
    {
        "name": "machine-learning-with-python.yml",
        "type": "file",
        "download_url": "https://raw.githubusercontent.com/fcc/machine-learning-with-python.yml",
    },
    {"name": "legacy-front-end.yml", "type": "file", "download_url": "https://raw.githubusercontent.com/fcc/legacy.yml"},
]

FCC_FILES = {
    "https://raw.githubusercontent.com/fcc/responsive-web-design.yml": (
        "title: Responsive Web Design\ncertification: responsive-web-design\n"
    ),
    "https://raw.githubusercontent.com/fcc/machine-learning-with-python.yml": (
        "title: Machine Learning with Python\ncertification: machine-learning-with-python\n"
    ),
}

UDEMY_RAW = {
    "title": "Complete Python Bootcamp",
    "url": "https://www.udemy.com/course/python-bootcamp/",
    "headline": "Learn Python and Machine Learning from zero.",
}


def _auth(body: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {body['access_token']}"}


def _mock_client(handler) -> httpx.AsyncClient:
    return httpx.AsyncClient(transport=httpx.MockTransport(handler))


async def test_normalize_job_mapping() -> None:
    data = normalize_job(REMOTIVE_RAW)

    assert data["title"] == "Python Backend Developer"
    assert data["work_mode"] == WorkMode.remote
    assert data["job_type"] == JobType.full_time
    assert data["experience_level"] == ExperienceLevel.not_specified
    assert data["salary_range"] == "$60k–$90k"
    assert data["source_url"] == REMOTIVE_RAW["url"]
    assert "<p>" not in data["description"]
    assert "Python" in data["description"]

    on_site = normalize_job(ARBEITNOW_RAW)
    assert on_site["work_mode"] == WorkMode.on_site


def test_detect_job_type_keywords() -> None:
    assert detect_job_type("Software Engineer Intern") == JobType.internship
    assert detect_job_type("Part-time React Developer") == JobType.part_time
    assert detect_job_type("Contract Frontend Engineer") == JobType.contract
    assert detect_job_type("Senior Data Analyst") == JobType.full_time


async def test_remotive_collector_parses_payload() -> None:
    async def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.host == "remotive.com"
        return httpx.Response(200, json={"jobs": [REMOTIVE_RAW]})

    records = await RemotiveCollector().fetch(_mock_client(handler))
    assert records == [REMOTIVE_RAW]


async def test_arbeitnow_collector_parses_payload() -> None:
    async def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json={"data": [ARBEITNOW_RAW]})

    records = await ArbeitnowCollector().fetch(_mock_client(handler))
    assert records == [ARBEITNOW_RAW]


async def test_udemy_collector_skips_without_credentials() -> None:
    records = await UdemyCollector().fetch(_mock_client(lambda request: httpx.Response(500)))
    assert records == []


async def test_upsert_job_idempotent_and_scraped(
    db_session: AsyncSession, seed_skills, fake_embeddings
) -> None:
    url, created = await upsert_job(db_session, REMOTIVE_RAW, "remotive")
    assert created is True
    job = await db_session.scalar(select(Job).where(Job.source_url == url))
    assert job is not None
    assert job.recruiter_id is None
    assert job.source == JobSource.scraped
    assert job.embedding is not None
    assert {skill.name for skill in job.required_skills} >= {"python", "docker", "fastapi"}

    url_again, created_again = await upsert_job(db_session, REMOTIVE_RAW, "remotive")
    assert created_again is False
    assert url_again == url
    count = await db_session.scalar(select(func.count()).select_from(Job))
    assert count == 1

    changed = {**REMOTIVE_RAW, "description": "<p>Updated description with AWS.</p>"}
    await upsert_job(db_session, changed, "remotive")
    job = await db_session.scalar(select(Job).where(Job.source_url == url))
    assert "Updated" in job.description


async def test_upsert_course_from_freecodecamp_and_udemy(
    db_session: AsyncSession, seed_skills, fake_embeddings
) -> None:
    async def handler(request: httpx.Request) -> httpx.Response:
        if request.url.host == "raw.githubusercontent.com":
            return httpx.Response(200, text=FCC_FILES[str(request.url)])
        return httpx.Response(200, json=FCC_LISTING)

    records = await FreeCodeCampCollector().fetch(_mock_client(handler))
    assert len(records) == 2

    url, created = await upsert_course(db_session, records[0], "freecodecamp")
    assert created is True
    course = await db_session.scalar(select(Course).where(Course.url == url))
    assert course.provider == "freecodecamp"
    assert course.title == "Responsive Web Design"

    await upsert_course(db_session, records[0], "freecodecamp")
    count = await db_session.scalar(select(func.count()).select_from(Course))
    assert count == 1

    udemy_url, created_udemy = await upsert_course(db_session, UDEMY_RAW, "udemy")
    assert created_udemy is True
    course = await db_session.scalar(select(Course).where(Course.url == udemy_url))
    assert course.provider == "udemy"
    assert {skill.name for skill in course.skills} >= {"python"}


async def test_scraped_job_visible_to_students_not_recruiters(
    client, make_user, db_session: AsyncSession, seed_skills, fake_embeddings
) -> None:
    await upsert_job(db_session, REMOTIVE_RAW, "remotive")

    recruiter = await make_user("etl-rec@example.com", role="recruiter")
    recent = await client.get("/api/v1/recruiter/jobs/recent", headers=_auth(recruiter))
    assert recent.json() == []

    student = await make_user("etl-stu@example.com")
    response = await client.get("/api/v1/matches", headers=_auth(student))
    assert response.status_code == 200
    titles = [match["job"]["title"] for match in response.json()["matches"]]
    assert "Python Backend Developer" in titles


async def test_freecodecamp_collector_parses_listing() -> None:
    async def handler(request: httpx.Request) -> httpx.Response:
        if request.url.host == "raw.githubusercontent.com":
            return httpx.Response(200, text=FCC_FILES[str(request.url)])
        return httpx.Response(200, json=FCC_LISTING)

    records = await FreeCodeCampCollector().fetch(_mock_client(handler))
    assert records[0]["title"] == "Responsive Web Design"
    assert records[0]["url"] == "https://www.freecodecamp.org/learn/responsive-web-design/"
    assert len(records) == 2  # legacy-* is skipped
