FROM python:3.7-slim

RUN mkdir app
COPY requirements.txt /app/requirements.txt
RUN python3 -m pip install -r /app/requirements.txt
COPY app/ /app/
CMD python3 app/main.py
