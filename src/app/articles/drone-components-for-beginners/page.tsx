import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "What Are the Main Components of a Drone? | Aerocadmy",
    description: "A beginner-friendly guide to the hardware and systems that help a drone fly, stay stable and respond to the pilot.",
    path: "/articles/drone-components-for-beginners",
    type: "article",
  }),
  keywords: [
    "drone components",
    "parts of a drone",
    "drone components for beginners",
    "quadcopter parts",
    "drone flight controller",
  ],
  openGraph: {
    type: "article",
    title: "What Are the Main Components of a Drone? | Aerocadmy",
    description: "A beginner-friendly guide to the hardware and systems that help a drone fly, stay stable and respond to the pilot.",
    url: "/articles/drone-components-for-beginners",
    siteName: "Aerocadmy",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Aerocadmy — Engineered to Inspire" }],
    publishedTime: "2026-10-21T00:00:00.000Z",
    authors: ["Aerocadmy Team"],
  },
};

const components = [
  ["Frame", "The structure that holds the motors, battery, flight controller and other parts in position."],
  ["Motors", "The power source for the propellers. Most multirotors use efficient brushless motors."],
  ["Propellers", "The rotating blades that convert motor power into thrust and movement."],
  ["Electronic Speed Controllers", "The ESCs regulate the electrical power delivered to each motor."],
  ["Flight controller", "The onboard computer that combines pilot commands with sensor data and adjusts motor speeds."],
  ["Battery", "Usually a lithium-polymer battery that supplies power to the propulsion and electronics systems."],
  ["Sensors", "Devices such as gyroscopes, accelerometers and barometers that help the drone understand its movement."],
  ["Radio system", "The transmitter and receiver that carry commands between the pilot and the drone."],
];

const faqs = [
  {
    question: "What are the most important components of a drone?",
    answer:
      "The frame, motors, propellers, ESCs, flight controller and battery are the core components of a typical multirotor drone. Sensors and a radio system help it remain stable and respond to the pilot.",
  },
  {
    question: "Can a beginner build a drone?",
    answer:
      "Yes. A beginner can start by identifying the parts, understanding their connections and following a guided assembly or simulation project. Safe battery handling and propeller awareness are essential.",
  },
  {
    question: "What does a drone flight controller do?",
    answer:
      "The flight controller processes pilot commands and sensor readings, then tells the ESCs how to change individual motor speeds so the drone can balance and move.",
  },
];

