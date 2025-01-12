export const dynamic = 'force-dynamic';

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

interface TokenPayload {
  id: string;
  gymId: string | undefined;
  role: 'ADMIN' | 'STAFF';
}

export async function POST(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const payload = (await verifyToken(token)) as unknown as TokenPayload;
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
        memberId: body.memberId,
        gymId: payload.gymId,
        // Add creator information based on role using the correct id field
        ...(payload.role === 'ADMIN' 
          ? { adminId: payload.id }
          : { staffId: payload.id }
        ),
      },
    });

    // Fetch creator details after creation
    let creator = null;
    if (membership.adminId) {
      const admin = await prisma.admin.findUnique({
        where: { id: membership.adminId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });
      if (admin) {
        creator = {
          ...admin,
          role: 'ADMIN' as const
        };
      }
    } else if (membership.staffId) {
      const staff = await prisma.staff.findUnique({
        where: { id: membership.staffId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });
      if (staff) {
        creator = {
          ...staff,
          role: 'STAFF' as const
        };
      }
    }

    // Return formatted response
    return NextResponse.json({
      data: {
        ...membership,
        createdBy: creator
      }
    });
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