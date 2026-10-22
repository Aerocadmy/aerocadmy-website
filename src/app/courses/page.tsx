import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CourseCatalogue } from "@/components/programs/CourseCatalogue";
import { StudentShowcase } from "@/components/testimonials/StudentShowcase";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({ title: "Explore Drone Technology Courses | Aerocadmy", description: "Explore eight planned recorded courses in engineering foundations and industry applications, plus Aerocadmy’s live drone technology internship.", path: "/courses" });
export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ path?: string | string[] }> }) {
  const { path } = await searchParams;
  const initialGroup = path === "engineering" ? "Engineering Foundations" : path === "applications" ? "Industry Applications" : "All recorded courses";
  return <><Navbar /><main><CourseCatalogue key={initialGroup} headingAs="h1" initialGroup={initialGroup} /><div className="mx-auto max-w-[1280px] px-5 sm:px-8"><StudentShowcase /></div></main><Footer /></>;
}
