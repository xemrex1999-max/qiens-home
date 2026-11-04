const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'xemrex1999@hotmail.com';
  const hashedPassword = await bcrypt.hash('Evseren2026!', 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: 'admin',
        password: hashedPassword,
        name: 'Emre Balcı'
      },
      create: {
        email,
        name: 'Emre Balcı',
        password: hashedPassword,
        role: 'admin'
      }
    });
    console.log('Admin user successfully seeded:', user.email);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
