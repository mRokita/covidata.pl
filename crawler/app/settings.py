from os import environ

HARD_COUNTRY_FIXES = {
    'Burma': 'Mjanma (Birma)',
    'Laos': 'Laos',
    'Ivory Coast': 'Wybrzeże Kości Słoniowej',
    'Mainland China': 'Chiny',
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
    'East Timor': 'Timor Wschodni',
    'MS Zaandam': 'MS Zaandam',
    'St. Martin': 'St. Martin',
    'St Martin': 'St. Martin'
}

SKIPPED_GLOBAL_COUNTRIES = [
    'North Ireland',
    'Republic of Ireland'
]

API_HOST = 'localhost:8000' if environ.get(
    'STAGE', 'PRODUCTION') == 'DEBUG' else 'api'
