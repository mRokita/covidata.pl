"""
Database metadata
WARNING: don't use the default kwarg for columns,
because encode/databases doesn't really support it.
Specify the default value in shemas.py instead, and just use
BaseModel.get(exclude_unset=True) for SQL UPDATE queries
"""
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, \
    UniqueConstraint
from sqlalchemy import Table, MetaData


metadata = MetaData()

regions = Table(
    'regions',
    metadata,
    Column('id', Integer, primary_key=True, index=True, nullable=False),
    Column('is_poland', Boolean, nullable=False),
    Column('name', String, unique=True, index=True, nullable=False)
)

day_reports = Table(
    'day_reports',
    metadata,
    Column('date', Date, primary_key=True, index=True, nullable=False),
    Column('total_cases', Integer, nullable=False),
    Column('total_deaths', Integer, nullable=False),
    Column('total_recoveries', Integer, nullable=False),
    Column('region_id', Integer, ForeignKey('regions.id', ondelete='CASCADE'),
           nullable=False, primary_key=True, index=True),
    UniqueConstraint('date', 'region_id')
)

users = Table(
    'users',
    metadata,
    Column('id', Integer, primary_key=True, index=True),
    Column('username', String, unique=True, index=True),
    Column('hashed_password', String),
)
