import React, { useState, useEffect } from 'react'
import { decisionAPI } from '../api'

export function AnalyticsDashboard() {
  const [trends, setTrends] = useState(null)
  const [successRate, setSuccessRate] = useState(null)
  const [deptComparison, setDeptComparison] = useState(null)
  const [confidenceDistribution, setConfidenceDistribution] = useState(null)
  const [period, setPeriod] = useState('month')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const loadAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const [trendsRes, rateRes, deptRes, confRes] = await Promise.all([
        decisionAPI.getDecisionTrends(period),
        decisionAPI.getSuccessRate(),
        decisionAPI.getDepartmentComparison(),
        decisionAPI.getConfidenceDistribution(),
      ])

      setTrends(trendsRes.data)
      setSuccessRate(rateRes.data)
      setDeptComparison(deptRes.data)
      setConfidenceDistribution(confRes.data)
    } catch (err) {
      setError(
        'Failed to load analytics: ' + (err.response?.data?.detail || err.message)
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading analytics...</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
        <button
          onClick={loadAnalytics}
          className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">Last 12 Weeks</option>
          <option value="month">Last 12 Months</option>
          <option value="quarter">Last 12 Quarters</option>
          <option value="year">Last 12 Years</option>
        </select>
      </div>

      {/* Success Rate Card */}
      {successRate && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Decisions</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">
                {successRate.total_decisions}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">With Outcomes</p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {successRate.with_outcomes}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">
                {successRate.success_rate}%
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Avg Confidence</p>
              <p className="text-3xl font-bold text-yellow-700 mt-1">
                {(successRate.avg_confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
            <p>
              <strong>{successRate.pending_outcomes}</strong> decisions pending outcomes
            </p>
          </div>
        </div>
      )}

      {/* Decision Trends Chart */}
      {trends && trends.periods && trends.periods.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Decision Trends</h3>
          <div className="space-y-6">
            {/* Total Decisions Line */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Decisions Per Period</p>
              <div className="flex items-end gap-2 h-40 bg-gray-50 p-4 rounded-lg">
                {trends.total_decisions.map((count, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-500 rounded-t"
                    style={{
                      height: `${(count / Math.max(...trends.total_decisions)) * 100}%`,
                      minHeight: '4px',
                    }}
                    title={`${trends.periods[i]}: ${count} decisions`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>{trends.periods[0]}</span>
                <span>{trends.periods[trends.periods.length - 1]}</span>
              </div>
            </div>

            {/* Outcome Rate Trend */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Outcome Rate Trend (%)</p>
              <div className="flex items-end gap-2 h-40 bg-gray-50 p-4 rounded-lg">
                {trends.outcome_rate_per_period.map((rate, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-green-500 rounded-t"
                    style={{
                      height: `${rate}%`,
                      minHeight: '4px',
                    }}
                    title={`${trends.periods[i]}: ${rate}%`}
                  />
                ))}
              </div>
            </div>

            {/* Confidence Trend */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Average Confidence Trend</p>
              <div className="flex items-end gap-2 h-40 bg-gray-50 p-4 rounded-lg">
                {trends.avg_confidence_per_period.map((conf, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-purple-500 rounded-t"
                    style={{
                      height: `${(conf * 100)}%`,
                      minHeight: '4px',
                    }}
                    title={`${trends.periods[i]}: ${(conf * 100).toFixed(1)}%`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Department Comparison */}
      {deptComparison && deptComparison.departments && deptComparison.departments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900">Department</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-900">Total</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-900">With Outcomes</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-900">Success Rate</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-900">Avg Confidence</th>
                </tr>
              </thead>
              <tbody>
                {deptComparison.departments.map((dept, i) => (
                  <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900 font-medium">{dept}</td>
                    <td className="px-4 py-2 text-center">{deptComparison.total_decisions_per_dept[i]}</td>
                    <td className="px-4 py-2 text-center text-green-700">
                      {deptComparison.outcomes_per_dept[i]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded">
                        {deptComparison.success_rate_per_dept[i]}%
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {(deptComparison.avg_confidence_per_dept[i] * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confidence Distribution */}
      {confidenceDistribution && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Score Distribution</h3>
          <div className="space-y-3">
            {[
              { range: '90-100%', key: '90-100', color: 'bg-green-500' },
              { range: '75-90%', key: '75-90', color: 'bg-blue-500' },
              { range: '50-75%', key: '50-75', color: 'bg-yellow-500' },
              { range: '25-50%', key: '25-50', color: 'bg-orange-500' },
              { range: '0-25%', key: '0-25', color: 'bg-red-500' },
            ].map(({ range, key, color }) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{range}</span>
                  <span className="text-gray-600">
                    {confidenceDistribution[key]} ({confidenceDistribution.total > 0 ? 
                      ((confidenceDistribution[key] / confidenceDistribution.total) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full`}
                    style={{
                      width: `${confidenceDistribution.total > 0 ? 
                        (confidenceDistribution[key] / confidenceDistribution.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
