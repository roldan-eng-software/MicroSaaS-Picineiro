from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import FileResponse # Import FileResponse
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import os # Import os

from app.database import get_db
from app.models import User as DBUser, AppSetting as DBAppSetting # Import AppSetting model
from app.schemas import User, UserCreate, UserUpdate, AppSetting, AppSettingCreate, AppSettingUpdate # Import AppSetting schemas
from app.security import get_password_hash
from app.auth import get_current_active_superuser
from app.config import settings # Import settings

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    responses={403: {"description": "Operação não permitida para este usuário"}},
)

# App Settings Management Routes
@router.post("/settings/", response_model=AppSetting, status_code=status.HTTP_201_CREATED)
async def create_app_setting(
    setting: AppSettingCreate,
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser) # Add this dependency
):
    """
    Cria uma nova configuração de aplicativo.
    """
    db_setting = db.query(DBAppSetting).filter(DBAppSetting.key == setting.key).first()
    if db_setting:
        raise HTTPException(status_code=400, detail="Configuração com esta chave já existe")

    db_setting = DBAppSetting(**setting.model_dump())
    db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting

@router.get("/settings/", response_model=List[AppSetting])
async def read_app_settings(
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser), # Add this dependency
    skip: int = 0,
    limit: int = 100,
):
    """
    Lista todas as configurações do aplicativo.
    """
    settings = db.query(DBAppSetting).offset(skip).limit(limit).all()
    return settings

@router.get("/settings/{key}", response_model=AppSetting)
async def read_app_setting(
    key: str,
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser) # Add this dependency
):
    """
    Obtém uma configuração de aplicativo específica pela chave.
    """
    setting = db.query(DBAppSetting).filter(DBAppSetting.key == key).first()
    if setting is None:
        raise HTTPException(status_code=404, detail="Configuração não encontrada")
    return setting

@router.put("/settings/{key}", response_model=AppSetting)
async def update_app_setting(
    key: str,
    setting_update: AppSettingUpdate,
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser) # Add this dependency
):
    """
    Atualiza uma configuração de aplicativo existente pela chave.
    """
    db_setting = db.query(DBAppSetting).filter(DBAppSetting.key == key).first()
    if db_setting is None:
        raise HTTPException(status_code=404, detail="Configuração não encontrada")

    update_data = setting_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_setting, field, value)
    
    db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting

@router.delete("/settings/{key}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_app_setting(
    key: str,
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser) # Add this dependency
):
    """
    Deleta uma configuração de aplicativo pela chave.
    """
    db_setting = db.query(DBAppSetting).filter(DBAppSetting.key == key).first()
    if db_setting is None:
        raise HTTPException(status_code=404, detail="Configuração não encontrada")

    db.delete(db_setting)
    db.commit()
    return {"message": "Configuração deletada com sucesso"}

