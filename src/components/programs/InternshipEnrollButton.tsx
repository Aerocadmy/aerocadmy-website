"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { track } from "@/lib/analytics";

export function InternshipEnrollButton({ className, children }: { className: string; children: ReactNode }) {
  return <button
    type="button"
    className={`${className} dark-action`}
    aria-haspopup="dialog"
    onClick={() => { track("enroll_clicked", { program: "drone-technology-internship" }); window.dispatchEvent(new Event("open-internship-enrolment")); }}
  >
    {children}<ArrowUpRight size={18} aria-hidden="true" />
  </button>;
}
