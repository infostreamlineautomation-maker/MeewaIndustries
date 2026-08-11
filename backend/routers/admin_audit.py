# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(
    prefix="/audit",
    tags=["admin_audit"]
)

from typing import Optional

@router.get("")
def get_audit_logs(target_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.AuditLog)
    if target_type:
        query = query.filter(models.AuditLog.target_type == target_type)
    return query.order_by(models.AuditLog.created_at.desc()).all()
