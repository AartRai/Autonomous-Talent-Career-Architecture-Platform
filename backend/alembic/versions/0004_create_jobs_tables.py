"""Create jobs, job_required_skills, and job_preferred_skills tables.

Revision ID: 0004
Revises: 0003
Create Date: 2026-10-24

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0004"
down_revision: str | None = "0003"
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    op.create_table(
        "jobs",
        sa.Column(
            "id", sa.Uuid(), server_default=sa.text("gen_random_uuid()"), nullable=False
        ),
        sa.Column("recruiter_id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("company_name", sa.String(length=150), nullable=False),
        sa.Column("location", sa.String(length=150), nullable=False),
        sa.Column("work_mode", sa.String(length=16), nullable=False),
        sa.Column("job_type", sa.String(length=16), nullable=False),
        sa.Column("experience_level", sa.String(length=16), nullable=False),
        sa.Column("salary_range", sa.String(length=100), nullable=True),
        sa.Column("openings_count", sa.Integer(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("responsibilities", sa.Text(), nullable=False),
        sa.Column("qualifications", sa.Text(), nullable=False),
        sa.Column(
            "status", sa.String(length=16), server_default=sa.text("'active'"), nullable=False
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["recruiter_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.CheckConstraint("work_mode IN ('On-site', 'Hybrid', 'Remote')", name="ck_jobs_work_mode"),
        sa.CheckConstraint(
            "job_type IN ('Full-time', 'Internship', 'Part-time', 'Contract')",
            name="ck_jobs_job_type",
        ),
        sa.CheckConstraint(
            "experience_level IN ('Fresher', '0–1 years', '1–3 years', '3–5 years', '5+ years')",
            name="ck_jobs_experience_level",
        ),
        sa.CheckConstraint("status IN ('draft', 'active', 'closed')", name="ck_jobs_status"),
        sa.CheckConstraint("openings_count >= 1", name="ck_jobs_openings_count"),
    )

    op.create_table(
        "job_required_skills",
        sa.Column("job_id", sa.Uuid(), nullable=False),
        sa.Column("skill_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["skill_id"], ["skills.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("job_id", "skill_id"),
    )

    op.create_table(
        "job_preferred_skills",
        sa.Column("job_id", sa.Uuid(), nullable=False),
        sa.Column("skill_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["skill_id"], ["skills.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("job_id", "skill_id"),
    )


def downgrade() -> None:
    op.drop_table("job_preferred_skills")
    op.drop_table("job_required_skills")
    op.drop_table("jobs")
