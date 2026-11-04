"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import { useUI } from '@/store/useUI'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const SearchModal = () => {
    const { isSearchOpen, setSearchOpen } = useUI()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!query.trim()) {
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

    // ESC key close
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

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-white flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 md:px-12 py-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">ARAMA</span>
                        <button 
                            onClick={() => setSearchOpen(false)}
                            className="p-2 hover:bg-neutral-50 rounded-full transition-colors"
                        >
                            <X size={32} strokeWidth={1} className="text-neutral-900" />
                        </button>
                    </div>

                    {/* Search Field */}
                    <div className="flex-1 max-w-5xl mx-auto w-full px-6 flex flex-col items-center justify-center -translate-y-20">
                        <form onSubmit={handleSearch} className="w-full relative group">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Koleksiyonumuzda arama yapın..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent border-b-[2px] border-neutral-100 py-10 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter placeholder:text-neutral-100 focus:outline-none focus:border-accent transition-all duration-700"
                            />
                            <button type="submit" className="absolute right-0 bottom-10 p-4 text-neutral-200 group-focus-within:text-accent transition-colors">
                                <Search size={48} strokeWidth={1.5} />
                            </button>
                        </form>

                        {/* Recent Results / Preview */}
                        <div className="w-full mt-20">
                            {isLoading ? (
                                <div className="text-center py-20">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300 animate-pulse">Sonuçlar Getiriliyor...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {results.slice(0, 4).map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                router.push(`/product/${item.slug}`)
                                                setSearchOpen(false)
                                            }}
                                            className="group flex items-center gap-6 text-left hover:bg-neutral-50 p-4 transition-all duration-500 rounded-sm"
                                        >
                                            <div className="relative w-24 h-24 bg-neutral-50 overflow-hidden flex-shrink-0">
                                                <Image 
                                                    src={item.images[0]} 
                                                    alt={item.name} 
                                                    fill 
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <h3 className="text-xl font-bold tracking-tight text-neutral-900 leading-none">{item.name}</h3>
                                                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{item.category}</p>
                                            </div>
                                            <ArrowRight size={20} className="text-neutral-100 group-hover:text-accent group-hover:translate-x-2 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            ) : query && (
                                <p className="text-center py-20 text-neutral-300 text-[11px] font-bold uppercase tracking-widest">Sonuç bulunamadı.</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SearchModal
