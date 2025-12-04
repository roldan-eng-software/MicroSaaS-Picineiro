def create_user_and_token(client, username="testuser"):
    client.post(
        "/auth/register",
        json={"email": f"{username}@example.com", "username": username, "password": "password123"},
    )
    response = client.post(
        "/auth/token",
        data={"username": username, "password": "password123"},
    )
    return response.json()["access_token"]

def test_create_project(client):
    token = create_user_and_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post(
        "/projetos/",
        json={"name": "My Pool Project", "description": "A nice pool"},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "My Pool Project"
    assert "id" in data

def test_read_projects(client):
    token = create_user_and_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a project
    client.post(
        "/projetos/",
        json={"name": "Project 1"},
        headers=headers
    )
    
    response = client.get("/projetos/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Project 1"

def test_update_project(client):
    token = create_user_and_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create
    create_res = client.post(
        "/projetos/",
        json={"name": "Old Name"},
        headers=headers
    )
    project_id = create_res.json()["id"]
    
    # Update
    response = client.put(
        f"/projetos/{project_id}",
        json={"name": "New Name"},
        headers=headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "New Name"

def test_delete_project(client):
    token = create_user_and_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create
    create_res = client.post(
        "/projetos/",
        json={"name": "To Delete"},
        headers=headers
    )
    project_id = create_res.json()["id"]
    
    # Delete
    response = client.delete(f"/projetos/{project_id}", headers=headers)
    assert response.status_code == 204
    
    # Verify gone
    get_res = client.get(f"/projetos/{project_id}", headers=headers)
    assert get_res.status_code == 404
