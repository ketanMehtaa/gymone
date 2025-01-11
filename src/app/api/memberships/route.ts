import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addMonths } from 'date-fns';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Validation schema for creating a membership
const createMembershipSchema = z.object({
  memberId: z.string(),
  duration: z.number().min(1).max(12),
  amount: z.number().min(0),
  startDate: z.string().transform((str) => new Date(str)),
});

export async function POST(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.gymId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = createMembershipSchema.parse(json);

    // Verify member belongs to the gym
    const member = await prisma.member.findFirst({
      where: {
        id: body.memberId,
        gymId: payload.gymId,
      },
    });

    if (!member) {
      return new NextResponse(
        JSON.stringify({ message: 'Member not found or does not belong to your gym' }),
        { status: 404 }
      );
    }

    // Calculate end date based on duration
    const endDate = addMonths(body.startDate, body.duration);

    // Create the membership
    const membership = await prisma.membership.create({
      data: {
        startDate: body.startDate,
        endDate,
        amount: body.amount,
        status: 'ACTIVE',
        memberId: body.memberId,
        gymId: payload.gymId as string,
      },
    });

    return NextResponse.json(membership);
  } catch (error) {
    console.error('Membership creation error:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid request data', errors: error.errors }),
        { status: 400 }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: 'Failed to create membership' }),
      { status: 500 }
    );
  }
} 