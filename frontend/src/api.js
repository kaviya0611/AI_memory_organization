import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const decisionAPI = {
  // Create a new decision
  createDecision: (data) =>
    api.post('/decisions', data),

  // List decisions
  listDecisions: (params = {}) =>
    api.get('/decisions', { params }),

  // Get a specific decision
  getDecision: (id) =>
    api.get(`/decisions/${id}`),

  // Update a decision
  updateDecision: (id, data) =>
    api.patch(`/decisions/${id}`, data),

  // Delete/archive a decision
  deleteDecision: (id) =>
    api.delete(`/decisions/${id}`),

  // Extract decision from text
  extractDecision: (text, sourceType = 'text') =>
    api.post('/decisions/extract', {
      text,
      source_type: sourceType,
    }),

  // Feature 9: Adaptive Learning - Record outcome
  recordOutcome: (id, actualOutcome) =>
    api.post(`/decisions/${id}/outcome`, null, {
      params: { actual_outcome: actualOutcome },
    }),

  // Feature 8: Explanation-First Recommendations
  getRecommendations: (decisionStatement) =>
    api.post('/decisions/recommendations/search', null, {
      params: { decision_statement: decisionStatement },
    }),

  // Feature 5 & 4: Real-Time Guardrails & Neuro-Symbolic Logic Check
  checkGuardrails: (payload) =>
    api.post('/decisions/guardrails/check', payload),

  // Feature 6: Decision Replay Post-Mortem
  getDecisionReplay: (id) =>
    api.get(`/decisions/${id}/replay`),

  // Feature 7: Multi-Agent Simulation (Virtual Expert Council)
  simulateCouncil: (question, contextData = {}) =>
    api.post('/decisions/simulation/council', {
      question,
      context_data: contextData,
    }),

  // Feature 3: Dead Ends Repository
  getDeadEnds: () =>
    api.get('/decisions/dead-ends'),

  createDeadEnd: (data) =>
    api.post('/decisions/dead-ends', data),

  // Feature 10: Dream Mode (Nightly Self-Improving Memory)
  runDreamMode: () =>
    api.post('/decisions/dream-mode/run'),

  getLatestDreamMode: () =>
    api.get('/decisions/dream-mode/latest'),

  // Feature 12: Cross-Department Decision Connections
  getDepartmentDependencies: () =>
    api.get('/decisions/dependencies/cross-department'),

  // Enterprise Seed Data
  seedEnterpriseData: () =>
    api.post('/decisions/seed-data?force=true'),

  // Analytics & Memory Score
  getMemoryScore: () =>
    api.get('/decisions/analytics/memory-score'),

  getDepartmentStats: (departmentId) =>
    api.get(`/decisions/${departmentId}/stats`),

  getDecisionTrends: (period = 'month', limit = 12) =>
    api.get('/decisions/analytics/trends', {
      params: { period, limit },
    }),

  getSuccessRate: (departmentId = null, statusFilter = null) =>
    api.get('/decisions/analytics/success-rate', {
      params: { department_id: departmentId, status_filter: statusFilter },
    }),

  getStatusDistribution: (departmentId = null) =>
    api.get('/decisions/analytics/status-distribution', {
      params: { department_id: departmentId },
    }),

  getDepartmentComparison: () =>
    api.get('/decisions/analytics/department-comparison'),

  getConfidenceDistribution: () =>
    api.get('/decisions/analytics/confidence-distribution'),

  getDecisionComparison: (decisionId) =>
    api.get(`/decisions/${decisionId}/comparison`),

  // Reports
  getDecisionHistory: (departmentId = null, statusFilter = null, includeOutcomes = true) =>
    api.get('/decisions/reports/decision-history', {
      params: { department_id: departmentId, status_filter: statusFilter, include_outcomes: includeOutcomes },
    }),

  getOutcomesComparison: (departmentId = null) =>
    api.get('/decisions/reports/outcomes-comparison', {
      params: { department_id: departmentId },
    }),

  getExecutiveSummary: (departmentId = null) =>
    api.get('/decisions/reports/executive-summary', {
      params: { department_id: departmentId },
    }),

  exportReport: (format = 'json', departmentId = null) =>
    api.get('/decisions/reports/export', {
      params: { format, department_id: departmentId },
    }),
}

export default api
