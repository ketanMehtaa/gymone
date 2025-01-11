import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.gymId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return new NextResponse('Missing search query', { status: 400 });
    }

    const currentDate = new Date();

    const members = await prisma.member.findMany({
      where: {
        gymId: payload.gymId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        memberships: {
          orderBy: {
            endDate: 'desc',
          },
          take: 1,
        },
      },
    });

    // Process all members and include their membership status
    const processedMembers = members.map(member => ({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      status: member.status,
      memberships: member.memberships,
    }));

    return NextResponse.json(processedMembers);
  } catch (error) {
    console.error('Member search error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 