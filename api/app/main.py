import datetime
from typing import List

from fastapi import FastAPI, status, HTTPException, Depends, Query, Body
import uvicorn

from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from starlette.responses import JSONResponse

from auth import authenticate_user, create_access_token, get_current_user
from database import database
from queries import filter_by_day_report, get_day_report, day_report_exists
from schemas import DayReport, Region, RegionCreate, HTTP409, DayReportCreate
from tables import regions, day_reports

app = FastAPI()


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.post("/token")
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends()):
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
                        username: str = Depends(get_current_user)):
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
async def read_regions(
        is_poland: bool = Query(None,
                                description="Filter by is_poland")):
    query = regions.select()
    if is_poland is not None:
        query = query.where(regions.c.is_poland == is_poland)
    return await database.fetch_all(query)


@app.post("/api/v1/regions", response_model=Region,
          responses={409: {"model": HTTP409}})
async def create_region(region: RegionCreate,
                        username: str = Depends(get_current_user)):
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
    return {**region.dict(), "id": db_region_id}


@app.put("/api/v1/regions/{id}", response_model=Region)
async def update_region(
        id: int, *,  # noqa
        region: RegionCreate = Body(...),
        auth: bool = Depends(get_current_user)):
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
async def read_day_reports(region_id: int):
    return await database.fetch_all(
        day_reports.select().where(day_reports.c.region_id == region_id))


@app.get("/api/v1/regions/{region_id}/day_reports/{date}",
         response_model=DayReport)
async def read_day_reports(region_id: int,
                           date: datetime.date):
    data = await get_day_report(region_id, date)
    if not data:
        raise HTTPException(
            status_code=404, detail='Day report does not exist.'
        )
    return data


@app.put("/api/v1/regions/{region_id}/day_reports", response_model=DayReport)
async def create_or_update_day_report(
        region_id: int,
        day_report: DayReportCreate,
        username: str = Depends(get_current_user)):
    status_code = 200
    if await day_report_exists(region_id, day_report.date):
        query = filter_by_day_report(day_reports.update(), region_id,
                                     day_report.date)
        await database.execute(query, values=day_report.dict())
    else:
        query = day_reports.insert().values(**day_report.dict(),
                                            region_id=region_id)
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


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, debug=True)
