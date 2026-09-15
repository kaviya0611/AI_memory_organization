from sqlalchemy import Column, String, Text, DateTime, Float, Enum as SQLEnum, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import TypeDecorator, CHAR
from database import Base
from datetime import datetime
import uuid
import enum

class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's native UUID type if available, otherwise stores as CHAR(36).
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            from sqlalchemy.dialects.postgresql import UUID as PG_UUID
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value) if not isinstance(value, uuid.UUID) else value
        else:
            return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if not isinstance(value, uuid.UUID):
            try:
                return uuid.UUID(str(value))
            except (ValueError, TypeError):
                return value
        return value

class DecisionStatus(str, enum.Enum):
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    ARCHIVED = "archived"
    PLANNED = "Planned"
    IN_PROGRESS = "In Progress"
    SUCCESSFUL = "Successful"
    PARTIALLY_SUCCESSFUL = "Partially Successful"
    FAILED = "Failed"
    CANCELLED = "Cancelled"

class TrustTier(str, enum.Enum):
    RAW_SOURCE = "raw_source"
    AI_DERIVED = "ai_derived"
    HUMAN_CONFIRMED = "human_confirmed"

class GovernanceLevel(str, enum.Enum):
    ROUTINE = "routine"
    MEDIUM = "medium"
    HIGH_STAKES = "high_stakes"

