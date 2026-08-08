import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email: str, subject: str, message: str, smtp_host: str, smtp_port: int, smtp_user: str, smtp_pass: str, from_email: str, from_name: str = None):
    """
    Utility function to send an email using SMTP.
    """
    if not all([smtp_host, smtp_port, smtp_user, smtp_pass, from_email]):
        print("SMTP credentials are not fully configured. Email not sent.")
        return False
        
    try:
        msg = MIMEMultipart()
        msg['From'] = f"{from_name} <{from_email}>" if from_name else from_email
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(message, 'plain'))

        # Connect to the server
        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, int(smtp_port))
        else:
            server = smtplib.SMTP(smtp_host, int(smtp_port))
            server.starttls()
            
        server.login(smtp_user, smtp_pass)
        text = msg.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
