"use client";

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Product3DViewProps {
  src?: string;
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
 * Product3DView Component
 * A premium 3D product showcase using Google's <model-viewer>.
 * Features: Responsive sizing, auto-rotation, AR support, fullscreen mode, dimensions and pieces.
 */
const Product3DView: React.FC<Product3DViewProps> = ({ 
  src = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
  alt = "3D Ürün Modeli"
}) => {
  const viewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Custom states for pieces and dimensions
  const pieces = getPiecesForProduct(alt, src);
  const [selectedPieceUrl, setSelectedPieceUrl] = useState(src);
  const [showDimensions, setShowDimensions] = useState(false);
  const [modelDims, setModelDims] = useState<{
    size: { x: number; y: number; z: number };
    center: { x: number; y: number; z: number };
  } | null>(null);

  // Fullscreen toggle logic
  const toggleFullscreen = () => {
    if (!viewerRef.current) return;
    
    // Check if the element is already in fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err: Error) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    } else {
      viewerRef.current.requestFullscreen().catch((err: Error) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
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
          console.error("Error reading dimensions in Product3DView:", err);
        }
      }
    }
    setShowDimensions(!showDimensions);
  };

  // Sync when parent changes the model url
  useEffect(() => {
    setSelectedPieceUrl(src);
    setShowDimensions(false);
    setModelDims(null);
  }, [src]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // Track loading progress
    const onProgress = (event: any) => {
      if (event.detail.totalProgress === 1) {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    const onLoad = () => {
      if (viewer && typeof viewer.getDimensions === 'function') {
        try {
          const size = viewer.getDimensions();
          const center = viewer.getBoundingBoxCenter();
          setModelDims({ size, center });
        } catch (err) {
          console.error("Error reading dimensions in Product3DView:", err);
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

  return (
    <div className="relative w-full overflow-hidden bg-[#f5f5f5] rounded-2xl shadow-sm border border-border/50 group transition-all duration-700 hover:shadow-xl">
      
      {/* 3D Model Viewer Element */}
      <model-viewer
        ref={viewerRef}
        src={selectedPieceUrl}
        alt={alt}
        camera-controls
        auto-rotate
        shadow-intensity="1"
        ar
        ar-modes="webxr scene-viewer quick-look"
        interaction-prompt="auto"
        touch-action="none"
        className="w-full h-[350px] md:h-[500px] outline-none cursor-grab active:cursor-grabbing"
        style={{ '--poster-color': 'transparent' } as any}
      >
        {/* Loading Spinner Slot */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f5f5f5] z-50 transition-opacity duration-500">
            <div className="relative w-16 h-16">
              {/* Spinning Outer Ring */}
              <div className="absolute inset-0 border-2 border-accent/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-2 border-accent rounded-full animate-spin"></div>
              {/* Pulsing Inner Dot */}
              <div className="absolute inset-[30%] bg-accent/30 rounded-full animate-pulse"></div>
            </div>
            <p className="mt-6 text-[10px] font-black tracking-[0.4em] text-secondary/60 uppercase animate-pulse">
              Deneyim Yükleniyor
            </p>
          </div>
        )}

        {/* Piece Selector Interface */}
        {pieces && pieces.length > 0 && (
          <div className="absolute top-6 right-6 z-40 flex items-center bg-[#1A1A1A]/95 backdrop-blur-md border border-white/10 p-1 rounded-full shadow-2xl">
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

        {/* Action Controls Group (Bottom Right) */}
        <div className="absolute bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Dimension Toggle Button */}
          <button
            type="button"
            onClick={handleToggleDimensions}
            className={cn(
              "flex items-center gap-3 px-5 py-3 border rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all active:scale-95 shadow-2xl",
              showDimensions 
                ? "bg-accent border-accent text-secondary font-black" 
                : "bg-secondary/80 backdrop-blur-xl border border-white/10 text-white hover:bg-accent hover:text-secondary"
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
            <span className="hidden sm:inline">{showDimensions ? "Ölçüleri Gizle" : "Ölçüleri Göster"}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-3 px-5 py-3 bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-white shadow-2xl transform transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-secondary group/btn active:scale-95"
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
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            <span className="hidden sm:inline">Tam Ekran</span>
          </button>
        </div>

        {/* AR Hint Slot (Hidden by default, shown by model-viewer) */}
        <div slot="ar-button" id="ar-button" className="hidden"></div>
      </model-viewer>

      {/* Aesthetic Accents */}
      <div className="absolute top-6 left-6 pointer-events-none z-10 transition-opacity duration-500 opacity-0 group-hover:opacity-100">
        <div className="flex flex-col gap-1">
          <div className="w-8 h-[1px] bg-accent/50"></div>
          <p className="text-[9px] font-bold tracking-[0.3em] text-secondary/40 uppercase">3D Interactive</p>
        </div>
      </div>

      {/* Decorative Shadow/Gradient at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Product3DView;
