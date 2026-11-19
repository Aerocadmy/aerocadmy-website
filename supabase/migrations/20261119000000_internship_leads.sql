-- Partial enrolment form submissions (name + phone captured before payment) for follow-up.
create table if not exists public.internship_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  phone_key text not null,
  email text not null default '',
  batch_start date not null,
  source text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'enrolled', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (phone_key, batch_start)
);

alter table public.internship_leads enable row level security;
create policy "No public lead access" on public.internship_leads for all to anon, authenticated using (false) with check (false);
