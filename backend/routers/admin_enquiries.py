# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from typing import List
from utils.mail_utils import send_email

router = APIRouter(
    prefix="/enquiries",
    tags=["admin_enquiries"]
)

@router.get("", response_model=List[schemas.EnquiryResponse])
def get_enquiries(db: Session = Depends(get_db)):
    return db.query(models.Enquiry).order_by(models.Enquiry.created_at.desc()).all()

@router.get("/{enquiry_id}", response_model=schemas.EnquiryResponse)
def get_enquiry(enquiry_id: int, db: Session = Depends(get_db)):
    enquiry = db.query(models.Enquiry).filter(models.Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return enquiry

@router.put("/{enquiry_id}/status")
def update_enquiry_status(enquiry_id: int, status: str, db: Session = Depends(get_db)):
    enquiry = db.query(models.Enquiry).filter(models.Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry.status = status
    db.commit()
    return {"message": "Status updated successfully"}

@router.post("/{enquiry_id}/reply", response_model=schemas.EnquiryReplyResponse)
def reply_to_enquiry(enquiry_id: int, reply: schemas.EnquiryReplyCreate, db: Session = Depends(get_db)):
    enquiry = db.query(models.Enquiry).filter(models.Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    # Fetch SMTP settings
    smtp_settings = {}
    db_settings = db.query(models.SiteSetting).all()
    for s in db_settings:
        if isinstance(s.value, dict) and 'value' in s.value:
            smtp_settings[s.key] = s.value['value']
        else:
            smtp_settings[s.key] = s.value

    # Send Email
    site_title = smtp_settings.get("site_title", "MEEWA")
    subject = f"Re: Your Enquiry at {site_title}"
    # Safe integer parsing for SMTP port
    port_val = smtp_settings.get("smtp_port")
    smtp_port_num = int(port_val) if port_val else 587

    success = send_email(
        to_email=enquiry.email,
        subject=subject,
        message=reply.message,
        smtp_host=smtp_settings.get("smtp_host", ""),
        smtp_port=smtp_port_num,
        smtp_user=smtp_settings.get("smtp_user", ""),
        smtp_pass=smtp_settings.get("smtp_pass", ""),
        from_email=smtp_settings.get("smtp_from_email", "admin@meewaindustries.com"),
        from_name=smtp_settings.get("smtp_from_name", site_title)
    )
    
    if success:
        # Mark as Replied if it was New
        if enquiry.status == "New":
            enquiry.status = "Replied"
            
    # Save reply to DB regardless of email success (for record)
    db_reply = models.EnquiryReply(
        enquiry_id=enquiry_id,
        message=reply.message,
        is_from_admin=reply.is_from_admin
    )
    db.add(db_reply)
    db.commit()
    db.refresh(db_reply)
    
    return db_reply
