import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
        firstName: 'ketan',
        lastName: 'mehta',
        email: 'meetketanmehta@gmail.com',
        password: '9412533733',
      },
    });

    console.log('Super admin created successfully:');
    console.log('Email:', superAdmin.email);
    console.log('Password: 9412533733');
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });