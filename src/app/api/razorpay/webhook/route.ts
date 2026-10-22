import { NextResponse } from "next/server";
import { confirmPayment, reconcileOrderPayment, validSignature } from "@/lib/enrolment";
import { supabaseAdmin } from "@/lib/supabase";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const secrets = [process.env.RAZORPAY_WEBHOOK_SECRET, process.env.RAZORPAY_WEBHOOK_SECRET_PREVIOUS].filter((secret): secret is string => Boolean(secret));
  if (!secrets.length) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  try {
    const reader = request.body?.getReader(); if (!reader) return new Response(null, { status: 400 });
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.length; if (size > 131072) { await reader.cancel(); return new Response(null, { status: 413 }); } chunks.push(chunk.value); }
    const raw = Buffer.concat(chunks).toString("utf8");
    const signature = request.headers.get("x-razorpay-signature") || "";
    if (!secrets.some(secret => validSignature(raw, signature, secret))) return new Response(null, { status: 401 });
    const event = JSON.parse(raw);
    if (!event || typeof event.event !== "string") return new Response(null, { status: 400 });
    const eventId = request.headers.get("x-razorpay-event-id");
    if (!eventId || eventId.length > 256 || /[\u0000-\u001f]/.test(eventId)) return new Response(null, { status: 400 });
    const payment = event.payload?.payment?.entity;
    const order = event.payload?.order?.entity;
    const paymentId = typeof payment?.id === "string" ? payment.id : null;
    const orderId = typeof payment?.order_id === "string" ? payment.order_id : typeof order?.id === "string" ? order.id : null;
    const admin = supabaseAdmin();
    const { error: eventError } = await admin.from("payment_events").insert({
      event_id: eventId,
      event_type: typeof event.event === "string" ? event.event : "unknown",
      order_id: orderId,
      payment_id: paymentId,
      // Keep the audit record useful without retaining full payment/contact payloads.
      payload: {}, signature_verified: true,
    });
    if (eventError) {
      if (eventError.code !== "23505") throw new Error("Payment event could not be recorded.");
      const { data: prior, error: priorError } = await admin.from("payment_events").select("processed_at").eq("event_id", eventId).maybeSingle();
      if (priorError || !prior) throw new Error("Payment event could not be checked.");
      if (prior.processed_at) return NextResponse.json({ received: true, duplicate: true });
    }
    if (event.event === "payment.captured" || event.event === "order.paid") {
      if (!orderId || (event.event === "payment.captured" && !paymentId)) throw new Error("Paid payment event is incomplete.");
      const { data: enrolment, error: enrolmentError } = await admin.from("enrolments").select("id").eq("order_id", orderId).maybeSingle();
      if (enrolmentError) throw new Error("Payment registration could not be checked.");
      // This endpoint may receive other Razorpay products on the same merchant account.
      if (enrolment) {
        if (event.event === "payment.captured") await confirmPayment(orderId, paymentId!);
        else {
          const reconciled = await reconcileOrderPayment(orderId);
          if (!reconciled || (reconciled.status !== "paid" && reconciled.status !== "review_required")) throw new Error("Paid order could not be reconciled.");
        }
      }
    }
    const { error: processedError } = await admin.from("payment_events").update({ processed_at: new Date().toISOString() }).eq("event_id", eventId).is("processed_at", null);
    if (processedError) throw new Error("Payment event status could not be saved.");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook processing failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Please retry delivery" }, { status: 503 });
  }
}
