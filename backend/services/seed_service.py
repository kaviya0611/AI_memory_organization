"""
Enterprise Seed Service

Pre-populates organizational memory with realistic scenarios,
departments, projects, decisions, outcomes, evidence, lessons,
dead ends, and cross-department dependencies.
"""

from sqlalchemy.orm import Session
from models import (
    Decision, DecisionStatus, DeadEnd, DepartmentDependency, AuditLogEntry,
    TrustTier, GovernanceLevel, Department, Project, Outcome, Lesson,
    DecisionEvidence, DecisionAlternative
)
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
        db.query(Lesson).delete()
        db.query(Outcome).delete()
        db.query(DecisionAlternative).delete()
        db.query(DecisionEvidence).delete()
        db.query(Decision).delete()
        db.query(Project).delete()
        db.query(Department).delete()
        db.query(DeadEnd).delete()
        db.query(DepartmentDependency).delete()
        db.query(AuditLogEntry).delete()
        db.commit()

    now = datetime.utcnow()

    # -------------------------------------------------------------
    # 1. Departments
    # -------------------------------------------------------------
    dept_procurement = Department(id="Procurement", name="Global Procurement & Sourcing", code="PROC", description="Vendor evaluations, contract negotiations, and direct component sourcing.")
    dept_operations = Department(id="Operations", name="Global Operations & Logistics", code="OPS", description="Fulfillment, warehousing, distribution networks, and field services.")
    dept_engineering = Department(id="Engineering", name="Cloud & Software Engineering", code="ENG", description="Core infrastructure, developer platforms, and enterprise software.")
    dept_finance = Department(id="Finance", name="Corporate Finance & FP&A", code="FIN", description="Budgetary allocations, unit economics, margin protections, and treasury.")
    dept_sales = Department(id="Sales", name="Enterprise Sales & Commercial", code="SALES", description="Global enterprise client agreements and revenue operations.")
    dept_product = Department(id="Product", name="Product Management", code="PROD", description="Strategic roadmap, user experience, and feature delivery.")

    db.add_all([dept_procurement, dept_operations, dept_engineering, dept_finance, dept_sales, dept_product])
    db.commit()

    # -------------------------------------------------------------
    # 2. Projects
    # -------------------------------------------------------------
    proj_supply = Project(id="PROJ-SUPPLY-2024", name="Q3 Monsoon Component Supply Resilience", department_id="Procurement", description="Dual-sourcing critical electronics ahead of seasonal monsoons.")
    proj_phoenix = Project(id="PROJ-PHOENIX-2023", name="Project Phoenix Warehouse Automation", department_id="Operations", description="Automated sorting and robotics deployment in western hub.")
    proj_sales = Project(id="PROJ-ENTERPRISE-SALES", name="Enterprise Tier Commercial Acceleration", department_id="Sales", description="Strategic discount and multi-year contract renewals.")
    proj_cloud = Project(id="PROJ-CLOUD-MIG", name="Core Banking Service Cloud Migration", department_id="Engineering", description="Lift and modernize internal microservices from on-prem to cloud.")

    db.add_all([proj_supply, proj_phoenix, proj_sales, proj_cloud])
    db.commit()

    # -------------------------------------------------------------
    # 3. Decisions
    # -------------------------------------------------------------
    # 1. Supplier B Approval (Decision Memory Showcase)
    dec_supplier_b_id = uuid.uuid4()
    dec_supplier_b = Decision(
        id=dec_supplier_b_id,
        title="Approved Supplier B for Q3 Critical Components",
        description="Comprehensive supplier evaluation and award for Q3 monsoon manufacturing cycle.",
        decision_statement="Approved Supplier B because Supplier A had monsoon reliability issues (3 failures in 5 years), Supplier C was a known dead end (2021 quality failure), and budget allowed for the 12% premium.",
        reasoning="Supplier B provides 98.4% on-time delivery during monsoon months and operates dual regional hubs. Although priced at a 12% premium over Supplier A, the avoided risk of downtime (estimated at ₹35L per day) heavily justifies the investment.",
        reason="Mitigate monsoon logistics disruptions and guarantee 98% on-time delivery.",
        timeline="6 months",
        decision_maker="Sarah Chen (Supply Chain Lead)",
        stakeholders=json.dumps(["Sarah Chen (Supply Chain)", "Raj Malhotra (Finance)", "Priya Sharma (Operations)"]),
        risks=json.dumps(["12% cost premium relative to unvetted market rates", "Initial onboarding lead time of 10 days"]),
        expected_outcome="Zero delivery disruptions during monsoon with 98% quality conformance.",
        actual_outcome="Delivered 100% on time, zero defects during peak monsoon. Performance SLA fully met.",
        project_id="PROJ-SUPPLY-2024",
        department_id="Procurement",
        created_by="Sarah Chen",
        created_at=now - timedelta(days=120),
        confidence_score=0.92,
        status="Successful",
        extraction_notes="Extracted from Q1 Executive Procurement Committee Review",
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
            "Policy-15: Pricing Rules",
            "INC-2023-07: Supplier A Delay Audit"
        ]),
        valid_from=now - timedelta(days=120),
        valid_until=now + timedelta(days=240),
        decay_rate=0.03,
        is_expired=False,
        trust_tier=TrustTier.HUMAN_CONFIRMED.value,
        monetary_value=48.0,
        governance_level=GovernanceLevel.MEDIUM.value
    )

    # 2. Project Phoenix (Decision Replay & Post-Mortem Showcase)
    dec_project_phoenix_id = uuid.uuid4()
    dec_project_phoenix = Decision(
        id=dec_project_phoenix_id,
        title="Project Phoenix Warehouse Automation Direct Rollout",
        description="Fast-track deployment of automated sorting systems across Western distribution centers.",
        decision_statement="Approved direct nationwide rollout of Project Phoenix automation without a regional pilot.",
        reasoning="Executive directive to leapfrog competitors and cut fulfillment latency before Q4 peak sales.",
        reason="Accelerate throughput and reduce manual warehouse sorting overhead by 50%.",
        timeline="3 months",
        decision_maker="David Ross (VP Operations)",
        stakeholders=json.dumps(["David Ross (VP Ops)", "Anita Patel (Logistics)", "Kavita Rao (Engineering)"]),
        risks=json.dumps(["Integration mismatch with legacy ERP", "Vendor capacity limits under high throughput"]),
        expected_outcome="35% increase in order throughput and 50% labor cost reduction.",
        actual_outcome="Project failed. System crashed on Day 28 due to unvalidated firmware. Total loss: ₹42 Lakhs, 6 weeks of delayed customer deliveries.",
        project_id="PROJ-PHOENIX-2023",
        department_id="Operations",
        created_by="David Ross",
        created_at=now - timedelta(days=400),
        confidence_score=0.30,
        status="Failed",
        triggers="Competitive pressure and executive urgency.",
        constraints=json.dumps(["Launch deadline fixed to September 30", "No budget for parallel pilot"]),
        alternatives_considered=json.dumps(["Full Immediate Rollout", "90-Day Phased Regional Pilot", "Hybrid Manual Automation"]),
        rejected_reasons=json.dumps({
            "90-Day Phased Regional Pilot": "Rejected due to executive time pressure to meet Q4 launch deadline.",
            "Hybrid Manual Automation": "Deemed insufficiently transformative."
        }),
        assumptions=json.dumps([
            "Vendor firmware was production-hardened",
            "Warehouse floor staff would adapt without specialized retraining",
            "Legacy ERP could handle real-time MQTT message queues"
        ]),
        valid_from=now - timedelta(days=400),
        valid_until=now + timedelta(days=100),
        trust_tier=TrustTier.HUMAN_CONFIRMED.value,
        monetary_value=85.0,
        governance_level=GovernanceLevel.HIGH_STAKES.value
    )

    # 3. Core Banking Cloud Migration (Engineering Showcase)
    dec_cloud_mig_id = uuid.uuid4()
    dec_cloud_mig = Decision(
        id=dec_cloud_mig_id,
        title="Migrate Core Transaction Services to Multi-Region Cloud",
        description="Transition legacy on-premises microservices to cloud container clusters with managed DBs.",
        decision_statement="Migrate transaction processing services to managed cloud infrastructure to slash infra costs and improve peak uptime.",
        reasoning="Legacy hardware is nearing end-of-life; cloud elasticity will eliminate over-provisioning during billing spikes.",
        reason="Reduce infrastructure operational costs by 20% while providing auto-scaling for flash traffic.",
        timeline="6 months",
        decision_maker="Vikram Sen (Chief Architect)",
        stakeholders=json.dumps(["Vikram Sen (Architect)", "Ananya Roy (VP Eng)", "DevOps Council"]),
        risks=json.dumps(["Migration downtime", "Latency variance across regions", "Database replication lag"]),
        expected_outcome="20% infrastructure cost reduction and 99.99% availability during quarterly closes.",
        actual_outcome="16% cost reduction achieved; migration took 7.5 months due to staging integration tests.",
        project_id="PROJ-CLOUD-MIG",
        department_id="Engineering",
        created_by="Vikram Sen",
        created_at=now - timedelta(days=210),
        confidence_score=0.88,
        status="Partially Successful",
        valid_from=now - timedelta(days=210),
        valid_until=now + timedelta(days=500),
        trust_tier=TrustTier.HUMAN_CONFIRMED.value,
        monetary_value=65.0,
        governance_level=GovernanceLevel.HIGH_STAKES.value
    )

    db.add_all([dec_supplier_b, dec_project_phoenix, dec_cloud_mig])
    db.commit()

    # -------------------------------------------------------------
    # 4. Evidence, Alternatives, Outcomes & Lessons
    # -------------------------------------------------------------
    # Evidence for Supplier B
    ev1 = DecisionEvidence(decision_id=dec_supplier_b_id, evidence_type="audit", description="Historical monsoon delivery audit: Supplier B scored 98.4% vs Supplier A's 71.2%.", source_reference="INC-2023-07")
    ev2 = DecisionEvidence(decision_id=dec_supplier_b_id, evidence_type="financial", description="Calculated cost of factory stoppage: ₹35 Lakhs per day.", source_reference="FIN-RISK-2024-Q1")

    # Alternatives for Supplier B
    alt1 = DecisionAlternative(decision_id=dec_supplier_b_id, title="Supplier A", description="Lowest cost baseline vendor", reason_rejected="Failed 3 times in 5 years during monsoon weather.")
    alt2 = DecisionAlternative(decision_id=dec_supplier_b_id, title="Supplier C", description="Local vendor with aggressive delivery promises", reason_rejected="Organizational dead end from 2021 with 40% defect rate.")

    # Outcome for Supplier B
    out1 = Outcome(
        decision_id=dec_supplier_b_id,
        expected_result="Zero delivery disruptions during monsoon with 98% quality conformance.",
        actual_result="Delivered 100% on time, zero defects during peak monsoon. Performance SLA fully met.",
        expected_cost=48.0,
        actual_cost=49.2,
        expected_timeline="6 months",
        actual_timeline="5.5 months",
        variance_percentage=-2.5,
        outcome_status="Successful",
        lessons_learned="Investing in a proven reliability tier with dual regional distribution hubs protects critical manufacturing pipelines.",
        recorded_by="Sarah Chen"
    )

    # Lesson for Supplier B
    les1 = Lesson(
        decision_id=dec_supplier_b_id,
        title="Reliability Premium Justification in Monsoon Cycles",
        takeaway="Paying a 12% premium for dual-hub regional logistics consistently eliminates multi-crore factory downtime risks during severe weather.",
        category="Vendor"
    )

    # Outcome for Project Phoenix
    out2 = Outcome(
        decision_id=dec_project_phoenix_id,
        expected_result="35% increase in order throughput and 50% labor cost reduction.",
        actual_result="System crashed on Day 28 due to unvalidated firmware. Total loss: ₹42 Lakhs, 6 weeks of delayed customer deliveries.",
        expected_cost=85.0,
        actual_cost=127.0,
        expected_timeline="3 months",
        actual_timeline="Failed after 1 month",
        variance_percentage=49.4,
        outcome_status="Failed",
        lessons_learned="Bypassing a regional pilot under executive time pressure causes systemic operational failures when integrating proprietary firmware with legacy ERPs.",
        recorded_by="David Ross"
    )

    # Lesson for Project Phoenix
    les2 = Lesson(
        decision_id=dec_project_phoenix_id,
        title="Mandatory Phased Pilots for Industrial Automation",
        takeaway="Never bypass a 90-day regional validation phase for high-throughput robotics, regardless of executive launch target dates.",
        category="Process"
    )

    # Outcome for Cloud Migration
    out3 = Outcome(
        decision_id=dec_cloud_mig_id,
        expected_result="20% infrastructure cost reduction and 99.99% availability.",
        actual_result="16% cost reduction achieved. Staging tests took 1.5 months longer than anticipated.",
        expected_cost=65.0,
        actual_cost=68.5,
        expected_timeline="6 months",
        actual_timeline="7.5 months",
        variance_percentage=-20.0,
        outcome_status="Partially Successful",
        lessons_learned="Cloud database migration timeline models should always factor in 20% buffer for complex legacy schema synchronization.",
        recorded_by="Vikram Sen"
    )

    # Lesson for Cloud Migration
    les3 = Lesson(
        decision_id=dec_cloud_mig_id,
        title="Database Migration Timeline Buffering",
        takeaway="Legacy on-prem schema refactoring always requires extensive integration staging; schedule minimum 6 weeks for database parity verification.",
        category="Technical"
    )

    db.add_all([ev1, ev2, alt1, alt2, out1, out2, out3, les1, les2, les3])

    # -------------------------------------------------------------
    # 5. Dead Ends & Anti-patterns
    # -------------------------------------------------------------
    dead_end_supplier_c = DeadEnd(
        id=uuid.uuid4(),
        topic="Low-Cost Electronics Sourcing (Supplier C)",
        attempted_solution="Contracted Supplier C for high-volume passive capacitors based solely on 30% discount.",
        root_cause_of_failure="Severe batch defect rate (40%) triggered widespread recall and assembly stoppage.",
        cost_of_failure="₹25 Lakhs + 3 weeks line stoppage",
        retry_conditions="Supplier C passes ISO 9001 audit and guarantees 99.5% test yield under third-party certification.",
        do_not_retry=True,
        failure_date="2021-06",
        department_id="Procurement"
    )

    dead_end_pilot = DeadEnd(
        id=uuid.uuid4(),
        topic="Direct Nationwide Robotics Rollout Without Pilot",
        attempted_solution="Full multi-warehouse deployment without staging in western DC.",
        root_cause_of_failure="Firmware incompatible with legacy ERP database schema under load.",
        cost_of_failure="₹42 Lakhs",
        retry_conditions="Strict requirement: 90-day shadow pilot at lowest-throughput distribution center first.",
        do_not_retry=True,
        failure_date="2023-11",
        department_id="Operations"
    )

    # -------------------------------------------------------------
    # 6. Cross-Department Dependencies
    # -------------------------------------------------------------
    dep_sales_supply = DepartmentDependency(
        id=uuid.uuid4(),
        source_department="Sales",
        target_department="Procurement",
        title="Custom Hardware Commitments vs Sourcing Lead Times",
        description="Promising expedited delivery on custom hardware requires at least 4 weeks supplier lead time.",
        current_metric="Available buffer inventory: 350 units",
        constraint_limit="Maximum commitment without sourcing notice: 350 units",
        conflict_condition="Commitment > 350 units without 4-week notice",
        is_active=True,
        created_at=now - timedelta(days=90)
    )

    db.add_all([dead_end_supplier_c, dead_end_pilot, dep_sales_supply])
    db.commit()

    logger.info("✅ Enterprise memory successfully seeded with departments, projects, decisions, outcomes, and lessons!")
