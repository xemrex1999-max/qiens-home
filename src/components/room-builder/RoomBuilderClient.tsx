"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Plus, Trash2, ShoppingCart, RotateCw, Grid, Layers, Sparkles, Move, Camera, X as XIcon, Upload } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/store/useCart';
import { useUI } from '@/store/useUI';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  images: string[];
  category: string;
  threeDModelUrl?: string;
}

interface PlacedItem {
  instanceId: string;
  product: Product;
  x: number; // percentage width
  y: number; // percentage height
  rotation: number; // in degrees
  scale: number; // scale multiplier
  zIndex: number; // z-index layer
}

// Child component for a single placed 3D item with its own drag controls
const PlacedItemComponent = ({ 
  item, 
  isActive, 
  canvasRef, 
  setActiveInstanceId, 
  handleRotateItem, 
  handleScaleItem, 
  handleLayerItem, 
  handleRemoveItem, 
  setPlacedItems,
  resolveImage
}: {
  item: PlacedItem;
  isActive: boolean;
  canvasRef: React.RefObject<HTMLDivElement>;
  setActiveInstanceId: (id: string | null) => void;
  handleRotateItem: (id: string) => void;
  handleScaleItem: (id: string, diff: number) => void;
  handleLayerItem: (id: string, diff: number) => void;
  handleRemoveItem: (id: string) => void;
  setPlacedItems: React.Dispatch<React.SetStateAction<PlacedItem[]>>;
  resolveImage: (img: string | undefined) => string;
}) => {
  const dragControls = useDragControls();

  const startDrag = (event: React.PointerEvent) => {
    dragControls.start(event);
  };

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false} // Prevents default dragging on the 3D model-viewer itself
      dragConstraints={canvasRef}
      dragElastic={0}
      style={{ 
        left: `${item.x}%`, 
        top: `${item.y}%`, 
        rotate: `${item.rotation}deg`,
        scale: item.scale,
        zIndex: item.zIndex
      }}
      onDrag={(event, info) => {
        if (canvasRef.current) {
          const canvasRect = canvasRef.current.getBoundingClientRect();
          // Calculate delta movement as percentage
          const currentX = item.x + (info.delta.x / canvasRect.width) * 100;
          const currentY = item.y + (info.delta.y / canvasRect.height) * 100;
          
          setPlacedItems((prev: PlacedItem[]) => prev.map(p => {
            if (p.instanceId === item.instanceId) {
              return { 
                ...p, 
                x: Math.max(0, Math.min(85, currentX)), 
                y: Math.max(0, Math.min(85, currentY)) 
              };
            }
            return p;
          }));
        }
      }}
      onMouseDown={(e) => { e.stopPropagation(); setActiveInstanceId(item.instanceId); }}
      onTouchStart={(e) => { e.stopPropagation(); setActiveInstanceId(item.instanceId); }}
      className={`absolute w-44 h-44 flex items-center justify-center group ${isActive ? 'ring-2 ring-accent/60 rounded-3xl bg-accent/5 backdrop-blur-[1px]' : ''}`}
    >
      {/* 3D Model Viewer - If 3D model is available, render interactive 3D model with transparent bg */}
      {item.product.threeDModelUrl ? (
        <div className="w-[95%] h-[95%] pointer-events-auto">
          <model-viewer
            src={item.product.threeDModelUrl}
            alt={item.product.name}
            camera-controls
            interaction-prompt="none"
            touch-action="pan-y"
            shadow-intensity="1.5"
            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
          />
        </div>
      ) : (
        <div className="relative w-[85%] h-[85%]">
          <Image 
            src={resolveImage(item.product.image || item.product.images[0])} 
            alt={item.product.name} 
            fill 
            className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] mix-blend-multiply" 
            unoptimized={true} 
          />
        </div>
      )}

      {/* Floating Drag Handle & Controllers (Only visible when active) */}
      {isActive && (
        <div 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute -top-14 left-1/2 -translate-x-1/2 flex gap-1.5 bg-secondary p-1 rounded-full shadow-2xl z-[1000] border border-white/10 items-center whitespace-nowrap"
        >
          {/* Mover Handle */}
          <button
            type="button"
            onPointerDown={startDrag}
            className="p-1.5 bg-accent hover:bg-white text-secondary rounded-full cursor-move transition-colors flex items-center justify-center active:scale-95"
            title="Sürükle / Taşı"
          >
            <Move className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3 bg-white/20" />

          {/* Rotate Button */}
          <button
            type="button"
            onClick={() => handleRotateItem(item.instanceId)}
            className="p-1.5 hover:bg-accent hover:text-secondary rounded-full text-white transition-colors"
            title="Döndür (45°)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          
          <div className="w-[1px] h-3 bg-white/20" />
          
          {/* Sizing Buttons */}
          <button
            type="button"
            onClick={() => handleScaleItem(item.instanceId, 0.1)}
            className="px-2 py-0.5 hover:bg-accent hover:text-secondary rounded-full text-white transition-colors text-[10px] font-black"
            title="Büyüt"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => handleScaleItem(item.instanceId, -0.1)}
            className="px-2 py-0.5 hover:bg-accent hover:text-secondary rounded-full text-white transition-colors text-[10px] font-black"
            title="Küçült"
          >
            -
          </button>
          
          <div className="w-[1px] h-3 bg-white/20" />
          
          {/* Layer Buttons */}
          <button
            type="button"
            onClick={() => handleLayerItem(item.instanceId, 1)}
            className="px-1.5 py-0.5 hover:bg-accent hover:text-secondary rounded-full text-[8px] text-white transition-colors font-bold"
            title="Katmanı Öne Getir"
          >
            ÖN
          </button>
          <button
            type="button"
            onClick={() => handleLayerItem(item.instanceId, -1)}
            className="px-1.5 py-0.5 hover:bg-accent hover:text-secondary rounded-full text-[8px] text-white transition-colors font-bold"
            title="Katmanı Arkaya Gönder"
          >
            ARKA
          </button>
          
          <div className="w-[1px] h-3 bg-white/20" />
          
          {/* Delete Button */}
          <button
            type="button"
            onClick={() => handleRemoveItem(item.instanceId)}
            className="p-1.5 hover:bg-red-600 hover:text-white rounded-full text-white transition-colors"
            title="Sil"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default function RoomBuilderClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Koltuk Takımları');
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);
  const [canvasBg, setCanvasBg] = useState<'grid' | 'living' | 'bedroom' | 'dining' | 'custom'>('living');
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addItem = useCart(state => state.addItem);
  const { openCart } = useUI();

  const bgTemplates = {
    grid: '',
    living: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    dining: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
  };

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=12');
        const data = await res.json();
        if (data && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Error fetching products for Room Builder:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleCustomBgUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Dosya boyutu 10MB\'dan küçük olmalıdır.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomBgUrl(reader.result as string);
      setCanvasBg('custom');
      toast.success('Oda fotoğrafınız yüklendi! Artık mobilyaları yerleştirin.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleCustomBgUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCustomBgUpload(e.dataTransfer.files[0]);
    }
  };

  const resolveImage = (img: string | undefined) => {
    if (!img) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
    if (img.startsWith('http')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  };

  const categories = [
    { name: 'Koltuk Takımları', label: 'Oturma Odası' },
    { name: 'Yatak Odası', label: 'Yatak Odası' },
    { name: 'Yemek Odası', label: 'Yemek Odası' }
  ];

  const handlePlaceItem = (product: Product) => {
    const instanceId = `${product.id}-${Date.now()}`;
    const newItem: PlacedItem = {
      instanceId,
      product,
      x: 35 + Math.random() * 10,
      y: 35 + Math.random() * 10,
      rotation: 0,
      scale: 1.0,
      zIndex: placedItems.length + 10
    };
    setPlacedItems([...placedItems, newItem]);
    setActiveInstanceId(instanceId);
    toast.success(`${product.name} odaya yerleştirildi!`);
  };

  const handleRemoveItem = (instanceId: string) => {
    setPlacedItems(placedItems.filter(item => item.instanceId !== instanceId));
    if (activeInstanceId === instanceId) {
      setActiveInstanceId(null);
    }
  };

  const handleRotateItem = (instanceId: string) => {
    setPlacedItems(placedItems.map(item => {
      if (item.instanceId === instanceId) {
        return { ...item, rotation: (item.rotation + 45) % 360 };
      }
      return item;
    }));
  };

  const handleScaleItem = (instanceId: string, diff: number) => {
    setPlacedItems(placedItems.map(item => {
      if (item.instanceId === instanceId) {
        const newScale = Math.max(0.4, Math.min(2.5, (item.scale || 1.0) + diff));
        return { ...item, scale: parseFloat(newScale.toFixed(1)) };
      }
      return item;
    }));
  };

  const handleLayerItem = (instanceId: string, diff: number) => {
    setPlacedItems(placedItems.map(item => {
      if (item.instanceId === instanceId) {
        return { ...item, zIndex: Math.max(1, (item.zIndex || 10) + diff) };
      }
      return item;
    }));
  };

  const handleBuySuite = () => {
    if (placedItems.length === 0) {
      toast.error("Sepete eklemek için önce odanıza mobilya eklemelisiniz!");
      return;
    }

    placedItems.forEach(item => {
      addItem({
        id: item.product.id,
        cartItemId: `${item.product.id}-Kombin`,
        name: `${item.product.name} (Tasarım Odası)`,
        price: item.product.price,
        image: resolveImage(item.product.image || item.product.images[0]),
        category: item.product.category,
        qty: 1
      });
    });

    openCart();
    toast.success("Oda kombinindeki tüm ürünler sepete eklendi!");
  };

  const totalPrice = placedItems.reduce((acc, curr) => acc + curr.product.price, 0);

  return (
    <div className="space-y-12">
      
      {/* Title */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
          <Layers className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-accent">İnteraktif Oda Tasarım Stüdyosu</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-secondary tracking-tighter uppercase">Kombin Tasarımcısı</h1>
        <p className="max-w-xl mx-auto text-sm text-neutral-400 font-light leading-relaxed">
          Kendi yaşam alanınızı tasarlayın! Sol menüden mobilyaları odaya yerleştirin. Ürünün üzerine tıklayarak **3D olarak döndürebilir**, **büyütebilir/küçültebilir**, katman sırasını ayarlayabilir veya sürükleyip taşıyabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR: PRODUCTS CATALOG */}
        <div className="lg:col-span-4 bg-neutral-50/50 border border-neutral-100 p-6 rounded-3xl space-y-6">
          <span className="text-[10px] font-black text-secondary uppercase tracking-widest block">Ürün Kataloğu</span>
          
          {/* Category Tabs */}
          <div className="flex gap-2 bg-neutral-100 p-1 rounded-full">
            {categories.map(cat => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex-1 py-2 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${selectedCategory === cat.name ? 'bg-secondary text-white shadow-sm' : 'text-neutral-500 hover:text-secondary'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
            {products
              .filter(p => p.category === selectedCategory)
              .map(p => (
                <div key={p.id} className="flex gap-4 p-3 bg-white rounded-2xl border border-neutral-100 hover:border-accent/40 shadow-sm transition-all group">
                  <div className="relative w-16 h-16 bg-neutral-50 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                    <Image src={resolveImage(p.image || p.images[0])} alt={p.name} fill className="object-contain p-1 mix-blend-multiply" unoptimized={true} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="text-[10px] font-black text-secondary uppercase tracking-wider line-clamp-1">{p.name}</h4>
                      <span className="text-[9px] text-neutral-400 font-serif italic">{formatPrice(p.price)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlaceItem(p)}
                      className="inline-flex items-center gap-1.5 self-start text-[8px] font-black text-accent uppercase tracking-widest hover:text-secondary group/btn"
                    >
                      <Plus className="w-3 h-3" /> Odaya Ekle
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* CENTER STAGE: FLOOR PLAN CANVAS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hidden file input for room photo upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div 
            ref={canvasRef}
            onClick={() => setActiveInstanceId(null)}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`w-full aspect-square md:aspect-[16/10] border rounded-3xl relative overflow-hidden shadow-inner cursor-default transition-all duration-500 bg-cover bg-center ${
              isDragOver 
                ? 'border-accent border-2 ring-2 ring-accent/20 bg-accent/5' 
                : 'border-neutral-200 bg-[#F5F5F5]'
            }`}
            style={{ 
              backgroundImage: canvasBg === 'grid' 
                ? 'radial-gradient(circle, #D4D4D4 1px, transparent 1px)'
                : canvasBg === 'custom' && customBgUrl
                ? `url(${customBgUrl})`
                : `url(${bgTemplates[canvasBg as keyof typeof bgTemplates]})`, 
              backgroundSize: canvasBg === 'grid' ? '24px 24px' : 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Drag-over overlay */}
            {isDragOver && (
              <div className="absolute inset-0 bg-accent/10 backdrop-blur-sm flex flex-col items-center justify-center z-50 pointer-events-none">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <Upload className="w-7 h-7 text-accent" />
                </div>
                <span className="mt-4 text-sm font-black text-accent uppercase tracking-widest">Fotoğrafı Bırakın</span>
              </div>
            )}

            {/* Floor Grid / Room Backdrop selector */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-40">
              <div className="flex items-center gap-2 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-200/50 shadow-sm flex-wrap">
                <span className="text-[9px] font-black text-secondary/70 uppercase tracking-widest">Arka Plan:</span>
                <div className="flex gap-1">
                  {[
                    { name: 'grid', label: 'Izgara' },
                    { name: 'living', label: 'Salon' },
                    { name: 'bedroom', label: 'Yatak Odası' },
                    { name: 'dining', label: 'Yemek Odası' }
                  ].map(bg => (
                    <button
                      key={bg.name}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCanvasBg(bg.name as any); }}
                      className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${
                        canvasBg === bg.name ? 'bg-accent text-secondary' : 'text-neutral-500 hover:text-secondary'
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                  {customBgUrl && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCanvasBg('custom'); }}
                      className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${
                        canvasBg === 'custom' ? 'bg-accent text-secondary' : 'text-neutral-500 hover:text-secondary'
                      }`}
                    >
                      Odanız
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Photo Button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="flex items-center gap-2 bg-secondary hover:bg-accent text-white hover:text-secondary px-3 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-lg border border-white/10 whitespace-nowrap"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Odanı Yükle</span>
              </button>
            </div>

            {/* Custom bg remove button */}
            {canvasBg === 'custom' && customBgUrl && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCustomBgUrl(null); setCanvasBg('living'); }}
                className="absolute top-4 right-16 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full z-40 shadow-md transition-colors"
                title="Fotoğrafı kaldır"
              >
                <XIcon className="w-3 h-3" />
              </button>
            )}

            {/* Drag to upload hint when no custom bg */}
            {canvasBg !== 'custom' && placedItems.length === 0 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full z-30 pointer-events-none">
                <Upload className="w-3 h-3 text-white/70" />
                <span className="text-[9px] text-white/70 font-black uppercase tracking-widest">Kendi oda fotoğrafınızı sürükleyin veya yukarıdan yükleyin</span>
              </div>
            )}


            {/* Empty Canvas Message */}
            {placedItems.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 pointer-events-none bg-black/5">
                <div className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                </div>
                <div className="space-y-1 bg-white/85 backdrop-blur-md p-4 rounded-2xl shadow-sm max-w-sm">
                  <span className="block text-xs font-black uppercase text-secondary">Tasarım Stüdyonuz Hazır</span>
                  <span className="block text-[9px] text-neutral-500 leading-relaxed font-light">Soldaki kataloğumuzdan odaya mobilya yerleştirin. Ürünleri sürükleyip boyutlandırarak kendi oda kombinlerinizi oluşturun.</span>
                </div>
              </div>
            )}

            {/* Placed Items Loop */}
            {placedItems.map(item => (
              <PlacedItemComponent
                key={item.instanceId}
                item={item}
                isActive={activeInstanceId === item.instanceId}
                canvasRef={canvasRef}
                setActiveInstanceId={setActiveInstanceId}
                handleRotateItem={handleRotateItem}
                handleScaleItem={handleScaleItem}
                handleLayerItem={handleLayerItem}
                handleRemoveItem={handleRemoveItem}
                setPlacedItems={setPlacedItems}
                resolveImage={resolveImage}
              />
            ))}
          </div>

          {/* COMBINATION BILL DETAILS */}
          <div className="bg-neutral-50/50 border border-neutral-100 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">Oda Kombin Özeti</span>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-serif text-secondary italic font-semibold">{formatPrice(totalPrice)}</span>
                <span className="text-[10px] font-black text-neutral-400 uppercase">({placedItems.length} Ürün Yerleştirildi)</span>
              </div>
            </div>

            <button
              onClick={handleBuySuite}
              disabled={placedItems.length === 0}
              className={`px-10 py-5 text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all ${placedItems.length > 0 ? 'bg-secondary hover:bg-accent text-white hover:text-secondary cursor-pointer' : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'}`}
            >
              <ShoppingCart className="w-4 h-4" /> Kombini Komple Satın Al
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
