import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: true,
    serverActions : {
      // allowedForwardedHosts: ["fearful-spirit-gpj64jx94vr39qjq-3000.app.github.dev"],
      allowedOrigins: ["fearful-spirit-gpj64jx94vr39qjq-3000.app.github.dev", "localhost:3000"],
      
    }
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

export default nextConfig;
