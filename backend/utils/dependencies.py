# pyrefly: ignore [missing-import]
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
# pyrefly: ignore [missing-import]
from jose import JWTError, jwt
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
import models
from utils.auth import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def verify_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    admin = db.query(models.Admin).filter(models.Admin.email == email).first()
    if admin is None:
        raise credentials_exception
    return admin
