"use client";

import React, { useState } from "react";
import { FAQS } from "@/lib/drone-data";
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react";
import { AdvisorModal } from "../navbar/AdvisorModal";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <>
      <section id="faqs" className="scroll-mt-24 py-24 bg-white border-t border-[#e3eef0]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] text-[#0097B2] uppercase mb-2">
              FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#081C2B] tracking-tight">
              Everything You Need to Know
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#4a5b68]">
              Got questions about hardware kits, programming languages, or classroom setup? We’ve got answers.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#e3eef0] bg-[#fbfdfd] transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-white"
                  >
                    <span className="text-base sm:text-lg font-bold text-[#081C2B] pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#0097B2] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div id={`faq-answer-${idx}`} className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#4a5b68] leading-relaxed border-t border-[#e3eef0]/50 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Help Callout */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#081C2B] to-[#0b3347] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#18CB96]/20 text-[#18CB96] flex-shrink-0">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold">Have a specific technical question?</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Speak directly with one of our aerospace engineering instructors.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAdvisorOpen(true)}
              className="flex-shrink-0 rounded-xl bg-[#0097B2] px-6 py-3 text-sm font-bold text-white shadow-cta hover:bg-[#007f96] transition-all"
            >
              Ask an Advisor
            </button>
          </div>
        </div>
      </section>

      <AdvisorModal isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
    </>
  );
};

