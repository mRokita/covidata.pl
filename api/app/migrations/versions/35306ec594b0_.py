"""empty message

Revision ID: 35306ec594b0
Revises: fa6eda38f723
Create Date: 2020-03-25 07:59:26.605968

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '35306ec594b0'
down_revision = 'fa6eda38f723'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_regions_is_poland', table_name='regions')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('ix_regions_is_poland', 'regions', ['is_poland'], unique=True)
    # ### end Alembic commands ###