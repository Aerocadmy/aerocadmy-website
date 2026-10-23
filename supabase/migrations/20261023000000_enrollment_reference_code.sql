alter table public.enrolments
  add column if not exists reference_code text;

update public.enrolments
set reference_code = 'ACD-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))
where reference_code is null;

alter table public.enrolments
  alter column reference_code set default ('ACD-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  alter column reference_code set not null;

create unique index if not exists enrolments_reference_code_unique
  on public.enrolments (reference_code);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'enrolments_reference_code_format'
      and conrelid = 'public.enrolments'::regclass
  ) then
    alter table public.enrolments
      add constraint enrolments_reference_code_format
      check (reference_code ~ '^ACD-[A-F0-9]{10}$');
  end if;
end;
$$;
