-- Personal scratch offers replace the fixed SPECIAL1000 coupon: allow EARLY1000-XXXXXX codes
-- (flat 1000 rupees off) on enrolments. NOT VALID keeps any historical SPECIAL1000 rows intact
-- while enforcing the new rule on every new or updated row.
alter table public.enrolments drop constraint if exists enrolments_coupon_discount_valid;

alter table public.enrolments
  add constraint enrolments_coupon_discount_valid
  check (
    (coupon_code is null and discount_amount = 0)
    or (coupon_code like 'EARLY1000-%' and discount_amount = 100000)
  ) not valid;
