import openai
import json
import logging
from typing import Dict, List
from settings import settings

logger = logging.getLogger(__name__)

class DecisionExtractionService:
    """Service for extracting decisions from unstructured text using LLM."""
    
    def __init__(self):
        openai.api_key = settings.openai_api_key
    
    def extract_decision_from_text(self, text: str, source_type: str = "text") -> Dict:
        """
        Extract decision information from unstructured text using LLM.
        
        Args:
            text: The input text (from email, meeting, report, etc.)
            source_type: Type of source (email, meeting, chat, report)
        
        Returns:
            Dictionary with extracted decision information
        """
        
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
            
            # Parse the response
            response_text = response.choices[0].message.content.strip()
            
            # Try to extract JSON from the response
            extracted = self._parse_extraction_response(response_text)
            
            logger.info(f"Successfully extracted decision from {source_type}")
            return extracted
            
        except Exception as e:
            logger.error(f"Error extracting decision: {str(e)}")
            # Return a safe default response
            return self._get_error_response(text)
    
    def _build_extraction_prompt(self, text: str, source_type: str) -> str:
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
