import datetime
from typing import List

from aiocache import cached, caches
from fastapi import FastAPI, status, HTTPException, Depends, Query, Body
import uvicorn

from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import select, func, and_
from starlette.middleware.gzip import GZipMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

from auth import authenticate_user, create_access_token, get_current_user
from database import database
from queries import filter_by_day_report, get_day_report, day_report_exists, \
    get_downloaded_reports, insert_downloaded_report, \
    downloaded_report_exists
from schemas import DayReport, Region, RegionCreate, HTTP409, \
    DayReportCreate, DownloadedReport, LatestDayReport
from settings import SERVICE_TOKEN, CACHE_ALIAS, CACHE_CONFIG
from secrets import compare_digest
from tables import regions, day_reports, ReportType

app = FastAPI()

app.add_middleware(ProxyHeadersMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=1000)

caches.set_config(CACHE_CONFIG)

origins = [
    "http://covidata.localhost",
    "https://covidata.pl",
    "https://coronadata.pl",
    "http://localhost",
    "http://frontend",
    "http://localhost:3000",
    "http://localhost:5000",
    "http://192.168.1.14:3000",
    "http://192.168.42.247:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await caches.get(CACHE_ALIAS).clear()
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.post("/token")
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username == 'service_user' \
            and compare_digest(form_data.password, SERVICE_TOKEN):
        return {
            "access_token": SERVICE_TOKEN,
            "token_type": "bearer"
        }
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token = create_access_token(
        data={"sub": user.username}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.delete("/api/v1/regions/{id}", response_model=Region)
async def delete_region(id: int = None,
                        username: str = Depends(get_current_user)):  # noqa
    query = regions.select().where(regions.c.id == id)
    db_region = await database.fetch_one(query)
    if not db_region:
        raise HTTPException(
            status_code=404,
            detail="Region with matching ID not found"
        )
    await database.execute(regions.delete().where(regions.c.id == id))
    return db_region


@app.get("/api/v1/regions", response_model=List[Region])
@cached(alias=CACHE_ALIAS, ttl=10)
async def read_regions(
        report_type: ReportType = Query(None,
                                        description="Filter by report type")):
    query = regions.select()
    if report_type is not None:
        query = query.where(regions.c.report_type == report_type)
    ret = await database.fetch_all(query)
    return [Region(**r).dict() for r in ret]


@app.get("/api/v1/regions/{id}")
@cached(alias=CACHE_ALIAS, ttl=10)
async def read_region(id: int):
    query = regions.select(regions.c.id == id)
    db_region = await database.fetch_one(query)
    if not db_region:
        raise HTTPException(status_code=404)
    return Region(**db_region).dict()


@app.post("/api/v1/regions", response_model=Region,
          responses={409: {"model": HTTP409}})
async def create_region(region: RegionCreate,
                        username: str = Depends(get_current_user)):  # noqa
    """
    Create a new region, raise exception if exists
    """
    db_region = await database.fetch_one(
        query=regions.select(regions.c.name == region.name)
    )
    if db_region:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"conflicting_object": Region(**db_region).dict()}
        )
    db_region_id = await database.execute(
        regions.insert(), values=region.dict()
    )
    return Region(**region.dict(), id=db_region_id).dict()


@app.get("/api/v1/latest_day_reports", response_model=List[LatestDayReport])
@cached(alias=CACHE_ALIAS, ttl=10)
async def read_latest_day_reports(
        report_type: ReportType = Query(...,
                                        description="Filter by report type")):
    max_date_func = func.max(day_reports.c.date).label('date')
    mdr = select(
        [day_reports.c.region_id, max_date_func]
    ).group_by(
        day_reports.c.region_id
    ).having(
        max_date_func > datetime.date.today() - datetime.timedelta(days=3)
    ).alias('maxr')

    query = select(
        [day_reports, regions.c.name.label('region_name')]
    ).where(
        and_(
            day_reports.c.date == mdr.c.date,
            day_reports.c.region_id == mdr.c.region_id,
            regions.c.id == day_reports.c.region_id,
            regions.c.report_type == report_type
        )
    ).order_by(-day_reports.c.total_cases)
    ret = await database.fetch_all(query)
    return [LatestDayReport(**r).dict() for r in ret]


@app.put("/api/v1/regions/{id}", response_model=Region)
async def update_region(
        id: int, *,  # noqa
        region: RegionCreate = Body(...),
        username: str = Depends(get_current_user)):  # noqa
    id_valid = await database.fetch_one(
        regions.select().where(regions.c.id == id)
    )
    if not id_valid:
        raise HTTPException(404)
    await database.execute(
        regions.update().where(regions.c.id == id).values(**region.dict())
    )


@app.get("/api/v1/regions/{region_id}/day_reports",
         response_model=List[DayReport])
@cached(alias=CACHE_ALIAS, ttl=10)
async def read_day_reports(region_id: int):
    ret = await database.fetch_all(
        day_reports.select().where(
            day_reports.c.region_id == region_id
        ).order_by(day_reports.c.date))
    return [DayReport(**r).dict() for r in ret]


@app.get("/api/v1/regions/{region_id}/day_reports/{date}",
         response_model=DayReport)
@cached(alias=CACHE_ALIAS, ttl=10)
async def read_day_report(region_id: int,
                          date: datetime.date):
    data = await get_day_report(region_id, date)
    if not data:
        raise HTTPException(
            status_code=404, detail='Day report does not exist.'
        )
    return DayReport(**data).dict()


@app.put("/api/v1/regions/{region_id}/day_reports", response_model=DayReport)
async def create_or_update_day_report(
        region_id: int,
        day_report: DayReportCreate,
        username: str = Depends(get_current_user)):  # noqa
    """
    Update or create a day report, if there is no record for the
    region and date specified yet.
    If you omit some fields in submitted DayReportCreate,
    they won't be processed during the update.
    """
    status_code = 200
    if await day_report_exists(region_id, day_report.date):
        query = filter_by_day_report(day_reports.update(), region_id,
                                     day_report.date)
        await database.execute(
            query,
            # Exclude unset, because we are just want to UPDATE the object,
            # and leave unspecified fields as they are.
            values=day_report.dict(
                exclude_unset=True
            )
        )
    else:
        query = day_reports.insert().values(
            **day_report.dict(),
            region_id=region_id
        )
        await database.execute(query)
        status_code = status.HTTP_201_CREATED
    db_day_report = await get_day_report(region_id, day_report.date)

    return JSONResponse(status_code=status_code,
                        content=jsonable_encoder(db_day_report))


@app.delete("/api/v1/regions/{region_id}/day_reports/{date}",
            response_model=DayReport)
async def delete_day_report(region_id: int,
                            date: datetime.date,
                            username: str = Depends(get_current_user)):
    await database.execute(
        filter_by_day_report(day_reports.delete(), region_id, date))


@app.get("/api/v1/downloaded_reports",
         response_model=List[DownloadedReport])
async def read_downloaded_reports(type: ReportType):
    """Get a list of reports downloaded from CSSEGISandData by the crawler."""
    return await get_downloaded_reports(type)


@app.post("/api/v1/downloaded_reports", responses={'409': {}})
async def create_downloaded_report(
        downloaded_report: DownloadedReport,
        username: str = Depends(get_current_user)):
    if await downloaded_report_exists(downloaded_report):
        return JSONResponse(status_code=409)
    await insert_downloaded_report(downloaded_report)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, debug=True)
