/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
    ],
  },
  /* Next.js 15+ handles Turbopack automatically via --turbo in the dev command. 
    Removing the 'turbo' key from experimental fixes the build warning.
  */
};

export default nextConfig;
