export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { jwtHelpers } from '@/lib/auth';
import { apiResponse } from '@/lib/constants';
// import { trackSignup } from '@/lib/analytics'; - Kaldırıldı, Cloudflare Analytics kullanılacak
import db from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      return apiResponse.nextResponse.error('Email, password and name are required fields', 400);
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiResponse.nextResponse.error('Please enter a valid email address', 400);
    }

    // Password validation
    if (password.length < 6) {
      return apiResponse.nextResponse.error('Password must be at least 6 characters long', 400);
    }

    // Cloudflare environment'e eriş
    const { env } = await getCloudflareContext();

    // Check if user exists
    const existingUser = await db.users.findByEmail(env, email);

    if (existingUser) {
      return apiResponse.nextResponse.error('This email is already registered', 400);
    }

    try {
      // Create user with Drizzle ORM
      const user = await db.users.create(env, {
        email,
        password, // Not: Gerçek uygulamada password hash'leme kullanmalısınız
        name,
        emailVerified: true, // Doğrulama e-postası göndermediğimiz için true
      });

      // Track signup with Cloudflare Analytics (otomatik)
      // Cloudflare Analytics kullanıldığından console.log gereksiz

      // Generate JWT token
      const jwt_token = await jwtHelpers.createToken({ id: user.id, email: user.email });

      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await db.sessions.create(env, user.id, jwt_token, expiresAt);

      // Create response with token cookie
      const cookieResponse = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        redirectUrl: '/dashboard'
      });

      // Set cookie in response
      cookieResponse.cookies.set('token', jwt_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
      });

      return cookieResponse;
    } catch (dbError: any) {
      console.error('User creation error:', dbError);
      return apiResponse.nextResponse.error(`Failed to create user account: ${dbError.message || 'Database error'}`, 500);
    }

  } catch (error: any) {
    console.error('Registration error:', error);
    return apiResponse.nextResponse.error(`An error occurred during registration: ${error.message || 'Unknown error'}`, 500);
  }
}