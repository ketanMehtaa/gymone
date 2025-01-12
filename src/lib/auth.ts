import { jwtVerify, SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';
import { debug } from '@/lib/debug';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

interface LoginResponse {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF' | 'SUPER_ADMIN';
  gymId?: string;
}

export async function signToken(payload: any) {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);
  } catch (error) {
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function loginUser(email: string, password: string, role: 'ADMIN' | 'STAFF' | 'SUPER_ADMIN'): Promise<LoginResponse | null> {
  try {
    console.log('Login attempt:', { email, role });
    
    if (!role) {
      console.error('Role is undefined');
      return null;
    }

    if (role === 'SUPER_ADMIN') {
      // Debug: Check all super admins
      const allSuperAdmins = await prisma.superAdmin.findMany();
      console.log('All super admins:', JSON.stringify(allSuperAdmins, null, 2));

      const superAdmin = await prisma.superAdmin.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          password: true,
        }
      });

      console.log('Login attempt details:', {
        providedEmail: email,
        providedPassword: password,
        foundSuperAdmin: superAdmin,
        passwordMatch: superAdmin ? superAdmin.password === password : false
      });
      
      if (superAdmin && superAdmin.password === password) {
        return {
          id: superAdmin.id,
          email: superAdmin.email,
          name: `${superAdmin.firstName} ${superAdmin.lastName}`,
          role: 'SUPER_ADMIN',
        };
      }
    } else if (role === 'ADMIN') {
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

      if (admin && admin.password === password) {
        return {
          id: admin.id,
          email: admin.email,
          name: `${admin.firstName} ${admin.lastName}`,
          role: 'ADMIN',
          gymId: admin.gym?.id
        };
      }
    } else {
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

      if (staff && staff.password === password && staff.isActive) {
        return {
          id: staff.id,
          email: staff.email,
          name: `${staff.firstName} ${staff.lastName}`,
          role: 'STAFF',
          gymId: staff.gymId
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
} 