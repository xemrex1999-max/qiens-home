import React from 'react'
import prisma from '@/lib/prisma'
import AdminOrdersClient from '@/components/admin/AdminOrdersClient'

export const dynamic = 'force-dynamic'

async function getOrders() {
  return await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true }
      },
      items: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  return <AdminOrdersClient initialOrders={JSON.parse(JSON.stringify(orders))} />
}
