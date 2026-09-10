import React, { useState, useEffect } from 'react'
import { decisionAPI } from '../api'
import { RecommendationPanel } from './RecommendationPanel'

export function DecisionForm({ onSuccess, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    decision_statement: '',
    reasoning: '',
    stakeholders: [],
    risks: [],
    expected_outcome: '',
    project_id: '',
    department_id: '',
    created_by: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [showExtractor, setShowExtractor] = useState(false)
  const [extractorText, setExtractorText] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleArrayAdd = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }))
  }

  const handleArrayRemove = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleExtract = async () => {
    if (!extractorText.trim()) {
      setError('Please enter text to extract from')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await decisionAPI.extractDecision(extractorText, 'text')
      setExtractedData(response.data)
      
      // Auto-populate form with extracted data
      setFormData((prev) => ({
        ...prev,
        decision_statement: response.data.decision_statement,
        reasoning: response.data.reasoning,
        stakeholders: response.data.stakeholders || [],
        risks: response.data.risks || [],
        expected_outcome: response.data.expected_outcome,
      }))
      
      setShowExtractor(false)
      setExtractorText('')
    } catch (err) {
      setError('Failed to extract decision: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await decisionAPI.createDecision(formData)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        decision_statement: '',
        reasoning: '',
        stakeholders: [],
        risks: [],
        expected_outcome: '',
        project_id: '',
        department_id: '',
        created_by: '',
      })
      setExtractedData(null)
      
      if (onSuccess) onSuccess()
    } catch (err) {
      setError('Failed to create decision: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">New Decision</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {extractedData && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold">
            ✓ Decision extracted successfully
          </p>
          <p className="text-sm text-green-600">
            Confidence: {(extractedData.confidence_score * 100).toFixed(1)}%
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quick Extract Button */}
        {!showExtractor && (
          <button
            type="button"
            onClick={() => setShowExtractor(true)}
            className="w-full py-2 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold"
          >
            + Extract from Text (Email, Meeting Notes, etc.)
          </button>
        )}

        {showExtractor && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-3">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700 mb-2 block">
                Paste Text to Extract From
              </span>
              <textarea
                value={extractorText}
                onChange={(e) => setExtractorText(e.target.value)}
                placeholder="Paste email, meeting notes, or document text here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExtract}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
              >
                {loading ? 'Extracting...' : 'Extract Decision'}
              </button>
              <button
                type="button"
                onClick={() => setShowExtractor(false)}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">
              Decision Title *
            </span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief title for this decision"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">
              Description (optional)
            </span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Context and background information"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </label>
        </div>

        {/* Decision Statement */}
        <div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">
              Decision Statement *
            </span>
            <textarea
              name="decision_statement"
              value={formData.decision_statement}
              onChange={handleInputChange}
              placeholder="What decision was made?"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            />
          </label>
        </div>

        {/* AI Recommendations */}
        {formData.decision_statement && (
          <RecommendationPanel decisionStatement={formData.decision_statement} />
        )}

        {/* Reasoning */}
        <div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">
              Reasoning
            </span>
            <textarea
              name="reasoning"
              value={formData.reasoning}
              onChange={handleInputChange}
              placeholder="Why was this decision made? What factors influenced it?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </label>
        </div>

        {/* Stakeholders */}
        <div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">
              Stakeholders
            </span>
            <div className="space-y-2">
              {formData.stakeholders.map((stakeholder, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={stakeholder}
                    onChange={(e) =>
                      handleArrayChange('stakeholders', index, e.target.value)
                    }
                    placeholder="Person or role involved"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('stakeholders', index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAdd('stakeholders')}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                + Add Stakeholder
              </button>
            </div>
          </label>
        </div>

        {/* Risks */}
        <div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">
              Risks & Concerns
            </span>
            <div className="space-y-2">
              {formData.risks.map((risk, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={risk}
                    onChange={(e) => handleArrayChange('risks', index, e.target.value)}
                    placeholder="Potential risk or concern"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('risks', index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAdd('risks')}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                + Add Risk
              </button>
            </div>
          </label>
        </div>

        {/* Expected Outcome */}
        <div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">
              Expected Outcome
            </span>
            <textarea
              name="expected_outcome"
              value={formData.expected_outcome}
              onChange={handleInputChange}
              placeholder="What do we expect this decision to achieve?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            />
          </label>
        </div>

        {/* Project ID */}
        <div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">
              Project ID (optional)
            </span>
            <input
              type="text"
              name="project_id"
              value={formData.project_id}
              onChange={handleInputChange}
              placeholder="Associated project identifier"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Department ID */}
        <div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">
              Department (optional)
            </span>
            <input
              type="text"
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              placeholder="Department name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Created By */}
        <div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">
              Created By (optional)
            </span>
            <input
              type="text"
              name="created_by"
              value={formData.created_by}
              onChange={handleInputChange}
              placeholder="Your name or identifier"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 font-semibold"
        >
          {loading ? 'Saving Decision...' : 'Save Decision'}
        </button>
      </form>
    </div>
  )
}
