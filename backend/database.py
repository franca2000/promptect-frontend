from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI, MONGO_DB

client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]
users = db["users"]

async def get_user_by_email(email: str):
    return await users.find_one({"email": email})

async def create_user(user_data: dict):
    return await users.insert_one(user_data)
