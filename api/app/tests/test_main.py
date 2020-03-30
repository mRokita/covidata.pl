import os

from starlette.config import environ

# Switch database to sqlite before DATABASE_URL gets loaded
environ['TESTING'] = 'True'

from queries import insert_downloaded_global_report
import datetime
import pytest
from sqlalchemy_utils import drop_database, database_exists
from auth import authenticate_user, get_password_hash
from schemas import DayReport, UserCreate, Region, DownloadedGlobalReport
from database import database
from tables import regions, day_reports, users
from settings import DATABASE_URL
from main import app
from alembic.config import Config as AlembicConfig
from alembic.command import upgrade as alembic_upgrade
from alembic.command import downgrade as alembic_downgrade
from httpx import AsyncClient

TEST_AUTH_TOKEN = '***REMOVED***'

regions_mocked = [
    {'id': 1, 'name': 'Mazowieckie', 'is_poland': True},
    {'id': 2, 'name': 'Małopolskie', 'is_poland': True},
    {'id': 3, 'name': 'Niemcy', 'is_poland': False}
]

regions_mocked = [Region(**r).dict() for r in regions_mocked]

today = datetime.date.today()

day_reports_mocked = [
    {'date': datetime.date(year=2020, month=3, day=28),
     'total_cases': 1000, 'total_deaths': 20, 'region_id': 1},
    {'date': datetime.date(year=2020, month=3, day=29),
     'total_cases': 1200, 'total_deaths': 30, 'region_id': 1},
    {'date': datetime.date(year=2020, month=3, day=28),
     'total_cases': 10, 'total_deaths': 1, 'region_id': 3},
    {'date': datetime.date(year=2020, month=3, day=29),
     'total_cases': 20, 'total_deaths': 3, 'region_id': 3}
]

# Fill with some defaults
day_reports_mocked = [DayReport(**dr).dict() for dr in day_reports_mocked]

if os.path.exists('/tmp/test.db'):
    os.remove('/tmp/test.db')


@pytest.fixture()
def auth_headers():
    return {'Authorization': f'Bearer {TEST_AUTH_TOKEN}'}


@pytest.fixture(autouse=True)
async def create_test_database():
    url = DATABASE_URL
    assert not database_exists(
        url), 'Test database already exists. Aborting tests.'
    alembic_config = AlembicConfig('alembic.ini')
    alembic_upgrade(alembic_config, 'head')
    yield
    alembic_downgrade(alembic_config, 'base')
    drop_database(url)


@pytest.fixture()
async def client():
    async with AsyncClient(app=app, base_url='http://covidata.pl') as client:
        yield client


