from sentence_transformers import SentenceTransformer, util
from typing import List, Dict, Tuple
import logging
import numpy as np

logger = logging.getLogger(__name__)

class RecommendationService:
    """Service for generating recommendations using semantic similarity."""
    
    def __init__(self):
        """Initialize the semantic similarity model."""
        try:
            # Use a lightweight model for fast inference
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("✅ Loaded semantic similarity model")
        except Exception as e:
            logger.error(f"❌ Failed to load semantic model: {str(e)}")
            self.model = None
    
    def encode_text(self, text: str) -> np.ndarray:
        """Encode text to embedding vector."""
        if not self.model:
            return None
        try:
            return self.model.encode(text, convert_to_tensor=True)
        except Exception as e:
            logger.error(f"❌ Error encoding text: {str(e)}")
            return None
    
    def find_similar_decisions(
        self,
        query_text: str,
        all_decisions: List[Dict],
        threshold: float = 0.3,
        limit: int = 5
    ) -> List[Dict]:
        """
        Find decisions similar to the query using semantic similarity.
        
        Args:
            query_text: Decision statement or reasoning to match
            all_decisions: List of all decisions to compare against
            threshold: Minimum similarity score (0.0-1.0)
            limit: Maximum number of results
        
        Returns:
            List of similar decisions with similarity scores
        """
        if not self.model or not all_decisions:
            return []
        
        try:
            # Encode query
            query_embedding = self.encode_text(query_text)
            if query_embedding is None:
                return []
            
            # Encode all decision statements
            similarities = []
            for decision in all_decisions:
                decision_text = (
                    f"{decision.get('title', '')} "
                    f"{decision.get('decision_statement', '')} "
                    f"{decision.get('reasoning', '')}"
                )
                
                decision_embedding = self.encode_text(decision_text)
                if decision_embedding is not None:
                    # Calculate cosine similarity
                    sim_score = util.pytorch_cos_sim(
                        query_embedding,
                        decision_embedding
                    ).item()
                    
                    if sim_score >= threshold:
                        similarities.append({
                            "id": decision.get("id"),
                            "title": decision.get("title"),
                            "decision_statement": decision.get("decision_statement"),
                            "reasoning": decision.get("reasoning"),
                            "expected_outcome": decision.get("expected_outcome"),
                            "actual_outcome": decision.get("actual_outcome"),
                            "status": decision.get("status"),
                            "similarity_score": round(float(sim_score), 3),
                            "created_at": decision.get("created_at")
                        })
            
            # Sort by similarity score (descending) and return top results
            similarities.sort(key=lambda x: x["similarity_score"], reverse=True)
            return similarities[:limit]
            
        except Exception as e:
            logger.error(f"❌ Error finding similar decisions: {str(e)}")
            return []
    
    def generate_recommendation(
        self,
        query_decision: Dict,
        similar_decisions: List[Dict]
    ) -> Dict:
        """
        Generate a recommendation based on similar past decisions.
        
        Args:
            query_decision: The current decision being made
            similar_decisions: Similar decisions from history
        
        Returns:
            Recommendation with insights and warnings
        """
        if not similar_decisions:
            return {
                "recommendation": "No similar past decisions found",
                "confidence": 0.0,
                "insights": [],
                "warnings": [],
                "lessons": []
            }
        
        try:
            best_match = similar_decisions[0]
            
            # Build recommendation insights
            insights = []
            warnings = []
            lessons = []
            
            # Check if best match has an outcome
            if best_match.get("actual_outcome"):
                insights.append(
                    f"Similar decision in past: '{best_match['title']}' "
                    f"resulted in: {best_match['actual_outcome']}"
                )
                
                # Compare expected vs actual
                if best_match.get("expected_outcome"):
                    lessons.append(
                        f"Expected: {best_match['expected_outcome']} "
                        f"| Actual: {best_match['actual_outcome']}"
                    )
            
            # Check decision status
            if best_match.get("status") == "archived":
                warnings.append("Similar decision was archived - may indicate issues")
            
            # Check stakeholder overlap (if available)
            if best_match.get("reasoning"):
                insights.append(
                    f"Past reasoning: {best_match['reasoning']}"
                )
            
            recommendation_text = (
                f"We have handled a similar situation before. "
                f"Your current decision is {best_match['similarity_score']*100:.1f}% "
                f"similar to '{best_match['title']}'. "
                f"Consider reviewing what actually happened with that decision."
            )
            
            return {
                "recommendation": recommendation_text,
                "confidence": best_match["similarity_score"],
                "similar_decision_id": best_match["id"],
                "similar_decision_title": best_match["title"],
                "insights": insights,
                "warnings": warnings,
                "lessons": lessons,
                "all_similar": similar_decisions
            }
            
        except Exception as e:
            logger.error(f"❌ Error generating recommendation: {str(e)}")
            return {
                "recommendation": "Error generating recommendation",
                "confidence": 0.0,
                "error": str(e)
            }
    
    def batch_encode_decisions(
        self,
        decisions: List[Dict]
    ) -> Dict[str, np.ndarray]:
        """
        Pre-encode all decisions for faster similarity searches.
        
        Returns:
            Dict mapping decision_id to embedding
        """
        if not self.model:
            return {}
        
        embeddings = {}
        for decision in decisions:
            try:
                text = (
                    f"{decision.get('title', '')} "
                    f"{decision.get('decision_statement', '')} "
                    f"{decision.get('reasoning', '')}"
                )
                embeddings[str(decision.get("id"))] = self.encode_text(text)
            except Exception as e:
                logger.error(f"❌ Error encoding decision: {str(e)}")
                continue
        
        return embeddings

# Initialize service
recommendation_service = RecommendationService()
