"""create limit table

Revision ID: 0643ed67d10d
Revises: fca06ae05228
Create Date: 2022-07-10 12:52:09.443773

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = '0643ed67d10d'
down_revision = 'fca06ae05228'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'limit',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('created_date', sa.DateTime, nullable=False, default=datetime.utcnow),
        sa.Column('updated_date', sa.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow ),
        sa.Column('access_token', sa.String, nullable=False),
        sa.Column('token_type', sa.String, nullable=False, default="bearer"),

        sa.Column('user_id', sa.Integer, sa.ForeignKey("user.id"), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('limit')

