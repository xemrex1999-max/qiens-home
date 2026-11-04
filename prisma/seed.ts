import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- EMREBLC Unique Branding Seeding Started ---')

  // 1. CLEANUP
  await prisma.review.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.banner.deleteMany({})
  await prisma.homeCategory.deleteMany({})

  // 2. BANNERS (Premium & Editorial)
  await prisma.banner.createMany({
    data: [
      {
        badge: "EXCLUSIVELY QIENS",
        title: "Sanatla Yoğrulmuş Yaşam Alanları",
        sub: "İnegöl'ün derin mobilya kültürünü, modern sanatın estetiğiyle harmanlayarak evlerinize taşıyoruz.",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=2000",
        link: "/products",
        order: 1
      },
      {
        badge: "MIRAS KOLEKSIYONU",
        title: "Nesilden Nesile Bir Hikaye",
        sub: "Sadece mobilya değil, otuz yıllık bir tecrübenin ve el ustalığının en saf halini vadediyoruz.",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000",
        link: "/products",
        order: 2
      }
    ]
  })

  // 3. HOME CATEGORIES
  await prisma.homeCategory.createMany({
    data: [
      { 
        name: "Miras Serisi", 
        slug: "yatak", 
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
        desc: "Yatak Odasında Görkem",
        order: 1
      },
      { 
        name: "Ziyafet Konsepti", 
        slug: "yemek", 
        image: "https://images.unsplash.com/photo-1617806118233-bcbe87af24fc?auto=format&fit=crop&q=80&w=800",
        desc: "Yemek Odasında Modernite",
        order: 2
      },
      { 
        name: "Kadife Dokunuşlar", 
        slug: "koltuk", 
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
        desc: "Sofa Gruplarında Konfor",
        order: 3
      },
      { 
        name: "Qiens Seçkileri", 
        slug: "dugun", 
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
        desc: "Komple Ev Paketleri",
        order: 4
      }
    ]
  })

  // 4. PRODUCTS (12 Unique Models)
  const products = [
    // YATAK ODASI
    {
      name: "Qiens Safir Yatak Odası",
      slug: "qiens-safir-yatak",
      price: 125000,
      oldPrice: 155000,
      category: "Yatak Odası",
      description: "Safir mavisi detaylar ve altın varakların kusursuz uyumuyla tasarlanan, markamızın imza ürünü.",
      images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"],
      stock: 3,
      isFeatured: true,
      tags: ["imza", "yatak odası", "safir"],
      threeDModelUrl: "/models/SheenWoodLeatherSofa.glb",
      colors: ["Safir Mavi", "Zümrüt Yeşili", "Antrasit", "Krem"]
    },
    {
      name: "İnce Çizgi Ceviz Set",
      slug: "ince-cizgi-ceviz",
      price: 95000,
      category: "Yatak Odası",
      description: "Doğal ceviz dokusunun minimalist hatlarla birleştiği, huzur veren bir tasarım.",
      images: ["https://images.unsplash.com/photo-1505693333534-7d9bb2223466?auto=format&fit=crop&q=80&w=800"],
      stock: 10,
      isFeatured: false,
      tags: ["ceviz", "minimalist", "yatak"],
      threeDModelUrl: "/models/SheenWoodLeatherSofa.glb",
      colors: ["Ceviz", "Doğal Meşe", "Mat Siyah"]
    },
    {
      name: "Kristal Gece Takımı",
      slug: "kristal-gece",
      price: 142000,
      category: "Yatak Odası",
      description: "Ayna detayları ve LED aydınlatmalarıyla odaya derinlik katan lüks konsept.",
      images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800"],
      stock: 4,
      isFeatured: true,
      tags: ["kristal", "lüks", "yatak"],
      threeDModelUrl: "/models/SheenWoodLeatherSofa.glb",
      colors: ["Beyaz Mermer", "Safir Mavi", "Antrasit"]
    },

    // YEMEK ODASI
    {
      name: "Floransa Mermer Masa",
      slug: "floransa-mermer-masa",
      price: 54000,
      category: "Yemek Odası",
      description: "Gerçek İtalyan mermeri ve titan ayakların modern birleşimi.",
      images: ["https://images.unsplash.com/photo-1617806118233-bcbe87af24fc?auto=format&fit=crop&q=80&w=800"],
      stock: 15,
      isFeatured: true,
      tags: ["yemek", "mermer", "modern"],
      threeDModelUrl: "/models/SheenWoodLeatherSofa.glb",
      colors: ["Beyaz Mermer", "Siyah Portoro", "Gri Carrara"]
    },
    {
      name: "Nordik Meşe Yemek Odası",
      slug: "nordik-mese-yemek",
      price: 48500,
      category: "Yemek Odası",
      description: "Sadelik ve fonksiyonelliği ön planda tutan, el yapımı meşe detaylar.",
      images: ["https://images.unsplash.com/photo-1530018607912-eff2dea11a78?auto=format&fit=crop&q=80&w=800"],
      stock: 8,
      isFeatured: false,
      tags: ["yemek", "nordik", "meşe"],
      threeDModelUrl: "/models/SheenWoodLeatherSofa.glb",
      colors: ["Doğal Meşe", "Koyu Ceviz", "Açık Ceviz"]
    },
    {
      name: "Antrasit Elit Konsol",
      slug: "antrasit-elit-konsol",
      price: 22000,
      category: "Yemek Odası",
      description: "Mat antrasit gövde ve bakır kulplarla hareketlendirilmiş depolama birimi.",
      images: ["https://images.unsplash.com/photo-1595428774223-ef52624120ec?auto=format&fit=crop&q=80&w=800"],
      stock: 20,
      isFeatured: false,
      tags: ["konsol", "antrasit", "yemek"],
      threeDModelUrl: "/models/SheenChair.glb",
      colors: ["Antrasit", "Mat Siyah", "Altın Detaylı Beyaz"]
    },

    // KOLTUK TAKIMI
    {
      name: "Zümrüt Derin Koltuk",
      slug: "zumrut-derin-koltuk",
      price: 88000,
      oldPrice: 110000,
      category: "Koltuk Takımları",
      description: "Geniş oturum alanı ve zümrüt yeşili kadife dokusuyla konforun zirvesi.",
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"],
      stock: 6,
      isFeatured: true,
      tags: ["koltuk", "kadife", "yeşil"],
      threeDModelUrl: "/models/GlamVelvetSofa.glb",
      colors: ["Zümrüt Yeşili", "Safir Mavi", "Antrasit", "Krem", "Kiremit"]
    },
    {
      name: "Bulut Köşe Takımı",
      slug: "bulut-kose-takimi",
      price: 67000,
      category: "Koltuk Takımları",
      description: "Yumuşacık dokusu ve modüler yapısıyla her alana uyum sağlayan konsept.",
      images: ["https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800"],
      stock: 12,
      isFeatured: true,
      tags: ["köşe takımı", "bulut", "gri"],
      threeDModelUrl: "/models/GlamVelvetSofa.glb",
      colors: ["Bulut Gri", "Krem", "Bej", "Antrasit"]
    },
    {
      name: "Terra Deri Berjer",
      slug: "terra-deri-berjer",
      price: 18500,
      category: "Koltuk Takımları",
      description: "Hakiki deri ve ceviz ayaklı, vintage görünümlü tekli koltuk.",
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"],
      stock: 5,
      isFeatured: false,
      tags: ["berjer", "deri", "vintage"],
      threeDModelUrl: "/models/SheenChair.glb",
      colors: ["Kaba Taba Deri", "Mat Siyah Deri", "Antik Kahve", "Haki Yeşil"]
    },

    // DÜĞÜN PAKETLERİ
    {
      name: "Qiens İmparator Paketi",
      slug: "qiens-imparator-paketi",
      price: 285000,
      oldPrice: 380000,
      category: "Düğün Paketleri",
      description: "Safir Yatak Odası, Floransa Yemek Odası ve Zümrüt Koltuk Takımı'ndan oluşan görkemli paket.",
      images: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"],
      stock: 2,
      isFeatured: true,
      tags: ["paket", "imparator", "lüks"],
      threeDModelUrl: "/models/GlamVelvetSofa.glb",
      colors: ["Zümrüt Yeşili", "Safir Mavi", "Bulut Gri", "Antrasit"]
    },
    {
      name: "Modern Başlangıç Paketi",
      slug: "modern-baslangic-paketi",
      price: 175000,
      category: "Düğün Paketleri",
      description: "Minimalist çizgiler ve fonksiyonelliği bir araya getiren, yeni evli çiftlere özel seçki.",
      images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"],
      stock: 5,
      isFeatured: true,
      tags: ["paket", "modern", "başlangıç"],
      threeDModelUrl: "/models/SheenWoodLeatherSofa.glb",
      colors: ["Bulut Gri", "Antrasit", "Krem"]
    },
    {
      name: "Venedik Klasik Paket",
      slug: "venedik-klasik-paket",
      price: 215000,
      category: "Düğün Paketleri",
      description: "Zamanın ötesinde bir şıklık arayanlar için Venedik asaletini yansıtan tam set.",
      images: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2000"],
      stock: 3,
      isFeatured: false,
      tags: ["paket", "venedik", "klasik"],
      threeDModelUrl: "/models/SheenWoodLeatherSofa.glb",
      colors: ["Krem", "Bej", "Antrasit", "Safir Mavi"]
    }
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log('--- EMREBLC Unique Branding Seeding Finished Successfully ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
