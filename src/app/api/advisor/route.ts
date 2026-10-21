import { NextResponse } from "next/server";
import { saveAdvisorRequest, validateAdvisorRequest } from "@/lib/advisor";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Please send the form as JSON." }, { status: 415 });
  }

  let value: unknown;
  try {
    value = await request.json();
  } catch {
    return NextResponse.json({ error: "Please check your answers and try again." }, { status: 400 });
  }

  const input = validateAdvisorRequest(value);
  if (!input) return NextResponse.json({ error: "Enter a valid name, email and phone number." }, { status: 400 });

  try {
    await saveAdvisorRequest(input);
    return NextResponse.json({ message: "Your advisor request has been saved." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We couldn't save your request. Please try again later." }, { status: 503 });
  }
}
