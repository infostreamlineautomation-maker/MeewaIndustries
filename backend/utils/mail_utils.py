import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.image import MIMEImage
import os
from typing import Optional, List, Dict

def send_email(
    to_email: str, 
    subject: str, 
    message: str, 
    smtp_host: str, 
    smtp_port: int, 
    smtp_user: str, 
    smtp_pass: str, 
    from_email: str, 
    from_name: Optional[str] = None,
    html_message: Optional[str] = None,
    attachments: Optional[List[dict]] = None,
    inline_images: Optional[Dict[str, str]] = None
):
    """
    Utility function to send an email using SMTP with support for HTML and attachments.
    `attachments` is a list of dicts: [{"filename": str, "content": bytes}]
    `inline_images` is a dict mapping Content-ID to file path: {"logo": "path/to/logo.png"}
    """
    if not all([smtp_host, smtp_port, smtp_user, smtp_pass, from_email]):
        print("SMTP credentials are not fully configured. Email not sent.")
        return False
        
    try:
        # Create the root message (mixed handles attachments)
        msg_root = MIMEMultipart('related') if inline_images else MIMEMultipart('mixed')
        msg_root['From'] = f"{from_name} <{from_email}>" if from_name else from_email
        msg_root['To'] = to_email
        msg_root['Subject'] = subject

        # Create alternative part for plain/html text
        msg_alt = MIMEMultipart('alternative')
        msg_root.attach(msg_alt)

        # Attach plain text
        msg_alt.attach(MIMEText(message, 'plain'))

        # Attach HTML text if provided
        if html_message:
            msg_alt.attach(MIMEText(html_message, 'html'))

        # Attach inline images
        if inline_images:
            for cid, img_path in inline_images.items():
                if os.path.exists(img_path):
                    with open(img_path, 'rb') as f:
                        img_data = f.read()
                    img = MIMEImage(img_data)
                    img.add_header('Content-ID', f'<{cid}>')
                    img.add_header('Content-Disposition', 'inline')
                    msg_root.attach(img)
                else:
                    print(f"Warning: Inline image {img_path} not found.")

        # Attach files
        if attachments:
            for att in attachments:
                part = MIMEApplication(att['content'], Name=att['filename'])
                part['Content-Disposition'] = f'attachment; filename="{att["filename"]}"'
                msg_root.attach(part)

        # Connect to the server
        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, int(smtp_port))
        else:
            server = smtplib.SMTP(smtp_host, int(smtp_port))
            server.starttls()
            
        server.login(smtp_user, smtp_pass)
        server.sendmail(from_email, to_email, msg_root.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
