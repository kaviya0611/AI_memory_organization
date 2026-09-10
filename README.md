# AI Organizational Memory & Decision Intelligence Platform

## 📋 Problem Statement
Organizations make hundreds of decisions daily across HR, Finance, Procurement, Operations, and Sales, spread across meetings, emails, chats, and reports. Once a decision is made, its reasoning is rarely captured anywhere structured. Employees leave, managers change, and documents become hard to find. As a result, teams unknowingly repeat the same mistakes—causing lost time, repeated errors, and accumulated organizational forgetfulness.

### Pain Points
- Decision history scattered across meetings, emails, and documents
- When people leave, decision reasoning is lost
- Teams repeat past mistakes without knowing
- Current tools (Copilot, Notion, Confluence, Jira) store documents but don't understand or learn from decisions

## 🚀 Solution
**AI Organizational Memory & Decision Intelligence Platform** - An AI-powered enterprise brain that:
1. **Captures decisions** automatically from meeting transcripts, emails, and reports
2. **Extracts reasoning** - decision, reason, people involved, risks, and expected outcomes
3. **Builds a Decision Knowledge Graph** - connects decisions to projects, departments, employees, and real outcomes
4. **Recommends smarter choices** - when facing similar situations, recalls past decisions and explains what actually happened
5. **Tracks organizational learning** - measures how well the company documents, reuses, and learns from decisions

## 🎯 Core Features

### 1. AI Decision Extraction
- Auto-captures decisions from unstructured data (meetings, emails, reports)
- Extracts: Decision, Reasoning, People Involved, Risks, Expected Outcome

### 2. Decision Knowledge Graph
- Neo4j-powered graph connecting decisions to:
  - Projects & initiatives
  - Departments & teams
  - Employees & roles
  - Real outcomes & results
- Turns scattered documents into structured organizational memory

### 3. AI Recommendation Engine
- When facing a similar situation, instantly surfaces relevant past decisions
- Explains actual outcomes vs. expected results
- Recommends safer course of action based on organizational experience

### 4. Organizational Learning Score
- Tracks how well the company documents decisions
- Measures reuse and learning from outcomes
- Encourages teams to build institutional knowledge instead of losing it

## 📊 Use Case Example
**Scenario**: New supply chain manager faces rising logistics costs, digs through old supplier files, discovers fragments that Supplier A was dropped for Supplier B in 2024, but doesn't know why or what happened.

**With Platform**: Asks "Should we change suppliers to cut cost?" Platform recalls: "Similar decision in 2024. Cost dropped only 3%, while delivery delays and complaints rose." Manager renegotiates with current supplier instead, saving weeks of rework and avoiding a repeated mistake backed by company's own experience.

## 🔧 Technology Stack

### Frontend
- **React.js** - component-based UI
- **Tailwind CSS** - responsive styling
- **Cytoscape.js** - graph visualization

### Backend
- **FastAPI** - high-performance REST API
- **PostgreSQL** - relational data (decisions metadata, outcomes)
- **Neo4j (Aura)** - knowledge graph database

### AI/NLP
- **LLM APIs** - GPT / Llama 3 for decision extraction
- **LangGraph** - orchestrate AI workflows
- **Sentence Transformers** - semantic similarity for decision matching
- **spaCy** - NER (named entity recognition) for entity extraction
- **Speech-to-text API** - transcribe meetings (future phase)

### Infrastructure
- **AWS / GCP** - cloud hosting
- **Domain & SSL Certificate** - secure access

## 💰 Cost Estimate (₹20,000)
| Component | Cost |
|-----------|------|
| Cloud Hosting (AWS/GCP) | ₹5,000 |
| LLM API Credits (GPT/Llama 3) | ₹8,000 |
| Neo4j Graph DB (Aura) | ₹3,000 |
| Domain & SSL | ₹1,000 |
| Speech-to-text API | ₹2,000 |
| Testing & Misc | ₹1,000 |
| **Total** | **₹20,000** |

## ⚠️ Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Decisions are implicit/ambiguous in natural conversation | Use LLM extraction + human-in-loop review for low-confidence cases |
| Employees hesitate to have decisions recorded/analyzed | Ensure transparency, role-based access control, opt-in review before storage |
| Outcome tracking requires long-term horizon (weeks/months/years) | Start with short-cycle decisions (weeks, not years) to demonstrate value early |

## 🎓 Skills & Resources

### Skills We Have ✅
- Web development (React, FastAPI, REST APIs)
- Working with LLM APIs (GPT, Llama 3)
- Basic NLP and database design

### Skills We Need to Acquire 📚
- Graph Neural Networks (advanced KG traversal)
- Production-scale knowledge graph design (Neo4j enterprise patterns)
- Speech-to-text pipeline tuning (for meeting transcription)

## 🌍 Sustainable Development Goals
**Maps to SDG 9** - Industry, Innovation & Infrastructure
Our solution strengthens organizational knowledge infrastructure and drives innovation in enterprise decision-making by transforming how teams recall, learn, and decide.

**Beneficiaries**:
- Managers and team leads making recurring business decisions
- New employees and departments
- Organization as a whole (institutional knowledge preservation)

**Measurable Impact**:
- Saves 3-4 hours per week previously spent searching for past decisions
- Reduces repeated decision-making mistakes by estimated 30-40%
- Preserves knowledge across employee turnover and restructuring

## 📅 Implementation Roadmap

### Phase 1: Decision Capture MVP
- Text input interface for capturing decisions
- LLM-based extraction pipeline
- Basic decision storage in PostgreSQL

### Phase 2: Knowledge Graph
- Neo4j graph model implementation
- Entity linking (decisions ↔ projects, people, outcomes)
- Similarity search capability

### Phase 3: Recommendation Engine
- Semantic search for similar decisions
- Recommendation ranking logic
- Outcome comparison visualization

### Phase 4: Analytics & Scoring
- Organizational Memory Score dashboard
- Decision analytics & trends
- Team-level insights

## 🚀 Getting Started

### Quick Start (Recommended - Docker)

**Prerequisites**: Docker & Docker Compose

```bash
# 1. Clone/navigate to project
cd organizational-memory-platform

# 2. Copy environment template and add your OpenAI API key
cp backend/.env.example backend/.env
# Edit backend/.env and add: OPENAI_API_KEY=sk-your-key

# 3. Start everything
docker-compose up -d

# 4. Access the application
# Frontend: http://localhost:3000
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Manual Setup (For Development)

**Prerequisites**:
- Python 3.9+ & pip
- Node.js 18+ & npm
- PostgreSQL 13+

```bash
# Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database URL and OpenAI API key
createdb org_memory
python main.py

# Frontend Setup (in new terminal)
cd frontend
npm install
npm run dev
```

### Verify Installation

1. Open http://localhost:3000
2. Create a test decision
3. Try AI extraction with sample text
4. View saved decisions

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup and examples.

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design & components
- [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md) - Implementation roadmap
- [backend/README.md](./backend/README.md) - Backend API docs
- [frontend/README.md](./frontend/README.md) - Frontend guide

## 📞 Contact & Support
Project developed at Sri Eshwar College of Engineering - Design Thinking & Innovation Studio
