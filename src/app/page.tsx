import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { DroneHeroAssembly } from "@/components/hero/DroneHeroAssembly";
import { Footer } from "@/components/footer/Footer";
import { DroneOpportunity } from "@/components/opportunity/DroneOpportunity";
import { CourseCatalogue } from "@/components/programs/CourseCatalogue";
import { CourseFinder } from "@/components/guidance/CourseFinder";
import { CounsellorSection } from "@/components/guidance/CounsellorSection";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfdfd] flex flex-col selection:bg-[#18CB96]/20 selection:text-[#081C2B]">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero with Interactive 3D Scroll Assembly */}
      <DroneHeroAssembly />

      <DroneOpportunity />

      <CourseCatalogue />

      <CourseFinder />

      <CounsellorSection />

      <Footer />
    </main>
  );
}

