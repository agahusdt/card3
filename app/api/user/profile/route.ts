export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { apiResponse } from '@/lib/constants';
import db, { getDB } from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';
import { verifyUserToken } from '@/lib/auth';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';



/**
 * Profil bilgilerini getirme API'si
 */
export async function GET(request: Request) {
  try {
    // Token doğrulama
    const authResult = await verifyUserToken(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Hata durumunda NextResponse döner
    }

    const { userId } = authResult;
    
    // Cloudflare environment
    const { env } = await getCloudflareContext();

    // Kullanıcı bilgilerini getir
    const user = await db.users.findById(env, userId);
    if (!user) {
      return apiResponse.nextResponse.error('User not found', 404);
    }

    // Kullanıcı bilgilerini döndür (hassas bilgileri çıkararak)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return apiResponse.nextResponse.error(`An error occurred: ${error.message || 'Unknown error'}`, 500);
  }
}

/**
 * Profil güncelleme API'si
 */
export async function PUT(request: Request) {
  try {
    // Token doğrulama
    const authResult = await verifyUserToken(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Hata durumunda NextResponse döner
    }

    const { userId } = authResult;
    const body = await request.json();
    const { name } = body;

    // Gelen verinin doğrulanması
    if (!name || name.trim() === '') {
      return apiResponse.nextResponse.error('Name is required', 400);
    }

    // Cloudflare environment
    const { env } = await getCloudflareContext();

    // Kullanıcı varlığını kontrol et
    const existingUser = await db.users.findById(env, userId);
    if (!existingUser) {
      return apiResponse.nextResponse.error('User not found', 404);
    }

    // Doğrudan D1 veritabanı bağlantısı al
    const dbInstance = getDB(env);
    
    // Tip sorunlarını önlemek için any tipine dönüştür
    const usersTable = schema.users as any;
    
    // Kullanıcı güncelleme
    await dbInstance.update(usersTable)
      .set({ 
        name: name,
        updatedAt: new Date()
      })
      .where(eq(usersTable.id, userId));

    // Güncellenmiş kullanıcı bilgilerini getir
    const updatedUser = await db.users.findById(env, userId);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email
      }
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return apiResponse.nextResponse.error(`An error occurred: ${error.message || 'Unknown error'}`, 500);
  }
}