"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Sparkles, Compass, ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ARClientProps {
  product: {
    id: string;
    name: string;
    threeDModelUrl: string;
    image: string;
  };
}

export default function ARClient({ product }: ARClientProps) {
  const viewerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const activateAR = () => {
    const viewer = viewerRef.current;
    if (viewer && typeof viewer.activateAR === 'function') {
      try {
        viewer.activateAR();
      } catch (err) {
        console.error("Failed to activate AR:", err);
      }
    }
  };

  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer) {
      const handleProgress = (event: any) => {
        const progress = event.detail.totalProgress * 100;
        setLoadProgress(progress);
        if (progress === 100) {
          setIsLoaded(true);
          // Auto-trigger AR on load
          setTimeout(() => {
            activateAR();
          }, 1000);
        }
      };

      viewer.addEventListener('progress', handleProgress);
      return () => {
        if (viewer) viewer.removeEventListener('progress', handleProgress);
      };
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#0E0E0E] to-[#050505] text-white relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10" />

      {/* 1. TOP HEADER BAR */}
      <header className="p-6 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md z-30">
        <Link 
          href={`/product/${product.id}`}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Geri Dön
        </Link>
        <div className="flex items-center gap-2 text-[9px] font-black text-accent tracking-[0.2em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          AR Deneyimi
        </div>
      </header>

      {/* 2. CENTER: FULL SCREEN INTERACTIVE 3D MODEL VIEWPORT */}
      <main className="flex-grow flex items-center justify-center relative min-h-[300px]">
        
        {/* Loader HUD Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-20 backdrop-blur-sm transition-opacity duration-500">
            <div className="w-16 h-16 bg-accent/5 border border-accent/20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
              <Camera size={26} className="text-accent animate-pulse" />
            </div>
            <div className="w-48 space-y-3">
              <div className="flex justify-between text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                <span>MODEL YÜKLENİYOR</span>
                <span className="text-accent">{Math.round(loadProgress)}%</span>
              </div>
              <div className="w-full h-[2px] bg-neutral-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300 ease-out" 
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Visible model-viewer to guarantee browser resource allocation */}
        <model-viewer
          ref={viewerRef}
          src={product.threeDModelUrl}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          interaction-prompt="auto"
          touch-action="pan-y"
          alt={product.name}
          className="w-full h-full min-h-[350px]"
          style={{ backgroundColor: 'transparent' } as any}
        >
          <div slot="ar-button" id="ar-button" className="hidden"></div>
        </model-viewer>

        {/* Interactive Badge */}
        {isLoaded && (
          <div className="absolute top-6 left-6 z-20 bg-black/40 border border-white/5 px-3 py-1.5 rounded-full pointer-events-none">
            <span className="text-[8px] font-black tracking-widest text-neutral-300 uppercase flex items-center gap-2">
              <RotateCcw size={10} className="animate-spin text-accent" /> Dokunup Döndürebilirsiniz
            </span>
          </div>
        )}
      </main>

      {/* 3. BOTTOM PANEL: PRODUCT CONTROL DRAWER */}
      <footer className="p-8 bg-neutral-900/60 backdrop-blur-2xl border-t border-white/5 rounded-t-[40px] z-30 space-y-6">
        <div className="text-center max-w-xs mx-auto space-y-2">
          <span className="text-[9px] font-black text-neutral-500 tracking-widest uppercase">BEYAZIT MOBİLYAM</span>
          <h2 className="text-xl font-serif text-white tracking-tight uppercase leading-tight">{product.name}</h2>
          <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
            Kamerayı açtıktan sonra telefonunuzu yavaşça düz bir zemine (yer/zemin) doğrultarak dairesel hareketler yapın.
          </p>
        </div>

        <div className="max-w-xs mx-auto">
          {isLoaded ? (
            <motion.button
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={activateAR}
              className="w-full py-5 bg-accent text-black hover:bg-white rounded-full font-black text-[10px] tracking-[0.3em] uppercase transition-all duration-300 shadow-[0_20px_50px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3 active:scale-98 animate-bounce"
            >
              <Sparkles size={14} />
              KAMERAYI AÇ VE ODANA YERLEŞTİR
            </motion.button>
          ) : (
            <button
              disabled
              className="w-full py-5 bg-neutral-800 text-neutral-600 rounded-full font-black text-[10px] tracking-[0.3em] uppercase cursor-not-allowed flex items-center justify-center gap-3"
            >
              YÜKLENİYOR...
            </button>
          )}
        </div>
      </footer>

    </div>
  );
}
