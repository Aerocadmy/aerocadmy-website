"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, ShieldCheck, X } from "lucide-react";
import styles from "./InternshipEnrolment.module.css";

type Session = { id: string; token: string; reference?: string };
type PaymentPhase = "idle" | "preparing" | "waiting" | "verifying" | "pending" | "failed" | "review" | "paid";
type Result = { error?: string; status?: string; paid?: boolean; reference?: string; orderId?: string; key?: string; amount?: number; currency?: string; prefill?: { name: string; email: string; contact: string } };
type Checkout = { open(): void; on(event: string, callback: (response?: unknown) => void): void };
declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => Checkout } }

const storageKey = "aerocadmy-internship-registration";
let checkoutScriptPromise: Promise<void> | null = null;

function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (!checkoutScriptPromise) checkoutScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); checkoutScriptPromise = null; reject(new Error("Checkout could not load. Please try again.")); };
    document.head.appendChild(script);
  });
  return checkoutScriptPromise;
}

const phaseCopy: Partial<Record<PaymentPhase, string>> = {
  preparing: "Opening secure Razorpay checkout…",
  waiting: "Waiting for your payment to complete. Keep this window open.",
  verifying: "Payment submitted. We’re confirming it securely with Razorpay…",
  pending: "Razorpay has not confirmed this payment yet. Check its status before trying again.",
  failed: "Payment wasn’t completed. You can retry, or check the status if money was deducted.",
  review: "Payment received. This enrollment needs a manual review; please contact a counsellor.",
};

