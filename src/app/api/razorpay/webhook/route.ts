import { NextResponse } from "next/server";
import { confirmPayment, validSignature } from "@/lib/enrolment";
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
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id && payment?.id) await confirmPayment(payment.order_id, payment.id);
    }
    // Confirmation is an idempotent update; duplicate and out-of-order events cannot undo paid status.
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: "Please retry delivery" }, { status: 503 }); }
}
