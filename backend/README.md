# Backend Setup & API Documentation

## Prerequisites
- Python 3.9+
- PostgreSQL 13+
- OpenAI API key

## Installation

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/org_memory
OPENAI_API_KEY=your_openai_api_key_here
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
DEBUG=True
```

### 4. Database Setup

Make sure PostgreSQL is running and create the database:

```bash
createdb org_memory
```

The tables will be created automatically when you start the server.

### 5. Run the Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

API documentation will be at `http://localhost:8000/docs`

## Project Structure

```
backend/
├── main.py                    # FastAPI application entry point
├── settings.py                # Configuration management
├── database.py                # Database connection & ORM setup
├── models.py                  # SQLAlchemy models
├── schemas.py                 # Pydantic validation schemas
├── routes/
│   ├── __init__.py
│   └── decisions.py            # Decision CRUD endpoints
├── services/
│   ├── __init__.py
│   └── extraction_service.py   # LLM-based decision extraction
├── requirements.txt
├── .env.example
└── README.md
```

## API Endpoints

### Decisions

**Create Decision**
```
POST /api/decisions
Content-Type: application/json

{
  "title": "Switch to new supplier",
  "decision_statement": "We will move to Supplier B",
  "reasoning": "Cost reduction and better delivery",
  "stakeholders": ["John (Procurement)", "Sarah (Ops)"],
  "risks": ["Transition period delays", "Quality concerns"],
  "expected_outcome": "30% cost savings",
  "project_id": "PROJ-001",
  "department_id": "operations"
}
```

**List Decisions**
```
GET /api/decisions?skip=0&limit=10&status=approved&department_id=operations
```

**Get Decision**
```
GET /api/decisions/{decision_id}
```

**Update Decision**
```
PATCH /api/decisions/{decision_id}
Content-Type: application/json

{
  "status": "approved",
  "actual_outcome": "Cost dropped 25%, delivery improved 15%"
}
```

**Delete/Archive Decision**
```
DELETE /api/decisions/{decision_id}
```

**Extract Decision from Text**
```
POST /api/decisions/extract
Content-Type: application/json

{
  "text": "In our meeting today, we decided to move suppliers because costs...",
  "source_type": "email"
}

Response:
{
  "decision_statement": "We will switch to Supplier B",
  "reasoning": "Cost reduction and faster delivery",
  "stakeholders": ["John", "Sarah"],
  "risks": ["Quality concerns", "Transition delays"],
  "expected_outcome": "30% cost savings",
  "confidence_score": 0.92,
  "extraction_notes": "Extracted from email"
}
```

**Record Outcome**
```
POST /api/decisions/{decision_id}/outcome
Content-Type: application/json

{
  "actual_outcome": "Cost dropped 25%, delivery delays reduced by 15%"
}
```

## Decision Model

```python
{
  "id": "uuid",
  "title": "string",
  "description": "string or null",
  "decision_statement": "string",
  "reasoning": "string or null",
  "stakeholders": ["string"] (JSON array),
  "risks": ["string"] (JSON array),
  "expected_outcome": "string or null",
  "actual_outcome": "string or null",
  "project_id": "string or null",
  "department_id": "string or null",
  "created_by": "string or null",
  "created_at": "datetime",
  "updated_at": "datetime",
  "confidence_score": 0.0-1.0,
  "status": "pending_review | approved | archived",
  "extraction_notes": "string or null"
}
```

## Authentication (Future)

Currently, the API has no authentication. For production:
1. Implement JWT token-based auth
2. Add role-based access control (Admin, Manager, Employee)
3. Add audit logging

## Testing

To test the API:

```bash
# Using curl
curl -X POST http://localhost:8000/api/decisions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Decision",
    "decision_statement": "Test statement",
    "reasoning": "Test reasoning"
  }'

# Using Python requests
import requests

response = requests.post(
  "http://localhost:8000/api/decisions",
  json={
    "title": "Test Decision",
    "decision_statement": "Test statement"
  }
)
print(response.json())
```

## Troubleshooting

**Database Connection Error**
- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env
- Run: `createdb org_memory`

**OpenAI API Error**
- Verify OPENAI_API_KEY in .env
- Check API key is valid and has credits
- Note: Extraction will work with confidence_score=0.0 if API fails

**Port Already in Use**
- Change SERVER_PORT in .env
- Or kill process using port 8000: `lsof -ti:8000 | xargs kill -9`
