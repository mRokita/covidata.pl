from typing import List

from fastapi import FastAPI, status, HTTPException, Depends, Query, Path, \
    Header
import uvicorn
import secrets

from fastapi.security import HTTPBasicCredentials, OAuth2PasswordBearer, \
    OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import SessionLocal
import schemas, models

app = FastAPI()
security = HTTPBearer()


async def authenticated(credentials: HTTPAuthorizationCredentials = Depends(security)):
    print(credentials.credentials)
    if not secrets.compare_digest(credentials.credentials, '***REMOVED***'):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    return True


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@app.delete('/api/v1/regions', response_model=schemas.RegionSmall)
def delete_region(name: str = None, id: int = None,
                  db: Session = Depends(get_db),
                  authenticated: bool = Depends(authenticated)):
    if not(name or id) or name and id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='either name or id is required'
        )
    db_region = db.query(models.Region).filter(
        or_(models.Region.name==name, models.Region.id==id)).first()
    if not db_region:
        raise HTTPException(status_code=404)
    db.delete(db_region)
    db.commit()
    return db_region


@app.get('/api/v1/regions', response_model=List[schemas.Region])
def regions(
        only_poland: bool = Query(False,
                                  description="Load only regions of Poland"),
        db: Session = Depends(get_db)):
    regions = db.query(models.Region)
    if only_poland:
        regions = regions.filter(models.Region.is_poland == True)
    return list(regions.all())


@app.post('/api/v1/regions', response_model=schemas.RegionSmall)
async def create_region(region: schemas.RegionCreate,
                        db: Session = Depends(get_db),
                        authenticated: bool = Depends(authenticated)):
    db_region = db.query(models.Region).filter(models.Region.name == region.name).first()
    if not db_region:
        db_region = models.Region(
            name=region.name, is_poland=region.is_poland)
        db.add(db_region)
        db.commit()
        db.refresh(db_region)
    return db_region


@app.put('/api/v1/regions', response_model=schemas.RegionSmall)
async def update_region(region: schemas.RegionSmall,
                        db: Session = Depends(get_db),
                        authenticated: bool = Depends(authenticated)):
    db_region = db.query(models.Region).filter(models.Region.id == region.id).first()
    if not db_region:
        raise HTTPException(
            status_code=404
        )
    db_region.name = region.name
    db_region.is_poland = region.is_poland
    db.commit()
    return db_region


@app.get('/api/v1/day_reports/{region_id}', response_model=List[schemas.DayReport])
def day_reports(region_id: int, db: Session = Depends(get_db)):
    day_reports = db.query(models.DayReport).filter(
        models.DayReport.region_id == region_id)
    return day_reports.all()


if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True, debug=True)