from sqlalchemy import Column, String, Text, DateTime, Float, Enum as SQLEnum, Boolean, Integer
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

class TrustTier(str, enum.Enum):
    RAW_SOURCE = "raw_source"           # Tier 1: Raw emails, chat, meeting notes
    AI_DERIVED = "ai_derived"           # Tier 2: Extracted logic / suggestions
    HUMAN_CONFIRMED = "human_confirmed" # Tier 3: Verified by managers/policy

class GovernanceLevel(str, enum.Enum):
    ROUTINE = "routine"         # < ₹10L: AI acts autonomously
    MEDIUM = "medium"           # ₹10L - ₹50L: AI recommends, Human approves
    HIGH_STAKES = "high_stakes" # > ₹50L: AI briefs, Human decides

class Decision(Base):
    __tablename__ = "decisions"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    decision_statement = Column(Text, nullable=False)
    reasoning = Column(Text, nullable=True)
    stakeholders = Column(Text, nullable=True)  # JSON string
    risks = Column(Text, nullable=True)  # JSON string
    expected_outcome = Column(Text, nullable=True)
    actual_outcome = Column(Text, nullable=True)
    project_id = Column(String(255), nullable=True)
    department_id = Column(String(255), nullable=True, index=True)
    created_by = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    confidence_score = Column(Float, default=0.0)
    status = Column(SQLEnum(DecisionStatus), default=DecisionStatus.PENDING_REVIEW)
    extraction_notes = Column(Text, nullable=True)

    # Feature 1: Full Decision Memory
    triggers = Column(Text, nullable=True)                  # What triggered the decision
    constraints = Column(Text, nullable=True)               # JSON string of constraints (budget, timeline, etc.)
    alternatives_considered = Column(Text, nullable=True)   # JSON string list
    rejected_reasons = Column(Text, nullable=True)          # JSON dict {option: reason}
    assumptions = Column(Text, nullable=True)               # JSON string list
    evidence_links = Column(Text, nullable=True)            # JSON string list of references/tickets/policies

    # Feature 2: Temporal Validity
    valid_from = Column(DateTime, default=datetime.utcnow, nullable=False)
    valid_until = Column(DateTime, nullable=True)
    decay_rate = Column(Float, default=0.05)                # Confidence decay per month when not reinforced
    is_expired = Column(Boolean, default=False)
    superseded_by_id = Column(String(36), nullable=True)

    # Feature 11: Governance-First Execution
    trust_tier = Column(String(50), default=TrustTier.HUMAN_CONFIRMED.value)
    monetary_value = Column(Float, default=0.0)             # In Lakhs (INR)
    governance_level = Column(String(50), default=GovernanceLevel.MEDIUM.value)
    approval_chain = Column(Text, nullable=True)            # JSON string of approval actions
    
    def __repr__(self):
        return f"<Decision(id={self.id}, title={self.title}, status={self.status})>"

class DeadEnd(Base):
    """Feature 3: Dead Ends Repository - Captures failures and anti-patterns"""
    __tablename__ = "dead_ends"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    topic = Column(String(255), nullable=False, index=True)
    attempted_solution = Column(String(255), nullable=False)
    root_cause_of_failure = Column(Text, nullable=False)
    cost_of_failure = Column(String(100), nullable=True)     # e.g. "₹25 lakh"
    retry_conditions = Column(Text, nullable=True)          # Conditions under which it could work
    do_not_retry = Column(Boolean, default=True)            # Hard guardrail warning
    failure_date = Column(String(50), nullable=True)        # e.g. "2021-06"
    department_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<DeadEnd(topic={self.topic}, solution={self.attempted_solution})>"

class DepartmentDependency(Base):
    """Feature 12: Cross-Department Decision Connections - Breaks Silos"""
    __tablename__ = "department_dependencies"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    source_department = Column(String(100), nullable=False, index=True) # e.g. "Sales"
    target_department = Column(String(100), nullable=False, index=True) # e.g. "Supply Chain"
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    current_metric = Column(String(255), nullable=True)                 # e.g. "Available inventory: 500 units"
    constraint_limit = Column(String(255), nullable=True)               # e.g. "Max commitment: 500 units without lead time"
    conflict_condition = Column(Text, nullable=True)                    # e.g. "Requested units > 500"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<DepartmentDependency({self.source_department} -> {self.target_department})>"

class AuditLogEntry(Base):
    """Feature 11: Governance Audit Trail"""
    __tablename__ = "audit_log"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    action = Column(String(100), nullable=False, index=True)            # e.g. "PROPOSE", "APPROVE", "GUARDRAIL_INTERCEPT"
    decision_id = Column(String(36), nullable=True)
    actor = Column(String(100), nullable=False)
    trust_tier = Column(String(50), default="human_confirmed")
    details = Column(Text, nullable=True)                               # JSON string
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<AuditLog({self.action} by {self.actor})>"

class DreamModeRun(Base):
    """Feature 10: Dream Mode - Nightly Self-Improving Memory Consolidation"""
    __tablename__ = "dream_mode_runs"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    run_timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    consolidated_count = Column(Integer, default=0)
    contradictions_detected = Column(Integer, default=0)
    pruned_items_count = Column(Integer, default=0)
    gaps_identified = Column(Integer, default=0)
    summary_report = Column(Text, nullable=False)                       # JSON string with insights & patterns

    def __repr__(self):
        return f"<DreamModeRun(at={self.run_timestamp}, consolidated={self.consolidated_count})>"
