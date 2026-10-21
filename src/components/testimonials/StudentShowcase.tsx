"use client";

import React from "react";
import Image from 'next/image';
import { TESTIMONIALS } from "@/lib/drone-data";
import { Quote, Star, Award, CheckCircle } from "lucide-react";

export const StudentShowcase: React.FC = () => {
  return (
    <section id="reviews" className="scroll-mt-24 py-24 bg-[#fbfdfd] border-t border-[#e3eef0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-[0.2em] text-[#0097B2] uppercase mb-2">
            STUDENT & PARTNER IMPACT
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#081C2B] tracking-tight">
            From First Solder to Commercial Flight
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4a5b68]">
            Hear from engineering students, researchers, and academic mentors who built their foundations with Aerocadmy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-3xl border border-[#e3eef0] bg-white p-7 sm:p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#18CB96]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#18CB96]">
                    <CheckCircle className="h-3 w-3" />
                    <span>{item.badge}</span>
                  </span>
                </div>

                <Quote className="h-8 w-8 text-[#0097B2]/20 mb-3" />

                <p className="text-sm sm:text-base text-[#4a5b68] leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#e3eef0] flex items-center gap-4">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  width={48}
                  height={48}
                  quality={95}
                  className="h-12 w-12 rounded-full object-cover border-2 border-[#18CB96]"
                />
                <div>
                  <h4 className="text-base font-bold text-[#081C2B]">{item.name}</h4>
                  <p className="text-xs text-[#71818b] font-medium">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

