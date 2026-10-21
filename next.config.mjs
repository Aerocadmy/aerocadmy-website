/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A build must not overwrite the cache used by a running development server.
  distDir: process.env.NODE_ENV === "development" ? (process.env.NEXT_DEV_DIR || ".next-dev") : ".next",
};

export default nextConfig;

