-- Create clients table
create table if not exists public.clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text,
  category text not null check (category in ('Occult', 'Tech', 'Finance', 'Health', 'Other')),
  notes text,
  start_date date,
  end_date date,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.clients enable row level security;

-- Prototype policy: allows all operations without authentication.
-- Before deploying to production, replace this with user-scoped policies, e.g.:
--   create policy "Users manage own clients" on public.clients
--     for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Allow all" on public.clients for all using (true) with check (true);
