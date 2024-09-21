# dao/holiday_dao.py

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from ..server.schemas import HolidayCreate
from ..server.models import Holiday  # Adjust the import based on your actual Holiday model

class HolidayDAO:
    def __init__(self, db: AsyncIOMotorCollection):
        self.collection = db.holidays

    async def add_holiday(self, holiday_data: HolidayCreate) -> Holiday:
        holiday_dict = holiday_data.dict()
        result = await self.collection.insert_one(holiday_dict)
        holiday_dict["id"] = str(result.inserted_id)  # Convert ObjectId to string
        return Holiday(**holiday_dict)

    async def get_all_holidays(self) -> list[Holiday]:
        holidays = []
        async for holiday in self.collection.find():
            holiday["id"] = str(holiday["_id"])  # Convert ObjectId to string
            holidays.append(Holiday(**holiday))
        return holidays

    async def get_holiday_by_id(self, holiday_id: str) -> Holiday:
        holiday = await self.collection.find_one({"_id": ObjectId(holiday_id)})
        if holiday is None:
            return None
        holiday["id"] = str(holiday["_id"])  # Convert ObjectId to string
        return Holiday(**holiday)

    async def update_holiday(self, holiday_id: str, holiday_data: HolidayCreate) -> Holiday:
        holiday_dict = holiday_data.dict(exclude_unset=True)
        await self.collection.update_one({"_id": ObjectId(holiday_id)}, {"$set": holiday_dict})

        # Retrieve the updated record
        updated_record = await self.collection.find_one({"_id": ObjectId(holiday_id)})
        if updated_record is None:
            return None
        updated_record["id"] = str(updated_record["_id"])  # Convert ObjectId to string
        return Holiday(**updated_record)

    async def delete_holiday(self, holiday_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(holiday_id)})
        return result.deleted_count > 0
