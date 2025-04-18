/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['blog.thingsthatmove.xyz'],
    unoptimized: true, // This allows local images without optimization
  },
}

export default nextConfig 