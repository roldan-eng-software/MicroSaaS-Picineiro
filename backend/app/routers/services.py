from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Service as DBService, Pool as DBPool, Client as DBClient, User as DBUser
from app.schemas import Service, ServiceCreate, ServiceUpdate
from app.auth import get_current_user

router = APIRouter(
    prefix="/servicos",
    tags=["Serviços"]
)

@router.post("/", response_model=Service)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    # Verify permissions (Pool -> Client -> User)
    pool = db.query(DBPool).join(DBClient).filter(DBPool.id == service.pool_id).filter(DBClient.owner_id == current_user.id).first()
    if not pool:
        raise HTTPException(status_code=404, detail="Pool not found or not authorized")

    db_service = DBService(**service.model_dump())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.get("/", response_model=list[Service])
def read_services(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    # Get all services regarding any pool owned by any client owned by the user
    services = db.query(DBService).join(DBPool).join(DBClient).filter(DBClient.owner_id == current_user.id).offset(skip).limit(limit).all()
    services = db.query(DBService).join(DBPool).join(DBClient).filter(DBClient.owner_id == current_user.id).offset(skip).limit(limit).all()
    return services

@router.put("/{service_id}", response_model=Service)
def update_service(
    service_id: int,
    service_update: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    service = db.query(DBService).join(DBPool).join(DBClient).filter(DBService.id == service_id).filter(DBClient.owner_id == current_user.id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_data = service_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(service, key, value)

    db.add(service)
    db.commit()
    db.refresh(service)
    return service

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    service = db.query(DBService).join(DBPool).join(DBClient).filter(DBService.id == service_id).filter(DBClient.owner_id == current_user.id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db.delete(service)
    db.commit()
    return None
