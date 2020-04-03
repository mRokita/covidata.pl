import datetime
from typing import Dict, Set

import httpx
from loguru import logger

from config import API_HOST

LOCAL = 'local'    # Used when submitting downloaded day report,
GLOBAL = 'global'  # local is for regions of poland


class Client(httpx.Client):
    def __init__(self):
        super().__init__(
            base_url=f'http://{API_HOST}/api/v1/',
            headers={'Authorization': 'Bearer ***REMOVED***'}
        )


class HTTPError(Exception):
    pass


def get_missing_record_dates(type: str):
    """
    Get dates with missing records for type
    :param type: common.GLOBAL or common.LOCAL
    :return:
    """
    if type not in (GLOBAL, LOCAL):
        raise ValueError(f'Type must be one of ({GLOBAL}, {LOCAL}")')
    today = datetime.datetime.today()
    with Client() as client:
        res = client.get(f'downloaded_reports?type={type}')
        if res.status_code != 200:
            raise HTTPError(res.status_code)
    downloaded = {date_from_str(d['date']) for d in res.json()}
    required = date_set(
        start=datetime.datetime(year=2020, month=1, day=22),
        end=today
    )
    missing = required - downloaded
    return missing


def date_set(
        start: datetime.datetime, end: datetime.date
) -> Set[datetime.datetime]:
    # We don't want to download for today, because they update it the next day.
    # No need for days += 1
    days = (end - start).days
    return {start + datetime.timedelta(days=i) for i in range(days)}

def date_str(date: datetime.datetime) -> str:
    return datetime.datetime.strftime(date, "%Y-%m-%d")


def date_from_str(date: str) -> datetime.datetime:
    return datetime.datetime.strptime(date, "%Y-%m-%d")


def get_regions() -> Dict[str, int]:
    with Client() as client:
        res = client.get('regions')
    if res.status_code != 200:
        raise HTTPError(res.status_code)
    return dict([(r['name'], r['id']) for r in res.json()])


def submit_region(name: str, is_poland: bool = False) -> int:
    """Send the region to the server"""
    with Client() as client:
        res = client.post(
            'regions',
            json={
                'name': name,
                'is_poland': is_poland
            }
        )
    if res.status_code == 200:
        return res.json()['id']
    if res.status_code != 409:
        raise HTTPError(res.status_code)
    return res.json()['conflicting_object']['id']


def submit_day_report(day: datetime.datetime, *, region_id: int,
                      cases: int, deaths: int, recoveries: int):
    """Send the day report to the server"""
    with Client() as client:
        res = client.put(
            f'regions/{region_id}/day_reports/',
            json={
                'date': date_str(day),
                'total_cases': cases,
                'total_deaths': deaths,
                'total_recoveries': recoveries
            }
        )
        if res.status_code not in (200, 201):
            raise HTTPError(res.status_code)


def submit_download_success(day: datetime.datetime, type: str):
    """Notify the server about a successfull download"""
    with Client() as client:
        res = client.post(
            'downloaded_reports',
            json={
                'date': date_str(day),
                'type': type
            }
        )
    if not res.status_code == 200:
        logger.error(res.text)
        logger.error("Couldn't submit the report for " + date_str(day))
    else:
        logger.info("Downloaded data for " + date_str(day))