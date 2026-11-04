import React from 'react'
import prisma from '@/lib/prisma'
import CategoryTableClient from '@/components/admin/CategoryTableClient'

export const dynamic = 'force-dynamic'

async function getHomeCategories() {
  return await prisma.homeCategory.findMany({
    orderBy: { order: 'asc' }
  })
}

export default async function AdminHomeCategoriesPage() {
  const categories = await getHomeCategories()

  return (
    <CategoryTableClient initialCategories={JSON.parse(JSON.stringify(categories))} />
  )
}
