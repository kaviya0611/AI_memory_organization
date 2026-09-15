import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  Layers,
  FileText,
  Building,
  Target,
  ChevronRight,
  X,
  Sparkles,
  Server,
  Activity,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { api } from './services/api';
import {
  Decision,
  Department,
  Project,
  SystemHealth,
  AnalyticsSummary,
  CreateDecisionPayload,
  RecordOutcomePayload
} from './types';

export function App() {
  // State
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Selected Decision for Detail View
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState<boolean>(false);

  // Form states
  const [newDecision, setNewDecision] = useState<CreateDecisionPayload>({
    title: '',
    decision_maker: 'Enterprise Architect',
    department_id: 'Engineering',
    project_id: '',
    reason: '',
    timeline: '6 months',
    expected_outcome: '',
    confidence_score: 0.85,
    status: 'In Progress'
  });

  const [outcomeForm, setOutcomeForm] = useState<RecordOutcomePayload>({
    actual_result: '',
    expected_result: '',
    expected_cost: 50,
    actual_cost: 50,
    expected_timeline: '6 months',
    actual_timeline: '6 months',
    outcome_status: 'Successful',
    lessons_learned: '',
    recorded_by: 'Decision Reviewer'
  });

  // Load all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hData, dData, deptsData, projsData, aData] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getDecisions().catch(() => []),
        api.getDepartments().catch(() => []),
        api.getProjects().catch(() => []),
        api.getAnalytics().catch(() => null)
      ]);

      if (hData) setHealth(hData);
      setDecisions(dData);
      setDepartments(deptsData);
      setProjects(projsData);
      if (aData) setAnalytics(aData);
    } catch (err: any) {
      setError(err.message || 'Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Create Decision Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecision.title.trim()) return;

    try {
      await api.createDecision(newDecision);
      setShowCreateModal(false);
      setNewDecision({
        title: '',
        decision_maker: 'Enterprise Architect',
        department_id: 'Engineering',
        project_id: '',
        reason: '',
        timeline: '6 months',
        expected_outcome: '',
        confidence_score: 0.85,
        status: 'In Progress'
      });
      fetchData();
    } catch (err: any) {
      alert('Error saving decision: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Handle Record Outcome Submit
  const handleOutcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDecision || !outcomeForm.actual_result.trim()) return;

    try {
      await api.recordOutcome(selectedDecision.id, outcomeForm);
      setShowOutcomeModal(false);
      // Refresh selected decision and list
      const updated = await api.getDecision(selectedDecision.id);
      setSelectedDecision(updated);
      fetchData();
    } catch (err: any) {
      alert('Error recording outcome: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Filtered decisions list
  const filteredDecisions = decisions.filter(d => {
    const matchesSearch =
      (d.title && d.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.decision_maker && d.decision_maker.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.reason && d.reason.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'all' || d.department_id === selectedDept;
    const matchesStatus = selectedStatus === 'all' || d.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Successful':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Successful</span>;
      case 'Partially Successful':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800"><TrendingUp className="w-3 h-3 mr-1" /> Partially Successful</span>;
      case 'Failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800"><AlertTriangle className="w-3 h-3 mr-1" /> Failed</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800"><Clock className="w-3 h-3 mr-1" /> In Progress</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Enterprise Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">Organizational Decision Intelligence</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">Full-Stack Core</span>
              </div>
              <p className="text-xs text-slate-400">Decision Memory • Provenance • Feedback Loops</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Database Health Pill */}
            {health ? (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                <span className={`w-2 h-2 rounded-full ${health.database.connected ? (health.database.fallback_active ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400') : 'bg-rose-500'}`} />
                <span className="font-medium text-slate-300 capitalize">{health.database.type}</span>
                {health.database.fallback_active && (
                  <span className="text-[10px] text-amber-300 bg-amber-950/60 px-1 rounded border border-amber-800/40">Fallback</span>
                )}
                <span className="text-slate-500 text-[11px]">{health.database.latency_ms}ms</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-400">
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>Connecting...</span>
              </div>
            )}

            <button
              onClick={fetchData}
              title="Refresh Data"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Record Decision</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Feedback Loop Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-800/40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-indigo-900/50 text-indigo-400 border border-indigo-700/50">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Closed-Loop Organizational Memory Architecture</h2>
                <p className="text-xs text-slate-400">Answers "Why was the decision made?", tracks expected vs actual outcomes, and persists lessons.</p>
              </div>
            </div>

            {/* Loop Steps */}
            <div className="flex items-center space-x-1 sm:space-x-2 text-[11px] font-medium text-slate-400 overflow-x-auto py-1">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">1. Decision</span>
              <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">2. Reason & Evidence</span>
              <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">3. Expected Outcome</span>
              <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              <span className="px-2 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60">4. Actual Outcome</span>
              <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">5. Learned Memory</span>
            </div>
          </div>
        </div>

        {/* KPI Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Total Decisions</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">{analytics?.total_decisions ?? decisions.length}</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Full memory records</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Successful</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-emerald-400">{analytics?.successful_decisions ?? 0}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Validated positive ROI</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">In Progress</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-amber-400">{analytics?.in_progress_decisions ?? 0}</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Active deployments</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Failed / Dead Ends</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-rose-400">{analytics?.failed_decisions ?? 0}</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Anti-patterns recorded</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Tracked Outcomes</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-cyan-400">{analytics?.outcomes_tracked ?? 0}</span>
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Expected vs actual paired</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Decision Confidence</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-indigo-400">{Math.round((analytics?.avg_confidence ?? 0.85) * 100)}%</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Avg empirical backing</span>
          </div>
        </div>

        {/* Filter and Search Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search decisions, reasons, decision makers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800/90 border border-slate-700 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800/90 border border-slate-700 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Successful">Successful</option>
              <option value="In Progress">In Progress</option>
              <option value="Failed">Failed</option>
              <option value="Partially Successful">Partially Successful</option>
            </select>
          </div>
        </div>

        {/* Decisions Explorer & Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Decisions List Column */}
          <div className={`space-y-3 ${selectedDecision ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Decision Memory Catalog ({filteredDecisions.length})
              </h3>
              <span className="text-xs text-slate-500">Click a decision to inspect feedback loop</span>
            </div>

            {loading && decisions.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                <Activity className="w-8 h-8 mx-auto animate-spin mb-3 text-indigo-400" />
                <p>Loading enterprise decision records...</p>
              </div>
            ) : filteredDecisions.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                <p className="text-sm font-medium">No decisions matching current filters.</p>
              </div>
            ) : (
              filteredDecisions.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDecision(d)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer ${
                    selectedDecision?.id === d.id
                      ? 'bg-slate-900/95 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/50'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                          {d.department_id || 'Enterprise'}
                        </span>
                        {getStatusBadge(d.status)}
                      </div>
                      <h4 className="text-base font-semibold text-white mt-2 leading-snug">{d.title}</h4>
                      {d.reason && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          <strong className="text-slate-300">Reason:</strong> {d.reason}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-indigo-400">
                        {Math.round(d.confidence_score * 100)}% Conf
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-1">
                        {new Date(d.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <span className="text-slate-500">By:</span>
                      <strong className="text-slate-300">{d.decision_maker || 'Architect'}</strong>
                    </span>
                    <span className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300">
                      <span>View Outcome & Evidence</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Decision Detail Drawer */}
          {selectedDecision && (
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                      {selectedDecision.department_id} • {selectedDecision.project_id || 'Strategy'}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 leading-snug">{selectedDecision.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedDecision(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Why was this decision made? */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Why was this decision made?</span>
                  </h4>
                  <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 leading-relaxed">
                    {selectedDecision.reason || selectedDecision.decision_statement || 'Strategic alignment with annual operational KPIs.'}
                  </p>
                </div>

                {/* Evidence & Provenance */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Evidence & References</span>
                  </h4>
                  {selectedDecision.evidence_items && selectedDecision.evidence_items.length > 0 ? (
                    <div className="space-y-1.5">
                      {selectedDecision.evidence_items.map((ev, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-slate-800/40 border border-slate-800 text-xs">
                          <span className="text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 mr-2">
                            {ev.evidence_type}
                          </span>
                          <span className="text-slate-300">{ev.description}</span>
                          {ev.source_reference && (
                            <span className="block text-[11px] text-slate-500 mt-1">Ref: {ev.source_reference}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No formal evidence items attached.</p>
                  )}
                </div>

                {/* Alternatives Considered */}
                {selectedDecision.alternatives && selectedDecision.alternatives.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Alternatives Rejected</h4>
                    <div className="space-y-1.5">
                      {selectedDecision.alternatives.map((alt, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-800/40 border border-slate-800 text-xs">
                          <strong className="text-slate-300">{alt.title}</strong>
                          {alt.reason_rejected && (
                            <span className="block text-slate-400 mt-0.5">Rejected: {alt.reason_rejected}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expected vs Actual Outcome Feedback Loop */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                      <Target className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Expected vs. Actual Outcome</span>
                    </h4>
                    <button
                      onClick={() => {
                        setOutcomeForm({
                          actual_result: selectedDecision.actual_outcome || '',
                          expected_result: selectedDecision.expected_outcome || '',
                          expected_cost: 50,
                          actual_cost: 50,
                          expected_timeline: selectedDecision.timeline || '6 months',
                          actual_timeline: selectedDecision.timeline || '6 months',
                          outcome_status: (selectedDecision.status as any) || 'Successful',
                          lessons_learned: '',
                          recorded_by: selectedDecision.decision_maker || 'Reviewer'
                        });
                        setShowOutcomeModal(true);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      + Record Actual Outcome
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Target Expected</span>
                      <p className="text-xs text-slate-200 mt-1 leading-snug">
                        {selectedDecision.expected_outcome || '20% cost reduction within 6 months'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/60">
                      <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">Actual Result</span>
                      <p className="text-xs text-slate-100 mt-1 leading-snug">
                        {selectedDecision.actual_outcome || 'Outcome measurement pending completion.'}
                      </p>
                    </div>
                  </div>

                  {/* Lessons Learned */}
                  {selectedDecision.lessons && selectedDecision.lessons.length > 0 && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
                      <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                        Organizational Lesson Learned
                      </span>
                      <p className="text-xs text-emerald-200 mt-1">
                        {selectedDecision.lessons[0].takeaway}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Record Decision Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Record New Organizational Decision</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Decision Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Move Core Transaction Services to Multi-Region Cloud"
                  value={newDecision.title}
                  onChange={(e) => setNewDecision({ ...newDecision, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Department</label>
                  <select
                    value={newDecision.department_id}
                    onChange={(e) => setNewDecision({ ...newDecision, department_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Decision Maker</label>
                  <input
                    type="text"
                    value={newDecision.decision_maker}
                    onChange={(e) => setNewDecision({ ...newDecision, decision_maker: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Why is this decision being made? (Reason)</label>
                <textarea
                  rows={2}
                  placeholder="Primary justification, cost reduction targets, or risk mitigations..."
                  value={newDecision.reason}
                  onChange={(e) => setNewDecision({ ...newDecision, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Expected Outcome</label>
                  <input
                    type="text"
                    placeholder="e.g. 20% infra cost reduction"
                    value={newDecision.expected_outcome}
                    onChange={(e) => setNewDecision({ ...newDecision, expected_outcome: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Timeline</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 months"
                    value={newDecision.timeline}
                    onChange={(e) => setNewDecision({ ...newDecision, timeline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md"
                >
                  Save Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Outcome Modal */}
      {showOutcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Record Actual Outcome & Lesson</h3>
              <button
                onClick={() => setShowOutcomeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOutcomeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Actual Result *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What was the measurable outcome? (e.g. 16% cost reduction achieved, 1.5 month staging delay)"
                  value={outcomeForm.actual_result}
                  onChange={(e) => setOutcomeForm({ ...outcomeForm, actual_result: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Outcome Status</label>
                  <select
                    value={outcomeForm.outcome_status}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, outcome_status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Successful">Successful</option>
                    <option value="Partially Successful">Partially Successful</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Recorded By</label>
                  <input
                    type="text"
                    value={outcomeForm.recorded_by}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, recorded_by: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Key Lesson Learned for Organization</label>
                <textarea
                  rows={2}
                  placeholder="What should the organization remember or do differently in similar future decisions?"
                  value={outcomeForm.lessons_learned}
                  onChange={(e) => setOutcomeForm({ ...outcomeForm, lessons_learned: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOutcomeModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md"
                >
                  Save Outcome & Feedback Loop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
