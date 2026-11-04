"use client";

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ThreeDProductViewerProps {
  src: string;
  poster?: string;
  alt?: string;
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


/**
 * ThreeDProductViewer - Profesyonel 3D Ürün Sergileme Modülü
 * Özellikler: AR Desteği, Gelişmiş Gölgelendirme, Tam Ekran Modu, Yükleme Göstergesi, Ölçülendirme ve Parça Seçimi
 */
const ThreeDProductViewer: React.FC<ThreeDProductViewerProps> = ({ 
  src, 
  poster = "https://images.unsplash.com/photo-1616594831848-ad743444bc1e?auto=format&fit=crop&w=1200",
  alt = "3D Ürün Modeli" 
}) => {
  const viewerRef = useRef<any>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Custom states for pieces and dimensions
  const pieces = getPiecesForProduct(alt, src);
  const [selectedPieceUrl, setSelectedPieceUrl] = useState(src);
  const [showDimensions, setShowDimensions] = useState(false);
  const [modelDims, setModelDims] = useState<{
    size: { x: number; y: number; z: number };
    center: { x: number; y: number; z: number };
  } | null>(null);

  const toggleFullscreen = () => {
    if (!viewerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      viewerRef.current.requestFullscreen();
    }
  };

  const handleToggleDimensions = () => {
    if (!showDimensions && !modelDims) {
      const viewer = viewerRef.current;
      if (viewer && typeof viewer.getDimensions === 'function') {
        try {
          const size = viewer.getDimensions();
          const center = viewer.getBoundingBoxCenter();
          if (size && (size.x > 0 || size.y > 0 || size.z > 0)) {
            setModelDims({ size, center });
          }
        } catch (err) {
          console.error("Error reading model dimensions:", err);
        }
      }
    }
    setShowDimensions(!showDimensions);
  };

  // Sync piece url when main product src changes
  useEffect(() => {
    setSelectedPieceUrl(src);
    setShowDimensions(false);
    setModelDims(null);
  }, [src]);

  useEffect(() => {
    setIsMounted(true);
    const viewer = viewerRef.current;
    if (!viewer) return;

    const onProgress = (event: any) => {
      const progress = event.detail.totalProgress * 100;
      setLoadProgress(progress);
      if (progress === 100) {
        setTimeout(() => setIsLoaded(true), 500);
      }
    };

    const onLoad = () => {
      if (viewer && typeof viewer.getDimensions === 'function') {
        try {
          const size = viewer.getDimensions();
          const center = viewer.getBoundingBoxCenter();
          setModelDims({ size, center });
        } catch (err) {
          console.error("Error reading model dimensions:", err);
        }
      }
    };

    viewer.addEventListener('progress', onProgress);
    viewer.addEventListener('load', onLoad);
    
    return () => {
      if (viewer) {
        viewer.removeEventListener('progress', onProgress);
        viewer.removeEventListener('load', onLoad);
      }
    };
  }, [selectedPieceUrl]);

  if (!isMounted) return (
    <div className="w-full h-full min-h-[350px] md:min-h-[500px] bg-[#fdfdfd] rounded-3xl animate-pulse" />
  );

  return (
    <div className="relative w-full h-full min-h-[350px] md:min-h-[500px] bg-[#fdfdfd] rounded-3xl overflow-hidden border border-neutral-100 group shadow-sm transition-all duration-700 hover:shadow-2xl">
      
      {/* 3D Model Viewer */}
      <model-viewer
        ref={viewerRef}
        src={selectedPieceUrl}
        poster={poster}
        alt={alt}
        camera-controls
        auto-rotate
        ar
        ar-modes="webxr scene-viewer quick-look"
        shadow-intensity="1.5"
        shadow-softness="1"
        interaction-prompt="auto"
        touch-action="none"
        className="outline-none cursor-grab active:cursor-grabbing w-full h-[350px] md:h-[500px]"
        style={{ backgroundColor: 'transparent' } as any}
      >
        {/* Loading Progress Bar */}
        {!isLoaded && (
          <div slot="poster" className="absolute inset-0 flex flex-col items-center justify-center bg-[#fdfdfd] z-50">
            {poster && <img src={poster} alt={alt} className="absolute inset-0 w-full h-full object-contain opacity-50 blur-sm" />}
            <div className="relative z-10 w-48 space-y-4">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/60">Mobilya Yükleniyor...</span>
                  <span className="text-[10px] font-black text-accent">{Math.round(loadProgress)}%</span>
               </div>
               <div className="w-full h-[2px] bg-neutral-100 overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-300 ease-out" 
                    style={{ width: `${loadProgress}%` }}
                  />
               </div>
            </div>
          </div>
        )}

        {/* Piece Selector Interface */}
        {pieces && pieces.length > 0 && (
          <div className="absolute top-8 right-8 z-40 flex items-center bg-secondary/95 backdrop-blur-md border border-white/10 p-1 rounded-full shadow-2xl">
            {pieces.map((piece) => (
              <button
                key={piece.name}
                type="button"
                onClick={() => setSelectedPieceUrl(piece.url)}
                className={cn(
                  "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
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

        {/* Dimension Hotspots */}
        {showDimensions && modelDims && (
          <>
            {/* Width Hotspot (Front bottom center) */}
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

            {/* Height Hotspot (Front right middle) */}
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

            {/* Depth Hotspot (Right bottom center) */}
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

        {/* Action Buttons Group (Bottom Right) */}
        <div className="absolute bottom-8 right-8 z-40 flex items-center gap-3">
          {/* Dimension Toggle Button */}
          <button
            type="button"
            onClick={handleToggleDimensions}
            className={cn(
              "flex items-center gap-3 px-6 py-4 border rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all active:scale-95 shadow-2xl",
              showDimensions 
                ? "bg-accent border-accent text-secondary font-black" 
                : "bg-secondary text-white hover:bg-accent hover:text-secondary border-none"
            )}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
              <path d="M3 6h4" />
              <path d="M3 10h8" />
              <path d="M3 14h4" />
              <path d="M3 18h8" />
            </svg>
            {showDimensions ? "Ölçüleri Gizle" : "Ölçüleri Göster"}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-3 px-6 py-4 bg-secondary text-white rounded-full text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl hover:bg-accent hover:text-secondary transition-all active:scale-95 group/fs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/fs:scale-110 transition-transform"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            Tam Ekran
          </button>
        </div>

        {/* Interactive Badge */}
        <div className="absolute top-8 left-8 z-40 pointer-events-none">
          <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary/80">3D Etkileşimli</span>
          </div>
        </div>

        {/* Hidden AR Button (Handled by model-viewer default) */}
        <div slot="ar-button" id="ar-button" className="hidden"></div>
      </model-viewer>

      {/* Aesthetic Accents */}
      <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-3xl z-20" />
    </div>
  );
};

export default ThreeDProductViewer;
