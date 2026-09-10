import React, { useState } from 'react'
import { decisionAPI } from '../api'

export function ReportsPanel() {
  const [activeReport, setActiveReport] = useState('executive')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [exporting, setExporting] = useState(false)

  const handleGenerateReport = async (reportType) => {
    setLoading(true)
    setError(null)
    setReportData(null)

    try {
      let response
      switch (reportType) {
        case 'executive':
          response = await decisionAPI.getExecutiveSummary()
          break
        case 'history':
          response = await decisionAPI.getDecisionHistory()
          break
        case 'outcomes':
          response = await decisionAPI.getOutcomesComparison()
          break
        default:
          response = { data: {} }
      }

      setReportData(response.data)
      setActiveReport(reportType)
    } catch (err) {
      setError(
        'Failed to generate report: ' + (err.response?.data?.detail || err.message)
      )
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format) => {
    setExporting(true)
    setError(null)

    try {
      const response = await decisionAPI.exportReport(format)
      const data = response.data

      if (format === 'csv') {
        downloadFile(data.data, `decisions-export-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
      } else {
        downloadFile(
          JSON.stringify(data.data, null, 2),
          `decisions-export-${new Date().toISOString().split('T')[0]}.json`,
          'application/json'
        )
      }
    } catch (err) {
      setError('Failed to export report: ' + (err.response?.data?.detail || err.message))
    } finally {
      setExporting(false)
    }
  }

  const downloadFile = (content, filename, type) => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      {/* Report Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Export</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleGenerateReport('executive')}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeReport === 'executive'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <p className="font-semibold text-gray-900">📊 Executive Summary</p>
            <p className="text-sm text-gray-600 mt-1">Key metrics overview</p>
          </button>

          <button
            onClick={() => handleGenerateReport('history')}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeReport === 'history'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <p className="font-semibold text-gray-900">📚 Decision History</p>
            <p className="text-sm text-gray-600 mt-1">Detailed decision list</p>
          </button>

          <button
            onClick={() => handleGenerateReport('outcomes')}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeReport === 'outcomes'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <p className="font-semibold text-gray-900">🎯 Outcomes Comparison</p>
            <p className="text-sm text-gray-600 mt-1">Expected vs actual</p>
          </button>
        </div>

        {/* Report Content */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-600">Generating report...</div>
        ) : reportData ? (
          <div className="space-y-6">
            {/* Executive Summary Report */}
            {activeReport === 'executive' && reportData.key_metrics && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Decisions</p>
                    <p className="text-2xl font-bold text-blue-700 mt-2">
                      {reportData.key_metrics.total_decisions}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">With Outcomes</p>
                    <p className="text-2xl font-bold text-green-700 mt-2">
                      {reportData.key_metrics.decisions_with_outcomes}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Tracking Rate</p>
                    <p className="text-2xl font-bold text-purple-700 mt-2">
                      {reportData.key_metrics.outcome_tracking_rate}%
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Avg Confidence</p>
                    <p className="text-2xl font-bold text-yellow-700 mt-2">
                      {(reportData.key_metrics.avg_confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {reportData.status_breakdown && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-3">Status Breakdown</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(reportData.status_breakdown).map(([status, count]) => (
                        <div key={status} className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-sm text-gray-600 capitalize">
                            {status.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xl font-bold text-gray-900 mt-1">{count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {reportData.confidence_insights && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">Confidence Insights</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>
                        • High Confidence: {reportData.confidence_insights.high_confidence_decisions}
                      </li>
                      <li>
                        • Low Confidence: {reportData.confidence_insights.low_confidence_decisions}
                      </li>
                      <li>
                        • Needs Review: {reportData.confidence_insights.needs_review}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Decision History Report */}
            {activeReport === 'history' && reportData.decisions && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Total decisions: {reportData.total_decisions}
                </p>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {reportData.decisions.map((decision) => (
                    <div key={decision.id} className="bg-gray-50 p-3 rounded border border-gray-200">
                      <p className="font-semibold text-gray-900">{decision.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{decision.decision_statement}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Status: {decision.status}</span>
                        <span>Confidence: {(decision.confidence_score * 100).toFixed(0)}%</span>
                        <span>{new Date(decision.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outcomes Comparison Report */}
            {activeReport === 'outcomes' && reportData.comparisons && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Decisions with outcomes: {reportData.total_with_outcomes}
                </p>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {reportData.comparisons.map((comparison) => (
                    <div key={comparison.decision_id} className="bg-gray-50 p-3 rounded border border-gray-200">
                      <p className="font-semibold text-gray-900">{comparison.title}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="text-gray-600">
                          <strong>Expected:</strong> {comparison.expected_outcome}
                        </p>
                        <p className="text-green-700">
                          <strong>Actual:</strong> {comparison.actual_outcome}
                        </p>
                        {comparison.alignment_score !== undefined && (
                          <p className="text-blue-600">
                            <strong>Alignment:</strong> {(comparison.alignment_score * 100).toFixed(0)}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <div className="flex gap-3">
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
          >
            {exporting ? '⏳ Exporting...' : '📥 Export as CSV'}
          </button>
          <button
            onClick={() => handleExport('json')}
            disabled={exporting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
          >
            {exporting ? '⏳ Exporting...' : '📥 Export as JSON'}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Export all decisions and analytics to use in external tools or for backup
        </p>
      </div>
    </div>
  )
}
