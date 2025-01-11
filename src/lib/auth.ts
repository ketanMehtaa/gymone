import { jwtVerify, SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';
import { debug } from '@/lib/debug';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

interface LoginResponse {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF';
  gymId?: string;
}

export async function signToken(payload: any) {
  try {
    // debug('Creating JWT token', { data: { userId: payload.id, role: payload.role }});
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);
  } catch (error) {
    // debug('Error signing JWT token', { level: 'error', data: error });
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    // debug('Verifying JWT token');
    const { payload } = await jwtVerify(token, secret);
    // debug('Token verified successfully', { data: { userId: payload.id, role: payload.role }});
    return payload;
  } catch (error) {
    // debug('Token verification failed', { level: 'error', data: error });
    return null;
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse | null> {
  try {
    debug('Attempting to find admin', { data: { email }});
    // Check admin first
    const admin = await prisma.admin.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        gym: {
          select: {
            id: true
          }
        }
      }
    });

    if (admin) {
      // debug('Admin found, verifying password');
      if (admin.password === password) {
        // debug('Admin password verified');
        return {
          id: admin.id,
          email: admin.email,
          name: `${admin.firstName} ${admin.lastName}`,
          role: 'ADMIN',
          gymId: admin.gym?.id
        };
      }
      // debug('Admin password invalid');
    }

    debug('Attempting to find staff', { data: { email }});
    // If not admin, check staff
    const staff = await prisma.staff.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        isActive: true,
        gymId: true
      }
    });

    if (staff && staff.isActive) {
      // debug('Active staff found, verifying password');
      if (staff.password === password) {
        // debug('Staff password verified');
        return {
          id: staff.id,
          email: staff.email,
          name: `${staff.firstName} ${staff.lastName}`,
          role: 'STAFF',
          gymId: staff.gymId
        };
      }
      // debug('Staff password invalid');
    } else if (staff) {
      // debug('Inactive staff account attempted login', { level: 'warn', data: { email }});
    }

    // debug('No valid user found', { level: 'warn', data: { email }});
    return null;
  } catch (error) {
    // debug('Error during login', { level: 'error', data: error });
    throw error;
  }
} 