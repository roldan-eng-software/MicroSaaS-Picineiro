from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Pool as DBPool, Client as DBClient, User as DBUser
from app.schemas import Pool, PoolCreate, PoolUpdate
from app.auth import get_current_user

router = APIRouter(
    prefix="/piscinas",
    tags=["Piscinas"]
)

@router.post("/", response_model=Pool)
def create_pool(
    pool: PoolCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    # Verify if client belongs to user
    client = db.query(DBClient).filter(DBClient.id == pool.client_id).first()
    if not client or client.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Client not found or not authorized")

    db_pool = DBPool(**pool.model_dump())
    db.add(db_pool)
    db.commit()
    db.refresh(db_pool)
    return db_pool

@router.get("/cliente/{client_id}", response_model=list[Pool])
def read_pools_by_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    client = db.query(DBClient).filter(DBClient.id == client_id).first()
    if not client or client.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Client not found or not authorized")
        
    pools = db.query(DBPool).filter(DBPool.client_id == client_id).all()
    return pools

@router.get("/{pool_id}", response_model=Pool)
def read_pool(
    pool_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    pool = db.query(DBPool).join(DBClient).filter(DBPool.id == pool_id).filter(DBClient.owner_id == current_user.id).first()
    if not pool:
        raise HTTPException(status_code=404, detail="Pool not found")
    return pool

@router.put("/{pool_id}", response_model=Pool)
def update_pool(
    pool_id: int,
    pool_update: PoolUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    pool = db.query(DBPool).join(DBClient).filter(DBPool.id == pool_id).filter(DBClient.owner_id == current_user.id).first()
    if not pool:
        raise HTTPException(status_code=404, detail="Pool not found")
    
    update_data = pool_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(pool, key, value)
    
    db.add(pool)
    db.commit()
    db.refresh(pool)
    return pool

@router.delete("/{pool_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pool(
    pool_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    pool = db.query(DBPool).join(DBClient).filter(DBPool.id == pool_id).filter(DBClient.owner_id == current_user.id).first()
    if not pool:
        raise HTTPException(status_code=404, detail="Pool not found")
    
    db.delete(pool)
    db.commit()
    return None
