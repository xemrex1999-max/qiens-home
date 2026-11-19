"use client";

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  RotateCw, Trash2, Plus, Sparkles, Maximize2, Move,
  Box, Layers, Eye, X, DoorOpen, Sliders
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Real3DRoomScene = dynamic(() => import('./Real3DRoomScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] rounded-[28px] bg-[#0c0d12] border border-amber-400/30 flex items-center justify-center text-xs font-black uppercase tracking-widest text-amber-400">
      Gerçek 3D Oda Yükleniyor...
    </div>
  ),
});

export interface FurniturePieceSpec {
  id: string;
  name: string;
  shortName: string;
  type: 'wardrobe' | 'bed' | 'dresser' | 'nightstand' | 'pouf' | 'table' | 'console' | 'tv' | 'chair' | 'sofa3' | 'sofa2' | 'armchair' | 'coffeetable';
  widthCm: number;
  depthCm: number;
  heightCm: number;
  url: string;
  defaultX: number;
  defaultY: number;
  defaultRot: number;
}

export interface PlacedPiece extends FurniturePieceSpec {
  instanceId: string;
  xCm: number;
  yCm: number;
  rotation: number;
  isOpen?: boolean; // Interactive doors, drawers, hydraulic baza, extendable table!
}

export const getDetailedPiecesForProduct = (productName: string, category: string, defaultUrl: string): FurniturePieceSpec[] => {
  const combined = `${productName} ${category}`.toLowerCase()
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ç/g, 'c').replace(/ö/g, 'o');

  if (combined.includes('yemek') || combined.includes('masa')) {
    return [
      { id: 'piece-console', name: 'Konsol & Ayna Ünitesi', shortName: 'Konsol', type: 'console', widthCm: 210, depthCm: 48, heightCm: 85, url: '/models/konsol.glb', defaultX: 145, defaultY: 12, defaultRot: 0 },
      { id: 'piece-table', name: 'Açılır Yemek Masası', shortName: 'Yemek Masası', type: 'table', widthCm: 200, depthCm: 100, heightCm: 78, url: '/models/yemek-masasi.glb', defaultX: 150, defaultY: 160, defaultRot: 0 },
      { id: 'piece-chair-1', name: 'Yemek Sandalyesi (Üst Sol)', shortName: 'Sandalye 1', type: 'chair', widthCm: 52, depthCm: 55, heightCm: 88, url: '/models/SheenChair.glb', defaultX: 175, defaultY: 98, defaultRot: 0 },
      { id: 'piece-chair-2', name: 'Yemek Sandalyesi (Üst Sağ)', shortName: 'Sandalye 2', type: 'chair', widthCm: 52, depthCm: 55, heightCm: 88, url: '/models/SheenChair.glb', defaultX: 270, defaultY: 98, defaultRot: 0 },
      { id: 'piece-chair-3', name: 'Yemek Sandalyesi (Alt Sol)', shortName: 'Sandalye 3', type: 'chair', widthCm: 52, depthCm: 55, heightCm: 88, url: '/models/SheenChair.glb', defaultX: 175, defaultY: 268, defaultRot: 180 },
      { id: 'piece-chair-4', name: 'Yemek Sandalyesi (Alt Sağ)', shortName: 'Sandalye 4', type: 'chair', widthCm: 52, depthCm: 55, heightCm: 88, url: '/models/SheenChair.glb', defaultX: 270, defaultY: 268, defaultRot: 180 },
      { id: 'piece-tv', name: 'Vitrin / TV Ünitesi', shortName: 'Vitrin', type: 'tv', widthCm: 160, depthCm: 45, heightCm: 140, url: '/models/konsol.glb', defaultX: 15, defaultY: 130, defaultRot: 90 }
    ];
  }

  if (combined.includes('koltuk') || combined.includes('sofa') || combined.includes('oturma') || combined.includes('kose')) {
    return [
      { id: 'piece-sofa3', name: "3'lü Ana Koltuk", shortName: "3'lü Koltuk", type: 'sofa3', widthCm: 235, depthCm: 98, heightCm: 85, url: '/models/GlamVelvetSofa.glb', defaultX: 130, defaultY: 25, defaultRot: 0 },
      { id: 'piece-sofa2', name: "2'li / 3'lü Yan Koltuk", shortName: "2'li Koltuk", type: 'sofa2', widthCm: 195, depthCm: 95, heightCm: 85, url: '/models/SheenWoodLeatherSofa.glb', defaultX: 20, defaultY: 140, defaultRot: 90 },
      { id: 'piece-berjer-1', name: 'Tekli Berjer (Sağ)', shortName: 'Berjer 1', type: 'armchair', widthCm: 82, depthCm: 85, heightCm: 92, url: '/models/SheenChair.glb', defaultX: 380, defaultY: 140, defaultRot: 270 },
      { id: 'piece-berjer-2', name: 'Tekli Berjer (Alt)', shortName: 'Berjer 2', type: 'armchair', widthCm: 82, depthCm: 85, heightCm: 92, url: '/models/SheenChair.glb', defaultX: 360, defaultY: 260, defaultRot: 225 },
      { id: 'piece-coffee', name: 'Orta Sehpa', shortName: 'Orta Sehpa', type: 'coffeetable', widthCm: 120, depthCm: 70, heightCm: 42, url: '/models/orta-sehpa.glb', defaultX: 190, defaultY: 175, defaultRot: 0 }
    ];
  }

  return [
    { id: 'piece-wardrobe', name: '6 Kapaklı / Sürgülü Gardırop', shortName: 'Gardırop', type: 'wardrobe', widthCm: 210, depthCm: 60, heightCm: 215, url: '/models/gardirop.glb', defaultX: 12, defaultY: 12, defaultRot: 0 },
    { id: 'piece-nightstand-l', name: 'Sol Komodin', shortName: 'Sol Komodin', type: 'nightstand', widthCm: 52, depthCm: 44, heightCm: 50, url: '/models/komodin.glb', defaultX: 234, defaultY: 12, defaultRot: 0 },
    { id: 'piece-bed', name: 'Yatak & Baza Başlık (160x200)', shortName: 'Yatak & Baza', type: 'bed', widthCm: 165, depthCm: 205, heightCm: 125, url: '/models/yatak-baza.glb', defaultX: 292, defaultY: 12, defaultRot: 0 },
    { id: 'piece-nightstand-r', name: 'Sağ Komodin', shortName: 'Sağ Komodin', type: 'nightstand', widthCm: 52, depthCm: 44, heightCm: 50, url: '/models/komodin.glb', defaultX: 462, defaultY: 12, defaultRot: 0 },
    { id: 'piece-dresser', name: 'Şifonyer & Makyaj Aynası', shortName: 'Şifonyer', type: 'dresser', widthCm: 125, depthCm: 48, heightCm: 85, url: '/models/sifonyer.glb', defaultX: 30, defaultY: 325, defaultRot: 180 },
    { id: 'piece-pouf', name: 'Ayak Ucu Puf / Bench', shortName: 'Bench Puf', type: 'pouf', widthCm: 130, depthCm: 45, heightCm: 46, url: '/models/yatak-odasi-tam-takim.glb', defaultX: 310, defaultY: 235, defaultRot: 0 }
  ];
};

