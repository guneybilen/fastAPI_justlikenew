"""change float to string for price column

Revision ID: eeb74ca8c963
Revises: f06966c0e0f6
Create Date: 2022-07-29 10:31:25.544466

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import Column, String

# revision identifiers, used by Alembic.
revision = 'eeb74ca8c963'
down_revision = 'f06966c0e0f6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('item', Column('price', String(), nullable=True))


def downgrade() -> None:
    op.drop_column('item', 'price')
