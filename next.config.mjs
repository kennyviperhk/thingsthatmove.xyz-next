/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['blog.thingsthatmove.xyz'],
    unoptimized: true, // This allows local images without optimization
  },
}

export default nextConfig 