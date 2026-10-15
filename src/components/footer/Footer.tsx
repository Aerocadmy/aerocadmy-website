"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2, ShieldCheck, Heart, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#081C2B] text-white pt-20 pb-12 border-t border-[#0b3347]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                AERO<span className="text-[#0097B2]">CAD</span><span className="text-[#18CB96]">MY</span>
              </span>
            </Link>
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Empowering the next generation of aerospace engineers, roboticists, and innovators through hands-on multirotor drone builds, embedded electronics, and autonomous flight.
            </p>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-[#18CB96] font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>Industry-Compliant Aviation Training Standard</span>
              </div>
            </div>
          </div>

          {/* Column 1: Learning Tracks */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0097B2] mb-4">
              Learning Tracks
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <a href="#programs" className="hover:text-[#18CB96] transition-colors">
                  01 / Drone Fundamentals
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#18CB96] transition-colors">
                  02 / Avionics & Assembly
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#18CB96] transition-colors">
                  03 / Autonomous AI & OpenCV
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#18CB96] transition-colors">
                  University Lab Cohorts
                </a>
              </li>
              <li>
                <a href="#assembly-track" className="hover:text-[#18CB96] transition-colors">
                  Interactive 3D Assembly
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Hardware & CAD */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18CB96] mb-4">
              Hardware & CAD
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <a href="#components" className="hover:text-white transition-colors">
                  Brushless DC Motors
                </a>
              </li>
              <li>
                <a href="#components" className="hover:text-white transition-colors">
                  STM32 Flight Controllers
                </a>
              </li>
              <li>
                <a href="#components" className="hover:text-white transition-colors">
                  Graphene LiPo Batteries
                </a>
              </li>
              <li>
                <a href="#components" className="hover:text-white transition-colors">
                  Carbon Fiber Airframes
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-white transition-colors">
                  Aerospace Specs Matrix
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0097B2] mb-4">
              Aero Tech Dispatch
            </h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Get weekly aerospace engineering teardowns, open-source PID tuning tips, and firmware updates.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#18CB96] bg-[#18CB96]/10 p-3 rounded-xl border border-[#18CB96]/20">
                <CheckCircle2 className="h-4 w-4" />
                <span>You’re subscribed to the Aero Dispatch!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    aria-label="Email for newsletter"
                    required
                    placeholder="engineer@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 border border-white/20 focus:border-[#0097B2] focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1.5 top-1.5 rounded-lg bg-[#0097B2] p-1.5 text-white hover:bg-[#007f96] transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">Zero spam. Unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Aerocadmy Inc. Engineered to inspire. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-200 transition-colors">
              Terms of Education
            </a>
            <a href="#safety" className="hover:text-slate-200 transition-colors">
              Aviation Safety Notice
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

