import os
from datetime import timedelta
import secrets
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseSettings
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Settings(BaseSettings):
    authjwt_secret_key: str = os.getenv("AUTHJWT_SECRET_KEY")
    authjwt_access_token_expires: timedelta = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440)))
    authjwt_refresh_token_expires: timedelta = timedelta(minutes=int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", 10080)))
    authjwt_token_location: set = {"cookies"}
    authjwt_cookie_csrf_protect: bool = False  # Add this line

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@AuthJWT.load_config
def get_config():
    return Settings()

def hash_password(password: str) -> str:
    """Hash a plain text password."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)
