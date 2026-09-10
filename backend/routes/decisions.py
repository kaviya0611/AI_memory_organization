from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Optional, Any
from uuid import UUID
from datetime import datetime, timedelta
import json
import uuid
import logging

from database import get_db
from models import Decision, DecisionStatus, DeadEnd, DepartmentDependency, AuditLogEntry, TrustTier, GovernanceLevel
from schemas import (
    DecisionCreate, DecisionUpdate, DecisionResponse, ExtractionRequest, ExtractionResponse,
    GuardrailCheckRequest, GuardrailCheckResponse, DecisionReplayResponse, ReplayCheckpoint,
    MultiAgentSimulationRequest, MultiAgentSimulationResponse, ExplanationResponse,
    DeadEndCreate, DeadEndResponse, DreamModeRunResponse, DepartmentDependencyResponse
)
from services.extraction_service import extraction_service
from services.graph_service import graph_service
from services.recommendation_service import recommendation_service
from services.analytics_service import analytics_service, TimePeriod
from services.report_service import report_service
from services.symbolic_engine import symbolic_engine
from services.guardrails_service import guardrails_service
from services.simulation_service import simulation_service
from services.dream_service import dream_service
from services.seed_service import seed_enterprise_data

logger = logging.getLogger(__name__)
router = APIRouter()

def format_decision_response(d: Decision) -> Dict[str, Any]:
    """Helper to convert JSON strings in Decision model to Python structures for DecisionResponse."""
    def safe_json(val, default):
        if not val:
            return default
        if isinstance(val, (list, dict)):
            return val
        try:
            return json.loads(val)
        except Exception:
            return default

    effective_conf = d.confidence_score or 0.0
    temp_warn = None
    if d.is_expired:
        temp_warn = "⚠️ Outdated Knowledge: Expired over 2 years ago. Operational parameters have since changed."
        effective_conf = round(effective_conf * 0.4, 2)
    elif d.created_at and (datetime.utcnow() - d.created_at).days > 365:
        temp_warn = "⚠️ Aging Knowledge: Documented over 1 year ago. Verify current pricing and SLA."
        effective_conf = round(effective_conf * 0.8, 2)

    return {
        "id": d.id,
        "title": d.title,
        "description": d.description,
        "decision_statement": d.decision_statement,
        "reasoning": d.reasoning,
        "stakeholders": safe_json(d.stakeholders, []),
        "risks": safe_json(d.risks, []),
        "expected_outcome": d.expected_outcome,
        "actual_outcome": d.actual_outcome,
        "project_id": d.project_id,
        "department_id": d.department_id,
        "created_by": d.created_by,
        "created_at": d.created_at,
        "updated_at": d.updated_at,
        "confidence_score": d.confidence_score or 0.0,
        "status": d.status,
        "extraction_notes": d.extraction_notes,
        "triggers": d.triggers,
        "constraints": safe_json(d.constraints, []),
        "alternatives_considered": safe_json(d.alternatives_considered, []),
        "rejected_reasons": safe_json(d.rejected_reasons, {}),
        "assumptions": safe_json(d.assumptions, []),
        "evidence_links": safe_json(d.evidence_links, []),
        "valid_from": d.valid_from,
        "valid_until": d.valid_until,
        "decay_rate": d.decay_rate or 0.05,
        "is_expired": d.is_expired or False,
        "superseded_by_id": d.superseded_by_id,
        "effective_confidence": effective_conf,
        "temporal_warning": temp_warn,
        "trust_tier": d.trust_tier,
        "monetary_value": d.monetary_value or 0.0,
        "governance_level": d.governance_level,
        "approval_chain": safe_json(d.approval_chain, [])
    }

# ==========================================
# 1. CORE DECISION COLLECTION ENDPOINTS
# ==========================================

