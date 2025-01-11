import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET() {
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

    // Get the start of today and this month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Fetch all stats in parallel
    const [
      totalMembers,
      activeMembers,
      monthlyRevenue,
      checkInsToday
    ] = await Promise.all([
      // Total members count
      prisma.member.count({
        where: {
          gymId: payload.gymId,
        },
      }),

      // Active members count
      prisma.member.count({
        where: {
          gymId: payload.gymId,
          status: 'ACTIVE',
        },
      }),

      // Total revenue this month from active memberships
      prisma.membership.aggregate({
        where: {
          gymId: payload.gymId,
          status: 'ACTIVE',
          createdAt: {
            gte: startOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // Check-ins today
      prisma.attendance.count({
        where: {
          gymId: payload.gymId,
          checkIn: {
            gte: today,
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalMembers,
      activeMembers,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      checkInsToday,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 