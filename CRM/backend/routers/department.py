# routers/department.py

import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from ..server.schemas import DepartmentCreate, DepartmentUpdate
from ..server.models import Department
from ..dao.department_dao import DepartmentDAO  # Import the DepartmentDAO
from backend.server.database import MongoDB, get_db  # Ensure you have a get_db function to provide the database connection

router = APIRouter()

# Dependency to get the DepartmentDAO
async def get_department_dao(db: MongoDB = Depends(get_db)) -> DepartmentDAO:
    return DepartmentDAO(db.db)

# Endpoint to add a department
@router.post("/", response_model=Department)
async def add_department(request: Request, department: DepartmentCreate, 
                          department_dao: DepartmentDAO = Depends(get_department_dao)):
    logging.debug("Received request to create a department.")

    # Get the current user from the request state
    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.debug(f"Current user: {user_identifier}")

    created_department = await department_dao.add_department(department)
    return created_department

# Endpoint to get all departments
@router.get("/", response_model=List[Department])
async def get_departments(department_dao: DepartmentDAO = Depends(get_department_dao)):
    departments = await department_dao.get_all_departments()
    return departments

# Endpoint to get a specific department by ID
@router.get("/{department_id}", response_model=Department)
async def get_department(department_id: str, department_dao: DepartmentDAO = Depends(get_department_dao)):
    logging.debug(f"Received request to get department with ID: {department_id}")
    dept = await department_dao.get_department_by_id(department_id)
    if dept is None:
        logging.error(f"Department not found for ID: {department_id}")
        raise HTTPException(status_code=404, detail="Department not found.")
    return dept

# Endpoint to update a department by ID
@router.put("/{department_id}", response_model=Department)
async def update_department(department_id: str, department: DepartmentUpdate, 
                            department_dao: DepartmentDAO = Depends(get_department_dao)):
    logging.debug(f"Received request to update department with ID: {department_id}")
    updated_department = await department_dao.update_department(department_id, department)
    if updated_department is None:
        logging.error(f"Department not found for ID: {department_id}")
        raise HTTPException(status_code=404, detail="Department not found.")
    return updated_department

# Endpoint to delete a department by ID
@router.delete("/{department_id}", response_model=Department)
async def delete_department(department_id: str, department_dao: DepartmentDAO = Depends(get_department_dao)):
    logging.debug(f"Received request to delete department with ID: {department_id}")
    dept = await department_dao.get_department_by_id(department_id)
    if dept is None:
        logging.error(f"Department not found for ID: {department_id}")
        raise HTTPException(status_code=404, detail="Department not found.")
    await department_dao.delete_department(department_id)
    return dept
