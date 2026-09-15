# Organizational Decision Intelligence

> **Enterprise Decision Memory, Provenance & Outcome Feedback Loop Platform**  
> Built with **React + TypeScript + Tailwind CSS**, **Python FastAPI**, and **PostgreSQL**.

---

## 1. Executive Summary

Existing enterprise search and document repositories can answer *"Where is the document?"*, but fail to answer:

- **Why was a decision made?**
- **What alternatives were considered and rejected?**
- **Who made the decision and what evidence supported it?**
- **Did the decision succeed or fail?**
- **What was the expected outcome versus the actual outcome?**
- **What can the organization learn from prior outcomes?**

**Organizational Decision Intelligence** solves this by formalizing the closed-loop decision lifecycle:

```
Decision ──▶ Reason ──▶ Evidence ──▶ Expected Outcome ──▶ Actual Outcome ──▶ Learning
```

---

## 2. Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + TypeScript** | Strongly typed, reactive UI with modular component hierarchy |
| **Styling** | **Tailwind CSS** | Professional dark slate enterprise dashboard |
| **Build Tool** | **Vite** | Fast HMR dev server and optimized production bundles |
| **Icons & UI** | **Lucide React** | Clean enterprise iconography |
| **HTTP Client** | **Axios** | Typed REST API integration with timeout and error interceptors |
| **Backend** | **Python FastAPI** | Asynchronous, high-performance REST APIs with OpenAPI docs |
| **ORM / Data** | **SQLAlchemy 2.0** | Relational schema modeling and database session management |
| **Validation** | **Pydantic v2** | Strict request/response data contracts |
| **Database** | **PostgreSQL** | Primary relational database (`psycopg2-binary`) |
| **Fallback** | **SQLite** | Transparent local fallback if PostgreSQL instance is offline |

---

## 3. Project Structure

```
memory_organization/
├── .env                          # Root environment variables
├── .env.example                  # Root environment template
├── README.md                     # Comprehensive platform documentation
│
├── backend/                      # Python FastAPI Backend
│   ├── .env                      # Backend environment variables
│   ├── .env.example              # Backend environment template
│   ├── database.py               # SQLAlchemy PostgreSQL engine with SQLite fallback
│   ├── main.py                   # FastAPI app, lifespan, CORS, health & root endpoints
│   ├── models.py                 # SQLAlchemy 2.0 models (Decisions, Outcomes, Lessons, etc.)
│   ├── schemas.py                # Pydantic v2 request & response validation schemas
│   ├── settings.py               # Pydantic BaseSettings environment loader
│   ├── requirements.txt          # Python dependencies
│   ├── test_api_endpoints.py     # Automated backend verification test suite
│   ├── routes/
│   │   └── decisions.py          # REST endpoints for decisions, outcomes, and audit trail
│   └── services/
│       └── seed_service.py       # Enterprise memory seed service (Departments, Decisions, etc.)
│
└── frontend/                     # React 18 + TypeScript Frontend
    ├── .env                      # Frontend environment variables
    ├── .env.example              # Frontend environment template
    ├── index.html                # HTML entry template with Google Fonts (Inter, Outfit)
    ├── package.json              # NPM dependencies and scripts
    ├── tsconfig.json             # TypeScript compiler configuration
    ├── tsconfig.node.json        # Vite TypeScript node configuration
    ├── vite.config.js            # Vite bundler configuration
    ├── tailwind.config.js        # Tailwind CSS theme configuration
    └── src/
        ├── main.tsx              # Application entry point
        ├── App.tsx               # Enterprise Decision Intelligence dashboard
        ├── index.css             # Tailwind base styles and dark theme tokens
        ├── vite-env.d.ts         # Vite client type definitions
        ├── types/
        │   └── index.ts          # TypeScript interfaces (Decision, Outcome, Health, etc.)
        └── services/
            └── api.ts            # Typed Axios API client
```

---

## 4. Environment Configuration

### Root & Backend `.env`
Create `.env` (or copy `.env.example`):

```bash
# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/org_memory
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=org_memory

# Backend Server
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
DEBUG=True

# Optional Graph Database
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Frontend API URL
VITE_API_BASE_URL=http://localhost:8000
```

> **Smart Database Resilience**: If PostgreSQL is running on `localhost:5432`, the application automatically connects to PostgreSQL. If PostgreSQL is offline or credentials are missing, the backend **gracefully falls back to local SQLite** (`org_memory.db`) so development and testing continue without disruption.

---

## 5. How to Run Locally

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ & npm (Tested on Node v24)
- PostgreSQL (Optional for local testing; SQLite fallback is automatic)

### Step 1: Run the Backend (FastAPI)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Start the FastAPI development server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- API Server: `http://localhost:8000`
- Interactive Swagger API Docs: `http://localhost:8000/docs`
- Health & Database Diagnostics: `http://localhost:8000/health`

### Step 2: Run the Frontend (React + TypeScript)

Open a new terminal:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

- Web Application: `http://localhost:5173`

---

## 6. Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Platform overview and feedback loop metadata |
| `GET` | `/health` | Live health check with database engine, latency & fallback status |
| `GET` | `/api/departments` | List organizational departments |
| `GET` | `/api/projects` | List active projects and strategic initiatives |
| `GET` | `/api/analytics` | Summary metrics: total decisions, outcomes tracked, avg confidence |
| `GET` | `/api/decisions/` | List decisions with department/status filtering |
| `POST` | `/api/decisions/` | Record a new organizational decision with reasoning and targets |
| `GET` | `/api/decisions/{id}` | Retrieve decision details with evidence, alternatives & outcomes |
| `POST` | `/api/decisions/{id}/outcome` | Record actual result, calculate variance, and capture lesson |

---

## 7. Automated Testing & Verification

Run the automated backend test suite:

```bash
cd backend
python test_api_endpoints.py
```

Run TypeScript compilation and production build check:

```bash
cd frontend
npm run typecheck
npm run build
```

---

## 8. Next Roadmap (Phase 2)
- **AI Document Ingestion**: Upload PDF, DOCX, TXT to extract decisions with human confirmation.
- **pgvector Semantic Search**: Retrieve past decisions based on natural language queries.
- **Decision Advisor**: Recommend actions for new scenarios based on historical outcomes and dead ends.
