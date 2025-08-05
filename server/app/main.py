from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import collection, users_collection
from app.models.transaction import Transaction, TransactionCreate, TransactionUpdate
from app.models.user import User, UserCreate, UserLogin, UserResponse, UserUpdate, PasswordChange, RefreshTokenRequest, TokenResponse
from app.auth import PasswordManager, TokenManager
from datetime import datetime
from typing import Optional
from bson import ObjectId

app = FastAPI(title="Budget Tracker API", version="1.0.0")

# Security
security = HTTPBearer()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173", "http://127.0.0.1:5174", "http://localhost:5174"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers including Authorization
)

# Dependency to get current user from token
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    user_id = TokenManager.get_current_user_id(credentials.credentials)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user exists and is active
    user = users_collection.find_one({"_id": ObjectId(user_id), "is_active": True})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    return user_id

@app.get("/")
def read_root():
    return {"message": "Welcome to the Budget Tracker API"}

# ===== USER AUTHENTICATION ENDPOINTS =====

@app.post("/auth/register", response_model=UserResponse)
def register_user(user_data: UserCreate):
    # Check if user already exists
    if users_collection.find_one({"email": user_data.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = PasswordManager.hash_password(user_data.password)
    
    user_dict = {
        "email": user_data.email,
        "password": hashed_password,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "role": "user",
        "is_active": True,
        "is_verified": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "last_login": None
    }
    
    result = users_collection.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    
    # Create response
    return UserResponse(
        id=str(result.inserted_id),
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        role="user",
        is_active=True,
        is_verified=False,
        created_at=user_dict["created_at"],
        last_login=None
    )

@app.post("/auth/login", response_model=dict)
def login_user(user_credentials: UserLogin):
    # Find user by email
    user = users_collection.find_one({"email": user_credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not PasswordManager.verify_password(user_credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Update last login
    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow(), "updated_at": datetime.utcnow()}}
    )
    
    # Create tokens
    access_token = TokenManager.create_access_token(data={"sub": str(user["_id"])})
    refresh_token = TokenManager.create_refresh_token(data={"sub": str(user["_id"])})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": 1800,  # 30 minutes in seconds
        "user": UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            first_name=user["first_name"],
            last_name=user["last_name"],
            role=user["role"],
            is_active=user["is_active"],
            is_verified=user.get("is_verified", False),
            created_at=user["created_at"],
            last_login=datetime.utcnow()
        )
    }

@app.post("/auth/refresh", response_model=TokenResponse)
def refresh_access_token(refresh_request: RefreshTokenRequest):
    """
    Endpoint to refresh access token using refresh token
    """
    # Verify refresh token and extract user ID
    user_id = TokenManager.verify_refresh_token(refresh_request.refresh_token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    # Check if user exists and is active
    user = users_collection.find_one({"_id": ObjectId(user_id), "is_active": True})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new access token (and optionally new refresh token)
    new_access_token = TokenManager.create_access_token(data={"sub": user_id})
    new_refresh_token = TokenManager.create_refresh_token(data={"sub": user_id})
    
    # Update last login time
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"last_login": datetime.utcnow(), "updated_at": datetime.utcnow()}}
    )
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        expires_in=1800  # 30 minutes in seconds
    )

@app.get("/auth/me", response_model=UserResponse)
def get_current_user_info(current_user_id: str = Depends(get_current_user)):
    user = users_collection.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        first_name=user["first_name"],
        last_name=user["last_name"],
        role=user["role"],
        is_active=user["is_active"],
        is_verified=user.get("is_verified", False),
        created_at=user["created_at"],
        last_login=user.get("last_login")
    )

@app.put("/auth/profile", response_model=UserResponse)
def update_user_profile(user_update: UserUpdate, current_user_id: str = Depends(get_current_user)):
    update_data = {k: v for k, v in user_update.dict(exclude_unset=True).items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided for update")
    
    # Check if email is being updated and if it's already taken
    if "email" in update_data:
        existing_user = users_collection.find_one({
            "email": update_data["email"], 
            "_id": {"$ne": ObjectId(current_user_id)}
        })
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already in use")
    
    update_data["updated_at"] = datetime.utcnow()
    
    result = users_collection.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return updated user
    updated_user = users_collection.find_one({"_id": ObjectId(current_user_id)})
    return UserResponse(
        id=str(updated_user["_id"]),
        email=updated_user["email"],
        first_name=updated_user["first_name"],
        last_name=updated_user["last_name"],
        role=updated_user["role"],
        is_active=updated_user["is_active"],
        is_verified=updated_user.get("is_verified", False),
        created_at=updated_user["created_at"],
        last_login=updated_user.get("last_login")
    )

@app.post("/auth/change-password")
def change_password(password_data: PasswordChange, current_user_id: str = Depends(get_current_user)):
    user = users_collection.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not PasswordManager.verify_password(password_data.current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Hash new password and update
    new_hashed_password = PasswordManager.hash_password(password_data.new_password)
    
    users_collection.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {"password": new_hashed_password, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Password changed successfully"}

# ===== TRANSACTION ENDPOINTS (Updated for user authentication) =====

@app.post("/transactions/")
def create_transaction(transaction: TransactionCreate, current_user_id: str = Depends(get_current_user)):
    transaction_dict = transaction.dict()
    transaction_dict['user_id'] = current_user_id
    transaction_dict['created_at'] = datetime.utcnow()
    transaction_dict['updated_at'] = datetime.utcnow()

    # Convert transaction_date from date to datetime
    transaction_dict['transaction_date'] = datetime.combine(
        transaction.transaction_date, datetime.min.time()
    )

    result = collection.insert_one(transaction_dict)
    return {"message": "Transaction created", "id": str(result.inserted_id)}

@app.get("/transactions/")
def get_transactions(current_user_id: str = Depends(get_current_user)):
    # Fetch transactions for the current user only, sorted by update time (descending)
    transactions = list(collection.find(
        {"user_id": current_user_id}, 
        {"_id": 0}
    ).sort("updated_at", -1))
    
    print(f"Fetched {len(transactions)} transactions for user {current_user_id}")  # Debug line
    return {"transactions": transactions}

@app.get("/transactions/{transaction_id}")
def get_transaction(transaction_id: str, current_user_id: str = Depends(get_current_user)):
    try:
        transaction = collection.find_one({
            "_id": ObjectId(transaction_id),
            "user_id": current_user_id
        }, {"_id": 0})
        
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        return {"transaction": transaction}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid transaction ID")

@app.put("/transactions/{transaction_id}")
def update_transaction(
    transaction_id: str, 
    transaction_update: TransactionUpdate,
    current_user_id: str = Depends(get_current_user)
):
    try:
        update_data = {k: v for k, v in transaction_update.dict(exclude_unset=True).items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update")
        
        # Convert date to datetime if provided
        if 'transaction_date' in update_data:
            update_data['transaction_date'] = datetime.combine(
                update_data['transaction_date'], datetime.min.time()
            )
        
        update_data['updated_at'] = datetime.utcnow()
        
        result = collection.update_one(
            {"_id": ObjectId(transaction_id), "user_id": current_user_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        return {"message": "Transaction updated successfully"}
    except Exception as e:
        if "not found" in str(e):
            raise e
        raise HTTPException(status_code=400, detail="Invalid transaction ID")

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: str, current_user_id: str = Depends(get_current_user)):
    try:
        result = collection.delete_one({
            "_id": ObjectId(transaction_id),
            "user_id": current_user_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        return {"message": "Transaction deleted successfully"}
    except Exception as e:
        if "not found" in str(e):
            raise e
        raise HTTPException(status_code=400, detail="Invalid transaction ID")