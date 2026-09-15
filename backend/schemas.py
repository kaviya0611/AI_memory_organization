from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from uuid import UUID
from models import DecisionStatus, TrustTier, GovernanceLevel

# -------------------------------------------------------------
# System Health & Diagnostic Schemas
# -------------------------------------------------------------
class DatabaseStatus(BaseModel):
    connected: bool
    type: str
    url: str
    fallback_active: bool
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    platform: str
    version: str
    database: DatabaseStatus
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# -------------------------------------------------------------
# Department & Project Schemas
# -------------------------------------------------------------
class DepartmentBase(BaseModel):
    id: str
    name: str
    code: Optional[str] = None
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class ProjectBase(BaseModel):
    id: str
    name: str
    department_id: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "Active"

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# -------------------------------------------------------------
# Evidence, Alternative, Outcome & Lesson Schemas
# -------------------------------------------------------------
class EvidenceItemCreate(BaseModel):
    evidence_type: str = "metric"
    description: str
    source_reference: Optional[str] = None

class EvidenceItemResponse(EvidenceItemCreate):
    id: UUID
    decision_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AlternativeItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    reason_rejected: Optional[str] = None

class AlternativeItemResponse(AlternativeItemCreate):
    id: UUID
    decision_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class OutcomeCreate(BaseModel):
    actual_result: str
    expected_result: Optional[str] = None
    expected_cost: Optional[float] = None
    actual_cost: Optional[float] = None
    expected_timeline: Optional[str] = None
    actual_timeline: Optional[str] = None
    outcome_status: Optional[str] = "Successful"
    lessons_learned: Optional[str] = None
    recorded_by: Optional[str] = None

class OutcomeResponse(OutcomeCreate):
    id: UUID
    decision_id: UUID
    variance_percentage: Optional[float] = None
    recorded_at: datetime
    model_config = ConfigDict(from_attributes=True)

class LessonCreate(BaseModel):
    title: str
    takeaway: str
    category: Optional[str] = "Process"

class LessonResponse(LessonCreate):
    id: UUID
    decision_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# -------------------------------------------------------------
# Core Decision Schemas
# -------------------------------------------------------------
class DecisionCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    decision_statement: str = Field(..., min_length=5)
    reasoning: Optional[str] = None
    stakeholders: Optional[List[str]] = None
    risks: Optional[List[str]] = None
    expected_outcome: Optional[str] = None
    project_id: Optional[str] = None
    department_id: Optional[str] = "Procurement"
    created_by: Optional[str] = None
    
    # Feature 1: Full Decision Memory
    triggers: Optional[str] = None
    constraints: Optional[List[str]] = None
    alternatives_considered: Optional[List[str]] = None
    rejected_reasons: Optional[Dict[str, str]] = None
    assumptions: Optional[List[str]] = None
    evidence_links: Optional[List[str]] = None
    
    # Feature 2: Temporal Validity
    valid_until: Optional[datetime] = None
    decay_rate: Optional[float] = 0.05
    superseded_by_id: Optional[str] = None

    # Feature 11: Governance
    trust_tier: Optional[str] = TrustTier.HUMAN_CONFIRMED.value
    monetary_value: Optional[float] = 0.0
    governance_level: Optional[str] = GovernanceLevel.MEDIUM.value

class DecisionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    decision_statement: Optional[str] = None
    reasoning: Optional[str] = None
    stakeholders: Optional[List[str]] = None
    risks: Optional[List[str]] = None
    expected_outcome: Optional[str] = None
    actual_outcome: Optional[str] = None
    status: Optional[str] = None
    constraints: Optional[List[str]] = None
    alternatives_considered: Optional[List[str]] = None
    rejected_reasons: Optional[Dict[str, str]] = None
    assumptions: Optional[List[str]] = None
    evidence_links: Optional[List[str]] = None
    valid_until: Optional[datetime] = None
    is_expired: Optional[bool] = None

class DecisionResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    decision_statement: Optional[str] = None
    reasoning: Optional[str] = None
    stakeholders: Optional[List[str]] = None
    risks: Optional[List[str]] = None
    expected_outcome: Optional[str] = None
    actual_outcome: Optional[str] = None
    project_id: Optional[str] = None
    department_id: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    confidence_score: float = 0.0
    status: Optional[str] = None
    extraction_notes: Optional[str] = None

    # Feature 1: Full Decision Memory
    triggers: Optional[str] = None
    constraints: Optional[List[str]] = None
    alternatives_considered: Optional[List[str]] = None
    rejected_reasons: Optional[Dict[str, str]] = None
    assumptions: Optional[List[str]] = None
    evidence_links: Optional[List[str]] = None

    # Feature 2: Temporal Validity
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    decay_rate: Optional[float] = 0.05
    is_expired: Optional[bool] = False
    superseded_by_id: Optional[str] = None
    effective_confidence: Optional[float] = None
    temporal_warning: Optional[str] = None

    # Feature 11: Governance
    trust_tier: Optional[str] = None
    monetary_value: Optional[float] = 0.0
    governance_level: Optional[str] = None
    approval_chain: Optional[List[Dict[str, Any]]] = None

    # Nested child relationships
    evidence_items: Optional[List[EvidenceItemResponse]] = []
    alternatives: Optional[List[AlternativeItemResponse]] = []
    outcomes: Optional[List[OutcomeResponse]] = []
    lessons: Optional[List[LessonResponse]] = []
    
    model_config = ConfigDict(from_attributes=True)

