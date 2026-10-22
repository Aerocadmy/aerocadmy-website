alter table public.enrolments
  add column if not exists confirmation_email_claimed_at timestamptz;

alter table public.payment_events
  add column if not exists event_id text;

create unique index if not exists payment_events_event_id_unique
  on public.payment_events (event_id)
  where event_id is not null;
