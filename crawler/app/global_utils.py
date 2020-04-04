import datetime
import gettext
from io import StringIO
from typing import NamedTuple, Iterator, Set, List

import httpx
import pandas
import pycountry
from loguru import logger

from common import HTTPError, Crawler, ReportType
from config import HARD_COUNTRY_FIXES, SKIPPED_GLOBAL_COUNTRIES

polish = gettext.translation('iso3166',
                             pycountry.LOCALES_DIR,
                             languages=['pl'])


def cssegi_url(date: datetime.datetime):
    return (
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19'
        '/master/csse_covid_19_data'
        '/csse_covid_19_daily_reports/'
        f'{datetime.datetime.strftime(date, "%m-%d-%Y")}.csv'
    )


def get_polish_name(country_name: str) -> str:
    if country_name in HARD_COUNTRY_FIXES:
        return HARD_COUNTRY_FIXES[country_name]
    try:
        country = pycountry.countries.search_fuzzy(country_name)[0]
        country_name = polish.gettext(country.name)
    except LookupError:
        logger.warning(f"Couldn't translate '{country_name}'")
    return country_name


class GlobalCrawler(Crawler):
    report_type = ReportType.GLOBAL
    reports_since = datetime.datetime(year=2020, month=1, day=22)

    @classmethod
    def get_missing_record_dates(cls) -> List[datetime.datetime]:
        return super().get_missing_record_dates()

    def get_global_cov_data(self) -> Iterator[NamedTuple]:
        url = cssegi_url(self.date)
        with httpx.Client() as client:
            data = client.get(url)
        if data.status_code == 404:
            raise self.DataNotAvailable
        if data.status_code != 200:
            raise HTTPError(
                f'date: {self.date}, code: {data.status_code}')

        df = pandas.read_csv(StringIO(data.text))
        df = df.rename(columns={
            'Country/Region': 'Country_Region'
        })
        df = df[['Country_Region', 'Deaths', 'Recovered', 'Confirmed']]
        df['Country_Region'] = df['Country_Region'].str.replace(r"\(.*\)",
                                                                "")
        df['Country_Region'] = df['Country_Region'].apply(
            self.translate_country_name)
        return df.groupby(['Country_Region']).sum().itertuples()

    def translate_country_name(self, name):
        if name in SKIPPED_GLOBAL_COUNTRIES:
            return "__removed__"
        name = get_polish_name(name)
        return name

    def fetch(self):
        global_cov_data = self.get_global_cov_data()
        for (country_name, total_deaths, total_recoveries, total_cases) \
                in global_cov_data:
            if country_name == '__removed__':
                continue
            region_id = self.get_region_id(country_name)
            self.submit_day_report(
                region_id=region_id,
                cases=total_cases,
                deaths=total_deaths,
                recoveries=total_recoveries
            )
        self.submit_download_success()


