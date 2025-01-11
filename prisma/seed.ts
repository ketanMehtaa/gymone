import { PrismaClient, MemberStatus, MembershipStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create Admin
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@gymone.com',
      password: 'admin123',
      firstName: 'John',
      lastName: 'Doe',
    },
  })

  // Create Gym
  const gym = await prisma.gym.create({
    data: {
      name: 'GymOne Fitness Center',
      address: '123 Fitness Street, Exercise City',
      phone: '+1234567890',
      email: 'contact@gymone.com',
      adminId: admin.id,
    },
  })

  // Create Staff Members
  const staffMembers = await Promise.all([
    prisma.staff.create({
      data: {
        email: 'staff1@gymone.com',
        password: 'staff123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        gymId: gym.id,
      },
    }),
    prisma.staff.create({
      data: {
        email: 'staff2@gymone.com',
        password: 'staff123',
        firstName: 'Michael',
        lastName: 'Smith',
        gymId: gym.id,
      },
    }),
  ])

  // Create 10 Members with active memberships
  const members = []
  const memberData = [
    { firstName: 'Emma', lastName: 'Wilson', email: 'emma@example.com', phone: '1234567001' },
    { firstName: 'James', lastName: 'Brown', email: 'james@example.com', phone: '1234567002' },
    { firstName: 'Olivia', lastName: 'Davis', email: 'olivia@example.com', phone: '1234567003' },
    { firstName: 'William', lastName: 'Miller', email: 'william@example.com', phone: '1234567004' },
    { firstName: 'Sophia', lastName: 'Anderson', email: 'sophia@example.com', phone: '1234567005' },
    { firstName: 'Lucas', lastName: 'Taylor', email: 'lucas@example.com', phone: '1234567006' },
    { firstName: 'Ava', lastName: 'Thomas', email: 'ava@example.com', phone: '1234567007' },
    { firstName: 'Henry', lastName: 'Jackson', email: 'henry@example.com', phone: '1234567008' },
    { firstName: 'Isabella', lastName: 'White', email: 'isabella@example.com', phone: '1234567009' },
    { firstName: 'Jack', lastName: 'Harris', email: 'jack@example.com', phone: '1234567010' },
  ]

  for (const data of memberData) {
    const member = await prisma.member.create({
      data: {
        ...data,
        status: MemberStatus.ACTIVE,
        gymId: gym.id,
      },
    })

    // Create an active membership for each member
    await prisma.membership.create({
      data: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        amount: 50.00,
        status: MembershipStatus.ACTIVE,
        memberId: member.id,
        gymId: gym.id,
        staffId: staffMembers[0].id, // First staff member creates the memberships
      },
    })

    members.push(member)
  }

  console.log({
    admin: { id: admin.id, email: admin.email },
    gym: { id: gym.id, name: gym.name },
    staffCount: staffMembers.length,
    memberCount: members.length,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
