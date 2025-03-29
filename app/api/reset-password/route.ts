export const runtime = 'edge';

import { NextResponse } from 'next/server';



export async function POST() {
  // Şifre sıfırlama edge runtime uyumlu şekilde ekleneceğini belirtiyoruz
  return NextResponse.json({ message: "Password reset will be implemented with Cloudflare compatible method" }, { status: 200 });
}