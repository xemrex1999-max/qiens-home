"use client"

import React from 'react'
import { MessageCircle } from 'lucide-react'

const WhatsAppFloat = () => {
  return (
    <a 
      href="https://wa.me/905314602597" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-5 rounded-full shadow-[0_12px_40px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95 transition-all group flex items-center gap-4 group hover:pr-8 duration-500 ease-in-out border border-white/20"
      title="WhatsApp Destek"
    >
      <div className="relative">
        <MessageCircle size={28} strokeWidth={1.5} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#25D366] animate-pulse" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[150px] transition-all duration-500">
        WhatsApp Destek
      </span>
    </a>
  )
}

export default WhatsAppFloat;
