create extension if not exists pgcrypto;

create table if not exists public.enrolments (
  id uuid primary key,
  token_hash text not null,
  name text not null,
  email text not null,
  phone text not null,
  order_id text unique,
  payment_id text unique,
  status text not null default 'created' check (status in ('created', 'creating', 'pending', 'paid')),
  amount integer not null default 699900,
  currency text not null default 'INR',
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  order_id text,
  payment_id text,
  payload jsonb not null,
  signature_verified boolean not null default false,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  course_title text not null,
  name text not null,
  email text not null,
  phone text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'archived')),
  created_at timestamptz not null default now(),
  contacted_at timestamptz
);

create table if not exists public.counselling_requests (
  id uuid primary key default gen_random_uuid(),
  profession text not null,
  field_of_work text not null default '',
  experience text not null,
  interest text not null,
  goal text not null,
  format text not null,
  name text not null,
  phone text not null,
  email text not null,
  callback_window text not null,
  questions text not null default '',
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed', 'not_reachable', 'closed')),
  callback_timezone text not null default 'Asia/Kolkata',
  contact_requested boolean not null default true,
  created_at timestamptz not null default now(),
  contacted_at timestamptz
);

alter table public.enrolments enable row level security;
alter table public.payment_events enable row level security;
alter table public.waitlist_entries enable row level security;
alter table public.counselling_requests enable row level security;

create policy "No public enrolment access" on public.enrolments for all to anon, authenticated using (false) with check (false);
create policy "No public payment event access" on public.payment_events for all to anon, authenticated using (false) with check (false);
create policy "No public waitlist access" on public.waitlist_entries for all to anon, authenticated using (false) with check (false);
create policy "No public counselling access" on public.counselling_requests for all to anon, authenticated using (false) with check (false);

insert into storage.buckets (id, name, public)
values ('marketing-public', 'marketing-public', true)
on conflict (id) do update set public = true;

create policy "Public marketing assets are readable"
on storage.objects for select
to public
using (bucket_id = 'marketing-public');
