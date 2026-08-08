# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.staticfiles import StaticFiles
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Relative imports
from database import engine, get_db
import models, schemas
from routers import enquiries, settings

# Initialize tables automatically for local dev (can be disabled when using alembic strictly)
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MEEWA B2B API")

import os

# Parse CORS origins from .env
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001,http://192.168.29.172:3000,http://192.168.29.172:3001")
origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local uploads directory for media serving
LOCAL_UPLOAD_DIR = os.getenv("LOCAL_UPLOAD_DIR", "uploads")
if not os.path.exists(LOCAL_UPLOAD_DIR):
    os.makedirs(LOCAL_UPLOAD_DIR)
app.mount("/uploads", StaticFiles(directory=LOCAL_UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(enquiries.router)
app.include_router(settings.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to MEEWA API"}

@app.get("/categories", response_model=list[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).order_by(models.Category.sequence.asc()).all()

@app.get("/products", response_model=list[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.status == "active").order_by(models.Product.sequence.asc()).all()

@app.get("/products/by-slug/{slug}", response_model=schemas.ProductResponse)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    # pyrefly: ignore [missing-import]
    from fastapi import HTTPException
    product = db.query(models.Product).filter(models.Product.slug == slug, models.Product.status == "active").first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
