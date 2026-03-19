from pymongo import MongoClient
from dotenv import load_dotenv
import os
import ssl

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "ChefOS")

client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsAllowInvalidCertificates=True,
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000,
)

db = client[DB_NAME]

users_collection = db["users"]
sessions_collection = db["recipe_sessions"]

def get_db():
    return db