import pytest
from fastapi.testclient import TestClient
from sqlalchemy_utils import drop_database, database_exists
from starlette.config import environ

# Switch database to sqlite before DATABASE_URL gets loaded
environ['TESTING'] = 'True'

from database import database  # noqa
from tables import regions  # noqa
from settings import DATABASE_URL  # noqa
from main import app  # noqa
from alembic.config import Config as AlembicConfig  # noqa
from alembic.command import upgrade as alembic_upgrade  # noqa
from alembic.command import downgrade as alembic_downgrade  # noqa
from httpx import AsyncClient  # noqa

TEST_AUTH_TOKEN = '***REMOVED***'

regions_mocked = [
    {'id': 1, 'name': 'Mazowieckie', 'is_poland': True},
    {'id': 2, 'name': 'Małopolskie', 'is_poland': True},
    {'id': 3, 'name': 'Niemcy', 'is_poland': False}
]


@pytest.fixture()
async def auth_headers():
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
    print("DOWN")
    drop_database(url)


@pytest.fixture()
async def client():
    async with AsyncClient(app=app, base_url='http://covidata.pl') as client:
        yield client


@pytest.mark.asyncio
async def test_create_region(client, auth_headers):
    response = await client.post("/api/v1/regions",
                                 json={'name': 'test', 'is_poland': False})
    assert response.status_code == 403
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
    assert response.json() == [{'id': 1, 'name': 'test', 'is_poland': False}],\
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