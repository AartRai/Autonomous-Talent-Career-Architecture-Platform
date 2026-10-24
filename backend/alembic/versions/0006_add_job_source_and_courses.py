"""Add job source tracking and courses table.

- jobs.recruiter_id becomes nullable (scraped jobs have no recruiter)
- jobs.source (seeded | user | scraped) + jobs.source_url (unique dedup key)
- experience level gains 'Not specified'
- courses + course_skills tables

Revision ID: 0006
Revises: 0005
Create Date: 2026-10-24

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0006"
down_revision: str | None = "0005"
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    op.alter_column("jobs", "recruiter_id", existing_type=sa.Uuid(), nullable=True)
    op.add_column(
        "jobs",
        sa.Column(
            "source", sa.String(length=8), server_default=sa.text("'user'"), nullable=False
        ),
    )
    op.add_column("jobs", sa.Column("source_url", sa.String(length=500), nullable=True))
    op.create_check_constraint(
        "ck_jobs_source", "jobs", "source IN ('seeded', 'user', 'scraped')"
    )
    op.create_unique_constraint("uq_jobs_source_url", "jobs", ["source_url"])
    op.drop_constraint("ck_jobs_experience_level", "jobs", type_="check")
    op.create_check_constraint(
        "ck_jobs_experience_level",
        "jobs",
        "experience_level IN ('Fresher', '0–1 years', '1–3 years', '3–5 years', '5+ years', 'Not specified')",
    )

    op.create_table(
        "courses",
        sa.Column(
            "id", sa.Uuid(), server_default=sa.text("gen_random_uuid()"), nullable=False
        ),
        sa.Column("title", sa.String(length=300), nullable=False),
        sa.Column("provider", sa.String(length=150), nullable=False),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("url"),
    )

    op.create_table(
        "course_skills",
        sa.Column("course_id", sa.Uuid(), nullable=False),
        sa.Column("skill_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["skill_id"], ["skills.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("course_id", "skill_id"),
    )


def downgrade() -> None:
    op.drop_table("course_skills")
    op.drop_table("courses")
    op.drop_constraint("ck_jobs_experience_level", "jobs", type_="check")
    op.create_check_constraint(
        "ck_jobs_experience_level",
        "jobs",
        "experience_level IN ('Fresher', '0–1 years', '1–3 years', '3–5 years', '5+ years')",
    )
    op.drop_constraint("uq_jobs_source_url", "jobs", type_="unique")
    op.drop_constraint("ck_jobs_source", "jobs", type_="check")
    op.drop_column("jobs", "source_url")
    op.drop_column("jobs", "source")
    op.alter_column("jobs", "recruiter_id", existing_type=sa.Uuid(), nullable=False)
