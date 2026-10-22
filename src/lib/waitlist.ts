import { findRecordedCourse } from "@/data/courses";
import { supabaseAdmin } from "@/lib/supabase";

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
  const { error } = await supabaseAdmin().from("waitlist_entries").insert({
    course_slug: input.courseSlug, course_title: course.title, name: input.name, email: input.email, phone: input.phone,
  });
  if (error) throw new Error("Could not save waitlist entry.");
}
