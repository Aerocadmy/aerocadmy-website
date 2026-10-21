import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { findRecordedCourse } from "@/data/courses";

export type WaitlistInput = { name: string; email: string; phone: string; courseSlug: string };

export function validateWaitlist(value: unknown): WaitlistInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const fields = value as Record<string, unknown>;
  if (!["name", "email", "phone", "courseSlug"].every(key => typeof fields[key] === "string")) return null;
  const name = (fields.name as string).trim();
  const email = (fields.email as string).trim().toLowerCase();
  const phone = (fields.phone as string).trim();
  const courseSlug = fields.courseSlug as string;
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || name.length > 100 || /[\u0000-\u001f]/.test(name)) return null;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (phone.length > 32 || !/^[+()\d\s.-]+$/.test(phone) || digits.length < 7 || digits.length > 15) return null;
  if (!findRecordedCourse(courseSlug)) return null;
  return { name, email, phone, courseSlug };
}

export async function saveWaitlist(input: WaitlistInput) {
  const course = findRecordedCourse(input.courseSlug);
  if (!course) throw new Error("Unknown recorded course");
  const directory = process.env.WAITLIST_STORAGE_DIR || path.join(process.cwd(), ".data");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const entry = { id: randomUUID(), createdAt: new Date().toISOString(), ...input, courseTitle: course.title, source: "course-waitlist" };
  await appendFile(path.join(directory, "waitlist.jsonl"), JSON.stringify(entry) + "\n", { encoding: "utf8", mode: 0o600 });
}
