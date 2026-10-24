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

## Checks

```sh
.venv/Scripts/ruff check .
.venv/Scripts/pytest
```
