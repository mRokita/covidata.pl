from typing import Iterator, NamedTuple, Dict

import httpx
import pandas
import pycountry
import datetime
from io import StringIO
import gettext

polish = gettext.translation('iso3166',
                             pycountry.LOCALES_DIR,
                             languages=['pl'])


def cssegi_url(date: datetime.date):
    return (
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19'
        '/master/csse_covid_19_data'
        '/csse_covid_19_daily_reports/'
        f'{datetime.datetime.strftime(date, "%m-%d-%Y")}.csv'  # noqa
    )


def date_str(date: datetime.date):
    return datetime.datetime.strftime(date, "%Y-%m-%d")  # noqa


HARD_COUNTRY_FIXES = {
    'Burma': 'Mjanma (Birma)',
    'Laos': 'Laos',
    'Korea, South': 'Korea Południowa',
    'West Bank and Gaza': 'Zachodni Brzeg i Strefa Gazy',
    'Taiwan*': 'Tajwan'
}


def get_polish_name(country_name: str) -> str:
    if country_name in HARD_COUNTRY_FIXES:
        return HARD_COUNTRY_FIXES[country_name]
    try:
        country = pycountry.countries.search_fuzzy(country_name)[0]
        country_name = polish.gettext(country.name)
    except LookupError:
        print(f"Couldn't translate '{country_name}'")
    return country_name


class Client(httpx.Client):
    def __init__(self):
        super().__init__(
            base_url='http://api/api/v1/',
            headers={'Authorization': 'Bearer ***REMOVED***'}
        )


def get_global_cov_data(
        date: datetime.date = datetime.date.today()) -> Iterator[NamedTuple]:
    with httpx.Client() as client:
        url = cssegi_url(date)
        data = client.get(url)
        df = pandas.read_csv(
            StringIO(data.text),
            usecols=['Country_Region', 'Deaths', 'Recovered', 'Active']
        )
        df['Country_Region'] = df['Country_Region'].str.replace(r"\(.*\)", "")
    return df.groupby(['Country_Region']).sum().itertuples()


def get_regions() -> Dict[str, int]:
    with Client() as client:
        res = client.get('regions')
    assert res.status_code == 200
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
    assert res.status_code == 409
    print(res.json())
    return res.json()['conflicting_object']['id']


def main():
    today = datetime.date.today() - datetime.timedelta(days=2)
    db_regions = get_regions()
    for (country_name, total_deaths, total_recoveries, total_active) \
            in get_global_cov_data(today):
        total_cases = total_deaths + total_recoveries + total_active
        country_name = get_polish_name(country_name)
        region_id = db_regions.get(country_name, None)
        if not region_id:
            region_id = create_region(country_name)
        with Client() as client:
            res = client.put(
                f'regions/{region_id}/day_reports/',
                json={
                    'date': date_str(today),
                    'total_cases': total_cases,
                    'total_deaths': total_deaths,
                    'total_recoveries': total_recoveries
                }
            )
            assert res.status_code in (200, 201), res.status_code


if __name__ == '__main__':
    main()
