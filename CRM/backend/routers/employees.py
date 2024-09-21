import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from dotenv import load_dotenv
from backend.dao.user_dao import UserDAO
from backend.server.database import MongoDB, get_db
from ..server.schemas import EmployeeCreate, EmployeeUpdate
from ..server.models import Employee
from ..dao.employee_dao import EmployeeDAO  # Import the EmployeeDAO

load_dotenv()

logging.basicConfig(level=logging.INFO)

router = APIRouter()

# Dependency to get the EmployeeDAO
async def get_employee_dao(db: MongoDB = Depends(get_db)) -> EmployeeDAO:
    return EmployeeDAO(db.db)

# Dependency to get UserDAO
async def get_user_dao(db: MongoDB = Depends(get_db)) -> UserDAO:
    return UserDAO(db.db)  # Ensure we're passing the correct collection

# Endpoint to add an employee
@router.post("/", response_model=Employee)
async def add_employee(request: Request, employee: EmployeeCreate, 
                       employee_dao: EmployeeDAO = Depends(get_employee_dao),
                       user_dao: UserDAO = Depends(get_user_dao)):
    logging.debug("Received request to create an employee.")

    # Get the current user from the request state
    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.debug(f"Current user: {user_identifier}")

    # Check if the user exists in the users collection
    user = await user_dao.get_user_by_email(employee.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Check if the email is already used by another employee
    existing_employee = await employee_dao.get_employee_by_email(employee.email)
    if existing_employee:
        raise HTTPException(status_code=400, detail="Email already used by another employee.")

    created_employee = await employee_dao.add_employee(employee)
    return created_employee

# Endpoint to get all employees
@router.get("/", response_model=List[Employee])
async def get_employees(employee_dao: EmployeeDAO = Depends(get_employee_dao)):
    employees = await employee_dao.get_all_employees()
    return employees

# Endpoint to get a specific employee by ID
@router.get("/{employee_id}", response_model=Employee)
async def get_employee(employee_id: str, employee_dao: EmployeeDAO = Depends(get_employee_dao)):
    logging.debug(f"Received request to get employee with ID: {employee_id}")
    emp = await employee_dao.get_employee_by_id(employee_id)
    if emp is None:
        logging.error(f"Employee not found for ID: {employee_id}")
        raise HTTPException(status_code=404, detail="Employee not found.")
    return emp

# Endpoint to update an employee by ID
@router.put("/{employee_id}", response_model=Employee)
async def update_employee(employee_id: str, employee: EmployeeUpdate, 
                          employee_dao: EmployeeDAO = Depends(get_employee_dao)):
    logging.debug(f"Received request to update employee with ID: {employee_id}")
    updated_employee = await employee_dao.update_employee(employee_id, employee)
    if updated_employee is None:
        logging.error(f"Employee not found for ID: {employee_id}")
        raise HTTPException(status_code=404, detail="Employee not found.")
    return updated_employee

# Endpoint to delete an employee by ID
@router.delete("/{employee_id}", response_model=Employee)
async def delete_employee(employee_id: str, employee_dao: EmployeeDAO = Depends(get_employee_dao)):
    logging.debug(f"Received request to delete employee with ID: {employee_id}")
    emp = await employee_dao.get_employee_by_id(employee_id)
    if emp is None:
        logging.error(f"Employee not found for ID: {employee_id}")
        raise HTTPException(status_code=404, detail="Employee not found.")
    await employee_dao.delete_employee(employee_id)
    return emp
