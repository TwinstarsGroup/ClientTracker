# ClientTracker

A client manager prototype built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## Features

- **Category-clustered client list** — clients are automatically grouped into sections: Occult 🔮, Tech 💻, Finance 💰, Health ❤️, Other 📁
- **+ New Client modal** — fill in name, email, phone, category, start date, end date, and notes
- **Auto-sorted by end date** within each category section
- **Category filter tabs** to narrow down to a single category
- **Delete client** (hover a card to reveal the trash icon)
- **Supabase integration** for persistent storage (create, list, delete)
- **Demo mode** — when Supabase credentials are not set, sample clients are shown automatically

## Setup

### 1. Supabase database

Run the SQL in `supabase/schema.sql` inside your Supabase project's SQL editor to create the `clients` table with RLS enabled.

> **Note:** The schema ships with an open "Allow all" RLS policy suitable for prototyping. Before going to production, replace it with policies scoped to authenticated users (e.g. `auth.uid() = owner_id`).

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your project credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
app/
  layout.tsx            Root layout
  page.tsx              Home page — client list grouped by category
components/
  AddClientModal.tsx    "Add New Client" modal form
  CategorySection.tsx   Per-category section with client cards
  ClientCard.tsx        Individual client card with color-coded badge
lib/
  supabaseClient.ts     Supabase JS client + isSupabaseConfigured flag
  clientService.ts      getClients / addClient / deleteClient helpers
  types.ts              Client interface and Category union type
supabase/
  schema.sql            DDL — clients table, RLS, prototype policy
.env.example            Template for environment variables
```
