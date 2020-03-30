from time import sleep
from typing import Iterator, NamedTuple, Dict, Set

import httpx
import pandas
import pycountry
import datetime
from io import StringIO
import gettext

from settings import HARD_COUNTRY_FIXES, SKIPPED_GLOBAL_COUNTRIES, API_HOST
from loguru import logger

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


def date_str(date: datetime.datetime) -> str:
    return datetime.datetime.strftime(date, "%Y-%m-%d")


def date_from_str(date: str) -> datetime.datetime:
    return datetime.datetime.strptime(date, "%Y-%m-%d")


def get_polish_name(country_name: str) -> str:
    if country_name in HARD_COUNTRY_FIXES:
        return HARD_COUNTRY_FIXES[country_name]
    try:
        country = pycountry.countries.search_fuzzy(country_name)[0]
        country_name = polish.gettext(country.name)
    except LookupError:
        logger.warning(f"Couldn't translate '{country_name}'")
    return country_name


class Client(httpx.Client):
    def __init__(self):
        super().__init__(
            base_url=f'http://{API_HOST}/api/v1/',
            headers={'Authorization': 'Bearer ***REMOVED***'}
        )


class GlobalDataNotAvailableYet(Exception):
    pass


class HTTPError(Exception):
    pass


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


def get_regions() -> Dict[str, int]:
    with Client() as client:
        res = client.get('regions')
    if res.status_code != 200:
        raise HTTPError(res.status_code)
    return dict([(r['name'], r['id']) for r in res.json()])


def create_region(name: str, is_poland: bool = False) -> int:
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


def download_global_data_for_day(day: datetime.datetime):
    db_regions = get_regions()
    for (country_name, total_deaths, total_recoveries, total_cases) \
            in get_global_cov_data(day):
        if country_name in SKIPPED_GLOBAL_COUNTRIES:
            continue
        country_name = get_polish_name(country_name)
        region_id = db_regions.get(country_name, None)
        if not region_id:
            region_id = create_region(country_name)
        with Client() as client:
            res = client.put(
                f'regions/{region_id}/day_reports/',
                json={
                    'date': date_str(day),
                    'total_cases': total_cases,
                    'total_deaths': total_deaths,
                    'total_recoveries': total_recoveries
                }
            )
            if res.status_code not in (200, 201):
                raise HTTPError(res.status_code)
    with Client() as client:
        res = client.post(
            'downloaded_global_reports',
            json={'date': date_str(day)}
        )
    if not res.status_code == 200:
        logger.error("Couldn't submit the report for " + date_str(day))
    else:
        logger.info("Downloaded data for " + date_str(day))


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
        res = client.get('downloaded_global_reports')
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


if __name__ == '__main__':
    while True:
        try:
            download_global_data()
        except Exception as e:
            logger.error(e)
        sleep(60)
