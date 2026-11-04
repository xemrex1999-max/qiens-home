"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/store/useCart'
import { useUI } from '@/store/useUI'
import Image from 'next/image'

import { CATEGORIES as categories } from '@/constants/categories'


const Navbar = () => {
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCatOpen, setIsCatOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const cart = useCart((state) => state.cart)
  const { openCart, setSearchOpen } = useUI()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0)

  return (
    <>
    <nav className={cn(
      "fixed top-11 inset-x-0 z-[999] transition-all duration-700 px-3 md:px-12",
      isScrolled ? "py-4" : "py-6"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-8 py-4 px-4 md:px-12 transition-all duration-700 glass-header",
        isScrolled ? "rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40" : "bg-white/80 backdrop-blur-xl border border-neutral-100 rounded-full"
      )}>
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 group">
          <div className="text-xl md:text-2xl font-black tracking-[-0.05em] text-foreground uppercase flex items-center gap-1">
            <span className="group-hover:text-accent transition-colors duration-300">QİENS</span>
            <span className="font-light text-accent tracking-[0.1em] text-[0.7em] mt-1">HOME</span>
          </div>
        </Link>

        {/* CENTERED SEARCH BAR (DESKTOP) */}
        <div className="hidden xl:flex flex-grow max-w-xs relative group">
          <input 
            type="text" 
            placeholder="Koleksiyonlarda arayın..." 
            onClick={() => setSearchOpen(true)}
            readOnly
            className="w-full bg-neutral-soft/50 border border-transparent rounded-full px-8 py-2.5 text-xs focus:bg-white focus:border-accent/30 transition-all cursor-pointer placeholder:text-neutral-400 outline-none"
          />
          <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-accent transition-colors" />
        </div>
        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-5 text-[9px] font-black uppercase tracking-[0.1em] text-foreground/70">
          <Link href="/" className="hover:text-accent transition-colors relative group">
            ANA SAYFA
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
          </Link>
          <div 
            className="relative group cursor-pointer"
            onMouseEnter={() => setIsCatOpen(true)}
            onMouseLeave={() => setIsCatOpen(false)}
          >
            <Link href="/products" className="flex items-center gap-1 hover:text-accent transition-colors">
              ÜRÜNLER <ChevronDown size={12} className={cn("transition-transform duration-300", isCatOpen && "rotate-180")} />
            </Link>
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
            
            {/* CATEGORY DROPDOWN (MEGA MENU STYLE) */}
            <AnimatePresence>
              {isCatOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-screen max-w-xs z-50 pointer-events-auto"
                >
                   <div className="bg-white/95 backdrop-blur-xl border border-neutral-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] p-2">
                       <div className="flex flex-col">
                          {categories.map((cat) => (
                            <Link 
                              key={cat.slug}
                              href={`/products?cat=${cat.slug}`}
                              className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:bg-neutral-50 hover:text-accent transition-all flex items-center justify-between group/item border-b border-neutral-50 last:border-0"
                            >
                               {cat.name}
                               <div className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                          <Link 
                              href="/products"
                              className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] bg-secondary text-white hover:bg-black transition-all text-center mt-1"
                            >
                               Tüm Koleksiyon
                          </Link>
                       </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link href="/showroom" className="hover:text-accent transition-colors whitespace-nowrap relative group text-accent font-black">
            SANAL SHOWROOM (3D)
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
          </Link>
          <Link href="/room-builder" className="hover:text-accent transition-colors whitespace-nowrap relative group text-accent font-black">
            KOMBİN TASARIMCISI
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
          </Link>
          <Link href="/ai-designer" className="hover:text-accent transition-colors whitespace-nowrap relative group text-accent font-black">
            AI İÇ MİMAR
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
          </Link>
          <Link href="/hakkimizda" className="hover:text-accent transition-colors whitespace-nowrap relative group">
            HAKKIMIZDA
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
          </Link>
          <Link href="/iletisim" className="hover:text-accent transition-colors whitespace-nowrap relative group">
            İLETİŞİM
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
          </Link>
        </div>
        {/* ICONS */}
        <div className="flex items-center gap-3 md:gap-6 text-foreground/80">
          <div 
            className="relative"
            onMouseEnter={() => setIsUserMenuOpen(true)}
            onMouseLeave={() => setIsUserMenuOpen(false)}
          >
            <Link href={status === "authenticated" ? "/dashboard" : "/auth/login"} className="hover:text-accent transition-colors">
              <User size={20} strokeWidth={2} />
            </Link>
            {/* USER DROPDOWN (ONLY DESKTOP) */}
            {status === "authenticated" && (
              <div className={cn(
                "absolute top-full right-0 pt-4 w-56 transition-all duration-300",
                isUserMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
              )}>
                <div className="bg-white shadow-2xl border border-neutral-100 overflow-hidden rounded-xl p-1">
                  <Link href="/dashboard" className="block px-6 py-4 text-[10px] font-bold hover:bg-neutral-soft text-neutral-600 hover:text-accent transition-all uppercase tracking-widest rounded-lg">
                    Hesabım
                  </Link>
                  {(session.user as any).role === 'admin' && (
                    <Link href="/admin" className="block px-6 py-4 text-[10px] font-black hover:bg-secondary bg-neutral-soft text-secondary hover:text-white transition-all uppercase tracking-widest rounded-lg mt-1">
                      Yönetim Paneli
                    </Link>
                  )}
                  <button onClick={() => signOut()} className="w-full text-left px-6 py-4 text-[10px] font-bold hover:bg-red-50 text-red-500 transition-all uppercase tracking-widest rounded-lg mt-1">
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={openCart} className="relative group hover:text-accent transition-colors">
            <ShoppingCart size={20} strokeWidth={2} />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg shadow-accent/20 animate-in zoom-in duration-500">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setSearchOpen(true)}
            className="xl:hidden hover:text-accent transition-colors"
          >
            <Search size={20} strokeWidth={2} />
          </button>
          <button 
            className="lg:hidden hover:text-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-white z-[100] lg:hidden flex flex-col pt-32 px-10 overflow-y-auto"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-10 right-10 p-2 hover:bg-neutral-50 rounded-full transition-colors"
            >
              <X size={32} strokeWidth={1} className="text-neutral-900" />
            </button>

            <div className="flex flex-col gap-10">
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent block">KATEGORİLER</span>
                <div className="grid grid-cols-1 gap-6">
                  {categories.map((cat) => (
                    <Link 
                      key={cat.slug} 
                      href={`/products?cat=${cat.slug}`} 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-2xl font-bold tracking-tighter text-neutral-900 hover:text-accent transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link 
                    href="/products" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="text-2xl font-bold tracking-tighter text-neutral-900 underline underline-offset-8"
                  >
                    Tüm Koleksiyon
                  </Link>
                </div>
              </div>

              <div className="h-[1px] bg-neutral-100" />

              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent block">MENÜ</span>
                <div className="flex flex-col gap-6">
                  <Link href="/showroom" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-accent flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    SANAL SHOWROOM (3D)
                  </Link>
                  <Link href="/room-builder" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-accent flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    KOMBİN TASARIMCISI
                  </Link>
                  <Link href="/ai-designer" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-accent flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    AI İÇ MİMAR
                  </Link>
                  <Link href="/hakkimizda" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-neutral-700">Hakkımızda</Link>
                  <Link href="/iletisim" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-neutral-700">İletişim</Link>
                  <Link href="/track-order" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-neutral-700">Sipariş Takibi</Link>
                </div>
              </div>

              <div className="h-[1px] bg-neutral-100" />

              <div className="flex flex-col gap-6 pb-20">
                {status === "authenticated" ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-neutral-900 uppercase tracking-widest">
                      PROFİLİM
                    </Link>
                    {(session?.user as any)?.role === 'admin' && (
                       <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-accent uppercase tracking-widest">
                        YÖNETİM PANELİ
                       </Link>
                    )}
                    <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="text-lg font-black text-red-500 uppercase tracking-widest text-left">
                      ÇIKIŞ YAP
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-neutral-900 uppercase tracking-widest">
                    GİRİŞ YAP / KAYIT OL
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar;
