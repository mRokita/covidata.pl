import datetime
from collections import Counter
from datetime import datetime
from json import loads
import re
from typing import List

from httpx import Client
from loguru import logger

from common import Crawler, ReportType
from config import WAYBACK_SNAPSHOT_LIST_URL, PL_GOV_URL


class LocalCrawler(Crawler):
    report_type = ReportType.LOCAL
    reports_since = datetime(year=2020, month=3, day=9)
    enable_today = True

    @classmethod
    def get_missing_record_dates(cls) -> List[datetime]:
        return super().get_missing_record_dates() + [datetime.today()]

    def fetch(self):
        data = self.get_data()
        regions = dict()
        for row in data:
            name = row['Województwo'].lower()
            if name == 'cała polska':
                name = 'Polska'
            total_cases = row.get(
                'Liczba', None) or row.get('Liczba przypadków')
            total_deaths = row.get('Liczba zgonów', 0)
            total_cases = int(total_cases) if total_cases else 0
            total_deaths = int(total_deaths) if total_deaths else 0

            row_counter = Counter({
                'total_cases': total_cases,
                'total_deaths': total_deaths
            })
            regions[name] = regions.get(name, Counter()) + row_counter
        for name, counter in regions.items():
            region_id = self.get_region_id(name)
            self.submit_day_report(region_id=region_id,
                                   cases=counter['total_cases'],
                                   deaths=counter['total_deaths'])

        self.submit_download_success()

    def submit_region(self, name: str) -> int:
        if name != 'Polska':
            return super().submit_region(name)
        else:
            return super()._submit_region(name, ReportType.GLOBAL)

    @staticmethod
    def parse_time(snap_timestamp: str) -> datetime:
        month = int(snap_timestamp[:2])
        day = int(snap_timestamp[2:4])
        hours = int(snap_timestamp[4:6])
        minutes = int(snap_timestamp[6:8])
        return datetime(2020, month, day, hours, minutes)

    def get_download_url(self) -> str:
        """
        Retrieve urls for web.archive.org snapshots of gov.pl cov site
        :return: Urls for gov.pl COV site
        """
        if self.date.date() == datetime.today().date():
            return PL_GOV_URL

        with Client() as c:
            res = c.get(WAYBACK_SNAPSHOT_LIST_URL)

        snap_timestamps = map(  # That's just to parse stupid wayback's format
            lambda i: str(i[0]).zfill(10),
            reversed(res.json().get('items', []))
        )

        for timestamp in snap_timestamps:
            snap_time = self.parse_time(timestamp)
            if snap_time.date() == self.date.date():
                return (f'http://web.archive.org/web'
                        f'/2020{timestamp}id_/{PL_GOV_URL}')
        raise self.DataNotAvailable

    def get_data(self) -> dict:
        """
        Download data, get the tag with json stats,
        then strip html tags and return a dict containing stats
        :param url: Url of the gov.pl site containing coronavirus stats
        :return: A dict containing deserialized stats
        """
        url = self.get_download_url()
        tag = None
        with Client() as c:
            res = c.get(url)
            for line in res.iter_lines():
                if 'id="registerData"' in line:
                    tag = line
                    break
        return loads(loads(re.sub('<(.+?)>', '', tag))["parsedData"])
