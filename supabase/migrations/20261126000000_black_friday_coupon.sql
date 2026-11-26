-- Black Friday sale: also allow the shared BLACKFRIDAY code (flat 3000 rupees off) on enrolments.
-- The sale window is enforced by the application. NOT VALID leaves historical rows untouched.
alter table public.enrolments drop constraint if exists enrolments_coupon_discount_valid;

alter table public.enrolments
  add constraint enrolments_coupon_discount_valid
  check (
    (coupon_code is null and discount_amount = 0)
    or (coupon_code like 'EARLY1000-%' and discount_amount = 100000)
    or (coupon_code = 'BLACKFRIDAY' and discount_amount = 300000)
  ) not valid;
