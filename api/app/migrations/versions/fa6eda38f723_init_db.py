"""Init db

Revision ID: fa6eda38f723
Revises: 
Create Date: 2020-03-25 01:49:47.566229

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fa6eda38f723'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('regions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('is_poland', sa.Boolean(), nullable=True),
    sa.Column('name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_regions_id'), 'regions', ['id'], unique=False)
    op.create_index(op.f('ix_regions_is_poland'), 'regions', ['is_poland'], unique=True)
    op.create_index(op.f('ix_regions_name'), 'regions', ['name'], unique=True)
    op.create_table('day_reports',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.Date(), nullable=True),
    sa.Column('total_cases', sa.Integer(), nullable=True),
    sa.Column('total_deaths', sa.Integer(), nullable=True),
    sa.Column('region_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['region_id'], ['regions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_day_reports_id'), 'day_reports', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_day_reports_id'), table_name='day_reports')
    op.drop_table('day_reports')
    op.drop_index(op.f('ix_regions_name'), table_name='regions')
    op.drop_index(op.f('ix_regions_is_poland'), table_name='regions')
    op.drop_index(op.f('ix_regions_id'), table_name='regions')
    op.drop_table('regions')
    # ### end Alembic commands ###