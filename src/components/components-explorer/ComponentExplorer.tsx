"use client";

import React, { useState, useEffect } from "react";
import { DRONE_COMPONENTS } from "@/lib/drone-data";
import { DroneComponent } from "@/types";
import { ComponentImage } from "@/components/ui/ComponentImage";
import { Cpu, CheckCircle, ChevronRight, Layers, Zap, Gauge, Shield, ArrowUpRight } from "lucide-react";

export const ComponentExplorer: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<DroneComponent>(DRONE_COMPONENTS[0]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const selectFilter = (category: string) => {
    setActiveFilter(category);
    if (category !== 'all' && selectedComp.category !== category) {
      const component = DRONE_COMPONENTS.find(item => item.category === category);
      if (component) setSelectedComp(component);
    }
  };
  useEffect(() => {
    const select = (event: Event) => {
      const component = DRONE_COMPONENTS.find(item => item.id === (event as CustomEvent<string>).detail);
      if (component) { setActiveFilter('all'); setSelectedComp(component); }
    };
    window.addEventListener('aerocadmy:select-component', select);
    return () => window.removeEventListener('aerocadmy:select-component', select);
  }, []);

  const categories = [
    { id: "all", label: "All Hardware" },
    { id: "propulsion", label: "Propulsion & Lift" },
    { id: "avionics", label: "Flight Avionics" },
    { id: "power", label: "Power Systems" },
    { id: "structure", label: "Frame & Structure" },
    { id: "optics", label: "Optics & Vision" },
  ];

  const filteredComponents = activeFilter === "all"
    ? DRONE_COMPONENTS
    : DRONE_COMPONENTS.filter((c) => c.category === activeFilter);

  return (
    <section id="components" className="relative scroll-mt-24 py-24 bg-white border-t border-[#e3eef0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#e3eef0]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#0097B2] uppercase mb-2">
              <Cpu className="h-4 w-4" />
              <span>AEROSPACE CAD & HARDWARE INSPECTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#081C2B] tracking-tight">
              Anatomy of a High-Performance Drone
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#4a5b68] max-w-2xl leading-relaxed">
              Every screw, coil, and sensor in our curriculum is chosen for flight reliability and educational depth. Click any module below to inspect its specifications.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => selectFilter(cat.id)}
                aria-pressed={activeFilter === cat.id}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  activeFilter === cat.id
                    ? "bg-[#081C2B] text-white shadow-sm"
                    : "bg-slate-100 text-[#4a5b68] hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Explorer Main Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Component List Cards */}
          <div className="lg:col-span-5 space-y-3">
            {filteredComponents.map((comp) => {
              const isSelected = selectedComp.id === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComp(comp)}
                  className={`w-full text-left rounded-2xl p-4 transition-all border flex items-center gap-4 group ${
                    isSelected
                      ? "bg-[#fbfdfd] border-[#0097B2] shadow-md ring-2 ring-[#0097B2]/15"
                      : "bg-white border-[#e3eef0] hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-slate-50 border border-slate-200/80 p-1.5 flex items-center justify-center overflow-hidden">
                    <ComponentImage
                      src={comp.image}
                      alt={comp.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0097B2]">
                        {comp.category}
                      </span>
                      {isSelected && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-[#18CB96]" />
                      )}
                    </div>
                    <h4 className="text-base font-bold text-[#081C2B] group-hover:text-[#0097B2] transition-colors truncate">
                      {comp.name}
                    </h4>
                    <p className="text-xs text-[#71818b] truncate">{comp.subtitle}</p>
                  </div>

                  <ChevronRight
                    className={`h-5 w-5 transition-transform ${
                      isSelected
                        ? "text-[#0097B2] translate-x-1"
                        : "text-slate-300 group-hover:text-slate-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep Inspection Panel */}
          <div className="lg:col-span-7 rounded-3xl border border-[#e3eef0] bg-[#fbfdfd] p-6 sm:p-8 lg:p-10 shadow-lg">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e3eef0] pb-6">
              <div>
                <span className="inline-block rounded-full bg-[#18CB96]/15 px-3 py-1 text-xs font-bold text-[#18CB96] uppercase tracking-wider mb-2">
                  Role: {selectedComp.role}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#081C2B]">
                  {selectedComp.name}
                </h3>
                <p className="text-sm font-semibold text-[#0097B2] mt-0.5">
                  {selectedComp.subtitle}
                </p>
              </div>

              <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl bg-white border border-[#e3eef0] p-3 flex items-center justify-center shadow-sm">
                <ComponentImage
                  src={selectedComp.image}
                  alt={selectedComp.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md hover:scale-105 transition-transform"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#71818b] mb-2">
                Engineering Overview
              </h5>
              <p className="text-sm sm:text-base text-[#4a5b68] leading-relaxed">
                {selectedComp.description}
              </p>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="mt-8">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#71818b] mb-3 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-[#0097B2]" />
                <span>Technical Specifications</span>
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedComp.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#e3eef0] bg-white p-3 shadow-xs"
                  >
                    <p className="text-[11px] font-semibold text-[#71818b]">{spec.label}</p>
                    <p className="text-sm font-bold text-[#081C2B] mt-0.5">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineering Highlights */}
            <div className="mt-8 pt-6 border-t border-[#e3eef0]">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#71818b] mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#18CB96]" />
                <span>Aerospace Quality Standards</span>
              </h5>
              <div className="space-y-2.5">
                {selectedComp.engineeringHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-[#18CB96] flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-[#4a5b68] leading-relaxed">{hl}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA action */}
            <div className="mt-8 pt-6 border-t border-[#e3eef0] flex items-center justify-between">
              <span className="text-xs text-[#71818b]">
                Included in all physical Aerocadmy student builder kits
              </span>
              <a
                href="#programs"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0097B2] hover:text-[#007f96]"
              >
                <span>View Program Details</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

