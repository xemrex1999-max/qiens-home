"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react'
import { useUI } from '@/store/useUI'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const popularSearches = [
  "Düğün Paketi",
  "Koltuk Takımı",
  "Yatak Odası",
  "Modern TV Ünitesi",
  "Mutfak Masası"
]

const categories = [
  { name: "Düğün Paketleri", slug: "dugun" },
  { name: "Yatak Odaları", slug: "yatak" },
  { name: "Yemek Odaları", slug: "yemek" },
  { name: "Koltuk Takımları", slug: "koltuk" },
  { name: "Köşe Takımları", slug: "kose" },
  { name: "TV Üniteleri", slug: "tv" },
]

const SearchOverlay = () => {
  const { isSearchOpen, setSearchOpen } = useUI()
  const [query, setQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isSearchOpen])

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.products || [])
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [setSearchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
      setSearchOpen(false)
    }
  }

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-secondary/20 backdrop-blur-3xl flex flex-col items-center justify-start pt-32 px-6"
        >
            {/* BACKGROUND CLICK TO CLOSE */}
            <div className="absolute inset-0 -z-10" onClick={() => setSearchOpen(false)} />

            {/* MODAL CONTENT */}
            <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-4xl bg-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] rounded-[2rem] p-10 md:p-20 relative overflow-hidden"
            >
                {/* CLOSE BUTTON - REDESIGNED */}
                <button 
                onClick={() => setSearchOpen(false)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-accent hover:border-accent transition-all hover:rotate-90 duration-500 z-50 bg-white"
                >
                    <X size={20} />
                </button>

                <div className="space-y-12">
                {/* SEARCH INPUT */}
                <form onSubmit={handleSearch} className="relative group">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent mb-4 block animate-in fade-in slide-in-from-left duration-700">Arama Yapın</span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Neyi aramıştınız?..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent border-b border-neutral-100 py-6 text-2xl md:text-5xl font-serif text-secondary tracking-tighter outline-none focus:border-accent transition-all duration-700 placeholder:text-neutral-200"
                    />
                    <button type="submit" className="absolute right-0 bottom-6 p-2 text-neutral-200 group-focus-within:text-accent transition-colors">
                        <Search size={32} strokeWidth={1} />
                    </button>
                </form>

                <AnimatePresence mode="wait">
                    {query.length > 1 ? (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">İLGİLİ ÜRÜNLER</span>
                            {isLoading && <span className="text-[10px] font-bold text-accent animate-pulse uppercase tracking-widest">Sizin için taranıyor...</span>}
                        </div>
                        
                        {results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {results.slice(0, 4).map((item) => (
                                <button
                                key={item.id}
                                onClick={() => {
                                    router.push(`/product/${item.slug}`)
                                    setSearchOpen(false)
                                }}
                                className="group flex items-center gap-6 text-left p-4 rounded-2xl hover:bg-neutral-50 transition-all duration-500 border border-transparent hover:border-neutral-100"
                                >
                                <div className="relative w-16 h-16 bg-neutral-50 rounded-xl overflow-hidden shadow-inner">
                                    <Image src={item.images[0]} alt={item.name} fill className="object-contain mix-blend-multiply p-2 group-hover:scale-110 transition-transform duration-700" unoptimized={true} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-1">{item.name}</h3>
                                    <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-tighter">{item.category}</p>
                                </div>
                                <ArrowRight size={14} className="text-neutral-200 group-hover:text-accent group-hover:translate-x-2 transition-all" />
                                </button>
                            ))}
                        </div>
                        ) : !isLoading && (
                        <p className="text-center py-6 text-neutral-300 text-[10px] font-bold uppercase tracking-widest italic">Üzgünüz, eşleşme bulunamadı.</p>
                        )}
                    </motion.div>
                    ) : (
                    <motion.div
                        key="recommendations"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-12"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-accent">
                                <TrendingUp size={14} />
                                <span>Popüler Aramalar</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {popularSearches.map((tag) => (
                                <button 
                                    key={tag}
                                    onClick={() => setQuery(tag)}
                                    className="px-5 py-3 bg-neutral-50 hover:bg-black hover:text-white text-[9px] font-black uppercase tracking-widest transition-all rounded-full"
                                >
                                    {tag}
                                </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent block">Hızlı Kategoriler</span>
                            <div className="grid grid-cols-1 gap-1">
                                {categories.map((cat) => (
                                <Link 
                                    key={cat.slug}
                                    href={`/products?cat=${cat.slug}`}
                                    onClick={() => setSearchOpen(false)}
                                    className="group flex items-center justify-between py-3 hover:px-2 hover:bg-neutral-50/50 transition-all duration-500 rounded-lg"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800">{cat.name}</span>
                                    <ArrowRight size={14} className="text-neutral-200 group-hover:text-accent group-hover:translate-x-3 transition-all" />
                                </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchOverlay;
