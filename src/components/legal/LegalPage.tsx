import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <main className="min-h-screen bg-[#fbfdfd] text-[#081C2B]">
    <header className="border-b border-[#d9e9e5] bg-[#0d2632] text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-6">
        <Link href="/" className="font-semibold tracking-tight">Aerocadmy</Link>
        <Link href="/" className="text-sm text-[#a4e7c9] hover:text-white">Back to website</Link>
      </div>
    </header>
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="mb-4 text-sm font-semibold text-[#087957]">Aerocadmy Education</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4a5b68]">{intro}</p>
      <div className="mt-12 space-y-8 text-[15px] leading-8 text-[#334b57] [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-7 [&_h2]:text-[#081C2B] [&_a]:font-medium [&_a]:text-[#087957] [&_a]:underline [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </article>
  </main>;
}
