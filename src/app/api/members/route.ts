import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/jwt';

export async function GET(req: Request) {
  try {
    // Verify authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const verifiedToken = await verifyAuth(token);
    if (!verifiedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all members
    const members = await db.member.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('[MEMBERS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Verify authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const verifiedToken = await verifyAuth(token);
    if (!verifiedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      phone,
      address,
      membershipType,
      membershipStatus,
      startDate,
      endDate
    } = body;

    // Create new member
    const member = await db.member.create({
      data: {
        name,
        email,
        phone,
        address,
        membershipType,
        membershipStatus,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('[MEMBERS_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
