from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Budget as DBBudget, Client as DBClient, User as DBUser
from app.schemas import Budget, BudgetCreate, BudgetUpdate
from app.auth import get_current_user

router = APIRouter(
    prefix="/orcamentos",
    tags=["Orçamentos"]
)

@router.post("/", response_model=Budget)
def create_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    client = db.query(DBClient).filter(DBClient.id == budget.client_id).first()
    if not client or client.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Client not found or not authorized")

    db_budget = DBBudget(**budget.model_dump())
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@router.get("/", response_model=list[Budget])
def read_budgets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    budgets = db.query(DBBudget).join(DBClient).filter(DBClient.owner_id == current_user.id).offset(skip).limit(limit).all()
    return budgets

@router.get("/{budget_id}", response_model=Budget)
def read_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    budget = db.query(DBBudget).join(DBClient).filter(DBBudget.id == budget_id).filter(DBClient.owner_id == current_user.id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget

@router.put("/{budget_id}", response_model=Budget)
def update_budget(
    budget_id: int,
    budget_update: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    budget = db.query(DBBudget).join(DBClient).filter(DBBudget.id == budget_id).filter(DBClient.owner_id == current_user.id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    update_data = budget_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(budget, key, value)

    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget

@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    budget = db.query(DBBudget).join(DBClient).filter(DBBudget.id == budget_id).filter(DBClient.owner_id == current_user.id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    db.delete(budget)
    db.commit()
    return None
