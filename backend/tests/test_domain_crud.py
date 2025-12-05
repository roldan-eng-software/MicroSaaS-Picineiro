import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.auth import get_current_user

# Test Database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Helper to create a user and get token
def create_user_and_token(username, email, password):
    client.post("/auth/register", json={"username": username, "email": email, "password": password})
    response = client.post("/auth/token", data={"username": username, "password": password})
    return response.json()["access_token"]

def test_create_and_read_client():
    token = create_user_and_token("testclient", "test@client.com", "password")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Client
    response = client.post(
        "/api/v1/clientes/",
        json={"name": "Cliente Teste", "email": "cliente@teste.com", "phone": "123456789"},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Cliente Teste"
    client_id = data["id"]
    
    # Read Client
    response = client.get(f"/api/v1/clientes/{client_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "cliente@teste.com"

def test_create_pool_for_client():
    token = create_user_and_token("testpool", "pool@test.com", "password")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Client
    cli_resp = client.post(
        "/api/v1/clientes/",
        json={"name": "Pool Owner", "email": "pool@owner.com"},
        headers=headers
    )
    client_id = cli_resp.json()["id"]
    
    # Create Pool
    response = client.post(
        "/api/v1/piscinas/",
        json={
            "client_id": client_id,
            "volume": 20000,
            "pool_type": "alvenaria",
            "coating": "vinil",
            "depth": "1.4"
        },
        headers=headers
    )
    assert response.status_code == 200
    assert response.json()["volume"] == 20000
