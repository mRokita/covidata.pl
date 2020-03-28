import databases
from sqlalchemy import create_engine

from settings import DATABASE_URL


database = databases.Database(DATABASE_URL)

connect_args = {"check_same_thread": False}\
    if DATABASE_URL.startswith('sqlite') else {}

engine = create_engine(
    DATABASE_URL, connect_args=connect_args
)
