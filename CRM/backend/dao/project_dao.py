# dao/project_dao.py

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from ..server.models import Project
from ..server.schemas import ProjectCreate, Project

class ProjectDAO:
    def __init__(self, db: AsyncIOMotorCollection):
        self.collection = db.projects

    async def create_project(self, project: Project) -> Project:
        result = await self.collection.insert_one(project.dict())
        project.id = str(result.inserted_id)
        return project

    async def get_projects(self) -> list[Project]:
        projects = await self.collection.find().to_list(length=None)
        return [self._convert_project(project) for project in projects]

    async def get_filtered_projects(self, status: str) -> list[Project]:
        filter_query = {}
        if status.lower() != 'all':
            filter_query['status'] = status
        projects = await self.collection.find(filter_query).to_list(length=None)
        return [self._convert_project(project) for project in projects]

    async def update_project(self, project_id: str, project_data: ProjectCreate) -> Project:
        updated_project = await self.collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": project_data.dict(exclude_unset=True)},
            return_document=True
        )
        if not updated_project:
            return None
        return self._convert_project(updated_project)

    async def delete_project(self, project_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(project_id)})
        return result.deleted_count > 0

    def _convert_project(self, project) -> Project:
        project["id"] = str(project["_id"])  # Convert ObjectId to string
        del project["_id"]  # Remove the original ObjectId field
        return Project(**project)

    # Method to count all projects
    async def get_total_projects_count(self) -> int:
        count = await self.collection.count_documents({})
        return count

    # Method to count projects by status
    async def get_projects_count_by_status(self, status: str) -> int:
        count = await self.collection.count_documents({"status": status})
        return count
