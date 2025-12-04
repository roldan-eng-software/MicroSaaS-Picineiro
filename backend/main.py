import logging
import logging.config
from datetime import timedelta # Importar timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm # Importar para autenticação OAuth2
from sqlalchemy.orm import Session
from app.schemas import User, UserCreate, UserLogin, Project, ProjectCreate, ProjectUpdate # Adicionar Project e ProjectCreate
from app.models import User as DBUser, Project as DBProject # Importar modelo Project
from app.security import get_password_hash, verify_password
from app.auth import create_access_token, get_current_user # Importar função de criação de token
from app.database import SessionLocal, engine, Base
from app.config import settings, LOGGING_CONFIG # Importar configurações de logging
from app.routers import upload # Importar router de upload
from fastapi.staticfiles import StaticFiles # Importar StaticFiles

# Aplicar configuração de logging
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("app") # Obter um logger para este módulo

app = FastAPI(title=settings.PROJECT_NAME) # Usar o nome do projeto das configurações

# Mount static files for uploads (Local Development)
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

# Include Routers
app.include_router(upload.router, prefix="/api/v1")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
async def startup_event():
    logger.info("Aplicação Propiscineiro iniciando...")
    # Verificar se as tabelas existem (para desenvolvimento inicial)
    # Em produção, as migrações Alembic cuidariam disso.
    # Base.metadata.create_all(bind=engine) # Removido para Alembic
    logger.info("Database connection configured.")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Aplicação Propiscineiro encerrando.")


@app.get("/")
def read_root():
    logger.info("Requisição recebida para a rota raiz.")
    return {"message": "Bem-vindo ao Propiscineiro Backend!"}

@app.post("/auth/register", response_model=User, tags=["Auth"])
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Tentando criar novo usuário: {user.username} ({user.email})")
    # Verificar se o usuário já existe
    existing_user_email = db.query(DBUser).filter(DBUser.email == user.email).first()
    if existing_user_email:
        logger.warning(f"Tentativa de registro com email duplicado: {user.email}")
        raise HTTPException(status_code=400, detail="Email já registrado")

    existing_user_username = db.query(DBUser).filter(DBUser.username == user.username).first()
    if existing_user_username:
        logger.warning(f"Tentativa de registro com username duplicado: {user.username}")
        raise HTTPException(status_code=400, detail="Username já em uso")

    hashed_password = get_password_hash(user.password)
    db_user = DBUser(email=user.email, username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.info(f"Usuário criado com sucesso: {db_user.id} - {db_user.username}")
    return db_user

@app.post("/auth/token", tags=["Auth"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Tentativa de login falhou para o usuário: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    logger.info(f"Login bem-sucedido para o usuário: {user.username}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/refresh", tags=["Auth"])
async def refresh_access_token(current_user: DBUser = Depends(get_current_user)):
    """
    Refresh access token for the authenticated user.
    """
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        data={"sub": current_user.username}, expires_delta=access_token_expires
    )
    logger.info(f"Token de acesso atualizado para o usuário: {current_user.username}")
    return {"access_token": new_access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User, tags=["Users"])
async def read_users_me(current_user: DBUser = Depends(get_current_user)):
    """
    Get current authenticated user.
    """
    logger.info(f"Requisição para obter dados do usuário autenticado: {current_user.username}")
    return current_user

@app.post("/projetos/", response_model=Project, tags=["Projects"])
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    """
    Cria um novo projeto para o usuário autenticado.
    """
    logger.info(f"Usuário {current_user.username} tentando criar novo projeto: {project.name}")
    db_project = DBProject(**project.model_dump(), owner_id=current_user.id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    logger.info(f"Projeto {db_project.id} - '{db_project.name}' criado por {current_user.username}")
    return db_project

@app.get("/projetos/", response_model=list[Project], tags=["Projects"])
def read_user_projects(
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    """
    Lista todos os projetos do usuário autenticado.
    """
    logger.info(f"Usuário {current_user.username} requisitou a lista de projetos.")
    projects = db.query(DBProject).filter(DBProject.owner_id == current_user.id).all()
    logger.info(f"Encontrados {len(projects)} projetos para o usuário {current_user.username}.")
    return projects

@app.get("/projetos/{project_id}", response_model=Project, tags=["Projects"])
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    """
    Obtém um projeto específico pelo ID, garantindo que pertence ao usuário autenticado.
    """
    logger.info(f"Usuário {current_user.username} requisitou o projeto ID: {project_id}.")
    project = db.query(DBProject).filter(DBProject.id == project_id).first()

    if not project:
        logger.warning(f"Projeto ID {project_id} não encontrado.")
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    if project.owner_id != current_user.id:
        logger.warning(f"Usuário {current_user.username} tentou acessar projeto ID {project_id} de outro usuário.")
        raise HTTPException(status_code=403, detail="Não autorizado a acessar este projeto")

    logger.info(f"Projeto ID {project_id} obtido com sucesso para o usuário {current_user.username}.")
    return project

@app.put("/projetos/{project_id}", response_model=Project, tags=["Projects"])
def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    """
    Atualiza um projeto existente pelo ID, garantindo que pertence ao usuário autenticado.
    """
    logger.info(f"Usuário {current_user.username} tentando atualizar projeto ID: {project_id}.")
    project = db.query(DBProject).filter(DBProject.id == project_id).first()

    if not project:
        logger.warning(f"Projeto ID {project_id} não encontrado para atualização.")
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    if project.owner_id != current_user.id:
        logger.warning(f"Usuário {current_user.username} tentou atualizar projeto ID {project_id} de outro usuário.")
        raise HTTPException(status_code=403, detail="Não autorizado a atualizar este projeto")

    # Aplicar atualizações parciais
    update_data = project_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
        
    db.add(project) # Adicionar para garantir que o SQLAlchemy detecte a mudança e atualize 'updated_at'
    db.commit()
    db.refresh(project)
    logger.info(f"Projeto ID {project_id} atualizado com sucesso por {current_user.username}.")
    return project

@app.delete("/projetos/{project_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Projects"])
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    """
    Deleta um projeto existente pelo ID, garantindo que pertence ao usuário autenticado.
    """
    logger.info(f"Usuário {current_user.username} tentando deletar projeto ID: {project_id}.")
    project = db.query(DBProject).filter(DBProject.id == project_id).first()

    if not project:
        logger.warning(f"Projeto ID {project_id} não encontrado para exclusão.")
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    if project.owner_id != current_user.id:
        logger.warning(f"Usuário {current_user.username} tentou deletar projeto ID {project_id} de outro usuário.")
        raise HTTPException(status_code=403, detail="Não autorizado a deletar este projeto")

    db.delete(project)
    db.commit()
    logger.info(f"Projeto ID {project_id} deletado com sucesso por {current_user.username}.")
    return {"message": "Project deleted successfully"}