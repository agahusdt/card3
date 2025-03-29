/**
 * Cloudflare context'i için yardımcı fonksiyonlar
 */

// Global değişken olarak Cloudflare environment'ına erişim (Cloudflare Workers/Pages'te çalışır)
declare global {
  var env: any;
}

/**
 * Cloudflare Environment'ını güvenli bir şekilde elde eder
 */
export async function getCloudflareContext() {
  // Cloudflare Pages ortamında erişilebilen environment değişkenlerini döndür
  return {
    env: {
      // Cloudflare environment değişkenlerine doğru şekilde erişim sağla
      JWT_SECRET: global.env?.JWT_SECRET || process.env.JWT_SECRET || 'default-secret',
      DB: global.env?.DB || null,
      CACHE: global.env?.CACHE || null
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