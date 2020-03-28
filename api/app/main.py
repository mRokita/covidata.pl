from typing import List

from fastapi import FastAPI, status, HTTPException, Depends, Query, Body
import uvicorn
import secrets

from fastapi.params import Path
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.responses import JSONResponse

from database import database
from schemas import DayReport, Region, RegionCreate, HTTP409
from tables import regions, day_reports

app = FastAPI()
security = HTTPBearer()


async def authenticated(
        credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not secrets.compare_digest(credentials.credentials,
                                  "***REMOVED***"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    return True


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.delete("/api/v1/regions/{id}", response_model=Region)
async def delete_region(id: int = None,  # noqa
                        auth: bool = Depends(authenticated)):  # noqa
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
                        auth: bool = Depends(authenticated)):  # noqa
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
        auth: bool = Depends(authenticated)):  # noqa
    id_valid = await database.fetch_one(
        regions.select().where(regions.c.id == id)
    )
    if not id_valid:
        raise HTTPException(404)
    await database.fetch_one(
        regions.update().where(regions.c.id == id).values(**region.dict())
    )


@app.get("/api/v1/day_reports/{region_id}",
         response_model=List[DayReport])
async def read_day_reports(region_id: int):
    return await database.fetch_all(
        day_reports.select().where(day_reports.c.region_id == region_id))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, debug=True)
