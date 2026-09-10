# Testing Guide - Organizational Memory Platform

## Manual Testing Checklist for Phase 1 MVP

### Backend API Testing

#### 1. Health Check
```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy"}
```

#### 2. Create Decision
```bash
curl -X POST http://localhost:8000/api/decisions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Move to Cloud Infrastructure",
    "decision_statement": "Migrate all on-premise servers to AWS",
    "reasoning": "Better scalability, lower maintenance costs, improved disaster recovery",
    "stakeholders": ["DevOps Lead", "CTO", "Finance Manager"],
    "risks": ["Migration downtime", "Data transfer costs", "Team learning curve"],
    "expected_outcome": "30% reduction in infrastructure costs, improved uptime",
    "department_id": "IT",
    "created_by": "John Smith"
  }'
```

Expected Response (201 Created):
```json
{
  "id": "uuid-string",
  "title": "Move to Cloud Infrastructure",
  "status": "pending_review",
  "confidence_score": 0.0,
  "created_at": "2026-09-10T10:00:00",
  "updated_at": "2026-09-10T10:00:00",
  ...
}
```

#### 3. List Decisions
```bash
curl http://localhost:8000/api/decisions?limit=10
```

#### 4. Get Single Decision
```bash
curl http://localhost:8000/api/decisions/{decision_id}
```

#### 5. AI Extraction Test
```bash
curl -X POST http://localhost:8000/api/decisions/extract \
  -H "Content-Type: application/json" \
  -d '{
    "text": "In yesterdays board meeting, we decided to launch our SaaS product in Q1 2024 because market research shows strong demand. Sarah from Product, Mike from Engineering, and Lisa from Marketing were present. We are concerned about competition and resource constraints. We expect to capture 15% market share within the first year and generate $2M in revenue.",
    "source_type": "email"
  }'
```

Expected Response:
```json
{
  "decision_statement": "Launch SaaS product in Q1 2024",
  "reasoning": "Market research shows strong demand",
  "stakeholders": ["Sarah", "Mike", "Lisa"],
  "risks": ["Competition", "Resource constraints"],
  "expected_outcome": "15% market share, $2M revenue",
  "confidence_score": 0.87,
  "extraction_notes": "Extracted from email"
}
```

#### 6. Update Decision
```bash
curl -X PATCH http://localhost:8000/api/decisions/{decision_id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "actual_outcome": "Project completed on time, 25% under budget"
  }'
```

#### 7. Record Outcome
```bash
curl -X POST http://localhost:8000/api/decisions/{decision_id}/outcome \
  -H "Content-Type: application/json" \
  -d '{"actual_outcome": "Successfully migrated to AWS, saved 32% on costs"}'
```

#### 8. Filter by Status
```bash
curl http://localhost:8000/api/decisions?status=approved&limit=10
```

### Frontend UI Testing

#### 1. Navigation
- [ ] Header renders correctly
- [ ] Tab navigation (New Decision / View Decisions) works
- [ ] Page loads without errors

#### 2. Create Decision Form
- [ ] All form fields render
- [ ] Form validation works (required fields)
- [ ] Form submission succeeds
- [ ] Success message appears
- [ ] Form clears after submission
- [ ] Redirects to View Decisions tab

#### 3. AI Extraction Feature
- [ ] "Extract from Text" button opens modal
- [ ] Text input accepts paste content
- [ ] Extract button calls API
- [ ] Form auto-populates with extracted data
- [ ] Confidence score displays
- [ ] Cancel button closes modal

#### 4. Decision List View
- [ ] List loads and displays decisions
- [ ] Each decision shows: title, status, reasoning, stakeholders
- [ ] Date shows "time ago" format
- [ ] Filter by status works
- [ ] Status badges show correct color
- [ ] Confidence scores display for extracted decisions

#### 5. Responsive Design
- [ ] Desktop layout (1920x1080)
- [ ] Tablet layout (768x1024)
- [ ] Mobile layout (375x667)
- [ ] Touch interactions work on mobile
- [ ] Forms are usable on all sizes

### Integration Testing

#### 1. End-to-End Flow
1. [ ] Open http://localhost:3000
2. [ ] Fill decision form manually
3. [ ] Click Save Decision
4. [ ] Verify decision appears in list
5. [ ] Update decision with outcome
6. [ ] Verify update reflected in UI

