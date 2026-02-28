-- Create clients table
create table if not exists public.clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text,
  category text not null check (category in ('Occult', 'Tech', 'Finance', 'Health', 'Other')),
  notes text,
  start_date date,
  end_date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger function: keep updated_at current on every row update
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clients_set_updated_at
  before update on public.clients
  for each row execute procedure public.set_updated_at();

-- Enable RLS
alter table public.clients enable row level security;

-- Policy: only authenticated users may access clients
create policy "Authenticated users can manage clients"
  on public.clients for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
