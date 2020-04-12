import datetime
from enum import Enum
from typing import Dict, Set, List

import httpx
from loguru import logger

from config import API_HOST


class ReportType(str, Enum):
    LOCAL = 'local'  # For poland
    GLOBAL = 'global'


class Client(httpx.Client):
    def __init__(self):
        super().__init__(
            base_url=f'http://{API_HOST}/api/v1/',
            headers={'Authorization': 'Bearer ***REMOVED***'}
        )


class HTTPError(Exception):
    pass


class Crawler:
    report_type: ReportType = None
    reports_since: datetime.datetime = None
    enable_today: bool = False

    class DataNotAvailable(Exception):
        pass

    def __init__(self, date: datetime.datetime):
        self.date = date
        self._regions = self.get_regions()

    def get_download_url(self) -> str:
        raise NotImplementedError

    @classmethod
    def get_missing_record_dates(cls) -> List[datetime.datetime]:
        """
        Get dates with missing records for type
        :return:
        """
        today = datetime.datetime.today()
        with Client() as client:
            res = client.get(f'downloaded_reports'
                             f'?type={cls.report_type.value}')
            if res.status_code != 200:
                raise HTTPError(res.status_code)
        downloaded = {date_from_str(d['date']) for d in res.json()}
        required = date_set(
            start=cls.reports_since,
            end=today
        )
        missing = list(required - downloaded)
        missing += [datetime.datetime.today()]
        return sorted(missing)

    def get_region_id(self, name):
        region_id = self._regions.get(name, None)
        if not region_id:
            region_id = self.submit_region(name)
        return region_id

    def fetch(self):
        """
        Abstract, should use submit_report to submit then call
        submit_download_success
        """
        raise NotImplementedError

    @property
    def is_today(self) -> bool:
        return self.date.date() == datetime.datetime.today().date()

    def submit_download_success(self):
        """Notify the server about a successfull download"""
        with Client() as client:
            res = client.post(
                'downloaded_reports',
                json={
                    'date': date_str(self.date),
                    'type': self.report_type.value
                }
            )
        if res.status_code == 409:
            logger.warning(f"Record for {date_str(self.date)} has been "
                           f"submitted already. Update successful.")
            return
        elif not res.status_code == 200:
            logger.error(res.text)
            logger.error("Couldn't submit the report for " + date_str(self.date))
        else:
            logger.info("Downloaded data for " + date_str(self.date))

    @classmethod
    def get_regions(cls) -> Dict[str, int]:
        with Client() as client:
            res = client.get('regions')
        if res.status_code != 200:
            raise HTTPError(res.status_code)
        return dict([(r['name'], r['id']) for r in res.json()])

    def submit_region(self, name: str) -> int:
        """
        Send the region to the server, override to add some custom logic,
        like specifying a different report type.
        """
        return self._submit_region(name, self.report_type)

    @staticmethod
    def _submit_region(name: str, report_type: ReportType) -> int:
        """
        Should be only called internally unless you want to add some logic
        """
        with Client() as client:
            res = client.post(
                'regions',
                json={
                    'name': name,
                    'report_type': report_type.value
                }
            )
        if res.status_code == 200:
            return res.json()['id']
        if res.status_code != 409:
            logger.warning("Looks like there is a record for that day "
                           "in the db already")
        return res.json()['conflicting_object']['id']

    def submit_day_report(self, *,
                          region_id: int,
                          cases: int = None,
                          deaths: int = None,
                          recoveries: int = None):
        """Send the day report to the server"""
        data = {'date': date_str(self.date)}
        if cases:
            data.update({'total_cases': cases})
        if deaths:
            data.update({'total_deaths': deaths})
        if recoveries:
            data.update({'total_recoveries': recoveries})
        with Client() as client:
            res = client.put(
                f'regions/{region_id}/day_reports/',
                json=data
            )
        if res.status_code not in (200, 201):
            raise HTTPError(res.status_code)


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


