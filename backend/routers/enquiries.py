# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional
import models
from database import get_db

router = APIRouter(
    prefix="/enquiries",
    tags=["enquiries"],
)

class EnquiryCreate(BaseModel):
    name: str
    email: str
    phone: str
    message: str
    product_id: Optional[int] = None
    products_requested: Optional[list[dict]] = None
    source_page: Optional[str] = "Contact Form"

@router.post("/", status_code=201)
def create_enquiry(enquiry: EnquiryCreate, db: Session = Depends(get_db)):
    db_enquiry = models.Enquiry(**enquiry.model_dump())
    db.add(db_enquiry)
    db.commit()
    db.refresh(db_enquiry)
    return {"message": "Enquiry submitted successfully", "id": db_enquiry.id}
