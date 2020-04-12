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


ISO_LOOKUP_TABLE_URL = ('https://raw.githubusercontent.com/CSSEGISandData/'
            'COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv')


class GlobalCrawler(Crawler):
    report_type = ReportType.GLOBAL
    reports_since = datetime.datetime(year=2020, month=1, day=22)
    country_name_to_pol = dict(**HARD_COUNTRY_FIXES)

    @classmethod
    def update_name_to_iso2(cls):
        logger.info("Loading ISO lookup table")
        with httpx.Client() as client:
            data = client.get(ISO_LOOKUP_TABLE_URL)
        df = pandas.read_csv(StringIO(data.text),
                             usecols=['Country_Region', 'iso2'])
        for index, iso2, name in df.itertuples():
            if pandas.isna(name) or\
                    pandas.isna(iso2) or name in cls.country_name_to_pol:
                continue
            name = name.strip()
            iso2 = iso2.strip()
            country = pycountry.countries.get(alpha_2=iso2)
            if not country:
                logger.error(f'Country {iso2} not found')
            iso_name = country.name
            polish_name = polish.gettext(iso_name)
            cls.country_name_to_pol[name] = polish_name
            logger.info(f'Added translation {name} -> {polish_name}')

    def get_download_url(self) -> str:
        if self.date.date() == datetime.datetime.today().date():
            return ('https://raw.githubusercontent.com/CSSEGISandData'
                    '/COVID-19/web-data/data/cases_country.csv')
        return (
            'https://raw.githubusercontent.com/CSSEGISandData/COVID-19'
            '/master/csse_covid_19_data'
            '/csse_covid_19_daily_reports/'
            f'{datetime.datetime.strftime(self.date, "%m-%d-%Y")}.csv'
        )

    @classmethod
    def get_polish_name(cls, country_name: str) -> str:
        if country_name in SKIPPED_GLOBAL_COUNTRIES:
            return '__removed__'
        if country_name not in cls.country_name_to_pol:
            country = pycountry.countries.get(name=country_name)
            if not country:
                try:
                    country = pycountry.countries.search_fuzzy(country_name)[0]
                except LookupError:
                    pass
            if country:
                polish_name = polish.gettext(country.name)
                logger.info(
                    f'Added translation {country_name} -> {polish_name}')
                cls.country_name_to_pol[country_name] = polish_name
            else:
                cls.update_name_to_iso2()
                if country_name not in cls.country_name_to_pol:
                    logger.warning(f"Couldn't translate '{country_name}'")
                    return country_name
        return cls.country_name_to_pol[country_name]

    @classmethod
    def get_missing_record_dates(cls) -> List[datetime.datetime]:
        return super().get_missing_record_dates()

    def get_global_cov_data(self) -> Iterator[NamedTuple]:
        url = self.get_download_url()
        logger.info(f'Loading {url}...')
        with httpx.Client() as client:
            data = client.get(url)
        if data.status_code == 404:
            raise self.DataNotAvailable
        if data.status_code != 200:
            raise HTTPError(
                f'date: {self.date}, code: {data.status_code}')

        logger.info(f'{url} downloaded, parsing...')
        df = pandas.read_csv(StringIO(data.text))
        logger.info("CSV loaded")
        df = df.rename(columns={
            'Country/Region': 'Country_Region'
        })
        df = df[['Country_Region', 'Deaths', 'Recovered', 'Confirmed']]
        df['Country_Region'] = df['Country_Region'].str.replace(r"\(.*\)",
                                                                "")
        df['Country_Region'] = df['Country_Region'].apply(
            self.translate_country_name)
        logger.info("Parsing done")
        return df.groupby(['Country_Region']).sum().itertuples()

    def translate_country_name(self, name):
        name = self.get_polish_name(name.strip())
        return name

    def fetch(self):
        global_cov_data = self.get_global_cov_data()
        for (country_name, total_deaths, total_recoveries, total_cases) \
                in global_cov_data:
            if country_name == '__removed__':
                continue
            region_id = self.get_region_id(country_name)
            if country_name == 'Polska':
                # We use more recent data from gov.pl for that
                total_cases = None
                total_deaths = None
            self.submit_day_report(
                region_id=region_id,
                cases=total_cases,
                deaths=total_deaths,
                recoveries=total_recoveries
            )
        self.submit_download_success()


