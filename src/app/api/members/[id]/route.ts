import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.gymId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const member = await prisma.member.findFirst({
      where: {
        id: params.id,
        gymId: payload.gymId,
      },
      include: {
        memberships: {
          orderBy: {
            endDate: 'desc',
          },
        },
        attendances: {
          orderBy: {
            checkIn: 'desc',
          },
        },
      },
    });

    if (!member) {
      return new NextResponse('Member not found', { status: 404 });
    }

    // Calculate membership status
    const latestMembership = member.memberships[0];
    let membershipStatus: 'ACTIVE' | 'EXPIRED' | 'NONE' = 'NONE';
    
    if (latestMembership) {
      membershipStatus = new Date(latestMembership.endDate) > new Date() 
        ? 'ACTIVE' 
        : 'EXPIRED';
    }

    return NextResponse.json({
      member: {
        ...member,
        membershipStatus,
        latestMembership: latestMembership || null,
      }
    });
  } catch (error) {
    console.error('Fetch member error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.gymId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, email, phone } = body;

    const member = await prisma.member.update({
      where: {
        id: params.id,
        gymId: payload.gymId,
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
      },
      include: {
        memberships: {
          orderBy: {
            endDate: 'desc',
          },
        },
        attendances: {
          orderBy: {
            checkIn: 'desc',
          },
        },
      },
    });

    // Calculate membership status
    const latestMembership = member.memberships[0];
    let membershipStatus: 'ACTIVE' | 'EXPIRED' | 'NONE' = 'NONE';
    
    if (latestMembership) {
      membershipStatus = new Date(latestMembership.endDate) > new Date() 
        ? 'ACTIVE' 
        : 'EXPIRED';
    }

    return NextResponse.json({
      member: {
        ...member,
        membershipStatus,
        latestMembership: latestMembership || null,
      }
    });
  } catch (error) {
    console.error('Update member error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 