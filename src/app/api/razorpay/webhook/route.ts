import { NextResponse } from "next/server";
import { confirmPayment, validSignature } from "@/lib/enrolment";
import { supabaseAdmin } from "@/lib/supabase";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  try {
    const reader = request.body?.getReader(); if (!reader) return new Response(null, { status: 400 });
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.length; if (size > 131072) { await reader.cancel(); return new Response(null, { status: 413 }); } chunks.push(chunk.value); }
    const raw = Buffer.concat(chunks).toString("utf8");
    if (!validSignature(raw, request.headers.get("x-razorpay-signature") || "", secret)) return new Response(null, { status: 401 });
    const event = JSON.parse(raw);
    const { error: eventError } = await supabaseAdmin().from("payment_events").insert({
      event_type: typeof event.event === "string" ? event.event : "unknown",
      order_id: typeof event.payload?.payment?.entity?.order_id === "string" ? event.payload.payment.entity.order_id : null,
      payment_id: typeof event.payload?.payment?.entity?.id === "string" ? event.payload.payment.entity.id : null,
      payload: event, signature_verified: true, processed_at: new Date().toISOString(),
    });
    if (eventError) throw new Error("Payment event could not be recorded.");
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id && payment?.id) await confirmPayment(payment.order_id, payment.id);
    }
    // Confirmation is an idempotent update; duplicate and out-of-order events cannot undo paid status.
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: "Please retry delivery" }, { status: 503 }); }
}
