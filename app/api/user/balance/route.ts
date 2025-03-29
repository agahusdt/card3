export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db, { getDB } from '@/db';
import * as jose from 'jose';
import { getCloudflareContext } from '@/lib/cloudflare';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';



// Cloudflare için Edge Runtime
// Removed duplicate runtime

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    try {
      // JWT token doğrula
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');
      const { payload } = await jose.jwtVerify(token.value, secretKey);
      const decoded = payload as { id: string };

      // Cloudflare D1 context
      const { env } = await getCloudflareContext();
      
      // Kullanıcı bilgilerini Drizzle ORM ile getir
      const user = await db.users.findById(env, decoded.id);

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      // Gerçek kullanıcı bakiyesini dön
      return NextResponse.json({
        success: true,
        data: {
          balance: user.balance
        }
      });

    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}