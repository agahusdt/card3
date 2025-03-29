export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';




export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
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

    // Cloudflare environment'e eriş
    const { env } = await getCloudflareContext();

    // Get admin user from database
    const admin = await db.users.findById(env, adminId);

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
    }

    // Get pending purchases
    const pendingPurchases = await db.tokenPurchases.findAllPending(env);

    return NextResponse.json({
      success: true,
      data: pendingPurchases
    });
  } catch (error) {
    console.error('Error fetching pending purchases:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch pending purchases' 
    }, { status: 500 });
  }
}