export const runtime = 'edge';

import { NextResponse } from 'next/server';
import * as jose from 'jose';
import db, { getDB } from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API anahtarı gereklidir' },
        { status: 400 }
      );
    }

    // Cloudflare environment
    const { env } = await getCloudflareContext();
    
    // D1 veritabanı bağlantısını al
    const dbInstance = getDB(env);
    
    // Tip sorunlarını önlemek için any kullan
    const adminsTable = schema.admins as any;
    
    // Find admin by API key
    const admin = await dbInstance.query.admins.findFirst({
      where: (admins, { eq }) => eq(admins.apiKey, apiKey)
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz API anahtarı' },
        { status: 401 }
      );
    }

    // JWT için secret key oluştur
    // JWT_SECRET tipini bir şekilde çıkarmaya çalış (any kullanarak)
    const env_any = env as any;
    const secret = env_any.JWT_SECRET || process.env.JWT_SECRET || 'default-secret';
    
    // jose ile token oluşturma
    const secretKey = new TextEncoder().encode(secret);
    const token = await new jose.SignJWT({ 
      id: admin.id, 
      name: admin.name,
      role: 'ADMIN',
      isAdmin: true
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d') // 30 gün süreli token
      .sign(secretKey);

    // Set cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name
      },
      redirectUrl: '/admin/dashboard'
    });

    // Set cookie in response - kalıcı olarak ayarlanıyor
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 gün (saniyelik)
    });

    return response;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: `Giriş sırasında bir hata oluştu: ${error.message || 'Bilinmeyen hata'}` },
      { status: 500 }
    );
  }
}