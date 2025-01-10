import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberId } = body;

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Check if member exists and is active
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        status: true,
        gym: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    if (member.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Member is not active' },
        { status: 400 }
      );
    }

    // Check if member has already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingCheckIn = await prisma.attendance.findFirst({
      where: {
        memberId,
        checkIn: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingCheckIn) {
      return NextResponse.json(
        { error: 'Member has already checked in today' },
        { status: 400 }
      );
    }

    // Create new check-in
    const attendance = await prisma.attendance.create({
      data: {
        memberId,
        gymId: member.gym.id,
        checkIn: new Date(),
      },
      include: {
        member: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Check-in recorded successfully',
      data: attendance,
    });
  } catch (error) {
    console.error('Check-in error:', error);

    if (error instanceof Error && 'code' in error) {
      return NextResponse.json(
        { error: `Database error: ${error.code}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to record check-in. Please try again.' },
      { status: 500 }
    );
  }
} 