"use client";

import React from "react";
import { Check, X, Shield, Cpu, Activity, Award, Users } from "lucide-react";
import { STATS } from "@/lib/drone-data";

export const DroneTechSpecs: React.FC = () => {
  const comparisons = [
    {
      feature: "Frame Material & Durability",
      aerocadmy: "4.0mm Toray T700 3K True-X Carbon Fiber with chamfered edges",
      commercial: "Brittle injection-molded ABS plastic that cracks on impact",
      icon: Shield,
    },
    {
      feature: "Avionics Microcontroller",
      aerocadmy: "STM32F405 @ 168MHz running RTOS 8kHz PID loops",
      commercial: "Proprietary 8-bit locked microcontroller with fixed curves",
      icon: Cpu,
    },
    {
      feature: "Propulsion System",
      aerocadmy: "2205 2300KV Brushless Motors with N52SH Neodymium magnets",
      commercial: "Weak brushed coreless motors with plastic gear wear",
      icon: Activity,
    },
    {
      feature: "Firmware Ecosystem",
      aerocadmy: "Open-source Betaflight / PX4 Autopilot with full Blackbox logging",
      commercial: "Closed ecosystem with no telemetry or PID tuning access",
      icon: Award,
    },
    {
      feature: "Autonomous & AI Expansion",
      aerocadmy: "UART / I2C / SPI passthrough for Raspberry Pi, Jetson & OpenCV",
      commercial: "No serial access or sensor expansion ports",
      icon: Cpu,
    },
    {
      feature: "Field Reparability",
      aerocadmy: "100% modular architecture with single-bolt arm swaps in 2 mins",
      commercial: "Single-point failure requires discarding the entire aircraft",
      icon: Shield,
    },
  ];

  return (
    <section id="specs" className="scroll-mt-24 py-24 bg-white border-t border-[#e3eef0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-[#0097B2] uppercase mb-2">
            ENGINEERING RIGOR
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#081C2B] tracking-tight">
            Built for Real Engineers, Not Toy Shelves
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4a5b68]">
            We believe hands-on mastery requires working with genuine industrial-grade aerospace components, open protocols, and real telemetry data.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#e3eef0] bg-[#fbfdfd] p-6 text-center hover:border-[#18CB96] transition-colors"
            >
              <p className="text-3xl sm:text-4xl font-black text-[#081C2B] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#081C2B] via-[#0097B2] to-[#18CB96]">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#4a5b68] mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-16 overflow-x-auto rounded-3xl border border-[#e3eef0] bg-[#fbfdfd] shadow-sm" role="region" aria-label="Hardware comparison" tabIndex={0}>
          <div className="grid min-w-[680px] grid-cols-12 bg-[#081C2B] text-white p-5 sm:p-6 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <div className="col-span-4 sm:col-span-4">Engineering Feature</div>
            <div className="col-span-4 sm:col-span-4 text-[#18CB96]">Aerocadmy Platform</div>
            <div className="col-span-4 sm:col-span-4 text-slate-400">Off-the-Shelf Toy Drones</div>
          </div>

          <div className="divide-y divide-[#e3eef0]">
            {comparisons.map((c, idx) => (
              <div
                key={idx}
                className="grid min-w-[680px] grid-cols-12 items-center p-5 sm:p-6 text-xs sm:text-sm hover:bg-white transition-colors"
              >
                <div className="col-span-4 sm:col-span-4 font-bold text-[#081C2B] flex items-center gap-2">
                  <c.icon className="hidden sm:inline-block h-4 w-4 text-[#0097B2] flex-shrink-0" />
                  <span>{c.feature}</span>
                </div>

                <div className="col-span-4 sm:col-span-4 font-semibold text-[#081C2B] pr-2">
                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 rounded-full bg-[#18CB96]/15 text-[#18CB96] items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">{c.aerocadmy}</span>
                  </div>
                </div>

                <div className="col-span-4 sm:col-span-4 text-[#71818b] pl-2">
                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 rounded-full bg-rose-50 text-rose-500 items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">{c.commercial}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

