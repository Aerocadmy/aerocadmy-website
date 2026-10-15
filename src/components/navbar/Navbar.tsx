"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, ArrowRight, Menu, X, Sparkles, BookOpen, Cpu, Wrench, ShieldCheck } from "lucide-react";
import { SearchModal } from "./SearchModal";
import { AdvisorModal } from "./AdvisorModal";
import { ComponentImage } from "@/components/ui/ComponentImage";
import { ASSETS } from "@/lib/assets";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#e3eef0]"
            : "bg-white/90 backdrop-blur-sm border-b border-[#e3eef0]/80"
        }`}
        style={{ height: "var(--nav-h)" }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" aria-label="Aerocadmy home" className="flex shrink-0 items-center group">
            <div className="relative flex items-center">
              <ComponentImage
                src={ASSETS.logo}
                alt="Aerocadmy Logo"
                className="h-10 sm:h-12 w-[180px] sm:w-[210px] transition-transform group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 whitespace-nowrap">
            <a
              href="#programs"
              className="flex items-center gap-1.5 text-[15px] font-medium text-[#4a5b68] hover:text-[#0097B2] transition-colors"
            >
              <span>Programs</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </a>

            <a
              href="#assembly-track"
              className="flex items-center gap-1.5 text-[15px] font-medium text-[#4a5b68] hover:text-[#0097B2] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#18CB96]" />
              <span>Interactive Build</span>
            </a>

            <a
              href="#components"
              className="flex items-center gap-1.5 text-[15px] font-medium text-[#4a5b68] hover:text-[#0097B2] transition-colors"
            >
              <span>Component Explorer</span>
            </a>

            <a
              href="#specs"
              className="text-[15px] font-medium text-[#4a5b68] hover:text-[#0097B2] transition-colors"
            >
              Hardware Specs
            </a>

            <a
              href="#faqs"
              className="text-[15px] font-medium text-[#4a5b68] hover:text-[#0097B2] transition-colors"
            >
              FAQs
            </a>
          </nav>

          {/* Nav Right CTAs */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search curriculum and components"
              className="flex items-center gap-2 rounded-xl border border-[#e3eef0] bg-[#fbfdfd] px-3 py-2 text-xs font-semibold text-[#4a5b68] hover:border-[#0097B2] hover:text-[#0097B2] transition-all"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 font-mono border border-slate-200">
                ⌘K
              </kbd>
            </button>

            {/* Talk to an Advisor CTA */}
            <button
              onClick={() => setIsAdvisorOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#0097B2] px-5 py-2.5 text-sm font-semibold text-white shadow-cta hover:bg-[#007f96] hover:-translate-y-0.5 hover:shadow-cta-hover transition-all group"
            >
              <span>Talk to an Advisor</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#081C2B] hover:text-[#0097B2] rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-navigation" className="xl:hidden border-b border-[#e3eef0] bg-white px-4 pt-3 pb-6 shadow-xl max-h-[calc(100svh-var(--nav-h))] overflow-y-auto">
            <div className="flex flex-col space-y-3">
              <a
                href="#programs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-[#081C2B] hover:bg-slate-50"
              >
                <BookOpen className="h-4 w-4 text-[#0097B2]" />
                <span>Explore Programs</span>
              </a>

              <a
                href="#assembly-track"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-[#081C2B] hover:bg-slate-50"
              >
                <Sparkles className="h-4 w-4 text-[#18CB96]" />
                <span>Interactive Build Journey</span>
              </a>

              <a
                href="#components"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-[#081C2B] hover:bg-slate-50"
              >
                <Cpu className="h-4 w-4 text-[#0097B2]" />
                <span>Component Explorer</span>
              </a>

              <a
                href="#specs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-[#081C2B] hover:bg-slate-50"
              >
                <Wrench className="h-4 w-4 text-[#4a5b68]" />
                <span>Engineering Specs</span>
              </a>

              <a
                href="#faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-[#081C2B] hover:bg-slate-50"
              >
                <ShieldCheck className="h-4 w-4 text-[#18CB96]" />
                <span>FAQs & Certification</span>
              </a>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAdvisorOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0097B2] py-3 text-sm font-semibold text-white shadow-cta hover:bg-[#007f96]"
                >
                  <span>Talk to an Advisor</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AdvisorModal isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
    </>
  );
};

