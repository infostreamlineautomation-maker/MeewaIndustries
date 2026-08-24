import os
import requests
from urllib.parse import urlparse
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Load environment variables
load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env")
    exit(1)

# Import models
from models import Product, Category, Page, SiteSetting

# Ensure uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def download_and_save(url: str) -> str:
    """Downloads a file from a URL and saves it to the uploads directory."""
    if not url or "res.cloudinary.com" not in url:
        return url
    
    # Extract filename from URL
    path = urlparse(url).path
    filename = os.path.basename(path)
    
    local_path = os.path.join(UPLOAD_DIR, filename)
    relative_url = f"/uploads/{filename}"
    
    if not os.path.exists(local_path):
        print(f"Downloading {filename}...")
        try:
            response = requests.get(url, stream=True, timeout=30)
            if response.status_code == 200:
                with open(local_path, 'wb') as f:
                    for chunk in response.iter_content(8192):
                        f.write(chunk)
                print(f"✅ Saved to {relative_url}")
            else:
                print(f"❌ Failed to download {url} (HTTP {response.status_code})")
                return url # return original if failed
        except Exception as e:
            print(f"❌ Error downloading {url}: {e}")
            return url
    else:
        print(f"⏭️  File {filename} already exists, skipping download.")
        
    return relative_url

def process_json_data(data):
    """Recursively process JSON data (dicts/lists) to find and replace Cloudinary URLs."""
    if isinstance(data, dict):
        return {k: process_json_data(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [process_json_data(v) for v in data]
    elif isinstance(data, str) and "res.cloudinary.com" in data:
        return download_and_save(data)
    else:
        return data

def main():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("Starting Cloudinary to Local NVMe Migration...")
    
    print("\n--- Processing Categories ---")
    categories = db.query(Category).all()
    for cat in categories:
        if cat.cover_image and "res.cloudinary.com" in cat.cover_image:
            cat.cover_image = download_and_save(cat.cover_image)

    print("\n--- Processing Pages ---")
    pages = db.query(Page).all()
    for page in pages:
        if page.og_image and "res.cloudinary.com" in page.og_image:
            page.og_image = download_and_save(page.og_image)

    print("\n--- Processing Products ---")
    products = db.query(Product).all()
    for prod in products:
        if prod.cover_image and "res.cloudinary.com" in prod.cover_image:
            prod.cover_image = download_and_save(prod.cover_image)
        if prod.hero_animated_image and "res.cloudinary.com" in prod.hero_animated_image:
            prod.hero_animated_image = download_and_save(prod.hero_animated_image)
        if prod.section1_image and "res.cloudinary.com" in prod.section1_image:
            prod.section1_image = download_and_save(prod.section1_image)
        if prod.section2_image and "res.cloudinary.com" in prod.section2_image:
            prod.section2_image = download_and_save(prod.section2_image)
            
        if prod.banner_images:
            prod.banner_images = process_json_data(prod.banner_images)
            
        if prod.description_points:
            prod.description_points = process_json_data(prod.description_points)

    print("\n--- Processing SiteSettings ---")
    settings = db.query(SiteSetting).all()
    for setting in settings:
        if setting.value:
            setting.value = process_json_data(setting.value)

    print("\nCommitting changes to database...")
    db.commit()
    print("✅ Migration completed successfully!")
    db.close()

if __name__ == "__main__":
    main()
