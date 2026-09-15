import axios from 'axios';
import {
  Decision,
  Department,
  Project,
  SystemHealth,
  AnalyticsSummary,
  CreateDecisionPayload,
  RecordOutcomePayload,
  Outcome
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // System & Health
  async getHealth(): Promise<SystemHealth> {
    const res = await apiClient.get<SystemHealth>('/health');
    return res.data;
  },

  // Decisions CRUD
  async getDecisions(params?: { department?: string; status?: string }): Promise<Decision[]> {
    const res = await apiClient.get<Decision[]>('/api/decisions/', { params });
    return res.data;
  },

  async getDecision(id: string): Promise<Decision> {
    const res = await apiClient.get<Decision>(`/api/decisions/${id}`);
    return res.data;
  },

  async createDecision(payload: CreateDecisionPayload): Promise<Decision> {
    // Fill required decision_statement if missing
    const body = {
      ...payload,
      decision_statement: payload.decision_statement || payload.title,
    };
    const res = await apiClient.post<Decision>('/api/decisions/', body);
    return res.data;
  },

  async recordOutcome(decisionId: string, payload: RecordOutcomePayload): Promise<Outcome> {
    const res = await apiClient.post<Outcome>(`/api/decisions/${decisionId}/outcome`, payload);
    return res.data;
  },

  // Organization Metadata
  async getDepartments(): Promise<Department[]> {
    const res = await apiClient.get<Department[]>('/api/departments');
    return res.data;
  },

  async getProjects(): Promise<Project[]> {
    const res = await apiClient.get<Project[]>('/api/projects');
    return res.data;
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary> {
    const res = await apiClient.get<AnalyticsSummary>('/api/analytics');
    return res.data;
  },
};

export default api;
