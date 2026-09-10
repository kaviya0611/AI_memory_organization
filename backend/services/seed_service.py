"""
Enterprise Seed Service

Pre-populates organizational memory with realistic scenarios,
specifically enabling Priya's Procurement Journey, Project Phoenix Replay,
Customer Y Guardrail Checks, Dead Ends, and Cross-Department Dependencies.
"""

from sqlalchemy.orm import Session
from models import Decision, DecisionStatus, DeadEnd, DepartmentDependency, AuditLogEntry, TrustTier, GovernanceLevel
from datetime import datetime, timedelta
import json
import uuid
import logging

logger = logging.getLogger(__name__)

def seed_enterprise_data(db: Session, force: bool = False):
    """Populates the database with foundational enterprise memory."""
    existing_count = db.query(Decision).count()
    if existing_count > 0 and not force:
        logger.info(f"Database already contains {existing_count} decisions. Skipping auto-seed.")
        return

    logger.info("🌱 Seeding enterprise organizational memory...")

    # Clear existing if force
    if force:
        db.query(Decision).delete()
        db.query(DeadEnd).delete()
        db.query(DepartmentDependency).delete()
        db.query(AuditLogEntry).delete()
        db.commit()

    now = datetime.utcnow()

    # 1. Supplier B Approval (Decision Memory Showcase)
    dec_supplier_b = Decision(
        id=uuid.uuid4(),
        title="Approved Supplier B for Q3 Critical Components",
        description="Comprehensive supplier evaluation and award for Q3 monsoon manufacturing cycle.",
        decision_statement="Approved Supplier B because Supplier A had monsoon reliability issues (3 failures in 5 years), Supplier C was a known dead end (2021 quality failure), and budget allowed for the 12% premium.",
        reasoning="Supplier B provides 98.4% on-time delivery during monsoon months and operates dual regional hubs. Although priced at a 12% premium over Supplier A, the avoided risk of downtime (estimated at ₹35L per day) heavily justifies the investment.",
        stakeholders=json.dumps(["Sarah Chen (Supply Chain)", "Raj Malhotra (Finance)", "Priya Sharma (Operations)"]),
        risks=json.dumps(["12% cost premium relative to unvetted market rates", "Initial onboarding lead time of 10 days"]),
        expected_outcome="Zero delivery disruptions during monsoon with 98% quality conformance.",
        actual_outcome="Delivered 100% on time, zero defects during peak monsoon. Performance SLA fully met.",
        project_id="PROJ-SUPPLY-2024",
        department_id="Procurement",
        created_by="Sarah Chen",
        created_at=now - timedelta(days=120),
        confidence_score=0.92,
        status=DecisionStatus.APPROVED,
        extraction_notes="Extracted from Q1 Executive Procurement Committee Review",
        
        # Decision Memory fields
        triggers="Rising logistics failure rate during monsoon season & annual contract expiration.",
        constraints=json.dumps([
            "Budget cap: ₹60 Lakhs",
            "Delivery deadline: Before monsoon onset (July 15)",
            "Minimum 95% on-time delivery SLA"
        ]),
        alternatives_considered=json.dumps(["Supplier A", "Supplier B", "Supplier C"]),
        rejected_reasons=json.dumps({
            "Supplier A": "Monsoon reliability issues (3 delivery failures in 5 years: INC-2020-09, INC-2021-08, INC-2023-07).",
            "Supplier C": "Known organizational dead end (2021 quality failure with 40% defect rate, ₹25 lakh failure cost)."
        }),
        assumptions=json.dumps([
            "Budget allows for the 12% quality premium",
            "Monsoon season arrives in early July",
            "Production volume stabilizes at 2,000 units/week"
        ]),
        evidence_links=json.dumps([
            "DEC-2021-00334",
            "DEC-2021-00456",
            "Policy-15: Pricing Rules",
            "INC-2023-07: Supplier A Delay Audit"
        ]),
        valid_from=now - timedelta(days=120),
        valid_until=now + timedelta(days=240),
        decay_rate=0.03,
        is_expired=False,
        trust_tier=TrustTier.HUMAN_CONFIRMED.value,
        monetary_value=48.0,
        governance_level=GovernanceLevel.MEDIUM.value,
        approval_chain=json.dumps([
            {"actor": "Sarah Chen", "action": "PROPOSED", "time": (now - timedelta(days=122)).isoformat()},
            {"actor": "Raj Malhotra", "action": "FINANCE_RATIFIED", "time": (now - timedelta(days=121)).isoformat()},
            {"actor": "VP Procurement", "action": "FINAL_APPROVAL", "time": (now - timedelta(days=120)).isoformat()}
        ])
    )

    # 2. Historical Supplier A Decision (Temporal Validity Showcase - Expired)
    dec_supplier_a_old = Decision(
        id=uuid.uuid4(),
        title="Supplier A Sole Source Contract (2018)",
        description="Historical vendor selection for generic hardware parts.",
        decision_statement="Approved Supplier A as primary supplier based on lowest bid pricing.",
        reasoning="Supplier A offered lowest per-unit unit cost with acceptable lead times.",
        stakeholders=json.dumps(["Legacy Procurement Team"]),
        risks=json.dumps(["Single point of failure during severe weather"]),
        expected_outcome="Reduce annual component expenditure by 18%.",
        actual_outcome="Initial savings achieved, but subsequently suffered 3 catastrophic delivery halts during monsoon.",
        project_id="HIST-VENDOR-2018",
        department_id="Procurement",
        created_by="Former Manager",
        created_at=now - timedelta(days=1800),
        confidence_score=0.45,
        status=DecisionStatus.APPROVED,
        valid_from=now - timedelta(days=1800),
        valid_until=now - timedelta(days=730),  # Expired 2 years ago
        decay_rate=0.10,
        is_expired=True,
        trust_tier=TrustTier.RAW_SOURCE.value,
        monetary_value=32.0,
        governance_level=GovernanceLevel.MEDIUM.value
    )

    # 3. Project Phoenix (Decision Replay Showcase)
    dec_project_phoenix = Decision(
        id=uuid.uuid4(),
        title="Project Phoenix Warehouse Automation Launch",
        description="Fast-track deployment of automated sorting systems across Western distribution centers.",
        decision_statement="Approved direct nationwide rollout of Project Phoenix automation without a regional pilot.",
        reasoning="Executive directive to leapfrog competitors and cut fulfillment latency before Q4 peak sales.",
        stakeholders=json.dumps(["David Ross (VP Ops)", "Anita Patel (Logistics)", "Kavita Rao (Engineering)"]),
        risks=json.dumps(["Integration mismatch with legacy ERP", "Vendor capacity limits under high throughput"]),
        expected_outcome="35% increase in order throughput and 50% labor cost reduction.",
        actual_outcome="Project failed. System crashed on Day 28 due to unvalidated firmware. Total loss: ₹42 Lakhs, 6 weeks of delayed customer deliveries.",
        project_id="PROJ-PHOENIX-2023",
        department_id="Operations",
        created_by="David Ross",
        created_at=now - timedelta(days=400),
        confidence_score=0.30,
        status=DecisionStatus.APPROVED,
        triggers="Competitive pressure and executive urgency.",
        constraints=json.dumps(["Launch deadline fixed to September 30", "No budget for parallel pilot"]),
        alternatives_considered=json.dumps(["Full Immediate Rollout", "90-Day Phased Regional Pilot", "Hybrid Manual Automation"]),
        rejected_reasons=json.dumps({
            "90-Day Phased Regional Pilot": "Rejected due to executive time pressure to meet Q4 launch deadline.",
            "Hybrid Manual Automation": "Deemed insufficiently transformative."
        }),
        assumptions=json.dumps([
            "Customer demand will grow +15% (actual: -5%)",
            "Supplier automated sorting hardware can scale without custom firmware (actual: couldn't)",
            "Staff can adapt to automated software in 48 hours without specialized training (actual: high operator errors)"
        ]),
        evidence_links=json.dumps(["PHX-EXEC-DIR-2023", "ERP-SPEC-V2", "POST-MORTEM-PHOENIX-REPORT"]),
        valid_from=now - timedelta(days=400),
        valid_until=now + timedelta(days=100),
        trust_tier=TrustTier.HUMAN_CONFIRMED.value,
        monetary_value=85.0,
        governance_level=GovernanceLevel.HIGH_STAKES.value
    )

    # 4. Customer Y Discount Request (Neuro-Symbolic & Guardrails Showcase)
    dec_customer_y = Decision(
        id=uuid.uuid4(),
        title="Special Pricing Request: Customer Y 20% Discount",
        description="High-value client requesting 20% discount on Q3 bulk procurement.",
        decision_statement="Proposal to approve 20% volume discount for Customer Y on an 800-unit bulk order.",
        reasoning="Customer Y is a strategic account requesting matching competitor pricing.",
        stakeholders=json.dumps(["Regional Sales Director", "Account Executive"]),
        risks=json.dumps(["EBITDA margin dilution", "Precedent for other Tier-2 clients"]),
        expected_outcome="Secure 800-unit contract and achieve quarterly sales target.",
        actual_outcome=None,
        project_id="SALES-DEAL-2024",
        department_id="Sales",
        created_by="Sales Executive",
        created_at=now - timedelta(days=3),
        confidence_score=0.55,
        status=DecisionStatus.PENDING_REVIEW,
        triggers="Competitor offering price discount on similar SKUs.",
        constraints=json.dumps(["Policy-15 limits standard discount to 15%", "Customer tenure is 3 years"]),
        alternatives_considered=json.dumps(["Approve 20% Request", "Counter-offer at 12%", "Escalate to VP Finance for waiver"]),
        rejected_reasons=json.dumps({
            "Counter-offer at 12%": "Account executive feared customer would walk away."
        }),
        assumptions=json.dumps(["Customer will commit to immediate payment in 15 days"]),
        evidence_links=json.dumps(["Policy-15: Commercial Pricing", "DEC-2023-00412: Rejected 20% Discount Precedent"]),
        trust_tier=TrustTier.AI_DERIVED.value,
        monetary_value=24.0,
        governance_level=GovernanceLevel.MEDIUM.value
    )

    # 5. Dead Ends Repository
    dead_end_supplier_c = DeadEnd(
        id=uuid.uuid4(),
        topic="Supplier C - Precision Electronics & Resins",
        attempted_solution="Awarded Supplier C exclusive supply contract for automated assembly components",
        root_cause_of_failure="40% defect rate in automated assembly line due to uncalibrated tooling and lack of ISO 9001 certified QA processes.",
        cost_of_failure="₹25 lakh + 3 weeks manufacturing downtime",
        retry_conditions="Do NOT retry unless Supplier C provides ISO 9001 certification and a certified third-party QA audit report.",
        do_not_retry=True,
        failure_date="2021-06",
        department_id="Procurement",
        created_at=now - timedelta(days=1100)
    )

    dead_end_pilot = DeadEnd(
        id=uuid.uuid4(),
        topic="Warehouse Infrastructure Migration without Pilot",
        attempted_solution="Full direct deployment of mission-critical sorting infrastructure across all hubs simultaneously",
        root_cause_of_failure="Hardware and protocol synchronization failures under peak concurrency load (Project Phoenix).",
        cost_of_failure="₹42 lakh",
        retry_conditions="Do NOT retry under any circumstances. All operational infrastructure transitions must complete a 60-day isolated pilot.",
        do_not_retry=True,
        failure_date="2023-03",
        department_id="Operations",
        created_at=now - timedelta(days=380)
    )

    # 6. Department Dependencies (Cross-Department Connections Showcase)
    dep_sales_supply = DepartmentDependency(
        id=uuid.uuid4(),
        source_department="Sales",
        target_department="Supply Chain",
        title="Customer Order Commitment vs Finished Goods Inventory",
        description="Sales commitments on bulk delivery must verify physical warehouse inventory before contract execution.",
        current_metric="Current available finished goods inventory: 500 units",
        constraint_limit="Maximum immediate commitment: 500 units without 3-week replenishment lead time",
        conflict_condition="Order volume > 500 units without confirmed replenishment schedule",
        is_active=True,
        created_at=now - timedelta(days=180)
    )

    dep_sales_finance = DepartmentDependency(
        id=uuid.uuid4(),
        source_department="Sales",
        target_department="Finance",
        title="Commercial Discount Margin Floor Protection",
        description="Any sales discount exceeding 15% directly erodes divisional EBITDA target below the 22% statutory threshold.",
        current_metric="Divisional blended margin target: 24.5%",
        constraint_limit="Minimum transaction margin: 20%",
        conflict_condition="Discount > 15% for customers with tenure < 5 years",
        is_active=True,
        created_at=now - timedelta(days=180)
    )

    dep_ops_sales = DepartmentDependency(
        id=uuid.uuid4(),
        source_department="Operations",
        target_department="Sales",
        title="Fulfillment Lead-Time Commitments",
        description="Sales commitments of <7 business day delivery require expedited logistics approval from Operations.",
        current_metric="Standard logistics SLA: 12-14 business days",
        constraint_limit="Minimum standard turnaround: 10 business days",
        conflict_condition="Customer promised delivery in under 7 days",
        is_active=True,
        created_at=now - timedelta(days=180)
    )

    # Add all entities
    db.add_all([
        dec_supplier_b,
        dec_supplier_a_old,
        dec_project_phoenix,
        dec_customer_y,
        dead_end_supplier_c,
        dead_end_pilot,
        dep_sales_supply,
        dep_sales_finance,
        dep_ops_sales
    ])
    db.commit()

    logger.info("✅ Enterprise seed data successfully generated!")

