// Cloudflare Environment tipleri
interface CloudflareEnvironment {
  // Veritabanı
  DB: D1Database;
  
  // KV Önbellek
  CACHE: KVNamespace;
  
  // Environment değişkenleri
  JWT_SECRET: string;
  NODE_ENV: string;
}

// CloudflareEnv tipini doğrudan tanımla (@opennextjs/cloudflare tarafından kullanılır)
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET?: string;
      NODE_ENV: string;
    }
  }

  interface CloudflareEnv {
    DB: D1Database;
    CACHE: KVNamespace;
    JWT_SECRET: string;
    NODE_ENV: string;
  }
}

interface RequestWithEnv extends Request {
  env: CloudflareEnvironment;
}

// D1 tiplerini tanımla
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec<T = unknown>(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta?: {
    duration: number;
    changes: number;
    last_row_id: number;
    changed_db: boolean;
    size_after: number;
  };
}

interface D1ExecResult {
  count: number;
  duration: number;
}

// KV namespace tiplerini tanımla
interface KVNamespace {
  get(key: string, options?: KVNamespaceGetOptions): Promise<string | null>;
  get(key: string, options: KVNamespaceGetOptions<'text'>): Promise<string | null>;
  get<T>(key: string, options: KVNamespaceGetOptions<'json'>): Promise<T | null>;
  get(key: string, options: KVNamespaceGetOptions<'arrayBuffer'>): Promise<ArrayBuffer | null>;
  get(key: string, options: KVNamespaceGetOptions<'stream'>): Promise<ReadableStream | null>;
  list(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult>;
  put(key: string, value: string | ArrayBuffer | ReadableStream | FormData, options?: KVNamespacePutOptions): Promise<void>;
  delete(key: string): Promise<void>;
}

interface KVNamespaceGetOptions<Type = unknown> {
  type?: Type;
  cacheTtl?: number;
}

interface KVNamespaceListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
}

interface KVNamespaceListResult {
  keys: KVNamespaceKey[];
  list_complete: boolean;
  cursor?: string;
}

interface KVNamespaceKey {
  name: string;
  expiration?: number;
  metadata?: unknown;
}

interface KVNamespacePutOptions {
  expiration?: number;
  expirationTtl?: number;
  metadata?: unknown;
} 