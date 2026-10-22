"use client";

import React, { useState } from "react";
import { PROGRAMS } from "@/lib/drone-data";
import { ProgramTrack } from "@/types";
import { Compass, Cpu, Rocket, Clock, CheckCircle2, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { AdvisorModal } from "../navbar/AdvisorModal";

export const ProgramsSection: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const getIcon = (name: string) => {
    switch (name) {
      case "Compass":
        return <Compass className="h-6 w-6 text-[#0097B2]" />;
      case "Cpu":
        return <Cpu className="h-6 w-6 text-[#18CB96]" />;
      case "Rocket":
        return <Rocket className="h-6 w-6 text-[#0097B2]" />;
      default:
        return <Cpu className="h-6 w-6 text-[#0097B2]" />;
    }
  };

  const handleEnrollClick = (progTitle: string) => {
    setSelectedProgram(progTitle);
    setIsAdvisorOpen(true);
  };

  return (
    <>
      <section id="programs" className="scroll-mt-24 py-24 bg-[#fbfdfd] border-t border-[#e3eef0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.2em] text-[#0097B2] uppercase mb-2">
              FROM UNDERSTANDING TO DOING
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#081C2B] tracking-tight">
              What would you like to build next?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#4a5b68] leading-relaxed">
              A completed drone is just the beginning. Explore the engineering ideas behind your build, connect them through hands-on projects, and put your learning into practice.
            </p>
          </div>

          {/* Program Cards Grid */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROGRAMS.map((prog, index) => (
              <div
                key={prog.id}
                className="relative flex flex-col justify-between rounded-3xl border border-[#e3eef0] bg-white p-7 sm:p-8 shadow-sm hover:shadow-card-hover hover:border-[#0097B2]/40 transition-all duration-300 group"
              >
                {/* Header of card */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-extrabold tracking-widest text-[#0097B2]">
                      {prog.badge}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                      {prog.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fbfdfd] border border-[#e3eef0] shadow-xs group-hover:scale-110 transition-transform">
                      {getIcon(prog.iconName)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#71818b] font-medium">
                      <Clock className="h-3.5 w-3.5 text-[#0097B2]" />
                      <span>{prog.duration}</span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#081C2B] tracking-tight group-hover:text-[#0097B2] transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#18CB96] mt-1 mb-3">
                    {prog.tagline}
                  </p>
                  <p className="text-sm text-[#4a5b68] leading-relaxed mb-6">
                    {prog.description}
                  </p>

                  {/* Curriculum modules */}
                  <div className="space-y-4 border-t border-[#e3eef0] pt-6 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#71818b]">
                      Core Curriculum
                    </p>
                    <ul className="space-y-2 text-xs text-[#4a5b68]">
                      {prog.curriculum.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#18CB96] flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Featured project highlight */}
                  <div className="rounded-xl bg-[#fbfdfd] border border-[#e3eef0] p-3 mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#0097B2]">
                      Capstone Build Project
                    </p>
                    <p className="text-xs font-semibold text-[#081C2B] mt-1">
                      {prog.projects[0]}
                    </p>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => handleEnrollClick(prog.title)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#081C2B] py-3.5 text-sm font-semibold text-white shadow-primary hover:bg-[#0097B2] hover:shadow-cta transition-all group/btn"
                  >
                    <span>Apply for Track</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Replay action bar */}
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e3eef0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18CB96]/15 text-[#18CB96]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#081C2B]">Curious about how it all fits together?</h4>
                <p className="text-xs text-[#4a5b68]">Review the interactive 3D assembly from the first screw to the first flight.</p>
              </div>
            </div>

            <a
              href="#assembly-track"
              className="inline-flex items-center gap-2 rounded-xl border border-[#081C2B] bg-white px-5 py-2.5 text-sm font-bold text-[#081C2B] hover:bg-[#081C2B] hover:text-white transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Replay the Building Journey</span>
            </a>
          </div>
        </div>
      </section>

      {/* Advisor Modal instance */}
      <AdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        defaultProgram={selectedProgram || undefined}
      />
    </>
  );
};