export default function DroneComponentsArticle() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What Are the Main Components of a Drone? A Beginner's Guide",
    description: metadata.description,
    author: { "@type": "Organization", name: "Aerocadmy" },
    publisher: { "@id": "https://www.aerocadmy.com/#organization" },
    datePublished: "2026-10-21",
    dateModified: "2026-10-21",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.aerocadmy.com/articles/drone-components-for-beginners" },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.aerocadmy.com/" },
      { "@type": "ListItem", position: 2, name: "Articles", item: "https://www.aerocadmy.com/articles" },
      { "@type": "ListItem", position: 3, name: "Drone components" },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <div className="min-h-screen bg-[#fbfdfd]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />
      <main>
        <header className="relative overflow-hidden border-b border-[#dce9e7] bg-[#eefaf7]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(8,121,87,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(8,121,87,.06)_1px,transparent_1px)] bg-[size:32px_32px]" aria-hidden="true" />
          <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-14 sm:px-10 lg:px-12 lg:pb-20 lg:pt-20">
            <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-1 text-sm text-[#477168]">
              <Link href="/" className="hover:text-[#087957]">Home</Link>
              <ChevronRight size={15} aria-hidden="true" />
              <Link href="/articles" className="hover:text-[#087957]">Articles</Link>
              <ChevronRight size={15} aria-hidden="true" />
              <span aria-current="page">Drone components</span>
            </nav>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#087957]">Drone technology fundamentals · 3 min read</p>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#081c2b] sm:text-5xl lg:text-6xl">
              What Are the Main Components of a Drone?
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4d6670] sm:text-xl">
              A beginner-friendly guide to the parts that help a drone fly, stay stable and respond to the pilot.
            </p>
            <p className="mt-8 text-sm text-[#5d7778]">By Aerocadmy Team · 21 October 2026</p>
          </div>
        </header>

        <article className="mx-auto grid max-w-6xl gap-12 px-6 py-14 sm:px-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-12 lg:py-20">
          <div className="max-w-3xl text-[17px] leading-8 text-[#415b63]">
            <p className="text-xl leading-9 text-[#203d47]">
              Drones may look simple from the outside, but several mechanical and electronic components work together to help them fly. Understanding these parts is a useful first step for students, hobbyists and anyone planning to learn drone technology.
            </p>
            <p className="mt-6">
              In this guide, we explain the main components of a typical multirotor drone in simple terms. You will also see how these parts work together and what to consider when choosing a beginner learning setup.
            </p>

            <section className="mt-12" aria-labelledby="overview">
              <h2 id="overview" className="text-3xl font-bold tracking-[-0.025em] text-[#081c2b]">Quick overview of drone components</h2>
              <p className="mt-4">A typical quadcopter may include:</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {components.map(([name]) => <li key={name} className="flex items-center gap-3 rounded-xl border border-[#dce9e7] bg-white px-4 py-3 text-base font-semibold text-[#203d47]"><Check size={17} className="shrink-0 text-[#087957]" aria-hidden="true" />{name}</li>)}
              </ul>
            </section>

            <section className="mt-14" aria-labelledby="parts">
              <h2 id="parts" className="text-3xl font-bold tracking-[-0.025em] text-[#081c2b]">The main parts of a drone</h2>
              <div className="mt-8 space-y-9">
                {components.map(([name, description], index) => (
                  <div key={name} className="border-b border-[#e3ecea] pb-8">
                    <h3 className="text-xl font-bold text-[#081c2b]">{index + 1}. {name}</h3>
                    <p className="mt-3">{description}</p>
                    {name === "Motors" && <p className="mt-3">Motor size, KV rating, voltage and propeller choice must be matched. An unsuitable combination can reduce flight time or damage the electronics.</p>}
                    {name === "Propellers" && <p className="mt-3">Multirotors normally use both clockwise and counter-clockwise propellers. A bent or damaged propeller can create vibration and unstable flight.</p>}
                    {name === "Battery" && <p className="mt-3">Capacity, voltage, discharge rating and weight all matter. LiPo batteries should be charged, stored and handled with an appropriate charger and safe procedure.</p>}
                    {name === "Sensors" && <p className="mt-3">A gyroscope measures rotation, an accelerometer measures movement, and a barometer can help estimate altitude. The flight controller combines these readings.</p>}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-14" aria-labelledby="together">
              <h2 id="together" className="text-3xl font-bold tracking-[-0.025em] text-[#081c2b]">How do these components work together?</h2>
              <p className="mt-5">
                When the pilot moves a control stick, the transmitter sends a signal to the receiver. The receiver passes the command to the flight controller, which compares it with information from the sensors.
              </p>
              <p className="mt-5">
                The flight controller then calculates how much each motor should speed up or slow down. The ESCs apply the required electrical power, the motors turn the propellers, and the resulting thrust changes the drone’s position. This happens continuously while the drone is flying.
              </p>
            </section>

            <section className="mt-14" aria-labelledby="kit">
              <h2 id="kit" className="text-3xl font-bold tracking-[-0.025em] text-[#081c2b]">What should beginners look for in a drone learning kit?</h2>
              <p className="mt-5">A useful beginner setup should make the relationships between the parts clear. Check whether it includes:</p>
              <ul className="mt-5 space-y-3">
                {["A durable frame with replaceable parts", "Matched motors, propellers, ESCs and battery", "A programmable or well-documented flight controller", "Assembly guidance and safety information", "Technical support or practical learning activities"].map(item => <li key={item} className="flex gap-3"><Check size={20} className="mt-1 shrink-0 text-[#087957]" aria-hidden="true" /><span>{item}</span></li>)}
              </ul>
              <p className="mt-5">
                A kit is most valuable when it helps you understand how the system works, not just when it provides a box of parts.
              </p>
            </section>

            <section className="mt-14" aria-labelledby="faq">
              <h2 id="faq" className="text-3xl font-bold tracking-[-0.025em] text-[#081c2b]">Frequently asked questions</h2>
              <div className="mt-6 space-y-4">
                {faqs.map(({ question, answer }) => <details key={question} className="rounded-xl border border-[#dce9e7] bg-white px-5 py-4"><summary className="cursor-pointer font-bold text-[#203d47]">{question}</summary><p className="mt-3 text-base">{answer}</p></details>)}
              </div>
            </section>

            <section className="mt-14 rounded-2xl bg-[#e8f8f3] p-7 sm:p-9" aria-labelledby="next-step">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087957]">Your next step</p>
              <h2 id="next-step" className="mt-3 text-2xl font-bold text-[#081c2b]">Move from identifying parts to understanding the system.</h2>
              <p className="mt-4">Aerocadmy’s Drone Technology Fundamentals course introduces components, flight principles and the connections between hardware, software and control.</p>
              <Link href="/courses/drone-technology-fundamentals" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#087957] px-5 py-3 font-bold text-white transition hover:bg-[#066b4d]">Explore the fundamentals course <ArrowRight size={17} aria-hidden="true" /></Link>
            </section>
          </div>

          <aside className="lg:pt-2">
            <div className="sticky top-32 rounded-2xl border border-[#dce9e7] bg-white p-6 shadow-[0_14px_40px_rgba(8,28,43,.06)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#087957]">Continue learning</p>
              <h2 className="mt-3 text-xl font-bold text-[#081c2b]">Build your drone knowledge step by step.</h2>
              <div className="mt-6 space-y-4 text-sm leading-6">
                <Link href="/courses/drone-technology-fundamentals" className="block font-semibold text-[#087957] hover:underline">Drone Technology Fundamentals <ArrowRight size={14} className="ml-1 inline" aria-hidden="true" /></Link>
                <Link href="/programs/drone-technology-internship" className="block font-semibold text-[#087957] hover:underline">Live internship with ESP32 kit <ArrowRight size={14} className="ml-1 inline" aria-hidden="true" /></Link>
                <Link href="/#counselling" className="block font-semibold text-[#087957] hover:underline">Talk to a counsellor <ArrowRight size={14} className="ml-1 inline" aria-hidden="true" /></Link>
              </div>
            </div>
          </aside>
        </article>
      </main>
      <Footer />
    </div>
  );
}
