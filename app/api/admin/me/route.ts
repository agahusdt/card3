export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db from '@/db';



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
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');
    
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

    return NextResponse.json({ 
      success: true, 
      admin: {
        id: admin.id,
        name: admin.name
      }
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch admin data' 
    }, { status: 500 });
  }
}