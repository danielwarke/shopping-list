import nextPWA from 'next-pwa'

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  redirects() {
    return [
      {
        source: '/',
        destination: '/shopping-lists',
        permanent: true,
      }
    ]
  },
  output: 'standalone'
});

export default nextConfig;
