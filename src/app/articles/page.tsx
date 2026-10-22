import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Drone Technology Articles & Guides | Aerocadmy",
  description:
    "Explore beginner-friendly articles and practical guides about drone components, electronics, flight control and learning drone technology.",
  alternates: { canonical: "/articles" },
};

const articles = [
  {
    href: "/articles/drone-components-for-beginners",
    category: "Drone fundamentals",
    title: "What Are the Main Components of a Drone?",
    description:
      "Understand the frame, motors, propellers, ESCs, flight controller, battery, sensors and radio system in a typical multirotor.",
    readTime: "8 min read",
  },
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-[#fbfdfd]">
      <Navbar />
      <main>
        <header className="border-b border-[#dce9e7] bg-[#eefaf7]">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#087957]">Aerocadmy resources</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-[#081c2b] sm:text-5xl">
              Articles and guides for learning drone technology
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4d6670]">
              Clear explanations of drone systems, electronics, projects and learning pathways for beginners and students.
            </p>
          </div>
        </header>
        <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10 lg:px-12 lg:py-20" aria-labelledby="articles-heading">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087957]">Learn at your pace</p>
              <h2 id="articles-heading" className="mt-3 text-3xl font-bold tracking-[-0.025em] text-[#081c2b]">Latest articles</h2>
            </div>
            <Link href="/courses" className="inline-flex items-center gap-2 font-bold text-[#087957] hover:underline">Explore programs <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className="mt-9 grid gap-6 md:grid-cols-2">
            {articles.map(article => (
              <article key={article.href} className="rounded-2xl border border-[#dce9e7] bg-white p-7 shadow-[0_14px_40px_rgba(8,28,43,.05)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#087957]">{article.category}</p>
                <h3 className="mt-4 text-2xl font-bold leading-tight text-[#081c2b]">{article.title}</h3>
                <p className="mt-4 leading-7 text-[#4d6670]">{article.description}</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-sm text-[#5d7778]"><Clock3 size={15} aria-hidden="true" />{article.readTime}</span>
                  <Link href={article.href} className="inline-flex items-center gap-2 font-bold text-[#087957] hover:underline">Read article <ArrowRight size={16} aria-hidden="true" /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
