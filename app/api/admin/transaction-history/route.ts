export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db, { getDB } from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';
import * as schema from '@/db/schema';
import { desc, eq, or, SQL, sql } from 'drizzle-orm';



// Cloudflare için Edge Runtime
// Removed duplicate runtime

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'hardcodedsecret');
    
    const { payload } = await jose.jwtVerify(token, secret);
    const adminId = payload.id as string;
    const isAdmin = payload.isAdmin as boolean;
    
    if (!adminId || !isAdmin) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // Cloudflare context
    const { env } = await getCloudflareContext();
    
    // Admin kimliğini kontrol et (role = 'admin' olan kullanıcı)
    const admin = await db.users.findById(env, adminId);
    
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
    }

    // Veritabanı bağlantısı al
    const dbInstance = getDB(env);
    
    // İşlem geçmişini getir - bu örnekte basitleştirilmiş sorgu
    const transactionHistory = await dbInstance.query.tokenPurchases.findMany({
      where: (tokenPurchases, { eq, or }) => 
        or(
          eq(tokenPurchases.status, 'APPROVED'),
          eq(tokenPurchases.status, 'REJECTED')
        ),
      orderBy: (tokenPurchases, { desc }) => [desc(tokenPurchases.updatedAt)],
      limit: 100
    });

    // Kullanıcı bilgilerini ayrıca getir
    const userIds = [...new Set(transactionHistory.map(tx => tx.userId))];
    const users = await dbInstance.query.users.findMany({
      where: (users, { inArray }) => inArray(users.id, userIds),
      columns: {
        id: true,
        name: true,
        email: true
      }
    });
    
    // Kullanıcı bilgilerini işlemlerle birleştir
    const enrichedTransactions = transactionHistory.map(tx => {
      const user = users.find(u => u.id === tx.userId);
      return {
        ...tx,
        user: user || { id: tx.userId, name: null, email: null }
      };
    });

    return NextResponse.json(enrichedTransactions);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch transaction history' 
    }, { status: 500 });
  }
}