import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aerocadmy.com"),
  title: "Aerocadmy — Engineered to Inspire | Drone Technology Academy",
  description:
    "Master multirotor drone engineering, avionics, embedded programming, and autonomous flight through hands-on project builds and interactive curriculum.",
  keywords: [
    "drone education",
    "aerospace engineering",
    "quadcopter build",
    "flight controller",
    "Betaflight",
    "brushless motors",
    "autonomous drones",
    "STEM robotics",
    "Aerocadmy",
  ],
  authors: [{ name: "Aerocadmy Team" }],
  openGraph: {
    title: "Aerocadmy — Engineered to Inspire",
    description:
      "Learn drone technology — from components and electronics to programming and real-world applications.",
    type: "website",
    locale: "en_US",
    siteName: "Aerocadmy",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Aerocadmy — Engineered to Inspire" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aerocadmy — Engineered to Inspire",
    description: "Learn drone technology with interactive 3D assembly and hands-on projects.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://www.aerocadmy.com/#organization",
      name: "Aerocadmy",
      url: "https://www.aerocadmy.com/",
      logo: "https://www.aerocadmy.com/component%20images/aerocadmy-logo.webp",
      email: "contact@aerocadmy.com",
      description: "Online drone technology education: live internships and courses covering drone components, electronics, programming and real-world applications.",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.aerocadmy.com/#website",
      url: "https://www.aerocadmy.com/",
      name: "Aerocadmy",
      publisher: { "@id": "https://www.aerocadmy.com/#organization" },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="min-h-screen bg-[#fbfdfd] text-[#081C2B] antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
