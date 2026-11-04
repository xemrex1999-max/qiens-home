import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- DB PRODUCT CHECK ---')
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true }
  })
  console.log('Products in DB:', JSON.stringify(products, null, 2))

  console.log('\n--- DB USER CHECK ---')
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true }
  })
  console.log('Users in DB:', JSON.stringify(users, null, 2))
  
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
