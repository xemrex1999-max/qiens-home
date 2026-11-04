import React from 'react'
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // ROLE PROTECTION
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/')
  }

  return (
    <AdminLayoutClient session={session}>
      {children}
    </AdminLayoutClient>
  )
}