class Department(Base):
    """Organizational Departments"""
    __tablename__ = "departments"

    id = Column(String(100), primary_key=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    projects = relationship("Project", back_populates="department")
    decisions = relationship("Decision", back_populates="department")

    def __repr__(self):
        return f"<Department(id={self.id}, name={self.name})>"

class Project(Base):
    """Organizational Projects & Strategic Initiatives"""
    __tablename__ = "projects"

    id = Column(String(100), primary_key=True)
    name = Column(String(255), nullable=False)
    department_id = Column(String(100), ForeignKey("departments.id"), nullable=True)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    department = relationship("Department", back_populates="projects")
    decisions = relationship("Decision", back_populates="project")

    def __repr__(self):
        return f"<Project(id={self.id}, name={self.name})>"

class Decision(Base):
    """Core Organizational Decision Record with Full Reasoning & Provenance"""
    __tablename__ = "decisions"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    decision_statement = Column(Text, nullable=True)
    reasoning = Column(Text, nullable=True)
    reason = Column(Text, nullable=True)
    timeline = Column(String(100), nullable=True)
    decision_maker = Column(String(255), nullable=True, index=True)
    created_by = Column(String(255), nullable=True)
    department_id = Column(String(100), ForeignKey("departments.id"), nullable=True, index=True)
    project_id = Column(String(100), ForeignKey("projects.id"), nullable=True, index=True)

    stakeholders = Column(Text, nullable=True)  # JSON string or text
    risks = Column(Text, nullable=True)         # JSON string or text
    expected_outcome = Column(Text, nullable=True)
    actual_outcome = Column(Text, nullable=True)
    confidence_score = Column(Float, default=0.85)
    status = Column(String(50), default="In Progress")
    extraction_notes = Column(Text, nullable=True)
    source_reference = Column(String(255), nullable=True)

    # Decision Memory Triggers & Constraints
    triggers = Column(Text, nullable=True)
    constraints = Column(Text, nullable=True)
    alternatives_considered = Column(Text, nullable=True)
    rejected_reasons = Column(Text, nullable=True)
    assumptions = Column(Text, nullable=True)
    evidence_links = Column(Text, nullable=True)

    # Temporal Validity & Governance
    valid_from = Column(DateTime, default=datetime.utcnow, nullable=False)
    valid_until = Column(DateTime, nullable=True)
    decay_rate = Column(Float, default=0.05)
    is_expired = Column(Boolean, default=False)
    superseded_by_id = Column(String(36), nullable=True)
    trust_tier = Column(String(50), default=TrustTier.HUMAN_CONFIRMED.value)
    monetary_value = Column(Float, default=0.0)
    governance_level = Column(String(50), default=GovernanceLevel.MEDIUM.value)
    approval_chain = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relational associations
    department = relationship("Department", back_populates="decisions")
    project = relationship("Project", back_populates="decisions")
    evidence_items = relationship("DecisionEvidence", back_populates="decision", cascade="all, delete-orphan")
    alternatives = relationship("DecisionAlternative", back_populates="decision", cascade="all, delete-orphan")
    outcomes = relationship("Outcome", back_populates="decision", cascade="all, delete-orphan")
    lessons = relationship("Lesson", back_populates="decision", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Decision(id={self.id}, title={self.title}, status={self.status})>"

class DecisionEvidence(Base):
    """Evidence and Data Supporting a Decision"""
    __tablename__ = "decision_evidence"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    decision_id = Column(GUID(), ForeignKey("decisions.id"), nullable=False)
    evidence_type = Column(String(100), default="metric")
    description = Column(Text, nullable=False)
    source_reference = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    decision = relationship("Decision", back_populates="evidence_items")

class DecisionAlternative(Base):
    """Alternatives Considered and Reasons Rejected"""
    __tablename__ = "decision_alternatives"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    decision_id = Column(GUID(), ForeignKey("decisions.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    reason_rejected = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    decision = relationship("Decision", back_populates="alternatives")

class Outcome(Base):
    """Outcome Tracking & Variance Evaluation"""
    __tablename__ = "outcomes"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    decision_id = Column(GUID(), ForeignKey("decisions.id"), nullable=False)
    expected_result = Column(Text, nullable=True)
    actual_result = Column(Text, nullable=False)
    expected_cost = Column(Float, nullable=True)
    actual_cost = Column(Float, nullable=True)
    expected_timeline = Column(String(100), nullable=True)
    actual_timeline = Column(String(100), nullable=True)
    variance_percentage = Column(Float, nullable=True)
    outcome_status = Column(String(50), default="Successful")
    lessons_learned = Column(Text, nullable=True)
    recorded_by = Column(String(255), nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    decision = relationship("Decision", back_populates="outcomes")

class Lesson(Base):
    """Organizational Learnings Extracted from Outcomes"""
    __tablename__ = "lessons"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    decision_id = Column(GUID(), ForeignKey("decisions.id"), nullable=False)
    title = Column(String(255), nullable=False)
    takeaway = Column(Text, nullable=False)
    category = Column(String(100), default="Process")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    decision = relationship("Decision", back_populates="lessons")

class DeadEnd(Base):
    """Dead Ends Repository - Captures Failures and Anti-patterns"""
    __tablename__ = "dead_ends"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    topic = Column(String(255), nullable=False, index=True)
    attempted_solution = Column(String(255), nullable=False)
    root_cause_of_failure = Column(Text, nullable=False)
    cost_of_failure = Column(String(100), nullable=True)
    retry_conditions = Column(Text, nullable=True)
    do_not_retry = Column(Boolean, default=True)
    failure_date = Column(String(50), nullable=True)
    department_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class DepartmentDependency(Base):
    """Cross-Department Dependencies"""
    __tablename__ = "department_dependencies"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    source_department = Column(String(100), nullable=False, index=True)
    target_department = Column(String(100), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    current_metric = Column(String(255), nullable=True)
    constraint_limit = Column(String(255), nullable=True)
    conflict_condition = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class AuditLogEntry(Base):
    """Governance Audit Trail"""
    __tablename__ = "audit_log"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    action = Column(String(100), nullable=False, index=True)
    decision_id = Column(String(36), nullable=True)
    actor = Column(String(100), nullable=False)
    trust_tier = Column(String(50), default="human_confirmed")
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

class DreamModeRun(Base):
    """Dream Mode Consolidation Run"""
    __tablename__ = "dream_mode_runs"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    run_timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    consolidated_count = Column(Integer, default=0)
    contradictions_detected = Column(Integer, default=0)
    pruned_items_count = Column(Integer, default=0)
    gaps_identified = Column(Integer, default=0)
    summary_report = Column(Text, nullable=False)
