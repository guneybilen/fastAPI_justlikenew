"""create image table

Revision ID: fca06ae05228
Revises: ff9dac589eea
Create Date: 2022-07-10 12:30:24.649736

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision = 'fca06ae05228'
down_revision = 'ff9dac589eea'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'image',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('item_image1',  sa.String(100), nullable=True),
        sa.Column('item_image2',  sa.String(100), nullable=True),
        sa.Column('item_image3',  sa.String(100), nullable=True),
        sa.Column('item_id', sa.Integer, sa.ForeignKey("item.id"), nullable=False),
        sa.Column('created_date', sa.DateTime, nullable=False, default=datetime.utcnow),
        sa.Column('updated_date', sa.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow ),
    )
      

def downgrade() -> None:
      op.drop_table('image')
