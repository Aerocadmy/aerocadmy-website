"use client";

import { useEffect, useState } from "react";
import { BATCH, PRICING, scratchPrice } from "@/lib/batch";
import { formatINR, useScratchReward } from "./useScratchReward";
import styles from "./InternshipOffer.module.css";

export function InternshipOffer() {
  const { ready, reward, remaining } = useScratchReward();
  const [seats, setSeats] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/enrolment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "offer" }) })
      .then(response => response.ok ? response.json() as Promise<{ seatsLeft: number | null }> : null)
      .then(result => { if (result && typeof result.seatsLeft === "number") setSeats(result.seatsLeft); })
      .catch(() => { /* The offer still works without the seat counter. */ });
  }, []);

  const showSeats = seats !== null && seats <= BATCH.showSeatsBelow;
  if (!ready) return <div className={styles.placeholder} aria-hidden="true" />;

  return <>
    <div className={styles.price}>
      <del>{formatINR(PRICING.anchor)}</del>
      <strong>{formatINR(reward ? scratchPrice : PRICING.regular)}</strong>
      {reward && <span className={styles.tag}>Your offer</span>}
    </div>
    {reward && <p className={styles.save}>Your personal {formatINR(reward.discountAmount)} discount is applied at checkout.</p>}
    {reward && <div className={styles.timer} role="timer" aria-label="Your offer expires in">
      <span className={styles.timerLabel}>Offer expires in</span>
      <span className={styles.clock}><b>{remaining}</b></span>
    </div>}
    {showSeats && (seats > 0
      ? <p className={styles.seats}><span aria-hidden="true" className={styles.dot} />Only {seats} of {BATCH.seatCap} seats left</p>
      : <p className={styles.seats}>This batch is full — talk to a counsellor to join the waitlist.</p>)}
    <p className={styles.batch}>Next batch starts · {BATCH.startLabel}</p>
  </>;
}
