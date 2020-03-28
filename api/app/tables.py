from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date
from sqlalchemy import Table, MetaData

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
    Column('id', Integer, primary_key=True, index=True),
    Column('date', Date),
    Column('total_cases', Integer),
    Column('total_deaths', Integer),
    Column('region_id', Integer, ForeignKey('regions.id'))
)

