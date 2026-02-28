'use client'

import { useState } from 'react'
import { updateClient } from '@/lib/clientService'
import { Client } from '@/lib/types'

interface EditClientModalProps {
  client: Client
  onClose: () => void
  onSave: (updated: Client) => void
}

export default function EditClientModal({ client, onClose, onSave }: EditClientModalProps) {
  const [notes, setNotes] = useState(client.notes ?? '')
  const [endDate, setEndDate] = useState(client.end_date)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!endDate) {
      setError('End date is required.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const updated = await updateClient(client.id, {
        notes: notes.trim() || null,
        end_date: endDate,
      })
      onSave(updated)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save changes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-gray-900 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Edit Client</h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition hover:text-white"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <p className="mb-1 text-sm font-medium text-gray-500">
              Editing: <span className="font-semibold text-gray-800">{client.name}</span>
            </p>
          </div>

          {/* End Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about this client..."
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
