// Cloudflare KV için önbellek yardımcı fonksiyonları

/**
 * Önbellekten veri alma veya yoksa sağlanan fonksiyonu çalıştırıp sonucu önbelleğe yazma
 * @param env Cloudflare environment objesi (KV erişimi için)
 * @param key Önbellek anahtarı
 * @param fetchFn Veri yoksa çalıştırılacak fonksiyon
 * @param ttl Önbellek süresi (saniye)
 */
export async function getCachedData<T>(env: any, key: string, fetchFn: () => Promise<T>, ttl = 60) {
  if (!env.CACHE) {
    // KV mevcut değilse direkt fonksiyonu çalıştır
    return await fetchFn();
  }

  // Önbellekten kontrol et
  try {
    const cached = await env.CACHE.get(key, { type: "json" });
    if (cached !== null) {
      return cached as T;
    }
  } catch (error) {
    console.error('Önbellek okuma hatası:', error);
  }

  // Önbellekte yoksa veriyi getir
  const data = await fetchFn();

  // KV'ye yaz 
  try {
    await env.CACHE.put(key, JSON.stringify(data), { expirationTtl: ttl });
  } catch (error) {
    console.error('Önbellek yazma hatası:', error);
  }

  return data;
}

/**
 * Belirtilen önbellek anahtarını temizler
 * @param env Cloudflare environment
 * @param key Temizlenecek önbellek anahtarı
 */
export async function invalidateCache(env: any, key: string) {
  if (!env.CACHE) return;
  
  try {
    await env.CACHE.delete(key);
  } catch (error) {
    console.error('Önbellek temizleme hatası:', error);
  }
}

/**
 * Belirli bir prefikse sahip tüm önbellek anahtarlarını temizler
 * @param env Cloudflare environment
 * @param prefix Anahtar prefiksi
 * @param limit İşlem sayısı limiti
 */
export async function invalidateCacheByPrefix(env: any, prefix: string, limit = 100) {
  if (!env.CACHE) return;
  
  try {
    const keys = await env.CACHE.list({ prefix, limit });
    const promises = keys.keys.map(key => env.CACHE.delete(key.name));
    await Promise.all(promises);
  } catch (error) {
    console.error('Önbellek prefiksi temizleme hatası:', error);
  }
} 