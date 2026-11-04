"use client";

import { useEffect } from "react";
import { CONSENT_EVENT, track } from "@/lib/analytics";

/** Fires one event shortly after the page loads, or after the visitor accepts analytics on this page. */
export function TrackEvent({ event, props }: { event: string; props?: Record<string, string | number | boolean> }) {
  const serialized = JSON.stringify(props ?? {});
  useEffect(() => {
    let sent = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // The delay lets PostHog, GA4 and the Pixel finish loading before the event is sent.
    const schedule = () => { if (sent) return; clearTimeout(timer); timer = setTimeout(() => { sent = true; track(event, JSON.parse(serialized)); }, 1500); };
    schedule();
    window.addEventListener(CONSENT_EVENT, schedule);
    return () => { clearTimeout(timer); window.removeEventListener(CONSENT_EVENT, schedule); };
  }, [event, serialized]);
  return null;
}
