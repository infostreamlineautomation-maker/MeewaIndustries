# pyrefly: ignore [missing-import]
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
# pyrefly: ignore [missing-import]
from jose import JWTError, jwt
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
import models
from utils.auth import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

def verify_admin(request: Request, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Try getting token from header first
    token = request.headers.get("Authorization")
    if token and token.startswith("Bearer "):
        token = token.split(" ")[1]
    
    # If not in header, try getting it from cookie
    if not token:
        token = request.cookies.get("auth_token")
        
    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id_str: str = payload.get("sub")
        if admin_id_str is None:
            raise credentials_exception
        admin_id = int(admin_id_str)
    except (JWTError, ValueError):
        raise credentials_exception
        
    admin = db.query(models.AdminUser).filter(models.AdminUser.id == admin_id).first()
    if admin is None:
        raise credentials_exception
        
    # Inject into request state so other routers can use it
    request.state.admin_id = admin.id
    return admin
