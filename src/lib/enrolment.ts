import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { sendEnrollmentConfirmation } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase";

export const FEE = 699900;
export type Registration = { name: string; email: string; phone: string };
type Row = { id: string; token: string; details: string; order_id: string | null; payment_id: string | null; status: string; confirmation_email_sent_at: string | null; confirmation_email_claimed_at: string | null };
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
  return supabaseAdmin().from("enrolments").select("id,token_hash,name,email,phone,order_id,payment_id,status,amount,currency,created_at,paid_at,confirmation_email_sent_at,confirmation_email_claimed_at").eq("id", id).maybeSingle().then(({ data, error }) => {
    if (error || !data || data.token_hash !== hash(token)) throw new Error("Registration could not be accessed. Please start again.");
    return { id: data.id, token: data.token_hash, details: JSON.stringify({ name: data.name, email: data.email, phone: data.phone }), order_id: data.order_id, payment_id: data.payment_id, status: data.status, confirmation_email_sent_at: data.confirmation_email_sent_at, confirmation_email_claimed_at: data.confirmation_email_claimed_at } satisfies Row;
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
    await sendEnrollmentConfirmation({ id: row.id, name: details.name, email: details.email });
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
export async function createOrder(id: string, token: string, input: Registration) {
  const { key } = credentials();
  const admin = supabaseAdmin();
  const { error: insertError } = await admin.from("enrolments").upsert({ id, token_hash: hash(token), ...input }, { onConflict: "id", ignoreDuplicates: true });
  if (insertError) throw new Error("Registration could not be saved.");
  const row = await getRegistration(id, token);
  if (row.status === "paid") {
    await sendConfirmationIfNeeded(row);
    return { paid: true, id };
  }
  const saved = JSON.parse(row.details) as Registration;
  const prefill = { name: saved.name, email: saved.email, contact: saved.phone };
  if (row.order_id) return { id, orderId: row.order_id, key, amount: FEE, currency: "INR", prefill };
  // An unresolved remote request must not be retried automatically: it may have created an order.
  const { data: claim, error: claimError } = await admin.from("enrolments").update({ status: "creating" }).eq("id", id).eq("status", "created").select("id").maybeSingle();
  if (claimError || !claim) throw new Error("Your payment order is being prepared or needs review. Please contact the counsellor before starting another payment.");
  const order = await gateway("orders", { amount: FEE, currency: "INR", receipt: id, notes: { enrolment_id: id, program: "Drone Technology Internship" } });
  if (typeof order.id !== "string" || !/^order_[a-zA-Z0-9]+$/.test(order.id) || order.amount !== FEE || order.currency !== "INR") throw new Error("Payment order could not be confirmed.");
  const { error: orderError } = await admin.from("enrolments").update({ order_id: order.id, status: "pending" }).eq("id", id);
  if (orderError) throw new Error("Payment order could not be saved.");
  return { id, orderId: order.id, key, amount: FEE, currency: "INR", prefill };
}
export function validSignature(body: string, signature: string, secret: string) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  return timingSafeEqual(Buffer.from(createHmac("sha256", secret).update(body).digest("hex"), "hex"), Buffer.from(signature, "hex"));
}
export async function confirmPayment(orderId: string, paymentId: string) {
  if (!/^order_[a-zA-Z0-9]+$/.test(orderId) || !/^pay_[a-zA-Z0-9]+$/.test(paymentId)) throw new Error("Invalid payment reference.");
  const { data: record, error: recordError } = await supabaseAdmin().from("enrolments").select("id,token_hash,name,email,phone,order_id,payment_id,status,confirmation_email_sent_at").eq("order_id", orderId).maybeSingle();
  if (recordError || !record) throw new Error("Registration was not found.");
  const row: Row = { id: record.id, token: record.token_hash, details: JSON.stringify({ name: record.name, email: record.email, phone: record.phone }), order_id: record.order_id, payment_id: record.payment_id, status: record.status, confirmation_email_sent_at: record.confirmation_email_sent_at, confirmation_email_claimed_at: null };
  const payment = await gateway(`payments/${paymentId}`);
  if (payment.order_id !== row.order_id || payment.amount !== FEE || payment.currency !== "INR") throw new Error("Payment details did not match the registration.");
  if (payment.status === "captured" && payment.captured === true) {
    const admin = supabaseAdmin();
    const { data: updated, error } = await admin.from("enrolments").update({ status: "paid", payment_id: paymentId, paid_at: new Date().toISOString() }).eq("id", row.id).neq("status", "paid").or(`payment_id.is.null,payment_id.eq.${paymentId}`).select("id").maybeSingle();
    if (error) throw new Error("Payment status could not be saved.");
    if (!updated) {
      const { data: current, error: currentError } = await admin.from("enrolments").select("payment_id,status").eq("id", row.id).maybeSingle();
      if (currentError || !current) throw new Error("Payment status could not be confirmed.");
      if (current.status !== "paid" || current.payment_id !== paymentId) {
        console.error("A second captured payment needs manual reconciliation", { enrolmentId: row.id, paymentId, recordedPaymentId: current.payment_id });
        return { status: "review_required", reference: row.id };
      }
    }
    await sendConfirmationIfNeeded(row);
    return { status: "paid", reference: row.id };
  }
  return { status: row.status === "paid" ? "paid" : "pending", reference: row.id };
}

export async function reconcileOrderPayment(orderId: string) {
  const result = await gateway(`orders/${encodeURIComponent(orderId)}/payments`);
  const payments = Array.isArray(result.items) ? result.items as Record<string, unknown>[] : [];
  const captured = payments.find(payment => payment.status === "captured" && typeof payment.id === "string");
  if (!captured || typeof captured.id !== "string") return null;
  return confirmPayment(orderId, captured.id);
}
