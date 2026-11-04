// @ts-nocheck
import "dotenv/config"
import { PrismaClient } from '@prisma/client'

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  console.error("ERROR: DATABASE_URL is not defined in environment!")
  process.exit(1)
}
// Force the process environment to have the URL
process.env.DATABASE_URL = dbUrl
console.log(`Using Database: ${dbUrl.split('@')[1] || 'Unknown'}`)
const prisma = new PrismaClient()

const products = [
  { name: "Ayça Yatak Odası", slug: "ayca-yatak-odasi", price: 75600, category: "Yatak Odası", description: "Ayça Serisi - 2026 Model Premium Yatak Odası Takımı. Konfor ve şıklığı bir arada sunar." },
  { name: "Ayça Yemek Odası", slug: "ayca-yemek-odasi", price: 71400, category: "Yemek Odası", description: "Ayça Serisi - Modern ve estetik yemek odası takımı. Sevdiklerinizle en güzel anlar için." },
  { name: "Buğlem Yatak Odası", slug: "buglem-yatak-odasi", price: 78400, category: "Yatak Odası", description: "Buğlem Serisi - Zarafetin ve kalitenin buluşma noktası." },
  { name: "Buğlem Yemek Odası", slug: "buglem-yemek-odasi", price: 72800, category: "Yemek Odası", description: "Buğlem Serisi - Şık tasarımıyla salonunuza renk katacak yemek odası takımı." },
  { name: "Tokyo Yatak Odası", slug: "tokyo-yatak-odasi", price: 77000, category: "Yatak Odası", description: "Tokyo Serisi - Modern çizgileri ve fonksiyonel yapısıyla yeni nesil yatak odası." },
  { name: "Tokyo Yemek Odası", slug: "tokyo-yemek-odasi", price: 60900, category: "Yemek Odası", description: "Tokyo Serisi - Sade ve şık tasarımıyla huzurlu yemekler için ideal seçim." },
  { name: "İnci Yatak Odası", slug: "inci-yatak-odasi", price: 70000, category: "Yatak Odası", description: "İnci Serisi - Klasik ve modernin mükemmel uyumu." },
  { name: "İnci Yemek Odası", slug: "inci-yemek-odasi", price: 58800, category: "Yemek Odası", description: "İnci Serisi - Estetik ve dayanıklılığı bir araya getiren yemek odası takımı." }
].map(p => ({
    ...p,
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"],
    stock: 10
}))

async function main() {
  console.log('Seeding started...')
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
