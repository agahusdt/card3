import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// User tablosu
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  role: text('role').notNull().default('USER'), // USER veya ADMIN rolü
  balance: real('balance').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  verificationExpiry: integer('verification_expiry', { mode: 'timestamp' }),
  verificationToken: text('verification_token'),
  domain: text('domain').default('grokcoinsale.com'),
  apiKey: text('api_key').unique(), // Admin kullanıcıları için
});

// Admins tablosu - Veritabanında var olan tablo
export const admins = sqliteTable('admins', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  apiKey: text('api_key').notNull().unique(),
  role: text('role').notNull().default('ADMIN'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
});

// Transaction tablosu
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  amount: real('amount').notNull(),
  tokenAmount: real('token_amount'),
  type: text('type').default('DEPOSIT'),
  status: text('status'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// Session tablosu
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// TokenPurchase tablosu
export const tokenPurchases = sqliteTable('token_purchases', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  cryptoAmount: real('crypto_amount').notNull(),
  tokenAmount: real('token_amount').notNull(),
  bonusAmount: real('bonus_amount').notNull(),
  usdAmount: real('usd_amount').notNull(),
  tokenPrice: real('token_price').notNull(),
  cryptoSymbol: text('crypto_symbol').notNull().default('SOL'),
  status: text('status').notNull().default('PENDING'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
  orderId: text('order_id').unique(),
  message: text('message'),
  type: text('type').default('DEPOSIT'),
  walletAddress: text('wallet_address'),
}); 