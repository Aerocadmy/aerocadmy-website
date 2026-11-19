"use client";

import { useEffect, useState } from "react";
import { PRICING, scratchPrice } from "@/lib/batch";
import { track } from "@/lib/analytics";
import { formatINR, useScratchReward } from "./useScratchReward";
import styles from "./InternshipStickyBar.module.css";

/** Mobile-only bottom bar: keeps the price and Enroll button in reach while scrolling. */
export function InternshipStickyBar() {
  const { ready, reward, remaining } = useScratchReward();
  const [scrolled, setScrolled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const open = () => setDialogOpen(true);
    const close = () => setDialogOpen(false);
    window.addEventListener("open-internship-enrolment", open);
    window.addEventListener("close-internship-enrolment", close);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("open-internship-enrolment", open);
      window.removeEventListener("close-internship-enrolment", close);
    };
  }, []);

  if (!ready || !scrolled || dialogOpen) return null;

  return <div className={styles.bar} role="region" aria-label="Enroll in the Drone Technology Internship">
    <div className={styles.info}>
      <strong>{formatINR(reward ? scratchPrice : PRICING.regular)}</strong>
      <span>{reward ? `Your offer ends in ${remaining}` : "ESP32 kit included"}</span>
    </div>
    <button type="button" className={styles.cta} aria-haspopup="dialog" onClick={() => { track("enroll_clicked", { program: "drone-technology-internship", source: "sticky_bar" }); window.dispatchEvent(new CustomEvent("open-internship-enrolment", { detail: { source: "sticky_bar" } })); }}>Enroll now</button>
  </div>;
}
