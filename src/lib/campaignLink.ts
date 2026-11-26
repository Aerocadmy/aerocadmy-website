import posthog from "posthog-js";

/**
 * Personal campaign links: `?r=<code>` marks which message recipient a visit came from.
 * The code is a random string with no personal data; the code-to-contact list is kept outside the site.
 * It is only attached to the visitor in PostHog once analytics cookies are accepted.
 */
const PARAM = "r";
const PREFIX = "wa_";
const CODE = /^[A-Za-z0-9]{6,16}$/;

/** Held in memory only, so nothing is stored for visitors who do not accept analytics. */
let pending: string | null = null;

/** Reads the code and removes it from the address bar. Call before PostHog starts, so no URL it records contains it. */
export function takeCampaignCode() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get(PARAM);
  if (code === null) return;
  if (CODE.test(code)) pending = code;
  url.searchParams.delete(PARAM);
  window.history.replaceState(window.history.state, "", url);
}

/** Call only when the visitor has accepted analytics. */
export function identifyCampaignVisitor() {
  if (!pending || !posthog.__loaded) return;
  const id = `${PREFIX}${pending}`;
  const current = posthog.get_distinct_id();
  // A different recipient's link on the same browser must not be merged into the earlier person.
  if (current.startsWith(PREFIX) && current !== id) posthog.reset();
  posthog.identify(id, { whatsapp_code: pending });
  pending = null;
}
