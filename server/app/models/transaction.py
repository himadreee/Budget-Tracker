from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import date

class Transaction(BaseModel):
    user_id: str = Field(..., example="60f7b1b3b3f3f3f3f3f3f3f3")
    description: str = Field(..., example="Grocery shopping")
    amount: float = Field(..., gt=0, example=25.50)
    type: Literal["income", "expense"] = Field(..., example="expense")
    category: str = Field(..., example="Food")
    transaction_date: date = Field(..., example="2025-04-26")

class TransactionCreate(BaseModel):
    description: str = Field(..., example="Grocery shopping")
    amount: float = Field(..., gt=0, example=25.50)
    type: Literal["income", "expense"] = Field(..., example="expense")
    category: str = Field(..., example="Food")
    transaction_date: date = Field(..., example="2025-04-26")

class TransactionUpdate(BaseModel):
    description: Optional[str] = Field(None, example="Updated description")
    amount: Optional[float] = Field(None, gt=0, example=30.00)
    type: Optional[Literal["income", "expense"]] = Field(None, example="income")
    category: Optional[str] = Field(None, example="Entertainment")
    transaction_date: Optional[date] = Field(None, example="2025-04-27")