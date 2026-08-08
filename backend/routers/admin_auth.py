# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, Response, Request
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from utils.auth import verify_password, create_access_token, get_password_hash

router = APIRouter(
    prefix="/auth",
    tags=["admin_auth"]
)

class LoginRequest(BaseModel):
    username: str
    password: str

class ProfileUpdateRequest(BaseModel):
    username: str
    password: str = None # Optional

@router.post("/login")
def login(req: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.AdminUser).filter(models.AdminUser.username == req.username).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": str(user.id)})
    
    # Set HTTP-only cookie
    response.set_cookie(
        key="auth_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=60 * 24 * 7 * 60, # 7 days in seconds
        secure=False # Set to True in production (HTTPS)
    )
    
    return {"message": "Logged in successfully"}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("auth_token")
    return {"message": "Logged out successfully"}

from utils.dependencies import verify_admin

@router.get("/me", response_model=schemas.AdminUserResponse)
def get_me(request: Request, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    # This requires the dependency to have injected request.state.admin_id
    admin_id = getattr(request.state, "admin_id", None)
    if not admin_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user = db.query(models.AdminUser).filter(models.AdminUser.id == admin_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.put("/profile")
def update_profile(req: ProfileUpdateRequest, request: Request, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    admin_id = getattr(request.state, "admin_id", None)
    if not admin_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    user = db.query(models.AdminUser).filter(models.AdminUser.id == admin_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    user.username = req.username
    if req.password and req.password.strip():
        user.password_hash = get_password_hash(req.password)
        
    db.commit()
    return {"message": "Profile updated successfully"}
