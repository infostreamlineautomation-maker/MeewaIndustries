# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Depends
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import engine, get_db
import models
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Import Admin Routers
from routers import admin_settings, admin_products, admin_categories, admin_dashboard, admin_enquiries, admin_auth, admin_audit
from utils.dependencies import verify_admin

app = FastAPI(title="MEEWA Admin API")

# Ensure tables exist
# models.Base.metadata.create_all(bind=engine)

import os

# Parse CORS origins from .env
cors_origins_str = os.getenv("ADMIN_CORS_ORIGINS", "http://localhost:3001,http://127.0.0.1:3001,http://192.168.29.172:3001")
origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Restrict to Admin Frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth is unprotected
app.include_router(admin_auth.router)

# All other routers are protected
protected_deps = [Depends(verify_admin)]
app.include_router(admin_settings.router, dependencies=protected_deps)
app.include_router(admin_products.router, dependencies=protected_deps)
app.include_router(admin_categories.router, dependencies=protected_deps)
app.include_router(admin_dashboard.router, dependencies=protected_deps)
app.include_router(admin_enquiries.router, dependencies=protected_deps)
app.include_router(admin_audit.router, dependencies=protected_deps)

@app.get("/")
def read_root():
    return {"message": "Welcome to MEEWA Admin API"}
