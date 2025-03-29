export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';



export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'hardcodedsecret');
    
    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.id as string;
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Current password and new password are required' 
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'New password must be at least 6 characters long' 
      }, { status: 400 });
    }

    // Cloudflare environment'e eriş
    const { env } = await getCloudflareContext();

    // Get user from database using Drizzle ORM
    const user = await db.users.findById(env, userId);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Verify current password with direct comparison
    if (currentPassword !== user.password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Current password is incorrect' 
      }, { status: 401 });
    }

    // Update password in database with Drizzle ORM
    await db.users.update(env, userId, { password: newPassword });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Error changing password:', error);
    return NextResponse.json({ 
      success: false, 
      error: `An error occurred: ${error.message}` 
    }, { status: 500 });
  }
}