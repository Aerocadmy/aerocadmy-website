-- Personal scratch-card offers: one unique code per visitor, valid for 24 hours from the scratch.
create table if not exists public.internship_scratch_offers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  token_hash text not null unique,
  discount_amount integer not null,
  batch_start date not null,
  scratched_at timestamptz not null default now(),
  expires_at timestamptz not null
);

alter table public.internship_scratch_offers enable row level security;
create policy "No public scratch offer access" on public.internship_scratch_offers for all to anon, authenticated using (false) with check (false);

-- Funnel: offers scratched -> reached checkout with the code -> paid.
-- Usage: select * from public.internship_scratch_funnel;
create or replace view public.internship_scratch_funnel with (security_invoker = true) as
select
  o.batch_start,
  count(distinct o.id) as scratched,
  count(distinct e.id) as reached_checkout,
  count(distinct e.id) filter (where e.status = 'paid') as paid
from public.internship_scratch_offers o
left join public.enrolments e on e.coupon_code = o.code
group by o.batch_start;
