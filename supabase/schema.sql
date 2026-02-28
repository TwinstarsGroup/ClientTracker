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

-- Allow all operations (for prototype)
create policy "Allow all" on public.clients for all using (true) with check (true);
