# routers/holiday.py

import logging
from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import List
from ..server.schemas import HolidayCreate
from ..server.models import Holiday
from ..dao.holiday_dao import HolidayDAO  # Import the HolidayDAO
from backend.server.database import MongoDB, get_db  # Ensure you have a get_db function to provide the database connection

router = APIRouter()

# Dependency to get the HolidayDAO
async def get_holiday_dao(db: MongoDB = Depends(get_db)) -> HolidayDAO:
    return HolidayDAO(db.db)

# Endpoint to add a holiday
@router.post("/", response_model=Holiday, status_code=status.HTTP_201_CREATED)
async def create_holiday(request: Request, holiday: HolidayCreate, 
                          holiday_dao: HolidayDAO = Depends(get_holiday_dao)):
    logging.debug("Received request to create a holiday.")

    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated")

    logging.debug(f"Current user: {user_identifier}")

    try:
        created_holiday = await holiday_dao.add_holiday(holiday)
        return created_holiday
    except Exception as e:
        logging.error(f"Error creating holiday: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create holiday.")

# Endpoint to get all holidays
@router.get("/", response_model=List[Holiday], status_code=status.HTTP_200_OK)
async def get_holidays(holiday_dao: HolidayDAO = Depends(get_holiday_dao)):
    logging.debug("Received request to fetch all holidays.")
    try:
        holidays = await holiday_dao.get_all_holidays()
        return holidays
    except Exception as e:
        logging.error(f"Error retrieving holidays: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error while fetching holidays.")

# Endpoint to get a specific holiday by ID
@router.get("/{holiday_id}", response_model=Holiday, status_code=status.HTTP_200_OK)
async def get_holiday(holiday_id: str, holiday_dao: HolidayDAO = Depends(get_holiday_dao)):
    logging.debug(f"Received request to get holiday with ID: {holiday_id}")
    holiday = await holiday_dao.get_holiday_by_id(holiday_id)
    if holiday is None:
        logging.error(f"Holiday not found for ID: {holiday_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Holiday not found.")
    return holiday

# Endpoint to update a holiday by ID
@router.put("/{holiday_id}", response_model=Holiday, status_code=status.HTTP_200_OK)
async def update_holiday(holiday_id: str, holiday: HolidayCreate, 
                         holiday_dao: HolidayDAO = Depends(get_holiday_dao)):
    logging.debug(f"Received request to update holiday with ID: {holiday_id}")
    updated_holiday = await holiday_dao.update_holiday(holiday_id, holiday)
    if updated_holiday is None:
        logging.error(f"Holiday not found for ID: {holiday_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Holiday not found.")
    return updated_holiday

# Endpoint to delete a holiday by ID
@router.delete("/{holiday_id}", response_model=Holiday, status_code=status.HTTP_200_OK)
async def delete_holiday(holiday_id: str, holiday_dao: HolidayDAO = Depends(get_holiday_dao)):
    logging.debug(f"Received request to delete holiday with ID: {holiday_id}")
    holiday = await holiday_dao.get_holiday_by_id(holiday_id)
    if holiday is None:
        logging.error(f"Holiday not found for ID: {holiday_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Holiday not found.")
    await holiday_dao.delete_holiday(holiday_id)
    return holiday
