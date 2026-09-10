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

  // Record outcome
  recordOutcome: (id, actualOutcome) =>
    api.post(`/decisions/${id}/outcome`, {
      actual_outcome: actualOutcome,
    }),

  // Get recommendations for a decision statement
  getRecommendations: (decisionStatement) =>
    api.post('/decisions/recommendations/search', null, {
      params: { decision_statement: decisionStatement },
    }),

  // Get organizational memory score
  getMemoryScore: () =>
    api.get('/decisions/analytics/memory-score'),

  // Get department statistics
  getDepartmentStats: (departmentId) =>
    api.get(`/decisions/${departmentId}/stats`),

  // Phase 3: Advanced Analytics
  
  // Get decision trends
  getDecisionTrends: (period = 'month', limit = 12) =>
    api.get('/decisions/analytics/trends', {
      params: { period, limit },
    }),

  // Get success rate metrics
  getSuccessRate: (departmentId = null, statusFilter = null) =>
    api.get('/decisions/analytics/success-rate', {
      params: { department_id: departmentId, status_filter: statusFilter },
    }),

  // Get status distribution
  getStatusDistribution: (departmentId = null) =>
    api.get('/decisions/analytics/status-distribution', {
      params: { department_id: departmentId },
    }),

  // Get department comparison
  getDepartmentComparison: () =>
    api.get('/decisions/analytics/department-comparison'),

  // Get confidence distribution
  getConfidenceDistribution: () =>
    api.get('/decisions/analytics/confidence-distribution'),

  // Get decision comparison (expected vs actual)
  getDecisionComparison: (decisionId) =>
    api.get(`/decisions/${decisionId}/comparison`),

  // Phase 3: Reports
  
  // Get decision history report
  getDecisionHistory: (departmentId = null, statusFilter = null, includeOutcomes = true) =>
    api.get('/decisions/reports/decision-history', {
      params: { department_id: departmentId, status_filter: statusFilter, include_outcomes: includeOutcomes },
    }),

  // Get outcomes comparison report
  getOutcomesComparison: (departmentId = null) =>
    api.get('/decisions/reports/outcomes-comparison', {
      params: { department_id: departmentId },
    }),

  // Get executive summary
  getExecutiveSummary: (departmentId = null) =>
    api.get('/decisions/reports/executive-summary', {
      params: { department_id: departmentId },
    }),

  // Export report
  exportReport: (format = 'json', departmentId = null) =>
    api.get('/decisions/reports/export', {
      params: { format, department_id: departmentId },
    }),
}

export default api
