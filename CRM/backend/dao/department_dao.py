# dao/department_dao.py

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from ..server.schemas import DepartmentCreate, DepartmentUpdate
from ..server.models import Department  # Adjust the import based on your actual Department model

class DepartmentDAO:
    def __init__(self, db: AsyncIOMotorCollection):
        self.collection = db.departments

    async def add_department(self, department_data: DepartmentCreate) -> Department:
        department_dict = department_data.dict()
        result = await self.collection.insert_one(department_dict)
        department_dict["id"] = str(result.inserted_id)  # Convert ObjectId to string
        return Department(**department_dict)

    async def get_all_departments(self) -> list[Department]:
        departments = []
        async for dept in self.collection.find():
            dept["id"] = str(dept["_id"])  # Convert ObjectId to string
            departments.append(Department(**dept))
        return departments

    async def get_department_by_id(self, department_id: str) -> Department:
        dept = await self.collection.find_one({"_id": ObjectId(department_id)})
        if dept is None:
            return None
        dept["id"] = str(dept["_id"])  # Convert ObjectId to string
        return Department(**dept)

    async def update_department(self, department_id: str, department_data: DepartmentUpdate) -> Department:
        dept = await self.collection.find_one({"_id": ObjectId(department_id)})
        if dept is None:
            return None

        department_dict = department_data.dict(exclude_unset=True)
        await self.collection.update_one({"_id": ObjectId(department_id)}, {"$set": department_dict})

        # Retrieve the updated record
        updated_record = await self.collection.find_one({"_id": ObjectId(department_id)})
        updated_record["id"] = str(updated_record["_id"])  # Convert ObjectId to string
        return Department(**updated_record)

    async def delete_department(self, department_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(department_id)})
        return result.deleted_count > 0
