import os
from asyncio import sleep

from aiocache import caches, SimpleMemoryCache
from starlette.config import environ

# Switch database to sqlite before DATABASE_URL gets loaded
environ['TESTING'] = 'True'

from queries import insert_downloaded_report
import datetime
import pytest
from sqlalchemy_utils import drop_database, database_exists
from auth import authenticate_user, get_password_hash
from schemas import DayReport, UserCreate, Region, DownloadedReport
from database import database
from tables import regions, day_reports, users, ReportType
from settings import DATABASE_URL, CACHE_ALIAS
from main import app
from alembic.config import Config as AlembicConfig
from alembic.command import upgrade as alembic_upgrade
from alembic.command import downgrade as alembic_downgrade
from httpx import AsyncClient

TEST_AUTH_TOKEN = environ['SERVICE_TOKEN']

regions_mocked = [
    {'id': 1, 'name': 'Mazowieckie', 'report_type': ReportType.LOCAL},
    {'id': 2, 'name': 'Małopolskie', 'report_type': ReportType.LOCAL},
    {'id': 3, 'name': 'Niemcy', 'report_type': ReportType.GLOBAL}
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


@pytest.fixture(autouse=True)
def memory_cache(event_loop):
    cache = caches.get('testing')
    yield
    event_loop.run_until_complete(cache.clear())
    event_loop.run_until_complete(cache.close())


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
    response = await client.post(
        "/api/v1/regions",
        json={'name': 'test',
              'report_type': str(ReportType.GLOBAL.value)})
    assert response.status_code == 401
    assert response.json() == {'detail': 'Not authenticated'}

    response = await client.post(
        '/api/v1/regions',
        json={'name': 'test', 'report_type': str(ReportType.GLOBAL.value)},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()['id'] == 1

    response = await client.post(
        '/api/v1/regions',
        json={'name': 'test', 'report_type': str(ReportType.GLOBAL.value)},
        headers=auth_headers
    )

    assert response.status_code == 409, \
        "409 is returned if already created"

    response = await client.get('/api/v1/regions')
    assert response.json() == [
        {'id': 1, 'name': 'test', 'report_type': str(ReportType.GLOBAL.value)}], \
        'Records have been successfully inserted'
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_read_regions(client):
    response = await client.get("/api/v1/regions")
    assert len(response.json()) == 0
    assert response.status_code == 200

    await sleep(11)  # wait for cache to invalidate

    response = await client.get("/api/v1/regions")
    assert response.json() == []
    assert response.status_code == 200

    await database.execute_many(regions.insert(), values=regions_mocked)

    await sleep(11)  # wait for cache to invalidate

    response = await client.get('/api/v1/regions')
    assert response.status_code == 200
    assert response.json() == regions_mocked

    response = await client.get(f'/api/v1/regions'
                                f'?report_type={ReportType.GLOBAL.value}')
    assert response.status_code == 200
    assert response.json() == regions_mocked[2:3]

    response = await client.get(f'/api/v1/regions'
                                f'?report_type={ReportType.LOCAL.value}')
    assert response.status_code == 200
    assert response.json() == regions_mocked[:2]


@pytest.mark.asyncio
async def test_update_region(client, auth_headers):
    to_update = {'name': 'Pomorskie', 'report_type': str(ReportType.LOCAL.value)}
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
async def test_read_downloaded_reports(client):
    res = await client.get(f'/api/v1/downloaded_reports'
                           f'?type={ReportType.GLOBAL.value}')
    assert res.status_code == 200
    assert res.json() == []

    res = await client.get(f'/api/v1/downloaded_reports'
                           f'?type={ReportType.LOCAL.value}')
    assert res.status_code == 200
    assert res.json() == []

    mock = DownloadedReport(date=today, type=ReportType.LOCAL.value)
    await insert_downloaded_report(
        mock
    )

    res = await client.get('/api/v1/downloaded_reports'
                           f'?type={ReportType.LOCAL.value}')
    assert res.status_code == 200
    assert [DownloadedReport(**r).dict()
            for r in res.json()] == [mock.dict()]


@pytest.mark.asyncio
async def test_create_downloaded_report(client, auth_headers):
    mock_tomorrow = DownloadedReport(
        date=today + datetime.timedelta(days=1),
        type=ReportType.GLOBAL
    )

    res = await client.post(
        '/api/v1/downloaded_reports',
        data=mock_tomorrow.json()
    )
    assert res.status_code == 401

    res = await client.post(
        '/api/v1/downloaded_reports',
        headers=auth_headers,
        data=mock_tomorrow.json()
    )
    assert res.status_code == 200

    res = await client.post(
        '/api/v1/downloaded_reports',
        headers=auth_headers,
        data=mock_tomorrow.json()
    )
    assert res.status_code == 409

    mock = DownloadedReport(date=today, type=ReportType.LOCAL.value)
    res = await client.post(
        '/api/v1/downloaded_reports',
        headers=auth_headers,
        data=mock.json()
    )
    assert res.status_code == 200

    res = await client.get('/api/v1/downloaded_reports')
    assert res.status_code == 422
    res = await client.get('/api/v1/downloaded_reports?'
                           f'type={ReportType.GLOBAL.value}')
    assert res.status_code == 200
    assert [DownloadedReport(**r)
            for r in res.json()] == [mock_tomorrow]

    res = await client.get(f'/api/v1/downloaded_reports?'
                           f'type={ReportType.LOCAL.value}')
    assert res.status_code == 200
    assert [DownloadedReport(**r)
            for r in res.json()] == [mock]


@pytest.mark.asyncio
async def test_read_latest_day_reports(client):
    mocked_regions = [
        Region(id=1, name='Test1', report_type=ReportType.GLOBAL),
        Region(id=2, name='Test2', report_type=ReportType.GLOBAL)
    ]
    mocked_day_reports = [
        DayReport(region_id=1,
                  date=today - datetime.timedelta(days=2),
                  total_cases=10),
        DayReport(region_id=1,
                  date=today - datetime.timedelta(days=1),
                  total_cases=5),
        DayReport(region_id=2,
                  date=today - datetime.timedelta(days=1),
                  total_cases=10),
        DayReport(region_id=2,
                  date=today,
                  total_cases=40),
    ]
    await database.execute_many(regions.insert(),
                                [m.dict() for m in mocked_regions])

    await database.execute_many(day_reports.insert(),
                                [m.dict() for m in mocked_day_reports])

    res = await client.get("/api/v1/latest_day_reports/?report_type=global")
    assert res.status_code == 200
    assert [DayReport(**j)
            for j in res.json()] == [mocked_day_reports[3],
                                     mocked_day_reports[1]]
    assert res.json()[0]['region_name'] == 'Test2'
    assert res.json()[1]['region_name'] == 'Test1'
