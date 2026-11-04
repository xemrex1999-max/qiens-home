import React from 'react'
import prisma from '@/lib/prisma'
import BannerTableClient from '@/components/admin/BannerTableClient'

export const dynamic = 'force-dynamic'

async function getBanners() {
  return await prisma.banner.findMany({
    orderBy: { order: 'asc' }
  })
}

export default async function AdminBannersPage() {
  const banners = await getBanners()

  return (
    <BannerTableClient initialBanners={JSON.parse(JSON.stringify(banners))} />
  )
}
