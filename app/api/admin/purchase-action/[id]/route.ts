export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db, { getDB } from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';



// Cloudflare Edge Runtime
// Removed duplicate runtime

// Next.js 15 route handler definition
export async function POST(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const purchaseId = params.id;
    
    // In Next.js 15, cookies() function
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token');
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || 'default-secret';
    
    try {
      // Verify JWT token
      const secretKey = new TextEncoder().encode(secret);
      const { payload } = await jose.jwtVerify(token.value, secretKey);
      const decoded = payload as { id: string; name: string; isAdmin: boolean };
      
      // Check if user is admin
      if (!decoded.isAdmin) {
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
      }
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { action } = await request.json();

    if (!purchaseId) {
      return NextResponse.json({ message: 'Purchase ID is required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    // Cloudflare D1 veritabanı erişimi için context
    const { env } = await getCloudflareContext();
    const dbInstance = getDB(env);

    // Get the purchase from D1
    const purchases = await dbInstance.select()
      .from(schema.tokenPurchases)
      .where(eq(schema.tokenPurchases.id, purchaseId))
      .limit(1)
      .all();
    
    if (!purchases || purchases.length === 0) {
      return NextResponse.json({ message: 'Purchase not found' }, { status: 404 });
    }

    const purchase = purchases[0];

    // Get user details
    const users = await dbInstance.select()
      .from(schema.users)
      .where(eq(schema.users.id, purchase.userId))
      .limit(1)
      .all();
      
    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    const user = users[0];

    if (purchase.status !== 'PENDING') {
      return NextResponse.json({ message: 'Purchase is not in pending state' }, { status: 400 });
    }

    const now = new Date();

    if (action === 'approve') {
      // Kullanıcı bakiyesini güncelle
      const newBalance = user.balance + purchase.tokenAmount + purchase.bonusAmount;
      
      await dbInstance
        .update(schema.users)
        .set({
          balance: newBalance,
          updatedAt: now
        })
        .where(eq(schema.users.id, purchase.userId));

      // Satın alma durumunu güncelle
      await dbInstance
        .update(schema.tokenPurchases)
        .set({
          status: 'APPROVED',
          updatedAt: now
        })
        .where(eq(schema.tokenPurchases.id, purchaseId));
    } else {
      // Satın almayı reddet
      await dbInstance
        .update(schema.tokenPurchases)
        .set({
          status: 'REJECTED',
          updatedAt: now
        })
        .where(eq(schema.tokenPurchases.id, purchaseId));
    }

    return NextResponse.json({ 
      success: true,
      message: `Purchase ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    console.error('Purchase action error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing the purchase' },
      { status: 500 }
    );
  }
}