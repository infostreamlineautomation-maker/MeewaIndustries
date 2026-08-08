import os
import shutil
import uuid
from fastapi import UploadFile

STORAGE_PROVIDER = os.getenv("STORAGE_PROVIDER", "local")
LOCAL_UPLOAD_DIR = os.getenv("LOCAL_UPLOAD_DIR", "uploads")

if STORAGE_PROVIDER == "local" and not os.path.exists(LOCAL_UPLOAD_DIR):
    os.makedirs(LOCAL_UPLOAD_DIR)

# Initialize Cloudinary if provider is cloudinary
if STORAGE_PROVIDER == "cloudinary":
    import cloudinary
    import cloudinary.uploader
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET")
    )

def save_upload_file(upload_file: UploadFile, destination_filename: str, remove_bg: bool = False) -> str:
    # Read the file contents
    contents = upload_file.file.read()
    upload_file.file.seek(0)
    
    # We will ignore remove_bg for now or just pass through.
    if remove_bg:
        print("Background removal requested, but not implemented in this version.")
        
    if STORAGE_PROVIDER == "cloudinary":
        try:
            # Upload directly to cloudinary using the file contents
            res = cloudinary.uploader.upload(contents, resource_type="auto")
            return res.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload failed: {e}")
            raise e
    else:
        # Default to local
        file_location = os.path.join(LOCAL_UPLOAD_DIR, destination_filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        return f"/uploads/{destination_filename}"

def delete_file(file_url: str):
    if not file_url:
        return
        
    if STORAGE_PROVIDER == "cloudinary" and "cloudinary.com" in file_url:
        try:
            import cloudinary.uploader
            # Extract public_id from URL
            # Cloudinary URLs look like: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/public_id.png
            # Or with folders: .../upload/v12345/folder/public_id.png
            parts = file_url.split('/upload/')
            if len(parts) > 1:
                path = parts[1].split('/', 1)[-1] # skip version number
                public_id = path.rsplit('.', 1)[0] # remove extension
                cloudinary.uploader.destroy(public_id)
        except Exception as e:
            print(f"Cloudinary delete failed: {e}")
    else:
        # Local delete
        if file_url.startswith("/uploads/"):
            filename = file_url.replace("/uploads/", "")
            file_path = os.path.join(LOCAL_UPLOAD_DIR, filename)
            if os.path.exists(file_path):
                os.remove(file_path)