from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["budgetTracker"]  # Database name

# Collections
collection = db["transactions"]  # Transactions collection
users_collection = db["users"]   # Users collection

# Create indexes for better performance
try:
    # Create unique index on email for users
    users_collection.create_index("email", unique=True)
    
    # Create index on user_id for transactions (for user-specific queries)
    collection.create_index("user_id")
    
    # Create compound index for user transactions by date
    collection.create_index([("user_id", 1), ("transaction_date", -1)])
    
    print("Database indexes created successfully")
except Exception as e:
    print(f"Index creation failed or already exists: {e}")