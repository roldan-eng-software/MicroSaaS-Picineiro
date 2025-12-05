import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import User as DBUser
from app.security import get_password_hash

# Helper function to create a regular user
def create_test_user(client: TestClient, email: str, username: str, password: str):
    response = client.post(
        "/auth/register",
        json={"email": email, "username": username, "password": password},
    )
    assert response.status_code == 200
    return response.json()

# Helper function to login and get token
def get_auth_token(client: TestClient, username: str, password: str):
    response = client.post(
        "/auth/token",
        data={"username": username, "password": password},
    )
    assert response.status_code == 200
    return response.json()["access_token"]

# Helper function to create a superuser directly in the database for testing purposes
def create_db_superuser(db: Session, email: str, username: str, password: str):
    hashed_password = get_password_hash(password)
    superuser = DBUser(
        email=email,
        username=username,
        hashed_password=hashed_password,
        is_superuser=True
    )
    db.add(superuser)
    db.commit()
    db.refresh(superuser)
    return superuser

def test_create_initial_superuser(client: TestClient, db: Session):
    # Test creating the first superuser
    superuser_data = {
        "email": "admin@example.com",
        "username": "adminuser",
        "password": "adminpassword",
    }
    response = client.post("/api/v1/admin/initial-superuser", json=superuser_data)
    assert response.status_code == 201
    created_superuser = response.json()
    assert created_superuser["email"] == superuser_data["email"]
    assert created_superuser["is_superuser"] == True
    
    # Verify in DB
    db_superuser = db.query(DBUser).filter(DBUser.email == superuser_data["email"]).first()
    assert db_superuser is not None
    assert db_superuser.is_superuser == True

    # Test that creating a second initial superuser fails
    response = client.post("/api/v1/admin/initial-superuser", json=superuser_data)
    assert response.status_code == 403
    assert "Já existe um superusuário" in response.json()["detail"]

def test_admin_routes_protected(client: TestClient):
    # Regular user should not access admin routes
    user_data = create_test_user(client, "user@example.com", "regularuser", "password123")
    token = get_auth_token(client, "regularuser", "password123")

    response = client.get("/api/v1/admin/users", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403
    assert "privilégios de superusuário" in response.json()["detail"]

    response = client.put(f"/api/v1/admin/users/{user_data['id']}", headers={"Authorization": f"Bearer {token}"}, json={"is_superuser": True})
    assert response.status_code == 403
    assert "privilégios de superusuário" in response.json()["detail"]

def test_list_users_as_superuser(client: TestClient, db: Session):
    superuser = create_db_superuser(db, "sadmin@example.com", "sadmin", "sadminpassword")
    regular_user = create_test_user(client, "normal@example.com", "normaluser", "normalpassword")
    
    token = get_auth_token(client, "sadmin", "sadminpassword")

    response = client.get("/api/v1/admin/users", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 2 # At least superuser and regular user
    assert any(u["username"] == "sadmin" for u in users)
    assert any(u["username"] == "normaluser" for u in users)

def test_get_user_as_superuser(client: TestClient, db: Session):
    superuser = create_db_superuser(db, "sadmin2@example.com", "sadmin2", "sadminpassword")
    regular_user = create_test_user(client, "normal2@example.com", "normaluser2", "normalpassword")
    
    token = get_auth_token(client, "sadmin2", "sadminpassword")

    response = client.get(f"/api/v1/admin/users/{regular_user['id']}", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["username"] == regular_user["username"]
    assert user_data["is_superuser"] == False

def test_update_user_superuser_status(client: TestClient, db: Session):
    superuser = create_db_superuser(db, "sadmin3@example.com", "sadmin3", "sadminpassword")
    user_to_promote = create_test_user(client, "promote@example.com", "promoteduser", "password123")
    
    token = get_auth_token(client, "sadmin3", "sadminpassword")

    # Promote user
    response = client.put(
        f"/api/v1/admin/users/{user_to_promote['id']}",
        headers={"Authorization": f"Bearer {token}"},
        json={"is_superuser": True}
    )
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["id"] == user_to_promote["id"]
    assert updated_user["is_superuser"] == True

    # Verify in DB
    db_updated_user = db.query(DBUser).filter(DBUser.id == user_to_promote["id"]).first()
    assert db_updated_user.is_superuser == True

    # Demote user
    response = client.put(
        f"/api/v1/admin/users/{user_to_promote['id']}",
        headers={"Authorization": f"Bearer {token}"},
        json={"is_superuser": False}
    )
    assert response.status_code == 200
    demoted_user = response.json()
    assert demoted_user["is_superuser"] == False

    # Verify in DB
    db_demoted_user = db.query(DBUser).filter(DBUser.id == user_to_promote["id"]).first()
    assert db_demoted_user.is_superuser == False

def test_delete_user_as_superuser(client: TestClient, db: Session):
    superuser = create_db_superuser(db, "sadmin4@example.com", "sadmin4", "sadminpassword")
    user_to_delete = create_test_user(client, "todelete@example.com", "todeleteuser", "password123")
    
    token = get_auth_token(client, "sadmin4", "sadminpassword")

    response = client.delete(f"/api/v1/admin/users/{user_to_delete['id']}", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 204

    # Verify user is deleted
    db_deleted_user = db.query(DBUser).filter(DBUser.id == user_to_delete["id"]).first()
    assert db_deleted_user is None

def test_cannot_delete_last_superuser(client: TestClient, db: Session):
    # Ensure only one superuser exists initially
    db.query(DBUser).filter(DBUser.is_superuser == True).delete() # Clean up existing superusers from other tests
    db.commit()

    superuser = create_db_superuser(db, "soleadmin@example.com", "soleadmin", "soleadminpassword")
    token = get_auth_token(client, "soleadmin", "soleadminpassword")

    response = client.delete(f"/api/v1/admin/users/{superuser.id}", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403
    assert "Não é possível deletar o último superusuário" in response.json()["detail"]

    # Add another superuser and then try to delete the first one
    another_superuser = create_db_superuser(db, "secondadmin@example.com", "secondadmin", "secondadminpassword")
    
    response = client.delete(f"/api/v1/admin/users/{superuser.id}", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 204
    # Verify first superuser is deleted
    db_deleted_superuser = db.query(DBUser).filter(DBUser.id == superuser.id).first()
    assert db_deleted_superuser is None
