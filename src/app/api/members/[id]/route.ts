import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { debug } from '@/lib/debug';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    debug('Fetching member details', { data: { memberId: params.id } });

    const member = await prisma.member.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        gymId: true,
        memberships: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            amount: true,
            status: true,
          },
          orderBy: {
            startDate: 'desc',
          },
        },
        attendances: {
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
          },
          orderBy: {
            checkIn: 'desc',
          },
          take: 50, // Limit to last 50 attendance records
        },
      },
    });

    if (!member) {
      debug('Member not found', { level: 'warn', data: { memberId: params.id } });
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    debug('Successfully fetched member details', { data: { memberId: params.id } });

    return NextResponse.json({ member });
  } catch (error) {
    debug('Error fetching member details', { level: 'error', data: error });
    return NextResponse.json(
      { error: 'Failed to fetch member details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    debug('Updating member', { data: { memberId: params.id } });
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

    // Check if email is already in use by another member in the same gym
    const existingMember = await prisma.member.findFirst({
      where: {
        email: body.email,
        gymId: body.gymId,
        NOT: {
          id: params.id,
        },
      },
    });

    if (existingMember) {
      debug('Email already in use by another member in this gym', {
        level: 'warn',
        data: { email: body.email, gymId: body.gymId },
      });
      return NextResponse.json(
        { error: 'Email already in use by another member in this gym' },
        { status: 400 }
      );
    }

    // Update member
    const member = await prisma.member.update({
      where: { id: params.id },
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

    debug('Successfully updated member', { data: { memberId: member.id } });

    return NextResponse.json({ member });
  } catch (error) {
    debug('Error updating member', { level: 'error', data: error });
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    debug('Deleting member', { data: { memberId: params.id } });

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: params.id },
      include: {
        memberships: true,
        attendances: true,
      },
    });

    if (!member) {
      debug('Member not found', { level: 'warn', data: { memberId: params.id } });
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Delete related records first
    if (member.memberships.length > 0) {
      await prisma.membership.deleteMany({
        where: { memberId: params.id },
      });
    }

    if (member.attendances.length > 0) {
      await prisma.attendance.deleteMany({
        where: { memberId: params.id },
      });
    }

    // Delete member
    await prisma.member.delete({
      where: { id: params.id },
    });

    debug('Successfully deleted member', { data: { memberId: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    debug('Error deleting member', { level: 'error', data: error });
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
} 