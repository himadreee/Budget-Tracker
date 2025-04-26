from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import collection
from app.models.transaction import Transaction

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Budget Tracker API"}

from datetime import datetime

@app.post("/transactions/")
def create_transaction(transaction: Transaction):
    transaction_dict = transaction.dict()

    # Convert transaction_date from date to datetime
    transaction_dict['transaction_date'] = datetime.combine(
        transaction.transaction_date, datetime.min.time()
    )

    result = collection.insert_one(transaction_dict)
    return {"message": "Transaction created", "id": str(result.inserted_id)}

@app.get("/transactions/")
def get_transactions():
    transactions = list(collection.find({}, {"_id": 0}))  # Exclude the MongoDB `_id` field
    return {"transactions": transactions}