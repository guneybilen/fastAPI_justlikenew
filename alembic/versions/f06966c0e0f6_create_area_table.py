"""create area table

Revision ID: f06966c0e0f6
Revises: 0643ed67d10d
Create Date: 2022-07-10 13:19:24.441312

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = 'f06966c0e0f6'
down_revision = '0643ed67d10d'
branch_labels = None
depends_on = None


def upgrade() -> None:
     op.create_table(
        'area',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('created_date', sa.DateTime, nullable=False, default=datetime.utcnow),
        sa.Column('updated_date', sa.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow ),
        sa.Column('user_id', sa.Integer, sa.ForeignKey("user.id"), nullable=True),
        sa.Column("scopes", sa.ARRAY(sa.String), default=["READ", "WRITE", "BOTH"], nullable= False),
        sa.Column("permission_to_model", sa.ARRAY(sa.String), default=["IMAGES", "USERS", "ITEMS"], nullable= False),
        sa.Column("permission_to_user", sa.String(50), default="OWNER", nullable= False),
    )
     
    
def downgrade() -> None:
     op.drop_table('area')
