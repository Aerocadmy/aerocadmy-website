import { supabaseAdmin } from "@/lib/supabase";

export type AdvisorRequest = {
  name: string;
  email: string;
  phone: string;
  experience: string;
  program: string;
  notes: string;
};

export function validateAdvisorRequest(value: unknown): AdvisorRequest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const fields = value as Record<string, unknown>;
  const text = (key: keyof AdvisorRequest) => typeof fields[key] === "string" ? fields[key].trim() : "";
  const input = {
    name: text("name"),
    email: text("email").toLowerCase(),
    phone: text("phone"),
    experience: text("experience"),
    program: text("program"),
    notes: text("notes"),
  };
  const digits = input.phone.replace(/\D/g, "");
  if (input.name.length < 2 || input.name.length > 100 || input.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
      input.phone.length > 32 || !/^[+()\d\s.-]+$/.test(input.phone) ||
      digits.length < 7 || digits.length > 15 || input.program.length > 150 || input.notes.length > 1000) return null;
  return input;
}

export async function saveAdvisorRequest(input: AdvisorRequest) {
  const experience = {
    beginner: "No experience yet",
    undergrad: "College student",
    hobbyist: "Built or repaired a drone",
    educator: "Educator / researcher",
  }[input.experience] || "Not sure yet";
  const { error } = await supabaseAdmin().from("counselling_requests").insert({
    profession: "Other",
    field_of_work: input.program,
    experience,
    interest: "Not sure yet",
    goal: "Help me figure this out",
    format: "Open to either / need guidance",
    name: input.name,
    phone: input.phone,
    email: input.email,
    callback_window: "No preference",
    questions: [`Advisor request for ${input.program}`, input.notes].filter(Boolean).join("\n\n"),
  });
  if (error) throw new Error("Could not save advisor request.");
}