@router.get("/system-logs", response_class=FileResponse)
async def get_system_logs(
    last_n_lines: int = 200, # Default to last 200 lines
    current_superuser: DBUser = Depends(get_current_active_superuser) # Add this dependency
):
    """
    Recupera as últimas N linhas do arquivo de log do sistema.
    Apenas superusuários podem acessar.
    """
    log_file_path = "/app/logs/app.log" # Defined in app/config.py

    if not os.path.exists(log_file_path):
        raise HTTPException(status_code=404, detail="Arquivo de log não encontrado")

    try:
        with open(log_file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
            # Get the last N lines
            recent_lines = lines[-last_n_lines:]
            log_content = "".join(recent_lines)
            
            # Save to a temporary file for FileResponse
            temp_log_path = f"/tmp/app_logs_{os.getpid()}.log"
            with open(temp_log_path, "w", encoding="utf-8") as temp_f:
                temp_f.write(log_content)
            
            return FileResponse(temp_log_path, media_type="text/plain", filename="app.log")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao ler o arquivo de log: {e}")


@router.post("/initial-superuser", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_initial_superuser(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Cria o primeiro superusuário no sistema.
    Esta rota só funciona se não houver superusuários existentes.
    """
    existing_superusers = db.query(DBUser).filter(DBUser.is_superuser == True).count()
    if existing_superusers > 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Já existe um superusuário. Esta rota é apenas para criação inicial."
        )

    existing_user_email = db.query(DBUser).filter(DBUser.email == user.email).first()
    if existing_user_email:
        raise HTTPException(status_code=400, detail="Email já registrado")

    existing_user_username = db.query(DBUser).filter(DBUser.username == user.username).first()
    if existing_user_username:
        raise HTTPException(status_code=400, detail="Username já em uso")

    hashed_password = get_password_hash(user.password)
    db_user = DBUser(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        is_superuser=True # Define como superusuário
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/users", response_model=List[User])
async def read_users(
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser), # Add this dependency
    skip: int = 0,
    limit: int = 100
):
    """
    Lista todos os usuários. Apenas superusuários podem acessar.
    """
    users = db.query(DBUser).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=User)
async def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser) # Add this dependency
):
    """
    Obtém um usuário pelo ID. Apenas superusuários podem acessar.
    """
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.put("/users/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser) # Add this dependency
):
    """
    Atualiza informações de um usuário (incluindo status de superusuário). Apenas superusuários podem acessar.
    """
    db_user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    update_data = user_update.model_dump(exclude_unset=True)
    
    # Se a senha for atualizada, faça o hash
    if "password" in update_data and update_data["password"]:
        update_data["hashed_password"] = get_password_hash(update_data["password"])
        del update_data["password"] # Remove a senha em texto claro

    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser) # Add this dependency
):
    """
    Deleta um usuário pelo ID. Apenas superusuários podem acessar.
    """
    db_user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if db_user.is_superuser:
        # Impedir a exclusão do último superusuário para evitar bloqueio
        existing_superusers = db.query(DBUser).filter(DBUser.is_superuser == True).count()
        if existing_superusers == 1:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Não é possível deletar o último superusuário."
            )

    db.delete(db_user)
    db.commit()
    return {"message": "Usuário deletado com sucesso"}


# ... (existing user management routes)

# App Settings Management Routes
@router.post("/settings/", response_model=AppSetting, status_code=status.HTTP_201_CREATED)
async def create_app_setting(
    setting: AppSettingCreate,
    db: Session = Depends(get_db),
    # current_superuser: DBUser = Depends(get_current_active_superuser) # Already set as router dependency
):
    """
    Cria uma nova configuração de aplicativo.
    """
    db_setting = db.query(DBAppSetting).filter(DBAppSetting.key == setting.key).first()
    if db_setting:
        raise HTTPException(status_code=400, detail="Configuração com esta chave já existe")

    db_setting = DBAppSetting(**setting.model_dump())
    db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting

@router.get("/settings/", response_model=List[AppSetting])
async def read_app_settings(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    # current_superuser: DBUser = Depends(get_current_active_superuser) # Already set as router dependency
):
    """
    Lista todas as configurações do aplicativo.
    """
    settings = db.query(DBAppSetting).offset(skip).limit(limit).all()
    return settings

@router.get("/settings/{key}", response_model=AppSetting)
async def read_app_setting(
    key: str,
    db: Session = Depends(get_db),
    # current_superuser: DBUser = Depends(get_current_active_superuser) # Already set as router dependency
):
    """
    Obtém uma configuração de aplicativo específica pela chave.
    """
    setting = db.query(DBAppSetting).filter(DBAppSetting.key == key).first()
    if setting is None:
        raise HTTPException(status_code=404, detail="Configuração não encontrada")
    return setting

@router.put("/settings/{key}", response_model=AppSetting)
async def update_app_setting(
    key: str,
    setting_update: AppSettingUpdate,
    db: Session = Depends(get_db),
    # current_superuser: DBUser = Depends(get_current_active_superuser) # Already set as router dependency
):
    """
    Atualiza uma configuração de aplicativo existente pela chave.
    """
    db_setting = db.query(DBAppSetting).filter(DBAppSetting.key == key).first()
    if db_setting is None:
        raise HTTPException(status_code=404, detail="Configuração não encontrada")

    update_data = setting_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_setting, field, value)
    
    db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting

@router.delete("/settings/{key}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_app_setting(
    key: str,
    db: Session = Depends(get_db),
    # current_superuser: DBUser = Depends(get_current_active_superuser) # Already set as router dependency
):
    """
    Deleta uma configuração de aplicativo pela chave.
    """
    db_setting = db.query(DBAppSetting).filter(DBAppSetting.key == key).first()
    if db_setting is None:
        raise HTTPException(status_code=404, detail="Configuração não encontrada")

    db.delete(db_setting)
    db.commit()
    return {"message": "Configuração deletada com sucesso"}

@router.post("/initial-superuser", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_initial_superuser(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Cria o primeiro superusuário no sistema.
    Esta rota só funciona se não houver superusuários existentes.
    """
    existing_superusers = db.query(DBUser).filter(DBUser.is_superuser == True).count()
    if existing_superusers > 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Já existe um superusuário. Esta rota é apenas para criação inicial."
        )

    existing_user_email = db.query(DBUser).filter(DBUser.email == user.email).first()
    if existing_user_email:
        raise HTTPException(status_code=400, detail="Email já registrado")

    existing_user_username = db.query(DBUser).filter(DBUser.username == user.username).first()
    if existing_user_username:
        raise HTTPException(status_code=400, detail="Username já em uso")

    hashed_password = get_password_hash(user.password)
    db_user = DBUser(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        is_superuser=True # Define como superusuário
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/users", response_model=List[User])
async def read_users(
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser), # Add this dependency
    skip: int = 0,
    limit: int = 100
):
    """
    Lista todos os usuários. Apenas superusuários podem acessar.
    """
    users = db.query(DBUser).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=User)
async def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser) # Add this dependency
):
    """
    Obtém um usuário pelo ID. Apenas superusuários podem acessar.
    """
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.put("/users/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser) # Add this dependency
):
    """
    Atualiza informações de um usuário (incluindo status de superusuário). Apenas superusuários podem acessar.
    """
    db_user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    update_data = user_update.model_dump(exclude_unset=True)
    
    # Se a senha for atualizada, faça o hash
    if "password" in update_data and update_data["password"]:
        update_data["hashed_password"] = get_password_hash(update_data["password"])
        del update_data["password"] # Remove a senha em texto claro

    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_superuser: DBUser = Depends(get_current_active_superuser) # Add this dependency
):
    """
    Deleta um usuário pelo ID. Apenas superusuários podem acessar.
    """
    db_user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if db_user.is_superuser:
        # Impedir a exclusão do último superusuário para evitar bloqueio
        existing_superusers = db.query(DBUser).filter(DBUser.is_superuser == True).count()
        if existing_superusers == 1:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Não é possível deletar o último superusuário."
            )

    db.delete(db_user)
    db.commit()
    return {"message": "Usuário deletado com sucesso"}