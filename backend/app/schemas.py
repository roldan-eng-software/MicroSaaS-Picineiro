from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, EmailStr

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    username: str
    is_superuser: bool = False

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(UserBase):
    email: EmailStr | None = None
    username: str | None = None
    password: str | None = None
    is_superuser: bool | None = None

# --- Project Schemas ---
class ProjectBase(BaseModel):
    name: str
    description: str | None = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    name: str | None = None
    description: str | None = None

class Project(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True

# --- Client Schemas ---
class ClientBase(BaseModel):
    name: str
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    cpf_cnpj: str | None = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    name: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    cpf_cnpj: str | None = None

class Client(ClientBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime | None = None
    is_active: bool

    class Config:
        from_attributes = True

# --- Pool Schemas ---
class PoolBase(BaseModel):
    volume: int
    pool_type: str
    coating: str | None = None
    depth: str | None = None

class PoolCreate(PoolBase):
    client_id: int

class PoolUpdate(PoolBase):
    volume: int | None = None
    pool_type: str | None = None
    coating: str | None = None
    depth: str | None = None

class Pool(PoolBase):
    id: int
    client_id: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True

# --- Service Schemas ---
class ServiceBase(BaseModel):
    service_type: str
    description: str | None = None
    value: str | None = None
    time_spent: str | None = None
    date: datetime | None = None

class ServiceCreate(ServiceBase):
    pool_id: int

class Service(ServiceBase):
    id: int
    pool_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Budget Schemas ---
class BudgetBase(BaseModel):
    items: str # JSON string for MVP simplicity
    total: str
    status: str = "Open"
    validity: datetime | None = None

class BudgetCreate(BudgetBase):
    client_id: int

class Budget(BudgetBase):
    id: int
    client_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- AppSettings ---
class AppSettingBase(BaseModel):
    key: str
    value: str

class AppSettingCreate(AppSettingBase):
    pass

class AppSettingUpdate(AppSettingBase):
    key: str | None = None
    value: str | None = None

class AppSetting(AppSettingBase):
    id: int

    class Config:
        from_attributes = True

# --- User Response with Relations ---
class User(UserBase):
    id: int
    projects: list[Project] = []
    clients: list[Client] = []

    class Config:
        from_attributes = True
