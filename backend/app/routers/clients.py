from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Client as DBClient, User as DBUser
from app.schemas import Client, ClientCreate, ClientUpdate
from app.auth import get_current_user

router = APIRouter(
    prefix="/clientes",
    tags=["Clientes"]
)

@router.post("/", response_model=Client)
def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    db_client = DBClient(**client.model_dump(), owner_id=current_user.id)
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.get("/", response_model=list[Client])
def read_clients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    clients = db.query(DBClient).filter(DBClient.owner_id == current_user.id).offset(skip).limit(limit).all()
    return clients

@router.get("/{client_id}", response_model=Client)
def read_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    client = db.query(DBClient).filter(DBClient.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    if client.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return client

@router.put("/{client_id}", response_model=Client)
def update_client(
    client_id: int,
    client_update: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    client = db.query(DBClient).filter(DBClient.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    if client.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = client_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(client, key, value)
    
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    client = db.query(DBClient).filter(DBClient.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    if client.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(client)
    db.commit()
    return None
