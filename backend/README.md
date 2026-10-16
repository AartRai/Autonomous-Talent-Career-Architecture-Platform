# Synapse Backend

FastAPI backend. Layers: `routers/ -> services/ -> models/`, schemas/ (Pydantic v2), API prefix `/api/v1`.

## Run locally

```sh
cd backend
docker compose up -d --wait          # postgres (pgvector) + redis
python -m venv .venv
.venv/Scripts/pip install -e ".[dev]"
copy .env.example .env               # optional; defaults match compose
alembic upgrade head
.venv/Scripts/uvicorn app.main:app --reload --port 8000
```

- `GET http://localhost:8000/health` → `{"status": "ok"}`
- Swagger UI: `http://localhost:8000/docs`
- CORS allows the Vite dev origin `http://localhost:5173`

## Checks

```sh
.venv/Scripts/ruff check .
.venv/Scripts/pytest
```
