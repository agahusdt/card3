/**
 * Cloudflare context'i için yardımcı fonksiyonlar
 */

/**
 * Cloudflare Environment'ını güvenli bir şekilde elde eder
 */
export async function getCloudflareContext() {
  // Cloudflare Pages/Workers ortamında çalışırken doğru env erişimi
  if (typeof globalThis.process === 'undefined') {
    // Cloudflare Pages/Workers ortamındayız
    return {
      env: {
        // Bu, Cloudflare Pages/Workers ortamında env değişkenlerine erişir
        JWT_SECRET: globalThis.JWT_SECRET || 'default-secret',
        DB: globalThis.DB || null,
        CACHE: globalThis.CACHE || null
      }
    };
  }
  
  // Node.js ortamında çalışırken (development)
  return {
    env: {
      JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
      // Diğer çevresel değişkenler
      DB: null,
      CACHE: null
    }
  };
}

/**
 * Cloudflare request context'inden çevresel değişkenleri çıkarır
 */
export function getEnvFromRequest(request: Request) {
  // @ts-ignore - Cloudflare spesifik özellik
  const cf = request.cf || {};
  
  return {
    // Cloudflare-spesifik değerleri döndür
    ...cf,
    // Ek olarak gerekli değerleri buraya ekleyin
  };
} 