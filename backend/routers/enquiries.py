# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, Request
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from utils.limiter import limiter
import models
from database import get_db

router = APIRouter(
    prefix="/enquiries",
    tags=["enquiries"],
)

class EnquiryCreate(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    message: str = Field(..., max_length=2000)
    product_id: Optional[int] = None
    products_requested: Optional[list[dict]] = None
    source_page: Optional[str] = "Contact Form"

@router.post("/", status_code=201)
@limiter.limit("5/minute")
def create_enquiry(request: Request, enquiry: EnquiryCreate, db: Session = Depends(get_db)):
    db_enquiry = models.Enquiry(**enquiry.model_dump())
    db.add(db_enquiry)
    db.commit()
    db.refresh(db_enquiry)
    return {"message": "Enquiry submitted successfully", "id": db_enquiry.id}
