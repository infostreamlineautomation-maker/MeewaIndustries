# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from fastapi import Request
from typing import Union
import models

def log_audit(db: Session, request: Request, action: str, target_type: str, target_id: Union[str, int, None] = None, details: str = ""):
    admin_id = getattr(request.state, "admin_id", None)
    if not admin_id:
        return # Skip logging if not authenticated (e.g. testing)
        
    audit_entry = models.AuditLog(
        admin_id=admin_id,
        action=action,
        target_type=target_type,
        target_id=str(target_id) if target_id else None,
        details=details
    )
    db.add(audit_entry)