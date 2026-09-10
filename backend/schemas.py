from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from uuid import UUID
from models import DecisionStatus, TrustTier, GovernanceLevel

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
    status: Optional[DecisionStatus] = None
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
    decision_statement: str
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
    status: DecisionStatus
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
    
    class Config:
        from_attributes = True

class ExtractionRequest(BaseModel):
    text: str = Field(..., min_length=10)
    source_type: Optional[str] = "text"  # email, meeting, chat, report, etc.

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

# Feature 3: Dead End Schemas
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

    class Config:
        from_attributes = True

# Feature 4 & 5: Guardrails and Neuro-Symbolic Schemas
class GuardrailCheckRequest(BaseModel):
    decision_draft: str = Field(..., min_length=5)
    department_id: Optional[str] = "Procurement"
    proposed_options: Optional[List[str]] = None
    monetary_value: Optional[float] = 0.0
    customer_tenure_years: Optional[float] = None
    discount_percentage: Optional[float] = None
    context: Optional[Dict[str, Any]] = None

class GuardrailRuleViolation(BaseModel):
    rule_id: str
    severity: str  # "CRITICAL", "WARNING", "INFO"
    message: str
    evidence: str
    counter_offer: Optional[str] = None
    escalation_path: Optional[str] = None

class GuardrailCheckResponse(BaseModel):
    passed: bool
    status: str  # "APPROVED", "INTERVENTION_REQUIRED", "BLOCKED"
    violations: List[GuardrailRuleViolation]
    dead_end_warnings: List[Dict[str, Any]]
    temporal_warnings: List[str]
    cross_department_conflicts: List[Dict[str, Any]]
    logic_proof_tree: List[str]
    recommendation: str

# Feature 6: Decision Replay Schemas
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

# Feature 7: Multi-Agent Simulation Schemas
class AgentStance(BaseModel):
    expert_name: str
    role: str
    stance: str  # "SUPPORTIVE", "OPPOSED", "CAUTIOUS"
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
    consensus_score: float  # 0 to 100%
    consensus_status: str   # "HIGH CONSENSUS", "SPLIT COUNCIL", "STRONG OPPOSITION"
    key_disagreements: List[str]
    synthesized_recommendation: str
    conditions_to_proceed: List[str]

# Feature 8: Explanation-First Schemas
class ExplanationResponse(BaseModel):
    recommendation: str
    confidence_level: str
    confidence_score: float
    layer1_source_attribution: str
    layer2_reasoning_chain: List[str]
    layer3_confidence_breakdown: Dict[str, Any]
    layer4_counterfactuals: List[str]
    layer5_evidence_links: List[Dict[str, str]]

# Feature 10: Dream Mode Schemas
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

# Feature 12: Cross-Department Dependency Schemas
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

    class Config:
        from_attributes = True

