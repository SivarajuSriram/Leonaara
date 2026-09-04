import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  serverExternalPackages: ['sharp'],
  async redirects() {
    return [{ source: '/', destination: '/en/', permanent: true }];
  },
};

export default nextConfig;
