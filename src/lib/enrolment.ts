import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

export const FEE = 699900;
export type Registration = { name: string; email: string; phone: string };
type Row = { id: string; token: string; details: string; order_id: string | null; payment_id: string | null; status: string };
interface Database { exec(sql: string): void; prepare(sql: string): { run(...values: (string | number | null)[]): unknown; get(...values: string[]): Row | undefined }; }
let database: Database | undefined;
function db() {
  if (!database) {
    const directory = process.env.ENROLMENT_STORAGE_DIR || path.join(process.cwd(), ".data", "enrolments");
    if (path.resolve(directory).startsWith(path.resolve(process.cwd(), "public") + path.sep) || path.resolve(directory) === path.resolve(process.cwd(), "public")) throw new Error("Private storage required");
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    const { DatabaseSync } = createRequire(path.join(process.cwd(), "package.json"))("node:sqlite") as { DatabaseSync: new (file: string) => Database };
    database = new DatabaseSync(path.join(directory, "enrolments.sqlite"));
    database.exec("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS enrolments (id TEXT PRIMARY KEY, token TEXT NOT NULL, details TEXT NOT NULL, order_id TEXT UNIQUE, payment_id TEXT UNIQUE, status TEXT NOT NULL DEFAULT 'created', created_at TEXT NOT NULL, paid_at TEXT);");
  }
  return database;
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
  const row = db().prepare("SELECT * FROM enrolments WHERE id = ?").get(id);
  if (!row || row.token !== hash(token)) throw new Error("Registration could not be accessed. Please start again.");
  return row;
}
export async function gateway(endpoint: string, body?: unknown) {
  const { key, secret } = credentials();
  const response = await fetch(`https://api.razorpay.com/v1/${endpoint}`, { method: body ? "POST" : "GET", headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`, "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}), cache: "no-store", signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error("Payment service could not complete the request. Please try again later.");
  return await response.json() as Record<string, unknown>;
}
export async function createOrder(id: string, token: string, input: Registration) {
  const { key } = credentials();
  db().prepare("INSERT OR IGNORE INTO enrolments (id, token, details, created_at) VALUES (?, ?, ?, ?)").run(id, hash(token), JSON.stringify(input), new Date().toISOString());
  const row = getRegistration(id, token);
  if (row.status === "paid") return { paid: true, id };
  const saved = JSON.parse(row.details) as Registration;
  const prefill = { name: saved.name, email: saved.email, contact: saved.phone };
  if (row.order_id) return { id, orderId: row.order_id, key, amount: FEE, currency: "INR", prefill };
  // An unresolved remote request must not be retried automatically: it may have created an order.
  const claim = db().prepare("UPDATE enrolments SET status = 'creating' WHERE id = ? AND status = 'created' RETURNING *").get(id);
  if (!claim) throw new Error("Your payment order is being prepared or needs review. Please contact the counsellor before starting another payment.");
  const order = await gateway("orders", { amount: FEE, currency: "INR", receipt: id, notes: { enrolment_id: id, program: "Drone Technology Internship" } });
  if (typeof order.id !== "string" || !/^order_[a-zA-Z0-9]+$/.test(order.id) || order.amount !== FEE || order.currency !== "INR") throw new Error("Payment order could not be confirmed.");
  db().prepare("UPDATE enrolments SET order_id = ?, status = 'pending' WHERE id = ?").run(order.id, id);
  return { id, orderId: order.id, key, amount: FEE, currency: "INR", prefill };
}
export function validSignature(body: string, signature: string, secret: string) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  return timingSafeEqual(Buffer.from(createHmac("sha256", secret).update(body).digest("hex"), "hex"), Buffer.from(signature, "hex"));
}
export async function confirmPayment(orderId: string, paymentId: string) {
  if (!/^order_[a-zA-Z0-9]+$/.test(orderId) || !/^pay_[a-zA-Z0-9]+$/.test(paymentId)) throw new Error("Invalid payment reference.");
  const row = db().prepare("SELECT * FROM enrolments WHERE order_id = ?").get(orderId);
  if (!row) throw new Error("Registration was not found.");
  const payment = await gateway(`payments/${paymentId}`);
  if (payment.order_id !== row.order_id || payment.amount !== FEE || payment.currency !== "INR") throw new Error("Payment details did not match the registration.");
  if (payment.status === "captured" && payment.captured === true) {
    db().prepare("UPDATE enrolments SET status = 'paid', payment_id = ?, paid_at = COALESCE(paid_at, ?) WHERE id = ? AND (payment_id IS NULL OR payment_id = ?)").run(paymentId, new Date().toISOString(), row.id, paymentId);
    return { status: "paid", reference: row.id };
  }
  return { status: row.status === "paid" ? "paid" : "pending", reference: row.id };
}
