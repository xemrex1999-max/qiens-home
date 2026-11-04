const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const email = 'xemrex1999@hotmail.com';
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('User not found. Check the email or database content.');
      // You might want to create the user here if needed, 
      // but let's just observe first.
      const allUsers = await prisma.user.findMany();
      console.log('Available users:', allUsers.map(u => u.email));
    } else {
      console.log('User found:', user.email, 'Role:', user.role);
      if (user.role !== 'admin') {
        console.log('Updating user to admin...');
        await prisma.user.update({
          where: { email },
          data: { role: 'admin' }
        });
        console.log('User updated to admin.');
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
