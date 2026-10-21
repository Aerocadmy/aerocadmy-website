"use client";

import React, { useState, useEffect } from "react";
import { Search, X, ArrowRight, BookOpen, Layers, Cpu } from "lucide-react";
import { DRONE_COMPONENTS, LESSONS } from "@/lib/drone-data";
import { recordedCourses } from "@/data/courses";
import { useDialog } from "@/components/ui/useDialog";
import { ComponentImage } from "@/components/ui/ComponentImage";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onSelectComponent?: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
  onSelectComponent,
}) => {
  const [query, setQuery] = useState("");
  const dialogRef = useDialog(isOpen, onClose);
  useEffect(() => { if (isOpen) setQuery(initialQuery); }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredComponents = q
    ? DRONE_COMPONENTS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      )
    : DRONE_COMPONENTS.slice(0, 4);

  const filteredPrograms = q
    ? recordedCourses.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.modules.some(module => module.toLowerCase().includes(q)) ||
          p.group.toLowerCase().includes(q)
      )
    : recordedCourses;

  const filteredLessons = q
    ? LESSONS.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.label.toLowerCase().includes(q)
      )
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search curriculum and components"
      ref={dialogRef}
      tabIndex={-1}
      className="site-search-dialog fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:p-6 sm:pt-24"
    >
      <div
        className="fixed inset-0 bg-[#081C2B]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="site-search-panel relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#e3eef0] transition-all">
        {/* Search input header */}
        <div className="flex shrink-0 items-center border-b border-[#e3eef0] px-4 py-3 sm:px-6">
          <Search className="h-5 w-5 text-[#0097B2] mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, lessons or drone parts"
            aria-label="Search query"
            className="min-w-0 w-full bg-transparent text-base text-[#081C2B] placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="p-1 text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 border border-slate-200">
            ESC
          </kbd>
          <button onClick={onClose} aria-label="Close search" className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center text-slate-500 hover:text-[#0097B2]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results area */}
        <div className="site-search-results max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Hardware Components Section */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0097B2] mb-3">
              <Cpu className="h-4 w-4" />
              <span>Drone Components & Hardware</span>
            </div>
            {filteredComponents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredComponents.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      if (onSelectComponent) onSelectComponent(comp.id);
                      window.dispatchEvent(new CustomEvent('aerocadmy:select-component', { detail: comp.id }));
                      onClose();
                      const el = document.getElementById("components");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-[#e3eef0] hover:bg-[#fbfdfd] transition-all text-left group"
                  >
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center p-1 border border-slate-200">
                      <ComponentImage
                        src={comp.image}
                        alt={comp.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#081C2B] group-hover:text-[#0097B2] truncate transition-colors">
                        {comp.name}
                      </p>
                      <p className="text-xs text-[#4a5b68] truncate">{comp.role}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#0097B2] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No matching components found.</p>
            )}
          </div>

          {/* Programs Section */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#18CB96] mb-3">
              <BookOpen className="h-4 w-4" />
              <span>Planned recorded courses</span>
            </div>
            <div className="space-y-2">
              {filteredPrograms.map((prog) => (
                <a
                  key={prog.slug}
                  href={`/courses/${prog.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#18CB96]/40 hover:bg-[#18CB96]/5 transition-all group"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold tracking-wider text-[#0097B2]">
                      {prog.group}
                    </span>
                    <h5 className="text-sm font-bold text-[#081C2B] group-hover:text-[#0097B2] transition-colors">
                      {prog.title}
                    </h5>
                    <p className="text-xs text-[#4a5b68] line-clamp-1">{prog.summary}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600 group-hover:bg-[#18CB96]/20 group-hover:text-[#081C2B] transition-colors">
                    Planned
                  </span>
                </a>
              ))}
              {filteredPrograms.length === 0 && <p className="text-xs text-slate-500">No matching recorded courses.</p>}
              {(!q || "live online drone technology internship esp32 kit".includes(q)) && <a href="/programs/drone-technology-internship" onClick={onClose} className="block rounded-xl border border-slate-100 p-3 text-sm font-medium text-[#087957]">Live Drone Technology Internship · 6 weeks · ₹6,999</a>}
            </div>
          </div>

          {/* Lessons Section (if query matches) */}
          {filteredLessons.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#081C2B] mb-3">
                <Layers className="h-4 w-4" />
                <span>Interactive Build Steps</span>
              </div>
              <div className="space-y-2">
                {filteredLessons.map((lesson) => (
                  <a
                    key={lesson.id}
                    href="/#assembly-track"
                    onClick={event => {
                      if (window.location.pathname !== "/") { onClose(); return; }
                      event.preventDefault();
                      onClose();
                      window.dispatchEvent(new CustomEvent('aerocadmy:lesson', { detail: lesson.id }));
                    }}
                    className="block p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex items-center gap-2 text-xs text-[#0097B2] font-semibold">
                      <span>Step {lesson.id + 1}</span>
                      <span>•</span>
                      <span>{lesson.label}</span>
                    </div>
                    <p className="text-sm font-bold text-[#081C2B]">{lesson.title}</p>
                    <p className="text-xs text-[#4a5b68]">{lesson.description}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-[#e3eef0] bg-slate-50 px-6 py-2.5 flex items-center justify-between text-xs text-slate-500">
          <span>Search Aerocadmy curriculum & components</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="rounded bg-white px-1.5 py-0.5 border border-slate-200 font-mono text-[10px]">
              ESC
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
