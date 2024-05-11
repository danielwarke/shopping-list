/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects() {
    return [
      {
        source: '/',
        destination: '/shopping-lists',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
