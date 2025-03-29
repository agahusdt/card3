export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';



export async function PUT(request: NextRequest) {
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
    const { name, email } = body;

    if (!name && !email) {
      return NextResponse.json({ 
        success: false, 
        error: 'No update data provided' 
      }, { status: 400 });
    }

    // Cloudflare environment'e eriş
    const { env } = await getCloudflareContext();

    // Update user with Drizzle ORM
    const updatedUser = await db.users.update(env, userId, {
      ...(name && { name }),
      ...(email && { email })
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        balance: updatedUser.balance,
        emailVerified: updatedUser.emailVerified
      } 
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ 
      success: false, 
      error: `An error occurred: ${error.message}` 
    }, { status: 500 });
  }
}