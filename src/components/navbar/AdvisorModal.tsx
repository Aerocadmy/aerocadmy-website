"use client";

import React, { useState, useEffect, useId } from "react";
import { useDialog } from '@/components/ui/useDialog';
import { X, CheckCircle2, Send, PhoneCall, Calendar, Sparkles } from "lucide-react";

interface AdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
}

export const AdvisorModal: React.FC<AdvisorModalProps> = ({
  isOpen,
  onClose,
  defaultProgram = "Avionics, Assembly & Embedded Control",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "beginner",
    program: defaultProgram,
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useDialog(isOpen, onClose);
  const formId = useId();
  useEffect(() => {
    if (isOpen) {
      setFormData(previous => ({ ...previous, program: defaultProgram }));
      setSubmitted(false);
      setLoading(false);
      setError("");
    }
    return undefined;
  }, [isOpen, defaultProgram]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't save your request. Please try again.");
      setLoading(false);
      setSubmitted(true);
    } catch (submissionError) {
      setLoading(false);
      setError(submissionError instanceof Error ? submissionError.message : "We couldn't save your request. Please try again.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#081C2B]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg max-h-[calc(100svh-32px)] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-[#e3eef0] transition-all">
        {/* Header Bar */}
        <div className="relative bg-gradient-to-r from-[#081C2B] to-[#0b3347] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18CB96]/20 border border-[#18CB96]/40 text-[#18CB96]">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <h3 id={`${formId}-title`} className="text-lg sm:text-xl font-bold tracking-tight">Talk to an Aerocadmy Advisor</h3>
                <p className="text-xs text-slate-300">Get personalized guidance for your drone engineering journey</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#18CB96]/15 text-[#18CB96]">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="text-2xl font-bold text-[#081C2B]">Session Request Received!</h4>
              <p className="text-sm text-[#4a5b68] max-w-sm mx-auto">
                Thank you, <span className="font-semibold text-[#081C2B]">{formData.name}</span>. An aerospace engineering advisor will contact you within 24 hours at <span className="font-semibold text-[#081C2B]">{formData.email}</span>.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="dark-action inline-flex items-center gap-2 rounded-xl bg-[#081C2B] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#0b3347] transition-all"
                >
                  Back to Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${formId}-name`} className="block text-xs font-semibold uppercase tracking-wider text-[#4a5b68] mb-1">
                    Your Name *
                  </label>
                  <input
                    id={`${formId}-name`}
                    type="text"
                    required
                    placeholder="e.g. Alex Walker"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-[#e3eef0] bg-[#fbfdfd] px-3.5 py-2.5 text-sm text-[#081C2B] placeholder-slate-400 focus:border-[#0097B2] focus:outline-none focus:ring-2 focus:ring-[#0097B2]/20"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-email`} className="block text-xs font-semibold uppercase tracking-wider text-[#4a5b68] mb-1">
                    Email Address *
                  </label>
                  <input
                    id={`${formId}-email`}
                    type="email"
                    required
                    placeholder="alex@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-[#e3eef0] bg-[#fbfdfd] px-3.5 py-2.5 text-sm text-[#081C2B] placeholder-slate-400 focus:border-[#0097B2] focus:outline-none focus:ring-2 focus:ring-[#0097B2]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${formId}-phone`} className="block text-xs font-semibold uppercase tracking-wider text-[#4a5b68] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id={`${formId}-phone`}
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#e3eef0] bg-[#fbfdfd] px-3.5 py-2.5 text-sm text-[#081C2B] placeholder-slate-400 focus:border-[#0097B2] focus:outline-none focus:ring-2 focus:ring-[#0097B2]/20"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-experience`} className="block text-xs font-semibold uppercase tracking-wider text-[#4a5b68] mb-1">
                    Experience Level
                  </label>
                  <select
                    id={`${formId}-experience`}
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full rounded-xl border border-[#e3eef0] bg-[#fbfdfd] px-3.5 py-2.5 text-sm text-[#081C2B] focus:border-[#0097B2] focus:outline-none focus:ring-2 focus:ring-[#0097B2]/20"
                  >
                    <option value="beginner">Complete Beginner / High School</option>
                    <option value="undergrad">Engineering Student</option>
                    <option value="hobbyist">FPV Hobbyist / Builder</option>
                    <option value="educator">Educator / University Faculty</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor={`${formId}-program`} className="block text-xs font-semibold uppercase tracking-wider text-[#4a5b68] mb-1">
                  Program of Interest
                </label>
                <select
                    id={`${formId}-program`}
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full rounded-xl border border-[#e3eef0] bg-[#fbfdfd] px-3.5 py-2.5 text-sm text-[#081C2B] focus:border-[#0097B2] focus:outline-none focus:ring-2 focus:ring-[#0097B2]/20"
                >
                  <option value="Drone Fundamentals & Aero-Physics">01 / Understand — Drone Fundamentals & Aero-Physics</option>
                  <option value="Avionics, Assembly & Embedded Control">02 / Build & Program — Avionics, Assembly & Embedded Control</option>
                  <option value="Autonomous Flight, AI & Real-World Tech">03 / Apply — Autonomous Flight, AI & Computer Vision</option>
                  <option value="Custom Hardware Kit / Academic Cohort">Institutional / University Cohort Lab Setup</option>
                </select>
              </div>

              <div>
                <label htmlFor={`${formId}-notes`} className="block text-xs font-semibold uppercase tracking-wider text-[#4a5b68] mb-1">
                  Specific Questions or Project Goals (Optional)
                </label>
                <textarea
                    id={`${formId}-notes`}
                  rows={2}
                  placeholder="Tell us what you hope to build or learn..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-[#e3eef0] bg-[#fbfdfd] px-3.5 py-2 text-sm text-[#081C2B] placeholder-slate-400 focus:border-[#0097B2] focus:outline-none focus:ring-2 focus:ring-[#0097B2]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#e3eef0] px-4 py-2.5 text-sm font-semibold text-[#4a5b68] hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0097B2] px-6 py-2.5 text-sm font-semibold text-white shadow-cta hover:bg-[#007f96] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Book Free 1-on-1 Call</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
