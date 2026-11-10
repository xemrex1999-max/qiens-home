"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'

import { useCart } from '@/store/useCart'
import { useUI } from '@/store/useUI'
import { useWishlist } from '@/store/useWishlist'

interface ProductProps {
  product: {
    id?: string;
    _id?: string;
    name: string;
    price: number;
    oldPrice?: number;
    image?: string;
    images?: string[];
    category: string;
    badge?: string;
    averageRating?: number;
    reviewCount?: number;
  }
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  const { addItem } = useCart()
  const { openCart } = useUI()
  const { toggleItem, isInWishlist } = useWishlist()
  
  const isFavorite = isInWishlist(product.id || (product as any)._id)

  const resolveImage = (img: string | undefined): string => {
    if (!img) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
    
    // External URL (Cloudinary/Unsplash etc)
    if (img.startsWith('http')) {
      return img.replace(/\s/g, '%20');
    }
    
    // Local path handling
    let path = img;
    if (path.startsWith('/')) path = path.slice(1);
    if (path.startsWith('images/')) path = path.slice(7);
    
    return `/images/${path}`;
  };

  const firstImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const productId = product.id || (product as any)._id;
    addItem({
      id: productId,
      cartItemId: productId,
      name: product.name,
      price: product.price,
      image: firstImage || '',
      category: product.category,
      qty: 1
    })
    openCart()
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      id: product.id || (product as any)._id,
      name: product.name,
      price: product.price,
      image: firstImage || ''
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="group bg-white flex flex-col h-full hover:z-10"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-neutral-50 mb-4 md:mb-8 border border-neutral-100 group-hover:border-transparent group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700">
        <Link href={`/product/${product.id || (product as any)._id}`} className="absolute inset-0 z-10" />
        
        {/* 3D BADGE (HER ÜRÜNDE AKTİF) */}
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-accent/40 text-accent text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full z-20 flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          3D MODEL
        </div>

        {/* PRIMARY IMAGE */}
        <Image
          src={resolveImage(firstImage)}
          alt={product.name}
          fill
          className="object-contain p-1 md:p-8 transition-all duration-[1200ms] ease-out group-hover:scale-105 group-hover:opacity-0"
          unoptimized={true}
        />

        {/* HOVER IMAGE (SECONDARY) */}
        {product.images && product.images.length > 1 && (
          <Image
            src={resolveImage(product.images[1])}
            alt={`${product.name} - 2`}
            fill
            className="absolute inset-0 object-contain p-1 md:p-8 transition-all duration-[1200ms] ease-out scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100"
            unoptimized={true}
          />
        )}
        
        {/* PREMIUM BADGE */}
        {product.oldPrice && product.oldPrice > product.price && (
          <div className="absolute top-6 left-6 bg-accent text-dark text-[10px] px-4 py-1.5 font-black uppercase tracking-widest z-20">
            -%{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}
          </div>
        )}

        {/* QUICK ACTIONS BAR (MINIMALIST) */}
        <div className="absolute inset-x-6 bottom-6 z-20 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
          <button 
            onClick={handleAddToCart}
            className="flex-grow bg-secondary text-white py-4 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all rounded-sm flex items-center justify-center gap-3"
          >
            <ShoppingCart size={14} />
            Sepete Ekle
          </button>
          <button 
            onClick={handleToggleWishlist}
            className={cn(
              "w-12 bg-white border border-neutral-100 flex items-center justify-center transition-all hover:border-accent",
              isFavorite && "text-accent border-accent"
            )}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-grow space-y-4 px-2">
        <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.3em] block">
              {product.category}
            </span>
            {(product.averageRating !== undefined && product.averageRating > 0) && (
              <div className="flex items-center gap-1 opacity-50">
                  <Star size={8} fill="currentColor" className="text-accent" />
                  <span className="text-[9px] font-black">{product.averageRating.toFixed(1)}</span>
              </div>
            )}
        </div>

        <Link href={`/product/${product.id || (product as any)._id}`}>
          <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-serif italic text-secondary tracking-tight group-hover:text-accent transition-colors line-clamp-1 leading-none cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-4 pt-1 md:pt-2">
          <span className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-neutral-900 tracking-tight">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-[10px] md:text-xs font-light text-neutral-300 line-through tracking-tight">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard;
