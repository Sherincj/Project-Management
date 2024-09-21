import os
import logging
import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

from backend.server.database import MongoDB, get_db
from ..auth.auth import AuthJWT
from ..server.models import Invitation, User
from ..server.schemas import InvitationCreate
from .email_sent import send_email, send_welcome_back_email
from ..dao.invitation_dao import InvitationDAO  # Import the InvitationDAO
from ..dao.user_dao import UserDAO  # Import the UserDAO

router = APIRouter()

# Dependency to get InvitationDAO
def get_invitation_dao(db: MongoDB = Depends(get_db)) -> InvitationDAO:
    return InvitationDAO(db.db)  # Ensure we're passing the correct collection

# Dependency to get UserDAO
def get_user_dao(db: MongoDB = Depends(get_db)) -> UserDAO:
    return UserDAO(db.db)  # Ensure we're passing the correct collection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_invitation_token():
    return secrets.token_urlsafe(32)

@router.post("/", response_model=Invitation)
async def create_invitation(request: Request, invitation: InvitationCreate, invitation_dao: InvitationDAO = Depends(get_invitation_dao)):
    current_user = request.state.user
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.debug(f"Current user: {current_user}")

    # Check for existing invitation
    existing_invitation = await invitation_dao.find_existing_invitation(invitation.email)
    
    if existing_invitation:
        logging.debug(f"Existing invitation found: {existing_invitation}")
        
        # Calculate remaining time until expiration
        expiration_time = existing_invitation["expires_at"]
        time_left = expiration_time - datetime.utcnow()

        if time_left.total_seconds() > 0:
            remaining_minutes = time_left.total_seconds() // 60
            logging.info(f"Invitation already sent. It expires in {int(remaining_minutes)} minutes.")
            return {
                "message": f"An invitation has already been sent to {invitation.email}. It expires in {int(remaining_minutes)} minutes.",
                "status": "warning",
                "expires_in": int(remaining_minutes)  # Return remaining minutes
            }
        else:
            # If the existing invitation has expired, delete it
            logging.info("Existing invitation has expired. Deleting...")
            await invitation_dao.delete_invitation(existing_invitation["_id"])

    # Proceed to create a new invitation
    token = generate_invitation_token()
    expiration_time = datetime.utcnow() + timedelta(minutes=10)  # Set expiration to 10 minutes from now

    invitation_data = {
        "_id": str(ObjectId()),
        "token": token,
        "email": invitation.email,
        "created_by": current_user,
        "expires_at": expiration_time,
        "used": False
    }

    try:
        await invitation_dao.create_invitation(invitation_data)
        send_email(invitation.email, token)  # Send invitation email
        logging.info(f"New invitation sent to {invitation.email} with token {token}.")
        return invitation_data
    except Exception as e:
        logging.error("Error inserting invitation: " + str(e))
        raise HTTPException(status_code=500, detail="Error inserting invitation: " + str(e))
        raise HTTPException(status_code=500, detail="Error inserting invitation: " + str(e))
    
@router.get("/invitation/{invitation_token}")
async def validate_invitation(invitation_token: str, invitation_dao: InvitationDAO = Depends(get_invitation_dao), user_dao: UserDAO = Depends(get_user_dao)):
    try:
        logging.debug(f"Received invitation token: {invitation_token}")
        
        invitation = await invitation_dao.get_invitation_by_token(invitation_token)
        if not invitation:
            logging.error("Invalid invitation token")
            raise HTTPException(status_code=404, detail="Invalid invitation token")
        
        if invitation["expires_at"] < datetime.utcnow():
            logging.error("Invitation expired")
            raise HTTPException(status_code=400, detail="Invitation expired")
        
        if invitation["used"]:
            logging.error("Invitation already used")
            raise HTTPException(status_code=400, detail="Invitation already used")
        
        existing_user = await user_dao.get_user_by_email(invitation["email"])
        if existing_user:
            logging.info("Existing user found, sending welcome back email")
            send_welcome_back_email(existing_user['email'])  # Send welcome back email
        else:
            logging.info("Creating new user")
            hashed_password = pwd_context.hash("default_password")  # Replace with your password generation logic
            new_user = User(
                id=str(ObjectId()),
                username=invitation["email"].split('@')[0],  # Use email prefix as username
                email=invitation["email"],
                password=hashed_password
            )
            await user_dao.create_user(new_user)  # Use the UserDAO to create the user
        
        await invitation_dao.update_invitation(invitation["_id"], {"used": True})
        return {"message": "Invitation valid, user created or updated"}
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        logging.error(f"Error validating invitation: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
