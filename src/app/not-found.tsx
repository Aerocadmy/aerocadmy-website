import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

export const metadata: Metadata = { title: "Page not found | Aerocadmy", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fbfdfd]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#087957]">404</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-[#081c2b]">This page could not be found</h1>
        <p className="mt-4 text-[#5d7778]">The link may be out of date. Explore our programs or head back to the homepage.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-[#081c2b] px-6 py-3 text-sm font-bold text-white">Go to homepage</Link>
          <Link href="/courses" className="rounded-full border border-[#dce9e7] px-6 py-3 text-sm font-bold text-[#081c2b]">Explore programs</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
