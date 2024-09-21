# routers/comments.py

from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, Depends, Request
from bson import ObjectId
from dotenv import load_dotenv
import logging

from backend.server.database import MongoDB, get_db
from ..server.schemas import CommentCreate, Comment
from ..dao.comment_dao import CommentDAO  # Import the CommentDAO
import os

load_dotenv()

logging.basicConfig(level=logging.INFO)

router = APIRouter()

# Dependency to get the CommentDAO
async def get_comment_dao(db: MongoDB = Depends(get_db)) -> CommentDAO:
    return CommentDAO(db.db)

@router.post("/tasks/{task_id}/comments", response_model=Comment)
async def create_comment(task_id: str, comment: CommentCreate, request: Request, comment_dao: CommentDAO = Depends(get_comment_dao)):
    current_user = request.state.user
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.info(f"Received comment data: {comment}")

    new_comment = CommentCreate(
        content=comment.content,
        author=current_user,  # Assuming the current user is the author
        date=datetime.utcnow(),
        task_id=task_id,
        replies=[]
    )

    created_comment = await comment_dao.create_comment(new_comment)
    return created_comment

@router.get("/tasks/{task_id}/comments", response_model=List[Comment])
async def get_comments(task_id: str, request: Request, comment_dao: CommentDAO = Depends(get_comment_dao)):
    current_user = request.state.user
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    comments = await comment_dao.get_comments_by_task(task_id)
    return comments

@router.post("/comments/{id}/reply", response_model=Comment)
async def reply_to_comment(id: str, reply: CommentCreate, request: Request, comment_dao: CommentDAO = Depends(get_comment_dao)):
    current_user = request.state.user
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.info(f"Received reply data: {reply}")

    new_reply = CommentCreate(
        content=reply.content,
        author=current_user,  # Assuming the current user is the author
        date=datetime.utcnow(),
        task_id=reply.task_id,
        replies=[]
    )

    updated_comment = await comment_dao.reply_to_comment(id, new_reply)
    if not updated_comment:
        logging.error(f"Comment with ID {id} not found")
        raise HTTPException(status_code=404, detail="Comment not found")

    return updated_comment

@router.delete("/comments/{id}")
async def delete_comment(id: str, request: Request, comment_dao: CommentDAO = Depends(get_comment_dao)):
    current_user = request.state.user
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.info(f"Deleting comment with ID: {id}")

    deleted = await comment_dao.delete_comment(id)
    if not deleted:
        logging.error(f"Comment with ID {id} not found")
        raise HTTPException(status_code=404, detail="Comment not found")

    return {"detail": "Comment deleted successfully"}

@router.put("/comments/{id}", response_model=Comment)
async def update_comment(id: str, updated_comment: CommentCreate, request: Request, comment_dao: CommentDAO = Depends(get_comment_dao)):
    current_user = request.state.user
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.info(f"Updating comment with ID: {id}")

    updated_comment_instance = await comment_dao.update_comment(id, updated_comment.content)
    if not updated_comment_instance:
        logging.error(f"Comment with ID {id} not found")
        raise HTTPException(status_code=404, detail="Comment not found")

    return updated_comment_instance
