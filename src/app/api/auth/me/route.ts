import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/jwt';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    console.log('ME Route - Checking auth token');
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    console.log('ME Route - Token present:', !!token);

    if (!token) {
      console.log('ME Route - No token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const verifiedToken = await verifyAuth(token);
    console.log('ME Route - Token verification:', !!verifiedToken);

    if (!verifiedToken) {
      console.log('ME Route - Invalid token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: verifiedToken.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    });

    console.log('ME Route - User found:', !!user);

    if (!user) {
      console.log('ME Route - User not found in database');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('ME Route - Error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
