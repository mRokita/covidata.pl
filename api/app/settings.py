import os

from starlette.config import Config

config = Config()

TESTING = config('TESTING', cast=bool, default=True)

STAGE = config('STAGE', cast=str, default='DEBUG')

DB_USER = 'covidata'
DB_PASSWORD = '***REMOVED***'
DB_DATABASE = 'covidata'
DB_HOST = 'localhost' if STAGE == 'DEBUG' else 'db'
SECRET_KEY = "***REMOVED***"
SERVICE_TOKEN = "***REMOVED***"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

if not TESTING:
    DATABASE_URL = f'postgresql://' \
                   f'{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_DATABASE}'
else:
    DATABASE_URL = 'sqlite:////tmp/test.db'
