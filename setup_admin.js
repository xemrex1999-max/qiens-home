const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Mevcut kullanicilari listele
  const users = await prisma.user.findMany();
  console.log('Mevcut kullanicilar:', JSON.stringify(users, null, 2));

  // xemrex1999@hotmail.com yoksa olustur
  const existingUser = await prisma.user.findUnique({
    where: { email: 'xemrex1999@hotmail.com' }
  });

  if (!existingUser) {
    const hash = await bcrypt.hash('Evseren2026!', 10);
    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'xemrex1999@hotmail.com',
        password: hash,
        role: 'admin'
      }
    });
    console.log('Admin kullanicisi olusturuldu:', user.id);
  } else {
    // Sifreyi guncelle
    const hash = await bcrypt.hash('Evseren2026!', 10);
    await prisma.user.update({
      where: { email: 'xemrex1999@hotmail.com' },
      data: { password: hash, role: 'admin' }
    });
    console.log('Admin sifresi guncellendi, role: admin');
  }
}

main()
  .catch(e => console.error('HATA:', e.message))
  .finally(() => prisma.$disconnect());
