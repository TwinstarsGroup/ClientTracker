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

export async function addClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
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

export async function updateClient(
  id: string,
  updates: { notes: string | null; end_date: string }
): Promise<Client> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured')
  }
  const { data, error } = await supabase
    .from('clients')
    .update({ notes: updates.notes, end_date: updates.end_date })
    .eq('id', id)
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

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
