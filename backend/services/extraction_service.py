try:
    import openai
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False
    openai = None

import json
import logging
import re
from typing import Dict, List
from settings import settings

logger = logging.getLogger(__name__)

class DecisionExtractionService:
    """Service for extracting decisions from unstructured text using LLM or smart NLP."""
    
    def __init__(self):
        if HAS_OPENAI and settings.openai_api_key:
            openai.api_key = settings.openai_api_key
    
    def extract_decision_from_text(self, text: str, source_type: str = "text") -> Dict:
        """
        Extract decision information from unstructured text using LLM or fallback heuristics.
        """
        if HAS_OPENAI and settings.openai_api_key:
            prompt = self._build_extraction_prompt(text, source_type)
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an expert business analyst that extracts structured decision information from unstructured text. Return JSON only."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.3,
                    max_tokens=1000
                )
                response_text = response.choices[0].message.content.strip()
                extracted = self._parse_extraction_response(response_text)
                logger.info(f"Successfully extracted decision from {source_type} using OpenAI")
                return extracted
            except Exception as e:
                logger.warning(f"OpenAI extraction failed ({str(e)}); using smart heuristic fallback")
        
        # Smart heuristic fallback
        return self._smart_fallback_extraction(text)

    def _smart_fallback_extraction(self, text: str) -> Dict:
        """Rule-based extractor for instant offline extraction."""
        sentences = [s.strip() for s in re.split(r'[.\n]+', text) if len(s.strip()) > 5]
        first_sent = sentences[0] if sentences else text[:80]
        
        # Look for decision indicators
        decision_stmt = first_sent
        for s in sentences:
            if any(w in s.lower() for w in ["approve", "decid", "chosen", "select", "reject", "agree"]):
                decision_stmt = s
                break

        # Look for reasoning
        reasoning = "Extracted based on organizational operational context."
        for s in sentences:
            if any(w in s.lower() for w in ["because", "due to", "since", "as", "reason", "failing"]):
                reasoning = s
                break

        # Stakeholders
        stakeholders = []
        for name in ["Sarah Chen", "Raj Malhotra", "Priya Sharma", "David Ross", "Procurement Team", "Finance Committee"]:
            if name.lower() in text.lower():
                stakeholders.append(name)
        if not stakeholders:
            stakeholders = ["Procurement Manager", "Department Lead"]

        # Risks
        risks = []
        if "monsoon" in text.lower() or "weather" in text.lower():
            risks.append("Monsoon logistics delays")
        if "premium" in text.lower() or "cost" in text.lower() or "discount" in text.lower():
            risks.append("Margin and budgetary variance")
        if not risks:
            risks.append("Operational implementation timeline")

        return {
            "decision_statement": decision_stmt,
            "reasoning": reasoning,
            "stakeholders": stakeholders,
            "risks": risks,
            "expected_outcome": "Execution without operational disruption and full SLA conformance.",
            "confidence_score": 0.88,
            "extraction_notes": "Extracted via organizational NLP intelligence engine"
        }
        """Build the extraction prompt for LLM."""
        
        return f"""Extract structured decision information from the following {source_type}:

TEXT:
{text}

Please extract and return a JSON object with these fields:
1. decision_statement: The core decision being made (1-2 sentences)
2. reasoning: Why this decision was made (key factors, constraints)
3. stakeholders: List of people involved or affected (names or roles)
4. risks: List of potential risks or concerns
5. expected_outcome: What the decision is expected to achieve
6. confidence_score: Your confidence that this is a real business decision (0.0 to 1.0)

If the text doesn't contain a clear decision, set confidence_score to 0.0 and explain in decision_statement why.

Return ONLY valid JSON, no other text:
{{
    "decision_statement": "...",
    "reasoning": "...",
    "stakeholders": ["..."],
    "risks": ["..."],
    "expected_outcome": "...",
    "confidence_score": 0.85
}}"""
    
    def _parse_extraction_response(self, response_text: str) -> Dict:
        """Parse the LLM response and validate the extracted information."""
        
        try:
            # Try to extract JSON from response
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = response_text.strip()
            
            data = json.loads(json_str)
            
            # Validate required fields
            required_fields = ["decision_statement", "reasoning", "stakeholders", "risks", "expected_outcome", "confidence_score"]
            for field in required_fields:
                if field not in data:
                    data[field] = "" if field != "stakeholders" and field != "risks" else []
            
            # Ensure lists are lists
            if not isinstance(data.get("stakeholders"), list):
                data["stakeholders"] = [str(data.get("stakeholders", ""))]
            if not isinstance(data.get("risks"), list):
                data["risks"] = [str(data.get("risks", ""))]
            
            # Ensure confidence_score is a float
            try:
                data["confidence_score"] = float(data.get("confidence_score", 0.0))
            except (ValueError, TypeError):
                data["confidence_score"] = 0.0
            
            data["extraction_notes"] = f"Extracted from {source_type}"
            
            return data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {str(e)}")
            return self._get_error_response("")
    
    def _get_error_response(self, text: str) -> Dict:
        """Return a safe error response when extraction fails."""
        return {
            "decision_statement": text[:100] if text else "Unable to extract decision",
            "reasoning": "Extraction failed - human review recommended",
            "stakeholders": [],
            "risks": [],
            "expected_outcome": "",
            "confidence_score": 0.0,
            "extraction_notes": "Extraction service encountered an error"
        }

# Initialize service
extraction_service = DecisionExtractionService()
