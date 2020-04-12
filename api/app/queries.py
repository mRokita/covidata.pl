from datetime import datetime

from sqlalchemy import and_
from sqlalchemy.sql import TableClause

from database import database
from schemas import DayReport, User, DownloadedReport
from tables import day_reports, users, downloaded_reports, ReportType


def filter_by_day_report(query: TableClause,
                         region_id: int,
                         date: datetime.date) -> TableClause:
    return query.where(
        and_(day_reports.c.date == date,
             day_reports.c.region_id == region_id)
    )


async def get_day_report(region_id: int, date: datetime.date):
    return await database.fetch_one(
        filter_by_day_report(day_reports.select(), region_id, date)
    )


async def day_report_exists(region_id: int, date: datetime.date) -> bool:
    return bool(await get_day_report(region_id, date))


async def get_user(username: str):
    db_user = await database.fetch_one(users.select().where(
        users.c.username == username))
    return User(**db_user) if db_user else None


async def downloaded_report_exists(
        downloaded_report: DownloadedReport):
    query = downloaded_reports.select().where(
        and_(
            downloaded_reports.c.date == downloaded_report.date,
            downloaded_reports.c.type == downloaded_report.type
        )
    )
    return bool(await database.fetch_val(query))


async def insert_downloaded_report(
        downloaded_report: DownloadedReport):
    return await database.execute(
        downloaded_reports.insert(),
        values=downloaded_report.dict()
    )


async def get_downloaded_reports(type: ReportType = None):
    query = downloaded_reports.select()
    if type:
        query = query.where(downloaded_reports.c.type == type)
    return await database.fetch_all(query)
