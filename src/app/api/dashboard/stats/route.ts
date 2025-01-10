import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { debug } from '@/lib/debug';

export async function GET() {
  try {
    debug('Fetching dashboard stats');

    // Get total members count
    const totalMembers = await prisma.member.count();

    // Get active members count
    const activeMembers = await prisma.member.count({
      where: {
        status: 'ACTIVE',
      },
    });

    // Get total revenue (sum of all membership payments)
    const totalRevenueResult = await prisma.membership.aggregate({
      _sum: {
        amount: true,
      },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    // Get today's check-ins
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkInsToday = await prisma.attendance.count({
      where: {
        checkIn: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const stats = {
      totalMembers,
      activeMembers,
      totalRevenue,
      checkInsToday,
    };

    debug('Successfully fetched dashboard stats', { data: stats });

    return NextResponse.json(stats);
  } catch (error) {
    debug('Error fetching dashboard stats', { level: 'error', data: error });
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 