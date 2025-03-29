/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! Uyarı: TypeScript tip kontrolünü atlar
    // Daha az güvenilebilir bir derleme, ancak Cloudflare için hızlı
    ignoreBuildErrors: true,
  },
  // Cloudflare uyumluluğu için
  images: {
    unoptimized: true, // Cloudflare Pages ile uyumlu olması için
    domains: ['example.com'], // İhtiyaç duyulan domain isimleri
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Edge Runtime için WebCrypto API polyfill'leri sağla
  webpack: (config, { isServer, nextRuntime }) => {
    // Edge Runtime'da polyfill'leri yükle
    if (isServer && nextRuntime === 'edge') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false, // WebCrypto API kullanılır
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
