"use client"

import React, { useState } from 'react'
import { ShoppingCart, Search, ChevronDown, Package, Truck, CheckCircle2, XCircle, Clock, Printer, Loader2, Home } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: 'Bekliyor',    color: 'bg-amber-50 text-amber-600 border-amber-200',   icon: Clock },
  paid:      { label: 'Onaylandı',   color: 'bg-emerald-50 text-emerald-700 border-emerald-200',   icon: CheckCircle2 },
  preparing: { label: 'Hazırlanıyor',color: 'bg-orange-50 text-orange-700 border-orange-200', icon: Package },
  shipped:   { label: 'Kargolandı',  color: 'bg-blue-50 text-blue-700 border-blue-200',      icon: Truck },
  delivered: { label: 'Teslim Edildi', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Home },
  cancelled: { label: 'İptal',       color: 'bg-red-50 text-red-700 border-red-200',         icon: XCircle },
}

interface OrderCardProps {
  order: any
}

function OrderCard({ order }: OrderCardProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const [trackingNo, setTrackingNo] = useState(order.trackingNumber || '')
  const [updatingTracking, setUpdatingTracking] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(order.status)

  const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  const address = order.address as any

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      setCurrentStatus(newStatus)
      toast.success('Sipariş durumu güncellendi!')
      router.refresh()
    } catch {
      toast.error('Durum güncellenemedi.')
    } finally {
      setUpdating(false)
    }
  }

  const handleTrackingUpdate = async () => {
    setUpdatingTracking(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: trackingNo }),
      })
      if (!res.ok) throw new Error()
      toast.success('Takip numarası kaydedildi!')
      router.refresh()
    } catch {
      toast.error('Takip numarası kaydedilemedi.')
    } finally {
      setUpdatingTracking(false)
    }
  }

  const handlePrint = () => {
    window.print();
  }

  return (
    <div id={`order-print-${order.id}`} className="p-8 bg-white border border-neutral-100 rounded-[32px] hover:shadow-xl transition-all relative group print:m-0 print:p-0">
      <style jsx global>{`
        @media print {
          /* Hide everything by default */
          body * { 
            visibility: hidden; 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          
          /* Only show the targeted order card and its children */
          #order-print-${order.id}, 
          #order-print-${order.id} * { 
            visibility: visible; 
          }

          /* Position the card at the very top of the page */
          #order-print-${order.id} { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            height: auto;
            border: none !important;
            padding: 20px !important;
            box-shadow: none !important;
            background: white !important;
          }

          /* Ensure images and backgrounds work */
          .no-print { display: none !important; }
          
          /* Force page break settings */
          html, body {
            height: auto;
            overflow: visible;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-50">
        <div className="flex items-center gap-5">
          <div className={`p-3 rounded-2xl border ${cfg.color}`}>
            <Icon size={22} strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-neutral-900 uppercase tracking-widest font-mono">
                #{order.id.slice(-8).toUpperCase()}
              </span>
              <span className="text-[10px] font-bold text-neutral-400">
                {new Date(order.createdAt).toLocaleString('tr-TR')}
              </span>
              <button 
                onClick={handlePrint}
                className="no-print p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-900 transition-all flex items-center gap-2"
                title="Sipariş Fişini Yazdır"
              >
                <Printer size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest">YAZDIR</span>
              </button>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mt-1">
              {address?.name || order.user?.name || 'Misafir Müşteri'}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-neutral-400">{address?.email || order.user?.email || '—'}</p>
              {order.paymentSystem && (
                <span className={cn(
                  "text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest",
                  order.paymentSystem === 'havale' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                )}>
                  {order.paymentSystem === 'havale' ? 'HAVALE/EFT' : 'KREDİ KARTI'}
                </span>
              )}
              {order.paymentId && (
                <span className="text-[9px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-500 font-mono">
                  ID: {order.paymentId}
                </span>
              )}
            </div>
              {order.paymentSystem === 'havale' && currentStatus === 'pending' && (
                <button 
                  onClick={() => handleStatusChange('paid')}
                  disabled={updating}
                  className="no-print mt-3 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {updating ? <Loader2 className="animate-spin" size={12} /> : <CheckCircle2 size={12} />} 
                  ÖDEMEYİ ONAYLA (SATIŞI BAŞLAT)
                </button>
              )}
          </div>
        </div>

        {/* Status Selector */}
        <div className="no-print flex items-center gap-4">
          <div className="relative">
            <select
              disabled={updating}
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`appearance-none pl-4 pr-10 py-3 rounded-2xl border text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all outline-none disabled:opacity-50 ${cfg.color}`}
            >
              {Object.entries(STATUS_CONFIG).map(([val, c]) => (
                <option key={val} value={val}>{c.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <span className="text-xl font-black text-neutral-900 tracking-tight">
            {formatPrice(order.totalPrice)}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="pt-6 space-y-3">
        {order.items?.map((item: any) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-neutral-100 rounded-lg text-[10px] font-black flex items-center justify-center text-neutral-500">
                {item.quantity}x
              </span>
              <span className="text-neutral-700 font-medium">
                {item.product?.name || item.productId.slice(-6).toUpperCase()}
              </span>
            </div>
            <span className="font-bold text-neutral-900">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Actions & Tracking */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 items-end justify-between border-t border-neutral-50 pt-6">
        <div className="no-print w-full md:w-auto space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-300 ml-1">Kargo Takip No</label>
          <div className="flex gap-2">
            <input 
              placeholder="Takip no giriniz..."
              className="px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-xs focus:ring-2 focus:ring-neutral-900 outline-none w-48"
              value={trackingNo}
              onChange={e => setTrackingNo(e.target.value)}
            />
            <button 
              onClick={handleTrackingUpdate}
              disabled={updatingTracking || trackingNo === order.trackingNumber}
              className="bg-dark text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50"
            >
              {updatingTracking ? '...' : 'Kaydet'}
            </button>
          </div>
        </div>

        {address && (
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300 block mb-1 uppercase no-print">Teslimat Adresi</span>
            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed max-w-sm">
              {address.address}, {address.district} / {address.city}
              {address.phone && ` — ${address.phone}`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface AdminOrdersClientProps {
  initialOrders: any[]
}

const AdminOrdersClient = ({ initialOrders }: AdminOrdersClientProps) => {
  const [search, setSearch] = useState('')

  const filtered = initialOrders.filter(o => {
    const addr = o.address as any
    const name = addr?.name || o.user?.name || ''
    const email = addr?.email || o.user?.email || ''
    return name.toLowerCase().includes(search.toLowerCase()) ||
           email.toLowerCase().includes(search.toLowerCase()) ||
           o.id.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-neutral-900 uppercase">Sipariş Yönetimi</h1>
          <p className="text-sm text-neutral-400 font-medium">Toplam {initialOrders.length} sipariş</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        <input
          type="text"
          placeholder="İsim, e-posta veya sipariş no ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-16 pr-6 py-5 bg-white border border-neutral-100 rounded-3xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
        {filtered.length === 0 && (
          <div className="py-32 text-center space-y-4 bg-neutral-50 rounded-[40px]">
            <ShoppingCart size={48} className="mx-auto text-neutral-200" />
            <p className="text-sm font-bold text-neutral-400">Sipariş bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrdersClient
