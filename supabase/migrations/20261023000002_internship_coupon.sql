alter table public.enrolments
  add column if not exists coupon_code text,
  add column if not exists discount_amount integer not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'enrolments_coupon_discount_valid'
  ) then
    alter table public.enrolments
      add constraint enrolments_coupon_discount_valid
      check (
        (coupon_code is null and discount_amount = 0)
        or (coupon_code = 'SPECIAL1000' and discount_amount = 100000)
      );
  end if;
end $$;
