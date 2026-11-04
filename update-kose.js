const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Kategori güncelleniyor: Köşe Koltuk Takımı')
  
  // Önce 'kose' slug'lı olanı 'Köşe Koltuk Takımı' yapalım
  await prisma.homeCategory.updateMany({
    where: { slug: 'kose' },
    data: { 
      name: 'Köşe Koltuk Takımı',
      desc: 'Modern Köşe Konforu'
    }
  })

  // Eğer veritabanında hiç yoksa (0 etkilenen satır varsa) yeni eklemiş olurduk ama 
  // zaten seed ile 'kose' eklemiştik.
  
  console.log('Başarıyla güncellendi!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
