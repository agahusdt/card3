import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { eq, desc, and } from 'drizzle-orm';

// Cloudflare D1 veritabanı bağlantısı
export function getDB(env: any) {
  if (!env.DB) {
    throw new Error('D1 database binding not found. Check your wrangler.toml file.');
  }
  
  return drizzle(env.DB, { schema });
}

// Temel CRUD işlemleri için yardımcı fonksiyonlar
export const db = {
  // Kullanıcılar
  users: {
    findByEmail: async (env: any, email: string) => {
      const db = getDB(env);
      return db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email)
      });
    },
    findById: async (env: any, id: string) => {
      const db = getDB(env);
      return db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id)
      });
    },
    create: async (env: any, data: any) => {
      const db = getDB(env);
      // SQLite-compatible UUID generation
      const id = crypto.randomUUID();
      await db.insert(schema.users).values({
        id,
        ...data,
      });
      return db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id)
      });
    },
    update: async (env: any, id: string, data: any) => {
      const db = getDB(env);
      // Güncellenme zamanını otomatik ayarla
      const updatedData = {
        ...data,
        updatedAt: new Date()
      };
      
      await db.update(schema.users)
        .set(updatedData)
        .where(eq(schema.users.id, id));
        
      return db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id)
      });
    }
  },
  
  // Oturumlar
  sessions: {
    create: async (env: any, userId: string, token: string, expiresAt: Date) => {
      const db = getDB(env);
      const id = crypto.randomUUID();
      await db.insert(schema.sessions).values({
        id,
        userId,
        token,
        expiresAt
      });
      return { id, userId, token, expiresAt };
    },
    findByToken: async (env: any, token: string) => {
      const db = getDB(env);
      return db.query.sessions.findFirst({
        where: (sessions, { eq }) => eq(sessions.token, token)
      });
    },
    deleteByToken: async (env: any, token: string) => {
      const db = getDB(env);
      return db.delete(schema.sessions)
        .where(eq(schema.sessions.token, token));
    }
  },
  
  // İşlemler
  transactions: {
    findByUserId: async (env: any, userId: string) => {
      const db = getDB(env);
      return db.query.transactions.findMany({
        where: (transactions, { eq }) => eq(transactions.userId, userId),
        orderBy: (transactions, { desc }) => [desc(transactions.createdAt)]
      });
    },
    create: async (env: any, data: any) => {
      const db = getDB(env);
      const id = crypto.randomUUID();
      await db.insert(schema.transactions).values({
        id,
        ...data,
        createdAt: new Date()
      });
      return { id, ...data };
    }
  },
  
  // Token Satın Alma İşlemleri
  tokenPurchases: {
    findAllPending: async (env: any) => {
      const db = getDB(env);
      const purchases = await db.query.tokenPurchases.findMany({
        where: (tokenPurchases, { eq }) => eq(tokenPurchases.status, 'PENDING'),
        orderBy: (tokenPurchases, { desc }) => [desc(tokenPurchases.createdAt)]
      });
      
      return purchases.map(purchase => ({
        id: purchase.id,
        userId: purchase.userId,
        // user alanı olmadan doğrudan bilgileri dönüyoruz
        userName: 'Unknown',
        userEmail: 'unknown@example.com',
        amount: purchase.tokenAmount,
        cryptoAmount: purchase.cryptoAmount,
        status: purchase.status,
        cryptoSymbol: purchase.cryptoSymbol,
        bonusAmount: purchase.bonusAmount,
        createdAt: purchase.createdAt.toISOString(),
        updatedAt: purchase.updatedAt.toISOString()
      }));
    },
    findById: async (env: any, id: string) => {
      const db = getDB(env);
      return db.query.tokenPurchases.findFirst({
        where: (tokenPurchases, { eq }) => eq(tokenPurchases.id, id)
      });
    },
    updateStatus: async (env: any, id: string, newStatus: string) => {
      // Raw SQL aracılığıyla güncelleme
      const db = getDB(env);
      
      // Doğrudan env.DB (Cloudflare D1 connection) kullanarak
      await env.DB.prepare(`UPDATE token_purchases SET status = ?, updated_at = ? WHERE id = ?`)
        .bind(newStatus, new Date().getTime(), id)
        .run();
      
      return db.query.tokenPurchases.findFirst({
        where: (tokenPurchases, { eq }) => eq(tokenPurchases.id, id)
      });
    }
  }
};

export default db; 