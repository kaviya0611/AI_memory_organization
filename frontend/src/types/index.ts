// Core TypeScript definitions for Organizational Decision Intelligence

export interface DatabaseStatus {
  connected: boolean;
  type: string;
  url_target: string;
  fallback_active: boolean;
  latency_ms: number;
  error?: string | null;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'disconnected';
  platform: string;
  version: string;
  database: DatabaseStatus;
  neo4j: string;
}

export interface Department {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  department_id?: string;
  description?: string;
  status?: string;
}

export interface DecisionEvidence {
  id?: string;
  evidence_type: string;
  description: string;
  source_reference?: string;
  created_at?: string;
}

export interface DecisionAlternative {
  id?: string;
  title: string;
  description?: string;
  reason_rejected?: string;
  created_at?: string;
}

export interface Outcome {
  id?: string;
  decision_id?: string;
  expected_result?: string;
  actual_result: string;
  expected_cost?: number;
  actual_cost?: number;
  expected_timeline?: string;
  actual_timeline?: string;
  variance_percentage?: number;
  outcome_status: 'Successful' | 'Partially Successful' | 'Failed' | 'Planned' | 'In Progress';
  lessons_learned?: string;
  recorded_by?: string;
  recorded_at?: string;
}

export interface Lesson {
  id?: string;
  decision_id?: string;
  title: string;
  takeaway: string;
  category?: string;
  created_at?: string;
}

export interface Decision {
  id: string;
  title: string;
  description?: string;
  decision_statement?: string;
  decision_maker?: string;
  created_by?: string;
  department_id?: string;
  project_id?: string;
  reason?: string;
  timeline?: string;
  expected_outcome?: string;
  actual_outcome?: string;
  risks?: string | string[];
  stakeholders?: string | string[];
  confidence_score: number;
  status: 'Planned' | 'In Progress' | 'Successful' | 'Partially Successful' | 'Failed' | 'Cancelled';
  source_reference?: string;
  triggers?: string;
  constraints?: string | string[];
  alternatives_considered?: string | string[];
  rejected_reasons?: Record<string, string>;
  created_at: string;
  updated_at: string;

  // Relations
  department?: Department;
  project?: Project;
  evidence_items?: DecisionEvidence[];
  alternatives?: DecisionAlternative[];
  outcomes?: Outcome[];
  lessons?: Lesson[];
}

export interface AnalyticsSummary {
  total_decisions: number;
  successful_decisions: number;
  failed_decisions: number;
  in_progress_decisions: number;
  outcomes_tracked: number;
  avg_confidence: number;
  recommendation_accuracy: number;
}

export interface CreateDecisionPayload {
  title: string;
  description?: string;
  decision_statement?: string;
  decision_maker?: string;
  department_id?: string;
  project_id?: string;
  reason?: string;
  timeline?: string;
  expected_outcome?: string;
  confidence_score?: number;
  status?: string;
}

export interface RecordOutcomePayload {
  actual_result: string;
  expected_result?: string;
  expected_cost?: number;
  actual_cost?: number;
  expected_timeline?: string;
  actual_timeline?: string;
  outcome_status: string;
  lessons_learned?: string;
  recorded_by?: string;
}
