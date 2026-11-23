# Synapse Backend

FastAPI backend. Layers: `routers/ -> services/ -> models/`, schemas/ (Pydantic v2), API prefix `/api/v1`.

## Run locally

```sh
cd backend
docker compose up -d --wait          # postgres (pgvector) + redis
python -m venv .venv
.venv/Scripts/pip install -e ".[dev]"
.venv/Scripts/python -m spacy download en_core_web_sm   # required for resume parsing
copy .env.example .env               # optional; defaults match compose
alembic upgrade head
.venv/Scripts/python -m scripts.seed_skills   # seed the ~200-term skill vocabulary
.venv/Scripts/python -m scripts.seed_demo     # optional: demo recruiter + sample jobs
.venv/Scripts/uvicorn app.main:app --reload --port 8000
```

### Market-intelligence ETL (optional)

```sh
# Windows: use --pool=solo (the default prefork pool is unreliable on Windows)
.venv/Scripts/celery -A app.worker worker --loglevel=info --pool=solo
# scheduler (separate process; -B/--beat is not supported on Windows):
.venv/Scripts/celery -A app.worker beat --loglevel=info
```

Nightly schedule (beat): jobs at 02:00, courses at 02:30 UTC.

Collectors: Remotive + Arbeitnow (jobs), FreeCodeCamp curriculum + Udemy
Affiliate API (courses, Udemy needs `UDEMY_CLIENT_ID`/`UDEMY_CLIENT_SECRET`).
Collected jobs are upserted by `source_url` (idempotent), tagged
`source=scraped` with no recruiter, and get embeddings + skills from the seed
vocabulary, so they appear in students' `GET /matches`.

- `GET http://localhost:8000/health` → `{"status": "ok"}`
- Swagger UI: `http://localhost:8000/docs`
- CORS allows the Vite dev origin `http://localhost:5173`
- `GET /api/v1/matches` (student) ranks active jobs by embedding cosine similarity and returns gap analysis per job. The `all-MiniLM-L6-v2` model downloads automatically on first use (~90 MB, internet required); if it is unavailable the endpoint falls back to rule-based skill-overlap scoring (`method` field marks the path used).
- Resume uploads are stored under `storage/resumes` (gitignored, configurable via `RESUME_STORAGE_DIR`); extracted text lives in the DB. Uploads are capped at `MAX_RESUME_UPLOAD_MB` (default 5 MB) and validated by file signature.
- If the spaCy model is missing, resume parsing returns 503 with the install command in the error detail.

## API contract summary (for the frontend team)

All endpoints live under `/api/v1`. Errors use FastAPI's `{"detail": ...}` shape.

| Method | Path | Roles | Purpose |
|---|---|---|---|
| POST | /auth/signup | public | create account (student/faculty/recruiter) → `{user, access_token, refresh_token}` |
| POST | /auth/login | public | `{email, password, remember_me?}` → same shape as signup |
| POST | /auth/refresh | public | `{refresh_token}` → `{access_token}` |
| GET | /auth/me | any | current user |
| GET | /skills?q= | any | autocomplete, limit 20 |
| GET | /profiles/me | student/faculty/recruiter | role-shaped profile + skills (lazy-created) |
| PUT | /profiles/me | student/faculty/recruiter | update own profile (role-specific fields) |
| PUT | /profiles/me/skills | student/faculty | replace skill set, max 50 |
| POST | /resumes | student | multipart upload (PDF/DOCX/TXT, 5 MB) |
| GET | /resumes/me | student | own resumes, metadata only |
| POST | /resumes/{id}/parse | student | skill suggestions (nothing saved) |
| POST | /recruiter/jobs | recruiter | create a job |
| GET | /recruiter/dashboard/stats | recruiter | 4 stat cards |
| GET | /recruiter/jobs/recent | recruiter | own jobs, newest first, limit 5 |
| GET | /recruiter/candidates/recent | recruiter | latest 5 students |
| GET | /recruiter/analytics/skills | recruiter | skill distribution across students |
| GET | /recruiter/talent-search?q=&skills= | recruiter | student search, semantic matchScore |
| GET | /matches | student | jobs ranked by match score + gap analysis |
| POST | /jobs/{id}/apply | student | apply (409 if already applied) |
| GET | /applications | student | own applications |
| GET | /recruiter/applications | recruiter | applications on own jobs |
| PATCH | /recruiter/applications/{id}/status | recruiter | set status |
| GET | /opportunities?type=&q= | any | faculty opportunities list |
| POST | /opportunities | faculty/recruiter | create an opportunity |
| POST | /opportunities/{id}/apply | faculty | apply (409 if already applied) |
| GET | /opportunities/applications | faculty | own applications |
| GET | /recommendations/courses | student | course suggestions for skill gaps |

## Checks

```sh
.venv/Scripts/ruff check .
.venv/Scripts/pytest
```
