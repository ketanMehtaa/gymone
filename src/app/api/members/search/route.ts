import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    console.log('Received search query:', query);

    if (!query) {
      console.log('No search query provided');
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    console.log('Searching for members with query:', query);
    const members = await prisma.member.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        memberships: {
          where: {
            AND: [
              { status: 'ACTIVE' },
              { endDate: { gte: new Date() } }
            ]
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            amount: true,
            status: true,
          },
          orderBy: {
            endDate: 'desc'
          }
        },
      },
      orderBy: {
        firstName: 'asc'
      },
      take: 10,
    });

    console.log('Search results:', JSON.stringify(members, null, 2));

    return NextResponse.json(members);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search members' },
      { status: 500 }
    );
  }
} 