import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def send_email(recipient_email, token):
    """Sends an invitation email to the specified recipient with the given token.

    Args:
        recipient_email (str): The email address of the recipient.
        token (str): The invitation token.
    """

    sender_email = os.getenv("SENDER_EMAIL")  # Load sender email from environment variable
    sender_password = os.getenv("SENDER_PASSWORD")  # Load sender password from environment variable

    subject = "Invitation to Join"
    body = f"You have been invited to join. Click the following link to accept: http://localhost:3000/projectslist/{token}"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:  # Replace with your SMTP server
            smtp.starttls()
            smtp.login(sender_email, sender_password)
            smtp.sendmail(sender_email, recipient_email, msg.as_string())
    except Exception as e:
        print(f"Error sending email: {e}")

def send_welcome_back_email(recipient_email):
    """Sends a welcome back email to the specified recipient.

    Args:
        recipient_email (str): The email address of the recipient.
    """

    sender_email = os.getenv("SENDER_EMAIL")  # Load sender email from environment variable
    sender_password = os.getenv("SENDER_PASSWORD")  # Load sender password from environment variable

    subject = "Welcome Back!"
    body = "Welcome back! We're glad to have you back."

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:  # Replace with your SMTP server
            smtp.starttls()
            smtp.login(sender_email, sender_password)
            smtp.sendmail(sender_email, recipient_email, msg.as_string())
    except Exception as e:
        print(f"Error sending welcome back email: {e}")