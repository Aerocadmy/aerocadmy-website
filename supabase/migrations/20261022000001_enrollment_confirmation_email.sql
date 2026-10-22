alter table public.enrolments
add column if not exists confirmation_email_sent_at timestamptz;
