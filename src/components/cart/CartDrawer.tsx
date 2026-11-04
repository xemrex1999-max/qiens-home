"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCart } from '@/store/useCart'
import { useUI } from '@/store/useUI'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const CartDrawer = () => {
  const { isCartOpen, closeCart } = useUI()
  const { cart, removeItem, updateQty, getTotal } = useCart()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* HEADER */}
            <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ShoppingBag size={24} className="text-accent" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Sepetim ({cart.length})</h2>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-neutral-50 rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="relative w-24 h-24 bg-neutral-50 rounded-sm overflow-hidden flex-shrink-0 border border-neutral-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-[11px] font-bold uppercase tracking-tight text-neutral-900 leading-tight">
                            {item.name} {item.selectedColor ? `(${item.selectedColor})` : ''}
                          </h3>
                          <button 
                            onClick={() => removeItem(item.cartItemId)}
                            className="text-neutral-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block">{item.category}</span>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex items-center bg-neutral-50 rounded-full px-4 py-2 gap-6 scale-90 -ml-2">
                          <button 
                            onClick={() => updateQty(item.cartItemId, item.qty - 1)}
                            className="text-neutral-400 hover:text-accent transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-[11px] font-black w-3 text-center">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.cartItemId, item.qty + 1)}
                            className="text-neutral-400 hover:text-accent transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-light tracking-tighter text-neutral-900">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-300">
                    <ShoppingBag size={40} strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-black uppercase tracking-widest text-neutral-900">Sepetin Boş</p>
                    <p className="text-xs text-neutral-500 font-light max-w-[200px]">Sepetine henüz ürün eklemedin.</p>
                  </div>
                  <button 
                    onClick={closeCart}
                    className="text-[10px] font-black uppercase tracking-widest border-b-2 border-accent pb-1"
                  >
                    Alışverişe Başla
                  </button>
                </div>
              )}
            </div>

            {/* FOOTER */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-neutral-100 space-y-8 bg-neutral-50/50">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Ara Toplam</span>
                    <p className="text-xs text-neutral-500 font-light uppercase tracking-tighter">Kargo ve KDV Dahil</p>
                  </div>
                  <span className="text-3xl font-light tracking-tighter text-neutral-900">
                    {formatPrice(getTotal())}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <Link 
                    href="/checkout" 
                    onClick={closeCart}
                    className="w-full py-6 bg-dark text-white rounded-full font-black text-[10px] tracking-[0.3em] uppercase hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl group"
                  >
                    Siparişi Tamamla
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/cart" 
                    onClick={closeCart}
                    className="w-full py-5 bg-transparent border border-neutral-200 text-neutral-600 rounded-full font-black text-[9px] tracking-[0.2em] uppercase hover:bg-neutral-100 transition-all flex items-center justify-center"
                  >
                    Sepeti Görüntüle
                  </Link>
                </div>
                
                <p className="text-[9px] text-center text-neutral-400 font-bold uppercase tracking-[0.2em]">
                  🔒 256-BIT GÜVENLİ ÖDEME ALTYAPISI
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer;
