# dao/employee_dao.py

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from ..server.schemas import EmployeeCreate, EmployeeUpdate
from ..server.models import Employee

class EmployeeDAO:
    def __init__(self, db: AsyncIOMotorCollection):
        self.collection = db.employees

    async def add_employee(self, employee_data: EmployeeCreate) -> Employee:
        employee_dict = employee_data.dict()
        result = await self.collection.insert_one(employee_dict)
        employee_dict["id"] = str(result.inserted_id)  # Convert ObjectId to string
        return Employee(**employee_dict)

    async def get_all_employees(self) -> list[Employee]:
        employees = []
        async for emp in self.collection.find():
            emp["id"] = str(emp["_id"])  # Convert ObjectId to string
            employees.append(Employee(**emp))
        return employees

    async def get_employee_by_id(self, employee_id: str) -> Employee:
        emp = await self.collection.find_one({"_id": ObjectId(employee_id)})
        if emp is None:
            return None
        emp["id"] = str(emp["_id"])  # Convert ObjectId to string
        return Employee(**emp)

    async def get_employee_by_email(self, email: str) -> Employee:
        emp = await self.collection.find_one({"email": email})
        if emp is None:
            return None
        emp["id"] = str(emp["_id"])  # Convert ObjectId to string
        return Employee(**emp)

    async def update_employee(self, employee_id: str, employee_data: EmployeeUpdate) -> Employee:
        emp = await self.collection.find_one({"_id": ObjectId(employee_id)})
        if emp is None:
            return None

        employee_dict = employee_data.dict(exclude_unset=True)
        await self.collection.update_one({"_id": ObjectId(employee_id)}, {"$set": employee_dict})
        emp.update(employee_dict)  # Update the in-memory employee dict
        emp["id"] = str(emp["_id"])  # Convert ObjectId to string
        return Employee(**emp)

    async def delete_employee(self, employee_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(employee_id)})
        return result.deleted_count > 0
