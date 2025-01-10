import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const method = searchParams.get('method');

    // Build where clause based on filters
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (method && method !== 'ALL') {
      where.method = method;
    }

    const payments = await prisma.payment.findMany({
      where,
      select: {
        id: true,
        amount: true,
        method: true,
        status: true,
        paymentDate: true,
        membership: {
          select: {
            member: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { membershipId, amount, method } = body;

    if (!membershipId || !amount || !method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate membership exists and get gym ID
    const membership = await prisma.membership.findUnique({
      where: { id: membershipId },
      select: {
        id: true,
        gymId: true,
        status: true,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Membership not found' },
        { status: 404 }
      );
    }

    if (membership.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Cannot process payment for inactive membership' },
        { status: 400 }
      );
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        amount,
        method,
        status: 'COMPLETED',
        membershipId,
        gymId: membership.gymId,
      },
      include: {
        membership: {
          select: {
            member: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Payment recorded successfully',
      data: payment,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
} 