"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import styles from "./InternshipEnrolment.module.css";
type Session = { id: string; token: string };
type Result = { error?: string; status?: string; paid?: boolean; reference?: string; orderId?: string; key?: string; amount?: number; currency?: string; prefill?: { name: string; email: string; contact: string } };
type Checkout = { open(): void; on(event: string, callback: () => void): void };
declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => Checkout } }
const storageKey = "aerocadmy-internship-registration";
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(); script.onerror = () => { script.remove(); reject(new Error("Checkout could not load. Please try again.")); };
    document.head.appendChild(script);
  });
}
export function InternshipEnrolment() {
  const [session, setSession] = useState<Session | null>(null);
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(""), [paid, setPaid] = useState(false);
  useEffect(() => { try { const stored = sessionStorage.getItem(storageKey); if (stored) { const parsed = JSON.parse(stored); if (parsed.id && parsed.token) setSession(parsed); } } catch { /* A new registration can still be created. */ } }, []);
  async function request(active: Session, values: Record<string, unknown>) {
    const response = await fetch("/api/enrolment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...active, ...values }) });
    const result = await response.json() as Result;
    if (!response.ok) throw new Error(result.error || "Please try again later.");
    return result;
  }
  async function checkStatus() {
    if (!session) return;
    setBusy(true); setMessage("");
    try { const result = await request(session, { action: "status" }); if (result.status === "paid") setPaid(true); else setMessage("Payment is not confirmed yet. If you’ve paid, please wait and check again before making another payment."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not check payment."); }
    finally { setBusy(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const details = Object.fromEntries(new FormData(event.currentTarget).entries());
    let active = session;
    try {
      if (!active) {
        active = { id: crypto.randomUUID(), token: Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, "0")).join("") };
        sessionStorage.setItem(storageKey, JSON.stringify(active)); setSession(active);
      }
      await loadCheckout();
      const result = await request(active, { action: "register", details });
      if (result.paid) { setPaid(true); setBusy(false); return; }
      if (!window.Razorpay || !result.orderId || !result.key) throw new Error("Checkout is unavailable. Please contact a counsellor.");
      const current = active;
      const checkout = new window.Razorpay({ key: result.key, order_id: result.orderId, amount: result.amount, currency: result.currency, name: "Aerocadmy", description: "Six-week Drone Technology Internship · ESP32 kit included", prefill: result.prefill, theme: { color: "#087957" },
        modal: { ondismiss: () => { setBusy(false); setMessage("Checkout closed. You can resume with the same registration, or check payment status if you’ve already paid."); } },
        handler: async (payment: { razorpay_payment_id: string; razorpay_signature: string }) => {
          setBusy(true);
          try { const verified = await request(current, { action: "verify", paymentId: payment.razorpay_payment_id, signature: payment.razorpay_signature }); if (verified.status === "paid") setPaid(true); else setMessage("Your payment is awaiting confirmation. Use Check payment status in a moment; please do not pay again."); }
          catch (error) { setMessage(error instanceof Error ? error.message : "Payment confirmation is pending. Please check status before paying again."); }
          finally { setBusy(false); }
        }
      });
      checkout.on("payment.failed", () => { setMessage("Payment was not completed. You can retry checkout. If money was deducted, check payment status first."); setBusy(false); });
      checkout.open();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not start checkout."); setBusy(false); }
  }
  return <section id="enrolment" className={styles.section} aria-labelledby="enrolment-title">
    <p className={styles.eyebrow}>Your next step</p><h2 id="enrolment-title">Make room for your curiosity.</h2>
    {paid ? <div className={styles.success} role="status"><CheckCircle2 size={28} /><div><h3>You’re enrolled.</h3><p>Your ₹4,999 payment is confirmed for the Drone Technology Internship. Keep your enrolment reference for support.</p><p className={styles.reference}>{session?.id}</p><a href="/#counselling">Talk to a counsellor about your next steps →</a></div></div> : <>
      <p className={styles.intro}>Register for the six-week live online internship, including an ESP32 drone kit you keep.</p>
      <div className={styles.total}><span>Training + ESP32 kit<strong>Next batch · 15 November 2026</strong></span><b>₹4,999</b></div>
      <form onSubmit={submit} className={styles.form}>
        <fieldset disabled={busy}><legend>Your contact details</legend><div className={styles.grid}>
          <label>Full name<input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
          <label>Phone number<input name="phone" type="tel" autoComplete="tel" required minLength={10} maxLength={25} /></label>
        </div></fieldset>
        <fieldset disabled={busy}><legend>Kit delivery address · India</legend><div className={styles.grid}>
          <label className={styles.full}>Street address<input name="address" autoComplete="street-address" required minLength={8} maxLength={300} /></label>
          <label>City<input name="city" autoComplete="address-level2" required minLength={2} maxLength={80} /></label>
          <label>State<input name="state" autoComplete="address-level1" required minLength={2} maxLength={80} /></label>
          <label>PIN code<input name="pincode" autoComplete="postal-code" inputMode="numeric" pattern="[1-9][0-9]{5}" maxLength={6} required /></label>
        </div></fieldset>
        <p className={styles.note}>We’ll use these details to manage your enrolment and kit delivery. Payment details are handled by Razorpay.</p>
        <div className={styles.actions}><button disabled={busy} type="submit">{busy ? "Please wait…" : "Continue to payment"}<ArrowRight size={18} /></button><a href="/#counselling">Talk to a counsellor <ArrowRight size={18} /></a></div>
        <p className={styles.security}><ShieldCheck size={16} /> ₹4,999 · Secure checkout with Razorpay</p>
      </form>
      {session && <button className={styles.status} type="button" onClick={checkStatus} disabled={busy}>Already attempted payment? Check payment status</button>}
      {session && <p className={styles.note}>Resuming checkout uses the details saved with your first registration. Contact the counsellor if those details need correcting.</p>}
      <p className={styles.message} role="status" aria-live="polite">{message}</p>
    </>}
  </section>;
}
