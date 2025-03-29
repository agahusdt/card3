export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db, { getDB } from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';
import * as schema from '@/db/schema';
import { desc, eq } from 'drizzle-orm';



// Cloudflare için Edge Runtime
// Removed duplicate runtime

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify token
    const secret = process.env.JWT_SECRET || 'default-secret';
    
    try {
      // Verify token with jose
      const secretKey = new TextEncoder().encode(secret);
      const { payload } = await jose.jwtVerify(token, secretKey);
      const decoded = payload as { id: string; email: string };
      
      // Get Cloudflare context
      const { env } = await getCloudflareContext();
      
      // Get database instance
      const dbInstance = getDB(env);
      
      // Get user token purchases from database
      const tokenPurchases = await dbInstance.query.tokenPurchases.findMany({
        where: (purchases, { eq }) => eq(purchases.userId, decoded.id),
        orderBy: (purchases, { desc }) => [desc(purchases.createdAt)]
      });
      
      // Get user's other transactions
      const transactions = await dbInstance.query.transactions.findMany({
        where: (tx, { eq }) => eq(tx.userId, decoded.id),
        orderBy: (tx, { desc }) => [desc(tx.createdAt)]
      });
      
      // Format token purchases
      const formattedPurchases = tokenPurchases.map((purchase) => ({
        id: purchase.id,
        type: purchase.type || 'DEPOSIT',
        cryptoAmount: purchase.cryptoAmount,
        tokenAmount: purchase.tokenAmount,
        bonusAmount: purchase.bonusAmount,
        status: purchase.status,
        date: purchase.createdAt,
        cryptoSymbol: purchase.cryptoSymbol,
        orderId: purchase.orderId,
        message: purchase.message || null,
        walletAddress: purchase.walletAddress || null
      }));
      
      // Format other transactions
      const formattedTransactions = transactions.map((tx) => ({
        id: tx.id,
        type: tx.type || 'DEPOSIT',
        amount: tx.amount,
        tokenAmount: tx.tokenAmount,
        status: tx.status,
        date: tx.createdAt
      }));
      
      // Combine all transactions
      const allTransactions = [
        ...formattedPurchases.map(p => ({
          ...p,
          transactionType: 'TOKEN_PURCHASE'
        })),
        ...formattedTransactions.map(t => ({
          ...t,
          transactionType: 'TRANSACTION'
        }))
      ].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      return NextResponse.json({ 
        success: true, 
        data: allTransactions 
      });
      
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve transactions' },
      { status: 500 }
    );
  }
}