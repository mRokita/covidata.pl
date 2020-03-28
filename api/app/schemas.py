from typing import List, Set, Any, Type

from pydantic import BaseModel
import datetime


class RegionBase(BaseModel):
    name: str
    is_poland: bool = False


class RegionCreate(RegionBase):
    pass


class Region(RegionBase):
    id: int


class DayReportBase(BaseModel):
    date: datetime.date = datetime.date.today()
    total_cases: int = 0
    total_deaths: int = 0
    region_id: int


class DayReportCreate(DayReportBase):
    pass


class DayReport(DayReportBase):
    id: int


class HTTP409(BaseModel):
    conflicting_object: BaseModel

