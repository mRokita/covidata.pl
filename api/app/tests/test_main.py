import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy_utils import drop_database, database_exists
from starlette.config import environ

# Switch database to sqlite before DATABASE_URL gets loaded
environ['TESTING'] = 'True'

from settings import DATABASE_URL  # noqa
from main import app  # noqa
from alembic.config import Config as AlembicConfig  # noqa
from alembic.command import upgrade as alembic_upgrade  # noqa
from alembic.command import downgrade as alembic_downgrade  # noqa


@pytest.fixture(autouse=True)
def create_test_database():
    url = DATABASE_URL
    assert not database_exists(
        url), 'Test database already exists. Aborting tests.'
    alembic_config = AlembicConfig('alembic.ini')
    alembic_upgrade(alembic_config, 'head')
    yield
    alembic_downgrade(alembic_config, 'base')
    drop_database(url)


@pytest.fixture(autouse=True, scope='class')
def client():
    return TestClient(app)


def test_create_region(client):
    response = client.post('/api/v1/regions',
                           json={'name': 'test', 'is_poland': False})
    assert response.status_code == 403
    assert response.json() == {'detail': 'Not authenticated'}

    response = client.post(
        '/api/v1/regions',
        json={'name': 'test', 'is_poland': False},
        headers={'Authorization': 'Bearer ***REMOVED***'}
    )
    assert response.status_code == 200
    assert response.json()['id'] == 1

    response = client.post(
        '/api/v1/regions',
        json={'name': 'test', 'is_poland': False},
        headers={'Authorization': 'Bearer ***REMOVED***'}
    )

    assert response.status_code == 409, \
        '409 is returned if already created'

    response = client.get('/api/v1/regions')
    assert response.json() == [{'id': 1, 'name': 'test', 'is_poland': False}],\
        'Records have been successfully inserted'
    assert response.status_code == 200


def test_read_regions(client):
    response = client.get("/api/v1/regions")
    assert response.json() == []
    assert response.status_code == 200

