from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date
from sqlalchemy.orm import relationship
from database import Base


class Region(Base):
    __tablename__ = 'regions'

    id = Column(Integer, primary_key=True, index=True)
    is_poland = Column(Boolean)
    name = Column(String, unique=True, index=True)

    day_reports = relationship('DayReport', back_populates='region')


class DayReport(Base):
    __tablename__ = 'day_reports'

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    total_cases = Column(Integer)
    total_deaths = Column(Integer)
    region_id = Column(Integer, ForeignKey('regions.id'))

    region = relationship('Region', back_populates='day_reports')