# -------------------------------------------------------------
# Extraction, Guardrails, Replay, Simulation, Dead Ends
# -------------------------------------------------------------
class ExtractionRequest(BaseModel):
    text: str = Field(..., min_length=10)
    source_type: Optional[str] = "text"

class ExtractionResponse(BaseModel):
    decision_statement: str
    reasoning: str
    stakeholders: List[str]
    risks: List[str]
    expected_outcome: str
    confidence_score: float
    extraction_notes: Optional[str] = None
    triggers: Optional[str] = None
    constraints: Optional[List[str]] = None
    alternatives_considered: Optional[List[str]] = None
    rejected_reasons: Optional[Dict[str, str]] = None
    assumptions: Optional[List[str]] = None

class DeadEndCreate(BaseModel):
    topic: str
    attempted_solution: str
    root_cause_of_failure: str
    cost_of_failure: Optional[str] = "₹25 lakh"
    retry_conditions: Optional[str] = "Do NOT retry unless prerequisite certifications obtained"
    do_not_retry: Optional[bool] = True
    failure_date: Optional[str] = "2021-06"
    department_id: Optional[str] = "Procurement"

class DeadEndResponse(BaseModel):
    id: UUID
    topic: str
    attempted_solution: str
    root_cause_of_failure: str
    cost_of_failure: Optional[str] = None
    retry_conditions: Optional[str] = None
    do_not_retry: bool = True
    failure_date: Optional[str] = None
    department_id: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class GuardrailRuleViolation(BaseModel):
    rule_id: str
    severity: str
    message: str
    evidence: str
    counter_offer: Optional[str] = None
    escalation_path: Optional[str] = None

class GuardrailCheckRequest(BaseModel):
    decision_draft: str = Field(..., min_length=5)
    department_id: Optional[str] = "Procurement"
    proposed_options: Optional[List[str]] = None
    monetary_value: Optional[float] = 0.0
    customer_tenure_years: Optional[float] = None
    discount_percentage: Optional[float] = None
    context: Optional[Dict[str, Any]] = None

class GuardrailCheckResponse(BaseModel):
    passed: bool
    status: str
    violations: List[GuardrailRuleViolation]
    dead_end_warnings: List[Dict[str, Any]]
    temporal_warnings: List[str]
    cross_department_conflicts: List[Dict[str, Any]]
    logic_proof_tree: List[str]
    recommendation: str

class ReplayCheckpoint(BaseModel):
    phase: str
    timestamp: str
    assumptions: List[str]
    actual_state: str
    divergence_score: float
    notes: str

class DecisionReplayResponse(BaseModel):
    decision_id: str
    title: str
    decision_maker: str
    initial_decision_date: str
    original_assumptions: List[str]
    alternatives_considered: List[str]
    rejected_options: Dict[str, str]
    timeline_checkpoints: List[ReplayCheckpoint]
    divergence_analysis: str
    root_cause_of_failure: Optional[str] = None
    lessons_learned: List[str]
    audit_trail: List[Dict[str, Any]]

class AgentStance(BaseModel):
    expert_name: str
    role: str
    stance: str
    confidence: float
    arguments: List[str]
    key_risk: str
    recommended_condition: str

class MultiAgentSimulationRequest(BaseModel):
    question: str = Field(..., min_length=5)
    context_data: Optional[Dict[str, Any]] = None

class MultiAgentSimulationResponse(BaseModel):
    question: str
    simulated_experts: List[AgentStance]
    consensus_score: float
    consensus_status: str
    key_disagreements: List[str]
    synthesized_recommendation: str
    conditions_to_proceed: List[str]

class ExplanationResponse(BaseModel):
    recommendation: str
    confidence_level: str
    confidence_score: float
    layer1_source_attribution: str
    layer2_reasoning_chain: List[str]
    layer3_confidence_breakdown: Dict[str, Any]
    layer4_counterfactuals: List[str]
    layer5_evidence_links: List[Dict[str, str]]

class DreamModeRunResponse(BaseModel):
    id: UUID
    run_timestamp: datetime
    consolidated_count: int
    contradictions_detected: int
    pruned_items_count: int
    gaps_identified: int
    insights: List[str]
    consolidated_patterns: List[Dict[str, Any]]
    contradiction_reports: List[Dict[str, Any]]
    pruned_records: List[Dict[str, Any]]
    knowledge_gaps: List[str]

class DepartmentDependencyResponse(BaseModel):
    id: UUID
    source_department: str
    target_department: str
    title: str
    description: str
    current_metric: Optional[str] = None
    constraint_limit: Optional[str] = None
    conflict_condition: Optional[str] = None
    is_active: bool = True
    has_conflict: bool = False
    conflict_message: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
