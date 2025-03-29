export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db, { getDB } from '@/db';
import { eq, or } from 'drizzle-orm';
import * as schema from '@/db/schema';



// Cloudflare için Edge Runtime
// Removed duplicate runtime

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin token
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

    // Get Cloudflare env from request
    // @ts-ignore - Cloudflare spesifik alan
    const env = request.cf || {};
    const admin = await db.users.findById(env, adminId);

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
    }
    
    // Use direct DB delete via transaction helper
    const dbInstance = getDB(env);
    await dbInstance.delete(schema.transactions)
      .where(
        or(
          eq(schema.transactions.status, 'APPROVED'),
          eq(schema.transactions.status, 'REJECTED')
        )
      );

    return NextResponse.json({ 
      success: true, 
      message: 'All transactions deleted successfully' 
    });
  } catch (error) {
    console.error('Delete all transactions error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete transactions',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}