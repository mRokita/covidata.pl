FROM mcuadros/ofelia:latest

RUN apk --no-cache add python3
RUN mkdir app
COPY requirements.txt /app/requirements.txt
RUN python3 -m pip install -r /app/requirements.txt
COPY main.py /app/
COPY ofelia.ini /etc/ofelia/config.ini
