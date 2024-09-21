# dao/invitation_dao.py

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
import logging

logger = logging.getLogger("uvicorn.error")

class InvitationDAO:
    def __init__(self, db: AsyncIOMotorCollection):
        self.collection = db.invitations

    async def create_invitation(self, invitation_data: dict) -> str:
        """Insert a new invitation into the database."""
        try:
            result = await self.collection.insert_one(invitation_data)
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error inserting invitation: {e}")
            raise Exception("Could not create invitation.")

    async def get_invitation_by_token(self, token: str):
        """Retrieve an invitation by its token."""
        return await self.collection.find_one({"token": token})

    async def delete_invitation(self, invitation_id: str):
        """Delete an invitation by its ID."""
        await self.collection.delete_one({"_id": ObjectId(invitation_id)})

    async def update_invitation(self, invitation_id: str, update_data: dict):
        """Update an invitation."""
        await self.collection.update_one({"_id": ObjectId(invitation_id)}, {"$set": update_data})

    async def find_existing_invitation(self, email: str):
        """Find the most recent existing invitation by email."""
        return await self.collection.find_one({"email": email})
