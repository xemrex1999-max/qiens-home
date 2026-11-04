"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const type = searchParams.get('type')

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg bg-white p-10 md:p-16 rounded-[40px] shadow-2xl text-center space-y-8 border border-neutral-100"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle2 size={48} className="text-green-500" />
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-3xl font-black tracking-tighter text-neutral-900 uppercase">
          {type === 'havale' ? 'Siparişiniz Alındı' : 'Ödeme Başarılı!'}
        </h1>
        <p className="text-sm text-neutral-500 leading-relaxed font-medium">
          {type === 'havale' 
            ? "Siparişiniz oluşturuldu. Ödemeniz onaylandıktan sonra hazırlık süreci başlayacaktır."
            : "Ödemeniz başarıyla gerçekleşti. Siparişiniz özenle hazırlanıyor. Bizi tercih ettiğiniz için teşekkür ederiz."}
        </p>
      </div>

      <div className="space-y-4">
        {orderId && (
          <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Sipariş Numarası</span>
            <span className="text-lg font-mono tracking-wider font-bold text-neutral-900">{orderId}</span>
          </div>
        )}

        {type === 'havale' && (
          <div className="bg-accent/5 p-8 rounded-2xl border border-accent/10 space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="pb-4 border-b border-accent/10">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Hesap Bilgileri</h4>
               <p className="text-[11px] text-neutral-500 font-bold">Lütfen toplam tutarı aşağıdaki hesaba gönderiniz.</p>
             </div>
             <div className="space-y-3 text-[11px] font-bold text-neutral-800 uppercase tracking-widest">
                <div className="flex justify-between">
                  <span className="text-neutral-400">BANKA</span>
                  <span>GARANTİ BBVA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">ALICI</span>
                  <span>QİENS HOME MOBİLYA LTD. ŞTİ.</span>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <span className="text-neutral-400">IBAN</span>
                  <span className="bg-white p-3 rounded-lg border border-accent/20 text-accent text-xs font-mono">TR12 0006 2000 0000 0000 0000 00</span>
                </div>
                <p className="text-[9px] text-neutral-400 font-medium lowercase tracking-normal italic mt-4">
                  * Açıklama kısmına sipariş numaranızı (#...) yazmayı unutmayınız.
                </p>
             </div>
          </div>
        )}
      </div>

      <div className="pt-8 flex flex-col gap-4">
        <Link 
          href="/products"
          className="w-full py-5 bg-neutral-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl flex items-center justify-center gap-3"
        >
          <ShoppingBag size={16} />
          Alışverişe Devam Et
        </Link>
      </div>
    </motion.div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-neutral-50 flex items-center justify-center">
      <Suspense fallback={
        <div className="w-16 h-16 border-4 border-neutral-100 border-t-accent rounded-full animate-spin" />
      }>
        <OrderSuccessContent />
      </Suspense>
    </div>
  )
}
