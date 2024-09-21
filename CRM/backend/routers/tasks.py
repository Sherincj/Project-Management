# routers/tasks.py

from fastapi import APIRouter, Depends, Request, HTTPException, status, Query
from typing import List
import logging
from bson import ObjectId
import os

from backend.server.database import MongoDB, get_db
from ..server.schemas import TaskCreate, Task
from ..server.models import Task as TaskModel
from ..dao.task_dao import TaskDAO  # Import the TaskDAO
from datetime import datetime

router = APIRouter()

# Dependency to get the TaskDAO
def get_task_dao(db: MongoDB = Depends(get_db)) -> TaskDAO:
    return TaskDAO(db.db)

@router.post("/", response_model=Task)
async def create_task(task: TaskCreate, request: Request, task_dao: TaskDAO = Depends(get_task_dao)):
    logging.debug("Received request to create a task")

    logging.debug(f"Received task data: {task.dict()}")

    try:
        current_user = request.state.user  # This should now be a string (username)
        task_dict = task.dict()
        task_dict["created_time"] = datetime.utcnow()
        task_dict["created_by"] = current_user  # Use the username string directly

        if not task_dict.get("project_id"):
            logging.error("Project ID is missing from the task data")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project ID is required"
            )

        created_task = await task_dao.create_task(task_dict)
        logging.info(f"Task created successfully: {created_task}")

        return created_task

    except Exception as e:
        logging.error(f"Failed to create task: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create task: {str(e)}"
        )

@router.get("/", response_model=List[TaskModel])
async def read_tasks(request: Request, project_id: str = Query(...), task_dao: TaskDAO = Depends(get_task_dao)):
    logging.debug("Received request to read tasks")

    try:
        tasks = await task_dao.get_tasks_by_project(project_id)
        return tasks

    except Exception as e:
        logging.error(f"Failed to read tasks: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read tasks: {str(e)}"
        )

@router.get("/{task_id}", response_model=Task)
async def read_task(task_id: str, task_dao: TaskDAO = Depends(get_task_dao)):
    logging.debug(f"Received request to read task with ID: {task_id}")

    task = await task_dao.get_task(task_id)
    if task:
        return task
    raise HTTPException(status_code=404, detail="Task not found")

@router.put("/{task_id}", response_model=Task)
async def update_task(task_id: str, task: TaskCreate, task_dao: TaskDAO = Depends(get_task_dao)):
    logging.debug(f"Received request to update task with ID: {task_id}")

    task_dict = task.dict()
    task_dict["created_time"] = task_dict["dueDate"]  # Assign dueDate to created_time
    updated_task = await task_dao.update_task(task_id, task_dict)
    if updated_task:
        return updated_task
    raise HTTPException(status_code=404, detail="Task not found")

@router.delete("/{task_id}", response_model=Task)
async def delete_task(task_id: str, task_dao: TaskDAO = Depends(get_task_dao)):
    logging.debug(f"Received request to delete task with ID: {task_id}")

    deleted_task = await task_dao.delete_task(task_id)
    if deleted_task:
        return deleted_task
    raise HTTPException(status_code=404, detail="Task not found")


@router.get("/completed/count", response_model=int)
async def read_completed_tasks_count(task_dao: TaskDAO = Depends(get_task_dao)):
    logging.debug("Received request to read completed tasks count")

    try:
        count = await task_dao.get_completed_tasks_count()
        return count

    except Exception as e:
        logging.error(f"Failed to read completed tasks count: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read completed tasks count: {str(e)}")


@router.get("/progress/count", response_model=int)
async def read_progress_tasks_count(task_dao: TaskDAO = Depends(get_task_dao)):
    logging.debug("Received request to read completed tasks count")

    try:
        count = await task_dao.get_progress_tasks_count()
        return count

    except Exception as e:
        logging.error(f"Failed to read completed tasks count: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read completed tasks count: {str(e)}")
        
@router.get("/total/count", response_model=int)
async def read_total_tasks_count(task_dao: TaskDAO = Depends(get_task_dao)):
    logging.debug("Received request to read completed tasks count")

    try:
        count = await task_dao.get_all_tasks_count()
        return count

    except Exception as e:
        logging.error(f"Failed to read completed tasks count: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read completed tasks count: {str(e)}")

