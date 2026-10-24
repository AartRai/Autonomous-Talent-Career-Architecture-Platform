from celery import Celery
from celery.schedules import crontab

from app.core.config import get_settings

celery_app = Celery(
    "synapse",
    broker=get_settings().redis_url,
    backend=get_settings().redis_url,
)
celery_app.conf.timezone = "UTC"
celery_app.conf.beat_schedule = {
    "etl-collect-jobs-nightly": {
        "task": "etl.collect_jobs",
        "schedule": crontab(hour=2, minute=0),
    },
    "etl-collect-courses-nightly": {
        "task": "etl.collect_courses",
        "schedule": crontab(hour=2, minute=30),
    },
}

from app.etl import tasks  # noqa: E402,F401  (registers tasks on the app)
