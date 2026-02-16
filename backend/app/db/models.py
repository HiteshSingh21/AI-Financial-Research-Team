"""
Database Models using SQLModel.
"""
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel, JSON

class ChatHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    query: str
    response: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AnalysisReport(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ticker: str = Field(index=True)
    verdict: str  # Buy, Sell, Hold
    report_content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
