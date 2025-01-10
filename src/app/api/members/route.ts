import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { debug } from '@/lib/debug';

export async function GET() {
  try {
    debug('Fetching all members');

    const members = await prisma.member.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    debug('Successfully fetched members', { data: { count: members.length } });

    return NextResponse.json({ members });
  } catch (error) {
    debug('Error fetching members', { level: 'error', data: error });
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    debug('Creating new member');
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'status', 'gymId'];
    const missingFields = requiredFields.filter(field => !(field in body));

    if (missingFields.length > 0) {
      debug('Missing required fields', { level: 'warn', data: { missingFields } });
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if email is already in use in the same gym
    const existingMember = await prisma.member.findUnique({
      where: {
        email_gymId: {
          email: body.email,
          gymId: body.gymId,
        },
      },
    });

    if (existingMember) {
      debug('Email already in use in this gym', { 
        level: 'warn', 
        data: { email: body.email, gymId: body.gymId } 
      });
      return NextResponse.json(
        { error: 'Email already in use in this gym' },
        { status: 400 }
      );
    }

    // Create new member
    const member = await prisma.member.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        status: body.status,
        gym: {
          connect: {
            id: body.gymId,
          },
        },
      },
    });

    debug('Successfully created member', { data: { memberId: member.id } });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    debug('Error creating member', { level: 'error', data: error });
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
} 