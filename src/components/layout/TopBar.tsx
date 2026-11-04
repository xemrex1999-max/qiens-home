"use client"

import React from 'react'
import { Phone, Truck, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'

const TopBar = () => {
  return (
    <div className="bg-[#050505]/90 backdrop-blur-xl text-white h-11 px-6 md:px-12 border-b border-white/[0.03] text-[8px] font-black uppercase tracking-[0.5em] fixed top-0 left-0 right-0 z-[1000] flex items-center">
      <div className="max-w-[1400px] mx-auto w-full flex flex-row justify-center md:justify-between items-center">
        
        {/* Left Side: Status & Ops */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 group cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_10px_rgba(197,160,89,1)]"></span>
            </span>
            <span className="text-accent/90 group-hover:text-accent transition-colors text-center">
              Türkiye Genelinde Ücretsiz Nakliye & Kurulum
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors">
            <Clock size={10} strokeWidth={3} />
            <span>09:00 – 18:00</span>
          </div>
        </div>
        
        {/* Right Side: Contact & Tracking */}
        <div className="hidden md:flex items-center gap-12">
          <div className="flex items-center gap-6 font-medium text-neutral-400">
            <a href="tel:+905314602597" className="hover:text-white transition-colors tracking-[0.2em]">+90 531 460 25 97</a>
            <div className="w-[1px] h-3 bg-white/10" />
            <a href="tel:+905077567887" className="hover:text-white transition-colors tracking-[0.2em]">+90 507 756 78 87</a>
          </div>
          
          <Link href="/track-order" className="group flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/[0.05] hover:bg-accent hover:border-accent hover:text-black transition-all duration-500">
            <MapPin size={10} strokeWidth={3} className="text-accent group-hover:text-black" />
            <span className="text-[7px]">Siparişim Nerede?</span>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default TopBar;
