#! /usr/bin/env bash

# Let the DB start
sleep 3;
# Run migrations
alembic upgrade head