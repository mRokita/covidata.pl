from starlette.config import Config

config = Config()

TESTING = config('TESTING', cast=bool, default=False)
STAGE = config('STAGE', cast=str, default='DEBUG')
REDIS_HOST = "redis" if STAGE != 'DEBUG' else 'localhost'
CACHE_CONFIG = {
    'testing': {
        'cache': "aiocache.SimpleMemoryCache",
        'ttl': 10,
        'serializer': {
            'class': "aiocache.serializers.PickleSerializer"
        }
    },
    'default': {
        'cache': "aiocache.RedisCache",
        'endpoint': REDIS_HOST,
        'port': 6379,
        'timeout': 1,
        'ttl': 10,
        'serializer': {
            'class': "aiocache.serializers.PickleSerializer"
        },
        'plugins': [
            {'class': "aiocache.plugins.HitMissRatioPlugin"},
            {'class': "aiocache.plugins.TimingPlugin"}
        ]
    }
}
CACHE_ALIAS = 'testing' if TESTING else 'default'

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
