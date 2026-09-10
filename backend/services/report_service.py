"""Report generation service for exporting decision data and analytics."""

from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from models import Decision, DecisionStatus
import json
import logging
from io import StringIO, BytesIO
import csv

logger = logging.getLogger(__name__)


class ReportService:
    """Service for generating custom reports and exports."""

    @staticmethod
    def generate_decision_history_report(
        db: Session,
        department_id: Optional[str] = None,
        status_filter: Optional[DecisionStatus] = None,
        include_outcomes: bool = True,
    ) -> Dict:
        """Generate a report of decision history.
        
        Args:
            db: Database session
            department_id: Filter by department
            status_filter: Filter by status
            include_outcomes: Include actual outcomes in report
            
        Returns:
            Dictionary with report data
        """
        try:
            query = db.query(Decision).filter(Decision.status != DecisionStatus.ARCHIVED)
            
            if department_id:
                query = query.filter(Decision.department_id == department_id)
            
            if status_filter:
                query = query.filter(Decision.status == status_filter)
            
            decisions = query.order_by(Decision.created_at.desc()).all()
            
            report_data = {
                "report_type": "decision_history",
                "generated_at": datetime.utcnow().isoformat(),
                "filters": {
                    "department_id": department_id,
                    "status": status_filter.value if status_filter else None,
                },
                "total_decisions": len(decisions),
                "decisions": [],
            }
            
            for decision in decisions:
                decision_entry = {
                    "id": str(decision.id),
                    "title": decision.title,
                    "description": decision.description,
                    "decision_statement": decision.decision_statement,
                    "reasoning": decision.reasoning,
                    "expected_outcome": decision.expected_outcome,
                    "confidence_score": float(decision.confidence_score) if decision.confidence_score else 0.0,
                    "status": decision.status.value,
                    "created_at": decision.created_at.isoformat() if decision.created_at else None,
                    "department_id": decision.department_id,
                    "project_id": decision.project_id,
                    "created_by": decision.created_by,
                }
                
                if include_outcomes:
                    decision_entry["actual_outcome"] = decision.actual_outcome
                
                # Parse JSON fields
                if decision.stakeholders:
                    try:
                        decision_entry["stakeholders"] = json.loads(decision.stakeholders)
                    except:
                        decision_entry["stakeholders"] = []
                
                if decision.risks:
                    try:
                        decision_entry["risks"] = json.loads(decision.risks)
                    except:
                        decision_entry["risks"] = []
                
                report_data["decisions"].append(decision_entry)
            
            return report_data
            
        except Exception as e:
            logger.error(f"Error generating decision history report: {str(e)}")
            return {
                "error": str(e),
                "report_type": "decision_history",
                "decisions": [],
            }

    @staticmethod
    def generate_outcomes_comparison_report(
        db: Session,
        department_id: Optional[str] = None,
    ) -> Dict:
        """Generate report comparing expected vs actual outcomes.
        
        Args:
            db: Database session
            department_id: Filter by department
            
        Returns:
            Dictionary with comparison report
        """
        try:
            query = db.query(Decision).filter(
                Decision.actual_outcome.isnot(None),
                Decision.status != DecisionStatus.ARCHIVED,
            )
            
            if department_id:
                query = query.filter(Decision.department_id == department_id)
            
            decisions = query.all()
            
            report_data = {
                "report_type": "outcomes_comparison",
                "generated_at": datetime.utcnow().isoformat(),
                "total_with_outcomes": len(decisions),
                "comparisons": [],
            }
            
            for decision in decisions:
                comparison = {
                    "decision_id": str(decision.id),
                    "title": decision.title,
                    "expected_outcome": decision.expected_outcome,
                    "actual_outcome": decision.actual_outcome,
                    "confidence_score": float(decision.confidence_score) if decision.confidence_score else 0.0,
                    "created_at": decision.created_at.isoformat() if decision.created_at else None,
                    "status": decision.status.value,
                }
                
                # Simple text matching to see if outcomes aligned
                if decision.expected_outcome and decision.actual_outcome:
                    expected_words = set(decision.expected_outcome.lower().split())
                    actual_words = set(decision.actual_outcome.lower().split())
                    overlap = len(expected_words & actual_words) / max(len(expected_words), 1)
                    comparison["alignment_score"] = round(overlap, 2)
                
                report_data["comparisons"].append(comparison)
            
            return report_data
            
        except Exception as e:
            logger.error(f"Error generating outcomes comparison report: {str(e)}")
            return {
                "error": str(e),
                "report_type": "outcomes_comparison",
                "comparisons": [],
            }

    @staticmethod
    def generate_executive_summary(
        db: Session,
        department_id: Optional[str] = None,
    ) -> Dict:
        """Generate executive summary of key metrics.
        
        Args:
            db: Database session
            department_id: Filter by department
            
        Returns:
            Dictionary with executive summary
        """
        try:
            from services.graph_service import graph_service
            
            query = db.query(Decision).filter(Decision.status != DecisionStatus.ARCHIVED)
            
            if department_id:
                query = query.filter(Decision.department_id == department_id)
            
            all_decisions = query.all()
            total = len(all_decisions)
            with_outcomes = sum(1 for d in all_decisions if d.actual_outcome)
            
            summary = {
                "report_type": "executive_summary",
                "generated_at": datetime.utcnow().isoformat(),
                "department_id": department_id,
                "key_metrics": {
                    "total_decisions": total,
                    "decisions_with_outcomes": with_outcomes,
                    "outcome_tracking_rate": round((with_outcomes / total * 100) if total > 0 else 0, 1),
                    "avg_confidence": round(
                        sum(d.confidence_score or 0 for d in all_decisions) / max(total, 1), 2
                    ),
                },
            }
            
            # Try to get memory score if graph_service available
            if graph_service.neo4j_conn.is_connected():
                try:
                    memory_score = graph_service.get_memory_score()
                    summary["organizational_memory_score"] = memory_score
                except:
                    pass
            
            # Status breakdown
            status_counts = {}
            for decision in all_decisions:
                status = decision.status.value
                status_counts[status] = status_counts.get(status, 0) + 1
            summary["status_breakdown"] = status_counts
            
            # High/Low confidence decisions
            high_confidence = sum(
                1 for d in all_decisions 
                if d.confidence_score and d.confidence_score >= 0.8
            )
            low_confidence = sum(
                1 for d in all_decisions 
                if d.confidence_score and d.confidence_score < 0.5
            )
            summary["confidence_insights"] = {
                "high_confidence_decisions": high_confidence,
                "low_confidence_decisions": low_confidence,
                "needs_review": low_confidence,
            }
            
            return summary
            
        except Exception as e:
            logger.error(f"Error generating executive summary: {str(e)}")
            return {
                "error": str(e),
                "report_type": "executive_summary",
            }

    @staticmethod
    def export_to_csv(
        db: Session,
        department_id: Optional[str] = None,
    ) -> str:
        """Export decisions to CSV format.
        
        Args:
            db: Database session
            department_id: Filter by department
            
        Returns:
            CSV string data
        """
        try:
            query = db.query(Decision).filter(Decision.status != DecisionStatus.ARCHIVED)
            
            if department_id:
                query = query.filter(Decision.department_id == department_id)
            
            decisions = query.all()
            
            output = StringIO()
            writer = csv.writer(output)
            
            # Header row
            writer.writerow([
                "ID",
                "Title",
                "Decision Statement",
                "Reasoning",
                "Expected Outcome",
                "Actual Outcome",
                "Confidence Score",
                "Status",
                "Department",
                "Project",
                "Created By",
                "Created At",
            ])
            
            # Data rows
            for decision in decisions:
                writer.writerow([
                    str(decision.id),
                    decision.title,
                    decision.decision_statement,
                    decision.reasoning,
                    decision.expected_outcome,
                    decision.actual_outcome or "",
                    float(decision.confidence_score) if decision.confidence_score else "",
                    decision.status.value,
                    decision.department_id or "",
                    decision.project_id or "",
                    decision.created_by or "",
                    decision.created_at.isoformat() if decision.created_at else "",
                ])
            
            return output.getvalue()
            
        except Exception as e:
            logger.error(f"Error exporting to CSV: {str(e)}")
            return f"Error exporting data: {str(e)}"

    @staticmethod
    def export_to_json(
        db: Session,
        department_id: Optional[str] = None,
        include_summary: bool = True,
    ) -> str:
        """Export decisions and analytics to JSON format.
        
        Args:
            db: Database session
            department_id: Filter by department
            include_summary: Include executive summary
            
        Returns:
            JSON string data
        """
        try:
            export_data = {
                "exported_at": datetime.utcnow().isoformat(),
                "department_id": department_id,
            }
            
            if include_summary:
                export_data["summary"] = ReportService.generate_executive_summary(
                    db, department_id
                )
            
            # Add decision history
            history_report = ReportService.generate_decision_history_report(
                db, department_id
            )
            export_data["decisions"] = history_report.get("decisions", [])
            
            return json.dumps(export_data, indent=2, default=str)
            
        except Exception as e:
            logger.error(f"Error exporting to JSON: {str(e)}")
            return json.dumps({
                "error": str(e),
                "exported_at": datetime.utcnow().isoformat(),
            })


# Global report service instance
report_service = ReportService()
