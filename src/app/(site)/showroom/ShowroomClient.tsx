"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Plus, Minus, Maximize2, 
  Sun, Moon, Compass, Info, Sparkles, X
} from 'lucide-react';
import { useCart } from '@/store/useCart';
import { useUI } from '@/store/useUI';
import { formatPrice, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ShowroomClientProps {
  initialProducts: any[];
  localIp?: string;
}

// Helper to map product names/alt to parts dynamically
const getPiecesForProduct = (productName: string, defaultUrl: string) => {
  const nameLower = productName.toLowerCase();
  const normalized = nameLower
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o');

  if (normalized.includes("paket") || normalized.includes("imparator")) {
    return [
      { name: "Tüm Paket", url: defaultUrl },
      { name: "Koltuk Takımı", url: "/models/GlamVelvetSofa.glb" },
      { name: "Yatak Odası", url: "/models/SheenWoodLeatherSofa.glb" },
      { name: "Tekli Berjer", url: "/models/SheenChair.glb" }
    ];
  }
  if (normalized.includes("koltuk") || normalized.includes("sofa") || normalized.includes("kose") || normalized.includes("oturma")) {
    if (normalized.includes("berjer") || normalized.includes("tekli")) {
      return null;
    }
    return [
      { name: "Tüm Takım", url: defaultUrl },
      { name: "3'lü Koltuk", url: defaultUrl },
      { name: "Tekli Berjer", url: "/models/SheenChair.glb" }
    ];
  }
  if (normalized.includes("yatak") || normalized.includes("bedroom")) {
    return [
      { name: "Komple Set", url: defaultUrl },
      { name: "Karyola & Başlık", url: defaultUrl },
      { name: "Şifonyer / Komodin", url: "/models/SheenChair.glb" }
    ];
  }
  if (normalized.includes("yemek") || normalized.includes("masa")) {
    return [
      { name: "Komple Takım", url: defaultUrl },
      { name: "Yemek Masası", url: defaultUrl },
      { name: "Konsol", url: "/models/SheenChair.glb" }
    ];
  }
  return null;
};

const DEFAULT_SHOWROOM_PRODUCTS = [
  {
    id: 'qiens-imparator-paket',
    name: 'İmparator Lüks Düğün Paketi',
    slug: 'imparator-dugun-paketi',
    price: 145000,
    category: 'Düğün Paketi',
    description: 'Koltuk takımı, yatak odası ve yemek odasını tek konseptte buluşturan Qiens Home imza koleksiyonu.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
    colors: ['Zümrüt Yeşili', 'Safir Mavi', 'Krem', 'Antrasit'],
    threeDModelUrl: '/models/GlamVelvetSofa.glb',
  },
  {
    id: 'qiens-glam-velvet',
    name: 'Glam Velvet İnegöl Koltuk Takımı',
    slug: 'glam-velvet-koltuk',
    price: 64900,
    category: 'Koltuk Takımı',
    description: 'İtalyan kadife dokusu ve fırınlanmış gürgen iskeletiyle üst düzey konfor.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
    colors: ['Zümrüt Yeşili', 'Safir Mavi', 'Kiremit', 'Bej'],
    threeDModelUrl: '/models/GlamVelvetSofa.glb',
  },
  {
    id: 'qiens-sheen-leather',
    name: 'Sheen Royal Deri & Ahşap Set',
    slug: 'sheen-royal-set',
    price: 78500,
    category: 'Yatak & Oturma Odası',
    description: 'Doğal ceviz ahşap gövde ve birinci sınıf deri döşeme.',
    images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800'],
    colors: ['Ceviz', 'Kaba Taba Deri', 'Antik Kahve', 'Mat Siyah'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
  },
  {
    id: 'qiens-sheen-berjer',
    name: 'Qiens Özel Tasarım Tekli Berjer',
    slug: 'qiens-tekli-berjer',
    price: 18900,
    category: 'Berjer & Tamamlayıcı',
    description: 'Ergonomik sırt kavisi ve leke tutmayan dokuma kumaşıyla okuma ve dinlenme köşeleri için ideal.',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800'],
    colors: ['Kiremit', 'Zümrüt Yeşili', 'Krem', 'Antrasit'],
    threeDModelUrl: '/models/SheenChair.glb',
  }
];

const resolveSafeImage = (img?: string) => {
  const fallback = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';
  if (!img || typeof img !== 'string') return fallback;
  const trimmed = img.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed.replace(/\s/g, '%20');
  if (trimmed.startsWith('/')) return trimmed;
  if (trimmed.startsWith('images/')) return `/${trimmed}`;
  return `/images/${trimmed}`;
};

export default function ShowroomClient({ initialProducts, localIp = 'localhost' }: ShowroomClientProps) {
  const rawList = (Array.isArray(initialProducts) && initialProducts.length > 0) ? initialProducts : DEFAULT_SHOWROOM_PRODUCTS;
  const safeList = rawList.map((item, idx) => ({
    ...item,
    id: item?.id || `qiens-prod-${idx}`,
    name: item?.name || 'Qiens Home Koleksiyonu',
    category: item?.category || 'Özel Koleksiyon',
    price: Number(item?.price) || 64900,
    description: item?.description || 'Qiens Home birinci sınıf İnegöl mobilya koleksiyonu.',
    images: Array.isArray(item?.images) && item.images.length > 0 ? item.images.map(resolveSafeImage) : [resolveSafeImage(item?.image)],
    colors: Array.isArray(item?.colors) && item.colors.length > 0 ? item.colors : ['Zümrüt Yeşili', 'Safir Mavi', 'Krem', 'Antrasit'],
    threeDModelUrl: (item?.threeDModelUrl && String(item.threeDModelUrl).endsWith('.glb')) ? item.threeDModelUrl : '/models/GlamVelvetSofa.glb',
  }));
  const [products] = useState<any[]>(safeList);
  const [selectedProduct, setSelectedProduct] = useState<any>(safeList[0] || DEFAULT_SHOWROOM_PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState<string>(safeList[0]?.colors?.[0] || 'Zümrüt Yeşili');
  const [qty, setQty] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [environment, setEnvironment] = useState<'neutral' | 'sunset' | 'night' | 'studio'>('neutral');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showARModal, setShowARModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs'>('details');

  // Custom states for pieces and dimensions
  const pieces = selectedProduct ? getPiecesForProduct(selectedProduct.name, selectedProduct.threeDModelUrl || '/models/GlamVelvetSofa.glb') : null;
  const [selectedPieceUrl, setSelectedPieceUrl] = useState<string>(safeList[0]?.threeDModelUrl || '/models/GlamVelvetSofa.glb');
  const [showDimensions, setShowDimensions] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [modelDims, setModelDims] = useState<{
    size: { x: number; y: number; z: number };
    center: { x: number; y: number; z: number };
  } | null>(null);
  const [modelDims2, setModelDims2] = useState<{
    size: { x: number; y: number; z: number };
    center: { x: number; y: number; z: number };
  } | null>(null);

  const viewerRef = useRef<any>(null);
  const viewerRef2 = useRef<any>(null);

  const handleToggleDimensions = () => {
    if (!showDimensions) {
      const viewer = viewerRef.current;
      if (viewer && typeof viewer.getDimensions === 'function') {
        try {
          const size = viewer.getDimensions();
          const center = viewer.getBoundingBoxCenter();
          if (size && (size.x > 0 || size.y > 0 || size.z > 0)) {
            setModelDims({ size, center });
          }
        } catch (err) {
          console.error("Error reading dimensions in showroom on click:", err);
        }
      }
      if (isSplitView) {
        // Delay slightly for second model load check
        setTimeout(() => {
          const viewer2 = viewerRef2.current;
          if (viewer2 && typeof viewer2.getDimensions === 'function') {
            try {
              const size2 = viewer2.getDimensions();
              const center2 = viewer2.getBoundingBoxCenter();
              if (size2 && (size2.x > 0 || size2.y > 0 || size2.z > 0)) {
                setModelDims2({ size: size2, center: center2 });
              }
            } catch (err) {
              console.error("Error reading second dimensions on click:", err);
            }
          }
        }, 100);
      }
    }
    setShowDimensions(!showDimensions);
  };

  const addItem = useCart(state => state.addItem);
  const { openCart } = useUI();

  // Ensure <model-viewer> custom element script is always loaded and registered in browser
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.customElements?.get('model-viewer')) {
      const existing = document.querySelector('script[src*="model-viewer"]');
      if (!existing) {
        const s = document.createElement('script');
        s.type = 'module';
        s.src = '/scripts/model-viewer.min.js';
        document.head.appendChild(s);
      }
    }
  }, []);


  // Set default color when product changes
  useEffect(() => {
    if (selectedProduct) {
      const defaultColor = selectedProduct.colors && selectedProduct.colors.length > 0 
        ? selectedProduct.colors[0] 
        : 'Varsayılan';
      setSelectedColor(defaultColor);
      setQty(1);
      setSelectedPieceUrl(selectedProduct.threeDModelUrl);
      setShowDimensions(false);
      setIsSplitView(false);
      setModelDims(null);
      setModelDims2(null);
    }
  }, [selectedProduct]);

  // Set default color and dimensions when product/piece changes (Viewer 1)
  useEffect(() => {
    if (selectedProduct) {
      const defaultColor = selectedColor || (selectedProduct.colors && selectedProduct.colors.length > 0 
        ? selectedProduct.colors[0] 
        : 'Varsayılan');
      
      const handleLoad = () => {
        setTimeout(() => applyColorToModel(defaultColor), 600);
        const viewer = viewerRef.current;
        if (viewer && typeof viewer.getDimensions === 'function') {
          try {
            const size = viewer.getDimensions();
            const center = viewer.getBoundingBoxCenter();
            setModelDims({ size, center });
          } catch (err) {
            console.error("Error reading dimensions in showroom:", err);
          }
        }
      };

      const viewer = viewerRef.current;
      if (viewer) {
        viewer.addEventListener('load', handleLoad);
        if (viewer.model) {
          handleLoad();
        }
        return () => {
          if (viewer) viewer.removeEventListener('load', handleLoad);
        };
      }
    }
  }, [selectedProduct, selectedPieceUrl]);

  // Set default color and dimensions when split view or product changes (Viewer 2)
  useEffect(() => {
    if (isSplitView && selectedProduct) {
      const defaultColor = selectedColor || (selectedProduct.colors && selectedProduct.colors.length > 0 
        ? selectedProduct.colors[0] 
        : 'Varsayılan');
      
      const handleLoad2 = () => {
        setTimeout(() => applyColorToModel(defaultColor), 600);
        const viewer2 = viewerRef2.current;
        if (viewer2 && typeof viewer2.getDimensions === 'function') {
          try {
            const size = viewer2.getDimensions();
            const center = viewer2.getBoundingBoxCenter();
            setModelDims2({ size, center });
          } catch (err) {
            console.error("Error reading dimensions in showroom 2:", err);
          }
        }
      };

      const viewer2 = viewerRef2.current;
      if (viewer2) {
        viewer2.addEventListener('load', handleLoad2);
        if (viewer2.model) {
          handleLoad2();
        }
        return () => {
          if (viewer2) viewer2.removeEventListener('load', handleLoad2);
        };
      }
    }
  }, [isSplitView, selectedProduct]);

  // Apply color modification to the loaded model
  const applyColorToModel = async (colorName: string) => {
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

    const rgb = colorMap[colorName];
    if (!rgb) return;

    const viewers = [viewerRef.current];
    if (isSplitView && viewerRef2.current) {
      viewers.push(viewerRef2.current);
    }

    for (const viewer of viewers) {
      if (!viewer || !viewer.model) continue;
      const materials = viewer.model.materials;
      if (materials && materials.length > 0) {
        for (const mat of materials) {
          const name = (mat.name || '').toLowerCase();
          // Avoid modifying wood/metal legs and frames
          if (!name.includes('wood') && !name.includes('metal') && !name.includes('leg') && !name.includes('frame')) {
            try {
              // Await material loading to prevent WebGL context crashing
              if (typeof mat.ensureLoaded === 'function') {
                await mat.ensureLoaded();
              }
              if (mat.pbrMetallicRoughness) {
                mat.pbrMetallicRoughness.setBaseColorFactor(rgb);
              }
            } catch (err) {
              console.warn("Could not modify material color factor:", mat.name, err);
            }
          }
        }
      }
    }
  };


  // Synchronize color when split view changes
  useEffect(() => {
    if (isSplitView && selectedColor) {
      applyColorToModel(selectedColor);
    }
  }, [isSplitView]);


  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    applyColorToModel(colorName);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    addItem({
      id: selectedProduct.id,
      cartItemId: `${selectedProduct.id}-${selectedColor}`,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.images[0] || '',
      category: selectedProduct.category,
      qty: qty,
      selectedColor: selectedColor || undefined
    });
    
    openCart();
    toast.success(`${selectedProduct.name} (${selectedColor}) sepete eklendi!`);
  };

  const toggleFullscreen = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      viewer.requestFullscreen();
    }
  };

  const handleARClick = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (typeof window !== 'undefined' && window.innerWidth < 1024);
    if (isMobile && viewerRef.current) {
      try {
        viewerRef.current.activateAR();
      } catch (err) {
        console.error("Failed to activate AR:", err);
        setShowARModal(true);
      }
    } else {
      setShowARModal(true);
    }
  };

  if (!selectedProduct) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Compass className="animate-spin text-accent mb-6" size={40} />
        <p className="text-sm tracking-widest text-neutral-400 font-bold uppercase">Mağaza Yükleniyor...</p>
      </div>
    );
  }

  // Smart dynamic link generation: Use network IP if in development so phones on the same Wi-Fi can open it
  const shareUrl = typeof window !== 'undefined' 
    ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? `http://${localIp}:3000/ar/${selectedProduct.id}`
      : `${window.location.origin}/ar/${selectedProduct.id}`
    : `https://qienshome.com/ar/${selectedProduct.id}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=d4af37&bgcolor=0A0A0A&data=${encodeURIComponent(shareUrl)}`;

  // Fixed environmental preset configuration to avoid Poly Haven 404 network errors
  const getLightingAttributes = () => {
    switch (environment) {
      case 'sunset':
        return {
          'environment-image': 'neutral',
          'exposure': '1.3',
          'shadow-intensity': '1.5'
        };
      case 'night':
        return {
          'environment-image': 'neutral',
          'exposure': '0.5',
          'shadow-intensity': '0.8'
        };
      case 'studio':
        return {
          'environment-image': 'neutral',
          'exposure': '1.0',
          'shadow-intensity': '1.2'
        };
      default:
        return {
          'exposure': '1.0',
          'shadow-intensity': '1.2'
        };
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* 1. PRODUCT LIST / CAROUSEL (Flows horizontally on Mobile/Tablet, vertically on Desktop) */}
      <div className="col-span-1 lg:col-span-3 order-2 lg:order-1 bg-neutral-900/40 backdrop-blur-xl border border-white/5 p-4 lg:p-6 rounded-3xl flex flex-col gap-4 lg:gap-6 lg:max-h-[750px] overflow-hidden">
        <div className="hidden lg:block">
          <span className="text-[9px] font-black tracking-[0.4em] text-accent uppercase block mb-1">METAVERSE MAĞAZASI</span>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">KOLEKSİYONLAR</h2>
        </div>
        <div className="hidden lg:block h-[1px] bg-white/5" />
        
        <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden pb-4 lg:pb-0 scroll-smooth w-full no-scrollbar lg:custom-scrollbar">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={cn(
                "flex items-center gap-4 p-3 lg:p-4 rounded-2xl text-left border transition-all duration-300 group flex-shrink-0 w-[240px] lg:w-full",
                selectedProduct.id === p.id 
                  ? "bg-accent/10 border-accent/30 text-white shadow-lg" 
                  : "bg-[#121212]/50 border-white/5 text-neutral-400 hover:border-white/10 hover:text-white"
              )}
            >
              <div className="relative w-12 h-12 lg:w-16 lg:h-16 bg-neutral-900 border border-white/5 rounded-xl overflow-hidden p-1 flex-shrink-0 flex items-center justify-center">
                <img 
                  src={resolveSafeImage(p.images?.[0] || p.image)} 
                  alt={p.name || 'Qiens Home'} 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200'; }}
                  className="w-full h-full object-contain p-1 opacity-85 group-hover:scale-105 transition-transform" 
                />
              </div>
              <div className="flex-grow min-w-0">
                <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500 block mb-0.5">{p.category}</span>
                <h3 className="text-xs font-black truncate leading-snug group-hover:text-accent transition-colors">{p.name}</h3>
                <span className="text-xs font-serif italic font-light mt-1 block text-neutral-300">{formatPrice(p.price)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. MIDDLE COLUMN: 3D VIEWPORT STUDIO */}
      <div className="col-span-1 lg:col-span-6 order-1 lg:order-2 flex flex-col gap-6 relative">
        <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[600px] bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden group shadow-2xl">
          
          <div className={cn(
            "w-full h-full transition-all duration-500",
            isSplitView ? "grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-2 p-2 bg-[#050505]" : "p-0"
          )}>
            {/* Viewport 1 (Main Model) */}
            <div className="relative w-full h-full bg-gradient-to-b from-[#111] to-[#0A0A0A] rounded-[30px] overflow-hidden border border-white/5">
              <model-viewer
                ref={viewerRef}
                src={selectedPieceUrl || selectedProduct.threeDModelUrl || '/models/GlamVelvetSofa.glb'}
                alt={selectedProduct.name}
                camera-controls
                auto-rotate={autoRotate ? true : undefined}
                ar
                ar-modes="webxr scene-viewer quick-look"
                interaction-prompt="auto"
                touch-action="none"
                className="w-full h-full outline-none cursor-grab active:cursor-grabbing"
                style={{ display: 'block', width: '100%', height: '100%', minHeight: '380px', backgroundColor: 'transparent' } as any}
                {...getLightingAttributes()}
              >
                {/* Piece Selector (Top Center) */}
                {pieces && pieces.length > 0 && !isSplitView && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center bg-[#0e0e0e]/95 backdrop-blur-md border border-white/10 p-1 rounded-full shadow-2xl">
                    {pieces.map((piece) => (
                      <button
                        key={piece.name}
                        type="button"
                        onClick={() => setSelectedPieceUrl(piece.url)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                          selectedPieceUrl === piece.url
                            ? "bg-accent text-secondary"
                            : "text-white/60 hover:text-white"
                        )}
                      >
                        {piece.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Custom Hotspots / Annotations */}
                {showAnnotations && (
                  <>
                    <button 
                      slot="hotspot-cushion" 
                      data-position="0m 0.45m 0.1m" 
                      data-normal="0m 1m 0m" 
                      className="w-5 h-5 lg:w-6 lg:h-6 bg-accent border border-white rounded-full flex items-center justify-center shadow-2xl relative cursor-pointer group/spot active:scale-95"
                    >
                      <div className="absolute w-8 h-8 lg:w-12 lg:h-12 border border-accent rounded-full animate-ping opacity-70 pointer-events-none" />
                      <span className="text-[8px] font-bold text-black">+</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black/95 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl text-[9px] font-bold uppercase tracking-wider text-white whitespace-nowrap opacity-0 pointer-events-none group-hover/spot:opacity-100 transition-opacity">
                        <span className="text-accent block mb-1">Konfor Katmanı</span>
                        35 DNS High Resilience Sünger
                      </div>
                    </button>

                    <button 
                      slot="hotspot-frame" 
                      data-position="0.4m 0.15m -0.2m" 
                      data-normal="0m -1m 0m" 
                      className="w-5 h-5 lg:w-6 lg:h-6 bg-accent border border-white rounded-full flex items-center justify-center shadow-2xl relative cursor-pointer group/spot active:scale-95"
                    >
                      <div className="absolute w-8 h-8 lg:w-12 lg:h-12 border border-accent rounded-full animate-ping opacity-70 pointer-events-none" />
                      <span className="text-[8px] font-bold text-black">+</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black/95 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl text-[9px] font-bold uppercase tracking-wider text-white whitespace-nowrap opacity-0 pointer-events-none group-hover/spot:opacity-100 transition-opacity">
                        <span className="text-accent block mb-1">Mühendislik & İskelet</span>
                        1. Sınıf Fırınlanmış Gürgen Ağacı
                      </div>
                    </button>

                    <button 
                      slot="hotspot-fabric" 
                      data-position="-0.3m 0.55m -0.25m" 
                      data-normal="0m 0m -1m" 
                      className="w-5 h-5 lg:w-6 lg:h-6 bg-accent border border-white rounded-full flex items-center justify-center shadow-2xl relative cursor-pointer group/spot active:scale-95"
                    >
                      <div className="absolute w-8 h-8 lg:w-12 lg:h-12 border border-accent rounded-full animate-ping opacity-70 pointer-events-none" />
                      <span className="text-[8px] font-bold text-black">+</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black/95 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl text-[9px] font-bold uppercase tracking-wider text-white whitespace-nowrap opacity-0 pointer-events-none group-hover/spot:opacity-100 transition-opacity">
                        <span className="text-accent block mb-1">Dış Yüzey Kaplama</span>
                        Kolay Temizlenebilir İthal Dokuma
                      </div>
                    </button>
                  </>
                )}

                {/* Dimension Hotspots for Viewer 1 */}
                {showDimensions && modelDims && (
                  <>
                    <div
                      slot="hotspot-dim-width"
                      data-position={`${modelDims.center.x} ${modelDims.center.y - modelDims.size.y / 2} ${modelDims.center.z + modelDims.size.z / 2 + 0.08}`}
                      data-normal="0 0 1"
                      className="pointer-events-none"
                    >
                      <div className="bg-black/90 backdrop-blur-md border border-accent/40 px-3 py-1.5 rounded-xl text-[9px] font-bold text-white tracking-widest uppercase shadow-2xl flex items-center gap-2 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        Genişlik: {Math.round(modelDims.size.x * 100)} cm
                      </div>
                    </div>

                    <div
                      slot="hotspot-dim-height"
                      data-position={`${modelDims.center.x + modelDims.size.x / 2 + 0.08} ${modelDims.center.y} ${modelDims.center.z + modelDims.size.z / 2}`}
                      data-normal="1 0 0"
                      className="pointer-events-none"
                    >
                      <div className="bg-black/90 backdrop-blur-md border border-accent/40 px-3 py-1.5 rounded-xl text-[9px] font-bold text-white tracking-widest uppercase shadow-2xl flex items-center gap-2 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        Yükseklik: {Math.round(modelDims.size.y * 100)} cm
                      </div>
                    </div>

                    <div
                      slot="hotspot-dim-depth"
                      data-position={`${modelDims.center.x + modelDims.size.x / 2 + 0.08} ${modelDims.center.y - modelDims.size.y / 2} ${modelDims.center.z}`}
                      data-normal="1 0 0"
                      className="pointer-events-none"
                    >
                      <div className="bg-black/90 backdrop-blur-md border border-accent/40 px-3 py-1.5 rounded-xl text-[9px] font-bold text-white tracking-widest uppercase shadow-2xl flex items-center gap-2 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        Derinlik: {Math.round(modelDims.size.z * 100)} cm
                      </div>
                    </div>
                  </>
                )}
              </model-viewer>
            </div>

            {/* Viewport 2 (Berjer/Companion Model) */}
            {isSplitView && (
              <div className="relative w-full h-full bg-gradient-to-b from-[#111] to-[#0A0A0A] rounded-[30px] overflow-hidden border border-white/5 animate-fade-in">
                <model-viewer
                  ref={viewerRef2}
                  src="/models/SheenChair.glb"
                  alt="Set Tekli Koltuk"
                  camera-controls
                  auto-rotate={autoRotate ? true : undefined}
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  interaction-prompt="auto"
                  touch-action="none"
                  className="w-full h-full outline-none cursor-grab active:cursor-grabbing"
                  style={{ backgroundColor: 'transparent' } as any}
                  {...getLightingAttributes()}
                >
                  {/* Title Badge for second model */}
                  <div className="absolute top-4 left-4 z-40 bg-black/60 border border-white/10 px-3 py-1 rounded-full">
                    <span className="text-[8px] font-black uppercase tracking-widest text-accent">Tekli Berjer</span>
                  </div>

                  {/* Dimension Hotspots for Viewer 2 */}
                  {showDimensions && modelDims2 && (
                    <>
                      <div
                        slot="hotspot-dim-width"
                        data-position={`${modelDims2.center.x} ${modelDims2.center.y - modelDims2.size.y / 2} ${modelDims2.center.z + modelDims2.size.z / 2 + 0.08}`}
                        data-normal="0 0 1"
                        className="pointer-events-none"
                      >
                        <div className="bg-black/90 backdrop-blur-md border border-accent/40 px-3 py-1.5 rounded-xl text-[9px] font-bold text-white tracking-widest uppercase shadow-2xl flex items-center gap-2 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          Genişlik: {Math.round(modelDims2.size.x * 100)} cm
                        </div>
                      </div>

                      <div
                        slot="hotspot-dim-height"
                        data-position={`${modelDims2.center.x + modelDims2.size.x / 2 + 0.08} ${modelDims2.center.y} ${modelDims2.center.z + modelDims2.size.z / 2}`}
                        data-normal="1 0 0"
                        className="pointer-events-none"
                      >
                        <div className="bg-black/90 backdrop-blur-md border border-accent/40 px-3 py-1.5 rounded-xl text-[9px] font-bold text-white tracking-widest uppercase shadow-2xl flex items-center gap-2 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          Yükseklik: {Math.round(modelDims2.size.y * 100)} cm
                        </div>
                      </div>

                      <div
                        slot="hotspot-dim-depth"
                        data-position={`${modelDims2.center.x + modelDims2.size.x / 2 + 0.08} ${modelDims2.center.y - modelDims2.size.y / 2} ${modelDims2.center.z}`}
                        data-normal="1 0 0"
                        className="pointer-events-none"
                      >
                        <div className="bg-black/90 backdrop-blur-md border border-accent/40 px-3 py-1.5 rounded-xl text-[9px] font-bold text-white tracking-widest uppercase shadow-2xl flex items-center gap-2 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          Derinlik: {Math.round(modelDims2.size.z * 100)} cm
                        </div>
                      </div>
                    </>
                  )}
                </model-viewer>
              </div>
            )}
          </div>

          {/* Viewport controls overlay */}
          <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-40 flex flex-col gap-2">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full flex items-center gap-2 lg:gap-3">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300">3D Studio Active</span>
            </div>
            {isSplitView && (
              <div className="bg-accent/10 backdrop-blur-md border border-accent/30 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full flex items-center gap-2 lg:gap-3">
                <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-accent">Takım Modu Aktif</span>
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-40 flex items-center gap-2">
            {/* Split View Toggle Button */}
            {pieces && pieces.length > 0 && (
              <button
                type="button"
                onClick={() => setIsSplitView(!isSplitView)}
                className={cn(
                  "p-2 lg:p-3 rounded-full border text-white transition-all shadow-xl backdrop-blur-md",
                  isSplitView ? "bg-accent border-accent text-secondary" : "bg-black/40 border-white/10 hover:border-white/30"
                )}
                title={isSplitView ? "Tekli Görünüme Geç" : "Takım Görünümüne Geç"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="lg:w-[14px] lg:h-[14px]"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleDimensions}
              className={cn(
                "p-2 lg:p-3 rounded-full border text-white transition-all shadow-xl backdrop-blur-md",
                showDimensions ? "bg-accent border-accent text-secondary" : "bg-black/40 border-white/10 hover:border-white/30"
              )}
              title="Ölçüleri Göster/Gizle"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="lg:w-[14px] lg:h-[14px]"
              >
                <path d="M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                <path d="M3 6h4" />
                <path d="M3 10h8" />
                <path d="M3 14h4" />
                <path d="M3 18h8" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={cn(
                "p-2 lg:p-3 rounded-full border text-white transition-all shadow-xl backdrop-blur-md",
                showAnnotations ? "bg-accent border-accent text-secondary" : "bg-black/40 border-white/10 hover:border-white/30"
              )}
              title="Detay Etiketlerini Göster/Gizle"
            >
              <Info size={12} className="lg:w-[14px] lg:h-[14px]" />
            </button>
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className={cn(
                "p-2 lg:p-3 rounded-full border text-white transition-all shadow-xl backdrop-blur-md",
                autoRotate ? "bg-accent border-accent text-secondary" : "bg-black/40 border-white/10 hover:border-white/30"
              )}
              title="Otomatik Dönüşü Aç/Kapat"
            >
              <Compass size={12} className="lg:w-[14px] lg:h-[14px]" />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 lg:p-3 rounded-full bg-black/40 border border-white/10 text-white hover:border-white/30 transition-all shadow-xl backdrop-blur-md"
              title="Tam Ekran"
            >
              <Maximize2 size={12} className="lg:w-[14px] lg:h-[14px]" />
            </button>
          </div>

          {/* Environment controller overlay at bottom */}

            <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 z-40 bg-black/50 backdrop-blur-md border border-white/10 p-1 lg:p-1.5 rounded-full flex items-center gap-0.5 lg:gap-1">
              {[
                { id: 'neutral', icon: <Sun size={10} className="lg:w-[12px] lg:h-[12px]" />, label: 'Studio' },
                { id: 'sunset', icon: <Compass size={10} className="lg:w-[12px] lg:h-[12px]" />, label: 'Sunset' },
                { id: 'night', icon: <Moon size={10} className="lg:w-[12px] lg:h-[12px]" />, label: 'Cozy' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setEnvironment(preset.id as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                    environment === preset.id 
                      ? "bg-accent text-black font-black" 
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  {preset.icon}
                  <span className="hidden sm:inline">{preset.label}</span>
                </button>
              ))}
            </div>

            {/* AR Helper button */}
            <button
              onClick={handleARClick}
              className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 z-40 flex items-center gap-2 lg:gap-3 px-4 py-2.5 lg:px-6 lg:py-3.5 bg-accent text-black hover:bg-white transition-all duration-300 rounded-full text-[8px] lg:text-[9px] font-black tracking-widest uppercase shadow-2xl active:scale-95"
            >
              <Sparkles size={12} className="lg:w-[14px] lg:h-[14px]" />
              ODANDA GÖR (AR)
            </button>


          {/* Decorative subtle border shadow inside */}
          <div className="absolute inset-0 border border-white/5 rounded-[40px] pointer-events-none" />
        </div>
      </div>

      {/* 3. RIGHT COLUMN: CUSTOMIZATION & DETAIL SHEET */}
      <div className="col-span-1 lg:col-span-3 order-3 lg:order-3 bg-neutral-900/40 backdrop-blur-xl border border-white/5 p-6 lg:p-8 rounded-3xl flex flex-col justify-between gap-6 lg:gap-10">
        
        <div className="space-y-6 lg:space-y-8">
          <div>
            <span className="text-[8px] lg:text-[10px] font-black text-accent tracking-[0.4em] uppercase">{selectedProduct.category}</span>
            <h1 className="text-2xl lg:text-3xl font-serif text-white tracking-tight uppercase leading-tight mt-1">{selectedProduct.name}</h1>
            <div className="text-xl lg:text-2xl font-serif italic text-accent font-light mt-2 lg:mt-3">{formatPrice(selectedProduct.price)}</div>
          </div>

          {/* TAB SYSTEM FOR DETAILS */}
          <div className="border-b border-white/5 pb-2 flex gap-6 text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
            <button 
              onClick={() => setActiveTab('details')}
              className={cn("pb-2 transition-colors relative", activeTab === 'details' ? "text-accent" : "text-neutral-500 hover:text-white")}
            >
              Açıklama
              {activeTab === 'details' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />}
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={cn("pb-2 transition-colors relative", activeTab === 'specs' ? "text-accent" : "text-neutral-500 hover:text-white")}
            >
              Özellikler
              {activeTab === 'specs' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />}
            </button>
          </div>

          <div className="text-xs text-neutral-400 leading-relaxed font-medium min-h-[80px]">
            {activeTab === 'details' ? (
              <p>{selectedProduct.description}</p>
            ) : (
              <div className="space-y-3">
                {modelDims && (
                  <div className="bg-black/30 border border-white/5 p-3.5 rounded-2xl space-y-2 mb-3">
                    <span className="text-accent uppercase text-[8px] font-bold tracking-widest block">Canlı 3D Ölçü Analizi:</span>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                        <span className="block text-[6px] text-neutral-500 uppercase">Genişlik</span>
                        <span className="text-[10px] font-black text-white">{Math.round(modelDims.size.x * 100)} cm</span>
                      </div>
                      <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                        <span className="block text-[6px] text-neutral-500 uppercase">Yükseklik</span>
                        <span className="text-[10px] font-black text-white">{Math.round(modelDims.size.y * 100)} cm</span>
                      </div>
                      <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                        <span className="block text-[6px] text-neutral-500 uppercase">Derinlik</span>
                        <span className="text-[10px] font-black text-white">{Math.round(modelDims.size.z * 100)} cm</span>
                      </div>
                    </div>
                    {isSplitView && modelDims2 && (
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <span className="text-accent uppercase text-[7px] font-bold tracking-widest block">Berjer Ölçüsü:</span>
                        <div className="grid grid-cols-3 gap-1.5 text-center">
                          <div className="bg-black/20 p-1.5 rounded-lg border border-white/5">
                            <span className="text-[9px] font-black text-white">{Math.round(modelDims2.size.x * 100)} cm</span>
                          </div>
                          <div className="bg-black/20 p-1.5 rounded-lg border border-white/5">
                            <span className="text-[9px] font-black text-white">{Math.round(modelDims2.size.y * 100)} cm</span>
                          </div>
                          <div className="bg-black/20 p-1.5 rounded-lg border border-white/5">
                            <span className="text-[9px] font-black text-white">{Math.round(modelDims2.size.z * 100)} cm</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div><span className="text-neutral-500 uppercase text-[8px] lg:text-[9px] font-bold tracking-widest block">Boyutlar:</span> {selectedProduct.dimensions || "Özel İnegöl Ölçüleri"}</div>
                <div><span className="text-neutral-500 uppercase text-[8px] lg:text-[9px] font-bold tracking-widest block">Malzeme:</span> {selectedProduct.material || "Birinci Sınıf Lake / Meşe"}</div>
                <div><span className="text-neutral-500 uppercase text-[8px] lg:text-[9px] font-bold tracking-widest block">Garanti:</span> {selectedProduct.warranty || "2 Yıl Qiens Home Güvencesi"}</div>
              </div>
            )}
          </div>


          {/* COLOR CUSTOMIZER PANEL */}
          <div className="space-y-3 lg:space-y-4">
            <span className="text-[9px] lg:text-[10px] font-black tracking-widest text-neutral-400 uppercase block">Kumaş ve Renk Seçimi</span>
            <div className="flex flex-wrap gap-2 lg:gap-2.5">
              {(Array.isArray(selectedProduct?.colors) && selectedProduct.colors.length > 0 ? selectedProduct.colors : ['Zümrüt Yeşili', 'Safir Mavi', 'Krem', 'Antrasit']).map((color: string) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={cn(
                    "px-4 py-2.5 lg:px-5 lg:py-3 text-[8px] lg:text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all border text-center flex-grow sm:flex-none",
                    selectedColor === color 
                      ? "bg-accent border-accent text-black font-black" 
                      : "bg-[#111]/80 border-white/5 text-neutral-400 hover:border-white/20 hover:text-white"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CART ACTION CONTROLS */}
        <div className="space-y-4 lg:space-y-6 pt-4 lg:pt-6 border-t border-white/5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-[9px] lg:text-[10px] font-black tracking-widest text-neutral-400 uppercase">MİKTAR</span>
            <div className="flex items-center bg-[#111] border border-white/5 py-3 px-6 lg:py-4 lg:px-8 rounded-full gap-6 lg:gap-8">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))} 
                className="text-neutral-400 hover:text-accent transition-colors"
              >
                <Minus size={12}/>
              </button>
              <span className="text-xs font-black text-white w-4 text-center">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)} 
                className="text-neutral-400 hover:text-accent transition-colors"
              >
                <Plus size={12}/>
              </button>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-white text-black hover:bg-accent hover:text-black py-4 lg:py-5 rounded-full font-black text-[9px] lg:text-[10px] tracking-[0.4em] uppercase transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <ShoppingCart size={14} />
            SEPETE EKLE
          </button>
        </div>

      </div>

      {/* 4. MODAL: AR QUICK LOOK QR CODE HELPER */}
      <AnimatePresence>
        {showARModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e0e0e] border border-white/10 max-w-md w-full p-8 rounded-[32px] text-center relative shadow-2xl"
            >
              <button 
                onClick={() => setShowARModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 border border-white/5 text-neutral-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
                <Sparkles size={24} />
              </div>

              <h3 className="text-xl font-bold tracking-tight text-white uppercase mb-2">Artırılmış Gerçeklik (AR)</h3>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto mb-8 font-medium">
                Telefonunuzun kamerası yardımıyla bu mobilyayı doğrudan odanızın içine yerleştirin, gerçek boyutları ve kumaş dokusuyla deneyimleyin.
              </p>

              {/* QR Image Frame */}
              <div className="bg-black border border-white/5 p-6 rounded-[24px] max-w-[240px] mx-auto mb-8 flex flex-col items-center shadow-inner relative group">
                <img 
                  src={qrImageUrl} 
                  alt="AR QR Code" 
                  className="w-[180px] h-[180px] object-contain rounded-xl opacity-90 group-hover:opacity-100 transition-opacity" 
                />
                {/* Accent corners */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-accent" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-accent" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-accent" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-accent" />
              </div>

              <div className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">
                Kameranız ile Kodu Taratın
              </div>
              <p className="text-[10px] text-neutral-500 font-bold max-w-xs mx-auto leading-normal">
                Kamera uygulamanızı açıp kodu okutun. Yönlendirildiğiniz sayfada 3D model üzerindeki AR logosuna tıklayın.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
