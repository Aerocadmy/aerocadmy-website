import { NextResponse } from "next/server";
import { saveCounselling, validateCounselling } from "@/lib/counselling";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Please send the form as JSON." }, { status: 415 });
  if (Number(request.headers.get("content-length")) > 8192) return NextResponse.json({ error: "Form is too large." }, { status: 413 });
  let value: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: "Please complete the form." }, { status: 400 });
    const decoder = new TextDecoder();
    let body = "", bytes = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 8192) { await reader.cancel(); return NextResponse.json({ error: "Form is too large." }, { status: 413 }); }
      body += decoder.decode(chunk.value, { stream: true });
    }
    body += decoder.decode();
    value = JSON.parse(body);
  } catch { return NextResponse.json({ error: "Please check your answers and try again." }, { status: 400 }); }
  const input = validateCounselling(value);
  if (!input) return NextResponse.json({ error: "Check your background and learning choices, and enter a valid name, phone number and email. Use Back to review earlier answers." }, { status: 400 });
  try {
    await saveCounselling(input);
    return NextResponse.json({ message: "Your callback request and answers have been saved." }, { status: 201 });
  } catch { return NextResponse.json({ error: "We couldn't save your request. Your answers are still here; please try again later." }, { status: 503 }); }
}
