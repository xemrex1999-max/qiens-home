"use client";

import React, { useState } from "react";
import ThreeDProductViewer from "@/components/product/ThreeDProductViewer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useUI } from "@/store/useUI";
import toast from "react-hot-toast";

export default function EliteBedroomClient() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const addItem = useCart((state) => state.addItem);
  const { openCart } = useUI();

  const handleAddToCart = () => {
    addItem({
      id: "elite-bedroom-demo",
      cartItemId: "elite-bedroom-demo",
      name: "Elite Cream Yatak Odası Takımı",
      price: 48500,
      image: "/images/elite-bedroom-user.jpg",
      category: "YATAK_ODASI",
      qty: 1,
    });
    openCart();
    toast.success("Elite Cream Sepete Eklendi!");
  };

  const handleQuickQuote = () => {
    toast("Müşteri temsilcilerimiz sizinle iletişime geçecek.", {
      icon: "📞",
      style: { background: "#000", color: "#fff" },
    });
  };

  const openLightbox = (src: string) => {
    setLightboxImg(src);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] font-sans selection:bg-accent/30">
      {/* Lightbox / Fullscreen Gallery */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={lightboxImg}
              alt="Elite Cream Tam Ekran"
              className="w-full h-full object-contain max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Breadcrumb */}
      <nav className="max-w-7xl mx-auto pt-10 px-6">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">
          <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
          <span className="w-1 h-1 bg-secondary/20 rounded-full"></span>
          <Link href="/kategoriler/yatak-odasi" className="hover:text-accent transition-colors">Yatak Odası</Link>
          <span className="w-1 h-1 bg-secondary/20 rounded-full"></span>
          <span className="text-secondary/80">Elite Cream</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-6 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* Left Column: 3D Experience and Gallery */}
        <div className="lg:col-span-7 space-y-8">
          <div className="group relative">
            <ThreeDProductViewer 
              src="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb" 
              poster="/images/elite-bedroom-user.jpg"
              alt="Elite Cream Yatak Odası 3D Görünüm"
            />
            <div className="mt-4 flex justify-between items-center text-[10px] font-bold tracking-widest text-secondary/30 uppercase">
              <span>* Demo 3D Model Kullanılmaktadır</span>
              <span>360° Etkileşimli</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => openLightbox("/images/elite-bedroom-user.jpg")}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-black/5 group cursor-zoom-in"
            >
                <img src="/images/elite-bedroom-user.jpg" alt="Elite Cream" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300" size={32} />
                </div>
            </button>
            <button 
              onClick={() => openLightbox("/images/elite-bedroom-user.jpg")}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-black/5 group cursor-zoom-in"
            >
                <img src="/images/elite-bedroom-user.jpg" alt="Elite Cream Detay" className="w-full h-full object-cover scale-150 origin-center transition-transform duration-700 group-hover:scale-[1.6]" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300" size={32} />
                </div>
            </button>
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-serif text-secondary leading-tight">
              Elite Cream <br />
              <span className="italic text-accent">Yatak Odası Takımı</span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-light text-secondary">48.500 TL</span>
              <span className="px-3 py-1 bg-accent/10 text-accent text-[9px] font-black tracking-widest uppercase rounded-full">
                Stokta Var
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-sm text-secondary/70 leading-relaxed font-light">
              Görseldeki tasarımı birebir yansıtan Elite Cream serisi, "Quiet Luxury" akımının en seçkin örneğidir. <strong>İthal krem buklet kumaş</strong> kaplı kavisli yatak başlığı, <strong>minimal dairesel metal kulplar</strong> ve <strong>sensörlü LED aydınlatmalı aynası</strong> ile yatak odanızı bir sanat galerisine dönüştürür.
            </p>
            
            <div className="grid grid-cols-2 gap-y-6 border-y border-border/50 py-8">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">Kumaş Detayı</p>
                <p className="text-xs font-bold text-secondary">Premium Krem Buklet</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">Aksesuar</p>
                <p className="text-xs font-bold text-secondary">Dairesel Metal Kulp</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">Teknoloji</p>
                <p className="text-xs font-bold text-secondary">LED Sensörlü Ayna</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">Kurulum</p>
                <p className="text-xs font-bold text-secondary">Ücretsiz Planlı Montaj</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <button onClick={handleAddToCart} className="w-full premium-button active:scale-[0.98] transition-transform">
              Sepete Ekle
            </button>
            <button onClick={handleQuickQuote} className="w-full py-5 border border-secondary/10 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-secondary hover:bg-neutral-soft active:scale-[0.98] transition-all">
              Hızlı Teklif Al
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-6 pt-6 grayscale opacity-40">
            <div className="flex gap-1 flex-col">
              <span className="text-[14px] font-bold">4.9/5</span>
              <span className="text-[8px] font-black uppercase tracking-tighter">Müşteri Puanı</span>
            </div>
            <div className="w-[1px] h-8 bg-secondary/10"></div>
            <p className="text-[10px] font-medium leading-tight">
              Bu hafta 12 kişi bu ürünü <br /> inceledi.
            </p>
          </div>
        </div>
      </main>

      {/* Product Details Section */}
      <section className="bg-secondary text-white py-24 px-6 relative">
        <div className="max-w-5xl mx-auto space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-accent text-[10px] font-black tracking-[.4em] uppercase">Detaylara Yolculuk</span>
              <h2 className="text-3xl font-serif">Zanaat ve <br /><span className="italic">Teknolojinin</span> Uyumu</h2>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                Görseldeki gardırop ve şifonyer üniteleri, en yüksek kalite standartlarında üretilmiştir. Dairesel kulp tasarımı sadece bir aksesuar değil, serinin imza dokunuşudur.
              </p>
            </div>
            <div className="aspect-square bg-white/5 rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center p-12 relative">
               <button 
                  onClick={() => setShowTooltip(!showTooltip)}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="text-center group cursor-pointer relative z-10"
               >
                  <div className="w-16 h-16 border border-accent/30 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:bg-accent/10 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 1 0 10 10"/></svg>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent group-hover:text-white transition-colors">İmza Kulp Tasarımı</p>

                  <AnimatePresence>
                    {showTooltip && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-64 p-6 bg-white text-secondary rounded-2xl shadow-2xl pointer-events-none"
                        >
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
                            <h4 className="text-xs font-black uppercase tracking-widest mb-2 border-b border-black/5 pb-2">Özel İşçilik</h4>
                            <p className="text-xs font-medium opacity-80 leading-relaxed normal-case tracking-normal">Pirunç kaplama el işçiliği dairesel kulplar, minimal tasarıma heykelsi bir dokunuş katarak lüks algısını zirveye taşır.</p>
                        </motion.div>
                    )}
                  </AnimatePresence>
               </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
