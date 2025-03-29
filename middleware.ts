import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';
import { jwtHelpers } from './lib/auth';

export const runtime = 'edge';

// Run middleware on all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  // Skip middleware for API routes and static files
  if (request.nextUrl.pathname.startsWith('/api/') || 
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }

  // GEÇICI OLARAK: Sayfalara erişim için token doğrulamayı devre dışı bırakıyoruz
  // Hataların kaynağını bulmak için middleware'i basitleştirelim
  
  // Token doğrulama ve yönlendirme kodlarını geçici olarak devre dışı bırakıyoruz
  /*
  const token = request.cookies.get('token')?.value;
  const adminToken = request.cookies.get('admin_token')?.value;

  // Admin routes protection
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    if (!adminToken) {
      // Redirect to admin login if no admin token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      // Verify admin token with jwtHelpers
      const verificationResult = await jwtHelpers.verifyToken(adminToken);
      
      if (!verificationResult.valid || !verificationResult.payload) {
        throw new Error('Invalid admin token');
      }
      
      const decoded = verificationResult.payload as { id: string; email: string; isAdmin: boolean };
      
      if (!decoded.isAdmin) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // Add admin info to request headers
      const response = NextResponse.next();
      response.headers.set('x-admin-id', decoded.id);
      response.headers.set('x-admin-email', decoded.email);
      
      return response;
    } catch (error) {
      // Token is invalid, redirect to admin login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // Protected routes (dashboard and profile)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // If admin token exists and user is trying to access the dashboard, redirect to admin dashboard
    if (adminToken && !token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    try {
      // Verify token with jwtHelpers
      const verificationResult = await jwtHelpers.verifyToken(token);
      
      if (!verificationResult.valid || !verificationResult.payload) {
        throw new Error('Invalid token');
      }
      
      const decoded = verificationResult.payload as { id: string; email: string };
      
      // Add user info to request headers
      const response = NextResponse.next();
      response.headers.set('x-user-id', decoded.id);
      response.headers.set('x-user-email', decoded.email);
      
      return response;
    } catch (error) {
      // Token is invalid, redirect to login
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('token');
      return response;
    }
  }
  */

  // Basic security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  
  return response;
} 