import { verifyAuth } from '@/lib/jwt';
import { db } from '@/lib/db';
import { MembershipPlanSchema } from '@/schemas';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const routeContextSchema = z.object({
  params: z.object({
    planId: z.string()
  })
});

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const verifiedToken = await verifyAuth(token);
    if (!verifiedToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { params } = routeContextSchema.parse(context);

    const json = await req.json();
    const body = MembershipPlanSchema.partial().parse(json);

    const plan = await db.membershipPlan.update({
      where: {
        id: params.planId,
        gymId: verifiedToken.user.id
      },
      data: {
        name: body.name,
        description: body.description,
        duration: body.duration,
        price: body.price,
        features: body.features,
        isActive: body.isActive
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

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { params } = routeContextSchema.parse(context);

    const plan = await db.membershipPlan.delete({
      where: {
        id: params.planId,
        gymId: session.user.id
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

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { params } = routeContextSchema.parse(context);

    const plan = await db.membershipPlan.findUnique({
      where: {
        id: params.planId,
        gymId: session.user.id
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
