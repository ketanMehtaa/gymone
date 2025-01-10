import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { debug } from '@/lib/debug';

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

    // Get the start of the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Get the start of the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Get today's start and end
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      membershipsByStatus,
      revenueByMonth,
      checkInsByDay,
      membershipStatus,
      paymentMethods,
      hourlyAttendance,
      membershipTrend
    ] = await Promise.all([
      // Memberships by status
      prisma.membership.groupBy({
        by: ['status'],
        where: {
          gymId: payload.gymId,
          endDate: {
            gte: new Date(),
          },
        },
        _count: true,
      }),

      // Revenue by month for the last 6 months
      prisma.payment.groupBy({
        by: ['paymentDate'],
        where: {
          gymId: payload.gymId,
          status: 'COMPLETED',
          paymentDate: {
            gte: sixMonthsAgo,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // Check-ins by day for the last 7 days
      prisma.attendance.groupBy({
        by: ['checkIn'],
        where: {
          gymId: payload.gymId,
          checkIn: {
            gte: sevenDaysAgo,
          },
        },
        _count: {
          _all: true,
        },
      }),

      // Member status distribution
      prisma.member.groupBy({
        by: ['status'],
        where: {
          gymId: payload.gymId,
        },
        _count: {
          _all: true,
        },
      }),

      // Payment methods distribution
      prisma.payment.groupBy({
        by: ['method'],
        where: {
          gymId: payload.gymId,
          status: 'COMPLETED',
          paymentDate: {
            gte: sixMonthsAgo,
          },
        },
        _count: true,
        _sum: {
          amount: true,
        },
      }),

      // Hourly attendance distribution for today
      prisma.attendance.findMany({
        where: {
          gymId: payload.gymId,
          checkIn: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        select: {
          checkIn: true,
        },
      }),

      // Membership trend (new vs cancelled) for last 6 months
      prisma.membership.groupBy({
        by: ['startDate', 'status'],
        where: {
          gymId: payload.gymId,
          startDate: {
            gte: sixMonthsAgo,
          },
        },
        _count: true,
      }),
    ]);

    // Process hourly attendance
    const hourlyDistribution = Array(24).fill(0);
    hourlyAttendance.forEach(attendance => {
      const hour = new Date(attendance.checkIn).getHours();
      hourlyDistribution[hour]++;
    });

    // Format the data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = {
      membershipsByType: membershipsByStatus.map(item => ({
        type: item.status,
        count: item._count,
      })),

      revenueByMonth: revenueByMonth.map(item => ({
        month: months[new Date(item.paymentDate).getMonth()],
        amount: item._sum.amount || 0,
      })),

      checkInsByDay: checkInsByDay.map(item => ({
        date: new Date(item.checkIn).toLocaleDateString('en-US', { weekday: 'short' }),
        count: item._count._all,
      })),

      membershipStatus: membershipStatus.map(item => ({
        status: item.status,
        count: item._count._all,
      })),

      paymentMethods: paymentMethods.map(item => ({
        method: item.method,
        count: item._count,
        amount: item._sum.amount || 0,
      })),

      hourlyAttendance: hourlyDistribution.map((count, hour) => ({
        hour: hour.toString().padStart(2, '0') + ':00',
        count,
      })),

      membershipTrend: membershipTrend.reduce((acc, item) => {
        const month = months[new Date(item.startDate).getMonth()];
        if (!acc[month]) {
          acc[month] = { new: 0, cancelled: 0 };
        }
        if (item.status === 'ACTIVE') {
          acc[month].new += item._count;
        } else if (item.status === 'INACTIVE') {
          acc[month].cancelled += item._count;
        }
        return acc;
      }, {} as Record<string, { new: number; cancelled: number }>),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching report stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report stats' },
      { status: 500 }
    );
  }
} 