const COLOR_HEX_MAP: Record<string, { main: string; accent: string; wood: string }> = {
  'Doğal Meşe': { main: '#c5a880', accent: '#e6d5b8', wood: '#8c6d46' },
  'Ceviz': { main: '#5c3a21', accent: '#d8c3a5', wood: '#3d2514' },
  'Krem': { main: '#eae0c8', accent: '#d4af37', wood: '#b59e7a' },
  'Krem Boucle': { main: '#eae0c8', accent: '#d4af37', wood: '#b59e7a' },
  'Antrasit': { main: '#2c3038', accent: '#c5a059', wood: '#1c1e24' },
  'Zümrüt Yeşili': { main: '#164a38', accent: '#d4af37', wood: '#3b2818' },
  'Safir Mavi': { main: '#1a365d', accent: '#d4af37', wood: '#2d3748' },
  'Mat Siyah': { main: '#1e1e22', accent: '#c5a059', wood: '#111115' },
  'Beyaz Mermer': { main: '#f2f2f0', accent: '#d4af37', wood: '#cccccc' },
  'Altın Detaylı Beyaz': { main: '#f7f5f0', accent: '#d4af37', wood: '#c5a059' },
  'Bej': { main: '#dfd3c3', accent: '#c5a059', wood: '#a69076' }
};

interface ShowroomRoomPlannerProps {
  selectedProduct: any;
  selectedColor: string;
  onInspect3D?: (piece: FurniturePieceSpec) => void;
}

