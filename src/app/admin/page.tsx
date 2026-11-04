import React from 'react'
import Link from 'next/link'
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import prisma from '@/lib/prisma'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [orderCount, productCount, userCount, paidOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({
      where: { status: 'paid' },
      select: { totalPrice: true }
    })
  ])
  
  const totalRevenue = paidOrders.reduce((acc: number, order: { totalPrice: number }) => acc + order.totalPrice, 0)

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      totalPrice: true,
      status: true,
      createdAt: true,
      address: true
    }
  })

  return {
    orderCount,
    productCount,
    userCount,
    totalRevenue,
    recentOrders
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: 'Toplam Ciro', value: formatPrice(stats.totalRevenue), icon: TrendingUp, trend: '+12.5%', isUp: true },
    { label: 'Siparişler', value: stats.orderCount, icon: ShoppingCart, trend: '+5.2%', isUp: true },
    { label: 'Ürün Sayısı', value: stats.productCount, icon: Package, trend: '0%', isUp: true },
    { label: 'Kullanıcılar', value: stats.userCount, icon: Users, trend: '+2.4%', isUp: true },
  ]

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-neutral-900 uppercase">Özet Panel</h1>
          <p className="text-sm text-neutral-400 font-medium">Mağazanızın bugünkü performansına göz atın.</p>
        </div>
        <div className="px-6 py-3 bg-white border border-neutral-100 rounded-2xl text-xs font-bold text-neutral-600 shadow-sm">
          Son 30 Gün
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card) => (
          <div key={card.label} className="p-8 bg-white border border-neutral-100 rounded-[40px] shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <card.icon size={24} strokeWidth={1.5} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full",
                card.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                {card.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.trend}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{card.label}</p>
              <h3 className="text-2xl font-bold text-neutral-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* RECENT ORDERS */}
         <div className="p-10 bg-white border border-neutral-100 rounded-[40px] shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-neutral-900 italic tracking-tight">Son Siparişler</h3>
            <div className="space-y-4">
               {stats.recentOrders.length > 0 ? stats.recentOrders.map((order: any) => {
                 const addr = typeof order.address === 'string' ? JSON.parse(order.address) : (order.address as any);
                 return (
                   <div key={order.id} className="flex items-center justify-between py-4 border-b border-neutral-50 last:border-0">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-300 font-bold text-xs uppercase">
                           #{order.id.slice(-6)}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-neutral-900">{addr?.name || 'Müşteri'}</p>
                            <p className="text-[10px] text-neutral-400 capitalize">
                              {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: tr })}
                            </p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-bold text-neutral-900">{formatPrice(order.totalPrice)}</p>
                         <span className={cn(
                           "text-[10px] font-bold uppercase",
                           order.status === 'paid' ? "text-green-600" : "text-amber-500"
                         )}>
                           {order.status === 'paid' ? 'ÖDENDİ' : 'BEKLİYOR'}
                         </span>
                      </div>
                   </div>
                 );
               }) : (
                 <p className="text-center py-10 text-neutral-400 text-xs font-medium uppercase tracking-widest">Henüz sipariş yok.</p>
               )}
            </div>
         </div>

         {/* QUICK ACTIONS */}
         <div className="p-10 bg-neutral-900 rounded-[40px] shadow-2xl text-white space-y-8">
            <h3 className="text-xl font-bold italic tracking-tight">Hızlı İşlemler</h3>
            <div className="grid grid-cols-2 gap-4">
               <Link href="/admin/products" className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all group">
                  <Package className="mb-4 text-accent" />
                  <p className="text-xs font-bold uppercase tracking-widest">Yeni Ürün Ekle</p>
               </Link>
               <Link href="/admin/orders" className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all group">
                  <ShoppingCart className="mb-4 text-accent" />
                  <p className="text-xs font-bold uppercase tracking-widest">Siparişleri Yönet</p>
               </Link>
            </div>
         </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
