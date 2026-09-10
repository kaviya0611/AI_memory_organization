# AI Organizational Memory & Decision Intelligence Platform

> **A living organizational brain that captures how decisions are actually made, stores the reasoning behind them, and uses this memory to guide employees, prevent repeated mistakes, and continuously improve decision quality.**

In simple words: It's not a wiki. It's not a chatbot. It's the organization's collective judgment made permanent, searchable, and actionable.

---

## 🔹 12 Unique Core Features

| # | Feature | What It Solves | Key Benefit |
|---|---------|----------------|-------------|
| 1 | **Decision Memory** | Systems only store outcomes, not reasoning | Full context: triggers, constraints, alternatives, assumptions & evidence |
| 2 | **Temporal Validity** | Outdated knowledge misleads new employees | Knowledge expires; confidence decays over time; active outdated warnings |
| 3 | **Dead Ends Repository** | Repeating costly failed experiments | Captures failures, root causes, costs (₹), and "Do NOT retry" guardrails |
| 4 | **Neuro-Symbolic Reasoning** | LLM hallucinations & lack of explainability | Neural (language) + Symbolic (logic engine) producing verified proof trees |
| 5 | **Real-Time Guardrails** | Mistakes happen before anyone notices | Proactive intercept before sending; policy counter-offers and escalations |
| 6 | **Decision Replay** | Post-mortems cannot reconstruct initial assumptions | Time-travel replay: Day 0 assumptions vs reality timeline divergence |
| 7 | **Multi-Agent Simulation** | Senior leaders and experts unavailable | Virtual Expert Council (Digital twins of Sarah, Raj, Priya) debating proposals |
| 8 | **Explanation-First Architecture** | Users distrust black-box AI | 5 layers: Source, Deductive Chain, Confidence, Counterfactuals & Evidence |
| 9 | **Adaptive Learning** | System never improves from outcomes | Feedback loops: 100% on-time outcome boosts pattern confidence (82% ➔ 94%) |
| 10 | **Dream Mode** | Memory rots and becomes stale | Nightly background consolidation: detects contradictions, prunes old data, finds gaps |
| 11 | **Governance-First Execution** | Unchecked AI autonomy and liability | 3-tier trust, monetary authority gates (<₹10L, ₹10-50L, >₹50L), immutable audit trail |
| 12 | **Cross-Dept Connections** | Siloed decisions cause conflicting promises | Links Sales, Supply Chain, Finance & Ops; detects resource & margin clashes |

---

## 🎯 How It All Works Together: Priya's Procurement Journey

1. **Priya joins as a new procurement manager** ➔ Opens the platform and sees pending supplier decisions.
2. **System recommends Supplier B with 92% confidence** ➔ Evaluated against 47 historical Q3 decisions.
3. **Priya asks: *"Why not Supplier A?"*** ➔ Natural language intent parsed by the Neuro-Symbolic engine.
4. **System explains reasoning & dead ends** ➔ Supplier A had 3 monsoon delivery failures in 5 years; Supplier C is a recorded Dead End (40% defect rate, ₹25 Lakhs loss).
5. **Priya clicks *"Show Replay"*** ➔ Post-mortem timeline reconstructs the 2021 failure and Project Phoenix lessons.
6. **Temporal Validity warning fires** ➔ System warns that 2018 recommendations for Supplier A expired 2 years ago.
7. **Priya approves Supplier B** ➔ Full decision journey (triggers, constraints, rejected options) is permanently captured.
8. **Dream Mode consolidates overnight** ➔ Background process creates a high-reliability heuristic for Supplier B and prunes stale records.
9. **Six months later, outcome tracked** ➔ Delivery completed with zero defects; adaptive learning boosts Supplier B confidence to 94%.
10. **Preserved Collective Memory** ➔ Two years later, the next manager immediately inherits Priya's verified institutional wisdom.

---

## 🔧 Technology Stack

- **Frontend**: React.js 18, Vite 5, Tailwind CSS, Date-fns, Axios.
- **Backend API**: FastAPI, Python 3.14 / 3.11+, Pydantic v2, SQLAlchemy 2.0.
- **Persistence**: PostgreSQL when available, with automatic zero-configuration **SQLite fallback** (`org_memory.db`).
- **Graph & Logic Engine**: NetworkX + Neo4j integration; Deterministic Propositional Logic Engine.
- **Semantic Similarity**: Scikit-learn TF-IDF vectorizer + SentenceTransformers fallback.
- **AI / LLM**: OpenAI GPT integration with intelligent heuristic NLP fallback for offline resilience.

---

## 🚀 Quickstart & Setup

### 1. Backend Setup

```bash
cd backend

# Install Python requirements
pip install fastapi "uvicorn[standard]" sqlalchemy pydantic pydantic-settings python-dotenv scikit-learn pandas

# Run backend server
python -m uvicorn main:app --reload --port 8000
```

The backend starts at `http://localhost:8000` (Swagger UI at `http://localhost:8000/docs`). On startup, it automatically verifies database tables and pre-seeds the enterprise memory scenario!

### 2. Frontend Setup

```bash
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` or `http://localhost:3000` in your browser.

---

## 🧪 Running Automated Feature Verification

Run the comprehensive test suite exercising all 12 platform features:

```bash
cd backend
python test_all_features.py
```

Expected output:
```text
==================================================
Testing AI Organizational Memory Platform (12 Features)
==================================================
[PASS] Root endpoint online. Features advertised: 12
[PASS] Seed Data successfully initialized (Priya's Scenario, Phoenix, Supplier B, Dead Ends)
[PASS] Feature 1 (Decision Memory): Verified full reasoning & journey
[PASS] Feature 2 (Temporal Validity): Verified expiration warning on 2018 record
[PASS] Feature 3 (Dead Ends): Catalogued Supplier C with Do NOT Retry badge
[PASS] Feature 4 & 5 (Guardrails & Neuro-Symbolic): Blocked 20% discount with counter-offer
[PASS] Feature 5 (Guardrails): Intercepted Supplier C Dead End warning
[PASS] Feature 6 (Decision Replay): Reconstructed checkpoints & lessons
[PASS] Feature 7 (Virtual Expert Council): Simulated Sarah, Raj, Priya (78% consensus)
[PASS] Feature 8 (Explanation-First): Produced 5-layer explanation stack
[PASS] Feature 9 (Adaptive Learning): Outcome recorded; confidence boosted to 94%
[PASS] Feature 10 (Dream Mode): Consolidations, contradictions, and insights verified
[PASS] Feature 12 (Cross-Dept Connections): Monitored links & detected inventory conflicts
[PASS] Feature 11 (Governance & Score): Memory score calculated
==================================================
ALL 12 FEATURES VERIFIED SUCCESSFULLY!
==================================================
```
