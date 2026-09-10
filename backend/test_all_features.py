"""
Comprehensive Test Suite for the 12 Platform Features
"""

import sys
import io

# Ensure UTF-8 output on Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_platform():
    print("==================================================")
    print("Testing AI Organizational Memory Platform (12 Features)")
    print("==================================================")

    # 1. Root & Health
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.text}"
    features = res.json().get("unique_features", [])
    print(f"[PASS] Root endpoint online. Features advertised: {len(features)}")
    assert len(features) == 12

    # 2. Seed Enterprise Memory Dataset
    res = client.post("/api/decisions/seed-data?force=true")
    assert res.status_code == 200, f"Seed failed: {res.text}"
    print("[PASS] Seed Data successfully initialized (Priya's Scenario, Phoenix, Supplier B, Dead Ends)")

    # 3. Decision Memory (Feature 1 & 2)
    res = client.get("/api/decisions/")
    assert res.status_code == 200
    decisions = res.json()
    assert len(decisions) >= 3
    supplier_b = next((d for d in decisions if "supplier b" in d["title"].lower()), None)
    assert supplier_b is not None, "Supplier B decision not found"
    assert supplier_b["triggers"] is not None
    assert len(supplier_b["constraints"]) > 0
    assert len(supplier_b["alternatives_considered"]) > 0
    assert len(supplier_b["assumptions"]) > 0
    print(f"[PASS] Feature 1 (Decision Memory): Verified full reasoning & journey for '{supplier_b['title']}'")

    # Check Temporal Validity (Feature 2)
    supplier_a_old = next((d for d in decisions if "2018" in d["title"]), None)
    assert supplier_a_old is not None
    assert supplier_a_old["is_expired"] == True
    assert "Expired" in supplier_a_old["temporal_warning"]
    print(f"[PASS] Feature 2 (Temporal Validity): Verified expiration warning on '{supplier_a_old['title']}'")

    # 4. Dead Ends Repository (Feature 3)
    res = client.get("/api/decisions/dead-ends")
    assert res.status_code == 200
    dead_ends = res.json()
    assert len(dead_ends) >= 2
    supplier_c = next((de for de in dead_ends if "supplier c" in de["topic"].lower()), None)
    assert supplier_c is not None
    assert supplier_c["do_not_retry"] == True
    print(f"[PASS] Feature 3 (Dead Ends): Catalogued '{supplier_c['attempted_solution']}' with Do NOT Retry badge")

    # 5. Neuro-Symbolic Logic & Guardrails (Features 4 & 5)
    # Test A: 20% discount on 3-year customer
    res = client.post("/api/decisions/guardrails/check", json={
        "decision_draft": "Approve 20% discount for Customer Y",
        "discount_percentage": 20.0,
        "customer_tenure_years": 3.0,
        "monetary_value": 24.0
    })
    assert res.status_code == 200
    guard_res = res.json()
    assert guard_res["passed"] == False
    assert len(guard_res["violations"]) > 0
    assert len(guard_res["logic_proof_tree"]) > 0
    print(f"[PASS] Feature 4 & 5 (Guardrails & Neuro-Symbolic): Blocked 20% discount. Suggested counter-offer: {guard_res['violations'][0].get('counter_offer')}")

    # Test B: Supplier C dead end trigger
    res = client.post("/api/decisions/guardrails/check", json={
        "decision_draft": "Contract Supplier C for high-temp resin components",
        "proposed_options": ["Supplier C"]
    })
    guard_res = res.json()
    assert len(guard_res["dead_end_warnings"]) > 0
    print("[PASS] Feature 5 (Guardrails): Intercepted Supplier C Dead End warning before approval")

    # 6. Decision Replay (Feature 6)
    res = client.get("/api/decisions/phoenix/replay")
    assert res.status_code == 200
    replay = res.json()
    assert len(replay["timeline_checkpoints"]) >= 3
    assert len(replay["lessons_learned"]) >= 2
    print(f"[PASS] Feature 6 (Decision Replay): Reconstructed {replay['title']} with {len(replay['timeline_checkpoints'])} checkpoints & lessons")

    # 7. Multi-Agent Simulation (Feature 7)
    res = client.post("/api/decisions/simulation/council", json={
        "question": "Should we switch to a single supplier to save 15%?"
    })
    assert res.status_code == 200
    council = res.json()
    assert len(council["simulated_experts"]) == 3
    assert council["consensus_score"] == 78.0
    print(f"[PASS] Feature 7 (Virtual Expert Council): Simulated Sarah, Raj, Priya. Consensus: {council['consensus_score']}% ({council['consensus_status']})")

    # 8. Explanation-First Recommendations (Feature 8)
    res = client.post("/api/decisions/recommendations/search", params={
        "decision_statement": "Approve Supplier for Q3 Monsoon Critical Components"
    })
    assert res.status_code == 200
    rec = res.json()
    assert "explanation" in rec
    exp = rec["explanation"]
    assert "layer1_source_attribution" in exp
    assert len(exp["layer2_reasoning_chain"]) >= 3
    assert len(exp["layer4_counterfactuals"]) >= 1
    assert len(exp["layer5_evidence_links"]) >= 1
    print(f"[PASS] Feature 8 (Explanation-First): Produced 5-layer explanation stack for: '{rec['recommendation']}'")

    # 9. Adaptive Learning (Feature 9)
    res = client.post(f"/api/decisions/{supplier_b['id']}/outcome", params={
        "actual_outcome": "Delivered 100% on time with zero defects during peak monsoon. Performance SLA met."
    })
    assert res.status_code == 200
    updated_b = res.json()
    assert updated_b["actual_outcome"] is not None
    assert updated_b["confidence_score"] >= 0.94
    print(f"[PASS] Feature 9 (Adaptive Learning): Outcome recorded. Confidence boosted to {updated_b['confidence_score']*100}%")

    # 10. Dream Mode (Feature 10)
    res = client.post("/api/decisions/dream-mode/run")
    assert res.status_code == 200
    dream = res.json()
    assert len(dream["consolidated_patterns"]) > 0
    assert len(dream["insights"]) > 0
    print(f"[PASS] Feature 10 (Dream Mode): Consolidations: {dream['consolidated_count']}, Contradictions: {dream['contradictions_detected']}, Insights: {len(dream['insights'])}")

    # 11. Cross-Department Dependencies (Feature 12)
    res = client.get("/api/decisions/dependencies/cross-department")
    assert res.status_code == 200
    deps = res.json()
    assert len(deps) >= 2
    conflicts = [d for d in deps if d["has_conflict"]]
    assert len(conflicts) > 0
    print(f"[PASS] Feature 12 (Cross-Dept Connections): Monitored {len(deps)} department links, detected {len(conflicts)} active inventory/margin conflicts")

    # 12. Memory Score & Governance (Feature 11)
    res = client.get("/api/decisions/analytics/memory-score")
    assert res.status_code == 200
    score_data = res.json()
    print(f"[PASS] Feature 11 (Governance & Score): Organizational Memory Score: {score_data['organizational_memory_score']} ({score_data['interpretation']})")

    print("\n==================================================")
    print("ALL 12 FEATURES VERIFIED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    test_platform()
