import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import {
  MemberStatus,
  PaymentStatus,
  PaymentMethod,
} from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
}

async function main() {
  console.log(`Start seeding ...`);
  
  // Clear all existing data
  await clearDatabase();

  // Create Admin
  const hashedPassword = await hash("admin123", 10);
  const admin = await prisma.admin.create({
    data: {
      email: "admin@gymone.com",
      password: hashedPassword,
      firstName: "John",
      lastName: "Doe",
    },
  });

  // Create Gym
  const gym = await prisma.gym.create({
    data: {
      name: "GymOne Fitness",
      address: "123 Fitness Street, Exercise City",
      phone: "1234567890",
      email: "contact@gymone.com",
      adminId: admin.id,
      totalRevenue: 0,
      totalMembers: 0,
    },
  });

  // Create 2 Staff Members
  const staff1 = await prisma.staff.create({
    data: {
      email: "staff1@gymone.com",
      password: await hash("staff123", 10),
      firstName: "Jane",
      lastName: "Smith",
      isActive: true,
      gymId: gym.id,
    },
  });

  const staff2 = await prisma.staff.create({
    data: {
      email: "staff2@gymone.com",
      password: await hash("staff123", 10),
      firstName: "Mike",
      lastName: "Johnson",
      isActive: true,
      gymId: gym.id,
    },
  });

  // Create 100 Members with Memberships, Payments, and Attendance
  const membershipTypes = [
    { name: "Basic", amount: 30 },
    { name: "Premium", amount: 50 },
    { name: "Elite", amount: 80 },
  ];

  for (let i = 1; i <= 100; i++) {
    const membershipType = membershipTypes[Math.floor(Math.random() * membershipTypes.length)];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    try {
      const member = await prisma.member.create({
        data: {
          firstName: `FirstName${i}`,
          lastName: `LastName${i}`,
          email: `member${i}@example.com`,
          phone: `123-456-${i.toString().padStart(4, '0')}`,
          status: MemberStatus.ACTIVE,
          gymId: gym.id,
        },
      });

      // Create membership separately
      const membership = await prisma.membership.create({
        data: {
          startDate,
          endDate,
          amount: membershipType.amount,
          status: PaymentStatus.ACTIVE,
          memberId: member.id,
          gymId: gym.id,
          staffId: i % 2 === 0 ? staff1.id : staff2.id,
        },
      });

      // Create payment for the membership
      await prisma.payment.create({
        data: {
          amount: membershipType.amount,
          method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.COMPLETED,
          membershipId: membership.id,
          gymId: gym.id,
        },
      });

      // Create random attendance records
      const attendanceCount = Math.floor(Math.random() * 10);
      for (let j = 0; j < attendanceCount; j++) {
        const checkIn = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const checkOut = new Date(checkIn.getTime() + Math.random() * 3 * 60 * 60 * 1000);

        await prisma.attendance.create({
          data: {
            memberId: member.id,
            gymId: gym.id,
            checkIn,
            checkOut,
            staffId: i % 2 === 0 ? staff1.id : staff2.id,
          },
        });
      }
    } catch (error) {
      console.error(`Error creating member ${i}:`, error);
      continue;
    }
  }

  // Update gym stats
  const totalMembers = await prisma.member.count({
    where: { gymId: gym.id },
  });

  const totalRevenue = await prisma.payment.aggregate({
    where: { gymId: gym.id },
    _sum: { amount: true },
  });

  await prisma.gym.update({
    where: { id: gym.id },
    data: {
      totalMembers,
      totalRevenue: totalRevenue._sum.amount || 0,
    },
  });

  console.log(`Database has been seeded. 🌱`);
  console.log(`Admin credentials: admin@gymone.com / admin123`);
  console.log(`Staff credentials: staff1@gymone.com / staff123`);
  console.log(`Staff credentials: staff2@gymone.com / staff123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
