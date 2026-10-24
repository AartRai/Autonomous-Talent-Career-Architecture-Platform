import asyncio
import logging

import httpx

from app.db.session import async_session_factory
from app.etl.arbeitnow import ArbeitnowCollector
from app.etl.freecodecamp import FreeCodeCampCollector
from app.etl.remotive import RemotiveCollector
from app.etl.udemy import UdemyCollector
from app.etl.upsert import upsert_course, upsert_job
from app.worker import celery_app

logger = logging.getLogger(__name__)

JOB_COLLECTORS = [RemotiveCollector(), ArbeitnowCollector()]
COURSE_COLLECTORS = [FreeCodeCampCollector(), UdemyCollector()]

USER_AGENT = "Synapse-ETL/0.1 (student capstone; nightly collection)"


async def _collect_jobs() -> dict:
    total = 0
    created = 0
    async with async_session_factory() as db:
        async with httpx.AsyncClient(timeout=30.0, headers={"User-Agent": USER_AGENT}) as client:
            for collector in JOB_COLLECTORS:
                try:
                    records = await collector.fetch(client)
                except httpx.HTTPError:
                    logger.exception("Collector %s failed", collector.name)
                    continue
                for record in records:
                    _, is_new = await upsert_job(db, record, collector.name)
                    total += 1
                    created += int(is_new)
    return {"jobs_total": total, "jobs_created": created}


async def _collect_courses() -> dict:
    total = 0
    created = 0
    async with async_session_factory() as db:
        async with httpx.AsyncClient(timeout=30.0, headers={"User-Agent": USER_AGENT}) as client:
            for collector in COURSE_COLLECTORS:
                try:
                    records = await collector.fetch(client)
                except httpx.HTTPError:
                    logger.exception("Collector %s failed", collector.name)
                    continue
                for record in records:
                    _, is_new = await upsert_course(db, record, collector.name)
                    total += 1
                    created += int(is_new)
    return {"courses_total": total, "courses_created": created}


@celery_app.task(name="etl.collect_jobs", ignore_result=True)
def collect_jobs() -> dict:
    return asyncio.run(_collect_jobs())


@celery_app.task(name="etl.collect_courses", ignore_result=True)
def collect_courses() -> dict:
    return asyncio.run(_collect_courses())
