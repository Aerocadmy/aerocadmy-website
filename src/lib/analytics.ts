import posthog from "posthog-js";

export const CONSENT_KEY = "aerocadmy-analytics-consent";
export const CONSENT_VERSION = 1;
export const CONSENT_EVENT = "aerocadmy-consent-change";
export const OPEN_SETTINGS_EVENT = "aerocadmy-open-cookie-settings";

/** `analytics` covers PostHog identifiers, session replay, experiments and GA4. `ads` covers the Meta Pixel. */
export type Consent = { v: number; analytics: boolean; ads: boolean; ts: number };
type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const analyticsConfig = {
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  posthogHost: "https://eu.i.posthog.com",
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
};

export const analyticsEnabled = Boolean(analyticsConfig.posthogKey || analyticsConfig.gaId || analyticsConfig.metaPixelId);

export function getConsent(): Consent | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    if (parsed && parsed.v === CONSENT_VERSION && typeof parsed.analytics === "boolean" && typeof parsed.ads === "boolean") return parsed;
  } catch { /* No stored choice. */ }
  return null;
}

export function setConsent(choice: { analytics: boolean; ads: boolean }) {
  const record: Consent = { v: CONSENT_VERSION, ...choice, ts: Date.now() };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(record)); } catch { /* The choice still applies to this page view. */ }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
export const hasAnalyticsConsent = () => typeof window !== "undefined" && getConsent()?.analytics === true;

// Our event names -> the matching GA4 recommended event and Meta standard event.
const ga4Names: Record<string, string> = { lead_submitted: "generate_lead", waitlist_joined: "generate_lead", checkout_started: "begin_checkout", payment_completed: "purchase", course_viewed: "view_item" };
const metaNames: Record<string, string> = { lead_submitted: "Lead", waitlist_joined: "Lead", checkout_started: "InitiateCheckout", payment_completed: "Purchase", course_viewed: "ViewContent", whatsapp_click: "Contact" };

/**
 * PostHog always receives the event (anonymous and cookieless unless analytics is accepted).
 * GA4 needs the analytics choice and the Meta Pixel needs the advertising choice.
 * Never pass names, emails or phone numbers in `props`.
 */
export function track(event: string, props: Props = {}) {
  if (typeof window === "undefined") return;
  const consent = getConsent();
  if (analyticsConfig.posthogKey && posthog.__loaded) posthog.capture(event, props);
  if (analyticsConfig.gaId && consent?.analytics) window.gtag?.("event", ga4Names[event] ?? event, event === "payment_completed" ? { ...props, transaction_id: props.reference } : props);
  const metaEvent = metaNames[event];
  if (analyticsConfig.metaPixelId && consent?.ads && metaEvent) window.fbq?.("track", metaEvent, props);
}