export default function ShowroomRoomPlanner({
  selectedProduct,
  selectedColor,
  onInspect3D
}: ShowroomRoomPlannerProps) {
  const availablePieces = getDetailedPiecesForProduct(
    selectedProduct?.name || '',
    selectedProduct?.category || '',
    selectedProduct?.threeDModelUrl || '/models/yatak-odasi-tam-takim.glb'
  );

  const [roomWidthCm, setRoomWidthCm] = useState<number>(530);
  const [roomDepthCm, setRoomDepthCm] = useState<number>(400);
  const [is3DPerspective, setIs3DPerspective] = useState<boolean>(false);
  const [inlineViewMode, setInlineViewMode] = useState<'plan' | 'real3d'>('plan');
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);
  const [showMini3D] = useState<boolean>(true);

  // Synced Full-Screen REAL THREE.JS 3D Room Expansion Modal (shows EXACT user-arranged room!)
  const [expandedRoomModal, setExpandedRoomModal] = useState<boolean>(false);

  const floorRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{
    instanceId: string;
    startX: number;
    startY: number;
    origXCm: number;
    origYCm: number;
  } | null>(null);

  const palette = COLOR_HEX_MAP[selectedColor] || COLOR_HEX_MAP['Doğal Meşe'];

  const applyAutoLayout = () => {
    const initial: PlacedPiece[] = availablePieces.map((spec, idx) => ({
      ...spec,
      instanceId: `${spec.id}-${Date.now()}-${idx}`,
      xCm: Math.min(Math.max(8, spec.defaultX), Math.max(8, roomWidthCm - spec.widthCm - 8)),
      yCm: Math.min(Math.max(8, spec.defaultY), Math.max(8, roomDepthCm - spec.depthCm - 8)),
      rotation: spec.defaultRot,
      isOpen: false,
    }));
    setPlacedPieces(initial);
    setActiveInstanceId(initial[0]?.instanceId || null);
  };

  useEffect(() => {
    applyAutoLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct?.id]);

  const addPieceToRoom = (spec: FurniturePieceSpec, dropXCm?: number, dropYCm?: number) => {
    const newInstance: PlacedPiece = {
      ...spec,
      instanceId: `${spec.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      xCm: dropXCm !== undefined
        ? Math.max(5, Math.min(dropXCm - spec.widthCm / 2, roomWidthCm - spec.widthCm - 5))
        : Math.round((roomWidthCm - spec.widthCm) / 2),
      yCm: dropYCm !== undefined
        ? Math.max(5, Math.min(dropYCm - spec.depthCm / 2, roomDepthCm - spec.depthCm - 5))
        : Math.round((roomDepthCm - spec.depthCm) / 2),
      rotation: 0,
      isOpen: false,
    };
    setPlacedPieces(prev => [...prev, newInstance]);
    setActiveInstanceId(newInstance.instanceId);
  };

  const handleDragStartFromShelf = (e: React.DragEvent, spec: FurniturePieceSpec) => {
    e.dataTransfer.setData('application/qiens-piece-id', spec.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDropOnFloor = (e: React.DragEvent) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('application/qiens-piece-id');
    if (!pieceId || !floorRef.current) return;
    const spec = availablePieces.find(p => p.id === pieceId);
    if (!spec) return;

    const rect = floorRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    addPieceToRoom(spec, Math.round(relX * roomWidthCm), Math.round(relY * roomDepthCm));
  };

  const handlePiecePointerDown = (e: React.PointerEvent, item: PlacedPiece) => {
    e.stopPropagation();
    setActiveInstanceId(item.instanceId);
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    draggingRef.current = {
      instanceId: item.instanceId,
      startX: e.clientX,
      startY: e.clientY,
      origXCm: item.xCm,
      origYCm: item.yCm,
    };
  };

  const handlePiecePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !floorRef.current) return;
    const { instanceId, startX, startY, origXCm, origYCm } = draggingRef.current;

    const rect = floorRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaXCm = ((e.clientX - startX) / rect.width) * roomWidthCm;
    const deltaYCm = ((e.clientY - startY) / rect.height) * roomDepthCm;

    setPlacedPieces(prev =>
      prev.map(p => {
        if (p.instanceId !== instanceId) return p;
        const rawX = Math.round((origXCm + deltaXCm) / 5) * 5;
        const rawY = Math.round((origYCm + deltaYCm) / 5) * 5;
        const clampedX = Math.max(-20, Math.min(rawX, roomWidthCm - p.widthCm + 20));
        const clampedY = Math.max(-20, Math.min(rawY, roomDepthCm - p.depthCm + 20));
        return { ...p, xCm: clampedX, yCm: clampedY };
      })
    );
  };

  const handlePiecePointerUp = (e: React.PointerEvent) => {
    if (draggingRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      draggingRef.current = null;
    }
  };

  const rotatePieceById = (instanceId: string, deg: number) => {
    setPlacedPieces(prev =>
      prev.map(p => (p.instanceId === instanceId ? { ...p, rotation: (p.rotation + deg + 360) % 360 } : p))
    );
  };

  const setActivePieceRotation = (deg: number) => {
    if (!activeInstanceId) return;
    setPlacedPieces(prev =>
      prev.map(p => (p.instanceId === activeInstanceId ? { ...p, rotation: ((deg % 360) + 360) % 360 } : p))
    );
  };

  const toggleOpenPiece = (instanceId?: string) => {
    const targetId = instanceId || activeInstanceId;
    if (!targetId) return;
    setPlacedPieces(prev =>
      prev.map(p => (p.instanceId === targetId ? { ...p, isOpen: !p.isOpen } : p))
    );
  };

  const toggleOpenAll = () => {
    const anyClosed = placedPieces.some(p => !p.isOpen);
    setPlacedPieces(prev => prev.map(p => ({ ...p, isOpen: anyClosed })));
  };

  const snapActiveToWall = (wall: 'top' | 'left' | 'right' | 'bottom') => {
    if (!activeInstanceId) return;
    setPlacedPieces(prev =>
      prev.map(p => {
        if (p.instanceId !== activeInstanceId) return p;
        if (wall === 'top') return { ...p, yCm: 8, rotation: 0 };
        if (wall === 'bottom') return { ...p, yCm: Math.max(8, roomDepthCm - p.depthCm - 8), rotation: 180 };
        if (wall === 'left') return { ...p, xCm: 8, rotation: 90 };
        if (wall === 'right') return { ...p, xCm: Math.max(8, roomWidthCm - p.widthCm - 8), rotation: 270 };
        return p;
      })
    );
  };

  const removeActivePiece = () => {
    if (!activeInstanceId) return;
    setPlacedPieces(prev => prev.filter(p => p.instanceId !== activeInstanceId));
    setActiveInstanceId(null);
  };

  const activePiece = placedPieces.find(p => p.instanceId === activeInstanceId) || placedPieces[0] || null;

  const getOpenLabel = (item: PlacedPiece) => {
    if (item.type === 'bed') return item.isOpen ? 'Bazayı Kapat' : 'Bazayı Aç (İçini Gör)';
    if (item.type === 'wardrobe') return item.isOpen ? 'Kapakları Kapat' : 'Kapakları Aç (Askılık/Raf)';
    if (item.type === 'dresser' || item.type === 'nightstand' || item.type === 'console') {
      return item.isOpen ? 'Çekmeceleri Kapat' : 'Çekmeceleri / Kapakları Aç';
    }
    if (item.type === 'table') return item.isOpen ? 'Masayı Kapat (200cm)' : 'Masayı Uzat (240cm)';
    return item.isOpen ? 'Kapat' : 'Aç / İncele';
  };

  // Renders realistic furniture with ANIMATED OPENING DOORS, DRAWERS, AND HYDRAULIC BAZA!
  const renderPieceInterior = (item: PlacedPiece) => {
    const isOpen = !!item.isOpen;

    switch (item.type) {
      case 'bed':
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5 relative overflow-visible">
            {/* Headboard */}
            <div className="w-full h-3 rounded-t-md shadow-inner flex items-center justify-center border-b border-amber-300/40" style={{ backgroundColor: palette.wood }}>
              <span className="text-[6px] font-black text-amber-200 tracking-widest">BAŞLIK</span>
            </div>

            {/* Interior Baza Storage Box (Visible when Hydraulic Baza is Opened!) */}
            <div className="flex-1 relative mt-1 rounded-md border border-amber-500/40 bg-[#1e1712] overflow-hidden">
              <div className="absolute inset-0 p-1.5 grid grid-cols-2 gap-1 text-center">
                <div className="border border-dashed border-amber-400/40 rounded bg-amber-950/50 flex flex-col items-center justify-center">
                  <span className="text-[7px] font-black text-amber-300">BAZA SANDIK</span>
                  <span className="text-[6px] text-neutral-300">Yorgan / Nevresim</span>
                </div>
                <div className="border border-dashed border-amber-400/40 rounded bg-amber-950/50 flex flex-col items-center justify-center">
                  <span className="text-[7px] font-black text-amber-300">AMORTİSÖRLÜ</span>
                  <span className="text-[6px] text-neutral-300">1200L Depolama</span>
                </div>
              </div>

              {/* Animated Hydraulic Mattress Lid */}
              <div
                className="absolute inset-0 flex flex-col justify-between p-1 rounded-md transition-all duration-500 origin-top shadow-xl"
                style={{
                  backgroundColor: palette.main,
                  transform: isOpen ? 'translateY(-42%) scaleY(0.55)' : 'translateY(0) scaleY(1)',
                  opacity: isOpen ? 0.88 : 1,
                }}
              >
                <div className="flex justify-around px-1.5 pt-0.5 gap-1.5">
                  <div className="flex-1 h-3.5 rounded bg-white/95 shadow-sm border border-black/10" />
                  <div className="flex-1 h-3.5 rounded bg-white/95 shadow-sm border border-black/10" />
                </div>
                <div className="flex-1 mx-0.5 my-1 rounded flex items-center justify-center bg-black/10">
                  <span className="text-[7.5px] font-black uppercase text-black bg-white/90 px-1.5 py-0.5 rounded shadow">
                    {isOpen ? '🔓 BAZA AÇIK' : item.shortName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'wardrobe':
        return (
          <div className="w-full h-full flex flex-col justify-between p-1 relative overflow-visible" style={{ backgroundColor: palette.wood }}>
            {/* Wardrobe Interior (Shelves & Clothes Rail) */}
            <div className="w-full h-full grid grid-cols-3 gap-1 bg-[#231a14] p-1 rounded-sm border border-amber-400/30">
              <div className="border border-amber-200/20 flex flex-col justify-around px-0.5">
                <div className="h-[2px] bg-amber-300/60 w-full" />
                <div className="h-[2px] bg-amber-300/60 w-full" />
                <div className="text-[6px] text-amber-200 text-center font-bold">RAFLAR</div>
              </div>
              <div className="border border-amber-200/20 flex flex-col items-center justify-center">
                <div className="w-full h-[2px] bg-neutral-300 mb-0.5" />
                <span className="text-[6px] text-amber-300 font-black">ASKILIK</span>
              </div>
              <div className="border border-amber-200/20 flex flex-col justify-around px-0.5">
                <div className="h-[2px] bg-amber-300/60 w-full" />
                <div className="text-[6px] text-amber-200 text-center font-bold">ÇEKMECE</div>
              </div>
            </div>

            {/* Animated Swinging / Opening Wardrobe Doors */}
            <div
              className="absolute inset-x-1 -bottom-1 h-2.5 flex justify-between gap-1 pointer-events-none transition-all duration-500"
              style={{ opacity: isOpen ? 1 : 0.95 }}
            >
              {[0, 1, 2, 3].map((doorIdx) => (
                <div
                  key={doorIdx}
                  className="flex-1 h-full rounded-xs border border-amber-300/70 transition-transform duration-500"
                  style={{
                    backgroundColor: doorIdx === 1 || doorIdx === 2 ? '#c5dce8' : palette.main,
                    transformOrigin: doorIdx % 2 === 0 ? 'left bottom' : 'right bottom',
                    transform: isOpen
                      ? doorIdx % 2 === 0
                        ? 'rotate(72deg) translateY(8px)'
                        : 'rotate(-72deg) translateY(8px)'
                      : 'rotate(0deg)',
                  }}
                />
              ))}
            </div>

            <span className="absolute inset-0 flex items-center justify-center text-[7.5px] font-black uppercase text-white drop-shadow pointer-events-none">
              {isOpen ? '🚪 KAPAKLAR AÇIK' : item.shortName}
            </span>
          </div>
        );

      case 'dresser':
      case 'nightstand':
      case 'console':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-1 rounded relative overflow-visible" style={{ backgroundColor: palette.wood }}>
            {/* Top Marble/Wood Surface */}
            <div className="w-full h-full rounded-sm flex items-center justify-center border border-white/20" style={{ backgroundColor: palette.main }}>
              <span className="text-[7px] font-black uppercase text-black bg-white/90 px-1 py-0.5 rounded shadow-xs text-center leading-none">
                {isOpen ? '🔓 AÇIK' : item.shortName}
              </span>
            </div>

            {/* Sliding Drawers that pop OUT toward the front! */}
            <div
              className="absolute left-1.5 right-1.5 -bottom-0.5 h-5 rounded-b-md border-2 border-amber-400 bg-[#2d2118] flex items-center justify-around px-1 transition-all duration-500 shadow-lg pointer-events-none"
              style={{
                transform: isOpen ? 'translateY(105%)' : 'translateY(0%)',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <span className="text-[6px] font-black text-amber-300">ÇEKMECE İÇİ</span>
              <span className="w-2 h-0.5 bg-amber-400 rounded-full" />
            </div>
          </div>
        );

      case 'table':
        return (
          <div
            className="w-full h-full p-1.5 flex items-center justify-center relative rounded-lg transition-transform duration-500"
            style={{
              backgroundColor: palette.wood,
              transform: isOpen ? 'scaleX(1.18)' : 'scaleX(1)',
            }}
          >
            <div className="w-full h-full rounded border border-white/25 flex items-center justify-center" style={{ backgroundColor: palette.main }}>
              <span className="text-[8px] font-black uppercase text-black bg-white/90 px-1.5 py-0.5 rounded">
                {isOpen ? '↔ AÇIK (240 CM)' : item.shortName}
              </span>
            </div>
          </div>
        );

      case 'sofa3':
      case 'sofa2':
        return (
          <div className="w-full h-full flex flex-col p-1 rounded-lg relative" style={{ backgroundColor: palette.main }}>
            <div className="w-full h-2.5 rounded-t bg-black/30 mb-0.5" />
            <div className="flex-1 flex gap-1 px-1">
              <div className="flex-1 bg-white/15 rounded border border-black/10" />
              <div className="flex-1 bg-white/15 rounded border border-black/10" />
              {item.type === 'sofa3' && <div className="flex-1 bg-white/15 rounded border border-black/10" />}
            </div>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-white drop-shadow">
              {item.shortName}
            </span>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-1 rounded relative" style={{ backgroundColor: palette.main }}>
            <div className="w-full h-1.5 bg-black/25 absolute top-0 left-0 right-0 rounded-t" />
            <span className="text-[7px] sm:text-[8px] font-black uppercase text-black/85 bg-white/85 px-1 py-0.5 rounded text-center leading-none shadow-xs">
              {item.shortName}
            </span>
          </div>
        );
    }
  };

  // Interactive 2D/Plan Floor Renderer
  const renderRoomFloorCanvas = (isExpandedView: boolean) => (
    <div
      ref={isExpandedView ? undefined : floorRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={isExpandedView ? undefined : handleDropOnFloor}
      onClick={() => setActiveInstanceId(null)}
      className="relative transition-transform duration-300 shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
      style={{
        width: '100%',
        maxWidth: '640px',
        aspectRatio: `${roomWidthCm} / ${roomDepthCm}`,
        maxHeight: '380px',
        transform: is3DPerspective
          ? 'perspective(1100px) rotateX(22deg) scale(0.94)'
          : 'none',
        transformStyle: 'preserve-3d',
        backgroundColor: '#2a211b',
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px),
          radial-gradient(circle at 50% 50%, rgba(212,175,55,0.14) 0%, rgba(0,0,0,0.45) 100%)
        `,
        backgroundSize: `${(50 / roomWidthCm) * 100}% ${(50 / roomDepthCm) * 100}%, ${(50 / roomWidthCm) * 100}% ${(50 / roomDepthCm) * 100}%, 100% 100%`,
        border: '6px solid #3d352e',
        borderRadius: '14px',
      }}
    >
      {/* Architectural Walls */}
      <div className="absolute -top-3.5 left-0 right-0 h-3.5 bg-[#4a4238] border-b border-accent/40 flex items-center justify-center">
        <span className="text-[7px] font-black uppercase tracking-widest text-white/80">ARKA DUVAR ({roomWidthCm} cm)</span>
      </div>
      <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-sky-300/75 shadow-[0_0_20px_rgba(125,211,252,0.85)] rounded-r" title="Pencere" />
      <div className="absolute bottom-0 right-8 w-14 h-1.5 bg-amber-500/85 rounded-t" title="Kapı" />

      {/* Center Rug */}
      <div
        className="absolute pointer-events-none rounded-xl border border-white/10 opacity-45"
        style={{
          left: '22%', right: '22%', top: '25%', bottom: '20%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(120,90,50,0.15) 100%)',
        }}
      />

      {/* Placed Furniture Items (WITH TRUE VISUAL CSS ROTATION!) */}
      {placedPieces.map((item) => {
        const isSelected = item.instanceId === activeInstanceId;
        const leftPct = (item.xCm / roomWidthCm) * 100;
        const topPct = (item.yCm / roomDepthCm) * 100;
        const widthPct = (item.widthCm / roomWidthCm) * 100;
        const heightPct = (item.depthCm / roomDepthCm) * 100;
        const elevationPx = isExpandedView
          ? Math.min(24, Math.round(item.heightCm / 9))
          : is3DPerspective
          ? Math.min(16, Math.round(item.heightCm / 13))
          : 3;

        return (
          <div
            key={item.instanceId}
            onPointerDown={isExpandedView ? undefined : (e) => handlePiecePointerDown(e, item)}
            onPointerMove={isExpandedView ? undefined : handlePiecePointerMove}
            onPointerUp={isExpandedView ? undefined : handlePiecePointerUp}
            onClick={(e) => {
              e.stopPropagation();
              setActiveInstanceId(item.instanceId);
              if (isExpandedView) {
                toggleOpenPiece(item.instanceId);
              }
            }}
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              width: `${widthPct}%`,
              height: `${heightPct}%`,
              transform: `rotate(${item.rotation}deg) ${is3DPerspective || isExpandedView ? `translateY(-${Math.round(elevationPx / 2)}px)` : ''}`,
              transformOrigin: 'center center',
              boxShadow: isSelected
                ? `0 ${elevationPx}px 0 #b38f22, 0 ${elevationPx + 10}px 25px rgba(0,0,0,0.75)`
                : `0 ${elevationPx}px 0 rgba(25,20,16,0.95), 0 ${elevationPx + 6}px 16px rgba(0,0,0,0.6)`,
            }}
            className={cn(
              "absolute rounded-lg transition-shadow select-none touch-none",
              isExpandedView ? "cursor-pointer" : "cursor-grab active:cursor-grabbing",
              isSelected
                ? "ring-2 ring-amber-400 z-30"
                : "ring-1 ring-white/30 hover:ring-white/75 z-20"
            )}
          >
            {/* Inner Furniture + Opening Door/Drawer/Baza Animation */}
            <div className="w-full h-full relative rounded-lg">
              {renderPieceInterior(item)}
            </div>

            {/* Direct On-Piece Floating Rotate + Open Controls when Selected */}
            {isSelected && !isExpandedView && (
              <div
                className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1 z-50"
                style={{ transform: `translateX(-50%) rotate(${-item.rotation}deg)` }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); rotatePieceById(item.instanceId, 45); }}
                  className="bg-amber-400 hover:bg-white text-black text-[9px] font-black px-2 py-1 rounded-full shadow-xl flex items-center gap-0.5 whitespace-nowrap cursor-pointer"
                  title="45° Çevir"
                >
                  <RotateCw size={10} /> {item.rotation}°
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleOpenPiece(item.instanceId); }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-black px-2 py-1 rounded-full shadow-xl whitespace-nowrap cursor-pointer"
                  title="Kapak/Çekmece/Baza Aç-Kapa"
                >
                  {item.isOpen ? 'Kapat' : 'Aç'}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {placedPieces.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
          <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">Oda Şu An Boş</p>
          <p className="text-[10px] text-neutral-300 max-w-xs">
            Yukarıdaki takım parçalarından istediğinize dokunarak veya sürükleyerek odaya yerleştirin.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* 1. ÜST SIRALI PARÇA RAFI */}
      <div className="bg-[#111116]/95 border border-amber-400/30 rounded-3xl p-3 sm:p-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em] text-amber-400">
              TAKIM PARÇALARI — ÜSTTEN SÜRÜKLE, ÇEVİR VE KAPAK/BAZALARI AÇ
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={toggleOpenAll}
              className="px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-400/40 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
            >
              <DoorOpen size={11} /> Tüm Kapak / Baza Aç-Kapa
            </button>
            <button
              type="button"
              onClick={applyAutoLayout}
              className="px-3 py-1.5 rounded-full bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/30 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={11} /> Hazır Dizilim
            </button>
            <button
              type="button"
              onClick={() => setPlacedPieces([])}
              className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-300 border border-white/10 text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Boşalt
            </button>
          </div>
        </div>

        <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-0.5 no-scrollbar">
          {availablePieces.map((spec) => {
            const countInRoom = placedPieces.filter(p => p.id === spec.id).length;
            return (
              <div
                key={spec.id}
                draggable
                onDragStart={(e) => handleDragStartFromShelf(e, spec)}
                onClick={() => addPieceToRoom(spec)}
                className="group relative flex-shrink-0 w-[135px] sm:w-[152px] bg-[#181820] hover:bg-[#22222e] border border-white/10 hover:border-amber-400 rounded-2xl p-2.5 cursor-grab active:cursor-grabbing transition-all flex flex-col justify-between gap-2 shadow-lg"
              >
                {countInRoom > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black text-[8px] font-black px-2 py-0.5 rounded-full shadow">
                    {countInRoom} Odada
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl border border-white/15 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: palette.main }}
                  >
                    <Box size={14} className="text-black/80" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-white truncate group-hover:text-amber-300">
                      {spec.shortName}
                    </div>
                    <div className="text-[8px] font-bold text-neutral-400">
                      {spec.widthCm}×{spec.depthCm} cm
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-[8px] text-neutral-400 font-bold">Yük: {spec.heightCm}cm</span>
                  <span className="text-[8px] font-black uppercase text-amber-400 flex items-center gap-0.5">
                    <Plus size={10} /> Ekle
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ODA ÖLÇÜSÜ & BÜYÜTME KONTROL BARI */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111116]/90 border border-white/10 px-4 py-2.5 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">ODA:</span>
          {[
            { label: '3.5m × 4m', w: 400, d: 350 },
            { label: '4m × 5m', w: 500, d: 400 },
            { label: '5m × 6m', w: 600, d: 500 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => { setRoomWidthCm(preset.w); setRoomDepthCm(preset.d); }}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer border",
                roomWidthCm === preset.w && roomDepthCm === preset.d
                  ? "bg-amber-400 text-black border-amber-400"
                  : "bg-white/5 text-neutral-300 border-white/10 hover:border-white/30"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setInlineViewMode(inlineViewMode === 'plan' ? 'real3d' : 'plan')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer shadow",
              inlineViewMode === 'real3d'
                ? "bg-emerald-500 text-black border-emerald-400"
                : "bg-amber-400/20 text-amber-300 border-amber-400/50 hover:bg-amber-400 hover:text-black"
            )}
          >
            <Box size={12} />
            {inlineViewMode === 'real3d' ? '📐 2D Sürükle-Bırak Planına Dön' : '🧊 Gerçek 3D Odaya Geç'}
          </button>

          {/* SYNCED FULL-SCREEN REAL THREE.JS 3D VIEW OF USER'S EXACT ARRANGED ROOM! */}
          <button
            type="button"
            onClick={() => setExpandedRoomModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-white text-black text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Maximize2 size={12} /> Büyüt (Tam Ekran Gerçek 3D Oda)
          </button>
        </div>
      </div>

      {/* 3. SANAL ODA SAHNESİ: 2D SÜRÜKLE-BIRAK PLAN VEYA GERÇEK 3D WEBGL ODA */}
      {inlineViewMode === 'real3d' ? (
        <Real3DRoomScene
          placedPieces={placedPieces}
          roomWidthCm={roomWidthCm}
          roomDepthCm={roomDepthCm}
          selectedColor={selectedColor}
          onTogglePieceOpen={(id) => toggleOpenPiece(id)}
          onToggleAllOpen={toggleOpenAll}
          heightClass="h-[440px] sm:h-[520px]"
        />
      ) : (
        <div className="relative w-full h-[430px] sm:h-[510px] bg-gradient-to-b from-[#15151e] to-[#09090d] border border-white/10 rounded-[32px] overflow-hidden flex items-center justify-center p-4 sm:p-8 shadow-2xl">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black/75 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[9px] font-black text-neutral-300 tracking-widest uppercase flex items-center gap-2 whitespace-nowrap">
            <Move size={11} className="text-amber-400" />
            {(roomWidthCm / 100).toFixed(1)}m × {(roomDepthCm / 100).toFixed(1)}m • Sürükle, Çevir, Sonra "Gerçek 3D Odaya Geç" Tıkla
          </div>

          {renderRoomFloorCanvas(false)}

          {/* Mini Live 3D Model-Viewer PIP of Active Piece (Properly Centered Camera Framing) */}
          {showMini3D && activePiece && (
            <div className="hidden sm:flex flex-col absolute bottom-4 right-4 z-30 w-44 h-44 bg-[#0b0b10]/95 backdrop-blur-xl border border-amber-400/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-2.5 py-1.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-wider text-amber-300 truncate">
                  3D: {activePiece.shortName}
                </span>
                <button
                  type="button"
                  onClick={() => setExpandedRoomModal(true)}
                  className="text-[8px] font-black text-white hover:text-amber-300 underline cursor-pointer"
                >
                  3D Odayı Aç
                </button>
              </div>
              <div className="flex-1 relative">
                <model-viewer
                  src={activePiece.url}
                  alt={activePiece.name}
                  camera-controls
                  auto-rotate
                  bounds="tight"
                  camera-orbit="35deg 72deg 115%"
                  camera-target="auto auto auto"
                  style={{ width: '100%', height: '100%', minHeight: '140px', backgroundColor: 'transparent' } as any}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. SEÇİLİ PARÇA KONTROL PANELİ (GERÇEK 0°-360° ÇEVİRME + KAPAK/ÇEKMECE/BAZA AÇMA!) */}
      {activePiece ? (
        <div className="bg-[#14141c] border border-amber-400/35 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black text-xs">
                3D
              </div>
              <div>
                <div className="text-xs font-black text-white flex items-center gap-2 flex-wrap">
                  {activePiece.name}
                  <span className="text-[9px] bg-white/10 text-amber-300 px-2 py-0.5 rounded-full">
                    {activePiece.widthCm} × {activePiece.depthCm} × {activePiece.heightCm} cm
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400">
                  Konum: X={activePiece.xCm}cm, Y={activePiece.yCm}cm • Açı: <b className="text-amber-300">{activePiece.rotation}°</b>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* Interactive Door/Drawer/Baza Toggle */}
              <button
                type="button"
                onClick={() => toggleOpenPiece(activePiece.instanceId)}
                className={cn(
                  "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer",
                  activePiece.isOpen
                    ? "bg-emerald-500 text-black shadow-lg"
                    : "bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-400/40"
                )}
              >
                <DoorOpen size={12} /> {getOpenLabel(activePiece)}
              </button>

              <button
                type="button"
                onClick={() => rotatePieceById(activePiece.instanceId, -45)}
                className="px-2.5 py-2 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-black text-white text-[9px] font-black uppercase cursor-pointer"
              >
                ↺ -45°
              </button>
              <button
                type="button"
                onClick={() => rotatePieceById(activePiece.instanceId, 45)}
                className="px-2.5 py-2 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-black text-white text-[9px] font-black uppercase cursor-pointer"
              >
                ↻ +45°
              </button>
              <button
                type="button"
                onClick={() => rotatePieceById(activePiece.instanceId, 90)}
                className="px-2.5 py-2 rounded-xl bg-amber-400 text-black hover:bg-white text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer"
              >
                <RotateCw size={11} /> 90° Çevir
              </button>
              <button
                type="button"
                onClick={() => snapActiveToWall('top')}
                className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 text-[9px] font-bold uppercase cursor-pointer"
              >
                Üst Duvar
              </button>
              <button
                type="button"
                onClick={() => snapActiveToWall('left')}
                className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 text-[9px] font-bold uppercase cursor-pointer"
              >
                Sol Duvar
              </button>
              <button
                type="button"
                onClick={removeActivePiece}
                className="px-2.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={11} /> Sil
              </button>
            </div>
          </div>

          {/* Smooth 0°-360° Free Rotation Slider */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 whitespace-nowrap flex items-center gap-1">
              <Sliders size={11} /> SERBEST ÇEVİRME ({activePiece.rotation}°):
            </span>
            <input
              type="range"
              min={0}
              max={355}
              step={5}
              value={activePiece.rotation}
              onChange={(e) => setActivePieceRotation(Number(e.target.value))}
              className="flex-1 accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div className="bg-[#14141c]/60 border border-white/5 rounded-2xl p-3 text-center text-[10px] text-neutral-400 font-bold">
          💡 Odadaki herhangi bir mobilyaya dokunarak sürükleyebilir, 360° çevirebilir ve kapak/çekmece/bazalarını açabilirsiniz.
        </div>
      )}

      {/* 5. FULL-SCREEN SYNCED REAL THREE.JS 3D ROOM MODAL (EXACT USER ARRANGEMENT IN TRUE 3D!) */}
      {expandedRoomModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 max-w-7xl w-full mx-auto pb-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
                SENİN DİZDİĞİN ODA • GERÇEK 3D WEBGL TAM EKRAN STÜDYO
              </div>
              <div className="text-sm sm:text-lg font-serif font-black text-white">
                {selectedProduct?.name} — Fareyle 360° Çevir, Mobilyalara Tıklayıp Kapak / Çekmece / Baza Aç!
              </div>
            </div>
            <button
              type="button"
              onClick={() => setExpandedRoomModal(false)}
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-amber-400 hover:text-black text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <X size={16} /> Plana Dön
            </button>
          </div>

          <div className="max-w-7xl w-full mx-auto flex-1 flex items-center">
            <Real3DRoomScene
              placedPieces={placedPieces}
              roomWidthCm={roomWidthCm}
              roomDepthCm={roomDepthCm}
              selectedColor={selectedColor}
              onTogglePieceOpen={(id) => toggleOpenPiece(id)}
              onToggleAllOpen={toggleOpenAll}
              heightClass="h-[74vh] sm:h-[78vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
