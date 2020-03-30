from datetime import datetime

from sqlalchemy import and_
from sqlalchemy.sql import TableClause

from database import database
from schemas import DayReport, User, DownloadedGlobalReport
from tables import day_reports, users, downloaded_global_reports


def filter_by_day_report(query: TableClause,
                         region_id: int,
                         date: datetime.date) -> TableClause:
    return query.where(
        and_(day_reports.c.date == date,
             day_reports.c.region_id == region_id)
    )


async def get_day_report(region_id: int, date: datetime.date) -> DayReport:
    return await database.fetch_one(
        filter_by_day_report(day_reports.select(), region_id, date)
    )


async def day_report_exists(region_id: int, date: datetime.date) -> bool:
    return bool(await get_day_report(region_id, date))


async def get_user(username: str):
    db_user = await database.fetch_one(users.select().where(
        users.c.username == username))
    return User(**db_user) if db_user else None


async def downloaded_global_report_exists(
        downloaded_global_report: DownloadedGlobalReport):
    query = downloaded_global_reports.select().where(
        downloaded_global_reports.c.date == downloaded_global_report.date
    )
    return bool(await database.fetch_val(query))


async def insert_downloaded_global_report(
        global_day_report: DownloadedGlobalReport):
    return await database.execute(
        downloaded_global_reports.insert(),
        values=global_day_report.dict()
    )


async def get_downloaded_global_reports():
    return await database.fetch_all(
        downloaded_global_reports.select()
    )
