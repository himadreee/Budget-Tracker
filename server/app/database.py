from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")





client = MongoClient(MONGO_URI)
db = client["budgetTracker"]  # Replace with your database name
collection = db["transactions"]  # Replace with your collection name