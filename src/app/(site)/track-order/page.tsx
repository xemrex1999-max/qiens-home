"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Truck, CheckCircle2, Box, Home, MapPin, Loader2, ShieldCheck, Clock } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { formatPrice, cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

const STATUS_STEPS = [
  { id: 'pending',   label: 'Bekliyor',     icon: Clock,        desc: 'Ödeme onayınız bekleniyor.' },
  { id: 'paid',      label: 'Onaylandı',    icon: CheckCircle2, desc: 'Siparişiniz başarıyla alındı.' },
  { id: 'preparing', label: 'Hazırlanıyor', icon: Box,          desc: 'Ürünlerinizi özenle hazırlıyoruz.' },
  { id: 'shipped',   label: 'Kargoda',      icon: Truck,        desc: 'Paketiniz yola çıktı.' },
  { id: 'delivered', label: 'Teslimat',     icon: Home,         desc: 'Ürünleriniz teslim edildi.' }
]

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const codeParam = searchParams.get('id')
  const [orderId, setOrderId] = useState(codeParam || '')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  const fetchOrder = async (id: string) => {
    if (!id) return
    setLoading(true)
    setError('')
    try {
      // Sipariş takip API'sı - ID üzerinden (Sorgu parametresi ile)
      const res = await fetch(`/api/orders/track?id=${id}`)
      const data = await res.json()
      if (res.ok) {
        setOrder(data.order)
      } else {
        setError(data.message || 'Sipariş bulunamadı. Lütfen kodu kontrol edin.')
        setOrder(null)
      }
    } catch (err) {
      setError('Sistem hatası oluştu.')
    }
    setLoading(false)
  }

  const handleCancel = async () => {
    if (!window.confirm("Bu siparişi iptal etmek istediğinize emin misiniz?")) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      })
      if (res.ok) {
        toast.success("Sipariş başarıyla iptal edildi.")
        fetchOrder(order.id)
      }
    } catch (err) {
      toast.error("İptal işlemi başarısız oldu.")
    }
    setCancelling(false)
  }

  useEffect(() => {
    if (codeParam) fetchOrder(codeParam)
  }, [codeParam])

  const currentStatusIndex = order ? Math.max(0, STATUS_STEPS.findIndex(s => s.id === order.status)) : 0

  return (
    <div className="bg-white min-h-screen pt-44 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* HEADER */}
        <div className="text-center space-y-6">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent block">Durum Sorgulama</span>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-neutral-900 leading-none uppercase">
            SİPARİŞ TAKİBİ
          </h1>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-xl mx-auto group">
          <div className="absolute inset-y-0 left-8 flex items-center text-neutral-400 group-focus-within:text-accent transition-colors">
            <Search size={22} strokeWidth={1.5} />
          </div>
          <input 
            type="text"
            placeholder="SİPARİŞ NO (ÖRN: CMXXXXXX)"
            className="w-full pl-20 pr-32 py-7 bg-neutral-50 border border-neutral-100 rounded-full text-[11px] font-black tracking-widest uppercase transition-all outline-none focus:bg-white focus:border-accent focus:shadow-2xl"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrder(orderId)}
          />
          <button 
            onClick={() => fetchOrder(orderId)}
            className="absolute right-3 top-3 bottom-3 bg-dark text-white px-10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-all shadow-xl active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'SORGULA'}
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center p-6 bg-red-50 border border-red-100 rounded-sm"
          >
            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">{error}</p>
          </motion.div>
        )}

        {/* TRACKING TIMELINE */}
        {order ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-24 pt-12"
          >
            {/* VISUAL TIMELINE */}
            <div className="relative flex justify-between items-start">
              {/* BACK LINE */}
              <div className="absolute top-10 left-10 right-10 h-[2px] bg-neutral-100 -z-10">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: order.status === 'cancelled' ? '0%' : `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%` 
                  }}
                  className={cn("h-full", order.status === 'cancelled' ? "bg-red-500" : "bg-accent")}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
              </div>

              {STATUS_STEPS.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center gap-6 group relative">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl border-4 relative z-10",
                    order.status === 'cancelled' ? "bg-red-50 text-red-200 border-white" :
                    idx <= currentStatusIndex 
                      ? "bg-dark text-white border-white scale-110" 
                      : "bg-white text-neutral-300 border-neutral-50"
                  )}>
                    <step.icon size={28} strokeWidth={1} />
                    {idx === currentStatusIndex && order.status !== 'cancelled' && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-accent rounded-full -z-10"
                      />
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                      order.status === 'cancelled' ? "text-red-300" :
                      idx <= currentStatusIndex ? "text-neutral-900" : "text-neutral-300"
                    )}>{step.label}</h4>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER DETAILS PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-neutral-50 p-10 md:p-14 rounded-sm border border-neutral-100 grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                   <div className="flex items-center gap-4">
                     <MapPin size={20} className="text-accent" />
                     <h3 className="text-[11px] font-black uppercase tracking-widest text-neutral-900">Teslimat Adresi</h3>
                   </div>
                   <div className="space-y-4 pl-9 border-l border-neutral-200 ml-2">
                     <p className="text-xs font-bold text-neutral-900 uppercase tracking-widest">
                       {order.address?.name || 'Müşteri Bilgisi'}
                     </p>
                     <p className="text-xs font-light text-neutral-500 leading-relaxed uppercase tracking-tighter">
                       {order.address?.address}<br/>
                       {order.address?.district} / {order.address?.city}
                     </p>
                   </div>
                </div>
                <div className="space-y-8">
                   <div className="flex items-center gap-4">
                     <Clock size={20} className="text-accent" />
                     <h3 className="text-[11px] font-black uppercase tracking-widest text-neutral-900">Sipariş Bilgisi</h3>
                   </div>
                   <div className="space-y-4 pl-9 border-l border-neutral-200 ml-2">
                     <div className="flex justify-between">
                       <span className="text-[10px] text-neutral-400 font-black uppercase tracking-tighter">KOD</span>
                       <span className="text-[10px] font-black text-neutral-900 uppercase">#{order.id.slice(-8)}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-[10px] text-neutral-400 font-black uppercase tracking-tighter">DURUM</span>
                       <span className={cn(
                         "text-[10px] font-black uppercase",
                         order.status === 'cancelled' ? "text-red-500" : "text-green-600"
                       )}>{order.status === 'cancelled' ? 'İPTAL EDİLDİ' : 'AKTİF'}</span>
                     </div>
                     {order.trackingNumber && (
                       <div className="flex justify-between bg-accent/5 p-2 rounded-lg border border-accent/10">
                         <span className="text-[10px] text-accent font-black uppercase tracking-tighter">KARGO NO</span>
                         <span className="text-[10px] font-black text-neutral-900 font-mono">{order.trackingNumber}</span>
                       </div>
                     )}
                   </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-dark p-10 md:p-14 rounded-sm text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Toplam Tutar</span>
                  <div className="text-5xl font-light tracking-tighter">{formatPrice(order.totalPrice)}</div>
                </div>
                
                <div className="pt-10 space-y-4">
                  {order.status === 'pending' && (
                    <button 
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="w-full py-5 border border-red-500/50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {cancelling ? '...' : 'SİPARİŞİ İPTAL ET'}
                    </button>
                  )}
                  <div className="flex items-center gap-4 opacity-40">
                    <ShieldCheck size={18} />
                    <span className="text-[9px] font-black uppercase tracking-widest italic">Güvenli Ödeme Altyapısı</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : !loading && codeParam && (
          <div className="text-center py-20 opacity-30">
            <Loader2 size={40} className="mx-auto" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-4 border-neutral-100 border-t-accent rounded-full animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  )
}
