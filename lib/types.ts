export type Category = 'Occult' | 'Tech' | 'Finance' | 'Health' | 'Other'

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  category: Category
  notes: string | null
  start_date: string | null
  end_date: string
  created_at: string
  updated_at?: string | null
}
