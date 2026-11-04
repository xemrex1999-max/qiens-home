
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const email = 'xemrex1999@hotmail.com';
  const user = await prisma.user.findFirst({
    where: { 
      OR: [
        { email },
        { name: { contains: 'Emre' } }
      ]
    }
  });

  if (!user) {
    console.error('Kullanıcı bulunamadı: ' + email);
    return;
  }

  const lastOrder = await prisma.order.findFirst({
    where: { userId: null },
    orderBy: { createdAt: 'desc' }
  });

  if (!lastOrder) {
    console.log('Bağlanacak sahipsiz sipariş bulunamadı.');
    return;
  }

  await prisma.order.update({
    where: { id: lastOrder.id },
    data: { userId: user.id }
  });

  console.log(`Sipariş ${lastOrder.id} başarıyla kullanıcı ${user.name} (${user.email}) hesabına bağlandı.`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
