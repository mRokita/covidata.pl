import datetime
import gettext
from io import StringIO
from typing import NamedTuple, Iterator, Set

import httpx
import pandas
import pycountry

from common import HTTPError, get_regions, submit_region, submit_day_report, \
    submit_download_success, GLOBAL, date_from_str, Client
from config import HARD_COUNTRY_FIXES, SKIPPED_GLOBAL_COUNTRIES

polish = gettext.translation('iso3166',
                             pycountry.LOCALES_DIR,
                             languages=['pl'])


class GlobalDataNotAvailableYet(Exception):
    pass


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


def get_global_cov_data(
        date: datetime.datetime = datetime.date.today()
) -> Iterator[NamedTuple]:
    with httpx.Client() as client:
        url = cssegi_url(date)
        data = client.get(url)
        if data.status_code == 404:
            raise GlobalDataNotAvailableYet(
                f'Data not available yet for {date}')
        if data.status_code != 200:
            raise HTTPError(
                f'date: {date}, code: {data.status_code}')

        df = pandas.read_csv(StringIO(data.text))
        df = df.rename(columns={
            'Country/Region': 'Country_Region'
        })
        df = df[['Country_Region', 'Deaths', 'Recovered', 'Confirmed']]
        df['Country_Region'] = df['Country_Region'].str.replace(r"\(.*\)", "")
    return df.groupby(['Country_Region']).sum().itertuples()


def download_global_data_for_day(day: datetime.datetime):
    db_regions = get_regions()
    for (country_name, total_deaths, total_recoveries, total_cases) \
            in get_global_cov_data(day):
        if country_name in SKIPPED_GLOBAL_COUNTRIES:
            continue
        country_name = get_polish_name(country_name)
        region_id = db_regions.get(country_name, None)
        if not region_id:
            region_id = submit_region(country_name)
        submit_day_report(
            day,
            region_id=region_id,
            cases=total_cases,
            deaths=total_deaths,
            recoveries=total_recoveries
        )
    submit_download_success(day, GLOBAL)


def date_set(
        start: datetime.datetime, end: datetime.date
) -> Set[datetime.datetime]:
    # We don't want to download for today, because they update it the next day.
    # No need for days += 1
    days = (end - start).days
    return {start + datetime.timedelta(days=i) for i in range(days)}


def download_global_data():
    today = datetime.datetime.today()

    with Client() as client:
        res = client.get('downloaded_reports?type=global')
        if res.status_code != 200:
            raise HTTPError(res.status_code)
    required = date_set(
        start=datetime.datetime(year=2020, month=1, day=22),
        end=today
    )
    downloaded = {date_from_str(d['date']) for d in res.json()}
    required -= downloaded
    for d in sorted(required):
        download_global_data_for_day(d)