@pytest.mark.asyncio
async def test_create_region(client, auth_headers):
    response = await client.post("/api/v1/regions",
                                 json={'name': 'test', 'is_poland': False})
    assert response.status_code == 401
    assert response.json() == {'detail': 'Not authenticated'}

    response = await client.post(
        '/api/v1/regions',
        json={'name': 'test', 'is_poland': False},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()['id'] == 1

    response = await client.post(
        '/api/v1/regions',
        json={'name': 'test', 'is_poland': False},
        headers=auth_headers
    )

    assert response.status_code == 409, \
        "409 is returned if already created"

    response = await client.get('/api/v1/regions')
    assert response.json() == [
        {'id': 1, 'name': 'test', 'is_poland': False}], \
        'Records have been successfully inserted'
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_read_regions(client):
    response = await client.get("/api/v1/regions")
    assert response.json() == []
    assert response.status_code == 200

    await database.execute_many(regions.insert(), values=regions_mocked)

    response = await client.get('/api/v1/regions')
    assert response.status_code == 200
    assert response.json() == regions_mocked

    response = await client.get('/api/v1/regions?is_poland=False')
    assert response.status_code == 200
    assert response.json() == regions_mocked[2:3]

    response = await client.get('/api/v1/regions?is_poland=True')
    assert response.status_code == 200
    assert response.json() == regions_mocked[:2]


@pytest.mark.asyncio
async def test_update_region(client, auth_headers):
    to_update = {'name': 'Pomorskie', 'is_poland': False}
    await database.execute_many(regions.insert(), values=regions_mocked)

    response = await client.put("/api/v1/regions/1", json=to_update,
                                headers=auth_headers)

    assert response.status_code == 200
    assert response.json() is None

    response = await client.get('/api/v1/regions')
    assert response.json()[0] == {'id': 1, **to_update}


@pytest.mark.asyncio
async def test_delete_region(client, auth_headers):
    await database.execute_many(regions.insert(), values=regions_mocked)
    response = await client.delete('/api/v1/regions/2',
                                   headers=auth_headers)
    assert response.status_code == 200

    response = await client.get('/api/v1/regions')
    assert response.status_code == 200
    assert response.json() == regions_mocked[:1] + regions_mocked[2:3]


def deserialize_day_report(json):
    return DayReport(**json).dict()


def deserialize_day_reports(json):
    return [deserialize_day_report(r) for r in json]


@pytest.mark.asyncio
async def test_read_day_reports(client):
    await database.execute_many(regions.insert(),
                                values=regions_mocked)
    await database.execute_many(day_reports.insert(),
                                values=day_reports_mocked)
    res = await client.get('/api/v1/regions/1/day_reports')
    assert res.status_code == 200
    assert deserialize_day_reports(res.json()) == day_reports_mocked[:2]

    res = await client.get('/api/v1/regions/3/day_reports')
    assert res.status_code == 200
    assert deserialize_day_reports(res.json()) == day_reports_mocked[2:]


@pytest.mark.asyncio
async def test_update_or_create_day_report(client, auth_headers):
    await database.execute_many(regions.insert(), values=regions_mocked)
    res = await client.put('/api/v1/regions/1/day_reports',
                           json={})
    assert res.status_code == 401

    res = await client.put('/api/v1/regions/1/day_reports', json={
        'total_cases': 10
    },
                           headers=auth_headers)
    assert res.status_code == 201
    mock_res = {
        'region_id': 1, 'date': today, 'total_cases': 10,
        'total_deaths': 0, 'total_recoveries': 0
    }
    assert deserialize_day_report(res.json()) == mock_res

    mock = {
        'region_id': 1,
        'total_deaths': 10
    }

    res = await client.put(
        f'/api/v1/regions/1/day_reports', headers=auth_headers,
        data=DayReport(**mock).json(exclude_unset=True)
    )

    assert res.status_code == 200
    # The result should be a merge of previous result and submission.
    assert deserialize_day_report(res.json()) == {**mock_res, **mock}

    res = await client.get(
        '/api/v1/regions/1/day_reports/'
        f'{today.year}-{today.month}-{today.day}')
    assert res.status_code == 200
    assert deserialize_day_report(res.json()) == {**mock_res, **mock}


@pytest.mark.asyncio
async def test_delete_day_report(client, auth_headers):
    await database.execute_many(regions.insert(), values=regions_mocked)
    await database.execute_many(day_reports.insert(),
                                values=day_reports_mocked)

    res = await client.delete('/api/v1/regions/1/day_reports/2020-03-28')
    assert res.status_code == 401

    res = await client.delete('/api/v1/regions/1/day_reports/2020-03-28',
                              headers=auth_headers)
    assert res.status_code == 200

    res = await client.get('/api/v1/regions/1/day_reports/2020-03-28')
    assert res.status_code == 404

    res = await client.get('/api/v1/regions/1/day_reports')
    assert res.status_code == 200
    assert deserialize_day_reports(res.json()) == day_reports_mocked[1:2]

    res = await client.get('/api/v1/regions/3/day_reports')
    assert res.status_code == 200
    assert deserialize_day_reports(res.json()) == day_reports_mocked[2:]


@pytest.mark.asyncio
async def test_auth():
    user_create = UserCreate(username='mrokita', password='mrokitax')
    create_dict = user_create.dict()
    del create_dict['password']
    await database.execute(
        users.insert(),
        values={
            **create_dict,
            'hashed_password': get_password_hash(user_create.password)
        }
    )
    user = await authenticate_user(user_create.username, user_create.password)
    assert user.username == 'mrokita'


@pytest.mark.asyncio
async def test_read_downloaded_global_reports(client):
    res = await client.get('/api/v1/downloaded_global_reports')
    assert res.status_code == 200
    assert res.json() == []

    mock = DownloadedGlobalReport(date=today)
    await insert_downloaded_global_report(
        mock
    )

    res = await client.get('/api/v1/downloaded_global_reports')
    assert res.status_code == 200
    assert [DownloadedGlobalReport(**r).dict()
            for r in res.json()] == [mock.dict()]


@pytest.mark.asyncio
async def test_create_downloaded_global_report(client):
    mock_tomorrow = DownloadedGlobalReport(
        date=today+datetime.timedelta(days=1))

    res = await client.post(
        '/api/v1/downloaded_global_reports',
        data=mock_tomorrow.json()
    )
    assert res.status_code == 200

    res = await client.post(
        '/api/v1/downloaded_global_reports',
        data=mock_tomorrow.json()
    )
    assert res.status_code == 409

    mock = DownloadedGlobalReport(date=today)
    res = await client.post(
        '/api/v1/downloaded_global_reports',
        data=mock.json()
    )
    assert res.status_code == 200

    res = await client.get('/api/v1/downloaded_global_reports')
    assert res.status_code == 200
    assert [DownloadedGlobalReport(**r)
            for r in res.json()] == [mock_tomorrow, mock]
