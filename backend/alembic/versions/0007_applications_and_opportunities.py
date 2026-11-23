"""Create applications, opportunities, and opportunity_applications tables.

Revision ID: 0007
Revises: 0006
Create Date: 2026-10-24

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0007"
down_revision: str | None = "0006"
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    op.create_table(
        "applications",
        sa.Column(
            "id", sa.Uuid(), server_default=sa.text("gen_random_uuid()"), nullable=False
        ),
        sa.Column("student_id", sa.Uuid(), nullable=False),
        sa.Column("job_id", sa.Uuid(), nullable=False),
        sa.Column(
            "status", sa.String(length=16), server_default=sa.text("'Applied'"), nullable=False
        ),
        sa.Column("cover_note", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["student_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("student_id", "job_id", name="uq_applications_student_job"),
        sa.CheckConstraint(
            "status IN ('Applied', 'Under Review', 'Interview Stage', 'Shortlisted', 'Rejected')",
            name="ck_applications_status",
        ),
    )

    op.create_table(
        "opportunities",
        sa.Column(
            "id", sa.Uuid(), server_default=sa.text("gen_random_uuid()"), nullable=False
        ),
        sa.Column("title", sa.String(length=300), nullable=False),
        sa.Column("type", sa.String(length=20), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("organization", sa.String(length=200), nullable=False),
        sa.Column("location", sa.String(length=150), nullable=True),
        sa.Column(
            "status", sa.String(length=8), server_default=sa.text("'open'"), nullable=False
        ),
        sa.Column("posted_by_id", sa.Uuid(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["posted_by_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.CheckConstraint(
            "type IN ('Sabbatical', 'FDP', 'Consultancy RFP', 'Research Project')",
            name="ck_opportunities_type",
        ),
        sa.CheckConstraint("status IN ('open', 'closed')", name="ck_opportunities_status"),
    )

    op.create_table(
        "opportunity_applications",
        sa.Column(
            "id", sa.Uuid(), server_default=sa.text("gen_random_uuid()"), nullable=False
        ),
        sa.Column("opportunity_id", sa.Uuid(), nullable=False),
        sa.Column("faculty_id", sa.Uuid(), nullable=False),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column(
            "status", sa.String(length=12), server_default=sa.text("'Applied'"), nullable=False
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["opportunity_id"], ["opportunities.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["faculty_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("opportunity_id", "faculty_id", name="uq_opportunity_applications"),
        sa.CheckConstraint(
            "status IN ('Applied', 'Accepted', 'Rejected')",
            name="ck_opportunity_applications_status",
        ),
    )


def downgrade() -> None:
    op.drop_table("opportunity_applications")
    op.drop_table("opportunities")
    op.drop_table("applications")
