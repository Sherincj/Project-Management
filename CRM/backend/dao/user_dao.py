from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from typing import Optional
from ..server.models import User  # Adjust the import based on your actual User model

class UserDAO:
    def __init__(self, db: AsyncIOMotorCollection):
        self.collection = db.users  # Adjust the collection name as needed

    async def user_exists(self, email: str) -> bool:
        """Check if a user exists in the database by email."""
        user = await self.collection.find_one({"email": email})
        return user is not None

    async def create_user(self, user: User) -> None:
        """Create a new user in the database."""
        user_data = user.dict()
        user_data['_id'] = ObjectId()  # Generate a new ObjectId for the user
        await self.collection.insert_one(user_data)

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Retrieve a user by email."""
        user_data = await self.collection.find_one({"email": email})
        if user_data:
            return User(**user_data)  # Convert the dictionary to a User object
        return None