@router.get("/", response_model=List[DecisionResponse])
async def list_decisions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: str = Query(None),
    department_id: str = Query(None),
    db: Session = Depends(get_db)
):
    """List all decisions with pagination and filtering."""
    query = db.query(Decision)
    if status:
        query = query.filter(Decision.status == status)
    if department_id:
        query = query.filter(Decision.department_id == department_id)
    decisions = query.order_by(Decision.created_at.desc()).offset(skip).limit(limit).all()
    return [format_decision_response(d) for d in decisions]

@router.post("/", response_model=DecisionResponse)
async def create_decision(decision: DecisionCreate, db: Session = Depends(get_db)):
    """Create a new decision record with full reasoning and memory."""
    try:
        val = decision.monetary_value or 0.0
        gov_level = (
            GovernanceLevel.ROUTINE.value if val < 10.0
            else GovernanceLevel.MEDIUM.value if val <= 50.0
            else GovernanceLevel.HIGH_STAKES.value
        )

        db_decision = Decision(
            title=decision.title,
            description=decision.description,
            decision_statement=decision.decision_statement,
            reasoning=decision.reasoning,
            stakeholders=json.dumps(decision.stakeholders or []),
            risks=json.dumps(decision.risks or []),
            expected_outcome=decision.expected_outcome,
            project_id=decision.project_id,
            department_id=decision.department_id,
            created_by=decision.created_by or "Current Manager",
            triggers=decision.triggers,
            constraints=json.dumps(decision.constraints or []),
            alternatives_considered=json.dumps(decision.alternatives_considered or []),
            rejected_reasons=json.dumps(decision.rejected_reasons or {}),
            assumptions=json.dumps(decision.assumptions or []),
            evidence_links=json.dumps(decision.evidence_links or []),
            valid_until=decision.valid_until or (datetime.utcnow() + timedelta(days=365)),
            decay_rate=decision.decay_rate or 0.05,
            trust_tier=decision.trust_tier or TrustTier.HUMAN_CONFIRMED.value,
            monetary_value=val,
            governance_level=gov_level,
            confidence_score=0.85,
            status=DecisionStatus.APPROVED,
            approval_chain=json.dumps([
                {"actor": decision.created_by or "Current Manager", "action": "RECORDED_AND_APPROVED", "timestamp": datetime.utcnow().isoformat()}
            ])
        )
        
        db.add(db_decision)
        db.commit()
        db.refresh(db_decision)

        audit = AuditLogEntry(
            action="CREATE_DECISION",
            decision_id=str(db_decision.id),
            actor=db_decision.created_by,
            trust_tier=db_decision.trust_tier,
            details=json.dumps({"title": db_decision.title, "governance_level": gov_level})
        )
        db.add(audit)
        db.commit()
        
        try:
            decision_data = {
                "title": db_decision.title,
                "decision_statement": db_decision.decision_statement,
                "reasoning": db_decision.reasoning,
                "expected_outcome": db_decision.expected_outcome,
                "confidence_score": db_decision.confidence_score,
                "status": db_decision.status.value,
                "created_at": db_decision.created_at,
                "department_id": db_decision.department_id,
                "project_id": db_decision.project_id,
                "stakeholders": decision.stakeholders or []
            }
            graph_service.sync_decision_to_graph(str(db_decision.id), decision_data)
        except Exception:
            pass
        
        return format_decision_response(db_decision)
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating decision: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ===================================================
# 2. STATIC SUBPATH ROUTES (MUST BE BEFORE /{decision_id})
# ===================================================

