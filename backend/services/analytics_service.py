"""Advanced analytics service for decision insights and trends."""

from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from models import Decision, DecisionStatus
import logging
from enum import Enum

logger = logging.getLogger(__name__)


class TimePeriod(str, Enum):
    """Time period options for trend analysis."""
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    YEAR = "year"


class AnalyticsService:
    """Service for advanced decision analytics and insights."""

    @staticmethod
    def get_decision_trends(
        db: Session,
        period: TimePeriod = TimePeriod.MONTH,
        limit: int = 12,
    ) -> Dict:
        """Get decision creation trends over time.
        
        Args:
            db: Database session
            period: Time period for grouping (week, month, quarter, year)
            limit: Number of periods to return
            
        Returns:
            Dictionary with trend data and timestamps
        """
        try:
            now = datetime.utcnow()
            
            # Calculate period boundaries
            if period == TimePeriod.WEEK:
                delta = timedelta(weeks=1)
                period_format = "%Y-W%U"  # ISO week
            elif period == TimePeriod.MONTH:
                delta = timedelta(days=30)
                period_format = "%Y-%m"
            elif period == TimePeriod.QUARTER:
                delta = timedelta(days=91)
                period_format = "%Y-Q"
            else:  # YEAR
                delta = timedelta(days=365)
                period_format = "%Y"
            
            # Get decisions from the requested time range
            start_date = now - (delta * limit)
            
            decisions = db.query(
                func.date_trunc(period.value, Decision.created_at).label("period"),
                func.count(Decision.id).label("count"),
                func.sum(
                    func.cast(
                        Decision.actual_outcome.isnot(None),
                        func.INTEGER
                    )
                ).label("with_outcomes"),
                func.avg(Decision.confidence_score).label("avg_confidence"),
            ).filter(
                Decision.created_at >= start_date,
                Decision.status != DecisionStatus.ARCHIVED
            ).group_by("period").order_by("period").all()
            
            trends = {
                "periods": [],
                "total_decisions": [],
                "decisions_with_outcomes": [],
                "avg_confidence_per_period": [],
                "outcome_rate_per_period": [],
                "time_period": period.value,
            }
            
            for row in decisions:
                period_str = row.period.strftime(period_format) if row.period else "unknown"
                with_outcomes = row.with_outcomes or 0
                total = row.count or 1  # Avoid division by zero
                
                trends["periods"].append(period_str)
                trends["total_decisions"].append(row.count)
                trends["decisions_with_outcomes"].append(with_outcomes)
                trends["avg_confidence_per_period"].append(
                    float(row.avg_confidence) if row.avg_confidence else 0.0
                )
                trends["outcome_rate_per_period"].append(
                    round((with_outcomes / total) * 100, 1)
                )
            
            return trends
            
        except Exception as e:
            logger.error(f"Error calculating decision trends: {str(e)}")
            return {
                "periods": [],
                "total_decisions": [],
                "decisions_with_outcomes": [],
                "avg_confidence_per_period": [],
                "outcome_rate_per_period": [],
                "error": str(e),
            }

    @staticmethod
    def get_success_rate(
        db: Session,
        department_id: Optional[str] = None,
        status_filter: Optional[DecisionStatus] = None,
    ) -> Dict:
        """Calculate success rate metrics.
        
        Args:
            db: Database session
            department_id: Filter by specific department
            status_filter: Filter by decision status
            
        Returns:
            Dictionary with success rate metrics
        """
        try:
            query = db.query(Decision).filter(Decision.status != DecisionStatus.ARCHIVED)
            
            if department_id:
                query = query.filter(Decision.department_id == department_id)
            
            if status_filter:
                query = query.filter(Decision.status == status_filter)
            
            all_decisions = query.all()
            total = len(all_decisions)
            
            if total == 0:
                return {
                    "total_decisions": 0,
                    "with_outcomes": 0,
                    "success_rate": 0.0,
                    "avg_confidence": 0.0,
                    "pending_outcomes": 0,
                }
            
            with_outcomes = sum(1 for d in all_decisions if d.actual_outcome)
            success_rate = (with_outcomes / total) * 100 if total > 0 else 0
            avg_confidence = sum(d.confidence_score or 0 for d in all_decisions) / total
            pending = total - with_outcomes
            
            return {
                "total_decisions": total,
                "with_outcomes": with_outcomes,
                "success_rate": round(success_rate, 1),
                "avg_confidence": round(avg_confidence, 2),
                "pending_outcomes": pending,
                "department_id": department_id,
                "status_filter": status_filter.value if status_filter else None,
            }
            
        except Exception as e:
            logger.error(f"Error calculating success rate: {str(e)}")
            return {
                "error": str(e),
                "total_decisions": 0,
                "with_outcomes": 0,
                "success_rate": 0.0,
            }

    @staticmethod
    def get_decision_comparison(
        db: Session,
        decision_id: str,
    ) -> Dict:
        """Compare expected vs actual outcome for a decision.
        
        Args:
            db: Database session
            decision_id: ID of decision to compare
            
        Returns:
            Dictionary with comparison data
        """
        try:
            decision = db.query(Decision).filter(Decision.id == decision_id).first()
            
            if not decision:
                return {
                    "error": "Decision not found",
                    "decision_id": decision_id,
                }
            
            comparison = {
                "decision_id": str(decision.id),
                "title": decision.title,
                "expected_outcome": decision.expected_outcome,
                "actual_outcome": decision.actual_outcome,
                "outcome_recorded": decision.actual_outcome is not None,
                "confidence_score": float(decision.confidence_score) if decision.confidence_score else 0.0,
                "created_at": decision.created_at.isoformat() if decision.created_at else None,
                "status": decision.status.value,
                "decision_statement": decision.decision_statement,
                "reasoning": decision.reasoning,
            }
            
            # Calculate time to outcome if available
            if decision.actual_outcome and decision.created_at:
                # Note: Would need actual_outcome_date in model for accurate calculation
                comparison["outcome_received"] = True
            
            return comparison
            
        except Exception as e:
            logger.error(f"Error comparing decision: {str(e)}")
            return {
                "error": str(e),
                "decision_id": decision_id,
            }

    @staticmethod
    def get_status_distribution(
        db: Session,
        department_id: Optional[str] = None,
    ) -> Dict:
        """Get distribution of decisions by status.
        
        Args:
            db: Database session
            department_id: Filter by specific department
            
        Returns:
            Dictionary with status distribution
        """
        try:
            query = db.query(
                Decision.status,
                func.count(Decision.id).label("count")
            ).filter(Decision.status != DecisionStatus.ARCHIVED).group_by(Decision.status)
            
            if department_id:
                query = query.filter(Decision.department_id == department_id)
            
            results = query.all()
            
            distribution = {
                "pending_review": 0,
                "approved": 0,
                "rejected": 0,
                "archived": 0,
                "total": 0,
            }
            
            for status, count in results:
                if status == DecisionStatus.PENDING_REVIEW:
                    distribution["pending_review"] = count
                elif status == DecisionStatus.APPROVED:
                    distribution["approved"] = count
                elif status == DecisionStatus.REJECTED:
                    distribution["rejected"] = count
                distribution["total"] += count
            
            return distribution
            
        except Exception as e:
            logger.error(f"Error getting status distribution: {str(e)}")
            return {
                "error": str(e),
                "total": 0,
            }

    @staticmethod
    def get_department_comparison(db: Session) -> Dict:
        """Compare metrics across all departments.
        
        Args:
            db: Database session
            
        Returns:
            Dictionary with department comparison data
        """
        try:
            departments = db.query(
                Decision.department_id,
                func.count(Decision.id).label("total"),
                func.sum(
                    func.cast(
                        Decision.actual_outcome.isnot(None),
                        func.INTEGER
                    )
                ).label("with_outcomes"),
                func.avg(Decision.confidence_score).label("avg_confidence"),
            ).filter(
                Decision.status != DecisionStatus.ARCHIVED
            ).group_by(Decision.department_id).all()
            
            comparison = {
                "departments": [],
                "total_decisions_per_dept": [],
                "outcomes_per_dept": [],
                "success_rate_per_dept": [],
                "avg_confidence_per_dept": [],
            }
            
            for dept_id, total, with_outcomes, avg_conf in departments:
                if dept_id is None:
                    dept_name = "Unassigned"
                else:
                    dept_name = dept_id
                
                with_outcomes = with_outcomes or 0
                success_rate = (with_outcomes / total * 100) if total > 0 else 0
                
                comparison["departments"].append(dept_name)
                comparison["total_decisions_per_dept"].append(total)
                comparison["outcomes_per_dept"].append(with_outcomes)
                comparison["success_rate_per_dept"].append(round(success_rate, 1))
                comparison["avg_confidence_per_dept"].append(round(float(avg_conf) if avg_conf else 0, 2))
            
            return comparison
            
        except Exception as e:
            logger.error(f"Error comparing departments: {str(e)}")
            return {
                "error": str(e),
                "departments": [],
            }

    @staticmethod
    def get_confidence_distribution(db: Session) -> Dict:
        """Get distribution of decisions by confidence score ranges.
        
        Args:
            db: Database session
            
        Returns:
            Dictionary with confidence distribution
        """
        try:
            all_decisions = db.query(Decision).filter(
                Decision.status != DecisionStatus.ARCHIVED
            ).all()
            
            confidence_ranges = {
                "90-100": 0,  # Very high
                "75-90": 0,   # High
                "50-75": 0,   # Medium
                "25-50": 0,   # Low
                "0-25": 0,    # Very low
                "total": len(all_decisions),
            }
            
            for decision in all_decisions:
                conf = (decision.confidence_score or 0) * 100  # Convert to percentage
                
                if conf >= 90:
                    confidence_ranges["90-100"] += 1
                elif conf >= 75:
                    confidence_ranges["75-90"] += 1
                elif conf >= 50:
                    confidence_ranges["50-75"] += 1
                elif conf >= 25:
                    confidence_ranges["25-50"] += 1
                else:
                    confidence_ranges["0-25"] += 1
            
            return confidence_ranges
            
        except Exception as e:
            logger.error(f"Error calculating confidence distribution: {str(e)}")
            return {"error": str(e)}


# Global analytics service instance
analytics_service = AnalyticsService()
