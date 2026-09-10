from neo4j_db import neo4j_conn
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class GraphService:
    """Service for managing knowledge graph operations in Neo4j."""
    
    @staticmethod
    def sync_decision_to_graph(decision_id: str, decision_data: Dict) -> bool:
        """
        Sync a decision from PostgreSQL to Neo4j graph.
        
        Creates:
        - Decision node
        - Links to Project, Department, Stakeholders
        """
        if not neo4j_conn.is_connected():
            logger.warning("Neo4j not connected, skipping graph sync")
            return False
        
        try:
            session = neo4j_conn.get_session()
            
            # Create Decision node
            query = """
            MERGE (d:Decision {id: $decision_id})
            SET d.title = $title,
                d.decision_statement = $decision_statement,
                d.reasoning = $reasoning,
                d.expected_outcome = $expected_outcome,
                d.confidence_score = $confidence_score,
                d.status = $status,
                d.created_at = $created_at
            RETURN d
            """
            
            session.run(
                query,
                decision_id=decision_id,
                title=decision_data.get("title", ""),
                decision_statement=decision_data.get("decision_statement", ""),
                reasoning=decision_data.get("reasoning", ""),
                expected_outcome=decision_data.get("expected_outcome", ""),
                confidence_score=float(decision_data.get("confidence_score", 0.0)),
                status=decision_data.get("status", "pending_review"),
                created_at=str(decision_data.get("created_at", ""))
            )
            
            # Link to Department
            if decision_data.get("department_id"):
                dept_query = """
                MATCH (d:Decision {id: $decision_id})
                MERGE (dept:Department {id: $dept_id})
                MERGE (d)-[:IN_DEPARTMENT]->(dept)
                """
                session.run(
                    dept_query,
                    decision_id=decision_id,
                    dept_id=decision_data["department_id"]
                )
            
            # Link to Project
            if decision_data.get("project_id"):
                proj_query = """
                MATCH (d:Decision {id: $decision_id})
                MERGE (p:Project {id: $project_id})
                MERGE (d)-[:FOR_PROJECT]->(p)
                """
                session.run(
                    proj_query,
                    decision_id=decision_id,
                    project_id=decision_data["project_id"]
                )
            
            # Link to Stakeholders
            if decision_data.get("stakeholders"):
                for stakeholder in decision_data["stakeholders"]:
                    if stakeholder:
                        stake_query = """
                        MATCH (d:Decision {id: $decision_id})
                        MERGE (s:Stakeholder {name: $name})
                        MERGE (d)-[:INVOLVES]->(s)
                        """
                        session.run(
                            stake_query,
                            decision_id=decision_id,
                            name=stakeholder
                        )
            
            session.close()
            logger.info(f"✅ Synced decision {decision_id} to graph")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error syncing decision to graph: {str(e)}")
            return False
    
    @staticmethod
    def get_similar_decisions(decision_id: str, limit: int = 5) -> List[Dict]:
        """
        Get similar decisions from the graph.
        Uses semantic similarity or co-occurrence patterns.
        """
        if not neo4j_conn.is_connected():
            logger.warning("Neo4j not connected, no similar decisions available")
            return []
        
        try:
            session = neo4j_conn.get_session()
            
            # Find decisions that share stakeholders or departments
            query = """
            MATCH (d:Decision {id: $decision_id})
            MATCH (d)-[:IN_DEPARTMENT|:INVOLVES|:FOR_PROJECT]-(shared)
            MATCH (other:Decision)-[:IN_DEPARTMENT|:INVOLVES|:FOR_PROJECT]-(shared)
            WHERE other.id <> d.id
            RETURN DISTINCT other.id as id, other.title as title, 
                           other.decision_statement as decision_statement,
                           COUNT(shared) as similarity_score
            ORDER BY similarity_score DESC
            LIMIT $limit
            """
            
            result = session.run(query, decision_id=decision_id, limit=limit)
            
            similar = []
            for record in result:
                similar.append({
                    "id": record["id"],
                    "title": record["title"],
                    "decision_statement": record["decision_statement"],
                    "similarity_score": record["similarity_score"]
                })
            
            session.close()
            return similar
            
        except Exception as e:
            logger.error(f"❌ Error getting similar decisions: {str(e)}")
            return []
    
    @staticmethod
    def get_department_stats(department_id: str) -> Dict:
        """Get statistics for a department's decisions."""
        if not neo4j_conn.is_connected():
            return {}
        
        try:
            session = neo4j_conn.get_session()
            
            query = """
            MATCH (d:Decision)-[:IN_DEPARTMENT]->(dept:Department {id: $dept_id})
            RETURN COUNT(d) as total_decisions,
                   COLLECT(d.status) as statuses,
                   AVG(d.confidence_score) as avg_confidence
            """
            
            result = session.run(query, dept_id=department_id)
            record = result.single()
            
            session.close()
            
            if record:
                return {
                    "total_decisions": record["total_decisions"],
                    "average_confidence": round(record["avg_confidence"] or 0, 2),
                    "statuses": record["statuses"]
                }
            return {}
            
        except Exception as e:
            logger.error(f"❌ Error getting department stats: {str(e)}")
            return {}
    
    @staticmethod
    def create_outcome_relationship(decision_id: str, outcome_text: str) -> bool:
        """Link an outcome to a decision."""
        if not neo4j_conn.is_connected():
            return False
        
        try:
            session = neo4j_conn.get_session()
            
            query = """
            MATCH (d:Decision {id: $decision_id})
            MERGE (o:Outcome {id: $outcome_id})
            SET o.text = $outcome_text
            MERGE (d)-[:RESULTED_IN]->(o)
            """
            
            outcome_id = f"{decision_id}_outcome"
            session.run(
                query,
                decision_id=decision_id,
                outcome_id=outcome_id,
                outcome_text=outcome_text
            )
            
            session.close()
            logger.info(f"✅ Linked outcome to decision {decision_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error creating outcome relationship: {str(e)}")
            return False
    
    @staticmethod
    def get_memory_score(organization_id: str = "global") -> Dict:
        """
        Calculate organizational memory score based on:
        - Number of decisions captured
        - Outcomes recorded
        - Reuse of past decisions
        """
        if not neo4j_conn.is_connected():
            return {"score": 0, "details": "Neo4j not available"}
        
        try:
            session = neo4j_conn.get_session()
            
            # Get decision statistics
            query = """
            MATCH (d:Decision)
            RETURN COUNT(d) as total_decisions,
                   COUNT(d)-[RESULTED_IN]->() as decisions_with_outcomes,
                   AVG(d.confidence_score) as avg_confidence
            """
            
            result = session.run(query)
            record = result.single()
            
            session.close()
            
            if record and record["total_decisions"] > 0:
                total = record["total_decisions"]
                with_outcomes = record["decisions_with_outcomes"] or 0
                avg_confidence = record["avg_confidence"] or 0
                
                # Score calculation
                outcome_ratio = (with_outcomes / total) * 100 if total > 0 else 0
                memory_score = (outcome_ratio * 0.5) + (avg_confidence * 50)
                
                return {
                    "score": round(memory_score, 1),
                    "total_decisions": total,
                    "decisions_with_outcomes": with_outcomes,
                    "outcome_tracking_rate": round(outcome_ratio, 1),
                    "average_confidence": round(avg_confidence, 2)
                }
            
            return {"score": 0, "total_decisions": 0}
            
        except Exception as e:
            logger.error(f"❌ Error calculating memory score: {str(e)}")
            return {"score": 0, "error": str(e)}

# Initialize service
graph_service = GraphService()
