from pydantic import BaseModel
import datetime

from tables import ReportType


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
    total_recoveries: int = 0


class DayReportCreate(DayReportBase):
    pass


class DayReport(DayReportBase):
    region_id: int


class LatestDayReport(DayReport):
    region_name: str


class DownloadedReport(BaseModel):
    date: datetime.date
    type: ReportType


class HTTP409(BaseModel):
    conflicting_object: BaseModel


class BaseUser(BaseModel):
    username: str


class UserCreate(BaseUser):
    password: str


class User(BaseUser):
    id: int
    hashed_password: str


class TokenData(BaseModel):
    username: str
