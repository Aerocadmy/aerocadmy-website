import { NextResponse } from "next/server";
import { confirmPayment, createOrder, credentials, getRegistration, validRegistration, validSignature } from "@/lib/enrolment";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Invalid form format." }, { status: 415 });
    if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Please use the enrolment page." }, { status: 403 });
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing form.");
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.length; if (size > 8192) { await reader.cancel(); return NextResponse.json({ error: "Form too large." }, { status: 413 }); } chunks.push(chunk.value); }
    const v = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (typeof v.id !== "string" || !/^[a-f0-9-]{36}$/.test(v.id) || typeof v.token !== "string" || !/^[a-f0-9]{64}$/.test(v.token)) return NextResponse.json({ error: "Please restart registration." }, { status: 400 });
    if (v.action === "register") {
      const input = validRegistration(v.details);
      if (!input) return NextResponse.json({ error: "Please complete your contact and Indian delivery address correctly." }, { status: 400 });
      return NextResponse.json(await createOrder(v.id, v.token, input), { headers: { "Cache-Control": "no-store" } });
    }
    const row = getRegistration(v.id, v.token);
    if (v.action === "status") {
      if (row.status === "paid") return NextResponse.json({ status: "paid", reference: row.id });
      if (row.order_id) {
        const { gateway } = await import("@/lib/enrolment");
        const result = await gateway(`orders/${row.order_id}/payments`);
        const payments = Array.isArray(result.items) ? result.items as Record<string, unknown>[] : [];
        const captured = payments.find(p => p.status === "captured" && typeof p.id === "string");
        if (captured) return NextResponse.json(await confirmPayment(row.order_id, captured.id as string));
      }
      return NextResponse.json({ status: "pending" });
    }
    if (v.action !== "verify" || typeof v.paymentId !== "string" || typeof v.signature !== "string" || !row.order_id || !validSignature(`${row.order_id}|${v.paymentId}`, v.signature, credentials().secret)) return NextResponse.json({ error: "Payment verification failed. Please contact the counsellor if money was deducted." }, { status: 400 });
    return NextResponse.json(await confirmPayment(row.order_id, v.paymentId));
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: message.startsWith("Payments are not") || message.startsWith("Your payment order") ? message : "We couldn’t complete this step. If money was deducted, check payment status or contact the counsellor before paying again." }, { status: 503 });
  }
}
