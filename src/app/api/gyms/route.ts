import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

interface TokenPayload {
  gymId: string;
}

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = (await verifyToken(token)) as unknown as TokenPayload;
    
    if (!payload?.gymId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const gym = await prisma.gym.findUnique({
      where: {
        id: payload.gymId
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!gym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: [gym] });
  } catch (error) {
    console.error('Error fetching gym:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gym' },
      { status: 500 }
    );
  }
} 