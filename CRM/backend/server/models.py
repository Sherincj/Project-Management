from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional

class User(BaseModel):
    id: str
    username: str
    email: EmailStr
    password: str

    class Config:
        orm_mode = True  # This is valid for Pydantic 1.x

class Project(BaseModel):
    id: str
    name: str
    category: str
    start_date: datetime
    end_date: datetime
    notification: str
    task_person: str
    budget: float
    priority: str
    description: Optional[str] = None
    created_by: str  # Track who created the project
    status: str = "Not Started"  # Default status

    class Config:
        orm_mode = True  # This allows Pydantic to work with ORMs
        
        
class Invitation(BaseModel):
    id: Optional[str] = None
    token: str
    email: EmailStr
    created_by: str
    expires_at: datetime
    used: bool = False

    class Config:
        orm_mode = True  # This allows Pydantic to work with ORMs
        


class Employee(BaseModel):
    id: Optional[str] = None
    name: str
    role: str
    email: EmailStr
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True
        
        

class Comment(BaseModel):
    id: Optional[str] = None
    content: str
    author: EmailStr
    date: datetime = Field(default_factory=datetime.utcnow)
    task_id: str
    replies: Optional[List['Comment']] = []

    class Config:
        orm_mode = True



class Task(BaseModel):
    id: Optional[str] = None
    title: str
    assignedTo: str
    dueDate: datetime  # Change the type to datetime
    status: str
    created_by: str
    created_time: datetime = Field(default_factory=datetime.utcnow)
    project_id: str 

    class Config:
        orm_mode = True
        
class Attendance(BaseModel):
    id: str
    name: str
    date: str
    status: str
    reason: Optional[str] = None

    class Config:
        orm_mode = True  # This allows Pydantic to work with ORMs
        
        

class LeaveRequest(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()))
    employee_id: str
    name: str
    leave_type: str
    from_date: str  # Changed to string
    to_date: str    # Changed to string
    reason: Optional[str] = None
    status: str = 'processing'  # Added status field with default value
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())  # Store as ISO string

    class Config:
        orm_mode = True
        
class Department(BaseModel):
    id: Optional[str] = None
    head: str
    name: str
    employees: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True
        
class Holiday(BaseModel):
    id: str
    name: str
    date: str

    class Config:
        orm_mode = True  # This allows Pydantic to work with ORMs