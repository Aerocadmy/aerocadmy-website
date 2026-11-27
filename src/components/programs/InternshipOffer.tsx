"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Gift, Users } from "lucide-react";
import { BATCH, PRICING, SALE, scratchPrice } from "@/lib/batch";
import { formatINR, useScratchReward } from "./useScratchReward";
import styles from "./InternshipOffer.module.css";

export function InternshipOffer() {
  const { ready, sale, saleRemaining, reward, remaining } = useScratchReward();
  const [seats, setSeats] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/enrolment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "offer" }) })
      .then(response => response.ok ? response.json() as Promise<{ seatsLeft: number | null }> : null)
      .then(result => { if (result && typeof result.seatsLeft === "number") setSeats(result.seatsLeft); })
      .catch(() => { /* The offer still works without the seat counter. */ });
  }, []);

  const showSeats = seats !== null && seats <= BATCH.showSeatsBelow;
  if (!ready) return <div className={styles.placeholder} aria-hidden="true" />;

  // The sale code is only applied once the visitor opens enrolment, so the card keeps the regular price.
  const price = !sale && reward ? scratchPrice : PRICING.regular;
  const taken = seats === null ? 0 : Math.max(0, BATCH.seatCap - seats);
  const filled = Math.min(100, (taken / BATCH.seatCap) * 100);

  return <>
    <div className={styles.price}>
      <del>{formatINR(PRICING.anchor)}</del>
      <strong>{formatINR(price)}</strong>
    </div>
    {sale
      ? <div className={styles.offerBox} role="timer" aria-label={`${SALE.name} offer ends in`}>
          <div className={styles.offerHead}><Gift size={15} aria-hidden="true" /><span>{SALE.name} sale is live</span><b>{formatINR(SALE.discount)} OFF</b></div>
          <p className={styles.offerCode}>Don’t miss <b>{formatINR(SALE.discount)} off</b>. Use code <b>{SALE.code}</b> when you enroll.</p>
          <div className={styles.offerTime}><span>{formatINR(SALE.discount)} off ends in</span><b>{saleRemaining}</b></div>
        </div>
      : reward
      ? <div className={styles.offerBox} role="timer" aria-label="Your offer expires in">
          <div className={styles.offerHead}><Gift size={15} aria-hidden="true" /><span>Your offer</span><b>Save {formatINR(PRICING.anchor - price)}</b></div>
          <div className={styles.offerTime}><span>Expires in</span><b>{remaining}</b></div>
        </div>
      : <p className={styles.savePill}>You save {formatINR(PRICING.anchor - price)}</p>}
    {showSeats && seats === 0
      ? <p className={styles.full}>This batch is full — talk to a counsellor to join the waitlist.</p>
      : <ul className={styles.meta}>
          {showSeats && <li className={styles.seatsBlock}>
            <div className={styles.seatsTop}>
              <span className={styles.seats}><Users size={16} aria-hidden="true" />{seats} of {BATCH.seatCap} seats left</span>
              {filled >= 50 && <em className={styles.fast}>Filling fast</em>}
            </div>
            <div className={styles.bar} role="progressbar" aria-label="Seats filled" aria-valuemin={0} aria-valuemax={BATCH.seatCap} aria-valuenow={taken}><span style={{ width: `${filled}%` }} /></div>
          </li>}
          <li><CalendarDays size={16} aria-hidden="true" />Starts {BATCH.startLabel}</li>
        </ul>}
  </>;
}
