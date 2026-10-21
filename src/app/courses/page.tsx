import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CourseCatalogue } from "@/components/programs/CourseCatalogue";

export const metadata: Metadata = { title: "Explore Drone Technology Courses | Aerocadmy", description: "Explore eight planned recorded courses in engineering foundations and industry applications, plus Aerocadmy’s live drone technology internship.", alternates: { canonical: "/courses" } };
export default function CoursesPage({ searchParams }: { searchParams: { path?: string | string[] } }) {
  const initialGroup = searchParams.path === "engineering" ? "Engineering Foundations" : searchParams.path === "applications" ? "Industry Applications" : "All recorded courses";
  return <><Navbar /><main><CourseCatalogue key={initialGroup} headingAs="h1" initialGroup={initialGroup} /></main><Footer /></>;
}
