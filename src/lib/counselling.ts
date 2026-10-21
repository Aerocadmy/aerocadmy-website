import { callbackWindows, droneExperience, learningFormats, learningGoals, learningInterests, professions, type CounsellingInput } from "@/data/guidance";
import { supabaseAdmin } from "@/lib/supabase";

export function validateCounselling(value: unknown): CounsellingInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const fields = value as Record<string, unknown>;
  const required = ["profession", "experience", "interest", "goal", "format", "name", "phone", "email"];
  if (!required.every(key => typeof fields[key] === "string")) return null;
  if (!["fieldOfWork", "callbackWindow", "questions"].every(key => fields[key] === undefined || typeof fields[key] === "string")) return null;
  const text = (key: string) => typeof fields[key] === "string" ? (fields[key] as string).trim() : "";
  const input: CounsellingInput = { profession: text("profession"), fieldOfWork: text("fieldOfWork"), experience: text("experience"), interest: text("interest"), goal: text("goal"), format: text("format"), name: text("name"), phone: text("phone"), email: text("email").toLowerCase(), callbackWindow: text("callbackWindow") || "No preference", questions: text("questions") };
  const choices: [readonly string[], string][] = [[professions, input.profession], [droneExperience, input.experience], [learningInterests, input.interest], [learningGoals, input.goal], [learningFormats, input.format], [callbackWindows, input.callbackWindow]];
  if (!choices.every(([options, selected]) => options.includes(selected))) return null;
  if (input.name.length < 2 || input.name.length > 100 || /[\u0000-\u001f]/.test(input.name)) return null;
  if (input.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return null;
  const digits = input.phone.replace(/\D/g, "");
  if (input.phone.length > 32 || !/^[+()\d\s.-]+$/.test(input.phone) || digits.length < 7 || digits.length > 15) return null;
  if (input.fieldOfWork.length > 150 || input.questions.length > 1000) return null;
  return input;
}

export async function saveCounselling(input: CounsellingInput) {
  const { error } = await supabaseAdmin().from("counselling_requests").insert({
    profession: input.profession, field_of_work: input.fieldOfWork, experience: input.experience,
    interest: input.interest, goal: input.goal, format: input.format, name: input.name, phone: input.phone,
    email: input.email, callback_window: input.callbackWindow, questions: input.questions,
  });
  if (error) throw new Error("Could not save counselling request.");
}
