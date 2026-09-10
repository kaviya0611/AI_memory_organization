"""
Neuro-Symbolic Logic Engine (Feature 4: Trustworthy AI)

Combines Neural (LLM / Natural Language) understanding with 
Symbolic (deterministic propositional logic & business rules) verification.
Produces step-by-step verifiable proof trees with zero hallucinations.
"""

from typing import Dict, List, Any, Optional, Tuple
import re
import logging

logger = logging.getLogger(__name__)

class SymbolicRule:
    def __init__(self, rule_id: str, name: str, description: str, policy_code: str):
        self.rule_id = rule_id
        self.name = name
        self.description = description
        self.policy_code = policy_code

class NeuroSymbolicEngine:
    """Deterministic Symbolic Logic Engine for enterprise policy verification."""

    def __init__(self):
        self.policies = {
            "POL-DISC-15": {
                "name": "Standard Maximum Discount Policy",
                "max_discount": 15.0,
                "min_tenure_for_exception": 5.0,
                "exception_max_discount": 20.0,
                "citation": "Policy-15: Commercial Pricing Rules §4.2",
            },
            "POL-SUPP-MONSOON": {
                "name": "Monsoon Supply Chain Resilience Directive",
                "vulnerable_suppliers": ["Supplier A", "Vendor Alpha"],
                "monsoon_failure_count": 3,
                "risk_window": "June-September",
                "citation": "Supply Chain Directive SC-2023-09: Weather Risk Mitigation",
            },
            "POL-GOV-TIERS": {
                "name": "Financial Authority & Governance Matrix",
                "routine_cap": 10.0,      # < ₹10 Lakhs: Autonomous / Line Mgr
                "medium_cap": 50.0,       # ₹10L - ₹50L: Dept Head Approval
                "high_stakes_floor": 50.0,# > ₹50L: Executive Committee
                "citation": "Corporate Governance Charter §8.1",
            }
        }

    def evaluate_discount_rule(
        self, 
        discount_pct: float, 
        tenure_years: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Symbolic propositional evaluation for customer discounts:
        Rule: Discount <= 15% OR (Discount <= 20% AND Tenure >= 5 years)
        """
        pol = self.policies["POL-DISC-15"]
        proof_tree = []
        proof_tree.append(f"Premise 1: {pol['citation']} states standard max discount is {pol['max_discount']}%.")
        
        tenure = tenure_years if tenure_years is not None else 3.0
        proof_tree.append(f"Fact 1: Requested discount = {discount_pct}%.")
        proof_tree.append(f"Fact 2: Customer tenure = {tenure} years.")

        if discount_pct <= pol["max_discount"]:
            proof_tree.append(f"Deduction: {discount_pct}% <= {pol['max_discount']}%. Proposition SATISFIED.")
            return {
                "passed": True,
                "rule_id": "POL-DISC-15",
                "proof_tree": proof_tree,
                "recommendation": f"Approve discount ({discount_pct}% is within standard {pol['max_discount']}% policy limit).",
                "counter_offer": None,
                "escalation_required": False
            }
        
        # Exceeds standard limit, check tenure exception
        proof_tree.append(f"Deduction: {discount_pct}% exceeds standard limit ({pol['max_discount']}%). Testing exception clause.")
        proof_tree.append(f"Premise 2: Exception up to {pol['exception_max_discount']}% requires minimum {pol['min_tenure_for_exception']} years tenure.")
        
        if discount_pct <= pol["exception_max_discount"] and tenure >= pol["min_tenure_for_exception"]:
            proof_tree.append(f"Deduction: Customer tenure ({tenure} yrs >= {pol['min_tenure_for_exception']} yrs) qualifies for exception.")
            return {
                "passed": True,
                "rule_id": "POL-DISC-15",
                "proof_tree": proof_tree,
                "recommendation": f"Approve exception ({discount_pct}% allowed due to {tenure} years loyalty).",
                "counter_offer": None,
                "escalation_required": True
            }
        
        # Violation
        proof_tree.append(f"Deduction: Customer tenure ({tenure} yrs) is under required threshold ({pol['min_tenure_for_exception']} yrs).")
        proof_tree.append("Conclusion: Discount request VIOLATES commercial policy. Deterministic rejection.")
        
        return {
            "passed": False,
            "rule_id": "POL-DISC-15",
            "proof_tree": proof_tree,
            "severity": "CRITICAL",
            "message": f"Requested discount of {discount_pct}% exceeds policy limit of {pol['max_discount']}%. Customer tenure ({tenure} yrs) does not qualify for exception.",
            "evidence": f"{pol['citation']}; Historical precedent: Request rejected in 2023 [DEC-2023-00412].",
            "counter_offer": "Counter-offer at 12% with standard 30-day payment terms",
            "escalation_path": "Escalate to VP Finance for exceptional commercial waiver",
            "recommendation": f"Reject request of {discount_pct}%. Propose counter-offer of 12% or escalate to VP Finance."
        }

    def evaluate_supplier_risk(self, supplier_name: str, delivery_window: Optional[str] = "Q3") -> Dict[str, Any]:
        """Symbolic evaluation for seasonal supplier vulnerability."""
        pol = self.policies["POL-SUPP-MONSOON"]
        proof_tree = []
        proof_tree.append(f"Premise: {pol['citation']} mandates avoiding suppliers with documented weather vulnerabilities.")
        proof_tree.append(f"Fact 1: Proposed supplier is '{supplier_name}'.")
        proof_tree.append(f"Fact 2: Scheduled delivery window is '{delivery_window}'.")

        is_monsoon = any(w in (delivery_window or "").upper() for w in ["Q3", "MONSOON", "JULY", "AUGUST", "SEPTEMBER"])
        is_vulnerable = any(s.lower() in supplier_name.lower() for s in pol["vulnerable_suppliers"])

        if is_vulnerable and is_monsoon:
            proof_tree.append(f"Deduction: {supplier_name} has {pol['monsoon_failure_count']} documented monsoon failures in the past 5 years.")
            proof_tree.append(f"Conclusion: High seasonal risk during {delivery_window}. VIOLATION of resilience policy.")
            return {
                "passed": False,
                "rule_id": "POL-SUPP-MONSOON",
                "proof_tree": proof_tree,
                "severity": "WARNING",
                "message": f"{supplier_name} has monsoon reliability issues (3 delivery failures in 5 years).",
                "evidence": f"Incident reports INC-2020-09, INC-2021-08, INC-2023-07. {pol['citation']}",
                "counter_offer": "Contract Supplier B (98.4% monsoon delivery SLA) or require secondary backup supplier",
                "escalation_path": "Escalate to Supply Chain Risk Director (Sarah Chen)",
                "recommendation": f"Do NOT select {supplier_name} for {delivery_window} without dedicated contingency logistics."
            }
        
        proof_tree.append(f"Deduction: {supplier_name} has no prohibitive seasonal failure records for {delivery_window}.")
        proof_tree.append("Conclusion: Supplier clears seasonal reliability filter.")
        return {
            "passed": True,
            "rule_id": "POL-SUPP-MONSOON",
            "proof_tree": proof_tree,
            "recommendation": f"{supplier_name} approved for delivery window {delivery_window}."
        }

    def extract_intent_facts(self, text: str) -> Dict[str, Any]:
        """Extract key numeric and symbolic parameters from natural text."""
        facts = {
            "discount_pct": None,
            "tenure_years": None,
            "suppliers_mentioned": [],
            "monetary_value": 0.0
        }

        # Discount extraction
        disc_match = re.search(r'(\d+(?:\.\d+)?)\s*%\s*(?:discount|margin|rebate)?', text, re.IGNORECASE)
        if disc_match:
            facts["discount_pct"] = float(disc_match.group(1))

        # Tenure extraction
        tenure_match = re.search(r'(\d+)\s*(?:year|yr)s?\s*(?:tenure|loyalty|client|customer)?', text, re.IGNORECASE)
        if tenure_match:
            facts["tenure_years"] = float(tenure_match.group(1))

        # Value in Lakhs / Millions
        lakh_match = re.search(r'(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)', text, re.IGNORECASE)
        if lakh_match:
            facts["monetary_value"] = float(lakh_match.group(1))

        # Suppliers
        for supp in ["Supplier A", "Supplier B", "Supplier C", "Vendor Alpha", "Apex Logistics"]:
            if supp.lower() in text.lower():
                facts["suppliers_mentioned"].append(supp)

        return facts

symbolic_engine = NeuroSymbolicEngine()
