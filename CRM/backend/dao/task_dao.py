# dao/task_dao.py

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from ..server.schemas import TaskCreate, Task
from ..server.models import Task as TaskModel

class TaskDAO:
    def __init__(self, db: AsyncIOMotorCollection):
        self.collection = db.tasks

    async def create_task(self, task_data: dict) -> TaskModel:
        result = await self.collection.insert_one(task_data)
        task_data["id"] = str(result.inserted_id)
        return TaskModel(**task_data)

    async def get_tasks_by_project(self, project_id: str) -> list[TaskModel]:
        tasks = await self.collection.find({"project_id": project_id}).to_list(length=None)
        return [self._convert_task(task) for task in tasks]

    async def get_task(self, task_id: str) -> TaskModel:
        task = await self.collection.find_one({"_id": ObjectId(task_id)})
        if task:
            return self._convert_task(task)
        return None

    async def update_task(self, task_id: str, task_data: dict) -> TaskModel:
        result = await self.collection.update_one({"_id": ObjectId(task_id)}, {"$set": task_data})
        if result.modified_count == 1:
            task_data["id"] = task_id
            return TaskModel(**task_data)
        return None

    async def delete_task(self, task_id: str) -> TaskModel:
        task = await self.collection.find_one_and_delete({"_id": ObjectId(task_id)})
        if task:
            task["id"] = str(task["_id"])
            return TaskModel(**task)
        return None

    def _convert_task(self, task) -> TaskModel:
        task["id"] = str(task["_id"])  # Convert ObjectId to string
        del task["_id"]  # Remove the original ObjectId field
        return TaskModel(**task)

    async def get_completed_tasks_count(self) -> int:
        count = await self.collection.count_documents({"status": "Complete"})
        return count
    
    async def get_progress_tasks_count(self) -> int:
        count = await self.collection.count_documents({"status": "In Progress"})
        return count

    async def get_all_tasks_count(self) -> int:
        count = await self.collection.count_documents({})
        return count
