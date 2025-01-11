import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload?.gymId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { memberId } = body;

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Check if member exists, is active, and belongs to the same gym
    const member = await prisma.member.findFirst({
      where: { 
        id: memberId,
        gymId: payload.gymId, // Ensure member belongs to the same gym
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        status: true,
        gymId: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found or does not belong to your gym' },
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
        gymId: member.gymId,
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