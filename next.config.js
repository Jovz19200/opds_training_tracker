/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed the experimental turbo configuration
  images: {
    domains: ['res.cloudinary.com'],
  }
}

module.exports = nextConfig 
