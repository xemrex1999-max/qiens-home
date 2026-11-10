"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Plus, Minus, Share2, ArrowRight } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import { useCart } from '@/store/useCart'
import { useUI } from '@/store/useUI'
import { useWishlist } from '@/store/useWishlist'
import toast from 'react-hot-toast'

import Link from 'next/link'
import StarRating from '../ui/StarRating'
import ReviewSection from './ReviewSection'
import ThreeDProductViewer from './ThreeDProductViewer'

const ProductDetailClient = ({ product }: { product: any }) => {
  const [activeTab, setActiveTab] = useState<string | null>('desc')
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  )
  const [viewMode, setViewMode] = useState<'image' | '3d'>('3d')
  const [selectedFabric, setSelectedFabric] = useState<string>('Kadife')
  const [selectedWood, setSelectedWood] = useState<string>('Doğal Meşe')

  let fabricPrice = 0;
  if (selectedFabric === 'Hakiki Deri') {
    fabricPrice = product.price * 0.15;
  }
  let woodPrice = 0;
  if (selectedWood === 'Ceviz') {
    woodPrice = product.price * 0.05;
  }
  const totalPrice = product.price + fabricPrice + woodPrice;
  
  const handleColorChange = async (color: string) => {
    setSelectedColor(color);
    
    // Find the model-viewer element and change its material color factor
    const modelViewer = document.querySelector('model-viewer') as any;
    if (modelViewer && modelViewer.model) {
      const colorMap: Record<string, number[]> = {
        'Zümrüt Yeşili': [0.05, 0.25, 0.15, 1.0],
        'Safir Mavi': [0.05, 0.15, 0.45, 1.0],
        'Antrasit': [0.15, 0.15, 0.15, 1.0],
        'Krem': [0.95, 0.90, 0.82, 1.0],
        'Bulut Gri': [0.60, 0.62, 0.65, 1.0],
        'Ceviz': [0.35, 0.22, 0.12, 1.0],
        'Doğal Meşe': [0.76, 0.65, 0.52, 1.0],
        'Mat Siyah': [0.05, 0.05, 0.05, 1.0],
        'Koyu Ceviz': [0.25, 0.15, 0.08, 1.0],
        'Açık Ceviz': [0.55, 0.40, 0.28, 1.0],
        'Kiremit': [0.70, 0.25, 0.12, 1.0],
        'Bej': [0.90, 0.85, 0.73, 1.0],
        'Beyaz Mermer': [0.95, 0.95, 0.95, 1.0],
        'Siyah Portoro': [0.08, 0.08, 0.08, 1.0],
        'Gri Carrara': [0.80, 0.80, 0.80, 1.0],
        'Kaba Taba Deri': [0.60, 0.35, 0.15, 1.0],
        'Mat Siyah Deri': [0.08, 0.08, 0.08, 1.0],
        'Antik Kahve': [0.40, 0.22, 0.10, 1.0],
        'Haki Yeşil': [0.20, 0.25, 0.15, 1.0],
        'Altın Detaylı Beyaz': [0.95, 0.95, 0.90, 1.0]
      };
      
      const rgb = colorMap[color];
      if (rgb && modelViewer.model.materials) {
        for (const mat of modelViewer.model.materials) {
          const name = (mat.name || '').toLowerCase();
          if (!name.includes('wood') && !name.includes('metal') && !name.includes('leg') && !name.includes('frame')) {
            try {
              if (typeof mat.ensureLoaded === 'function') {
                await mat.ensureLoaded();
              }
              if (mat.pbrMetallicRoughness) {
                mat.pbrMetallicRoughness.setBaseColorFactor(rgb);
              }
            } catch (err) {
              console.warn("Could not modify material color:", mat.name, err);
            }
          }
        }
      }
    }
  };

  const [localReviews, setLocalReviews] = useState<any[]>(product.reviews || []);
  const [averageRating, setAverageRating] = useState(product.averageRating || 0);
  const [reviewCount, setReviewCount] = useState(product.reviewCount || 0);

  const handleReviewAdded = (newReview: any) => {
    const updatedReviews = [newReview, ...localReviews];
    setLocalReviews(updatedReviews);
    const total = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    setAverageRating(total / updatedReviews.length);
    setReviewCount(updatedReviews.length);
  };

  const addItem = useCart(state => state.addItem)
  const { openCart } = useUI()
  const { toggleItem, isInWishlist } = useWishlist()
  const isFavorite = isInWishlist(product.id)

  React.useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/products?cat=${encodeURIComponent(product.category)}&limit=4`)
        const data = await res.json()
        setRelatedProducts(data.products?.filter((p: any) => p.id !== product.id) || [])
      } catch (error) {
        console.error("Related products error:", error)
      }
    }
    fetchRelated()
  }, [product.category, product.id])

  React.useEffect(() => {
    if (selectedColor && product.threeDModelUrl) {
      const handleLoad = () => {
        setTimeout(() => handleColorChange(selectedColor), 500);
      };
      
      const modelViewer = document.querySelector('model-viewer') as any;
      if (modelViewer) {
        modelViewer.addEventListener('load', handleLoad);
        if (modelViewer.model) {
          handleLoad();
        }
        return () => {
          modelViewer.removeEventListener('load', handleLoad);
        };
      }
    }
  }, [selectedColor, product.threeDModelUrl]);

  const resolveImage = (img: string) => {
    if (!img) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
    if (img.startsWith('http')) return img.replace(/\s/g, '%20');
    if (img.startsWith('/')) return img;
    if (img.startsWith('images/')) return `/${img}`;
    return `/images/${img}`;
  };

  const productImages = product.images && product.images.length > 0 
    ? product.images.map(resolveImage)
    : [resolveImage(product.image)];

  const handleAddToCart = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Lütfen renk seçiniz.', { style: { background: '#000', color: '#fff' } })
      return
    }

    addItem({
      id: product.id,
      cartItemId: `${product.id}${selectedColor ? '-' + selectedColor : ''}-${selectedFabric}-${selectedWood}`,
      name: `${product.name} (${selectedFabric} / ${selectedWood})`,
      price: totalPrice,
      image: productImages[0],
      category: product.category,
      qty: qty,
      selectedColor: selectedColor || undefined,
      selectedFabric: selectedFabric,
      selectedWood: selectedWood
    })
    openCart()
    toast.success(`${product.name} sepete eklendi!`)
  }

  const toggleTab = (tab: string) => setActiveTab(activeTab === tab ? null : tab)

  return (
    <div className="space-y-32 mb-40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        
        {/* LEFT GALLERY - ASYMMETRIC Focus */}
        <div className="lg:col-span-7 grid grid-cols-12 gap-6">
          {/* VERTICAL THUMBS (Hidden on Mobile) */}
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-4">
            {productImages.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative aspect-[4/5] bg-neutral-50 border transition-all duration-500 overflow-hidden group",
                  activeImage === i ? "border-accent ring-1 ring-accent" : "border-neutral-100 hover:border-neutral-300"
                )}
              >
                <Image src={img} alt="" fill className="object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity" unoptimized={true} />
              </button>
            ))}
          </div>

          {/* MAIN IMAGE or 3D VIEWER */}
          <div className="col-span-12 lg:col-span-10">
            {product.threeDModelUrl && (
              <div className="flex justify-center mb-6 bg-neutral-50/80 backdrop-blur-md p-1.5 rounded-full border border-neutral-100/50 max-w-[280px] mx-auto">
                <button 
                  type="button"
                  onClick={() => setViewMode('image')} 
                  className={cn(
                    "flex-1 py-2 px-6 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                    viewMode === 'image' 
                      ? "bg-secondary text-white shadow-md" 
                      : "text-neutral-400 hover:text-secondary"
                  )}
                >
                  Fotoğraflar
                </button>
                <button 
                  type="button"
                  onClick={() => setViewMode('3d')} 
                  className={cn(
                    "flex-1 py-2 px-6 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                    viewMode === '3d' 
                      ? "bg-secondary text-white shadow-md" 
                      : "text-neutral-400 hover:text-secondary"
                  )}
                >
                  3D Görünüm
                </button>
              </div>
            )}

            {product.threeDModelUrl && viewMode === '3d' ? (
              <div className="relative aspect-square md:aspect-[4/5]">
                <ThreeDProductViewer 
                  src={product.threeDModelUrl} 
                  poster={productImages[activeImage]} 
                  alt={product.name}
                />
              </div>
            ) : (
              <motion.div 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-square md:aspect-[4/5] bg-neutral-50 overflow-hidden group border border-neutral-100 p-8 flex items-center justify-center"
              >
                <Image 
                  src={productImages[activeImage]} 
                  alt={product.name}
                  fill
                  className="object-contain mix-blend-multiply transition-transform duration-1000 md:group-hover:scale-[1.1]"
                  priority
                  unoptimized={true}
                />
                {product.oldPrice && (
                  <div className="absolute top-10 left-10 bg-accent text-white text-[10px] px-6 py-2 font-black uppercase tracking-[0.3em] shadow-2xl z-20">
                    Sale
                  </div>
                )}
              </motion.div>
            )}
            
            {/* THUMBS (Mobile Only) */}
            <div className="flex gap-4 mt-6 lg:hidden overflow-x-auto pb-4 no-scrollbar">
               {productImages.map((img: string, i: number) => (
                <button 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={cn(
                    "relative flex-shrink-0 w-24 aspect-square bg-neutral-50 border rounded-sm overflow-hidden",
                    activeImage === i ? "border-accent" : "border-neutral-100"
                    )}
                >
                    <Image src={img} alt="" fill className="object-cover mix-blend-multiply" unoptimized={true} />
                </button>
               ))}
            </div>
          </div>
        </div>

        {/* RIGHT INFO - EDITORIAL Luxe */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 space-y-16 lg:sticky lg:top-40"
        >
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-[1px] bg-accent" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">L`Autre Luxe</span>
              </div>
              <div className="flex gap-4">
                <button onClick={() => toggleItem({ id: product.id, name: product.name, price: product.price, image: productImages[0] })} className={cn("text-neutral-300 hover:text-accent transition-colors", isFavorite && "text-accent")}>
                  <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{product.category}</span>
               <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-secondary tracking-tighter leading-[1.1]">
                  {product.name}
               </h1>
            </div>

            <div className="flex items-baseline gap-6">
                <span className="text-4xl md:text-5xl font-serif text-secondary italic">
                    {formatPrice(totalPrice)}
                </span>
                {product.oldPrice && (
                    <span className="text-xl text-neutral-300 line-through font-light decoration-accent/30 decoration-2">
                        {formatPrice(product.oldPrice)}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-4 py-6 border-y border-neutral-50">
              <StarRating rating={averageRating} size={16} />
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">({reviewCount} İnceleme)</span>
            </div>
          </div>

          <div className="space-y-10">
            {/* COLOR */}
            {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Kolleksiyon Renkleri</span>
                    <div className="flex flex-wrap gap-3">
                        {product.colors.map((color: string) => (
                            <button
                                key={color}
                                onClick={() => handleColorChange(color)}
                                className={cn(
                                    "px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                                    selectedColor === color 
                                        ? "border-secondary bg-secondary text-white shadow-xl" 
                                        : "border-neutral-100 text-neutral-600 hover:border-neutral-300"
                                )}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* FABRIC SELECTION */}
            <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Premium Kumaş Seçimi</span>
                <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'Kadife', label: 'Kadife' },
                      { name: 'Keten', label: 'Keten Dokuma' },
                      { name: 'Buklet', label: 'Buklet' },
                      { name: 'Hakiki Deri', label: 'Hakiki Deri (+%15)' }
                    ].map((fab) => (
                        <button
                            key={fab.name}
                            type="button"
                            onClick={() => setSelectedFabric(fab.name)}
                            className={cn(
                                "px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                                selectedFabric === fab.name 
                                    ? "border-secondary bg-secondary text-white shadow-xl" 
                                    : "border-neutral-100 text-neutral-600 hover:border-neutral-300"
                            )}
                        >
                            {fab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* WOOD SELECTION */}
            <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Ahşap Cilası / Ayak Tipi</span>
                <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'Doğal Meşe', label: 'Doğal Meşe' },
                      { name: 'Mat Siyah', label: 'Mat Siyah Lake' },
                      { name: 'Ceviz', label: 'Masif Ceviz (+%5)' }
                    ].map((wd) => (
                        <button
                            key={wd.name}
                            type="button"
                            onClick={() => setSelectedWood(wd.name)}
                            className={cn(
                                "px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                                selectedWood === wd.name 
                                    ? "border-secondary bg-secondary text-white shadow-xl" 
                                    : "border-neutral-100 text-neutral-600 hover:border-neutral-300"
                            )}
                        >
                            {wd.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ACTION */}
            <div className="space-y-6">
                <div className="flex items-center gap-6">
                    <div className="flex items-center bg-neutral-50 border border-neutral-100 py-6 px-10 gap-12">
                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-neutral-400 hover:text-secondary"><Minus size={16}/></button>
                        <span className="text-[11px] font-black text-secondary w-4 text-center">{qty}</span>
                        <button onClick={() => setQty(qty + 1)} className="text-neutral-400 hover:text-secondary"><Plus size={16}/></button>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="flex-1 bg-secondary text-white py-6 font-black text-[10px] tracking-[0.4em] uppercase hover:bg-black transition-all shadow-2xl active:scale-[0.98]"
                    >
                        Sepete Ekle
                    </button>
                </div>
                <button className="w-full border border-secondary text-secondary py-6 font-black text-[10px] tracking-[0.4em] uppercase hover:bg-secondary hover:text-white transition-all">
                    Siparişi Tamamla
                </button>
            </div>
          </div>

          {/* ACCORDION */}
          <div className="border-t border-neutral-100">
            {[
              { id: 'desc', title: 'Ürün Detayları', content: product.description },
              { id: 'tech', title: 'Ölçüler & Teknik', content: `Boyutlar: ${product.dimensions || "Özel İnegöl Ölçüleri"}\nMalzeme: ${product.material || "Birinci Sınıf Lake / Meşe"}\nGaranti: 2 YIL Qiens Home Güvencesi` },
              { id: 'deliv', title: 'Nakliye & Kurulum', content: "Türkiye genelinde profesyonel ekiplerimizle ücretsiz kurulum ve kapıya teslimat." }
            ].map(tab => (
              <div key={tab.id} className="border-b border-neutral-50">
                <button onClick={() => toggleTab(tab.id)} className="w-full py-8 flex justify-between items-center group">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary group-hover:text-accent transition-colors">{tab.title}</span>
                  <Plus size={14} className={cn("transition-transform duration-500", activeTab === tab.id && "rotate-45 text-accent")} />
                </button>
                <AnimatePresence>
                  {activeTab === tab.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="pb-8 text-xs text-neutral-400 font-medium leading-relaxed whitespace-pre-line">{tab.content}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* BADGES */}
          <div className="grid grid-cols-3 gap-8 pt-10">
             <div className="flex flex-col items-center gap-4 text-center opacity-40 hover:opacity-100 transition-opacity uppercase">
                <Truck size={24} strokeWidth={1} />
                <span className="text-[8px] font-black tracking-widest">Free Cargo</span>
             </div>
             <div className="flex flex-col items-center gap-4 text-center opacity-40 hover:opacity-100 transition-opacity uppercase">
                <ShieldCheck size={24} strokeWidth={1} />
                <span className="text-[8px] font-black tracking-widest">2 Years</span>
             </div>
             <div className="flex flex-col items-center gap-4 text-center opacity-40 hover:opacity-100 transition-opacity uppercase">
                <RotateCcw size={24} strokeWidth={1} />
                <span className="text-[8px] font-black tracking-widest">Returns</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* REVIEWS */}
      <section id="reviews" className="pt-32 border-t border-neutral-100">
         <ReviewSection productId={product.id} initialReviews={localReviews} onReviewAdded={handleReviewAdded} />
      </section>

      {/* RELATED */}
      {relatedProducts.length > 0 && (
        <section className="pt-32">
            <div className="flex items-center gap-4 mb-20">
                <div className="w-12 h-[px] bg-accent" />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">Koleksiyon Devamı</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {relatedProducts.map(p => (
                   <div key={p.id} className="group cursor-pointer">
                      <Link href={`/product/${p.slug}`} className="block relative aspect-[4/5] bg-neutral-50 border border-neutral-100 overflow-hidden p-6 mb-8 items-center justify-center flex">
                        <Image src={resolveImage(p.images[0])} alt={p.name} fill className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000" unoptimized={true} />
                      </Link>
                      <div className="space-y-4">
                        <h4 className="text-[13px] font-black uppercase tracking-widest text-secondary leading-none">{p.name}</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-serif italic text-neutral-400">{formatPrice(p.price)}</span>
                            <Link href={`/product/${p.slug}`} className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-2 group/btn">
                                İNCELE <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                      </div>
                   </div>
                ))}
            </div>
        </section>
      )}

      {/* MOBILE STICKY */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-neutral-100 p-6 z-[100] lg:hidden">
          <div className="flex items-center justify-between gap-6 max-w-md mx-auto">
              <div className="flex flex-col">
                  <span className="text-[9px] font-black text-neutral-300 uppercase line-through">{product.oldPrice ? formatPrice(product.oldPrice) : ""}</span>
                  <span className="text-2xl font-serif italic text-secondary">{formatPrice(totalPrice)}</span>
              </div>
              <button onClick={handleAddToCart} className="px-12 py-5 bg-secondary text-white font-black text-[10px] tracking-[0.3em] uppercase shadow-2xl">
                  SEPETE EKLE
              </button>
          </div>
      </div>
    </div>
  )
}

export default ProductDetailClient;
