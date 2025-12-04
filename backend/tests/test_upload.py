import os
import shutil

def test_upload_image(client):
    # Create a dummy image file
    with open("test_image.jpg", "wb") as f:
        f.write(b"fake image content")
        
    with open("test_image.jpg", "rb") as f:
        response = client.post(
            "/api/v1/upload",
            files={"file": ("test_image.jpg", f, "image/jpeg")}
        )
        
    assert response.status_code == 200
    data = response.json()
    assert "url" in data
    assert "filename" in data
    
    # Cleanup
    os.remove("test_image.jpg")
    # Note: In a real test environment, we should clean up the uploaded file from backend/static/uploads too
    # but since we use unique IDs, it won't conflict. Ideally, we mock the filesystem or use a temp dir.

def test_upload_invalid_file_type(client):
    with open("test.txt", "w") as f:
        f.write("text content")
        
    with open("test.txt", "rb") as f:
        response = client.post(
            "/api/v1/upload",
            files={"file": ("test.txt", f, "text/plain")}
        )
        
    assert response.status_code == 400
    os.remove("test.txt")
