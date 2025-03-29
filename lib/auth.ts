import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';

// JWT Yardımcı Fonksiyonları
export const jwtHelpers = {
  /**
   * JWT Secret anahtarını ve encoded versiyonunu döndürür
   */
  getJwtSecret: async () => {
    // Cloudflare environment'dan JWT_SECRET'ı al
    let secret = '';
    try {
      const { env } = await getCloudflareContext();
      secret = env.JWT_SECRET || 'default-secret';
    } catch (error) {
      // Development ortamında veya context alınamadığında varsayılan değer kullan
      secret = process.env.JWT_SECRET || 'default-secret';
    }
    const secretKey = new TextEncoder().encode(secret);
    return { secret, secretKey };
  },

  /**
   * JWT token oluşturur
   */
  createToken: async (payload: Record<string, any>, expiresIn = '7d') => {
    const { secretKey } = await jwtHelpers.getJwtSecret();
    
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(secretKey);
  },

  /**
   * JWT token doğrular ve payload döndürür
   */
  verifyToken: async (token: string) => {
    const { secretKey } = await jwtHelpers.getJwtSecret();
    
    try {
      const { payload } = await jose.jwtVerify(token, secretKey);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error };
    }
  },

  /**
   * Session oluşturur - Drizzle ORM ile entegre
   */
  createSession: async (userId: string, token: string, expiresAt: Date) => {
    try {
      const { env } = await getCloudflareContext();
      return await db.sessions.create(env, userId, token, expiresAt);
    } catch (error) {
      // Fallback: getCloudflareContext çalışmazsa doğrudan DB'yi kullanmayı dene
      console.error('Create session error:', error);
      throw new Error('Failed to create session');
    }
  }
};

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        apiKey: { label: 'API Key', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.apiKey) {
          throw new Error('API Key is required');
        }

        try {
          const { env } = await getCloudflareContext();
          // Admin arama kodu Drizzle'a taşınmalı
          // Şimdilik boş bir örnek
          return {
            id: 'admin-id',
            name: 'Admin',
            role: 'ADMIN'
          };
        } catch (error) {
          throw new Error('Invalid API Key');
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          role: user.role
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role
        }
      };
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Verify a user token from cookies
 * @returns A NextResponse if authentication fails, null if successful with user data attached
 */
export async function verifyUserToken(request: Request): Promise<{ userId: string; email: string } | NextResponse> {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token || !token.value) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const { valid, payload, error } = await jwtHelpers.verifyToken(token.value);
    
    if (!valid || !payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const decoded = payload as { id: string; email: string };
    
    if (!decoded.id) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    return { userId: decoded.id, email: decoded.email };
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Verify an admin token from cookies
 * @returns A NextResponse if authentication fails, null if successful with admin data attached
 */
export async function verifyAdminToken(request: Request): Promise<{ adminId: string; email: string } | NextResponse> {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');

    if (!token || !token.value) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const { valid, payload, error } = await jwtHelpers.verifyToken(token.value);
    
    if (!valid || !payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin token' },
        { status: 401 }
      );
    }
    
    const decoded = payload as { id: string; email: string; isAdmin: boolean };
    
    if (!decoded.id || !decoded.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin token' },
        { status: 401 }
      );
    }

    // Admin doğrulaması için Drizzle ORM kullanılmalı
    try {
      const { env } = await getCloudflareContext();
      // Admin doğrulama kodu buraya eklenecek
      // Bu örnek için admin tokenini doğrulanmış kabul ediyoruz
    } catch (error) {
      console.error('Admin token verification error:', error);
    }
    
    return { adminId: decoded.id, email: decoded.email };
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Admin authentication failed' },
      { status: 500 }
    );
  }
} 