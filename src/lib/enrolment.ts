import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { sendEnrollmentConfirmation } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase";
import { BATCH, PRICING, SALE, isScratchCode } from "@/lib/batch";

export const FEE = 699900;
export class CouponValidationError extends Error {}
export async function seatsLeft() {
  const { count, error } = await supabaseAdmin().from("enrolments").select("id", { count: "exact", head: true }).eq("status", "paid").gte("paid_at", BATCH.windowStart);
  if (error || count === null) return null;
  return Math.max(0, BATCH.seatCap - count - BATCH.externalRegistrations);
}
export type Registration = { name: string; email: string; phone: string };
type Row = { id: string; reference_code: string; token: string; details: string; order_id: string | null; payment_id: string | null; status: string; amount: number; coupon_code: string | null; discount_amount: number; confirmation_email_sent_at: string | null; confirmation_email_claimed_at: string | null };
type ScratchRow = { code: string; expires_at: string; discount_amount: number };
const SCRATCH_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const newScratchCode = () => `${PRICING.scratchPrefix}-${Array.from(randomBytes(6), byte => SCRATCH_ALPHABET[byte % SCRATCH_ALPHABET.length]).join("")}`;

/**
 * Creates (or returns) the visitor's personal offer. One offer per visitor token, valid for
 * `scratchHours` from the moment it is first scratched; the expiry is enforced on the server.
 */
export async function claimScratchOffer(token: unknown) {
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) throw new Error("Invalid offer request.");
  const admin = supabaseAdmin();
  const tokenHash = hash(token);
  const existing = async () => {
    const { data } = await admin.from("internship_scratch_offers").select("code,expires_at,discount_amount").eq("token_hash", tokenHash).maybeSingle();
    return data as ScratchRow | null;
  };
  let row = await existing();
  for (let attempt = 0; !row && attempt < 3; attempt++) {
    const expiresAt = new Date(Date.now() + PRICING.scratchHours * 3600 * 1000).toISOString();
    const { error } = await admin.from("internship_scratch_offers").insert({ code: newScratchCode(), token_hash: tokenHash, discount_amount: PRICING.scratchDiscount, expires_at: expiresAt, batch_start: BATCH.startDate });
    if (error && error.code !== "23505") { console.error("[scratch] insert failed:", error.code, error.message); throw new Error("Offer could not be created."); }
    row = await existing(); // Also resolves a race on the same token, or a code collision on retry.
  }
  if (!row) throw new Error("Offer could not be created.");
  return { code: row.code, expiresAt: new Date(row.expires_at).getTime(), discountAmount: row.discount_amount };
}

