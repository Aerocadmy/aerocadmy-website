"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { CONSENT_EVENT, getConsent } from "@/lib/analytics";

/**
 * Returns a PostHog feature flag / A-B test variant ("control", "variant-a"…), or undefined until flags
 * load or when the visitor has not accepted analytics (they have no stable ID, so they always see the control).
 */
export function useFeatureFlag(key: string): string | boolean | undefined {
  const [value, setValue] = useState<string | boolean | undefined>();
  useEffect(() => {
    let off: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const attach = () => {
      off?.();
      off = undefined;
      if (!getConsent()?.analytics) { setValue(undefined); return; }
      // PostHog switches to persistent storage in response to the same consent event; give it a moment.
      timer = setTimeout(() => { off = posthog.onFeatureFlags(() => setValue(getConsent()?.analytics ? posthog.getFeatureFlag(key) : undefined)); }, 300);
    };
    attach();
    window.addEventListener(CONSENT_EVENT, attach);
    return () => { clearTimeout(timer); off?.(); window.removeEventListener(CONSENT_EVENT, attach); };
  }, [key]);
  return value;
}
