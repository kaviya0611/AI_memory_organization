# Project Architecture & Block Diagram

## System Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Data Sources                                   │
│  Meeting Transcripts | Emails | Reports | Slack/Chat | PDFs     │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              AI Decision Extraction                              │
│  (LLM-based NLP pipeline with human-in-loop validation)         │
│  Extracts: Decision | Reason | People | Risks | Outcome       │
└────────────────┬────────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
    ┌─────────┐      ┌──────────────┐
    │PostgreSQL       │    Neo4j     │
    │(Metadata)       │ (Knowledge   │
    │                 │  Graph)      │
    └────────┬────────┴──────┬───────┘
             │               │
        ┌────▼───────────────▼───────┐
        │  Decision Knowledge Graph   │
        │  Decisions↔Projects         │
        │  Decisions↔Departments      │
        │  Decisions↔People           │
        │  Decisions↔Outcomes         │
        └────┬──────────────────┬─────┘
             │                  │
        ┌────▼──────┐    ┌──────▼────────┐
        │  Semantic  │    │ Recommendation │
        │  Search &  │    │ Engine         │
        │ Similarity │    │                │
        └────┬───────┘    └────┬───────────┘
             │                 │
             └────────┬────────┘
                      ▼
          ┌──────────────────────┐
          │  Frontend Dashboard  │
          │  (React + Tailwind)  │
          │                      │
          │ - Decision Search    │
          │ - Recommendation     │
          │ - Graph Visualization│
          │ - Analytics/Scoring  │
          └──────────────────────┘
```

## Component Details

### 1. Data Ingestion Layer
- Multi-format input: meetings, emails, documents, chat logs
- Preprocessing & normalization
- Ready for AI extraction pipeline

### 2. AI Decision Extraction
- **LLM-powered NER**: Extracts entities (decision, reasoning, stakeholders, risks, expected outcome)
- **Human-in-loop validation**: Confidence scoring; low-confidence extractions reviewed by users
- **Output**: Structured decision records with confidence scores

### 3. Data Storage Layer
- **PostgreSQL**: Decision metadata, audit logs, user interactions
- **Neo4j (Graph DB)**: Connected decision network
  - Nodes: Decisions, Projects, Departments, Employees, Outcomes
  - Relationships: DecisionIn(project), Team(department), Involves(person), Results(outcome)

### 4. Intelligence Layer
- **Similarity Engine**: Semantic matching using Sentence Transformers
- **Recommendation Logic**: Rank similar decisions by relevance, compare outcomes
- **Learning Module**: Track accuracy of recommendations, improve over time

### 5. Frontend Dashboard
- Decision creation form
- Search & filter interface
- Knowledge graph visualization (Cytoscape)
- Recommendation display with outcome comparison
- Analytics & organizational memory score

## Data Model Overview

### Decision Record
```
{
  id: UUID,
  title: string,
  description: string,
  decision_statement: string,
  reasoning: string,
  stakeholders: [person],
  risks: [string],
  expected_outcome: string,
  actual_outcome: string (populated later),
  project_id: UUID,
  department_id: UUID,
  created_by: person,
  created_at: timestamp,
  confidence_score: float (0-1),
  status: "approved" | "pending_review" | "archived"
}
```

### Knowledge Graph Entities
- **Decision Node**: Core decision record
- **Project Node**: Business initiative (connected to decisions)
- **Department Node**: Org unit (connected to decisions)
- **Person Node**: Employee/Manager (creator, stakeholder)
- **Outcome Node**: Actual result & metrics
- **Tag Node**: Topics/keywords for filtering

### Relationships
- `DECISION_FOR_PROJECT`: Decision → Project
- `DECISION_BY_DEPARTMENT`: Decision → Department
- `DECISION_INVOLVES`: Decision → Person
- `DECISION_LEADS_TO`: Decision → Outcome
- `SIMILAR_TO`: Decision → Decision (semantic similarity)
- `LESSONS_FROM`: Decision → Decision (causality)

## API Endpoints (FastAPI)

```
POST   /api/decisions              Create new decision
GET    /api/decisions              List decisions (paginated)
GET    /api/decisions/{id}         Get decision details
PATCH  /api/decisions/{id}         Update decision
POST   /api/decisions/{id}/outcome Record actual outcome
GET    /api/search?q=...           Search decisions by keyword
POST   /api/recommendations        Get recommendations for situation
GET    /api/graph                  Fetch knowledge graph data
GET    /api/analytics/memory-score Organizational memory score
```

## Security & Privacy
- Role-based access control (RBAC): Admin, Manager, Employee
- Audit trail: All decision views & edits logged
- Opt-in storage: Confirmation before recording decisions
- Data encryption: Sensitive fields encrypted at rest

## Scalability Considerations
- GraphDB sharding for large datasets
- API caching with Redis
- Async job queue (Celery) for extraction pipeline
- CDN for frontend static assets
