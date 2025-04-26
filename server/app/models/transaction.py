from pydantic import BaseModel, Field
from typing import Literal
from datetime import date

class Transaction(BaseModel):
    description: str = Field(..., example="Grocery shopping")
    amount: float = Field(..., gt=0, example=25.50)
    type: Literal["income", "expense"] = Field(..., example="expense")
    category: str = Field(..., example="Food")
    transaction_date: date = Field(..., example="2025-04-26")