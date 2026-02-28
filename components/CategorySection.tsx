'use client'

import { Client, Category } from '@/lib/types'
import ClientCard from './ClientCard'

interface CategorySectionProps {
  category: Category
  clients: Client[]
  onDelete?: (id: string) => void
  onEdit?: (client: Client) => void
}

const sectionStyles: Record<Category, { header: string; icon: string; count: string }> = {
  Occult:  { header: 'border-purple-200 bg-purple-50',  icon: '🔮', count: 'bg-purple-200 text-purple-800' },
  Tech:    { header: 'border-blue-200 bg-blue-50',      icon: '💻', count: 'bg-blue-200 text-blue-800'     },
  Finance: { header: 'border-green-200 bg-green-50',    icon: '💰', count: 'bg-green-200 text-green-800'   },
  Health:  { header: 'border-red-200 bg-red-50',        icon: '❤️', count: 'bg-red-200 text-red-800'       },
  Other:   { header: 'border-gray-200 bg-gray-50',      icon: '📁', count: 'bg-gray-200 text-gray-700'     },
}

export default function CategorySection({ category, clients, onDelete, onEdit }: CategorySectionProps) {
  const styles = sectionStyles[category] ?? sectionStyles.Other
  const sorted = [...clients].sort((a, b) => {
    if (!a.end_date) return 1
    if (!b.end_date) return -1
    return a.end_date.localeCompare(b.end_date)
  })

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Section header */}
      <div className={`flex items-center gap-3 border-b px-5 py-3 ${styles.header}`}>
        <span className="text-xl">{styles.icon}</span>
        <h2 className="text-base font-bold text-gray-800">{category} Clients</h2>
        <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles.count}`}>
          {clients.length} {clients.length === 1 ? 'client' : 'clients'}
        </span>
      </div>

      {/* Client grid */}
      <div className="p-4">
        {sorted.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">No clients in this category yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((client) => (
              <ClientCard key={client.id} client={client} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
