export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db, { getDB } from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';



// Cloudflare için Edge Runtime
// Removed duplicate runtime

export async function POST(request: Request) {
  try {
    // Verify admin token
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'hardcodedsecret');
    
    try {
      const { payload } = await jose.jwtVerify(token, secret);
      const adminId = payload.id as string;
      const isAdmin = payload.isAdmin as boolean;
      
      if (!adminId || !isAdmin) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Get the user data from request body
    const { userId, balance } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Cloudflare D1 veritabanı için context al
    const { env } = await getCloudflareContext();
    const dbInstance = getDB(env);
    
    // Önce kullanıcıyı bul
    const users = await dbInstance.select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1)
      .all();
      
    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Kullanıcı verilerini güncelle
    const updatedData: any = {
      updatedAt: new Date()
    };
    
    if (balance !== undefined) {
      updatedData.balance = balance;
    }
    
    await dbInstance.update(schema.users)
      .set(updatedData)
      .where(eq(schema.users.id, userId));
    
    // Güncellenmiş kullanıcı verilerini al
    const updatedUsers = await dbInstance.select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1)
      .all();
      
    const updatedUser = updatedUsers[0];

    // Format for response
    const formattedUser = {
      id: updatedUser.id,
      name: updatedUser.name || 'Anonymous',
      email: updatedUser.email,
      password: updatedUser.password,
      role: updatedUser.role,
      balance: updatedUser.balance,
      lastActive: updatedUser.updatedAt || updatedUser.createdAt
    };

    return NextResponse.json({
      message: 'User updated successfully',
      user: formattedUser
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { message: 'Could not update user information', error: error.message },
      { status: 500 }
    );
  }
}