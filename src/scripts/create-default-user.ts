import { db } from '../lib/db';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

async function createDefaultUser() {
  try {
    const email = 'kk@gmail.com';
    const password = 'kk';

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('Default user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name: 'KK',
        hashedPassword,
        role: UserRole.ADMIN
      }
    });

    console.log('Default user created:', user.email);
  } catch (error) {
    console.error('Error creating default user:', error);
  } finally {
    await db.$disconnect();
  }
}

createDefaultUser();
