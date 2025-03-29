export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { apiResponse } from '@/lib/constants';
import db, { getDB } from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';
import { verifyUserToken } from '@/lib/auth';
import * as schema from '@/db/schema';



// Create token purchase route
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

    // Get request body
    const body = await request.json();
    const { 
      cryptoAmount, 
      cryptoSymbol, 
      tokenAmount, 
      bonusAmount, 
      totalAmount,
      orderId
    } = body;

    // Validate input
    if (!cryptoAmount || !cryptoSymbol || !tokenAmount) {
      return apiResponse.nextResponse.error('Missing required fields', 400);
    }

    // Convert amounts to proper types
    const cryptoAmountFloat = parseFloat(cryptoAmount);
    const tokenAmountFloat = parseFloat(tokenAmount);
    const bonusAmountFloat = parseFloat(bonusAmount || '0');
    const totalAmountFloat = parseFloat(totalAmount || (tokenAmountFloat + bonusAmountFloat).toString());

    // Validate amounts
    if (isNaN(cryptoAmountFloat) || cryptoAmountFloat <= 0) {
      return apiResponse.nextResponse.error('Invalid crypto amount', 400);
    }

    if (isNaN(tokenAmountFloat) || tokenAmountFloat <= 0) {
      return apiResponse.nextResponse.error('Invalid token amount', 400);
    }

    // Find user
    const user = await db.users.findById(env, userId);

    if (!user) {
      return apiResponse.nextResponse.error('User not found', 404);
    }

    // D1 veritabanı bağlantısını al
    const dbInstance = getDB(env);
    
    // Tip sorunlarını önlemek için tokenPurchases şemasını any olarak kullan
    const tokenPurchasesTable = schema.tokenPurchases as any;
    
    // Create token purchase record with a UUID
    const purchaseId = crypto.randomUUID();
    const orderIdValue = orderId || `ORDER-${Date.now()}`;
    
    await dbInstance.insert(tokenPurchasesTable).values({
      id: purchaseId,
      user_id: userId,
      crypto_amount: cryptoAmountFloat,
      token_amount: tokenAmountFloat,
      bonus_amount: bonusAmountFloat,
      usd_amount: tokenAmountFloat / 10, // Assuming 1 GROK = $0.1
      token_price: 0.1, // $0.1 per token
      crypto_symbol: cryptoSymbol,
      status: 'PENDING',
      order_id: orderIdValue,
      type: 'DEPOSIT'
    });
    
    // Güncel satın alma işlemini getir
    const purchase = await dbInstance.query.tokenPurchases.findFirst({
      where: (tokenPurchases, { eq }) => eq(tokenPurchases.id, purchaseId)
    });

    // Return success response
    return apiResponse.nextResponse.success({
      purchase: {
        id: purchase.id,
        orderId: purchase.orderId,
        cryptoAmount: purchase.cryptoAmount,
        tokenAmount: purchase.tokenAmount,
        bonusAmount: purchase.bonusAmount,
        status: purchase.status,
        cryptoSymbol: purchase.cryptoSymbol
      }
    }, 'Purchase created successfully');
  } catch (error: any) {
    console.error('Token purchase error:', error);
    return apiResponse.nextResponse.error(`Failed to create purchase: ${error.message || 'Unknown error'}`, 500);
  }
}