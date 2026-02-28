'use client'

import { Client, Category } from '@/lib/types'

// Number of days before end_date at which a client is considered "Due soon"
const DUE_SOON_DAYS = 14

interface ClientCardProps {
  client: Client
  onDelete?: (id: string) => void
  onEdit?: (client: Client) => void
}

const categoryStyles: Record<Category, { badge: string; dot: string }> = {
  Occult:  { badge: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
  Tech:    { badge: 'bg-blue-100 text-blue-800 border-blue-200',       dot: 'bg-blue-500'   },
  Finance: { badge: 'bg-green-100 text-green-800 border-green-200',    dot: 'bg-green-500'  },
  Health:  { badge: 'bg-red-100 text-red-800 border-red-200',          dot: 'bg-red-500'    },
  Other:   { badge: 'bg-gray-100 text-gray-700 border-gray-200',       dot: 'bg-gray-400'   },
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  // Parse YYYY-MM-DD without timezone shift by splitting parts
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatTimestamp(ts: string | null | undefined): string {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

type StatusInfo = { label: string; classes: string }

function getStatus(endDate: string): StatusInfo {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // Parse YYYY-MM-DD without timezone shift (same technique as formatDate)
  const [year, month, day] = endDate.split('-').map(Number)
  const end = new Date(year, month - 1, day)
  const diffDays = Math.floor((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { label: 'Overdue', classes: 'bg-red-100 text-red-700 border-red-200' }
  }
  if (diffDays <= DUE_SOON_DAYS) {
    return { label: 'Due soon', classes: 'bg-amber-100 text-amber-700 border-amber-200' }
  }
  return { label: 'Active', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
}

export default function ClientCard({ client, onDelete, onEdit }: ClientCardProps) {
  const styles = categoryStyles[client.category] ?? categoryStyles.Other
  const status = getStatus(client.end_date)

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-gray-300">
      {/* Action buttons */}
      <div className="absolute right-3 top-3 hidden items-center gap-1 group-hover:flex">
        {onEdit && (
          <button
            onClick={() => onEdit(client)}
            className="rounded-md p-1 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-500"
            aria-label="Edit client"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(client.id)}
            className="rounded-md p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Delete client"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Name + badges */}
      <div className="flex items-start gap-2 pr-16">
        <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${styles.dot}`} />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900">{client.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
              {client.category}
            </span>
            <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${status.classes}`}>
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-1 text-xs text-gray-500">
        {client.email && (
          <div className="flex items-center gap-1.5 truncate">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{client.phone}</span>
          </div>
        )}
      </div>

      {/* Notes preview */}
      {client.notes && (
        <p className="line-clamp-2 text-xs text-gray-400 italic">{client.notes}</p>
      )}

      {/* Dates + updated_at */}
      <div className="mt-auto space-y-1 border-t border-gray-100 pt-2 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <span>
            <span className="font-medium text-gray-500">Start:</span> {formatDate(client.start_date)}
          </span>
          <span>
            <span className="font-medium text-gray-500">End:</span> {formatDate(client.end_date)}
          </span>
        </div>
        {client.updated_at && (
          <div className="text-right">
            Updated: {formatTimestamp(client.updated_at)}
          </div>
        )}
      </div>
    </div>
  )
}
