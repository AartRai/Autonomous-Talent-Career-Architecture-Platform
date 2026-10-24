"""Add jobs.embedding vector(384) column.

Revision ID: 0005
Revises: 0004
Create Date: 2026-10-24

"""
import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision: str = "0005"
down_revision: str | None = "0004"
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    op.add_column("jobs", sa.Column("embedding", Vector(384), nullable=True))


def downgrade() -> None:
    op.drop_column("jobs", "embedding")
