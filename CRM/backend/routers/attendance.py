# routers/attendance.py

import logging
from fastapi import APIRouter, Body, Depends, HTTPException, Request
from typing import List
from ..server.schemas import AttendanceCreate, AttendanceUpdate
from ..server.models import Attendance
from ..dao.attendance_dao import AttendanceDAO  # Import the AttendanceDAO
from backend.server.database import MongoDB, get_db  # Ensure you have a get_db function to provide the database connection

router = APIRouter()

# Dependency to get the AttendanceDAO
async def get_attendance_dao(db: MongoDB = Depends(get_db)) -> AttendanceDAO:
    return AttendanceDAO(db.db)

# Endpoint to add an attendance record
@router.post("/", response_model=Attendance)
async def add_attendance(request: Request, attendance: AttendanceCreate, 
                          attendance_dao: AttendanceDAO = Depends(get_attendance_dao)):
    logging.debug("Received request to create an attendance record.")

    # Get the current user from the request state
    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.debug(f"Current user: {user_identifier}")

    # Check if the attendance record already exists for the given date and employee
    existing_record = await attendance_dao.get_attendance_by_date_and_name(attendance.date, attendance.name)
    if existing_record:
        logging.debug(f"Attendance record already exists for employee {attendance.name} on {attendance.date}")
        return existing_record

    created_attendance = await attendance_dao.add_attendance(attendance)
    return created_attendance

# Endpoint to get all attendance records
@router.get("/", response_model=List[Attendance])
async def get_attendance(attendance_dao: AttendanceDAO = Depends(get_attendance_dao)):
    logging.debug("Received request to get all attendance records.")
    attendance_records = await attendance_dao.get_all_attendance()
    logging.debug(f"Returning {len(attendance_records)} attendance records.")
    return attendance_records

# Endpoint to get a specific attendance record by ID
@router.get("/{attendance_id}", response_model=Attendance)
async def get_attendance_record(attendance_id: str, attendance_dao: AttendanceDAO = Depends(get_attendance_dao)):
    logging.debug(f"Received request to get attendance record with ID: {attendance_id}")
    record = await attendance_dao.get_attendance_by_id(attendance_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Attendance record not found.")
    return record

# Endpoint to update an attendance record by ID
@router.put("/{id}", response_model=Attendance)
async def update_attendance_record(id: str, attendance: AttendanceUpdate, 
                                   attendance_dao: AttendanceDAO = Depends(get_attendance_dao)):
    logging.debug(f"Received request to update attendance record with ID: {id}")
    logging.debug(f"Update data: {attendance.dict()}")

    # Retrieve the record to be updated
    record = await attendance_dao.get_attendance_by_id(id)
    if record is None:
        logging.error(f"Attendance record with ID {id} not found.")
        raise HTTPException(status_code=404, detail="Attendance record not found.")

    # Log the current record for debugging
    logging.debug(f"Current record before update: {record}")

    # Update the record using the DAO
    updated_record = await attendance_dao.update_attendance(id, attendance)

    if updated_record is None:
        logging.error(f"Failed to update attendance record with ID {id}.")
        raise HTTPException(status_code=404, detail="Attendance record not found after update.")

    logging.debug(f"Updated attendance record: {updated_record}")
    return updated_record

# Endpoint to delete an attendance record by date and name
@router.delete("/", response_model=Attendance)
async def delete_attendance_record(request: Request, 
                                    date: str = Body(...), 
                                    name: str = Body(...), 
                                    attendance_dao: AttendanceDAO = Depends(get_attendance_dao)):
    logging.debug(f"Received request to delete attendance record for date: {date} and employee: {name}")

    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    record = await attendance_dao.get_attendance_by_date_and_name(date, name)
    if record is None:
        logging.error(f"Attendance record not found for date: {date} and employee: {name}")
        raise HTTPException(status_code=404, detail="Attendance record not found.")

    await attendance_dao.delete_attendance(date, name)
    logging.debug(f"Attendance record deleted for date: {date} and employee: {name}")
    return record