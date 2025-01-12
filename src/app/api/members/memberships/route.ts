export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// This is how membershipStatus is typically calculated on the server

const calculateMembershipStatus = (latestMembership: any | null): 'NONE' | 'EXPIRED' | 'ACTIVE' => {
  if (!latestMembership) {
    return 'NONE';
  }

  const endDate = new Date(latestMembership.endDate);
  const now = new Date();

  if (endDate < now) {
    return 'EXPIRED';
  }

  return 'ACTIVE';
};

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

    // Transform the data to include membership status
    const membersWithStatus = members.map(member => ({
      ...member,
      latestMembership: member.memberships[0] || null,
      membershipStatus: calculateMembershipStatus(member.memberships[0]),
      memberships: undefined  // Remove the memberships array
    }));

    // Sort members: EXPIRED first, then NONE, then ACTIVE
    const sortedMembers = membersWithStatus.sort((a, b) => {
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