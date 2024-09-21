# routers/leave_router.py

import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from dotenv import load_dotenv
from backend.dao.leave_request_dao import LeaveRequestDAO
from backend.server.database import MongoDB, get_db  # Ensure you have a get_db function to provide the database connection
from ..server.schemas import LeaveRequestCreate, LeaveRequest

load_dotenv()

logging.basicConfig(level=logging.INFO)

router = APIRouter()

# Dependency to get the LeaveRequestDAO
async def get_leave_request_dao(db: MongoDB = Depends(get_db)) -> LeaveRequestDAO:
    return LeaveRequestDAO(db.db)

# Endpoint to add a leave request
@router.post("/", response_model=LeaveRequest)
async def add_leave_request(request: Request, leave_request: LeaveRequestCreate, 
                            leave_request_dao: LeaveRequestDAO = Depends(get_leave_request_dao)):
    logging.debug("Received request to create a leave request.")

    # Get the current user from the request state
    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    # Check if there are any pending leave requests
    pending_leave_request = await leave_request_dao.get_pending_leave_request(leave_request.employee_id)
    if pending_leave_request:
        raise HTTPException(status_code=400, detail="You have a pending leave request.")

    created_leave_request = await leave_request_dao.add_leave_request(leave_request)
    return created_leave_request

# Endpoint to get all leave requests
@router.get("/", response_model=List[LeaveRequest])
async def get_leave_requests(leave_request_dao: LeaveRequestDAO = Depends(get_leave_request_dao)):
    leave_requests = await leave_request_dao.get_all_leave_requests()
    return leave_requests

# Endpoint to get a specific leave request by ID
@router.get("/{leave_id}", response_model=LeaveRequest)
async def get_leave_request(leave_id: str, leave_request_dao: LeaveRequestDAO = Depends(get_leave_request_dao)):
    logging.debug(f"Received request to get leave request with ID: {leave_id}")
    leave = await leave_request_dao.get_leave_request_by_id(leave_id)
    if leave is None:
        logging.error(f"Leave request not found for ID: {leave_id}")
        raise HTTPException(status_code=404, detail="Leave request not found.")
    return leave

# Endpoint to delete a leave request by ID
@router.delete("/{leave_id}", response_model=LeaveRequest)
async def delete_leave_request(leave_id: str, leave_request_dao: LeaveRequestDAO = Depends(get_leave_request_dao)):
    logging.debug(f"Received request to delete leave request with ID: {leave_id}")
    leave = await leave_request_dao.get_leave_request_by_id(leave_id)
    if leave is None:
        logging.error(f"Leave request not found for ID: {leave_id}")
        raise HTTPException(status_code=404, detail="Leave request not found.")
    await leave_request_dao.delete_leave_request(leave_id)
    return leave
