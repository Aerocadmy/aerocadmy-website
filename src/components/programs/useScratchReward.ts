"use client";

import { useEffect, useState } from "react";
import { SALE, saleActive } from "@/lib/batch";

export const formatINR = (paise: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);

const REWARD_KEY = "aerocadmy-scratch-reward";
const TOKEN_KEY = "aerocadmy-scratch-token";
export const REWARD_EVENT = "aerocadmy-scratch-reward-change";

export type Reward = { code: string; expiresAt: number; discountAmount: number };

export function readReward(): Reward | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(REWARD_KEY) || "null") as Reward | null;
    if (parsed && typeof parsed.code === "string" && typeof parsed.expiresAt === "number" && typeof parsed.discountAmount === "number") return parsed;
  } catch { /* No stored offer. */ }
  return null;
}

export function storeReward(reward: Reward) {
  try { localStorage.setItem(REWARD_KEY, JSON.stringify(reward)); } catch { /* The offer still works for this page view. */ }
  window.dispatchEvent(new Event(REWARD_EVENT));
}

/** A random per-browser secret that lets the server hand out exactly one offer per visitor. */
export function visitorToken() {
  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored && /^[a-f0-9]{64}$/.test(stored)) return stored;
    const created = Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, "0")).join("");
    localStorage.setItem(TOKEN_KEY, created);
    return created;
  } catch { return Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, "0")).join(""); }
}

export const rewardActive = (reward: Reward | null, now: number) => Boolean(reward && reward.expiresAt > now);

export function formatRemaining(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/** Countdown that stays readable when more than a day is left. */
function formatSaleRemaining(ms: number) {
  const days = Math.floor(ms / 86_400_000);
  return days ? `${days}d ${formatRemaining(ms % 86_400_000)}` : formatRemaining(ms);
}

/**
 * The visitor's personal offer. `ready` is false until mounted, so the server and first client
 * render match; render anything offer-dependent only once it is true.
 */
export function useScratchReward() {
  const [now, setNow] = useState<number | null>(null);
  const [stored, setStored] = useState<Reward | null>(null);

  useEffect(() => {
    setNow(Date.now());
    setStored(readReward());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    const sync = () => setStored(readReward());
    window.addEventListener(REWARD_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.clearInterval(timer); window.removeEventListener(REWARD_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);

  const ready = now !== null;
  // A running sale replaces the personal offer, so the two never show (or stack) together.
  const sale = ready && saleActive(now);
  const active = ready && !sale && rewardActive(stored, now);
  return { ready, now: now ?? 0, stored, sale, saleRemaining: sale ? formatSaleRemaining(SALE.endsAt - now!) : "", reward: active ? stored : null, remaining: active && stored ? formatRemaining(stored.expiresAt - now!) : "" };
}
