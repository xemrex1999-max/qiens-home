import React from 'react'
import prisma from '@/lib/prisma'
import ProductTableClient from '@/components/admin/ProductTableClient'

export const dynamic = 'force-dynamic'

async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <ProductTableClient initialProducts={JSON.parse(JSON.stringify(products))} />
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
