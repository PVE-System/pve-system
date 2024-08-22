/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rw5mestuqvroandp.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

/** Versao que esta funcionando, mas gerando um alerta: The "images.domains" configuration is deprecated. Please use "images.remotePatterns" configuration instead. */
/* const nextConfig = {
  images: {
    domains: ['rw5mestuqvroandp.public.blob.vercel-storage.com'],
  },
};

export default nextConfig;
 */
