# routers/projects.py

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, Query
from backend.server.database import MongoDB, get_db
from ..server.schemas import ProjectCreate, Project
from ..dao.project_dao import ProjectDAO
import logging
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Dependency to get ProjectDAO
def get_project_dao(db: MongoDB = Depends(get_db)) -> ProjectDAO:
    return ProjectDAO(db.db)  # Ensure we're passing the correct collection

@router.post("/", response_model=Project)
async def create_project(request: Request, project: ProjectCreate, project_dao: ProjectDAO = Depends(get_project_dao)):
    logging.debug("Received request to create a project.")

    # Get the current user from the request state
    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.debug(f"Current user: {user_identifier}")

    new_project = Project(
        id=str(ObjectId()),  # Temporary ID, will be replaced after insertion
        name=project.name,
        category=project.category,
        start_date=project.start_date,
        end_date=project.end_date,
        notification=project.notification,
        task_person=project.task_person,
        budget=project.budget,
        priority=project.priority,
        description=project.description,
        status=project.status,  # Include status
        created_by=user_identifier
    )

    created_project = await project_dao.create_project(new_project)
    logging.info(f"Project created successfully by {user_identifier}")
    return created_project

@router.get("/", response_model=list[Project])
async def get_projects(project_dao: ProjectDAO = Depends(get_project_dao)):
    try:
        # Fetch all projects
        projects = await project_dao.get_projects()
        logging.info("Projects fetched successfully")
        return projects
    except Exception as e:
        logging.error("Error fetching projects: %s", str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/filtered/", response_model=list[Project])
async def get_filtered_projects(status: str = Query(..., description="Filter projects by status"), project_dao: ProjectDAO = Depends(get_project_dao)):
    try:
        # Fetch filtered projects based on the status parameter
        projects = await project_dao.get_filtered_projects(status)
        logging.info(f"Filtered projects fetched successfully. Filter: {status}")
        return projects
    except Exception as e:
        logging.error("Error fetching filtered projects: %s", str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{project_id}/", response_model=Project)
async def update_project(project_id: str, project: ProjectCreate, project_dao: ProjectDAO = Depends(get_project_dao)):
    try:
        logging.debug(f"Received request to update project {project_id} with data: {project.dict()}")

        updated_project = await project_dao.update_project(project_id, project)
        if not updated_project:
            raise HTTPException(status_code=404, detail="Project not found")

        logging.info(f"Project {project_id} updated successfully")
        return updated_project
    except Exception as e:
        logging.error("Error updating project: %s", str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{project_id}/", response_model=dict)
async def delete_project(project_id: str, project_dao: ProjectDAO = Depends(get_project_dao)):
    try:
        # Delete the project from the database
        deleted = await project_dao.delete_project(project_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Project not found")

        logging.info(f"Project {project_id} deleted successfully")
        return {"detail": "Project deleted successfully"}
    except Exception as e:
        logging.error("Error deleting project: %s", str(e))
        raise HTTPException(status_code=400, detail=str(e))

# New route to get the total count of projects
@router.get("/total/count", response_model=int)
async def get_total_projects_count(project_dao: ProjectDAO = Depends(get_project_dao)):
    try:
        count = await project_dao.get_total_projects_count()
        logging.info("Total projects count fetched successfully")
        return count
    except Exception as e:
        logging.error("Error fetching total projects count: %s", str(e))
        raise HTTPException(status_code=400, detail=str(e))

# New route to get the count of projects by status
@router.get("/count/by-status", response_model=int)
async def get_projects_count_by_status(status: str = Query(..., description="Count projects by status"), project_dao: ProjectDAO = Depends(get_project_dao)):
    try:
        count = await project_dao.get_projects_count_by_status(status)
        logging.info(f"Projects count by status '{status}' fetched successfully")
        return count
    except Exception as e:
        logging.error(f"Error fetching projects count by status '{status}': %s", str(e))
        raise HTTPException(status_code=400, detail=str(e))
