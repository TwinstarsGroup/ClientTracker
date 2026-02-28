'use client'

import { useCallback, useEffect, useState } from 'react'
import { getClients, deleteClient } from '@/lib/clientService'
import { isSupabaseConfigured } from '@/lib/supabaseClient'
import { Client, Category } from '@/lib/types'
import AddClientModal from '@/components/AddClientModal'
import CategorySection from '@/components/CategorySection'

const CATEGORIES: Category[] = ['Occult', 'Tech', 'Finance', 'Health', 'Other']

const DEMO_CLIENTS: Client[] = [
  {
    id: 'demo-1',
    name: 'Morgana LeFay',
    email: 'morgana@occult.example',
    phone: '+1 555 111 2222',
    category: 'Occult',
    notes: 'Expert in lunar rituals and divination.',
    start_date: '2024-01-01',
    end_date: '2024-06-30',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'demo-2',
    name: 'Elara Moonwhisper',
    email: 'elara@occult.example',
    phone: '+1 555 333 4444',
    category: 'Occult',
    notes: 'Tarot reading and astral projection specialist.',
    start_date: '2024-02-01',
    end_date: '2024-09-15',
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'demo-3',
    name: 'Ada Lovelace',
    email: 'ada@tech.example',
    phone: '+1 555 555 6666',
    category: 'Tech',
    notes: 'Pioneering software architect.',
    start_date: '2024-01-15',
    end_date: '2024-12-31',
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'demo-4',
    name: 'Alan Turing',
    email: 'alan@tech.example',
    phone: '+1 555 777 8888',
    category: 'Tech',
    notes: 'Cryptography and computation expert.',
    start_date: '2024-03-01',
    end_date: '2024-11-30',
    created_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 'demo-5',
    name: 'Warren Buffett',
    email: 'warren@finance.example',
    phone: '+1 555 999 0000',
    category: 'Finance',
    notes: 'Value investing and portfolio management.',
    start_date: '2024-01-01',
    end_date: '2024-08-01',
    created_at: '2024-01-01T00:00:00Z',
  },
]

export default function Home() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState<Category | 'All'>('All')

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getClients()
      setClients(data)
      setIsDemo(false)
    } catch (err: unknown) {
      // If Supabase is not configured, fall back to demo data
      if (!isSupabaseConfigured) {
        setClients(DEMO_CLIENTS)
        setIsDemo(true)
      } else {
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const handleDelete = async (id: string) => {
    if (isDemo) return
    try {
      await deleteClient(id)
      setClients((prev) => prev.filter((c) => c.id !== id))
    } catch (err: unknown) {
      console.error('Delete failed:', err)
    }
  }

  const visibleCategories =
    activeFilter === 'All'
      ? CATEGORIES.filter((cat) => clients.some((c) => c.category === cat))
      : [activeFilter]

  const totalClients = clients.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">ClientTracker</h1>
              <p className="text-xs text-gray-400 leading-tight">
                {totalClients} {totalClients === 1 ? 'client' : 'clients'} across{' '}
                {CATEGORIES.filter((c) => clients.some((cl) => cl.category === c)).length} categories
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Client</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Demo banner */}
        {isDemo && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <strong>Demo mode:</strong> Supabase credentials not configured. Showing sample data.
            Set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{' '}
            <code className="rounded bg-amber-100 px-1">.env.local</code> to connect your database.
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <strong>Error:</strong> {error}
            <button
              onClick={fetchClients}
              className="ml-3 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Category filter tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          {(['All', ...CATEGORIES] as const).map((cat) => {
            const count = cat === 'All' ? clients.length : clients.filter((c) => c.category === cat).length
            const active = activeFilter === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${active ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg className="mb-3 h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Loading clients...</p>
          </div>
        ) : clients.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-24">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
              👥
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-700">No clients yet</h3>
            <p className="mb-6 text-sm text-gray-400">Add your first client to get started.</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              + New Client
            </button>
          </div>
        ) : (
          /* Category sections */
          <div className="space-y-6">
            {visibleCategories.map((cat) => {
              const catClients = clients.filter((c) => c.category === cat)
              if (catClients.length === 0 && activeFilter === 'All') return null
              return (
                <CategorySection
                  key={cat}
                  category={cat}
                  clients={catClients}
                  onDelete={isDemo ? undefined : handleDelete}
                />
              )
            })}
          </div>
        )}
      </main>

      {/* Add Client Modal */}
      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchClients}
        />
      )}
    </div>
  )
}
