export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

interface TokenPayload {
  id: string;
  role: 'ADMIN' | 'STAFF' | 'SUPER_ADMIN';
  gymId?: string;
}

const createGymSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  phone: z.string().min(1),
  adminFirstName: z.string().min(1),
  adminLastName: z.string().min(1),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await verifyToken(token)) as unknown as TokenPayload;
    if (!payload || payload.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createGymSchema.parse(body);

    // Check if gym email already exists
    const existingGym = await prisma.gym.findUnique({
      where: { email: validatedData.email },
    });

    if (existingGym) {
      return NextResponse.json(
        { error: 'A gym with this email already exists' },
        { status: 400 }
      );
    }

    // Check if admin email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: validatedData.adminEmail },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: 400 }
      );
    }

    // Create gym and admin in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      const gym = await prisma.gym.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          address: validatedData.address,
          phone: validatedData.phone,
          admin: {
            create: {
              firstName: validatedData.adminFirstName,
              lastName: validatedData.adminLastName,
              email: validatedData.adminEmail,
              password: validatedData.adminPassword,
            },
          },
        },
        include: {
          admin: true,
        },
      });

      return gym;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating gym:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await verifyToken(token)) as unknown as TokenPayload;
    // Allow SUPER_ADMIN, ADMIN, and STAFF roles to fetch gyms
    if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN' && payload.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If user is ADMIN or STAFF, only return their gym
    if ((payload.role === 'ADMIN' || payload.role === 'STAFF') && payload.gymId) {
      const gym = await prisma.gym.findUnique({
        where: { id: payload.gymId },
        include: {
          admin: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
      return NextResponse.json([gym]); // Return as array for consistency
    }

    // For SUPER_ADMIN, return all gyms
    const gyms = await prisma.gym.findMany({
      include: {
        admin: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(gyms);
  } catch (error) {
    console.error('Error fetching gyms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 