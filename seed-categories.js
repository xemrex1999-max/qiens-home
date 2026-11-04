const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const categories = [
    { 
      name: "Düğün Paketleri", 
      slug: "dugun", 
      image: "/images/dugun_paketi.png",
      desc: "Komple Ev Mobilyası",
      order: 1,
      isActive: true
    },
    { 
      name: "Yatak Odası", 
      slug: "yatak", 
      image: "/images/yatak_odasi.png",
      desc: "Lüks Dinlenme",
      order: 2,
      isActive: true
    },
    { 
      name: "Yemek Odası", 
      slug: "yemek", 
      image: "/images/yemek_odasi.png",
      desc: "Şık Sofra",
      order: 3,
      isActive: true
    },
    { 
      name: "Koltuk Takımı", 
      slug: "koltuk", 
      image: "/images/koltuk_takimi.png",
      desc: "Konforlu Oturma",
      order: 4,
      isActive: true
    },
    { 
      name: "Köşe Takımı", 
      slug: "kose", 
      image: "/images/kose_takimi.png",
      desc: "Geniş Alan",
      order: 5,
      isActive: true
    }
  ]

  console.log('Kategoriler veritabanına aktarılıyor...')

  for (const cat of categories) {
    await prisma.homeCategory.create({
      data: cat
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
