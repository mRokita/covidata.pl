from typing import List

from fastapi import FastAPI, status, HTTPException, Depends, Query, Path, \
    Header
import uvicorn
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import schemas, models
app = FastAPI()


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@app.get('/')
async def root():
    return {'message': 'Hello, World!'}


@app.get('/api/v1/regions', response_model=List[schemas.Region])
async def regions(
        only_poland: bool = Query(False,
                                  description="Load only regions of Poland"),
        db: Session = Depends(get_db)):
    regions = db.query(models.Region)
    if only_poland:
        regions = regions.filter(models.Region.is_poland == True)
    return regions.all()


@app.get('/api/v1/day_reports/{region_id}', response_model=List[schemas.DayReport])
async def day_reports(region_id: int, db: Session = Depends(get_db)):
    day_reports = db.query(models.DayReport).filter(
        models.DayReport.region_id == region_id)
    return day_reports.all()


if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True, debug=True)