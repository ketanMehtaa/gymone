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

    // Get the start of this year
    const startOfYear = new Date();
    startOfYear.setMonth(0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    // Get all stats in parallel
    const [
      membershipTrend,
      attendanceTrend,
      memberStatusDistribution,
    ] = await Promise.all([
      // Monthly membership trend
      prisma.membership.groupBy({
        by: ['createdAt'],
        where: {
          gymId: payload.gymId,
          createdAt: {
            gte: startOfYear,
          },
        },
        _count: true,
      }),

      // Monthly attendance trend
      prisma.attendance.groupBy({
        by: ['checkIn'],
        where: {
          gymId: payload.gymId,
          checkIn: {
            gte: startOfYear,
          },
        },
        _count: true,
      }),

      // Member status distribution
      prisma.member.groupBy({
        by: ['status'],
        where: {
          gymId: payload.gymId,
        },
        _count: true,
      }),
    ]);

    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    return NextResponse.json({
      membershipTrend: membershipTrend.map(item => ({
        month: months[new Date(item.createdAt).getMonth()],
        total: item._count,
      })),
      attendanceTrend: attendanceTrend.map(item => ({
        month: months[new Date(item.checkIn).getMonth()],
        total: item._count,
      })),
      memberStatusDistribution: memberStatusDistribution.map(item => ({
        status: item.status,
        total: item._count,
      })),
    });
  } catch (error) {
    console.error('Error fetching reports stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports stats' },
      { status: 500 }
    );
  }
} 