FROM mcuadros/ofelia:latest

RUN apk --no-cache add python3
RUN echo "http://dl-8.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk add --no-cache py3-pandas py3-numpy
RUN mkdir app
COPY requirements.txt /app/requirements.txt
RUN python3 -m pip install -r /app/requirements.txt
COPY app/main.py /app/
COPY ofelia.ini /etc/ofelia/config.ini
