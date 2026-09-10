# Quick Start Guide - Organizational Memory Platform

## 🚀 5-Minute Setup

### Option 1: Using Docker (Recommended)

#### Prerequisites
- Docker & Docker Compose installed
- OpenAI API key (for AI decision extraction)

#### Steps

1. **Clone/Navigate to project**
```bash
cd organizational-memory-platform
```

2. **Create `.env` file**
```bash
cp backend/.env.example backend/.env
```

3. **Add your OpenAI API key to `backend/.env`**
```
OPENAI_API_KEY=sk-your-key-here
```

4. **Start everything with Docker Compose**
```bash
docker-compose up -d
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

That's it! Your full stack is running.

### Option 2: Manual Setup (For Development)

#### Backend Setup

**Prerequisites**: Python 3.9+, PostgreSQL 13+

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
cp .env.example .env

# 6. Edit .env and add your OpenAI API key
# DATABASE_URL should point to your PostgreSQL instance
# Create database: createdb org_memory

# 7. Run the server
python main.py
```

Server runs on: http://localhost:8000

#### Frontend Setup

**Prerequisites**: Node.js 18+, npm/yarn

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env.local (optional)
echo "VITE_API_URL=http://localhost:8000/api" > .env.local

# 4. Start development server
npm run dev
```

Frontend runs on: http://localhost:3000

## ✅ Verify Everything Works

1. Open http://localhost:3000 in your browser
2. You should see the "Organizational Memory Platform" header
3. Try creating a decision:
   - Fill in the form with test data
   - Click "Save Decision"
4. View saved decisions in the "View Decisions" tab

## 🧪 Test the AI Extraction Feature

The platform can extract decisions from text using OpenAI's GPT model.

1. In the "New Decision" form, click "+ Extract from Text"
2. Paste this sample text:
```
In today's meeting, the team decided to migrate our database from MySQL to PostgreSQL because it 
offers better performance, native JSON support, and lower maintenance costs. John from DevOps, 
Sarah from Backend, and Mike from QA were involved. We're concerned about the migration timeline 
and potential data loss during the transition. We expect this to reduce query times by 40% and 
improve scalability. The migration should be completed within Q4.
```
3. Click "Extract Decision"
4. The form will auto-populate with extracted information
5. Click "Save Decision" to record it

## 📁 Project Structure

```
organizational-memory-platform/
├── backend/                    # FastAPI Python backend
│   ├── main.py                 # Application entry point
│   ├── models.py               # Database models
│   ├── routes/                 # API endpoints
│   ├── services/               # Business logic (extraction)
│   └── requirements.txt
├── frontend/                   # React/Vite frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── App.jsx             # Main app
│   │   └── api.js              # API client
│   └── package.json
├── docker-compose.yml          # Docker orchestration
└── README.md
```

## 🔑 Key Features

### ✨ Decision Capture
- Manual form entry
- AI-powered text extraction from emails, meeting notes, reports
- Structured fields: statement, reasoning, stakeholders, risks, expected outcome

### 🔍 Decision Management
- View all recorded decisions
- Filter by status and department
- Update decisions with actual outcomes
- Archive decisions

### 🤖 AI Extraction
- Auto-extracts key information from unstructured text
- Provides confidence score
- Human-in-loop validation (can review before saving)

### 📊 Tracking & Learning (Coming Soon)
- Neo4j knowledge graph
- Similar decision recommendations
- Outcome tracking and comparison
- Organizational memory score

## 🛠️ Configuration

### Backend `.env` Variables
```
DATABASE_URL=postgresql://user:pass@host/dbname
OPENAI_API_KEY=sk-your-key-here
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
DEBUG=True
```

### Frontend `.env.local` Variables
```
VITE_API_URL=http://localhost:8000/api
```

## 📚 API Examples

### Create a Decision
```bash
curl -X POST http://localhost:8000/api/decisions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Switch Suppliers",
    "decision_statement": "Move to Supplier B",
    "reasoning": "Better pricing and delivery",
    "expected_outcome": "30% cost savings"
  }'
```

### List Decisions
```bash
curl http://localhost:8000/api/decisions?limit=10
```

### Extract from Text
```bash
curl -X POST http://localhost:8000/api/decisions/extract \
  -H "Content-Type: application/json" \
  -d '{
    "text": "In todays meeting, we decided to...",
    "source_type": "email"
  }'
```

## 🐛 Troubleshooting

**"Cannot connect to database"**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists: `createdb org_memory`

**"OpenAI API error"**
- Verify API key is correct in .env
- Check you have API credits
- Extraction will still work with low confidence if API fails

**"Port 3000 already in use"**
- Change port in frontend `vite.config.js`
- Or kill process: `lsof -ti:3000 | xargs kill -9`

**"Port 8000 already in use"**
- Change SERVER_PORT in backend `.env`

## 🚀 Next Steps

1. **Create your first decisions** - Try the decision form
2. **Test AI extraction** - Paste text to auto-fill form
3. **Record outcomes** - Come back later and update with actual results
4. **Phase 2 (Coming)** - Neo4j knowledge graph & recommendations
5. **Phase 3 (Coming)** - Recommendation engine & outcome analysis
6. **Phase 4 (Coming)** - Analytics dashboard & memory score

## 📖 Documentation

- [Backend README](./backend/README.md) - API documentation
- [Frontend README](./frontend/README.md) - Component guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md) - Implementation plan

## 💡 Tips

- Start with short-cycle decisions (weeks, not years) to see value quickly
- Use the extraction feature to capture unstructured decisions
- Record outcomes to build organizational learning
- Build with privacy in mind - ensure data governance policies

## 🤝 Contributing

This is Phase 1 of a larger project. Future phases include:
- Neo4j knowledge graph integration
- Advanced recommendation engine
- Analytics and memory scoring
- Multi-tenant support
- Meeting transcript integration

Enjoy building organizational memory! 🎉