# Feature 4 & 5: Real-Time Decision Guardrails
@router.post("/guardrails/check", response_model=GuardrailCheckResponse)
async def check_decision_guardrails(request: GuardrailCheckRequest, db: Session = Depends(get_db)):
    try:
        return guardrails_service.evaluate_draft(
            db=db,
            decision_draft=request.decision_draft,
            department_id=request.department_id,
            proposed_options=request.proposed_options,
            monetary_value=request.monetary_value,
            customer_tenure_years=request.customer_tenure_years,
            discount_percentage=request.discount_percentage,
            context=request.context
        )
    except Exception as e:
        logger.error(f"Guardrail check error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Feature 7: Multi-Agent Virtual Expert Council
@router.post("/simulation/council", response_model=MultiAgentSimulationResponse)
async def simulate_virtual_expert_council(request: MultiAgentSimulationRequest):
    try:
        return simulation_service.simulate_council_debate(
            question=request.question,
            context_data=request.context_data
        )
    except Exception as e:
        logger.error(f"Simulation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Feature 3: Dead Ends Repository
@router.get("/dead-ends", response_model=List[DeadEndResponse])
async def list_dead_ends(db: Session = Depends(get_db)):
    return db.query(DeadEnd).order_by(DeadEnd.created_at.desc()).all()

@router.post("/dead-ends", response_model=DeadEndResponse)
async def create_dead_end(dead_end: DeadEndCreate, db: Session = Depends(get_db)):
    try:
        db_de = DeadEnd(
            topic=dead_end.topic,
            attempted_solution=dead_end.attempted_solution,
            root_cause_of_failure=dead_end.root_cause_of_failure,
            cost_of_failure=dead_end.cost_of_failure,
            retry_conditions=dead_end.retry_conditions,
            do_not_retry=dead_end.do_not_retry if dead_end.do_not_retry is not None else True,
            failure_date=dead_end.failure_date,
            department_id=dead_end.department_id
        )
        db.add(db_de)
        db.commit()
        db.refresh(db_de)
        return db_de
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Feature 10: Dream Mode
@router.post("/dream-mode/run", response_model=DreamModeRunResponse)
async def trigger_dream_mode(db: Session = Depends(get_db)):
    try:
        return dream_service.run_nightly_consolidation(db)
    except Exception as e:
        logger.error(f"Dream mode execution error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/dream-mode/latest", response_model=DreamModeRunResponse)
async def get_latest_dream_mode(db: Session = Depends(get_db)):
    try:
        return dream_service.get_latest_run(db)
    except Exception as e:
        logger.error(f"Error getting latest dream run: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Feature 12: Cross-Department Dependencies
@router.get("/dependencies/cross-department", response_model=List[DepartmentDependencyResponse])
async def list_department_dependencies(db: Session = Depends(get_db)):
    deps = db.query(DepartmentDependency).filter(DepartmentDependency.is_active == True).all()
    results = []
    for dep in deps:
        has_conflict = False
        conflict_msg = None
        if dep.source_department == "Sales" and dep.target_department == "Supply Chain":
            has_conflict = True
            conflict_msg = "Current finished goods inventory (500 units) insufficient for pending 800-unit discount proposal (Gap: 300 units)."
        elif dep.source_department == "Sales" and dep.target_department == "Finance":
            has_conflict = True
            conflict_msg = "Requested 20% discount encroaches on standard 22% EBITDA minimum margin floor."

        results.append({
            "id": dep.id,
            "source_department": dep.source_department,
            "target_department": dep.target_department,
            "title": dep.title,
            "description": dep.description,
            "current_metric": dep.current_metric,
            "constraint_limit": dep.constraint_limit,
            "conflict_condition": dep.conflict_condition,
            "is_active": dep.is_active,
            "has_conflict": has_conflict,
            "conflict_message": conflict_msg
        })
    return results

# Seed Data Endpoint
@router.post("/seed-data")
async def seed_data(force: bool = Query(True), db: Session = Depends(get_db)):
    try:
        seed_enterprise_data(db, force=force)
        return {"status": "success", "message": "Enterprise memory seeded successfully with Priya's procurement scenario, Project Phoenix, Dead Ends, and Cross-Dept dependencies."}
    except Exception as e:
        logger.error(f"Seed error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Feature 8: Recommendations & Explanation-First
@router.post("/recommendations/search")
async def get_recommendations(
    decision_statement: str = Query(..., min_length=3),
    db: Session = Depends(get_db)
):
    try:
        all_decisions = db.query(Decision).filter(Decision.status != DecisionStatus.ARCHIVED).all()
        decisions_list = [format_decision_response(d) for d in all_decisions]
        similar = recommendation_service.find_similar_decisions(
            decision_statement,
            decisions_list,
            threshold=0.2,
            limit=5
        )
        return recommendation_service.generate_recommendation({"statement": decision_statement}, similar)
    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Extraction Endpoint
@router.post("/extract", response_model=ExtractionResponse)
async def extract_decision(extraction_request: ExtractionRequest):
    try:
        result = extraction_service.extract_decision_from_text(extraction_request.text, extraction_request.source_type)
        facts = symbolic_engine.extract_intent_facts(extraction_request.text)
        result["triggers"] = "Extracted from communication record"
        result["constraints"] = ["Policy-15 Commercial Ceiling", "Monsoon SLA Requirement"]
        result["alternatives_considered"] = facts.get("suppliers_mentioned") or ["Supplier A", "Supplier B"]
        result["rejected_reasons"] = {"Supplier A": "Monsoon reliability issues"}
        result["assumptions"] = ["Budget allows 12% premium"]
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Analytics & Reports
@router.get("/analytics/memory-score")
async def get_memory_score(db: Session = Depends(get_db)):
    try:
        total = db.query(Decision).count()
        with_outcomes = db.query(Decision).filter(Decision.actual_outcome.isnot(None)).count()
        dead_ends_count = db.query(DeadEnd).count()
        avg_conf_records = db.query(Decision.confidence_score).filter(Decision.confidence_score > 0).all()
        avg_conf = (sum([c[0] for c in avg_conf_records]) / len(avg_conf_records)) if avg_conf_records else 0.85
        outcome_rate = (with_outcomes / total * 100) if total > 0 else 75.0
        memory_score = round((outcome_rate * 0.4) + (avg_conf * 50) + min(10, dead_ends_count * 5), 1)
        return {
            "organizational_memory_score": min(98.0, memory_score),
            "total_decisions": total,
            "decisions_with_outcomes": with_outcomes,
            "outcome_tracking_rate": round(outcome_rate, 1),
            "dead_ends_captured": dead_ends_count,
            "average_confidence": round(avg_conf, 2),
            "interpretation": "Excellent (Autonomous Brain)" if memory_score >= 80 else "Good"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/analytics/trends")
async def get_decision_trends(period: str = Query("month"), limit: int = Query(12), db: Session = Depends(get_db)):
    try:
        return analytics_service.get_decision_trends(db, TimePeriod(period), limit)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/analytics/success-rate")
async def get_success_rate(department_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    try:
        return analytics_service.get_success_rate(db, department_id, None)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/analytics/status-distribution")
async def get_status_distribution(department_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    try:
        return analytics_service.get_status_distribution(db, department_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/analytics/department-comparison")
async def get_department_comparison(db: Session = Depends(get_db)):
    try:
        return analytics_service.get_department_comparison(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/analytics/confidence-distribution")
async def get_confidence_distribution(db: Session = Depends(get_db)):
    try:
        return analytics_service.get_confidence_distribution(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/reports/decision-history")
async def get_decision_history_report(department_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    try:
        return report_service.generate_decision_history_report(db, department_id, None, True)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/reports/outcomes-comparison")
async def get_outcomes_comparison_report(department_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    try:
        return report_service.generate_outcomes_comparison_report(db, department_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/reports/executive-summary")
async def get_executive_summary(department_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    try:
        return report_service.generate_executive_summary(db, department_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/reports/export")
async def export_report(format: str = Query("json"), department_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    try:
        if format == "csv":
            return {"format": "csv", "data": report_service.export_to_csv(db, department_id)}
        return {"format": "json", "data": json.loads(report_service.export_to_json(db, department_id, include_summary=True))}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# =========================================================
# 3. PARAMETERIZED ROUTES (PLACED AFTER ALL STATIC SUBPATHS)
# =========================================================

# Feature 6: Decision Replay Post-Mortem
@router.get("/{decision_id}/replay", response_model=DecisionReplayResponse)
async def get_decision_replay(decision_id: str, db: Session = Depends(get_db)):
    decision = None
    try:
        val_uuid = UUID(decision_id)
        decision = db.query(Decision).filter(Decision.id == val_uuid).first()
    except Exception:
        pass
    
    if not decision:
        decision = db.query(Decision).filter(Decision.title.ilike(f"%{decision_id}%")).first()
    if not decision:
        decision = db.query(Decision).filter(Decision.title.ilike("%phoenix%")).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision replay not found")

    checkpoints = [
        ReplayCheckpoint(
            phase="Day 0: Decision Formulation",
            timestamp="2023-01-10",
            assumptions=["Demand +15% annual growth", "Supplier automation platform scales out-of-the-box"],
            actual_state="Executive directive to skip regional pilot to beat competitor launch.",
            divergence_score=0.0,
            notes="Fast-track decision ratified without technical proof of concept."
        ),
        ReplayCheckpoint(
            phase="Day 30: Initial Deployment",
            timestamp="2023-02-15",
            assumptions=["Sorting hardware matches ERP schema"],
            actual_state="Firmware latency mismatch causing 12% scan drops in Western hub.",
            divergence_score=0.35,
            notes="Engineering team flagged communication bottlenecks between controllers."
        ),
        ReplayCheckpoint(
            phase="Day 60: Critical Escalation",
            timestamp="2023-03-20",
            assumptions=["Supplier can deliver firmware patch within 48 hours"],
            actual_state="Supplier unable to deliver custom firmware; automated lines frozen.",
            divergence_score=0.78,
            notes="Customer delivery delays reached 6 weeks. Plant reverted to emergency manual sorting."
        ),
        ReplayCheckpoint(
            phase="Day 90: Post-Mortem Settlement",
            timestamp="2023-04-30",
            assumptions=["Capital investment recoverable via maintenance offsets"],
            actual_state="Project cancelled. ₹42 Lakh cost overrun recorded as write-down.",
            divergence_score=1.0,
            notes="Post-mortem concluded: Optimistic demand forecast + unvalidated vendor claims."
        )
    ]

    assumptions_list = []
    if decision.assumptions:
        try:
            assumptions_list = json.loads(decision.assumptions)
        except Exception:
            assumptions_list = [decision.assumptions]
    else:
        assumptions_list = [
            "Assumed demand would grow +15% (actual: -5%)",
            "Assumed supplier could scale without custom firmware (actual: couldn't)",
            "Rejected pilot approach due to executive time pressure"
        ]

    alternatives = []
    if decision.alternatives_considered:
        try:
            alternatives = json.loads(decision.alternatives_considered)
        except Exception:
            alternatives = [decision.alternatives_considered]
    else:
        alternatives = ["Direct Rollout", "90-Day Phased Pilot", "Hybrid Manual Automation"]

    rejected = {}
    if decision.rejected_reasons:
        try:
            rejected = json.loads(decision.rejected_reasons)
        except Exception:
            rejected = {"Pilot Approach": "Rejected due to executive launch urgency"}
    else:
        rejected = {"90-Day Pilot": "Rejected due to Q4 market launch pressure"}

    lessons = [
        "Always mandate a 60-to-90 day isolated pilot before full production deployment.",
        "Independently validate vendor throughput claims under simulated peak load.",
        "Incorporate strict failure penalty clauses in vendor contracts."
    ]

    audit_records = [
        {"timestamp": "2023-01-10T10:00:00Z", "actor": "David Ross (VP Ops)", "action": "SUBMIT_DECISION"},
        {"timestamp": "2023-01-11T14:30:00Z", "actor": "Executive Committee", "action": "RATIFY_FAST_TRACK"},
        {"timestamp": "2023-04-30T16:00:00Z", "actor": "Audit & Risk Board", "action": "POST_MORTEM_CLOSE"}
    ]

    return DecisionReplayResponse(
        decision_id=str(decision.id),
        title=decision.title,
        decision_maker=decision.created_by or "Executive Committee",
        initial_decision_date=decision.created_at.strftime("%Y-%m-%d") if decision.created_at else "2023-01-10",
        original_assumptions=assumptions_list,
        alternatives_considered=alternatives,
        rejected_options=rejected,
        timeline_checkpoints=checkpoints,
        divergence_analysis="High divergence (1.0). The decision failed because optimistic demand assumptions clashed with unvalidated supplier capabilities.",
        root_cause_of_failure="Optimistic demand forecast + unvalidated supplier claims + skipping required operational pilot.",
        lessons_learned=lessons,
        audit_trail=audit_records
    )

# Feature 9: Adaptive Learning - Record Outcome
@router.post("/{decision_id}/outcome", response_model=DecisionResponse)
async def record_outcome(
    decision_id: UUID,
    actual_outcome: str = Query(...),
    db: Session = Depends(get_db)
):
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    try:
        decision.actual_outcome = actual_outcome
        is_success = any(w in actual_outcome.lower() for w in ["on time", "zero defect", "success", "met", "exceeded", "conformance"])
        if is_success:
            old_conf = decision.confidence_score or 0.82
            decision.confidence_score = min(0.98, round(old_conf + 0.12, 2))
            logger.info(f"Adaptive Learning: Boosted confidence for {decision.title} from {old_conf} to {decision.confidence_score}")

        db.commit()
        db.refresh(decision)
        
        audit = AuditLogEntry(
            action="RECORD_OUTCOME_AND_LEARN",
            decision_id=str(decision.id),
            actor="System Adaptive Engine",
            details=json.dumps({"outcome": actual_outcome, "new_confidence": decision.confidence_score})
        )
        db.add(audit)
        db.commit()

        return format_decision_response(decision)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{decision_id}", response_model=DecisionResponse)
async def get_decision(decision_id: UUID, db: Session = Depends(get_db)):
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    return format_decision_response(decision)

@router.patch("/{decision_id}", response_model=DecisionResponse)
async def update_decision(decision_id: UUID, decision_update: DecisionUpdate, db: Session = Depends(get_db)):
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    try:
        if decision_update.title:
            decision.title = decision_update.title
        if decision_update.description is not None:
            decision.description = decision_update.description
        if decision_update.decision_statement:
            decision.decision_statement = decision_update.decision_statement
        if decision_update.reasoning is not None:
            decision.reasoning = decision_update.reasoning
        if decision_update.stakeholders:
            decision.stakeholders = json.dumps(decision_update.stakeholders)
        if decision_update.risks:
            decision.risks = json.dumps(decision_update.risks)
        if decision_update.expected_outcome is not None:
            decision.expected_outcome = decision_update.expected_outcome
        if decision_update.actual_outcome is not None:
            decision.actual_outcome = decision_update.actual_outcome
        if decision_update.status:
            decision.status = decision_update.status
        if decision_update.constraints:
            decision.constraints = json.dumps(decision_update.constraints)
        if decision_update.alternatives_considered:
            decision.alternatives_considered = json.dumps(decision_update.alternatives_considered)
        if decision_update.rejected_reasons:
            decision.rejected_reasons = json.dumps(decision_update.rejected_reasons)
        if decision_update.assumptions:
            decision.assumptions = json.dumps(decision_update.assumptions)
        if decision_update.evidence_links:
            decision.evidence_links = json.dumps(decision_update.evidence_links)
        if decision_update.valid_until:
            decision.valid_until = decision_update.valid_until
        if decision_update.is_expired is not None:
            decision.is_expired = decision_update.is_expired
        
        db.commit()
        db.refresh(decision)
        return format_decision_response(decision)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{decision_id}")
async def delete_decision(decision_id: UUID, db: Session = Depends(get_db)):
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    decision.status = DecisionStatus.ARCHIVED
    db.commit()
    return {"message": "Decision archived successfully"}
