"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    badge: "YENİ KOLEKSİYON 2026",
    title: "Modern Yaşamın Yeni Estetiği",
    sub: "İnegöl'ün 30 yıllık mobilya mirasını modern tasarımlarla evinizle buluşturuyoruz.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2000",
    link: "/products",
    linkText: "Koleksiyonu Keşfet"
  }
]

const HeroSection = () => {
  const [slides, setSlides] = useState<any[]>(FALLBACK_SLIDES)
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/hero')
        const data = await res.json()
        if (data && data.length > 0) {
          setSlides(data)
        }
      } catch (error) {
        console.error("Banners fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 8000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (loading) {
    return (
      <div className="relative h-[85vh] md:h-[90vh] w-full bg-neutral-50 animate-pulse flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-neutral-200 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  const activeSlide = slides[current]

  return (
    <section className="relative h-[85vh] md:h-[95vh] w-full overflow-hidden bg-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id || current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
          className="absolute inset-0"
        >
          {/* BACKGROUND IMAGE - WITH SLOW SCAN EFFECT */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div 
              initial={{ scale: 1.15, filter: 'blur(10px)' }}
              animate={{ scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${activeSlide.image}')` }}
            />
            {/* Editorial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent z-10" />
          </div>

          {/* CONTENT - ASYMMETRICAL EDITORIAL LAYOUT */}
          <div className="relative z-20 h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center px-6 md:px-12">
            <div className="lg:col-span-8 lg:col-start-1 space-y-8 md:space-y-16">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 md:space-y-10"
              >
                <div className="flex items-center gap-8">
                  <div className="flex -space-x-4">
                    <div className="w-12 h-12 rounded-full border-2 border-accent bg-secondary/50 backdrop-blur-sm flex items-center justify-center text-[10px] font-black text-accent rotate-12">B</div>
                  </div>
                  <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] text-accent/90">
                    {activeSlide.badge}
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-9xl lg:text-[140px] font-serif text-white leading-[1.1] tracking-[-0.05em] drop-shadow-2xl">
                  {activeSlide.title.split(' ').map((word: string, i: number) => {
                    const isAccent = i === 1 || i === 3;
                    return (
                        <span key={i} className={cn(
                            "inline-block mr-4",
                            isAccent ? "text-accent italic font-light" : "font-bold"
                        )}>
                            {word}
                        </span>
                    )
                  })}
                </h1>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
                   <p className="text-base md:text-xl font-light text-white/70 max-w-lg leading-relaxed font-sans tracking-wide border-l-2 border-accent/30 pl-8">
                     {activeSlide.sub}
                   </p>
                   
                   <div className="hidden lg:block h-[1px] w-32 bg-white/10" />
                   
                   <div className="glass p-6 rounded-3xl border border-white/10 hidden xl:block">
                      <div className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">İnegöl'de El İşçiliğiyle</div>
                      <div className="text-white/50 text-[9px] uppercase tracking-tighter">KURULUŞ 1996</div>
                   </div>
                </div>

                <div className="flex flex-wrap gap-6 md:gap-10 pt-4 md:pt-8">
                  <Link 
                    href={activeSlide.link || '/products'} 
                    className="group relative px-8 py-4 md:px-20 md:py-7 bg-accent text-secondary font-black text-[11px] md:text-[12px] tracking-[0.3em] md:tracking-[0.5em] uppercase transition-all overflow-hidden shadow-[0_30px_60px_rgba(212,175,55,0.3)] rounded-sm"
                  >
                    <span className="relative z-10">
                      {activeSlide.linkText || 'KOLEKSİYONU KEŞFET'}
                    </span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
                  </Link>
                </div>
              </motion.div>
            </div>
            
            {/* FLOATING SIDE BADGE */}
            <div className="hidden lg:flex lg:col-span-4 justify-end">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                 animate={{ opacity: 1, scale: 1, rotate: 12 }}
                 transition={{ duration: 1.5, delay: 1 }}
                 className="w-48 h-48 rounded-full border border-white/20 glass flex items-center justify-center text-center p-8 backdrop-blur-xl"
               >
                  <div className="space-y-2">
                    <div className="text-accent text-3xl font-serif">A+</div>
                    <div className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] leading-tight">ÜST SEGMENT <br/> MOBİLYA STANDARTLARI</div>
                  </div>
               </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* CONTROLS */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 left-6 md:left-12 z-30 flex items-center gap-10">
          <div className="flex gap-4">
            <button onClick={prevSlide} className="p-3 text-neutral-300 hover:text-accent transition-colors">
              <ChevronLeft size={24} strokeWidth={1} />
            </button>
            <button onClick={nextSlide} className="p-3 text-neutral-300 hover:text-accent transition-colors">
              <ChevronRight size={24} strokeWidth={1} />
            </button>
          </div>
          <div className="h-[1px] w-24 bg-neutral-100 hidden md:block" />
          <span className="text-[10px] font-black text-neutral-200 tracking-widest hidden md:block uppercase">
            0{current + 1} / 0{slides.length}
          </span>
        </div>
      )}
    </section>
  )
}

export default HeroSection;
