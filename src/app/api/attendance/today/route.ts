import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkIns = await prisma.attendance.findMany({
      where: {
        checkIn: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        id: true,
        checkIn: true,
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        checkIn: 'desc',
      },
    });

    return NextResponse.json(checkIns);
  } catch (error) {
    console.error('Error fetching today\'s check-ins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch check-ins' },
      { status: 500 }
    );
  }
} 