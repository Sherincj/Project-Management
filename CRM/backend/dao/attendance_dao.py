# dao/attendance_dao.py

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from ..server.schemas import AttendanceCreate, AttendanceUpdate
from ..server.models import Attendance  # Adjust the import based on your actual Attendance model

class AttendanceDAO:
    def __init__(self, db: AsyncIOMotorCollection):
        self.collection = db.attendance

    async def add_attendance(self, attendance_data: AttendanceCreate) -> Attendance:
        attendance_dict = attendance_data.dict()
        result = await self.collection.insert_one(attendance_dict)
        attendance_dict["id"] = str(result.inserted_id)  # Convert ObjectId to string
        return Attendance(**attendance_dict)

    async def get_all_attendance(self) -> list[Attendance]:
        attendance_records = []
        async for record in self.collection.find():
            record["id"] = str(record["_id"])  # Convert ObjectId to string
            attendance_records.append(Attendance(**record))
        return attendance_records

    async def get_attendance_by_id(self, attendance_id: str) -> Attendance:
        record = await self.collection.find_one({"_id": ObjectId(attendance_id)})
        if record is None:
            return None
        record["id"] = str(record["_id"])  # Convert ObjectId to string
        return Attendance(**record)
    
    async def get_attendance_by_date_and_name(self, date: str, name: str) -> Attendance:
        record = await self.collection.find_one({"date": date, "name": name})
        if record is None:
            return None
        record["id"] = str(record["_id"])  # Convert ObjectId to string
        return Attendance(**record)

    async def update_attendance(self, attendance_id: str, attendance_data: AttendanceUpdate) -> Attendance:
        record = await self.collection.find_one({"_id": ObjectId(attendance_id)})
        if record is None:
            return None

        # Prepare the update dictionary, excluding unset fields
        attendance_dict = attendance_data.dict(exclude_unset=True)
        
        # Update the record
        await self.collection.update_one({"_id": ObjectId(attendance_id)}, {"$set": attendance_dict})

        # Retrieve the updated record
        updated_record = await self.collection.find_one({"_id": ObjectId(attendance_id)})
        updated_record["id"] = str(updated_record["_id"])  # Convert ObjectId to string
        return Attendance(**updated_record)

    async def delete_attendance(self, date: str, name: str) -> bool:
        result = await self.collection.delete_one({"date": date, "name": name})
        return result.deleted_count > 0
