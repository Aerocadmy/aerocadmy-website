import { NextResponse } from "next/server";
import { confirmPayment, couponQuote, CouponValidationError, createOrder, credentials, getRegistration, reconcileOrderPayment, sendPendingEnrollmentConfirmation, validRegistration, validSignature } from "@/lib/enrolment";
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
    let v: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
      v = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    if (v.action === "coupon") return NextResponse.json(couponQuote(v.couponCode), { headers: { "Cache-Control": "no-store" } });
    if (typeof v.id !== "string" || !/^[a-f0-9-]{36}$/.test(v.id) || typeof v.token !== "string" || !/^[a-f0-9]{64}$/.test(v.token)) return NextResponse.json({ error: "Please restart registration." }, { status: 400 });
    if (v.action === "register") {
      const input = validRegistration(v.details);
      if (!input) return NextResponse.json({ error: "Please complete your name, email, and phone number correctly." }, { status: 400 });
      if (v.couponCode !== undefined && typeof v.couponCode !== "string") return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
      return NextResponse.json(await createOrder(v.id, v.token, input, v.couponCode as string | undefined), { headers: { "Cache-Control": "no-store" } });
    }
    const row = await getRegistration(v.id, v.token);
    if (v.action === "status") {
      if (row.status === "paid") {
        await sendPendingEnrollmentConfirmation(v.id, v.token);
        return NextResponse.json({ status: "paid", reference: row.reference_code, amount: row.amount, couponCode: row.coupon_code, discountAmount: row.discount_amount });
      }
      if (row.order_id) {
        const reconciled = await reconcileOrderPayment(row.order_id);
        if (reconciled) return NextResponse.json(reconciled);
      }
      return NextResponse.json({ status: "pending", amount: row.amount, couponCode: row.coupon_code, discountAmount: row.discount_amount });
    }
    if (v.action !== "verify" || typeof v.paymentId !== "string" || typeof v.signature !== "string" || !row.order_id) return NextResponse.json({ error: "Payment verification failed. Please contact the counsellor if money was deducted." }, { status: 400 });
    const orderId = row.order_id;
    const signatureMessage = `${orderId}|${v.paymentId}`;
    const paymentSecrets = [credentials().secret, process.env.RAZORPAY_KEY_SECRET_PREVIOUS].filter((secret): secret is string => Boolean(secret));
    if (!paymentSecrets.some(secret => validSignature(signatureMessage, v.signature as string, secret))) return NextResponse.json({ error: "Payment verification failed. Please contact the counsellor if money was deducted." }, { status: 400 });
    return NextResponse.json(await confirmPayment(orderId, v.paymentId));
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (error instanceof CouponValidationError) return NextResponse.json({ error: message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    return NextResponse.json({ error: message.startsWith("Payments are not") || message.startsWith("Your payment order") ? message : "We couldn’t complete this step. If money was deducted, check payment status or contact the counsellor before paying again." }, { status: 503 });
  }
}
