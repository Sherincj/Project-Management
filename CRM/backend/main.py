import os
import logging
from bson import ObjectId
from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from .auth.middleware import JWTMiddleware
from .server.schemas import UserCreate, Token, RefreshTokenRequest
from .server.models import User
from .auth.auth import AuthJWT, verify_password, hash_password
from .routers.projects import router as projects_router
from .routers.invitation import router as invitations_router
from .routers.employees import router as employee_router
from .routers.comment import router as comments_router
from .routers.tasks import router as tasks_router
from .routers.attendance import router as attendance_router
from .routers.leave_request import router as leave_request_router
from .routers.department import router as department_router
from .server.database import MongoDB, set_app, startup_event, shutdown_event, get_db
from .dao.user_dao import UserDAO
from .routers.holiday import router as holiday_router

# Load environment variables
load_dotenv()

app = FastAPI()

# Set the FastAPI app instance
set_app(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("uvicorn.error")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS"),  # Use environment variable for allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AuthJWT
auth_jwt = AuthJWT()

# Add JWT middleware
app.add_middleware(JWTMiddleware, auth_jwt=auth_jwt)

# Setup authentication scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@app.on_event("startup")
async def on_startup():
    await startup_event()  # Pass the app instance here

@app.on_event("shutdown")
async def on_shutdown():
    await shutdown_event()  # Pass the app instance here

# Include routers
app.include_router(projects_router, prefix="/projects")
app.include_router(invitations_router, prefix="/invitation")
app.include_router(employee_router, prefix="/employees")
app.include_router(comments_router)
app.include_router(tasks_router, prefix="/tasks")
app.include_router(attendance_router, prefix="/attendance")
app.include_router(leave_request_router, prefix="/leave_request")
app.include_router(department_router, prefix="/department")
app.include_router(holiday_router, prefix="/api/holidays", tags=["holidays"])   

# Dependency to get UserDAO
def get_user_dao(db: MongoDB = Depends(get_db)) -> UserDAO:
    return UserDAO(db.db)

@app.post("/signup", response_model=User)
async def signup(user: UserCreate, user_dao: UserDAO = Depends(get_user_dao)):
    logger.debug(f"Signup attempt for email: {user.email}")

    # Validate password confirmation
    if user.password != user.confirm_password:
        logger.warning("Passwords do not match for email: %s", user.email)
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Check if the email is already registered
    if await user_dao.user_exists(user.email):
        logger.warning("Email already registered: %s", user.email)
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password and create a new user
    hashed_password = hash_password(user.password)
    new_user = User(
        id=str(ObjectId()),
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    await user_dao.create_user(new_user)
    logger.info("User created successfully: %s", user.email)
    return new_user

@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), response: Response = None, Authorize: AuthJWT = Depends(), user_dao: UserDAO = Depends(get_user_dao)):
    logger.debug(f"Login attempt for email: {form_data.username}")

    # Verify user credentials
    db_user = await user_dao.get_user_by_email(form_data.username)
    if not db_user or not verify_password(form_data.password, db_user.password):
        logger.warning("Invalid credentials for email: %s", form_data.username)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create access and refresh tokens
    access_token = Authorize.create_access_token(subject=db_user.email)
    refresh_token = Authorize.create_refresh_token(subject=db_user.email)

    # Set tokens in cookies
    response.set_cookie(key="access_token", value=access_token, httponly=True, max_age=86400)  # 1 day
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, max_age=604800)  # 7 days

    logger.info("User logged in successfully: %s", form_data.username)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token
    }

@app.post("/refresh", response_model=Token)
async def refresh_token(request: RefreshTokenRequest, Authorize: AuthJWT = Depends()):
    logger.debug("Token refresh request received")

    try:
        # Validate the refresh token
        Authorize.jwt_required(refresh_token=request.refresh_token)
        current_user = Authorize.get_jwt_subject()
        new_access_token = Authorize.create_access_token(subject=current_user)

        logger.info("Token refreshed successfully for user: %s", current_user)
        return {"access_token": new_access_token, "token_type": "bearer"}

    except Exception as e:
        logger.error("Error during token refresh: %s", str(e))
        raise HTTPException(status_code=401, detail="Invalid refresh token or token expired.")

@app.get("/current_user", response_model=User)
async def get_current_user(request: Request, user_dao: UserDAO = Depends(get_user_dao)):
    current_user_email = request.state.user
    if not current_user_email:
        raise HTTPException(status_code=401, detail="User not authenticated")

    user = await user_dao.get_user_by_email(current_user_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@app.post("/logout")
async def logout(response: Response):
    logger.debug("Logout request received")

    # Clear the access and refresh tokens by setting them to an empty value and short expiration
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")

    logger.info("User logged out successfully")
    return {"detail": "Logout successful"}

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True, debug=True)
