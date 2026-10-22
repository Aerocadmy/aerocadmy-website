import type { Metadata } from "next";

type ShareMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
};

export function pageMetadata({ title, description, path, type = "website" }: ShareMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Aerocadmy",
      type,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Aerocadmy — Engineered to Inspire" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
