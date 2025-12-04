import shutil
import os
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List
import uuid

router = APIRouter()

UPLOAD_DIR = "backend/static/uploads"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {"image/jpeg", "image/png", "image/webp"}

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", tags=["Upload"])
async def upload_file(file: UploadFile = File(...)):
    """
    Upload an image file.
    Validates file type (JPEG, PNG, WEBP) and size (max 5MB).
    Returns the URL of the uploaded file.
    """
    
    # Validate file type
    if file.content_type not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPEG, PNG, and WEBP are allowed."
        )

    # Validate file size (approximate, as we read chunks)
    # Note: For precise size validation before saving, we might need to read into memory 
    # or check Content-Length header (which can be spoofed). 
    # Here we'll read and check size.
    
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5MB."
        )

    # Generate unique filename
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )

    # Construct public URL (assuming local serving for now)
    # In production with S3/R2, this would be the cloud URL
    file_url = f"/static/uploads/{unique_filename}"

    return {"filename": unique_filename, "url": file_url}
