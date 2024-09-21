# dao/comment_dao.py

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from ..server.schemas import CommentCreate, Comment

class CommentDAO:
    def __init__(self, db: AsyncIOMotorCollection):
        self.collection = db.comments

    async def create_comment(self, comment_data: CommentCreate) -> Comment:
        comment_dict = comment_data.dict()
        comment_dict["_id"] = ObjectId()  # Generate a new ObjectId for MongoDB
        result = await self.collection.insert_one(comment_dict)
        comment_dict["id"] = str(result.inserted_id)  # Convert ObjectId to string
        return Comment(**comment_dict)

    async def get_comments_by_task(self, task_id: str) -> list[Comment]:
        comments = await self.collection.find({"task_id": task_id}).to_list(length=None)
        return [self._convert_comment(comment) for comment in comments]

    async def reply_to_comment(self, comment_id: str, reply: CommentCreate) -> Comment:
        comment = await self.collection.find_one({"_id": ObjectId(comment_id)})
        if not comment:
            return None

        new_reply = reply.dict()
        new_reply["_id"] = ObjectId()  # Generate a new ObjectId for the reply
        comment['replies'].append(new_reply)
        await self.collection.update_one({"_id": ObjectId(comment_id)}, {"$set": {"replies": comment['replies']}})
        return self._convert_comment(comment)

    async def delete_comment(self, comment_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(comment_id)})
        return result.deleted_count > 0

    async def update_comment(self, comment_id: str, updated_content: str) -> Comment:
        comment = await self.collection.find_one({"_id": ObjectId(comment_id)})
        if not comment:
            return None

        comment['content'] = updated_content
        await self.collection.update_one({"_id": ObjectId(comment_id)}, {"$set": {"content": updated_content}})
        return self._convert_comment(comment)

    def _convert_comment(self, comment) -> Comment:
        comment["id"] = str(comment["_id"])  # Convert ObjectId to string
        del comment["_id"]  # Remove the original ObjectId field
        return Comment(**comment)
