from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from uuid import UUID
from datetime import datetime
import json
from database import get_db
from models import Decision, DecisionStatus
from schemas import DecisionCreate, DecisionUpdate, DecisionResponse, ExtractionRequest, ExtractionResponse
from services.extraction_service import extraction_service
from services.graph_service import graph_service
from services.recommendation_service import recommendation_service
from services.analytics_service import analytics_service, TimePeriod
from services.report_service import report_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=DecisionResponse)
async def create_decision(decision: DecisionCreate, db: Session = Depends(get_db)):
    """Create a new decision record."""
    try:
        # Convert lists to JSON strings for storage
        stakeholders_json = json.dumps(decision.stakeholders or [])
        risks_json = json.dumps(decision.risks or [])
        
        db_decision = Decision(
            title=decision.title,
            description=decision.description,
            decision_statement=decision.decision_statement,
            reasoning=decision.reasoning,
            stakeholders=stakeholders_json,
            risks=risks_json,
            expected_outcome=decision.expected_outcome,
            project_id=decision.project_id,
            department_id=decision.department_id,
            created_by=decision.created_by,
        )
        
        db.add(db_decision)
        db.commit()
        db.refresh(db_decision)
        
        # Sync to Neo4j graph
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
        
        logger.info(f"Created decision: {db_decision.id}")
        return db_decision
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating decision: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[DecisionResponse])
async def list_decisions(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
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
    return decisions

@router.get("/{decision_id}", response_model=DecisionResponse)
async def get_decision(decision_id: UUID, db: Session = Depends(get_db)):
    """Get a specific decision by ID."""
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    return decision

@router.patch("/{decision_id}", response_model=DecisionResponse)
async def update_decision(
    decision_id: UUID,
    decision_update: DecisionUpdate,
    db: Session = Depends(get_db)
):
    """Update a decision record."""
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    try:
        # Update fields if provided
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
        
        db.commit()
        db.refresh(decision)
        
        logger.info(f"Updated decision: {decision_id}")
        return decision
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating decision: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{decision_id}")
async def delete_decision(decision_id: UUID, db: Session = Depends(get_db)):
    """Archive a decision (soft delete)."""
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    try:
        decision.status = DecisionStatus.ARCHIVED
        db.commit()
        
        logger.info(f"Archived decision: {decision_id}")
        return {"message": "Decision archived successfully"}
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error archiving decision: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/extract", response_model=ExtractionResponse)
async def extract_decision(extraction_request: ExtractionRequest):
    """Extract decision information from unstructured text."""
    try:
        result = extraction_service.extract_decision_from_text(
            extraction_request.text,
            extraction_request.source_type
        )
        return result
    except Exception as e:
        logger.error(f"Error in extraction endpoint: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{decision_id}/outcome", response_model=DecisionResponse)
async def record_outcome(
    decision_id: UUID,
    actual_outcome: str,
    db: Session = Depends(get_db)
):
    """Record the actual outcome of a decision."""
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    try:
        decision.actual_outcome = actual_outcome
        db.commit()
        db.refresh(decision)
        
        # Sync outcome to Neo4j graph
        graph_service.create_outcome_relationship(str(decision_id), actual_outcome)
        
        logger.info(f"Recorded outcome for decision: {decision_id}")
        return decision
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error recording outcome: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/recommendations/search")
async def get_recommendations(
    decision_statement: str = Query(..., min_length=10),
    db: Session = Depends(get_db)
):
    """
    Get recommendations for a decision based on similar past decisions.
    
    Uses semantic similarity to find similar decisions and provides insights
    from what actually happened with those past decisions.
    """
    try:
        # Get all decisions from database
        all_decisions = db.query(Decision).filter(
            Decision.status != DecisionStatus.ARCHIVED
        ).all()
        
        # Convert to dictionary format for recommendation service
        decisions_list = []
        for d in all_decisions:
            decisions_list.append({
                "id": str(d.id),
                "title": d.title,
                "decision_statement": d.decision_statement,
                "reasoning": d.reasoning,
                "expected_outcome": d.expected_outcome,
                "actual_outcome": d.actual_outcome,
                "status": d.status.value if d.status else "unknown",
                "created_at": d.created_at.isoformat() if d.created_at else None
            })
        
        # Find similar decisions
        similar = recommendation_service.find_similar_decisions(
            decision_statement,
            decisions_list,
            threshold=0.3,
            limit=5
        )
        
        # Generate recommendation
        query_decision = {"statement": decision_statement}
        recommendation = recommendation_service.generate_recommendation(
            query_decision,
            similar
        )
        
        return recommendation
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/analytics/memory-score")
async def get_memory_score(db: Session = Depends(get_db)):
    """
    Get the organizational memory score based on decision tracking and outcomes.
    
    Scores factors:
    - Percentage of decisions with recorded outcomes
    - Average confidence of decisions
    - Decision capture rate
    """
    try:
        # Get statistics from database
        total_decisions = db.query(Decision).count()
        
        decisions_with_outcomes = db.query(Decision).filter(
            Decision.actual_outcome.isnot(None)
        ).count()
        
        avg_confidence = db.query(Decision.confidence_score).filter(
            Decision.confidence_score > 0
        ).all()
        
        avg_conf = (sum([c[0] for c in avg_confidence]) / len(avg_confidence)) if avg_confidence else 0
        
        # Calculate scores
        outcome_rate = (decisions_with_outcomes / total_decisions * 100) if total_decisions > 0 else 0
        memory_score = (outcome_rate * 0.5) + (avg_conf * 50)
        
        # Get graph statistics (if available)
        graph_stats = graph_service.get_memory_score()
        
        return {
            "organizational_memory_score": round(memory_score, 1),
            "total_decisions": total_decisions,
            "decisions_with_outcomes": decisions_with_outcomes,
            "outcome_tracking_rate": round(outcome_rate, 1),
            "average_extraction_confidence": round(avg_conf, 2),
            "graph_available": graph_stats.get("total_decisions", 0) > 0,
            "interpretation": (
                "Excellent" if memory_score >= 80
                else "Good" if memory_score >= 60
                else "Fair" if memory_score >= 40
                else "Needs Improvement"
            )
        }
        
    except Exception as e:
        logger.error(f"Error calculating memory score: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{department_id}/stats")
async def get_department_stats(
    department_id: str,
    db: Session = Depends(get_db)
):
    """Get statistics for a specific department's decisions."""
    try:
        decisions = db.query(Decision).filter(
            Decision.department_id == department_id
        ).all()
        
        if not decisions:
            raise HTTPException(status_code=404, detail="Department not found")
        
        total = len(decisions)
        with_outcomes = len([d for d in decisions if d.actual_outcome])
        avg_confidence = (sum([d.confidence_score for d in decisions]) / total) if total > 0 else 0
        
        status_breakdown = {}
        for d in decisions:
            status = d.status.value if d.status else "unknown"
            status_breakdown[status] = status_breakdown.get(status, 0) + 1
        
        return {
            "department_id": department_id,
            "total_decisions": total,
            "decisions_with_outcomes": with_outcomes,
            "outcome_tracking_rate": round((with_outcomes / total * 100) if total > 0 else 0, 1),
            "average_confidence": round(avg_confidence, 2),
            "status_breakdown": status_breakdown
        }
        
    except Exception as e:
        logger.error(f"Error getting department stats: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# Phase 3: Advanced Analytics Endpoints

@router.get("/analytics/trends")
async def get_decision_trends(
    period: str = Query("month", regex="^(week|month|quarter|year)$"),
    limit: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get decision creation trends over time."""
    try:
        time_period = TimePeriod(period)
        trends = analytics_service.get_decision_trends(db, time_period, limit)
        return trends
    except Exception as e:
        logger.error(f"Error getting decision trends: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/analytics/success-rate")
async def get_success_rate(
    department_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get success rate metrics for decisions."""
    try:
        status = None
        if status_filter:
            status = DecisionStatus(status_filter)
        
        metrics = analytics_service.get_success_rate(db, department_id, status)
        return metrics
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status filter")
    except Exception as e:
        logger.error(f"Error getting success rate: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/analytics/status-distribution")
async def get_status_distribution(
    department_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get distribution of decisions by status."""
    try:
        distribution = analytics_service.get_status_distribution(db, department_id)
        return distribution
    except Exception as e:
        logger.error(f"Error getting status distribution: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/analytics/department-comparison")
async def get_department_comparison(db: Session = Depends(get_db)):
    """Compare decision metrics across all departments."""
    try:
        comparison = analytics_service.get_department_comparison(db)
        return comparison
    except Exception as e:
        logger.error(f"Error comparing departments: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/analytics/confidence-distribution")
async def get_confidence_distribution(db: Session = Depends(get_db)):
    """Get distribution of decisions by confidence score ranges."""
    try:
        distribution = analytics_service.get_confidence_distribution(db)
        return distribution
    except Exception as e:
        logger.error(f"Error getting confidence distribution: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{decision_id}/comparison")
async def get_decision_comparison(
    decision_id: str,
    db: Session = Depends(get_db)
):
    """Get expected vs actual outcome comparison for a decision."""
    try:
        comparison = analytics_service.get_decision_comparison(db, decision_id)
        if "error" in comparison:
            raise HTTPException(status_code=404, detail=comparison["error"])
        return comparison
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting decision comparison: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# Phase 3: Report Generation Endpoints

@router.get("/reports/decision-history")
async def get_decision_history_report(
    department_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    include_outcomes: bool = Query(True),
    db: Session = Depends(get_db)
):
    """Generate a report of decision history."""
    try:
        status = None
        if status_filter:
            status = DecisionStatus(status_filter)
        
        report = report_service.generate_decision_history_report(
            db, department_id, status, include_outcomes
        )
        return report
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status filter")
    except Exception as e:
        logger.error(f"Error generating decision history report: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/reports/outcomes-comparison")
async def get_outcomes_comparison_report(
    department_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Generate report comparing expected vs actual outcomes."""
    try:
        report = report_service.generate_outcomes_comparison_report(db, department_id)
        return report
    except Exception as e:
        logger.error(f"Error generating outcomes comparison report: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/reports/executive-summary")
async def get_executive_summary(
    department_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Generate executive summary of key metrics."""
    try:
        summary = report_service.generate_executive_summary(db, department_id)
        return summary
    except Exception as e:
        logger.error(f"Error generating executive summary: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/reports/export")
async def export_report(
    format: str = Query("json", regex="^(csv|json)$"),
    department_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Export decisions and analytics in specified format."""
    try:
        if format == "csv":
            csv_data = report_service.export_to_csv(db, department_id)
            return {
                "format": "csv",
                "exported_at": datetime.utcnow().isoformat(),
                "department_id": department_id,
                "data": csv_data,
            }
        else:  # json
            json_data = report_service.export_to_json(db, department_id, include_summary=True)
            return {
                "format": "json",
                "data": json.loads(json_data),
            }
    except Exception as e:
        logger.error(f"Error exporting report: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

