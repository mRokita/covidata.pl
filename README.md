# covidata.pl

## Konfiguracja środowiska

```shell script
git clone https://gitlab.com/mRokita/covidata.pl
sudo apt update
sudo apt install docker docker-compose
cd covidata.pl

# Do debugowania, pozwala na wchodzenie na stronę api przez http://api w przeglądarce
docker run -d \
    -v /var/run/docker.sock:/tmp/docker.sock \
    -v /etc/hosts:/tmp/hosts \
    dvdarias/docker-hoster

# Uruchomienie bazy, crawlera, API etc
export DB_PASSWORD=password
export SERVICE_TOKEN=token
export  SECRET_KEY=key
sudo docker-compose up --build
```

### Łączenie z lokalną instancją API

Dzieki użyciu docker-hoster można łączyć się z api pod http://api

URL Dokumentacji:

http://api/redoc - statyczna

http://api/docs - interaktywna do testowania


### Struktura projektu

covidata.pl jest podzielone na ten moment na 3 podprojekty w odp katalogach
- api - API
- crawler - cykliczne ładowanie danych i wysyłanie ich z użyciem API - patrz dokumentacja API, requesty POST i PUT
- frontend - React.js, póki co pusty projekt
