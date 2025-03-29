export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db, { getDB } from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';
import * as schema from '@/db/schema';
import { asc, desc, eq, ilike, or, sql } from 'drizzle-orm';



export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    // Cloudflare environment
    const { env } = await getCloudflareContext();
    const env_any = env as any;
    const secret = env_any.JWT_SECRET || process.env.JWT_SECRET || 'default-secret';

    // Verify token
    const secretKey = new TextEncoder().encode(secret);
    
    try {
      const { payload } = await jose.jwtVerify(token, secretKey);
      const adminId = payload.id as string;
      const isAdmin = payload.isAdmin as boolean;
      
      if (!adminId || !isAdmin) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Calculate skip
    const skip = (page - 1) * limit;

    // D1 veritabanı bağlantısını al
    const dbInstance = getDB(env);
    
    // Tip sorunlarını önlemek için any kullan
    const usersTable = schema.users as any;
    
    // Count total users (manual count since D1 may not support count() directly)
    let totalUsers = 0;
    if (search) {
      // If there's a search term
      const countResult = await dbInstance.select({ count: sql`count(*)` }).from(usersTable)
        .where(
          or(
            ilike(usersTable.name, `%${search}%`),
            ilike(usersTable.email, `%${search}%`)
          )
        );
      totalUsers = parseInt(countResult[0]?.count?.toString() || '0');
    } else {
      // If no search term, count all users
      const countResult = await dbInstance.select({ count: sql`count(*)` }).from(usersTable);
      totalUsers = parseInt(countResult[0]?.count?.toString() || '0');
    }

    // Get users with pagination
    let users;
    if (search) {
      users = await dbInstance.select().from(usersTable)
        .where(
          or(
            ilike(usersTable.name, `%${search}%`),
            ilike(usersTable.email, `%${search}%`)
          )
        )
        .orderBy(desc(usersTable.createdAt))
        .limit(limit)
        .offset(skip);
    } else {
      users = await dbInstance.select().from(usersTable)
        .orderBy(desc(usersTable.createdAt))
        .limit(limit)
        .offset(skip);
    }

    // Format for dashboard
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || 'Anonymous',
      email: user.email,
      password: user.password,
      role: user.role,
      balance: user.balance,
      lastActive: user.updatedAt || user.createdAt
    }));

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error: any) {
    console.error('All users error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { message: 'Could not fetch user information', error: error.message },
      { status: 500 }
    );
  }
}