"""create item table

Revision ID: ff9dac589eea
Revises: 8c1c7409f4e5
Create Date: 2022-07-10 08:58:37.265281

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision = 'ff9dac589eea'
down_revision = '8c1c7409f4e5'
branch_labels = None
depends_on = None


def upgrade() -> None:
        op.create_table(
        'item',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('price', sa.Float(7,2), nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=False, default=True),
        sa.Column('created_date', sa.DateTime, nullable=False, default=datetime.utcnow),
        sa.Column('updated_date', sa.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow ),
        sa.Column('model', sa.String, nullable=True),
        sa.Column('brand', sa.String, nullable=True),
        sa.Column('location', sa.String, nullable=True),
        sa.Column('description', sa.String, nullable=True),

        sa.Column('seller_id', sa.Integer, sa.ForeignKey("user.id"), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('item')


