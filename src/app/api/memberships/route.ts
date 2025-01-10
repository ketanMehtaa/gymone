import { verifyAuth } from '@/lib/jwt';
import { db } from '@/lib/db';
import { MembershipPlanSchema } from '@/schemas';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const verifiedToken = await verifyAuth(token);
    if (!verifiedToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = MembershipPlanSchema.parse(json);

    const plan = await db.membershipPlan.create({
      data: {
        name: body.name,
        description: body.description,
        duration: body.duration,
        price: body.price,
        features: body.features,
        isActive: body.isActive,
        gymId: verifiedToken.user.id
      }
    });

    return NextResponse.json(plan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    return new NextResponse(null, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const plans = await db.membershipPlan.findMany({
      where: {
        gymId: session.user.id
      },
      orderBy: {
        price: 'asc'
      }
    });

    return NextResponse.json(plans);
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
