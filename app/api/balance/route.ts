export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { apiResponse } from '@/lib/constants';
import db, { getDB } from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';
import { verifyUserToken } from '@/lib/auth';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';



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

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      balance: user.balance
    });
  } catch (error: any) {
    console.error('Failed to get user balance:', error);
    return apiResponse.nextResponse.error(`Failed to get user balance: ${error.message || 'Unknown error'}`, 500);
  }
}

export async function PUT(request: Request) {
  try {
    // Token doğrulama
    const authResult = await verifyUserToken(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Hata durumunda NextResponse döner
    }

    const { userId } = authResult;
    
    // Parse request
    const { amount } = await request.json();

    // Validate amount
    if (typeof amount !== 'number') {
      return apiResponse.nextResponse.error('Please enter a valid amount', 400);
    }
    
    // Cloudflare environment
    const { env } = await getCloudflareContext();

    // Get user to verify
    const user = await db.users.findById(env, userId);
    if (!user) {
      return apiResponse.nextResponse.error('User not found', 404);
    }
    
    // D1 veritabanı bağlantısını al
    const dbInstance = getDB(env);
    
    // Tip sorunlarını önlemek için any kullan
    const usersTable = schema.users as any;
    
    // Update user's balance
    await dbInstance.update(usersTable)
      .set({ 
        balance: amount,
        updatedAt: new Date()
      })
      .where(eq(usersTable.id, userId));
      
    // Transaction tablosuna yeni işlem ekle
    const transactionId = crypto.randomUUID();
    const transactionsTable = schema.transactions as any;
    
    await dbInstance.insert(transactionsTable).values({
      id: transactionId,
      user_id: userId,
      amount: amount,
      type: amount >= 0 ? 'DEPOSIT' : 'WITHDRAWAL',
      status: 'COMPLETED',
    });
    
    // Güncellenmiş kullanıcı bilgilerini getir
    const updatedUser = await db.users.findById(env, userId);

    return NextResponse.json({
      message: 'Balance updated',
      balance: updatedUser.balance,
    });
  } catch (error: any) {
    console.error('Balance update error:', error);
    return apiResponse.nextResponse.error(`Failed to update balance: ${error.message || 'Unknown error'}`, 500);
  }
}