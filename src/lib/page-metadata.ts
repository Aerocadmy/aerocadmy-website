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
  // Vercel preview deployments must fetch their share image from that deployment.
  // metadataBase remains the production domain for canonical URLs and page links.
  const deploymentBase = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const shareImageUrl = deploymentBase && shareImage.url.startsWith("/")
    ? new URL(shareImage.url, deploymentBase).toString()
    : shareImage.url;
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
      images: [{ url: shareImageUrl, width: 1200, height: 630, alt: shareImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImageUrl],
    },
  };
}
