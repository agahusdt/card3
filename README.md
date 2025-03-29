# Grok Web App

Next.js tabanlı ve Cloudflare Pages ile çalışan token satış platformu.

## Özellikler

- Cloudflare Pages üzerinde çalışır
- Cloudflare D1 veritabanı kullanır
- Cloudflare KV önbellek kullanır
- Edge Runtime uyumludur

## Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Cloudflare Pages Dağıtımı

### Ön Hazırlık

1. Cloudflare D1 veritabanı oluşturun:
```bash
npx wrangler d1 create grok_db
```

2. Cloudflare KV Namespace oluşturun:
```bash
npx wrangler kv:namespace create CACHE
```

3. Veritabanı şeması oluşturun:
```bash
npx drizzle-kit generate
```

4. Şemayı veritabanına uygulayın:
```bash
npx wrangler d1 execute grok_db --file=./drizzle/0000_schema.sql
```

5. JWT Secret ekleyin:
```bash
npx wrangler secret put JWT_SECRET
```

### Dağıtım

```bash
# Cloudflare Pages için derleme yapın
npm run pages:build

# Cloudflare Pages'e dağıtın
npm run pages:deploy
```

### Yerel Test

```bash
# Cloudflare Pages yapısını yerel olarak test edin
npm run pages:dev
```

## Yapılandırma

`wrangler.toml` dosyasında Cloudflare ID'lerini güncelleyin:

```toml
[[d1_databases]]
binding = "DB"
database_name = "grok_db"
database_id = "YOUR_D1_DATABASE_ID" # Bu ID'yi değiştirin

[[kv_namespaces]]
binding = "CACHE"
id = "YOUR_KV_NAMESPACE_ID" # Bu ID'yi değiştirin
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
