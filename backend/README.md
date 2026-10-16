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
.venv/Scripts/uvicorn app.main:app --reload --port 8000
```

- `GET http://localhost:8000/health` → `{"status": "ok"}`
- Swagger UI: `http://localhost:8000/docs`
- CORS allows the Vite dev origin `http://localhost:5173`
- Resume uploads are stored under `storage/resumes` (gitignored, configurable via `RESUME_STORAGE_DIR`); extracted text lives in the DB. Uploads are capped at `MAX_RESUME_UPLOAD_MB` (default 5 MB) and validated by file signature.
- If the spaCy model is missing, resume parsing returns 503 with the install command in the error detail.

## Checks

```sh
.venv/Scripts/ruff check .
.venv/Scripts/pytest
```
