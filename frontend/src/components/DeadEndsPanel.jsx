import React, { useState, useEffect } from 'react'
import { decisionAPI } from '../api'

export function DeadEndsPanel() {
  const [deadEnds, setDeadEnds] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    attempted_solution: '',
    root_cause_of_failure: '',
    cost_of_failure: '₹15 lakh',
    retry_conditions: 'Do NOT retry unless prerequisite ISO audit obtained',
    department_id: 'Procurement',
  })

  useEffect(() => {
    loadDeadEnds()
  }, [])

  const loadDeadEnds = async () => {
    setLoading(true)
    try {
      const res = await decisionAPI.getDeadEnds()
      setDeadEnds(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await decisionAPI.createDeadEnd(formData)
      setShowAddModal(false)
      loadDeadEnds()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-700 via-stone-800 to-zinc-900 text-white p-6 rounded-xl shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 bg-red-950/60 px-3 py-1 rounded-full text-xs font-semibold text-red-300 border border-red-800 mb-2">
              <span>🚫 Feature 3</span>
              <span>•</span>
              <span>Capturing Failures & 'Do NOT Retry' Warnings</span>
            </div>
            <h2 className="text-2xl font-bold">Dead Ends Repository</h2>
            <p className="text-stone-300 text-sm mt-1 max-w-3xl">
              Organizations repeat costly failed experiments because they only document what worked. Our platform stores what failed, why it failed, how much it cost, and when it should never be retried.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-lg text-xs shadow transition"
          >
            + Register Dead End Anti-Pattern
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading dead ends repository...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deadEnds.map((de) => (
            <div
              key={de.id}
              className="bg-white rounded-xl shadow-sm border border-red-200 p-5 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-gray-100 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">
                      {de.topic}
                    </span>
                    <h4 className="font-bold text-gray-900 text-base mt-1">
                      {de.attempted_solution}
                    </h4>
                  </div>
                  <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full whitespace-nowrap">
                    🛡️ Do NOT Retry
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-700 mb-4">
                  <div>
                    <strong className="text-red-900 block">Root Cause of Failure:</strong>
                    <p className="text-gray-800 mt-0.5">{de.root_cause_of_failure}</p>
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded border border-gray-200">
                    <span className="text-gray-500 font-semibold">Cost of Failure:</span>
                    <span className="font-bold text-red-600">{de.cost_of_failure || 'Undisclosed'}</span>
                  </div>

                  <div>
                    <strong className="text-amber-800 block">Conditions to Retry:</strong>
                    <p className="text-gray-600 italic mt-0.5">{de.retry_conditions}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>Failed Date: {de.failure_date || 'Archived'}</span>
                <span>Department: {de.department_id || 'General'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">Record New Dead End Anti-Pattern</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Topic / Category:</label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g. Supplier Evaluation / Cloud Architecture"
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Attempted Solution (What Failed?):</label>
                <input
                  type="text"
                  required
                  value={formData.attempted_solution}
                  onChange={(e) => setFormData({ ...formData, attempted_solution: e.target.value })}
                  placeholder="e.g. Single-supplier sole sourcing for Q3"
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Root Cause of Failure:</label>
                <textarea
                  rows={2}
                  required
                  value={formData.root_cause_of_failure}
                  onChange={(e) => setFormData({ ...formData, root_cause_of_failure: e.target.value })}
                  placeholder="Why did it fail?"
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cost of Failure:</label>
                  <input
                    type="text"
                    value={formData.cost_of_failure}
                    onChange={(e) => setFormData({ ...formData, cost_of_failure: e.target.value })}
                    placeholder="e.g. ₹25 lakh"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Department:</label>
                  <input
                    type="text"
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Conditions Under Which It Could Work:</label>
                <input
                  type="text"
                  value={formData.retry_conditions}
                  onChange={(e) => setFormData({ ...formData, retry_conditions: e.target.value })}
                  placeholder="e.g. Do NOT retry unless ISO 9001 certified"
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
                >
                  Save to Dead Ends
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
