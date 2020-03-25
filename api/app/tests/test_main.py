import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy_utils import create_database, drop_database, database_exists
from starlette.config import environ

environ['TESTING'] = 'True'

from settings import DATABASE_URL
from main import app
from database import Base
from alembic.config import Config as AlembicConfig
from alembic.command import upgrade as alembic_upgrade
from alembic.command import downgrade as alembic_downgrade
client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def create_test_database():
    url = DATABASE_URL
    engine = create_engine(url)

    assert not database_exists(
        url), 'Test database already exists. Aborting tests.'
    alembic_config = AlembicConfig('alembic.ini')
    alembic_upgrade(alembic_config, 'head')
    yield
    alembic_downgrade(alembic_config, 'base')
    drop_database(url)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200


def test_regions():
    response = client.get("/api/v1/regions")
    assert response.status_code == 200
