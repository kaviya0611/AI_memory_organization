import React, { useState, useEffect } from 'react'
import { decisionAPI } from '../api'

export function CrossDepartmentGraph() {
  const [dependencies, setDependencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDependencies()
  }, [])

  const loadDependencies = async () => {
    setLoading(true)
    try {
      const res = await decisionAPI.getDepartmentDependencies()
      setDependencies(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const departments = [
    { name: 'Sales', icon: '💼', color: 'border-blue-500 bg-blue-50 text-blue-900' },
    { name: 'Supply Chain', icon: '🚚', color: 'border-indigo-500 bg-indigo-50 text-indigo-900' },
    { name: 'Finance', icon: '💰', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
    { name: 'Operations', icon: '⚙️', color: 'border-amber-500 bg-amber-50 text-amber-900' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-cyan-900 text-white p-6 rounded-xl shadow-md">
        <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <span>🔗 Feature 12</span>
          <span>•</span>
          <span>Breaking Departmental Silos</span>
        </div>
        <h2 className="text-2xl font-bold">Cross-Department Decision Connections</h2>
        <p className="text-cyan-100 text-sm mt-1 max-w-3xl">
          Decisions are rarely isolated. Our platform establishes active dependency links across Sales, Supply Chain, Finance, and Operations — proactively warning teams before a Sales promise breaks an Operations SLA or Supply Chain inventory limit.
        </p>
      </div>

      {/* Visual Department Nodes Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
          Active Connected Departments:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {departments.map((dept, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border-2 ${dept.color} flex items-center space-x-3 shadow-sm`}
            >
              <span className="text-3xl">{dept.icon}</span>
              <div>
                <h4 className="font-bold text-sm">{dept.name}</h4>
                <span className="text-[11px] opacity-75">Active Nodes: 12+</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dependency Conflict Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">
            Monitored Inter-Department Constraints & Conflicts:
          </h3>
          <span className="text-xs bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full border border-red-200">
            {dependencies.filter((d) => d.has_conflict).length} Live Conflicts Detected
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading cross-department dependency graph...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dependencies.map((dep) => (
              <div
                key={dep.id}
                className={`bg-white rounded-xl shadow-sm border p-5 space-y-3 transition ${
                  dep.has_conflict
                    ? 'border-red-300 ring-2 ring-red-100'
                    : 'border-gray-200'
                }`}
              >
                {/* Connector Header */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center space-x-2 text-xs font-bold">
                    <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded">
                      {dep.source_department}
                    </span>
                    <span className="text-indigo-600 font-bold">➔</span>
                    <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded">
                      {dep.target_department}
                    </span>
                  </div>

                  {dep.has_conflict ? (
                    <span className="bg-red-100 text-red-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-red-300 flex items-center">
                      <span className="mr-1">⚠️</span> Active Conflict
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-emerald-300">
                      ✓ Harmonized
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-gray-900 text-sm">{dep.title}</h4>
                <p className="text-xs text-gray-600">{dep.description}</p>

                {/* Constraint details */}
                <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-500">State / Limit:</span>
                    <span className="font-semibold text-gray-900">{dep.current_metric}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Threshold:</span>
                    <span className="font-semibold text-gray-900">{dep.constraint_limit}</span>
                  </div>
                </div>

                {/* Conflict Alert Box */}
                {dep.has_conflict && dep.conflict_message && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-2.5 rounded-r text-xs text-red-900 font-medium leading-relaxed">
                    <strong>Guardrail Alert:</strong> {dep.conflict_message}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
