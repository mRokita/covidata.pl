from typing import List

from pydantic import BaseModel
from datetime import date


class RegionBase(BaseModel):
    name: str
    is_poland: bool = False


class RegionCreate(RegionBase):
    pass


class Region(RegionBase):
    id: int
    day_reports: List['DayReport'] = []

    class Config:
        orm_mode = True

class DayReportBase(BaseModel):
    date: date
    total_cases: int = 0
    total_deaths: int = 0


class DayReportCreate(DayReportBase):
    region_id: int


class DayReport(DayReportBase):
    id: int
    region: RegionBase

    class Config:
        orm_mode = True