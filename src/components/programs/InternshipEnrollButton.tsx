"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { track } from "@/lib/analytics";

export function InternshipEnrollButton({ className, children, source = "page" }: { className: string; children: ReactNode; source?: string }) {
  return <button
    type="button"
    className={`${className} dark-action`}
    aria-haspopup="dialog"
    onClick={() => { track("enroll_clicked", { program: "drone-technology-internship", source }); window.dispatchEvent(new CustomEvent("open-internship-enrolment", { detail: { source } })); }}
  >
    {children}<ArrowUpRight size={18} aria-hidden="true" />
  </button>;
}
