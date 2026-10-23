import "server-only";
import { createClient } from "@supabase/supabase-js";

type Table<Row, Insert> = { Row: Row; Insert: Insert; Update: Partial<Insert>; Relationships: [] };
type Tables = {
  enrolments: Table<{ id: string; reference_code: string; token_hash: string; name: string; email: string; phone: string; order_id: string | null; payment_id: string | null; status: string; amount: number; coupon_code: string | null; discount_amount: number; currency: string; created_at: string; paid_at: string | null; confirmation_email_sent_at: string | null; confirmation_email_claimed_at: string | null }, { id: string; token_hash: string; name: string; email: string; phone: string; reference_code?: string; order_id?: string | null; payment_id?: string | null; status?: string; amount?: number; coupon_code?: string | null; discount_amount?: number; currency?: string; created_at?: string; paid_at?: string | null; confirmation_email_sent_at?: string | null; confirmation_email_claimed_at?: string | null }>;
  payment_events: Table<{ id: string; event_id: string | null; event_type: string; order_id: string | null; payment_id: string | null; payload: Record<string, unknown>; signature_verified: boolean; received_at: string; processed_at: string | null }, { event_id?: string | null; event_type: string; order_id?: string | null; payment_id?: string | null; payload: Record<string, unknown>; signature_verified?: boolean; received_at?: string; processed_at?: string | null }>;
  waitlist_entries: Table<Record<string, unknown>, { course_slug: string; course_title: string; name: string; email: string; phone: string; status?: string }>;
  counselling_requests: Table<Record<string, unknown>, { profession: string; field_of_work: string; experience: string; interest: string; goal: string; format: string; name: string; phone: string; email: string; callback_window: string; questions: string }>;
};
type Database = { public: { Tables: Tables; Views: Record<string, never>; Functions: Record<string, never>; Enums: Record<string, never>; CompositeTypes: Record<string, never> } };
let client: ReturnType<typeof createClient<Database>> | undefined;

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");
  if (!client) client = createClient<Database>(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return client;
}

export function publicStorageUrl(path: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://maimkhygtoomqntopxuw.supabase.co";
  return `${url}/storage/v1/object/public/marketing-public/${path.split("/").map(encodeURIComponent).join("/")}`;
}
