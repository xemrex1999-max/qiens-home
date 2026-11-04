"use client"

import React, { useState, useMemo } from 'react'
import ProductCard from '@/components/ui/ProductCard'
import { motion } from 'framer-motion'
import { ChevronDown, SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIES, getCategoryValueBySlug } from '@/constants/categories'

interface ProductListClientProps {
  initialProducts: any[]
  initialCategory?: string
}

const ProductListClient: React.FC<ProductListClientProps> = ({ initialProducts, initialCategory = "all" }) => {
  const [activeCat, setActiveCat] = useState(initialCategory)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  
  const displayCategories = useMemo(() => [
    { name: "Tümü", slug: "all" },
    ...CATEGORIES
  ], [])

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts]
    
    if (activeCat !== "all") {
      const activeValue = getCategoryValueBySlug(activeCat)
      result = result.filter(p => p.category === activeValue)
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      result = result.filter(p => p.price >= Number(minPrice))
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      result = result.filter(p => p.price <= Number(maxPrice))
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price)
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [initialProducts, activeCat, sortBy, minPrice, maxPrice])

  return (
    <div className="space-y-16">
      {/* FILTER BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 border-b border-neutral-100 pb-12">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4 w-full lg:w-auto">
          {displayCategories.map((cat: any) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCat(cat.slug)}
              className={cn(
                "whitespace-nowrap text-[8px] font-black uppercase tracking-[0.4em] transition-all duration-500 relative pb-2",
                activeCat === cat.slug 
                  ? "text-secondary" 
                  : "text-neutral-300 hover:text-neutral-500"
              )}
            >
              {cat.name}
              <motion.div 
                layoutId="activeTab"
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-[1px] bg-accent",
                  activeCat === cat.slug ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center gap-4 border-r border-neutral-100 pr-8">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-2 transition-all hover:scale-110", viewMode === "grid" ? "text-accent" : "text-neutral-300 hover:text-neutral-600")}
            >
              <LayoutGrid size={18} strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-2 transition-all hover:scale-110", viewMode === "list" ? "text-accent" : "text-neutral-300 hover:text-neutral-600")}
            >
              <List size={18} strokeWidth={1.5} />
            </button>
          </div>
          
          <div className="relative group min-w-[180px]">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white border border-neutral-200 px-6 py-4 pr-12 text-[9px] font-black uppercase tracking-[0.2em] outline-none focus:border-accent cursor-pointer text-neutral-900 transition-all rounded-sm"
            >
              <option value="newest">En Yeniler</option>
              <option value="price-asc">Fiyat (Artan)</option>
              <option value="price-desc">Fiyat (Azalan)</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 group-hover:text-accent transition-colors" />
          </div>
        </div>
      </div>

      {/* PRICE FILTER ROW */}
      <div className="flex flex-col md:flex-row justify-end items-center gap-4 border-b border-neutral-100 pb-8 mt-[-10px]">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Fiyat Aralığı (TL):</span>
          <input 
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-24 px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-sm text-xs focus:border-accent outline-none text-neutral-900"
          />
          <span className="text-neutral-300">-</span>
          <input 
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24 px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-sm text-xs focus:border-accent outline-none text-neutral-900"
          />
        </div>
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length > 0 ? (
        <div className={cn(
          "grid gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-24 transition-all duration-500",
          viewMode === "grid" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
        )}>
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id || product._id} 
              product={product} 
            />
          ))}
        </div>
      ) : (
        <div className="py-48 text-center space-y-8 animate-in fade-in duration-700">
          <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-200">
            <SlidersHorizontal size={48} strokeWidth={1} />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900">Sonuç Bulunamadı</h3>
            <p className="text-sm text-neutral-500 font-light max-w-xs mx-auto leading-relaxed">Aradığınız kriterlere uygun ürün bulunmamaktadır. Lütfen filtrelerinizi güncelleyin.</p>
          </div>
          <button 
            onClick={() => {
              setActiveCat("all"); 
              setSortBy("newest");
              setMinPrice("");
              setMaxPrice("");
            }}
            className="px-10 py-4 bg-neutral-900 text-white text-[9px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all rounded-full"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      )}
      
      <div className="pt-24 border-t border-neutral-100 flex flex-col items-center gap-6">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">
          Görüntülenen: {filteredProducts.length} Ürün
        </span>
        <div className="w-16 h-1 bg-neutral-100 rounded-full" />
      </div>
    </div>
  )
}

export default ProductListClient;
