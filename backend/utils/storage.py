import os
import shutil
import uuid
import tempfile
from fastapi import UploadFile, HTTPException

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
    
    if remove_bg:
        try:
            from rembg import remove
            from io import BytesIO
            from PIL import Image

            print("Removing background using rembg...")
            contents = remove(contents)
            
            # Compress and resize the massive raw PNG output from rembg to prevent WinError 10053
            try:
                img = Image.open(BytesIO(contents))
                
                # Resize if the image is too large (Cloudinary free tier limit is 10MB)
                max_size = (2000, 2000)
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                out_io = BytesIO()
                # Save as optimized PNG to heavily reduce file size
                img.save(out_io, format="PNG", optimize=True)
                contents = out_io.getvalue()
                print(f"Compressed and resized background-removed image size: {len(contents)} bytes")
            except Exception as comp_e:
                print(f"Failed to compress image, using original rembg output: {comp_e}")

            # Ensure the destination filename has a .png extension since background removal produces transparent PNGs
            if not destination_filename.lower().endswith(".png"):
                destination_filename = destination_filename.rsplit('.', 1)[0] + '.png'
        except Exception as e:
            print(f"Background removal failed: {e}")
        
    if STORAGE_PROVIDER == "cloudinary":
        temp_file_path = None
        try:
            # Write to a temporary file first to prevent large memory-buffered POSTs
            # which can trigger WinError 10053 (Connection Aborted) on Windows.
            ext = ".png" if remove_bg else os.path.splitext(destination_filename)[1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
                temp_file.write(contents)
                temp_file_path = temp_file.name

            res = cloudinary.uploader.upload(temp_file_path, resource_type="auto")
            return res.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload failed: {e}")
            raise HTTPException(status_code=502, detail=f"Cloudinary upload failed. Check your network or VPN. ({e})")
        finally:
            if temp_file_path and os.path.exists(temp_file_path):
                os.remove(temp_file_path)
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