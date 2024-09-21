import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI
import asyncio

logger = logging.getLogger("uvicorn.error")

# Global variable to hold the FastAPI app instance
app: FastAPI = None

class MongoDB:
    def __init__(self, uri: str):
        self.client = AsyncIOMotorClient(uri)
        self.db = self.client.crm_database  # Replace with your database name

    async def close(self):
        self.client.close()

# Dependency to get the MongoDB client
async def get_db() -> MongoDB:
    return app.state.mongodb

# Startup and shutdown events
async def startup_event():
    global app
    uri = os.getenv("MONGODB_URI")
    retries = 5
    for i in range(retries):
        try:
            app.state.mongodb = MongoDB(uri)
            logger.info("MongoDB connection established.")
            return
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}. Retrying in 5 seconds...")
            await asyncio.sleep(5)
    logger.critical("Could not connect to MongoDB after multiple attempts.")
    raise Exception("Could not connect to MongoDB.")

async def shutdown_event():
    await app.state.mongodb.close()
    logger.info("MongoDB connection closed.")

# Function to set the app instance
def set_app(fastapi_app: FastAPI):
    global app
    app = fastapi_app