export async function validateInternshipCoupon(value: unknown) {
  const code = typeof value === "string" ? value.trim().toUpperCase() : "";
  if (code === SALE.code) {
    if (Date.now() < SALE.startsAt) throw new CouponValidationError(`${SALE.code} starts on ${SALE.startLabel}.`);
    if (Date.now() >= SALE.endsAt) throw new CouponValidationError(`The ${SALE.name} offer has ended. The regular price applies.`);
    return { code: SALE.code, discountAmount: SALE.discount };
  }
  if (isScratchCode(code)) {
    const admin = supabaseAdmin();
    const { data } = await admin.from("internship_scratch_offers").select("code,expires_at,discount_amount").eq("code", code).maybeSingle();
    const offer = data as ScratchRow | null;
    if (!offer) throw new CouponValidationError("That coupon code isn\u2019t valid. Check the code and try again.");
    if (new Date(offer.expires_at).getTime() <= Date.now()) throw new CouponValidationError("This offer has expired. The regular price applies.");
    const { count } = await admin.from("enrolments").select("id", { count: "exact", head: true }).eq("coupon_code", code).eq("status", "paid");
    if (count) throw new CouponValidationError("This offer has already been used.");
    return { code: offer.code, discountAmount: offer.discount_amount };
  }
  throw new CouponValidationError("That coupon code isn’t valid. Check the code and try again.");
}
export async function couponQuote(value: unknown) {
  const coupon = await validateInternshipCoupon(value);
  return { couponCode: coupon.code, discountAmount: coupon.discountAmount, amount: FEE - coupon.discountAmount, currency: "INR" };
}
export function credentials() {
  const key = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key || !secret) throw new Error("Payments are not configured yet. Please talk to a counsellor.");
  return { key, secret };
}
export function validRegistration(value: unknown): Registration | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const keys = ["name", "email", "phone"] as const;
  if (keys.some(k => typeof v[k] !== "string")) return null;
  const r = Object.fromEntries(keys.map(k => [k, (v[k] as string).trim()])) as Registration;
  if (keys.some(k => /[\u0000-\u001f]/.test(r[k])) || r.name.length < 2 || r.name.length > 100 || r.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email) || !/^[+\d ()-]{7,25}$/.test(r.phone) || r.phone.replace(/\D/g, "").length < 10) return null;
  return r;
}
const hash = (token: string) => createHash("sha256").update(token).digest("hex");
export function getRegistration(id: string, token: string) {
  return supabaseAdmin().from("enrolments").select("id,reference_code,token_hash,name,email,phone,order_id,payment_id,status,amount,coupon_code,discount_amount,currency,created_at,paid_at,confirmation_email_sent_at,confirmation_email_claimed_at").eq("id", id).maybeSingle().then(({ data, error }) => {
    if (error || !data || data.token_hash !== hash(token)) throw new Error("Registration could not be accessed. Please start again.");
    return { id: data.id, reference_code: data.reference_code, token: data.token_hash, details: JSON.stringify({ name: data.name, email: data.email, phone: data.phone }), order_id: data.order_id, payment_id: data.payment_id, status: data.status, amount: data.amount, coupon_code: data.coupon_code, discount_amount: data.discount_amount, confirmation_email_sent_at: data.confirmation_email_sent_at, confirmation_email_claimed_at: data.confirmation_email_claimed_at } satisfies Row;
  });
}
async function sendConfirmationIfNeeded(row: Row) {
  if (row.confirmation_email_sent_at) return;
  const admin = supabaseAdmin();
  const claimedAt = new Date().toISOString();
  const staleBefore = new Date(Date.now() - 5 * 60_000).toISOString();
  const { data: claim, error: claimError } = await admin.from("enrolments")
    .update({ confirmation_email_claimed_at: claimedAt })
    .eq("id", row.id)
    .is("confirmation_email_sent_at", null)
    .or(`confirmation_email_claimed_at.is.null,confirmation_email_claimed_at.lt.${staleBefore}`)
    .select("id")
    .maybeSingle();
  if (claimError) throw new Error("Enrollment confirmation could not be prepared.");
  if (!claim) return;
  const details = JSON.parse(row.details) as Registration;
  try {
    await sendEnrollmentConfirmation({ id: row.id, reference: row.reference_code, name: details.name, email: details.email, amount: row.amount, couponCode: row.coupon_code, discountAmount: row.discount_amount });
    const { data: saved, error } = await admin.from("enrolments").update({ confirmation_email_sent_at: new Date().toISOString(), confirmation_email_claimed_at: null }).eq("id", row.id).eq("confirmation_email_claimed_at", claimedAt).is("confirmation_email_sent_at", null).select("id").maybeSingle();
    if (error || !saved) throw new Error("Enrollment confirmation status could not be saved.");
  } catch (error) {
    await admin.from("enrolments").update({ confirmation_email_claimed_at: null }).eq("id", row.id).eq("confirmation_email_claimed_at", claimedAt).is("confirmation_email_sent_at", null);
    throw error;
  }
}
export async function sendPendingEnrollmentConfirmation(id: string, token: string) {
  const row = await getRegistration(id, token);
  if (row.status === "paid") await sendConfirmationIfNeeded(row);
}
export async function gateway(endpoint: string, body?: unknown) {
  const { key, secret } = credentials();
  const response = await fetch(`https://api.razorpay.com/v1/${endpoint}`, { method: body ? "POST" : "GET", headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`, "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}), cache: "no-store", signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error("Payment service could not complete the request. Please try again later.");
  return await response.json() as Record<string, unknown>;
}
export async function createOrder(id: string, token: string, input: Registration, requestedCouponCode?: string) {
  const { key } = credentials();
  const admin = supabaseAdmin();
  const requested = requestedCouponCode?.trim().toUpperCase() || null;
  const { error: insertError } = await admin.from("enrolments").upsert({ id, token_hash: hash(token), ...input }, { onConflict: "id", ignoreDuplicates: true });
  if (insertError) throw new Error("Registration could not be saved.");
  const row = await getRegistration(id, token);
  if (row.status === "paid") {
    await sendConfirmationIfNeeded(row);
    return { paid: true, reference: row.reference_code, amount: row.amount, couponCode: row.coupon_code, discountAmount: row.discount_amount };
  }
  const saved = JSON.parse(row.details) as Registration;
  const prefill = { name: saved.name, email: saved.email, contact: saved.phone };
  if (row.order_id) {
    // An existing order keeps its price, even if the personal offer has since expired.
    if (requested && row.coupon_code !== requested) throw new CouponValidationError("A payment order already exists for this registration without that coupon. Check payment status or contact a counsellor before trying again.");
    return { reference: row.reference_code, orderId: row.order_id, key, amount: row.amount, currency: "INR", couponCode: row.coupon_code, discountAmount: row.discount_amount, prefill };
  }
  const coupon = requested ? await validateInternshipCoupon(requested) : null;
  // An unresolved remote request must not be retried automatically: it may have created an order.
  const discountAmount = coupon?.discountAmount ?? 0;
  const amount = FEE - discountAmount;
  const { data: claim, error: claimError } = await admin.from("enrolments").update({ status: "creating", amount, coupon_code: coupon?.code ?? null, discount_amount: discountAmount }).eq("id", id).eq("status", "created").select("id").maybeSingle();
  if (claimError || !claim) throw new Error("Your payment order is being prepared or needs review. Please contact the counsellor before starting another payment.");
  const order = await gateway("orders", { amount, currency: "INR", receipt: row.reference_code, notes: { enrollment_reference: row.reference_code, program: "Drone Technology Internship", ...(coupon ? { coupon_code: coupon.code, discount_amount: String(discountAmount) } : {}) } });
  if (typeof order.id !== "string" || !/^order_[a-zA-Z0-9]+$/.test(order.id) || order.amount !== amount || order.currency !== "INR") throw new Error("Payment order could not be confirmed.");
  const { error: orderError } = await admin.from("enrolments").update({ order_id: order.id, status: "pending" }).eq("id", id);
  if (orderError) throw new Error("Payment order could not be saved.");
  return { reference: row.reference_code, orderId: order.id, key, amount, currency: "INR", couponCode: coupon?.code ?? null, discountAmount, prefill };
}
export function validSignature(body: string, signature: string, secret: string) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  return timingSafeEqual(Buffer.from(createHmac("sha256", secret).update(body).digest("hex"), "hex"), Buffer.from(signature, "hex"));
}
export async function confirmPayment(orderId: string, paymentId: string) {
  if (!/^order_[a-zA-Z0-9]+$/.test(orderId) || !/^pay_[a-zA-Z0-9]+$/.test(paymentId)) throw new Error("Invalid payment reference.");
  const { data: record, error: recordError } = await supabaseAdmin().from("enrolments").select("id,reference_code,token_hash,name,email,phone,order_id,payment_id,status,amount,coupon_code,discount_amount,confirmation_email_sent_at").eq("order_id", orderId).maybeSingle();
  if (recordError || !record) throw new Error("Registration was not found.");
  const row: Row = { id: record.id, reference_code: record.reference_code, token: record.token_hash, details: JSON.stringify({ name: record.name, email: record.email, phone: record.phone }), order_id: record.order_id, payment_id: record.payment_id, status: record.status, amount: record.amount, coupon_code: record.coupon_code, discount_amount: record.discount_amount, confirmation_email_sent_at: record.confirmation_email_sent_at, confirmation_email_claimed_at: null };
  const payment = await gateway(`payments/${paymentId}`);
  if (payment.order_id !== row.order_id || payment.amount !== row.amount || payment.currency !== "INR") throw new Error("Payment details did not match the registration.");
  if (payment.status === "captured" && payment.captured === true) {
    const admin = supabaseAdmin();
    const { data: updated, error } = await admin.from("enrolments").update({ status: "paid", payment_id: paymentId, paid_at: new Date().toISOString() }).eq("id", row.id).neq("status", "paid").or(`payment_id.is.null,payment_id.eq.${paymentId}`).select("id").maybeSingle();
    if (error) throw new Error("Payment status could not be saved.");
    if (!updated) {
      const { data: current, error: currentError } = await admin.from("enrolments").select("payment_id,status").eq("id", row.id).maybeSingle();
      if (currentError || !current) throw new Error("Payment status could not be confirmed.");
      if (current.status !== "paid" || current.payment_id !== paymentId) {
        console.error("A second captured payment needs manual reconciliation", { enrolmentId: row.id, paymentId, recordedPaymentId: current.payment_id });
        return { status: "review_required", reference: row.reference_code };
      }
    }
    await sendConfirmationIfNeeded(row);
    return { status: "paid", reference: row.reference_code, amount: row.amount, couponCode: row.coupon_code, discountAmount: row.discount_amount };
  }
  return { status: row.status === "paid" ? "paid" : "pending", reference: row.reference_code, amount: row.amount, couponCode: row.coupon_code, discountAmount: row.discount_amount };
}

export async function reconcileOrderPayment(orderId: string) {
  const result = await gateway(`orders/${encodeURIComponent(orderId)}/payments`);
  const payments = Array.isArray(result.items) ? result.items as Record<string, unknown>[] : [];
  const captured = payments.find(payment => payment.status === "captured" && typeof payment.id === "string");
  if (!captured || typeof captured.id !== "string") return null;
  return confirmPayment(orderId, captured.id);
}

/** Saves a partly filled enrolment form so the team can follow up if payment isn't completed. */
export async function saveInternshipLead(value: Record<string, unknown>) {
  const text = (key: string) => typeof value[key] === "string" ? (value[key] as string).trim() : "";
  const name = text("name"), phone = text("phone"), email = text("email").toLowerCase(), source = text("source").slice(0, 40);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || name.length > 100 || /[\u0000-\u001f]/.test(name)) return false;
  if (!/^[+\d ()-]{7,25}$/.test(phone) || digits.length < 10) return false;
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return false;
  const { error } = await supabaseAdmin().from("internship_leads").upsert(
    { name, phone, phone_key: digits.slice(-10), email, source, batch_start: BATCH.startDate, updated_at: new Date().toISOString() },
    { onConflict: "phone_key,batch_start" },
  );
  return !error;
}
