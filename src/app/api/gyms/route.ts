import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { debug } from '@/lib/debug';

export async function GET() {
  try {
    debug('Fetching all gyms');

    const gyms = await prisma.gym.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    debug('Successfully fetched gyms', { data: { count: gyms.length } });

    return NextResponse.json({ gyms });
  } catch (error) {
    debug('Error fetching gyms', { level: 'error', data: error });
    return NextResponse.json(
      { error: 'Failed to fetch gyms' },
      { status: 500 }
    );
  }
} 