import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gym.com' },
    update: {},
    create: {
      email: 'admin@gym.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Create dummy members
  const members = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St',
      membershipStatus: 'ACTIVE',
      membershipType: 'PREMIUM',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      address: '456 Oak Ave',
      membershipStatus: 'ACTIVE',
      membershipType: 'BASIC',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '5555555555',
      address: '789 Pine Rd',
      membershipStatus: 'INACTIVE',
      membershipType: 'BASIC',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '4444444444',
      address: '321 Elm St',
      membershipStatus: 'ACTIVE',
      membershipType: 'PREMIUM',
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 180 days from now
    },
    {
      name: 'David Brown',
      email: 'david@example.com',
      phone: '3333333333',
      address: '654 Maple Dr',
      membershipStatus: 'ACTIVE',
      membershipType: 'BASIC',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '2222222222',
      address: '987 Cedar Ln',
      membershipStatus: 'ACTIVE',
      membershipType: 'PREMIUM',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    },
    {
      name: 'Chris Taylor',
      email: 'chris@example.com',
      phone: '1111111111',
      address: '741 Birch Rd',
      membershipStatus: 'PENDING',
      membershipType: 'BASIC',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Starts in 7 days
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000)
    },
    {
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      phone: '9999999999',
      address: '852 Walnut St',
      membershipStatus: 'ACTIVE',
      membershipType: 'PREMIUM',
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    },
    {
      name: 'Tom Wilson',
      email: 'tom@example.com',
      phone: '8888888888',
      address: '963 Oak St',
      membershipStatus: 'ACTIVE',
      membershipType: 'BASIC',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      name: 'Amy Martinez',
      email: 'amy@example.com',
      phone: '7777777777',
      address: '159 Pine Ave',
      membershipStatus: 'ACTIVE',
      membershipType: 'PREMIUM',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    }
  ];

  for (const member of members) {
    await prisma.member.create({
      data: member
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
