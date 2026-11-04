"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ShoppingCart, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/store/useCart';
import toast from 'react-hot-toast';

interface VideoStory {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
}

const STORIES: VideoStory[] = [
  {
    id: 'story-1',
    title: 'Modern Zarafet',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-interior-design-41566-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    product: {
      id: 'zumrut-derin-koltuk',
      name: 'Zümrüt Derin Koltuk',
      price: 88000,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      category: 'Koltuk Takımları'
    }
  },
  {
    id: 'story-2',
    title: 'Konfor Konsepti',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cozy-living-room-with-a-modern-interior-41570-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80',
    product: {
      id: 'bulut-kose-takimi',
      name: 'Bulut Köşe Takımı',
      price: 67000,
      image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
      category: 'Koltuk Takımları'
    }
  },
  {
    id: 'story-3',
    title: 'Asil Ziyafetler',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-dining-room-interior-with-a-set-table-41576-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1617806118233-bcbe87af24fc?auto=format&fit=crop&w=600&q=80',
    product: {
      id: 'floransa-mermer-masa',
      name: 'Floransa Mermer Masa',
      price: 54000,
      image: 'https://images.unsplash.com/photo-1617806118233-bcbe87af24fc?auto=format&fit=crop&w=800&q=80',
      category: 'Yemek Odası'
    }
  }
];

export default function VideoCommerce() {
  const [activeStory, setActiveStory] = useState<VideoStory | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const addItem = useCart(state => state.addItem);

  const handleOpenStory = (story: VideoStory) => {
    setActiveStory(story);
  };

  const handleCloseStory = () => {
    setActiveStory(null);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      cartItemId: `${product.id}-Video`,
      name: `${product.name} (Video Seçimi)`,
      price: product.price,
      image: product.image,
      category: product.category,
      qty: 1
    });
    toast.success(`${product.name} sepete eklendi!`);
  };

  return (
    <div className="py-20 bg-neutral-50/30 overflow-hidden relative border-t border-b border-neutral-100">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-accent" />
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">Görsel Keşif</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-secondary tracking-tighter uppercase">Qiens Stories</h2>
          <p className="max-w-md text-xs text-neutral-400 font-light leading-relaxed">
            Mobilyalarımızın evlerindeki gerçek duruşunu dikey videolarda izleyin, beğendiğiniz modelleri doğrudan sepetinize atın.
          </p>
        </div>
      </div>

      {/* Stories Horizontal Reel Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 md:gap-8 pb-6 md:pb-0 no-scrollbar snap-x snap-mandatory">
          {STORIES.map(story => (
            <div 
              key={story.id}
              onClick={() => handleOpenStory(story)}
              className="relative aspect-[9/16] w-[240px] sm:w-[280px] md:w-auto flex-shrink-0 rounded-[32px] overflow-hidden border border-neutral-200/50 shadow-lg cursor-pointer group transform transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl mx-auto snap-start"
            >
              {/* Background Thumbnail Image */}
              <Image src={story.thumbnail} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" unoptimized={true} />
              
              {/* Overlay styling */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-between p-6">
                
                {/* Visual indicator badge */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white text-[8px] font-black uppercase tracking-widest shadow-inner">
                    <Sparkles className="w-2.5 h-2.5 text-accent animate-pulse" />
                    Hikaye
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Play circle */}
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white hover:text-secondary rounded-full flex items-center justify-center border border-white/20 text-white shadow-2xl transition-all self-center mx-auto transform group-hover:scale-110">
                    <Play className="w-5 h-5 ml-1 fill-current" />
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[8px] font-bold text-accent uppercase tracking-widest">{story.product.category}</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">{story.title}</h3>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN REELS LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-4 md:p-8"
          >
            {/* Background Blur backdrop */}
            <div className="absolute inset-0 filter blur-2xl opacity-30 select-none pointer-events-none">
              <Image src={activeStory.thumbnail} alt="" fill className="object-cover" unoptimized={true} />
            </div>

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-[510] flex flex-col justify-between"
            >
              {/* Loop Video Player */}
              <video
                ref={videoRef}
                src={activeStory.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Top Controls Overlay */}
              <div className="relative p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-[520] select-none">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{activeStory.title}</span>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10 text-white transition-all active:scale-95"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseStory}
                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10 text-white transition-all active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Product Overlay Card */}
              <div className="relative p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[520]">
                
                {/* Horizontal Product Card details */}
                <div className="flex gap-4 p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl">
                  <div className="relative w-16 h-16 bg-white/80 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                    <Image src={activeStory.product.image} alt={activeStory.product.name} fill className="object-contain p-1 mix-blend-multiply" unoptimized={true} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-[9px] font-bold text-accent uppercase tracking-widest">{activeStory.product.category}</h4>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider line-clamp-1">{activeStory.product.name}</h3>
                      <span className="text-[10px] text-white/80 font-serif italic">{formatPrice(activeStory.product.price)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, activeStory.product)}
                      className="inline-flex items-center gap-1.5 self-start text-[8px] font-black text-accent uppercase tracking-widest hover:text-white transition-colors"
                    >
                      <ShoppingCart className="w-3 h-3" /> Sepete Ekle
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
