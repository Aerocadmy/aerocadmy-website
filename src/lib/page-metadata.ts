import type { Metadata } from "next";

type ShareMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: { url: string; alt: string };
};

export function pageMetadata({ title, description, path, type = "website", image }: ShareMetadataInput): Metadata {
  const shareImage = image ?? { url: "/opengraph-image", alt: "Aerocadmy — Engineered to Inspire" };
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
      images: [{ url: shareImage.url, width: 1200, height: 630, alt: shareImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage.url],
    },
  };
}
