const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const initialBanners = [
    {
      badge: "YENİ KOLEKSİYON 2026",
      title: "Modern Yaşamın Yeni Estetiği",
      sub: "İnegöl'ün 30 yıllık mobilya mirasını modern tasarımlarla evinizle buluşturuyoruz.",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2000",
      link: "/products",
      linkText: "Koleksiyonu Keşfet",
      order: 1,
      isActive: true
    },
    {
      badge: "ÖZEL KAMPANYA",
      title: "Yaşam Alanınıza Değer Katın",
      sub: "Sezonun en seçkin tasarımlarında %20'ye varan özel indirim fırsatları.",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=2000",
      link: "/products?cat=yatak",
      linkText: "İncele",
      order: 2,
      isActive: true
    },
    {
      badge: "ÖZEL TEKLİF",
      title: "Rüya Gibi Düğün Paketleri",
      sub: "Evinizin ihtiyacı olan her şey tek bir pakette, avantajlı fiyatlarla sizi bekliyor.",
      image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2000",
      link: "/products?cat=dugun",
      linkText: "Paketleri Keşfet",
      order: 3,
      isActive: true
    }
  ]

  console.log('Bannerlar veritabanına aktarılıyor...')

  for (const banner of initialBanners) {
    await prisma.banner.create({
      data: banner
    })
  }

  console.log('Başarıyla tamamlandı!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
