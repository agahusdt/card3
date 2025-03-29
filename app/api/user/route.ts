export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { verifyUserToken } from '@/lib/auth';
import db from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getCachedData } from '@/lib/cache';



export async function GET(request: Request) {
  try {
    // Tokeni doğrula
    const authResult = await verifyUserToken(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Hata durumunda zaten uygun yanıt döner
    }

    const { userId, email } = authResult;

    // Cloudflare environment'e eriş
    const { env } = await getCloudflareContext();

    // Veriyi önbellekten getir veya yoksa DB'den çek
    const userData = await getCachedData(
      env,
      `user:${userId}`,
      () => db.users.findById(env, userId),
      60 * 5 // 5 dakika önbellekte tut
    );

    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Kullanıcı verilerini döndür
    const { password, ...userWithoutPassword } = userData;
    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}