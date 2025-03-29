export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { apiResponse } from '@/lib/constants';
import db, { getDB } from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';
import { verifyUserToken } from '@/lib/auth';
import { getCachedData, invalidateCache } from '@/lib/cache';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';



/**
 * Kullanıcı işlemlerini listeleyen API
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

    // KV Cache'de önbelleğe alınmış veriyi kontrol et
    const cacheKey = `user:${userId}:transactions`;
    const transactions = await getCachedData(
      env, 
      cacheKey, 
      () => db.transactions.findByUserId(env, userId),
      180 // 3 dakika
    );

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error: any) {
    console.error('Error in transactions API:', error);
    return apiResponse.nextResponse.error(`Failed to fetch transactions: ${error.message || 'Unknown error'}`, 500);
  }
}

/**
 * Para çekme işlemi API'si
 */
export async function POST(request: Request) {
  try {
    // Token doğrulama
    const authResult = await verifyUserToken(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Hata durumunda NextResponse döner
    }

    const { userId } = authResult;
    
    // Cloudflare environment
    const { env } = await getCloudflareContext();
    
    const { type, amount, walletAddress } = await request.json();
    
    // Validate the request data
    if (type !== 'WITHDRAW' || !amount || amount <= 0 || !walletAddress) {
      return apiResponse.nextResponse.error('Invalid withdrawal request', 400);
    }
    
    // Check if the user has enough balance
    const user = await db.users.findById(env, userId);
    
    if (!user || user.balance < amount) {
      return apiResponse.nextResponse.error('Insufficient balance', 400);
    }
    
    // D1 veritabanı bağlantısını al
    const dbInstance = getDB(env);
    
    // Tip sorunlarını önlemek için tokenPurchases şemasını any olarak kullan
    const tokenPurchasesTable = schema.tokenPurchases as any;
    
    // Create a new withdrawal transaction with pending status
    const transactionId = crypto.randomUUID();
    await dbInstance.insert(tokenPurchasesTable).values({
      id: transactionId,
      user_id: userId,
      crypto_amount: amount,
      token_amount: amount,
      bonus_amount: 0,
      usd_amount: amount,
      token_price: 1,
      crypto_symbol: 'USDT',
      status: 'PENDING',
      message: 'Bekleniyor, lütfen yetkiliyle görüşün',
      type: 'WITHDRAW',
      wallet_address: walletAddress,
    });
    
    // Tip sorunlarını önlemek için any kullan
    const usersTable = schema.users as any;
    
    // Update user's balance
    await dbInstance.update(usersTable)
      .set({ 
        balance: user.balance - amount,
        updatedAt: new Date()
      })
      .where(eq(usersTable.id, userId));
    
    // Önbelleği temizle
    await invalidateCache(env, `user:${userId}:transactions`);
    
    // Güncel işlemi getir
    const transaction = await dbInstance.query.tokenPurchases.findFirst({
      where: (tokenPurchases, { eq }) => eq(tokenPurchases.id, transactionId)
    });
    
    return NextResponse.json({
      success: true,
      message: 'Bekleniyor, lütfen yetkiliyle görüşün',
      transaction
    });
    
  } catch (error: any) {
    console.error('Error in withdrawal API:', error);
    return apiResponse.nextResponse.error(`Failed to process withdrawal: ${error.message || 'Unknown error'}`, 500);
  }
}