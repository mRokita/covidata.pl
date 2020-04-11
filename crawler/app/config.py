from os import environ

HARD_COUNTRY_FIXES = {
    'Burma': 'Mjanma (Birma)',
    'Laos': 'Laos',
    'Ivory Coast': 'Wybrzeże Kości Słoniowej',
    'Mainland China': 'Chiny',
    'Channel Islands': 'Wyspy Normandzkie',
    'South Korea': 'Korea Południowa',
    'Korea, South': 'Korea Południowa',
    'occupied Palestinian territory': 'Zachodni Brzeg i Strefa Gazy',
    'West Bank and Gaza': 'Zachodni Brzeg i Strefa Gazy',
    'Palestine': 'Zachodni Brzeg i Strefa Gazy',
    'Taiwan*': 'Tajwan',
    'Taiwan': 'Tajwan',
    'Macau': 'Makau',
    'Others': 'Inne',
    'Gambia, The': 'Gambia',
    'Bahamas, The': 'Bahamy',
    'Diamond Princess': 'Diamond Princess',
    'Taipei and environs': 'Taiwan',
    'Cruise Ship': 'Diamond Princess',
    'Cape Verde': 'Wyspy Zielonego Przylądka',
    'Czechia': 'Czechy',
    'Czech Republic': 'Czechy',
    'UK': 'Wielka Brytania',
    'Kosovo': 'Kosowo',
    'East Timor': 'Timor Wschodni',
    'MS Zaandam': 'MS Zaandam',
    'St. Martin': 'St. Martin',
    'St Martin': 'St. Martin'
}

PL_GOV_URL = 'https://www.gov.pl/web/koronawirus/' \
             'wykaz-zarazen-koronawirusem-sars-cov-2'
WAYBACK_SNAPSHOT_LIST_URL = ('http://web.archive.org/__wb/calendarcaptures/2?'
                             'url=https%3A%2F%2Fwww.gov.pl%2Fweb%2Fkoronawirus'
                             '%2Fwykaz-zarazen-koronawirusem-sars-cov-2&'
                             'date=2020')

SKIPPED_GLOBAL_COUNTRIES = [
    'North Ireland',
    'Republic of Ireland'
]

API_HOST = 'localhost:8000' if environ.get(
    'STAGE', 'PRODUCTION') == 'DEBUG' else 'api'