export function InternshipEnrolment() {
  const dialogRef = useRef<HTMLElement>(null);
  const phaseRef = useRef<PaymentPhase>("idle");
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkoutActive, setCheckoutActive] = useState(false);
  const [message, setMessage] = useState("");
  const [phase, setPhaseState] = useState<PaymentPhase>("idle");
  const [formValues, setFormValues] = useState({ name: "", email: "", phone: "" });

  function setPhase(next: PaymentPhase) {
    phaseRef.current = next;
    setPhaseState(next);
  }

  function saveReference(reference?: string) {
    if (!reference) return;
    setSession(current => {
      if (!current) return current;
      const updated = { ...current, reference };
      try { sessionStorage.setItem(storageKey, JSON.stringify(updated)); } catch { /* The server still retains the reference. */ }
      return updated;
    });
  }

  function openDialog() {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsOpen(true);
  }

  const closeDialog = useCallback(() => {
    if (checkoutActive || phaseRef.current === "preparing" || phaseRef.current === "verifying") return;
    setIsOpen(false);
  }, [checkoutActive]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Session;
      if (typeof parsed.id === "string" && typeof parsed.token === "string") setSession(parsed);
    } catch { /* A new registration can still be created. */ }
  }, []);

  useEffect(() => {
    const open = () => openDialog();
    window.addEventListener("open-internship-enrolment", open);
    return () => window.removeEventListener("open-internship-enrolment", open);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = dialogRef.current;
    if (!checkoutActive) (panel?.querySelector<HTMLElement>("input,button") || panel)?.focus({ preventScroll: true });

    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>(
      'button:not([disabled]),input:not([disabled]),a[href],[tabindex="0"]',
    ) || []).filter(element => element.getClientRects().length > 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (checkoutActive) return;
      if (event.key === "Escape") { event.preventDefault(); closeDialog(); return; }
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) { event.preventDefault(); return; }
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !panel?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (!isOpen && previousFocusRef.current?.isConnected) previousFocusRef.current.focus({ preventScroll: true });
    };
  }, [isOpen, checkoutActive, closeDialog]);

  useEffect(() => {
    if (!isOpen && previousFocusRef.current?.isConnected) previousFocusRef.current.focus({ preventScroll: true });
  }, [isOpen]);

  async function request(active: Session, values: Record<string, unknown>) {
    const response = await fetch("/api/enrolment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: active.id, token: active.token, ...values }) });
    const result = await response.json() as Result;
    if (!response.ok) throw new Error(result.error || "Please try again later.");
    return result;
  }

  async function checkStatus() {
    if (!session) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await request(session, { action: "status" });
      saveReference(result.reference);
      if (result.status === "paid") setPhase("paid");
      else if (result.status === "review_required") setPhase("review");
      else setPhase("pending");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not check payment.");
    } finally { setBusy(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setPhase("preparing");
    const details = Object.fromEntries(new FormData(event.currentTarget).entries()) as typeof formValues;
    setFormValues(details);
    let active = session;
    try {
      if (!active) {
        active = { id: crypto.randomUUID(), token: Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, "0")).join("") };
        sessionStorage.setItem(storageKey, JSON.stringify(active));
        setSession(active);
      }
      await loadCheckout();
      const result = await request(active, { action: "register", details });
      saveReference(result.reference);
      if (result.paid) { setPhase("paid"); setBusy(false); return; }
      if (!window.Razorpay || !result.orderId || !result.key) throw new Error("Checkout is unavailable. Please contact a counsellor.");

      const current = active;
      const checkout = new window.Razorpay({
        key: result.key,
        order_id: result.orderId,
        amount: result.amount,
        currency: result.currency,
        name: "Aerocadmy",
        description: "Six-week Drone Technology Internship · ESP32 kit included",
        prefill: result.prefill,
        theme: { color: "#087957" },
        modal: { ondismiss: () => {
          setCheckoutActive(false);
          if (phaseRef.current === "verifying" || phaseRef.current === "paid") return;
          setBusy(false);
          if (phaseRef.current !== "failed") {
            setPhase("idle");
            setMessage("Checkout closed. You can resume with the same registration, or check payment status if you’ve already paid.");
          }
        } },
        handler: async (payment: { razorpay_payment_id: string; razorpay_signature: string }) => {
          setPhase("verifying");
          try {
            const verified = await request(current, { action: "verify", paymentId: payment.razorpay_payment_id, signature: payment.razorpay_signature });
            saveReference(verified.reference);
            if (verified.status === "paid") setPhase("paid");
            else if (verified.status === "review_required") setPhase("review");
            else setPhase("pending");
          } catch (error) {
            setPhase("pending");
            setMessage(error instanceof Error ? error.message : "Payment confirmation is pending. Please check status before paying again.");
          } finally {
            setCheckoutActive(false);
            setBusy(false);
          }
        },
      });
      checkout.on("payment.failed", () => {
        setPhase("failed");
      });
      setCheckoutActive(true);
      setPhase("waiting");
      checkout.open();
    } catch (error) {
      setPhase("idle");
      setMessage(error instanceof Error ? error.message : "Could not start checkout.");
      setBusy(false);
    }
  }

  if (!isOpen) return null;
  const paid = phase === "paid";
  const processing = phase === "preparing" || phase === "waiting" || phase === "verifying";
  const resultState = phase === "pending" || phase === "failed" || phase === "review";

  return <div className={styles.overlay} onMouseDown={event => { if (event.target === event.currentTarget) closeDialog(); }}>
    <section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal={!checkoutActive} aria-labelledby="enrolment-title" tabIndex={-1}>
      <button type="button" className={styles.close} aria-label="Close enrollment form" onClick={closeDialog} disabled={checkoutActive || phase === "preparing" || phase === "verifying"}><X size={20} aria-hidden="true" /></button>
      {paid ? <>
        <p className={styles.eyebrow}>Payment confirmed</p><h2 id="enrolment-title">You’re enrolled.</h2>
        <div className={styles.success} role="status"><CheckCircle2 size={28} /><div><p>Your ₹6,999 payment is confirmed for the Drone Technology Internship. Keep your enrollment reference for support.</p><p className={styles.reference}>{session?.reference || "Reference is being prepared"}</p></div></div>
      </> : processing ? <div className={styles.paymentScreen} role="status" aria-live="polite">
        <span className={`${styles.spinner} ${styles.spinnerLarge}`} aria-hidden="true" />
        <p className={styles.eyebrow}>Secure payment</p>
        <h2 id="enrolment-title">{phase === "verifying" ? "Confirming your payment" : "Waiting for payment"}</h2>
        <p>{phaseCopy[phase]}</p>
        <span className={styles.paymentHint}>Your enrollment details are saved. Please don’t close this window or retry payment while confirmation is in progress.</span>
      </div> : resultState ? <div className={`${styles.paymentScreen} ${phase === "failed" ? styles.paymentIssue : ""}`} role="status" aria-live="polite">
        {phase === "failed" ? <AlertCircle className={styles.resultIcon} aria-hidden="true" /> : phase === "review" ? <AlertCircle className={styles.resultIcon} aria-hidden="true" /> : <ShieldCheck className={styles.resultIcon} aria-hidden="true" />}
        <p className={styles.eyebrow}>{phase === "failed" ? "Payment not completed" : phase === "review" ? "Payment received" : "Payment status"}</p>
        <h2 id="enrolment-title">{phase === "failed" ? "Let’s try that again" : phase === "review" ? "We’re checking your enrollment" : "Payment is still processing"}</h2>
        <p>{phaseCopy[phase]}</p>
        {message && <p className={styles.resultMessage}>{message}</p>}
        <div className={styles.resultActions}>
          {phase === "failed" && <button className="dark-action" type="button" disabled={checkoutActive} onClick={() => { setPhase("idle"); setMessage(""); }}>Return to details</button>}
          {session && <button className={styles.status} type="button" onClick={checkStatus} disabled={busy || checkoutActive}>{busy ? "Checking payment…" : "Check payment status"}</button>}
        </div>
      </div> : <>
        <p className={styles.eyebrow}>Your next step</p><h2 id="enrolment-title">Enroll in the Drone Technology Internship</h2>
        <p className={styles.intro}>Register for the six-week live online internship, including an ESP32 drone kit you keep.</p>
        <div className={styles.total}><span>Training + ESP32 kit<strong>Next batch · 15 November 2026</strong></span><span className={styles.totalPrice}><del>₹11,999</del><b>₹6,999</b></span></div>
        <form onSubmit={submit} className={styles.form}>
          <fieldset disabled={busy}><legend>Your contact details</legend><div className={styles.grid}>
            <label>Full name<input name="name" autoComplete="name" required minLength={2} maxLength={100} value={formValues.name} onChange={event => setFormValues(current => ({ ...current, name: event.target.value }))} /></label>
            <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} value={formValues.email} onChange={event => setFormValues(current => ({ ...current, email: event.target.value }))} /></label>
            <label>Phone number<input name="phone" type="tel" autoComplete="tel" required minLength={10} maxLength={25} value={formValues.phone} onChange={event => setFormValues(current => ({ ...current, phone: event.target.value }))} /></label>
          </div></fieldset>
          <p className={styles.note}>We’ll use these details to manage your enrollment. Payment details are handled securely by Razorpay.</p>
          <div className={styles.actions}><button className="dark-action" disabled={busy || checkoutActive} type="submit">{busy ? "Please wait…" : "Continue to payment"}<ArrowRight size={18} /></button></div>
          <p className={styles.security}><ShieldCheck size={16} /> ₹6,999 · Secure checkout with Razorpay</p>
        </form>
        {session && <button className={styles.status} type="button" onClick={checkStatus} disabled={busy || checkoutActive}>Already attempted payment? Check payment status</button>}
        {session && <p className={styles.note}>Resuming checkout uses the details saved with your first registration.</p>}
        <p className={styles.message} role="status" aria-live="polite">{message}</p>
      </>}
    </section>
  </div>;
}
