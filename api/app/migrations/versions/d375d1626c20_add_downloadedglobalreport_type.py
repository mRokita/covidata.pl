"""add downloadedglobalreport.type

Revision ID: d375d1626c20
Revises: 534b0f2273db
Create Date: 2020-04-01 03:03:20.276959

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
from sqlalchemy.dialects import postgresql

from settings import DATABASE_URL, TESTING

revision = 'd375d1626c20'
down_revision = '534b0f2273db'
branch_labels = None
depends_on = None


def upgrade():

    # ### commands auto generated by Alembic - please adjust! ###
    is_sqlite = DATABASE_URL.startswith('sqlite')
    reporttype = postgresql.ENUM('GLOBAL', 'LOCAL', name='reporttype')
    reporttype.create(op.get_bind())
    if is_sqlite and not TESTING:
        if input("This will cause data loss on SQLite."
                 " Are you sure? [Y/n]").lower() != 'y':
            raise ValueError('canceled')
    with op.batch_alter_table('downloaded_global_reports', schema=None) as batch_op:
        if is_sqlite:
            op.drop_table('downloaded_global_reports')
            op.create_table('downloaded_reports',
                            sa.Column('date', sa.Date(), nullable=False),
                            sa.PrimaryKeyConstraint('date')
            )
        else:
            batch_op.rename_table('downloaded_global_reports', 'downloaded_reports')

    with op.batch_alter_table('downloaded_reports', schema=None) as batch_op:
        batch_op.add_column(sa.Column('type', sa.Enum('GLOBAL', 'LOCAL', name='reporttype'), nullable=False, server_default='GLOBAL'))
        batch_op.create_index(batch_op.f('ix_downloaded_reports_type'), ['type'], unique=False)
        batch_op.create_index(batch_op.f('ix_downloaded_reports_date'), ['date'], unique=False)
        batch_op.create_unique_constraint('uq_downloaded_reports_date_type', ['date', 'type'])
        if not is_sqlite:
            batch_op.drop_index('ix_downloaded_global_reports_date')

    # ### end Alembic commands ###


def downgrade():
    is_sqlite = DATABASE_URL.startswith('sqlite')
    if is_sqlite and not TESTING:
        if input("This will cause data loss on SQLite."
                 " Are you sure? [Y/n]").lower() != 'y':
            raise ValueError('canceled')
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('downloaded_reports', schema=None) as batch_op:
        if is_sqlite:
            op.drop_table('downloaded_reports')
            op.create_table('downloaded_global_reports',
                        sa.Column('date', sa.Date(), nullable=False),
                        sa.PrimaryKeyConstraint('date')
            )
        else:
            batch_op.rename_table('downloaded_reports', 'downloaded_global_reports')

    with op.batch_alter_table('downloaded_global_reports', schema=None) as batch_op:
        batch_op.create_index('ix_downloaded_global_reports_date', ['date'], unique=True)
        if not is_sqlite:
            batch_op.drop_constraint('uq_downloaded_reports_date_type',  type_='unique')
            batch_op.drop_index(batch_op.f('ix_downloaded_reports_date'))
            batch_op.drop_index(batch_op.f('ix_downloaded_reports_type'))
            batch_op.drop_column('type')

    reporttype = postgresql.ENUM('GLOBAL', 'LOCAL', name='reporttype')
    reporttype.drop(op.get_bind())
    # ### end Alembic commands ###
