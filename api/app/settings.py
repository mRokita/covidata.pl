import os
STAGE = os.environ.get('STAGE', default='DEBUG')
DB_USER = 'covidata'
DB_PASSWORD = '***REMOVED***'
DB_DATABASE = 'covidata'
DB_HOST = 'localhost' if STAGE == 'DEBUG' else 'db'

DATABASE_URL = f'postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_DATABASE}'