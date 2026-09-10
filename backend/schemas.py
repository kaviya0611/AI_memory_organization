from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from models import DecisionStatus

class DecisionCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    description: Optional[str] = None
    decision_statement: str = Field(..., min_length=10)
    reasoning: Optional[str] = None
    stakeholders: Optional[List[str]] = None
    risks: Optional[List[str]] = None
    expected_outcome: Optional[str] = None
    project_id: Optional[str] = None
    department_id: Optional[str] = None
    created_by: Optional[str] = None

class DecisionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    decision_statement: Optional[str] = None
    reasoning: Optional[str] = None
    stakeholders: Optional[List[str]] = None
    risks: Optional[List[str]] = None
    expected_outcome: Optional[str] = None
    actual_outcome: Optional[str] = None
    status: Optional[DecisionStatus] = None

class DecisionResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    decision_statement: str
    reasoning: Optional[str]
    stakeholders: Optional[List[str]]
    risks: Optional[List[str]]
    expected_outcome: Optional[str]
    actual_outcome: Optional[str]
    project_id: Optional[str]
    department_id: Optional[str]
    created_by: Optional[str]
    created_at: datetime
    updated_at: datetime
    confidence_score: float
    status: DecisionStatus
    extraction_notes: Optional[str]
    
    class Config:
        from_attributes = True

class ExtractionRequest(BaseModel):
    text: str = Field(..., min_length=20)
    source_type: Optional[str] = "text"  # email, meeting, chat, report, etc.

class ExtractionResponse(BaseModel):
    decision_statement: str
    reasoning: str
    stakeholders: List[str]
    risks: List[str]
    expected_outcome: str
    confidence_score: float
    extraction_notes: Optional[str]
