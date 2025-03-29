/**
 * Cloudflare context'i için yardımcı fonksiyonlar
 */

/**
 * Cloudflare Environment'ını güvenli bir şekilde elde eder
 */
export async function getCloudflareContext() {
  // Cloudflare Pages ortamında erişilebilen environment değişkenlerini döndür
  return {
    env: {
      // Burada process.env'den veya diğer kaynaklardan ortam değişkenlerini ekleyin
      JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
      // Diğer Cloudflare environment değişkenleri buraya eklenebilir
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