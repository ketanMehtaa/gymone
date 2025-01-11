import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
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

    const currentDate = new Date();

    // Get all active members with their latest membership
    const members = await prisma.member.findMany({
      where: {
        status: 'ACTIVE',
        gymId: payload.gymId, // Only get members from the user's gym
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        memberships: {
          orderBy: {
            endDate: 'desc',
          },
          take: 1,
          select: {
            id: true,
            startDate: true,
            endDate: true,
            amount: true,
          },
        },
      },
    });

    // Process members to add membership status
    const processedMembers = members.map(member => {
      const latestMembership = member.memberships[0];
      let membershipStatus: 'NONE' | 'EXPIRED' | 'ACTIVE' = 'NONE';

      if (latestMembership) {
        membershipStatus = new Date(latestMembership.endDate) < currentDate ? 'EXPIRED' : 'ACTIVE';
      }

      return {
        ...member,
        latestMembership: member.memberships[0] || undefined,
        membershipStatus,
        memberships: undefined, // Remove the memberships array
      };
    });

    // Sort members: EXPIRED first, then NONE, then ACTIVE
    const sortedMembers = processedMembers.sort((a, b) => {
      const statusOrder = { 'EXPIRED': 0, 'NONE': 1, 'ACTIVE': 2 };
      return statusOrder[a.membershipStatus] - statusOrder[b.membershipStatus];
    });

    return NextResponse.json(sortedMembers);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
} 