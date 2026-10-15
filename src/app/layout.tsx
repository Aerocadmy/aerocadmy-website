import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ASSETS } from '@/lib/assets';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aerocadmy.com"),
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
    images: [
      {
        url: ASSETS.logo,
        width: 800,
        height: 250,
        alt: "Aerocadmy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aerocadmy — Engineered to Inspire",
    description: "Learn drone technology with interactive 3D assembly and hands-on projects.",
  },
  icons: {
    icon: ASSETS.logo,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen bg-[#fbfdfd] text-[#081C2B] antialiased">
        {children}
      </body>
    </html>
  );
}

