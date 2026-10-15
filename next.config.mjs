/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A build must not overwrite the cache used by a running development server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    unoptimized: true, // Allows all local component images and custom paths to render smoothly with zero layout delays
  },
};

export default nextConfig;

