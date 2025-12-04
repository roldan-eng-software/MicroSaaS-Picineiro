from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Pega a URL do banco de dados das variáveis de ambiente
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL não configurada nas variáveis de ambiente.")

# Cria o motor (engine) do SQLAlchemy
# connect_args={"check_same_thread": False} é necessário apenas para SQLite, não para PostgreSQL.
# No entanto, em alguns cenários Docker, pode ser útil para evitar problemas de thread,
# mas para PostgreSQL, a conexão é multi-thread por padrão. Vou remover para clareza
# e adicionar a opção de pool para melhor performance em FastAPI.
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Cria uma instância de SessionLocal
# Cada instância de SessionLocal será uma sessão de banco de dados.
# A dependência para a sessão de banco de dados será criada para cada request,
# e então fechada após a requisição.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos declarativos do SQLAlchemy
Base = declarative_base()

# Função de utilidade para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