#### 2. Extraction End-to-End
1. [ ] Open http://localhost:3000
2. [ ] Click "Extract from Text"
3. [ ] Paste sample email text
4. [ ] Click Extract Decision
5. [ ] Verify form auto-populates
6. [ ] Save decision
7. [ ] Verify in list with confidence score

#### 3. Database Persistence
1. [ ] Create a decision
2. [ ] Refresh page (F5)
3. [ ] Verify decision still in list
4. [ ] Decision data intact

### API Contract Testing

#### Database Model Validation
- [ ] All UUID fields are valid UUIDs
- [ ] Timestamps are ISO 8601 format
- [ ] Confidence score is 0.0-1.0 range
- [ ] Status is one of: pending_review, approved, archived
- [ ] Arrays (stakeholders, risks) parse correctly from JSON

### Error Handling Tests

#### 1. Missing Required Fields
```bash
curl -X POST http://localhost:8000/api/decisions \
  -H "Content-Type: application/json" \
  -d '{"title": "Missing decision_statement"}'
# Expected: 400 Bad Request
```

#### 2. Invalid Extraction Request
```bash
curl -X POST http://localhost:8000/api/decisions/extract \
  -H "Content-Type: application/json" \
  -d '{"text": "Too short"}'
# Expected: 400 Bad Request
```

#### 3. Not Found
```bash
curl http://localhost:8000/api/decisions/invalid-uuid
# Expected: 404 Not Found
```

#### 4. Database Connection Error
- [ ] Start without database
- [ ] Verify graceful error message
- [ ] Logs show database error

### Performance Tests

#### 1. Load Testing
```bash
# Create 100 decisions
for i in {1..100}; do
  curl -X POST http://localhost:8000/api/decisions \
    -H "Content-Type: application/json" \
    -d "{\"title\": \"Decision $i\", \"decision_statement\": \"Test statement $i\"}"
done

# List should handle 100 records
curl http://localhost:8000/api/decisions?limit=100
```

#### 2. Response Time
- [ ] Create decision: < 500ms
- [ ] List decisions: < 1s (for 100 records)
- [ ] Extraction: < 5s (depends on OpenAI API)

### Security Tests (Future)

- [ ] CORS headers correct
- [ ] No sensitive data in logs
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized

## Automated Testing (Future)

### Unit Tests
```bash
cd backend
pytest tests/unit/
```

### Integration Tests
```bash
pytest tests/integration/
```

### E2E Tests
```bash
cd frontend
npm run test:e2e
```

## Reporting Issues

When testing, if you find issues:
1. Record the exact steps to reproduce
2. Note expected vs actual behavior
3. Check browser console for errors
4. Check backend logs: `docker-compose logs backend`
5. Check database: `docker exec -it org_memory_db psql -U postgres -d org_memory`

## Sample Data for Testing

### Sample Email (for extraction)
```
Subject: Q1 Strategy Update

Hi Team,

In today's executive meeting, we decided to pivot our marketing strategy to focus on enterprise customers 
instead of SMBs because market analysis shows higher lifetime value and better retention rates. 

Present: Sarah (CMO), Mike (Sales), Jennifer (Product), and I. We're concerned about the sales team's 
ability to handle enterprise sales processes and longer sales cycles. We expect this change to increase 
average deal size by 300% and reduce churn by 25%.

Let's reconvene in 2 weeks to discuss implementation.

Best,
John
```

### Sample Meeting Notes
```
PROCUREMENT TEAM MEETING - 2026-09-10

Decision: Switch primary office supplier to GreenOffice Co.

Reasoning: 
- 20% cost savings on supplies
- Sustainability alignment with company values
- Better customer service rating

Attendees: Lisa (Procurement Lead), Tom (Finance), Rachel (Ops)

Risks:
- New vendor reliability unknown
- Employee preference for current supplier
- Transition time needed

Expected Outcome: $50K annual savings + improved sustainability metrics
```

## Test Report Template

```
Date: 2026-09-10
Tester: [Name]
Environment: [Local/Staging/Docker]
Browser: [Chrome/Firefox/Safari]
OS: [Windows/macOS/Linux]

Passed: XX tests
Failed: X tests
Skipped: X tests

Issues Found:
- [Issue 1]
- [Issue 2]

Notes: [Any additional observations]
```
