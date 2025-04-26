/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.css': ['@tailwindcss/postcss'],
      },
    },
  },
}

module.exports = nextConfig 