from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class User(BaseModel):
    email: EmailStr = Field(..., example="user@example.com")
    password: str = Field(..., min_length=6, example="password123")
    first_name: str = Field(..., min_length=2, max_length=50, example="John")
    last_name: str = Field(..., min_length=2, max_length=50, example="Doe")
    role: UserRole = Field(default=UserRole.USER, example="user")
    is_active: bool = Field(default=True, example=True)
    is_verified: bool = Field(default=False, example=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = Field(default=None)

class UserCreate(BaseModel):
    email: EmailStr = Field(..., example="user@example.com")
    password: str = Field(..., min_length=6, example="password123")
    first_name: str = Field(..., min_length=2, max_length=50, example="John")
    last_name: str = Field(..., min_length=2, max_length=50, example="Doe")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="user@example.com")
    password: str = Field(..., example="password123")

class UserResponse(BaseModel):
    id: str = Field(..., example="60f7b1b3b3f3f3f3f3f3f3f3")
    email: EmailStr = Field(..., example="user@example.com")
    first_name: str = Field(..., example="John")
    last_name: str = Field(..., example="Doe")
    role: UserRole = Field(..., example="user")
    is_active: bool = Field(..., example=True)
    is_verified: bool = Field(..., example=False)
    created_at: datetime
    last_login: Optional[datetime] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=2, max_length=50)
    last_name: Optional[str] = Field(None, min_length=2, max_length=50)
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None

class PasswordChange(BaseModel):
    current_password: str = Field(..., example="oldpassword123")
    new_password: str = Field(..., min_length=6, example="newpassword123")

class PasswordReset(BaseModel):
    email: EmailStr = Field(..., example="user@example.com")

class PasswordResetConfirm(BaseModel):
    token: str = Field(..., example="reset_token_here")
    new_password: str = Field(..., min_length=6, example="newpassword123")

class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., example="refresh_token_here")

class TokenResponse(BaseModel):
    access_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    refresh_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(default="bearer", example="bearer")
    expires_in: int = Field(..., example=1800)  # seconds until access token expires
