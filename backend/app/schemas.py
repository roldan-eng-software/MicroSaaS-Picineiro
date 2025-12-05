from __future__ import annotations # Para forward references
from datetime import datetime
from pydantic import BaseModel, EmailStr

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

class User(UserBase):
    id: int
    projects: list[Project] = [] # Adicionar a lista de projetos

    class Config:
        from_attributes = True
