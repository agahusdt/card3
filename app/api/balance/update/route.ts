export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { verifyUserToken } from '@/lib/auth';
import db from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';



export async function PUT(request: Request) {
  try {
    // Kullanıcı token'ı doğrula
    const authResult = await verifyUserToken(request);
    
    if (authResult instanceof NextResponse) {
      // Hata döndüyse
      return authResult;
    }
    
    const { userId } = authResult;
    
    // İstek gövdesinden yeni bakiyeyi al
    const { newBalance } = await request.json();
    
    // Cloudflare environment context'i al
    const { env } = await getCloudflareContext();
    
    // Kullanıcının bakiyesini güncelle
    const updatedUser = await db.users.update(env, userId, { 
      balance: newBalance 
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating balance:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}