/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 100],
    remotePatterns: [{ protocol: "https", hostname: "maimkhygtoomqntopxuw.supabase.co", pathname: "/storage/v1/object/public/marketing-public/**" }],
  },
  reactStrictMode: true,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
  // A build must not overwrite the cache used by a running development server.
  distDir: process.env.NODE_ENV === "development" ? (process.env.NEXT_DEV_DIR || ".next-dev") : ".next",
};

export default nextConfig;
