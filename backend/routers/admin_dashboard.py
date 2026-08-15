# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from typing import List
from datetime import datetime

router = APIRouter(
    prefix="/dashboard-stats",
    tags=["admin_dashboard"]
)

@router.get("")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_products = db.query(models.Product).count()
    active_categories = db.query(models.Category).count()
    
    total_enquiries = db.query(models.Enquiry).count()
    new_enquiries = db.query(models.Enquiry).filter(models.Enquiry.status == "New").count()
    recent_enquiries = db.query(models.Enquiry).order_by(models.Enquiry.created_at.desc()).limit(5).all()
    
    return {
        "total_products": total_products,
        "active_categories": active_categories,
        "total_enquiries": total_enquiries,
        "new_enquiries": new_enquiries,
        "recent_enquiries": recent_enquiries
    }
