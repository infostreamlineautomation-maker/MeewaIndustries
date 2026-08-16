from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from starlette.concurrency import run_in_threadpool
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from typing import List, Optional
from utils.mail_utils import send_email
# pyrefly: ignore [missing-import]
from utils.settings_utils import get_db_settings_dict

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
async def reply_to_enquiry(
    enquiry_id: int, 
    message: str = Form(...),
    is_from_admin: bool = Form(True),
    files: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db)
):
    enquiry = db.query(models.Enquiry).filter(models.Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    # Fetch SMTP settings
    smtp_settings = get_db_settings_dict(db)

    site_title = smtp_settings.get("site_title", "MEEWA")
    subject = f"Re: Your Enquiry at {site_title}"
    port_val = smtp_settings.get("smtp_port")
    smtp_port_num = int(port_val) if port_val else 587

    # Prepare attachments
    attachments = []
    if files:
        for f in files:
            if f.filename:
                content = await f.read()
                attachments.append({
                    "filename": f.filename,
                    "content": content
                })

    # Build HTML Template
    # We will format the original message to preserve newlines
    original_msg_html = enquiry.message.replace('\n', '<br>')
    reply_msg_html = message.replace('\n', '<br>')
    
    html_template = f"""
    <html>
      <head>
        <style>
          body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
          .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
          .header {{ text-align: center; margin-bottom: 30px; }}
          .header img {{ max-width: 150px; }}
          .reply-box {{ margin-bottom: 30px; font-size: 16px; }}
          .original-msg {{ background: #f9f9f9; border-left: 4px solid #E30613; padding: 15px; margin-top: 30px; font-size: 14px; color: #555; }}
          .footer {{ margin-top: 40px; font-size: 12px; color: #888; text-align: center; }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:logo" alt="{site_title} Logo">
          </div>
          <div class="reply-box">
            {reply_msg_html}
          </div>
          <div class="original-msg">
            <strong>On {enquiry.created_at.strftime('%B %d, %Y')}, {enquiry.name} wrote:</strong><br><br>
            {original_msg_html}
          </div>
          <div class="footer">
            &copy; {enquiry.created_at.year} {site_title}. All rights reserved.
          </div>
        </div>
      </body>
    </html>
    """

    # We assume the logo is available in backend/static/logo.png
    inline_images = {"logo": "static/logo.png"}

    success = await run_in_threadpool(
        send_email,
        to_email=enquiry.email,
        subject=subject,
        message=message,  # fallback plain text
        html_message=html_template,
        attachments=attachments,
        inline_images=inline_images,
        smtp_host=smtp_settings.get("smtp_host", ""),
        smtp_port=smtp_port_num,
        smtp_user=smtp_settings.get("smtp_user", ""),
        smtp_pass=smtp_settings.get("smtp_pass", ""),
        from_email=smtp_settings.get("smtp_from_email", "admin@meewaindustries.com"),
        from_name=smtp_settings.get("smtp_from_name", site_title)
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send email. Please check your SMTP configuration.")

    # Mark as Replied if it was New
    if enquiry.status == "New":
        enquiry.status = "Replied"
            
    # Save reply to DB only if email was sent successfully
    db_reply = models.EnquiryReply(
        enquiry_id=enquiry_id,
        message=message,
        is_from_admin=is_from_admin
    )
    db.add(db_reply)
    db.commit()
    db.refresh(db_reply)
    
    return db_reply
