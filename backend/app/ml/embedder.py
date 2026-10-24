from functools import lru_cache

from fastapi.concurrency import run_in_threadpool
from sentence_transformers import SentenceTransformer

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIM = 384


class EmbedderUnavailable(RuntimeError):
    """Raised when the embedding model cannot be loaded."""


@lru_cache
def get_embedder() -> SentenceTransformer:
    try:
        return SentenceTransformer(EMBEDDING_MODEL)
    except Exception as exc:
        raise EmbedderUnavailable(
            f"Could not load embedding model '{EMBEDDING_MODEL}'. "
            "The model is downloaded automatically on first use (internet required)."
        ) from exc


async def embed_text(text: str) -> list[float]:
    embedder = get_embedder()
    vector = await run_in_threadpool(embedder.encode, text)
    return [float(value) for value in vector]


async def embed_texts(texts: list[str]) -> list[list[float]]:
    embedder = get_embedder()
    vectors = await run_in_threadpool(embedder.encode, texts)
    return [[float(value) for value in vector] for vector in vectors]
