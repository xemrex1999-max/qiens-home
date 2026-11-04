"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const FALLBACK_CATEGORIES = [
  { 
    name: "Düğün Paketleri", 
    slug: "dugun", 
    image: "/images/dugun_paketi.png",
    desc: "Komple Ev Mobilyası"
  },
  { 
    name: "Yatak Odası", 
    slug: "yatak", 
    image: "/images/yatak_odasi.png",
    desc: "Lüks Dinlenme"
  },
  { 
    name: "Yemek Odası", 
    slug: "yemek", 
    image: "/images/yemek_odasi.png",
    desc: "Şık Sofra"
  },
  { 
    name: "Koltuk Takımı", 
    slug: "koltuk", 
    image: "/images/koltuk_takimi.png",
    desc: "Konforlu Oturma"
  }
]

const CategoryCards = () => {
  const [categories, setCategories] = useState<any[]>(FALLBACK_CATEGORIES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/home-categories')
        const data = await res.json()
        if (data && data.length > 0) {
          setCategories(data)
        }
      } catch (error) {
        console.error("HomeCategories fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="py-32 flex justify-center items-center">
         <div className="w-10 h-10 border-4 border-neutral-200 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <section className="py-24 bg-neutral-soft/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="text-center md:text-left space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent block">KOLEKSİYONLARIMIZ</span>
            <h2 className="text-4xl md:text-6xl font-serif text-secondary leading-tight">
              Popüler <br className="hidden md:block" />
              <span className="text-accent italic font-light">Kategoriler</span>
            </h2>
          </div>
          <Link 
            href="/products" 
            className="group inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-secondary border-b-2 border-accent pb-2 hover:text-accent transition-all duration-300"
          >
            TÜM KOLEKSİYONU KEŞFET
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 md:gap-8 no-scrollbar snap-x snap-mandatory pb-6">
          {categories.map((cat, i) => {
            const isHero = i === 0;
            const isMedium = i === 1 || i === 2;
            const isWide = i === 3;
            
            return (
              <motion.div
                key={cat.id || cat.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "group relative overflow-hidden rounded-[3rem] bg-neutral-100 shadow-sm transition-all duration-1000 w-[240px] sm:w-[280px] md:w-auto h-[200px] md:h-auto flex-shrink-0 snap-start",
                  isHero ? "md:col-span-2 md:row-span-2" : "",
                  isMedium ? "md:col-span-2 md:row-span-1" : "",
                  isWide ? "md:col-span-4 md:row-span-1" : ""
                )}
              >
                <Link href={`/products?cat=${cat.slug}`} className="absolute inset-0 block">
                  <Image 
                    src={(cat.image && (cat.image.startsWith('http') || cat.image.startsWith('/'))) ? cat.image : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'}
                    alt={cat.name} 
                    fill
                    className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-110"
                    unoptimized={true}
                  />
                  
                  {/* Luxury Border Overlay on Hover */}
                  <div className="absolute inset-4 border border-accent/0 group-hover:border-accent/30 rounded-[2.5rem] transition-all duration-1000 z-30 pointer-events-none" />

                  {/* Editorial Badge */}
                  <div className="absolute top-10 left-10 z-20">
                    <div className="px-6 py-2 bg-secondary/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform -translate-y-4 group-hover:translate-y-0 shadow-2xl">
                       <span className="text-[8px] font-black uppercase tracking-[0.4em] text-accent">
                         Explore {cat.name}
                       </span>
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
                  
                  <div className="absolute inset-0 p-6 md:p-16 flex flex-col justify-end transform transition-transform duration-1000 group-hover:-translate-y-6">
                    <span className="text-[9px] font-bold text-accent/80 uppercase tracking-[0.5em] mb-4 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                      Discovery 0{i + 1}
                    </span>
                    <h3 className={cn(
                      "font-serif text-white tracking-tight transition-all duration-1000",
                      isHero ? "text-2xl sm:text-4xl md:text-7xl leading-[0.9]" : "text-xl sm:text-3xl md:text-4xl leading-[1]"
                    )}>
                      {cat.name}
                    </h3>
                    <div className="h-[1px] w-0 bg-accent mt-8 transition-all duration-1000 group-hover:w-full max-w-[120px]" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategoryCards;
