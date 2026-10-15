import { Navbar } from "@/components/navbar/Navbar";
import { DroneHeroAssembly } from "@/components/hero/DroneHeroAssembly";
import { ComponentExplorer } from "@/components/components-explorer/ComponentExplorer";
import { ProgramsSection } from "@/components/programs/ProgramsSection";
import { DroneTechSpecs } from "@/components/tech-specs/DroneTechSpecs";
import { StudentShowcase } from "@/components/testimonials/StudentShowcase";
import { FAQSection } from "@/components/faq/FAQSection";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfdfd] flex flex-col selection:bg-[#18CB96]/20 selection:text-[#081C2B]">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero with Interactive 3D Scroll Assembly */}
      <DroneHeroAssembly />

      {/* Component & Hardware CAD Explorer */}
      <ComponentExplorer />

      {/* Learning Programs & Curriculum Tracks */}
      <ProgramsSection />

      {/* Aerospace Specifications Comparison Matrix */}
      <DroneTechSpecs />

      {/* Student & Partner Testimonials */}
      <StudentShowcase />

      {/* FAQ Accordion */}
      <FAQSection />

      {/* Production Footer */}
      <Footer />
    </main>
  );
}

