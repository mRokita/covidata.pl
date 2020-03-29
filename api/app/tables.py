from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, \
    and_, UniqueConstraint
from sqlalchemy import Table, MetaData
from sqlalchemy.sql import TableClause

from schemas import DayReport


metadata = MetaData()

regions = Table(
    'regions',
    metadata,
    Column('id', Integer, primary_key=True, index=True),
    Column('is_poland', Boolean),
    Column('name', String, unique=True, index=True)
)

day_reports = Table(
    'day_reports',
    metadata,
    Column('date', Date, primary_key=True, index=True),
    Column('total_cases', Integer),
    Column('total_deaths', Integer),
    Column('region_id', Integer, ForeignKey('regions.id', ondelete='CASCADE'),
           primary_key=True, index=True),
    UniqueConstraint('date', 'region_id')
)

users = Table(
    'users',
    metadata,
    Column('id', Integer, primary_key=True, index=True),
    Column('username', String, unique=True, index=True),
    Column('hashed_password', String),
)
