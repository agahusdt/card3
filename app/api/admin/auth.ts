import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new Client();

export async function verifyAdminToken(request: Request): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');

    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'default-secret') as {
      id: string;
      email: string;
    };

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    return !!admin;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
} 