export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import db from '@/db';
import { getCloudflareContext } from '@/lib/cloudflare';




export async function PUT(request: NextRequest) {
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

    // Get admin from database
    const admin = await db.users.findById(env, adminId);

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
    }

    // Get request body
    const { requestId, status, message } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json({
        success: false,
        error: 'Request ID and status are required'
      }, { status: 400 });
    }

    // Status değer kontrolü
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Status must be APPROVED or REJECTED'
      }, { status: 400 });
    }

    // Find the token purchase request
    const tokenPurchase = await db.tokenPurchases.findById(env, requestId);
    
    if (!tokenPurchase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Purchase request not found' 
      }, { status: 404 });
    }
    
    // Update token purchase status
    await db.tokenPurchases.updateStatus(env, requestId, status);
    
    // If approved, increase user's balance
    if (status === 'APPROVED') {
      const user = await db.users.findById(env, tokenPurchase.userId);
      
      if (user) {
        const newBalance = user.balance + tokenPurchase.tokenAmount + tokenPurchase.bonusAmount;
        await db.users.update(env, user.id, { balance: newBalance });
        
        // Create transaction record
        await db.transactions.create(env, {
          userId: user.id,
          amount: tokenPurchase.cryptoAmount,
          tokenAmount: tokenPurchase.tokenAmount + tokenPurchase.bonusAmount,
          type: 'DEPOSIT',
          status: 'COMPLETED'
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        id: requestId,
        status
      },
      message: message || `Purchase request ${status.toLowerCase()} successfully`
    });
  } catch (error: any) {
    console.error('Error processing purchase request:', error);
    return NextResponse.json({ 
      success: false, 
      error: `An error occurred: ${error.message}` 
    }, { status: 500 });
  }
}