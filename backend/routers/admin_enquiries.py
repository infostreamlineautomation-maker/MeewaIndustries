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
    original_msg_html = enquiry.message.replace('\n', '<br>')
    reply_msg_html = message.replace('\n', '<br>')
    
    site_logo_url = smtp_settings.get("site_logo_url", "")
    if site_logo_url:
        logo_src = site_logo_url if site_logo_url.startswith("http") else f"https://api.meewaindustries.com{site_logo_url}"
        logo_html = f'<img src="{logo_src}" alt="{site_title} Logo">'
    else:
        logo_html = f'<h2>{site_title}</h2>'
    
    html_template = f"""
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f7f6; }}
          .email-wrapper {{ width: 100%; background-color: #f4f7f6; padding: 40px 0; }}
          .email-content {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }}
          .header {{ padding: 30px; text-align: center; border-bottom: 1px solid #eeeeee; }}
          .header img {{ max-height: 60px; max-width: 250px; object-fit: contain; }}
          .header h2 {{ margin: 0; color: #E30613; font-size: 24px; }}
          .body-content {{ padding: 40px 30px; }}
          .greeting {{ font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #111111; }}
          .reply-box {{ font-size: 16px; margin-bottom: 40px; color: #333333; }}
          .divider {{ height: 1px; background-color: #eeeeee; margin: 30px 0; }}
          .original-msg-container {{ background-color: #f9fafb; border-radius: 6px; padding: 20px; border-left: 4px solid #E30613; }}
          .original-msg-header {{ font-size: 13px; color: #6b7280; margin-bottom: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }}
          .original-msg-body {{ font-size: 14px; color: #4b5563; font-style: italic; }}
          .footer {{ background-color: #f9fafb; padding: 20px 30px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #eeeeee; }}
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-content">
            <div class="header">
              {logo_html}
            </div>
            <div class="body-content">
              <div class="greeting">Hi {enquiry.name},</div>
              <div class="reply-box">
                {reply_msg_html}
              </div>
              
              <div class="divider"></div>
              
              <div class="original-msg-container">
                <div class="original-msg-header">Your Original Enquiry ({enquiry.created_at.strftime('%b %d, %Y')})</div>
                <div class="original-msg-body">
                  "{original_msg_html}"
                </div>
              </div>
            </div>
            <div class="footer">
              &copy; {enquiry.created_at.year} {site_title}. All rights reserved.<br>
              This email was sent in response to your enquiry on our website.
            </div>
          </div>
        </div>
      </body>
    </html>
    """
    
    inline_images = None

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
