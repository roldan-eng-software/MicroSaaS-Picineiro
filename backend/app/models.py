from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_superuser = Column(Boolean, default=False, nullable=False)

    projects = relationship("Project", back_populates="owner")
    clients = relationship("Client", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    owner = relationship("User", back_populates="projects")

class AppSetting(Base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(String, nullable=False)

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, nullable=True)
    email = Column(String, index=True, nullable=True)
    address = Column(String, nullable=True)
    cpf_cnpj = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, default=True)

    owner = relationship("User", back_populates="clients")
    pools = relationship("Pool", back_populates="client")
    budgets = relationship("Budget", back_populates="client")

class Pool(Base):
    __tablename__ = "pools"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    volume = Column(Integer)
    pool_type = Column(String)
    coating = Column(String, nullable=True)
    depth = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    client = relationship("Client", back_populates="pools")
    services = relationship("Service", back_populates="pool")

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    pool_id = Column(Integer, ForeignKey("pools.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    service_type = Column(String)
    description = Column(String, nullable=True)
    value = Column(String, nullable=True)
    time_spent = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    pool = relationship("Pool", back_populates="services")

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    items = Column(String) # JSON
    total = Column(String)
    status = Column(String, default="Open")
    validity = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    client = relationship("Client", back_populates="budgets")