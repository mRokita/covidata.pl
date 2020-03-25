from typing import List

from fastapi import FastAPI, status, HTTPException, Depends
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
async def regions(only_poland: bool = False, db: Session = Depends(get_db)):
    return db.query(models.Region).filter(models.Region.is_poland==only_poland).all()


@app.get('/api/v1/cases/{region_id}')
async def cases(region_id: int):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Cases not implemented yet",
    )


if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True, debug=True)