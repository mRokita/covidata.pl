FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7-alpine3.8


COPY requirements.txt /requirements.txt
RUN \
    apk add --no-cache postgresql-libs postgresql-dev gcc python3-dev musl-dev && \
    apk add --no-cache --virtual .build-deps make gcc musl-dev postgresql-dev && \
    pip install -r /requirements.txt --no-cache-dir && \
    apk --purge del .build-deps

ENV STAGE=PRODUCTION
COPY ./app /app
