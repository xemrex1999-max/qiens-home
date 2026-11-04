"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, User, MapPin, Settings, LogOut, ChevronRight, Clock, Plus } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { formatPrice, cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('siparislerim')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setLoading(true)
      fetch(`/api/orders/${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setOrders(Array.isArray(data) ? data : [])
          setLoading(false)
        })
        .catch((err) => {
          console.error("Dashboard Fetch Error:", err)
          setLoading(false)
        })
    }
  }, [session, status])

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold">Lütfen giriş yapın.</h1>
        <Link href="/auth/login" className="inline-block px-8 py-4 bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-widest uppercase tracking-widest">Giriş Yap</Link>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'siparislerim':
        return (
          <div className="space-y-12">
            <div className="flex justify-between items-end">
              <h1 className="text-4xl font-bold tracking-tighter text-neutral-900 uppercase">Sipariş Geçmişi</h1>
              <span className="text-xs font-bold text-neutral-400 border-b-2 border-neutral-100 pb-1">{orders.length} Sipariş</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-neutral-100 border-t-neutral-900 rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-[40px] space-y-6">
                <Package size={48} className="mx-auto text-neutral-200" />
                <p className="text-neutral-500 font-light">Henüz bir siparişiniz bulunmuyor.</p>
                <Link href="/products" className="inline-block px-8 py-4 bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">Alışverişe Başla</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <Link 
                    key={order.id}
                    href={`/track-order?id=${order.id}`}
                    className="group flex flex-col md:flex-row md:items-center justify-between p-8 bg-white border border-neutral-100 rounded-[40px] hover:shadow-2xl hover:border-neutral-200 transition-all gap-8"
                  >
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                        <Clock size={24} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">#{order.id.slice(-8).toUpperCase()}</span>
                        <h3 className="text-sm font-bold text-neutral-900">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-12">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Durum</span>
                        <span className={cn(
                          "px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-widest",
                          order.status === 'pending' ? "bg-amber-50 text-amber-600" :
                          order.status === 'paid' ? "bg-green-50 text-green-600" :
                          order.status === 'shipped' ? "bg-blue-50 text-blue-600" :
                          order.status === 'cancelled' ? "bg-red-50 text-red-600" : "bg-neutral-50 text-neutral-600"
                        )}>
                          {order.status === 'pending' ? 'BEKLİYOR' : 
                           order.status === 'paid' ? 'ONAYLANDI' :
                           order.status === 'shipped' ? 'KARGODA' :
                           order.status === 'cancelled' ? 'İPTAL' : order.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Toplam</span>
                        <span className="text-base font-bold text-neutral-900">{formatPrice(order.totalPrice)}</span>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-full text-neutral-300 group-hover:translate-x-2 transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      case 'adreslerim':
        return (
          <div className="space-y-12">
            <div className="flex justify-between items-end">
              <h1 className="text-4xl font-bold tracking-tighter text-neutral-900 uppercase">Adreslerim</h1>
              <button className="flex items-center gap-2 text-xs font-bold text-neutral-900 hover:text-neutral-500 transition-colors uppercase tracking-widest">
                <MapPin size={16} /> Yeni Ekle
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 border border-neutral-100 rounded-[40px] space-y-4 hover:border-neutral-200 transition-all group relative overflow-hidden h-[200px] flex flex-col justify-center">
                 <div className="absolute top-8 right-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-50 px-3 py-1 rounded-full">Varsayılan</span>
                 </div>
                 <h3 className="font-bold text-neutral-900">Ev Adresi</h3>
                 <p className="text-xs text-neutral-500 leading-relaxed max-w-[200px]">Atatürk Mah. İstiklal Cad. No:45 Da:12 Ümraniye / İstanbul</p>
                 <div className="flex gap-4 pt-4">
                   <button className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900">Düzenle</button>
                   <button className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600">Sil</button>
                 </div>
              </div>

              <div className="p-8 border border-neutral-100 rounded-[40px] space-y-4 hover:border-neutral-200 transition-all group relative overflow-hidden h-[200px] flex flex-col justify-center bg-neutral-50 border-dashed">
                 <div className="text-center space-y-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Plus size={16} className="text-neutral-400" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Yeni Adres Ekle</p>
                 </div>
              </div>
            </div>
          </div>
        )
      case 'profil':
        return (
          <div className="space-y-12">
            <h1 className="text-4xl font-bold tracking-tighter text-neutral-900 uppercase">Profil Ayarları</h1>
            
            <form className="max-w-2xl space-y-8 bg-neutral-50 p-12 rounded-[40px] border border-neutral-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-2">Ad Soyad</label>
                    <input 
                      type="text" 
                      defaultValue={session?.user?.name || ''} 
                      className="w-full bg-white border border-neutral-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-2">E-posta</label>
                    <input 
                      type="email" 
                      defaultValue={session?.user?.email || ''} 
                      disabled
                      className="w-full bg-neutral-100 border border-neutral-100 rounded-2xl p-4 text-sm font-medium opacity-50 cursor-not-allowed"
                    />
                  </div>
               </div>
               
               <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-2">Yeni Şifre</label>
                  <input 
                    type="password" 
                    placeholder="Değiştirmek istemiyorsanız boş bırakın"
                    className="w-full bg-white border border-neutral-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all"
                  />
               </div>

               <button type="submit" className="w-full py-5 bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-neutral-800 transition-all">
                 Değişiklikleri Kaydet
               </button>
            </form>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* SIDEBAR */}
        <aside className="space-y-8">
          <div className="p-8 bg-neutral-50 rounded-[40px] border border-neutral-100 flex flex-col items-center text-center gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-neutral-900 text-white rounded-full flex items-center justify-center text-3xl font-bold"
            >
              {session?.user?.name?.[0] || 'U'}
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">{session?.user?.name || 'Kullanıcı'}</h2>
              <p className="text-xs text-neutral-400">{session?.user?.email || ''}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'siparislerim', label: 'Siparişlerim', icon: Package },
              { id: 'adreslerim', label: 'Adreslerim', icon: MapPin },
              { id: 'profil', label: 'Profil Ayarları', icon: Settings },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-3xl text-sm font-bold transition-all",
                  activeTab === item.id ? "bg-neutral-900 text-white shadow-xl" : "text-neutral-500 hover:bg-neutral-50"
                )}
              >
                <item.icon size={18} strokeWidth={1.5} />
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-4 p-5 rounded-3xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-8"
            >
              <LogOut size={18} strokeWidth={1.5} />
              Çıkış Yap
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          {renderContent()}
        </motion.div>

      </div>
    </div>
  )
}
