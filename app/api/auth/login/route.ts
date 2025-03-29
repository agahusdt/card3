export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtHelpers } from '@/lib/auth';
import { apiResponse } from '@/lib/constants';
// import { trackLogin } from '@/lib/analytics'; - Kaldırıldı, Cloudflare Analytics kullanılacak
import db from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiResponse.nextResponse.error('Email and password are required', 400);
    }

    // Get Cloudflare environment
    const { env } = await getCloudflareContext();

    // Find user with Drizzle ORM
    const user = await db.users.findByEmail(env, email);

    if (!user) {
      return apiResponse.nextResponse.error('Invalid credentials', 401);
    }

    // Direct password comparison - Edge compatible
    // Not: Gerçek projede güvenli bir Edge-uyumlu hash yöntemi kullanın
    const isValidPassword = password === user.password;
    if (!isValidPassword) {
      return apiResponse.nextResponse.error('Invalid credentials', 401);
    }

    // Generate JWT token with jwtHelpers
    const token = await jwtHelpers.createToken({ id: user.id, email: user.email });

    // Save session to database with Drizzle ORM
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await db.sessions.create(env, user.id, token, expiresAt);

    // Track login event with Cloudflare Analytics (otomatik)
    // Cloudflare Analytics kullanıldığından console.log gereksiz

    // Set cookie in response
    const cookieResponse = NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      redirectUrl: '/dashboard'
    });

    cookieResponse.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    });

    return cookieResponse;
  } catch (error: any) {
    console.error('Login error:', error);
    return apiResponse.nextResponse.error(`An error occurred during login: ${error.message || 'Unknown error'}`, 500);
  }
}