import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy_utils import create_database, drop_database, database_exists
from starlette.config import environ

environ['TESTING'] = 'True'

from settings import DATABASE_URL
from .main import app
from database import Base

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def create_test_database():
    url = DATABASE_URL
    engine = create_engine(url)
    assert not database_exists(
        url), 'Test database already exists. Aborting tests.'
    create_database(url)  # Create the test database.
    Base.metadata.create_all(engine)  # Create the tables.
    yield
    drop_database(url)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200


def test_regions():
    response = client.get("/api/v1/regions")
    assert response.status_code == 200
