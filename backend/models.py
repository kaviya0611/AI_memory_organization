from sqlalchemy import Column, String, Text, DateTime, Float, Enum as SQLEnum, Boolean
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from datetime import datetime
import uuid
import enum

class DecisionStatus(str, enum.Enum):
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    ARCHIVED = "archived"

class Decision(Base):
    __tablename__ = "decisions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    decision_statement = Column(Text, nullable=False)
    reasoning = Column(Text, nullable=True)
    stakeholders = Column(Text, nullable=True)  # JSON string
    risks = Column(Text, nullable=True)  # JSON string
    expected_outcome = Column(Text, nullable=True)
    actual_outcome = Column(Text, nullable=True)
    project_id = Column(String(255), nullable=True)
    department_id = Column(String(255), nullable=True)
    created_by = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    confidence_score = Column(Float, default=0.0)
    status = Column(SQLEnum(DecisionStatus), default=DecisionStatus.PENDING_REVIEW)
    extraction_notes = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<Decision(id={self.id}, title={self.title}, status={self.status})>"
