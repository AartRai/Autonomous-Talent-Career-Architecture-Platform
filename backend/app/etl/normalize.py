"""Normalize raw collector records into Job / Course fields.

Mapping rules (kept intentionally simple and documented):
- work_mode: Arbeitnow carries a `remote` boolean (False -> On-site, True ->
  Remote); Remotive is a remote-only board -> Remote; unknown -> Remote.
- job_type: title keywords intern/trainee -> Internship, part-time ->
  Part-time, contract/freelance -> Contract; default Full-time.
- experience_level: our sources don't state it -> "Not specified".
- openings_count: unknown -> 1. Salary/qualifications/responsibilities
  default to empty/None.
"""
import re

from app.models.job import ExperienceLevel, JobStatus, JobType, WorkMode

_TITLE_JOB_TYPE_KEYWORDS = [
    (JobType.internship, ("intern", "trainee")),
    (JobType.part_time, ("part-time", "part time")),
    (JobType.contract, ("contract", "freelance")),
]

_HTML_TAG = re.compile(r"<[^>]+>")


def _strip_html(value: str) -> str:
    return _HTML_TAG.sub(" ", value)


def detect_job_type(title: str) -> JobType:
    lowered = title.lower()
    for job_type, keywords in _TITLE_JOB_TYPE_KEYWORDS:
        if any(keyword in lowered for keyword in keywords):
            return job_type
    return JobType.full_time


def normalize_job(raw: dict) -> dict:
    title = str(raw.get("title") or "Untitled role")[:200]
    description = _strip_html(
        str(raw.get("description") or raw.get("job_description") or "")
    )
    location = str(
        raw.get("candidate_required_location") or raw.get("location") or "Remote"
    )[:150]
    salary = raw.get("salary")
    if not salary and (raw.get("salary_from") or raw.get("salary_to")):
        salary = f"{raw.get('salary_from', '?')}–{raw.get('salary_to', '?')}"
    return {
        "title": title,
        "company_name": str(
            raw.get("company_name") or raw.get("company") or "Unknown company"
        )[:150],
        "location": location,
        "work_mode": WorkMode.on_site if raw.get("remote") is False else WorkMode.remote,
        "job_type": detect_job_type(title),
        "experience_level": ExperienceLevel.not_specified,
        "salary_range": str(salary)[:100] if salary else None,
        "openings_count": 1,
        "description": description,
        "responsibilities": "",
        "qualifications": "",
        "status": JobStatus.active,
        "source_url": str(raw.get("url"))[:500] if raw.get("url") else None,
        "skill_text": f"{title}\n{description}",
    }


def normalize_course(raw: dict, provider: str) -> dict:
    title = str(raw.get("title") or "Untitled course")[:300]
    description = _strip_html(str(raw.get("description") or raw.get("headline") or ""))
    url = str(raw.get("url") or raw.get("link") or "")
    if not url:
        url = f"urn:{provider}:{title.lower().replace(' ', '-')}"
    return {
        "title": title,
        "provider": provider,
        "url": url[:500],
        "description": description or None,
        "skill_text": f"{title}\n{description}",
    }
