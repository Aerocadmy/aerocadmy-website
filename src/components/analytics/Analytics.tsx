"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import posthog from "posthog-js";
import { CONSENT_EVENT, OPEN_SETTINGS_EVENT, analyticsConfig, analyticsEnabled, getConsent, setConsent, type Consent } from "@/lib/analytics";

const { posthogKey, posthogHost, gaId, metaPixelId } = analyticsConfig;

export function Analytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const hadAnalytics = useRef(false);
  const [consent, setConsentState] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [customising, setCustomising] = useState(false);
  const [draft, setDraft] = useState({ analytics: false, ads: false });

  useEffect(() => {
    const sync = () => setConsentState(getConsent());
    const openSettings = () => { const current = getConsent(); setDraft({ analytics: current?.analytics ?? false, ads: current?.ads ?? false }); setCustomising(true); setOpen(true); };
    sync();
    setReady(true);
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);
    return () => { window.removeEventListener(CONSENT_EVENT, sync); window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings); };
  }, []);

  // PostHog always runs. Without the analytics choice it is cookieless, keeps no IP and records no sessions.
  useEffect(() => {
    if (!posthogKey || posthog.__loaded) return;
    const analytics = getConsent()?.analytics === true;
    hadAnalytics.current = analytics;
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: "identified_only",
      capture_pageview: "history_change",
      capture_pageleave: true,
      persistence: analytics ? "localStorage+cookie" : "memory",
      disable_session_recording: !analytics,
      ip: false,
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const analytics = consent?.analytics === true;
    if (posthogKey && posthog.__loaded && analytics !== hadAnalytics.current) {
      if (analytics) {
        posthog.set_config({ persistence: "localStorage+cookie", disable_session_recording: false, ip: true });
        posthog.startSessionRecording();
      } else {
        posthog.stopSessionRecording();
        posthog.reset();
        posthog.set_config({ persistence: "memory", disable_session_recording: true, ip: false });
      }
      hadAnalytics.current = analytics;
    }
    if (gaId) (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = !analytics;
    if (metaPixelId) window.fbq?.("consent", consent?.ads ? "grant" : "revoke");
  }, [consent, ready]);

  // The Pixel snippet reports the first PageView itself; later client-side navigations are reported here.
  useEffect(() => {
    if (!consent?.ads || !metaPixelId) return;
    if (lastPath.current !== null && lastPath.current !== pathname) window.fbq?.("track", "PageView");
    lastPath.current = pathname;
  }, [pathname, consent?.ads]);

  if (!analyticsEnabled) return null;

  function choose(choice: { analytics: boolean; ads: boolean }) { setConsent(choice); setOpen(false); setCustomising(false); }
  const visible = ready && (consent === null || open);

  return <>
    {consent?.analytics && gaId && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});gtag('js',new Date());gtag('config','${gaId}',{allow_google_signals:false});`}</Script>
    </>}
    {consent?.ads && metaPixelId && <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}</Script>}
    {visible && <div role="dialog" aria-label="Cookie choices" className="fixed bottom-24 left-4 right-4 z-40 max-w-md rounded-2xl border border-[#d6e4e0] bg-white p-5 shadow-xl sm:bottom-4 sm:right-auto">
      <p className="text-base font-bold text-[#081C2B]">Help us build a better Aerocadmy</p>
      <p className="mt-1.5 text-sm leading-relaxed text-[#3d5560]">Cookies let us see which lessons and pages help students most, and show our programs to people who&apos;d enjoy them. Essential cookies are always on. Everything else is your choice and you can change it anytime from “Cookie settings” in the footer. <a href="/privacy-policy" className="font-semibold text-[#087957] underline">Learn more</a></p>
      {customising && <div className="mt-3 space-y-3 text-sm text-[#081C2B]">
        <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-4 w-4 accent-[#087957]" checked={draft.analytics} onChange={event => setDraft({ ...draft, analytics: event.target.checked })} /><span><strong>Analytics</strong><br /><span className="text-[#3d5560]">Remembers you between visits, records anonymised sessions and lets us test improvements (PostHog, Google Analytics).</span></span></label>
        <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-4 w-4 accent-[#087957]" checked={draft.ads} onChange={event => setDraft({ ...draft, ads: event.target.checked })} /><span><strong>Advertising</strong><br /><span className="text-[#3d5560]">Measures our Meta (Facebook and Instagram) ads and shows our programs to relevant people. For visitors aged 18 or older only.</span></span></label>
      </div>}
      <div className="mt-4 flex flex-wrap gap-2">
        {customising
          ? <button type="button" onClick={() => choose(draft)} className="min-h-10 flex-1 rounded-full bg-[#087957] px-4 py-2 text-sm font-semibold text-white">Save my choices</button>
          : <button type="button" onClick={() => choose({ analytics: true, ads: true })} className="min-h-10 flex-1 rounded-full bg-[#087957] px-4 py-2 text-sm font-semibold text-white">Accept all</button>}
        <button type="button" onClick={() => choose({ analytics: false, ads: false })} className="min-h-10 flex-1 rounded-full border border-[#087957] px-4 py-2 text-sm font-semibold text-[#087957]">Essential only</button>
        {!customising && <button type="button" onClick={() => setCustomising(true)} className="min-h-10 w-full px-2 text-sm font-semibold text-[#3d5560] underline">Customise</button>}
      </div>
    </div>}
  </>;
}
