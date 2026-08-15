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
from utils.mail_utils import send_email
from routers.admin_enquiries import get_db_settings_dict

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

    # Fetch SMTP settings to notify admin
    try:
        from routers.admin_enquiries import get_db_settings_dict
        smtp_settings = get_db_settings_dict(db)
        notification_emails = smtp_settings.get("notification_emails", "")
        if notification_emails:
            site_title = smtp_settings.get("site_title", "MEEWA")
            subject = f"New Enquiry Received: {db_enquiry.name} ({site_title})"
            
            message = f"You have received a new enquiry.\n\n"
            message += f"Name: {db_enquiry.name}\n"
            message += f"Email: {db_enquiry.email}\n"
            message += f"Phone: {db_enquiry.phone}\n"
            message += f"Source: {db_enquiry.source_page}\n"
            message += f"Message: {db_enquiry.message}\n"
            
            port_val = smtp_settings.get("smtp_port")
            smtp_port_num = int(port_val) if port_val else 587
            
            emails = [e.strip() for e in notification_emails.split(",") if e.strip()]
            for to_email in emails:
                send_email(
                    to_email=to_email,
                    subject=subject,
                    message=message,
                    smtp_host=smtp_settings.get("smtp_host", ""),
                    smtp_port=smtp_port_num,
                    smtp_user=smtp_settings.get("smtp_user", ""),
                    smtp_pass=smtp_settings.get("smtp_pass", ""),
                    from_email=smtp_settings.get("smtp_from_email", "admin@meewaindustries.com"),
                    from_name=smtp_settings.get("smtp_from_name", site_title)
                )
    except Exception as e:
        print(f"Failed to send admin notification email: {e}")

    return {"message": "Enquiry submitted successfully", "id": db_enquiry.id}
