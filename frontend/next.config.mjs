/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 90, 95],
  },
  experimental: {
    /** Default ~10 MiB can truncate/limit proxied API bodies; keep high if you add Next proxies. */
    proxyClientMaxBodySize: '100mb',
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;
