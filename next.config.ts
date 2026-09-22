import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // cho phép mọi hostname
      },
      {
        protocol: 'http',
        hostname: '**', // nếu muốn hỗ trợ cả http
      },
    ],
  },
};

export default nextConfig;
