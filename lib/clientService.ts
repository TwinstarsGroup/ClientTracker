import { supabase, isSupabaseConfigured } from './supabaseClient'
import { Client } from './types'

export async function getClients(): Promise<Client[]> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured')
  }
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('end_date', { ascending: true })

  if (error) throw error
  return data || []
}

export async function addClient(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured')
  }
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteClient(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured')
  }
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) throw error
}
