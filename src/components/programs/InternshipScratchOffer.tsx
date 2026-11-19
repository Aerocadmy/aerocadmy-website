"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Gift, X } from "lucide-react";
import { PRICING, scratchPrice } from "@/lib/batch";
import { track } from "@/lib/analytics";
import { formatINR, storeReward, useScratchReward, visitorToken } from "./useScratchReward";
import styles from "./InternshipScratchOffer.module.css";

const DISMISS_KEY = "aerocadmy-scratch-dismissed";
const CARD_W = 300, CARD_H = 150, CLEAR_TO_REVEAL = 0.45;
type Phase = "idle" | "claiming" | "done" | "error";

/**
 * A personal, one-time offer: a small prompt appears after ~50% scroll (or on desktop exit intent),
 * the visitor scratches a card, and the server issues a unique code that expires 24 hours later.
 */
export function InternshipScratchOffer() {
  const { ready, stored, reward, remaining } = useScratchReward();
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [enrolmentOpen, setEnrolmentOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const shownTracked = useRef(false);
  const drawing = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);

  const eligible = ready && !stored && !dismissed;

  useEffect(() => {
    try { setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1"); } catch { setDismissed(false); }
  }, []);

  // Triggers: about half-way down the page, or (desktop) the cursor leaving through the top.
  useEffect(() => {
    if (!eligible || shown) return;
    const reveal = (trigger: string) => {
      if (shownTracked.current) return;
      shownTracked.current = true;
      setShown(true);
      track("scratch_offer_shown", { program: "drone-technology-internship", trigger });
    };
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= 0.5) reveal("scroll");
    };
    const onMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget && event.clientY <= 0 && window.matchMedia("(pointer: fine)").matches) reveal("exit_intent");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseOut);
    return () => { window.removeEventListener("scroll", onScroll); document.removeEventListener("mouseout", onMouseOut); };
  }, [eligible, shown]);

  useEffect(() => {
    const onOpen = () => { setEnrolmentOpen(true); setOpen(false); };
    const onClose = () => setEnrolmentOpen(false);
    window.addEventListener("open-internship-enrolment", onOpen);
    window.addEventListener("close-internship-enrolment", onClose);
    return () => { window.removeEventListener("open-internship-enrolment", onOpen); window.removeEventListener("close-internship-enrolment", onClose); };
  }, []);

  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Paint the scratch-off cover whenever the card opens fresh.
  useEffect(() => {
    if (!open || phase !== "idle") return;
    const canvas = canvasRef.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CARD_W * dpr; canvas.height = CARD_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    const gradient = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
    gradient.addColorStop(0, "#087957"); gradient.addColorStop(1, "#18cb96");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, CARD_W, CARD_H);
    ctx.fillStyle = "#ffffff30";
    for (let i = 0; i < 28; i++) { ctx.beginPath(); ctx.arc((i * 47) % CARD_W, (i * 29) % CARD_H, 3 + (i % 3), 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#ffffff"; ctx.font = "600 17px system-ui, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Scratch here to reveal", CARD_W / 2, CARD_H / 2 - 2);
    ctx.font = "13px system-ui, sans-serif"; ctx.fillStyle = "#ffffffd9";
    ctx.fillText("your personal offer", CARD_W / 2, CARD_H / 2 + 20);
  }, [open, phase]);

  async function claim() {
    setPhase("claiming");
    try {
      const response = await fetch("/api/enrolment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "scratch", token: visitorToken() }) });
      const result = await response.json() as { code?: string; expiresAt?: number; discountAmount?: number; error?: string };
      if (!response.ok || !result.code || !result.expiresAt) throw new Error(result.error || "Could not create your offer.");
      storeReward({ code: result.code, expiresAt: result.expiresAt, discountAmount: result.discountAmount ?? PRICING.scratchDiscount });
      setPhase("done");
    } catch { setPhase("error"); }
  }

  function complete() {
    if (phase !== "idle") return;
    track("scratch_offer_scratched", { program: "drone-technology-internship" });
    void claim();
  }

  function clearedShare() {
    const canvas = canvasRef.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0, total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) { total++; if (data[i] < 40) clear++; }
    return total ? clear / total : 0;
  }

  function scratchAt(event: React.PointerEvent<HTMLCanvasElement>) {
    if (phase !== "idle" || !drawing.current) return;
    const canvas = canvasRef.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * CARD_W, y = ((event.clientY - rect.top) / rect.height) * CARD_H;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 38; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(drawing.current.x, drawing.current.y); ctx.lineTo(x, y); ctx.stroke();
    drawing.current = { x, y };
    if (++moves.current % 5 === 0 && clearedShare() >= CLEAR_TO_REVEAL) complete();
  }

  function startScratch(event: React.PointerEvent<HTMLCanvasElement>) {
    if (phase !== "idle") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    drawing.current = { x: ((event.clientX - rect.left) / rect.width) * CARD_W, y: ((event.clientY - rect.top) / rect.height) * CARD_H };
    scratchAt(event);
  }

  function dismiss() {
    setDismissed(true);
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* Dismissed for this page view only. */ }
  }

  function openCard() {
    setOpen(true);
    track("scratch_offer_opened", { program: "drone-technology-internship" });
  }

  function enrolNow() {
    track("enroll_clicked", { program: "drone-technology-internship", source: "scratch_offer" });
    setOpen(false);
    window.dispatchEvent(new CustomEvent("open-internship-enrolment", { detail: { source: "scratch_offer" } }));
  }

  const revealed = phase === "claiming" || phase === "done";
  const showPill = eligible && shown && !open && !enrolmentOpen;

  return <>
    {showPill && <div className={styles.pill} role="region" aria-label="Your personal offer">
      <button type="button" className={styles.pillMain} onClick={openCard}><Gift size={17} aria-hidden="true" />Scratch to reveal your offer</button>
      <button type="button" className={styles.pillClose} aria-label="Dismiss offer" onClick={dismiss}><X size={15} aria-hidden="true" /></button>
    </div>}
    {open && <div className={styles.overlay} onMouseDown={event => { if (event.target === event.currentTarget) close(); }}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="scratch-title">
        <button ref={closeRef} type="button" className={styles.close} aria-label="Close" onClick={close}><X size={18} aria-hidden="true" /></button>
        <p className={styles.eyebrow}>A gift for you</p>
        <h2 id="scratch-title">{formatINR(PRICING.scratchDiscount)} off your enrollment</h2>
        <div className={styles.card} style={{ width: CARD_W, height: CARD_H }}>
          <div className={styles.prize} aria-live="polite">
            <strong>{formatINR(PRICING.scratchDiscount)} OFF</strong>
            {phase === "done" && reward ? <><code>{reward.code}</code><span>Valid for 24 hours · expires in {remaining}</span></>
              : phase === "claiming" ? <span>Creating your personal code…</span>
              : phase === "error" ? <span>Something went wrong. Please try again.</span>
              : <span>Your personal code is inside</span>}
          </div>
          {phase === "idle" && <canvas ref={canvasRef} className={styles.canvas} style={{ width: CARD_W, height: CARD_H }} onPointerDown={startScratch} onPointerMove={scratchAt} onPointerUp={() => { drawing.current = null; }} onPointerCancel={() => { drawing.current = null; }} aria-hidden="true" />}
        </div>
        {phase === "idle" && <button type="button" className={styles.reveal} onClick={complete}>Reveal without scratching</button>}
        {phase === "error" && <button type="button" className={styles.reveal} onClick={() => void claim()}>Try again</button>}
        {phase === "done" && <>
          <button type="button" className={`${styles.enrol} dark-action`} onClick={enrolNow}>Enroll now · {formatINR(scratchPrice)}</button>
          <p className={styles.note}>Your code is applied automatically at checkout. It&apos;s personal to you and works once.</p>
        </>}
      </section>
    </div>}
  </>;
}
