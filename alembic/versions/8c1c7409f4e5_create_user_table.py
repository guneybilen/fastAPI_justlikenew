"""create user table

Revision ID: 8c1c7409f4e5
Revises: 
Create Date: 2022-07-10 08:05:33.366033

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = '8c1c7409f4e5'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'user',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('username', sa.String(50), nullable=False, unique=True),
        sa.Column('email',  sa.String(100), nullable=False, unique=True),
        sa.Column('first_name',  sa.String(100), nullable=False),
        sa.Column('last_name',  sa.String(100), nullable=False),
        sa.Column('security_name',  sa.String(100), nullable=False),
        sa.Column('security_answer',  sa.String(255), nullable=False),
        sa.Column('phone_number',  sa.String(100), nullable=True),
        sa.Column('hashed_password', sa.String(255)),
        sa.Column('is_active', sa.Boolean, default=False, nullable=False),
        sa.Column('is_superuser', sa.Boolean, default=False, nullable=False),
        sa.Column('created_date', sa.DateTime, default=datetime.utcnow),
        sa.Column('updated_date', sa.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow ),
    )


def downgrade() -> None:
    op.drop_table('user')
