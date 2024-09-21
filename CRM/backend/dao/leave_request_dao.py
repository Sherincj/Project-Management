# dao/leave_request_dao.py

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from ..server.schemas import LeaveRequestCreate, LeaveRequest  # Adjust the import based on your actual LeaveRequest model

class LeaveRequestDAO:
    def __init__(self, db: AsyncIOMotorCollection):
        self.collection = db.leave_requests

    async def add_leave_request(self, leave_request_data: LeaveRequestCreate) -> LeaveRequest:
        leave_request_dict = leave_request_data.dict()
        result = await self.collection.insert_one(leave_request_dict)
        leave_request_dict["id"] = str(result.inserted_id)  # Convert ObjectId to string
        return LeaveRequest(**leave_request_dict)

    async def get_all_leave_requests(self) -> list[LeaveRequest]:
        leave_requests = []
        async for leave in self.collection.find():
            leave["id"] = str(leave["_id"])  # Convert ObjectId to string
            leave_requests.append(LeaveRequest(**leave))
        return leave_requests

    async def get_leave_request_by_id(self, leave_id: str) -> LeaveRequest:
        leave = await self.collection.find_one({"_id": ObjectId(leave_id)})
        if leave is None:
            return None
        leave["id"] = str(leave["_id"])  # Convert ObjectId to string
        return LeaveRequest(**leave)

    async def get_pending_leave_request(self, employee_id: str) -> LeaveRequest:
        leave = await self.collection.find_one({"employee_id": employee_id, "status": "processing"})
        if leave is None:
            return None
        leave["id"] = str(leave["_id"])  # Convert ObjectId to string
        return LeaveRequest(**leave)

    async def delete_leave_request(self, leave_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(leave_id)})
        return result.deleted_count > 0
