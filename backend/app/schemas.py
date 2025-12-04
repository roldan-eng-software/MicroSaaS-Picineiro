from __future__ import annotations # Para forward references
from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

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

class User(UserBase):
    id: int
    projects: list[Project] = [] # Adicionar a lista de projetos

    class Config:
        from_attributes = True
