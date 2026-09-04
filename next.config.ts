import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  serverExternalPackages: ['sharp'],
};

export default nextConfig;
