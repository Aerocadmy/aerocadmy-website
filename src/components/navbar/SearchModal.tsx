"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Search, X } from "lucide-react";
import { recordedCourses } from "@/data/courses";
import { useDialog } from "@/components/ui/useDialog";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const searchableText = (course: (typeof recordedCourses)[number]) =>
  [
    course.title,
    course.group,
    course.summary,
    course.audience,
    course.prerequisites,
    course.outcome,
    course.modules.join(" "),
  ].join(" ").toLowerCase();

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
}) => {
  const [query, setQuery] = useState("");
  const dialogRef = useDialog(isOpen, onClose);

  useEffect(() => {
    if (isOpen) setQuery(initialQuery);
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  const results = terms.length === 0
    ? []
    : recordedCourses.filter(course => {
        const text = searchableText(course);
        return terms.every(term => text.includes(term));
      });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-search-title"
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#081c2b]/60 p-4 pt-16 backdrop-blur-sm sm:p-6 sm:pt-24"
    >
      <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 cursor-default" />

      <section className="relative flex max-h-[min(560px,calc(100svh-96px))] w-full max-w-[840px] flex-col overflow-hidden rounded-2xl border border-[#dce9e4] bg-[#fbfdfd] shadow-[0_24px_70px_rgba(8,28,43,.26)]">
        <header className="flex items-center gap-3 border-b border-[#dce9e4] bg-white px-5 py-3.5 sm:px-7">
          <Search className="h-5 w-5 shrink-0 text-[#087957]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <label id="course-search-title" htmlFor="course-search-input" className="sr-only">Search courses</label>
            <input
              id="course-search-input"
              type="search"
              autoFocus
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search courses by topic, skill or goal"
              aria-label="Search courses by topic, skill or goal"
              className="w-full bg-transparent text-[16px] text-[#081c2b] outline-none placeholder:text-[#8ca1a9]"
            />
          </div>
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="rounded-full p-2 text-[#6f858a] hover:bg-[#edf8f3] hover:text-[#087957]">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <kbd className="hidden rounded-md border border-[#dce9e4] bg-[#f4f8f6] px-2 py-1 text-[10px] font-semibold text-[#60746f] sm:inline-block">ESC</kbd>
          <button type="button" onClick={onClose} aria-label="Close search" className="rounded-full p-2 text-[#60746f] hover:bg-[#edf8f3] hover:text-[#087957]">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          {!normalizedQuery ? (
            <div className="flex min-h-[210px] flex-col items-center justify-center text-center">
              <BookOpen className="mb-4 h-7 w-7 text-[#087957]" aria-hidden="true" />
              <h2 className="text-xl font-semibold tracking-[-.02em] text-[#081c2b]">Find a course</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#60746f]">
                Search by topic, skill or goal. Try one of these:
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["fundamentals", "electronics", "programming", "mapping"].map(term => (
                  <button key={term} type="button" onClick={() => setQuery(term)} className="border border-[#cfe5db] bg-white px-3 py-1.5 text-xs font-medium text-[#087957] transition-colors hover:border-[#087957] hover:bg-[#edf8f3]">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="mb-4 flex items-end justify-between gap-4 border-b border-[#dce9e4] pb-3">
                <div>
                  <p className="text-xs font-semibold text-[#087957]">Course catalogue</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-.02em] text-[#081c2b]">
                    {results.length} {results.length === 1 ? "course" : "courses"} found
                  </h2>
                </div>
                <span className="text-xs text-[#78908b]">Planned catalogue</span>
              </div>
              <div className="space-y-3">
                {results.map(course => (
                  <Link
                    key={course.slug}
                    href={`/courses/${course.slug}`}
                    onClick={onClose}
                    className="group block border border-[#dce9e4] bg-white p-4 transition-[border-color,box-shadow] hover:border-[#8fcdb2] hover:shadow-[0_8px_20px_rgba(8,28,43,.07)] sm:p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#e8f7f0] text-[#087957]">
                        <BookOpen className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="text-[11px] font-semibold text-[#087957]">{course.group}</p>
                          <span className="border border-[#dce9e4] bg-[#f7faf8] px-2 py-1 text-[10px] font-semibold text-[#60746f]">Planned</span>
                        </div>
                        <h3 className="mt-2 text-base font-semibold leading-6 text-[#081c2b] group-hover:text-[#087957]">{course.title}</h3>
                        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[#60746f]">{course.summary}</p>
                      </div>
                      <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#a7bbb4] transition-transform group-hover:translate-x-1 group-hover:text-[#087957]" aria-hidden="true" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-md bg-[#f1f5f3] text-[#78908b]">
                <Search className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold tracking-[-.02em] text-[#081c2b]">No courses found</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#60746f]">
                Try a broader topic such as “drone”, “engineering”, “programming” or “applications”.
              </p>
            </div>
          )}
        </div>

        <footer className="border-t border-[#dce9e4] bg-white px-5 py-3 text-xs text-[#78908b] sm:px-7">
          Search the current Aerocadmy course catalogue
        </footer>
      </section>
    </div>
  );
};
