const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await prisma.superAdmin.findFirst();
    if (existingSuperAdmin) {
      console.log('Super admin already exists');
      return;
    }

    // Create super admin with default values
    const superAdmin = await prisma.superAdmin.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'super@admin.com',
        password: 'admin123',
      },
    });

    console.log('Super admin created successfully:');
    console.log('Email:', superAdmin.email);
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 