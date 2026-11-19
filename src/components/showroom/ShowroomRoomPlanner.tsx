"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw, Trash2, Plus, Sparkles, Maximize2, Move,
  Box, Layers, Eye, RefreshCw, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FurniturePieceSpec {
  id: string;
  name: string;
  shortName: string;
  type: 'wardrobe' | 'bed' | 'dresser' | 'nightstand' | 'pouf' | 'table' | 'console' | 'tv' | 'chair' | 'sofa3' | 'sofa2' | 'armchair' | 'coffeetable';
  widthCm: number;
  depthCm: number;
  heightCm: number;
  url: string;
  defaultX: number; // cm from left wall
  defaultY: number; // cm from top wall
  defaultRot: number; // degrees
}

export interface PlacedPiece extends FurniturePieceSpec {
  instanceId: string;
  xCm: number;
  yCm: number;
  rotation: number;
}

export const getDetailedPiecesForProduct = (productName: string, category: string, defaultUrl: string): FurniturePieceSpec[] => {
  const combined = `${productName} ${category}`.toLowerCase()
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ç/g, 'c').replace(/ö/g, 'o');

  if (combined.includes('yemek') || combined.includes('masa')) {
    return [
      {
        id: 'piece-console',
        name: 'Konsol & Ayna Ünitesi',
        shortName: 'Konsol',
        type: 'console',
        widthCm: 210,
        depthCm: 48,
        heightCm: 85,
        url: defaultUrl,
        defaultX: 145,
        defaultY: 12,
        defaultRot: 0,
      },
      {
        id: 'piece-table',
        name: 'Açılır Yemek Masası',
        shortName: 'Yemek Masası',
        type: 'table',
        widthCm: 200,
        depthCm: 100,
        heightCm: 78,
        url: defaultUrl,
        defaultX: 150,
        defaultY: 160,
        defaultRot: 0,
      },
      {
        id: 'piece-chair-1',
        name: 'Yemek Sandalyesi (Üst Sol)',
        shortName: 'Sandalye 1',
        type: 'chair',
        widthCm: 52,
        depthCm: 55,
        heightCm: 88,
        url: '/models/SheenChair.glb',
        defaultX: 175,
        defaultY: 100,
        defaultRot: 0,
      },
      {
        id: 'piece-chair-2',
        name: 'Yemek Sandalyesi (Üst Sağ)',
        shortName: 'Sandalye 2',
        type: 'chair',
        widthCm: 52,
        depthCm: 55,
        heightCm: 88,
        url: '/models/SheenChair.glb',
        defaultX: 270,
        defaultY: 100,
        defaultRot: 0,
      },
      {
        id: 'piece-chair-3',
        name: 'Yemek Sandalyesi (Alt Sol)',
        shortName: 'Sandalye 3',
        type: 'chair',
        widthCm: 52,
        depthCm: 55,
        heightCm: 88,
        url: '/models/SheenChair.glb',
        defaultX: 175,
        defaultY: 265,
        defaultRot: 180,
      },
      {
        id: 'piece-chair-4',
        name: 'Yemek Sandalyesi (Alt Sağ)',
        shortName: 'Sandalye 4',
        type: 'chair',
        widthCm: 52,
        depthCm: 55,
        heightCm: 88,
        url: '/models/SheenChair.glb',
        defaultX: 270,
        defaultY: 265,
        defaultRot: 180,
      },
      {
        id: 'piece-tv',
        name: 'Vitrin / TV Ünitesi',
        shortName: 'Vitrin',
        type: 'tv',
        widthCm: 160,
        depthCm: 45,
        heightCm: 140,
        url: defaultUrl,
        defaultX: 15,
        defaultY: 130,
        defaultRot: 90,
      }
    ];
  }

  if (combined.includes('koltuk') || combined.includes('sofa') || combined.includes('oturma') || combined.includes('kose')) {
    return [
      {
        id: 'piece-sofa3',
        name: "3'lü Ana Koltuk",
        shortName: "3'lü Koltuk",
        type: 'sofa3',
        widthCm: 235,
        depthCm: 98,
        heightCm: 85,
        url: '/models/GlamVelvetSofa.glb',
        defaultX: 130,
        defaultY: 25,
        defaultRot: 0,
      },
      {
        id: 'piece-sofa2',
        name: "2'li / 3'lü Yan Koltuk",
        shortName: "2'li Koltuk",
        type: 'sofa2',
        widthCm: 195,
        depthCm: 95,
        heightCm: 85,
        url: '/models/SheenWoodLeatherSofa.glb',
        defaultX: 20,
        defaultY: 140,
        defaultRot: 90,
      },
      {
        id: 'piece-berjer-1',
        name: 'Tekli Berjer (Sağ)',
        shortName: 'Berjer 1',
        type: 'armchair',
        widthCm: 82,
        depthCm: 85,
        heightCm: 92,
        url: '/models/SheenChair.glb',
        defaultX: 380,
        defaultY: 140,
        defaultRot: 270,
      },
      {
        id: 'piece-berjer-2',
        name: 'Tekli Berjer (Alt)',
        shortName: 'Berjer 2',
        type: 'armchair',
        widthCm: 82,
        depthCm: 85,
        heightCm: 92,
        url: '/models/SheenChair.glb',
        defaultX: 360,
        defaultY: 260,
        defaultRot: 225,
      },
      {
        id: 'piece-coffee',
        name: 'Orta Sehpa',
        shortName: 'Orta Sehpa',
        type: 'coffeetable',
        widthCm: 120,
        depthCm: 70,
        heightCm: 42,
        url: defaultUrl,
        defaultX: 190,
        defaultY: 175,
        defaultRot: 0,
      }
    ];
  }

  // Default: Yatak Odası Takımı (Gardırop, Yatak Baza, Şifonyer, Sağ/Sol Komodin, Puf)
  return [
    {
      id: 'piece-wardrobe',
      name: '6 Kapaklı / Sürgülü Gardırop',
      shortName: 'Gardırop',
      type: 'wardrobe',
      widthCm: 240,
      depthCm: 62,
      heightCm: 215,
      url: defaultUrl,
      defaultX: 15,
      defaultY: 80,
      defaultRot: 90,
    },
    {
      id: 'piece-bed',
      name: 'Yatak & Baza Başlık (160x200)',
      shortName: 'Yatak & Baza',
      type: 'bed',
      widthCm: 175,
      depthCm: 215,
      heightCm: 125,
      url: defaultUrl,
      defaultX: 185,
      defaultY: 15,
      defaultRot: 0,
    },
    {
      id: 'piece-nightstand-l',
      name: 'Sol Komodin',
      shortName: 'Sol Komodin',
      type: 'nightstand',
      widthCm: 55,
      depthCm: 45,
      heightCm: 50,
      url: '/models/SheenChair.glb',
      defaultX: 120,
      defaultY: 15,
      defaultRot: 0,
    },
    {
      id: 'piece-nightstand-r',
      name: 'Sağ Komodin',
      shortName: 'Sağ Komodin',
      type: 'nightstand',
      widthCm: 55,
      depthCm: 45,
      heightCm: 50,
      url: '/models/SheenChair.glb',
      defaultX: 370,
      defaultY: 15,
      defaultRot: 0,
    },
    {
      id: 'piece-dresser',
      name: 'Şifonyer & Makyaj Aynası',
      shortName: 'Şifonyer',
      type: 'dresser',
      widthCm: 125,
      depthCm: 48,
      heightCm: 85,
      url: defaultUrl,
      defaultX: 330,
      defaultY: 330,
      defaultRot: 180,
    },
    {
      id: 'piece-pouf',
      name: 'Ayak Ucu Puf / Bench',
      shortName: 'Bench Puf',
      type: 'pouf',
      widthCm: 130,
      depthCm: 45,
      heightCm: 46,
      url: '/models/SheenChair.glb',
      defaultX: 207,
      defaultY: 240,
      defaultRot: 0,
    }
  ];
};

const COLOR_HEX_MAP: Record<string, { main: string; accent: string; wood: string }> = {
  'Doğal Meşe': { main: '#c5a880', accent: '#e6d5b8', wood: '#8c6d46' },
  'Ceviz': { main: '#5c3a21', accent: '#d8c3a5', wood: '#3d2514' },
  'Krem': { main: '#eae0c8', accent: '#d4af37', wood: '#b59e7a' },
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
    selectedProduct?.threeDModelUrl || '/models/SheenWoodLeatherSofa.glb'
  );

  // Room dimensions in centimeters
  const [roomWidthCm, setRoomWidthCm] = useState<number>(500);
  const [roomDepthCm, setRoomDepthCm] = useState<number>(400);
  const [is3DPerspective, setIs3DPerspective] = useState<boolean>(true);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);
  const [showMini3D, setShowMini3D] = useState<boolean>(true);

  const floorRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{
    instanceId: string;
    startX: number;
    startY: number;
    origXCm: number;
    origYCm: number;
  } | null>(null);

  const palette = COLOR_HEX_MAP[selectedColor] || COLOR_HEX_MAP['Doğal Meşe'];

  // Initialize room with default full set when product changes
  const applyAutoLayout = () => {
    const initial: PlacedPiece[] = availablePieces.map((spec, idx) => ({
      ...spec,
      instanceId: `${spec.id}-${Date.now()}-${idx}`,
      xCm: Math.min(Math.max(10, spec.defaultX), roomWidthCm - spec.widthCm - 10),
      yCm: Math.min(Math.max(10, spec.defaultY), roomDepthCm - spec.depthCm - 10),
      rotation: spec.defaultRot,
    }));
    setPlacedPieces(initial);
    setActiveInstanceId(initial[0]?.instanceId || null);
  };

  useEffect(() => {
    applyAutoLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct?.id]);

  // Add a single piece from top shelf to room center or specified coordinates
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
    };
    setPlacedPieces(prev => [...prev, newInstance]);
    setActiveInstanceId(newInstance.instanceId);
  };

  // HTML5 Drag & Drop from Top Shelf
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
    const dropXCm = Math.round(relX * roomWidthCm);
    const dropYCm = Math.round(relY * roomDepthCm);

    addPieceToRoom(spec, dropXCm, dropYCm);
  };

  // Pointer Down/Move/Up for dragging placed pieces (Works on both Mobile Touch & Desktop Mouse)
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
        const isRotated90 = p.rotation % 180 !== 0;
        const effW = isRotated90 ? p.depthCm : p.widthCm;
        const effD = isRotated90 ? p.widthCm : p.depthCm;

        // Snap to 5cm increments for clean architectural alignment
        const rawX = Math.round((origXCm + deltaXCm) / 5) * 5;
        const rawY = Math.round((origYCm + deltaYCm) / 5) * 5;

        const clampedX = Math.max(0, Math.min(rawX, roomWidthCm - effW));
        const clampedY = Math.max(0, Math.min(rawY, roomDepthCm - effD));

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

  const rotateActivePiece = (deg: number = 90) => {
    if (!activeInstanceId) return;
    setPlacedPieces(prev =>
      prev.map(p => {
        if (p.instanceId !== activeInstanceId) return p;
        const nextRot = (p.rotation + deg) % 360;
        return { ...p, rotation: nextRot };
      })
    );
  };

  const snapActiveToWall = (wall: 'top' | 'left' | 'right' | 'bottom') => {
    if (!activeInstanceId) return;
    setPlacedPieces(prev =>
      prev.map(p => {
        if (p.instanceId !== activeInstanceId) return p;
        const isRotated90 = p.rotation % 180 !== 0;
        const effW = isRotated90 ? p.depthCm : p.widthCm;
        const effD = isRotated90 ? p.widthCm : p.depthCm;
        if (wall === 'top') return { ...p, yCm: 5, rotation: 0 };
        if (wall === 'bottom') return { ...p, yCm: Math.max(0, roomDepthCm - effD - 5), rotation: 180 };
        if (wall === 'left') return { ...p, xCm: 5, rotation: 90 };
        if (wall === 'right') return { ...p, xCm: Math.max(0, roomWidthCm - effW - 5), rotation: 270 };
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

  // Render realistic top-down & 2.5D furniture details inside each placed block
  const renderPieceInterior = (item: PlacedPiece) => {
    switch (item.type) {
      case 'bed':
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5 relative">
            {/* Headboard */}
            <div className="w-full h-2.5 rounded-t-md shadow-inner" style={{ backgroundColor: palette.wood }} />
            {/* Pillows */}
            <div className="flex justify-around px-2 pt-1 gap-1.5">
              <div className="flex-1 h-4 rounded bg-white/90 shadow-sm border border-black/10" />
              <div className="flex-1 h-4 rounded bg-white/90 shadow-sm border border-black/10" />
            </div>
            {/* Duvet / Blanket */}
            <div className="flex-1 mx-1 my-1 rounded-md border border-black/10 flex items-center justify-center" style={{ backgroundColor: palette.main }}>
              <span className="text-[8px] font-black uppercase tracking-tighter text-black/70 bg-white/80 px-1.5 py-0.5 rounded shadow-sm">
                {item.shortName}
              </span>
            </div>
          </div>
        );
      case 'wardrobe':
        return (
          <div className="w-full h-full flex flex-col justify-between p-1 relative" style={{ backgroundColor: palette.wood }}>
            <div className="grid grid-cols-3 gap-0.5 w-full h-full border border-white/20 rounded-sm p-0.5">
              <div className="bg-white/10 rounded-xs border-r border-black/30" />
              <div className="bg-gradient-to-br from-sky-200/40 to-white/10 rounded-xs border-r border-black/30" title="Aynalı Kapak" />
              <div className="bg-white/10 rounded-xs" />
            </div>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-white drop-shadow">
              {item.shortName}
            </span>
          </div>
        );
      case 'table':
        return (
          <div className="w-full h-full p-1.5 flex items-center justify-center relative rounded-lg" style={{ backgroundColor: palette.wood }}>
            <div className="w-full h-full rounded border border-white/25 flex items-center justify-center" style={{ backgroundColor: palette.main }}>
              <span className="text-[8px] font-black uppercase text-black/80 bg-white/80 px-1.5 py-0.5 rounded">
                {item.shortName}
              </span>
            </div>
          </div>
        );
      case 'sofa3':
      case 'sofa2':
        return (
          <div className="w-full h-full flex flex-col p-1 rounded-lg relative" style={{ backgroundColor: palette.main }}>
            {/* Backrest */}
            <div className="w-full h-2.5 rounded-t bg-black/25 mb-0.5" />
            {/* Cushions */}
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
            <div className="w-full h-1.5 bg-black/20 absolute top-0 left-0 right-0 rounded-t" />
            <span className="text-[7px] sm:text-[8px] font-black uppercase text-black/80 bg-white/85 px-1 py-0.5 rounded text-center leading-none shadow-xs">
              {item.shortName}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* 1. ÜST SIRALI PARÇA RAFI (SÜRÜKLE & EKLE BAR) */}
      <div className="bg-[#111116]/95 border border-accent/30 rounded-3xl p-3 sm:p-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-accent">
              TAKIM PARÇALARI — ÜSTTEN SÜRÜKLE VEYA DOKUNARAK ODAYA YERLEŞTİR
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={applyAutoLayout}
              className="px-3 py-1.5 rounded-full bg-accent/15 hover:bg-accent text-accent hover:text-black border border-accent/30 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={11} />
              Hazır Dizilim
            </button>
            <button
              type="button"
              onClick={() => setPlacedPieces([])}
              className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-300 border border-white/10 text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Odayı Boşalt
            </button>
          </div>
        </div>

        {/* Horizontal Piece Strip */}
        <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-0.5 no-scrollbar">
          {availablePieces.map((spec) => {
            const countInRoom = placedPieces.filter(p => p.id === spec.id).length;
            return (
              <div
                key={spec.id}
                draggable
                onDragStart={(e) => handleDragStartFromShelf(e, spec)}
                onClick={() => addPieceToRoom(spec)}
                className="group relative flex-shrink-0 w-[135px] sm:w-[155px] bg-[#181820] hover:bg-[#22222e] border border-white/10 hover:border-accent rounded-2xl p-2.5 cursor-grab active:cursor-grabbing transition-all flex flex-col justify-between gap-2 shadow-lg"
              >
                {countInRoom > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-black text-[8px] font-black px-2 py-0.5 rounded-full shadow">
                    {countInRoom} Adet Odada
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl border border-white/15 flex items-center justify-center flex-shrink-0 shadow-inner"
                    style={{ backgroundColor: palette.main }}
                  >
                    <Box size={14} className="text-black/80" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-white truncate group-hover:text-accent transition-colors">
                      {spec.shortName}
                    </div>
                    <div className="text-[8px] font-bold text-neutral-400">
                      {spec.widthCm}×{spec.depthCm} cm
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-[8px] text-neutral-400 font-bold">Yük: {spec.heightCm}cm</span>
                  <span className="text-[8px] font-black uppercase tracking-wider text-accent flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <Plus size={10} /> Odaya Koy
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ODA BOYUTU & GÖRÜNÜM KONTROL BARI */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111116]/90 border border-white/10 px-4 py-2.5 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">ODA ÖLÇÜSÜ:</span>
          {[
            { label: '3.5m × 4m', w: 400, d: 350 },
            { label: '4m × 5m (Standart)', w: 500, d: 400 },
            { label: '5m × 6m (Geniş)', w: 600, d: 500 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setRoomWidthCm(preset.w);
                setRoomDepthCm(preset.d);
              }}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer border",
                roomWidthCm === preset.w && roomDepthCm === preset.d
                  ? "bg-accent text-black border-accent"
                  : "bg-white/5 text-neutral-300 border-white/10 hover:border-white/30"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIs3DPerspective(!is3DPerspective)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer",
              is3DPerspective
                ? "bg-accent text-black border-accent"
                : "bg-white/5 text-white border-white/10"
            )}
          >
            <Layers size={12} />
            {is3DPerspective ? '3D Perspektif Oda' : '2D Kuşbakışı Plan'}
          </button>
          <button
            type="button"
            onClick={() => setShowMini3D(!showMini3D)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer",
              showMini3D
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-white/5 text-neutral-400 border-white/10"
            )}
          >
            <Eye size={12} />
            3D Önizleme
          </button>
        </div>
      </div>

      {/* 3. SANAL ODA SÜRÜKLE-BIRAK SAHNESİ */}
      <div className="relative w-full h-[420px] sm:h-[500px] bg-gradient-to-b from-[#15151e] to-[#09090d] border border-white/10 rounded-[32px] overflow-hidden flex items-center justify-center p-4 sm:p-8 shadow-2xl">
        {/* Top Ruler Guide */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[9px] font-black text-neutral-300 tracking-widest uppercase flex items-center gap-2">
          <Move size={11} className="text-accent" />
          Sanal Oda Alanı: {(roomWidthCm / 100).toFixed(1)}m × {(roomDepthCm / 100).toFixed(1)}m ({ ((roomWidthCm * roomDepthCm) / 10000).toFixed(1) } m²) — Parçaları Parmağınla veya Fareyle Sürükle
        </div>

        {/* Interactive Room Floor Canvas */}
        <div
          ref={floorRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnFloor}
          onClick={() => setActiveInstanceId(null)}
          className="relative transition-transform duration-500 shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
          style={{
            width: '100%',
            maxWidth: '640px',
            aspectRatio: `${roomWidthCm} / ${roomDepthCm}`,
            maxHeight: '380px',
            transform: is3DPerspective ? 'perspective(1100px) rotateX(24deg) scale(0.95)' : 'none',
            transformStyle: 'preserve-3d',
            backgroundColor: '#2a211b',
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px),
              radial-gradient(circle at 50% 50%, rgba(212,175,55,0.12) 0%, rgba(0,0,0,0.4) 100%)
            `,
            backgroundSize: `${(50 / roomWidthCm) * 100}% ${(50 / roomDepthCm) * 100}%, ${(50 / roomWidthCm) * 100}% ${(50 / roomDepthCm) * 100}%, 100% 100%`,
            border: '6px solid #3d352e',
            borderRadius: '14px',
          }}
        >
          {/* Back & Side Architectural Walls Indicator */}
          <div className="absolute -top-3 left-0 right-0 h-3 bg-[#4a4238] border-b border-accent/40 flex items-center justify-center">
            <span className="text-[7px] font-black uppercase tracking-widest text-white/70">ARKA DUVAR ({roomWidthCm} cm)</span>
          </div>
          {/* Window indicator on Left Wall */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-sky-300/70 shadow-[0_0_20px_rgba(125,211,252,0.8)] rounded-r" title="Pencere / Gün Işığı" />
          {/* Door indicator on Bottom Right */}
          <div className="absolute bottom-0 right-8 w-14 h-1.5 bg-amber-500/80 rounded-t" title="Oda Kapısı" />

          {/* Center Carpet / Rug */}
          <div
            className="absolute pointer-events-none rounded-xl border border-white/10 opacity-45"
            style={{
              left: '22%',
              right: '22%',
              top: '25%',
              bottom: '20%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(120,90,50,0.15) 100%)',
            }}
          />

          {/* Placed Furniture Items */}
          {placedPieces.map((item) => {
            const isSelected = item.instanceId === activeInstanceId;
            const isRotated90 = item.rotation % 180 !== 0;
            const effW = isRotated90 ? item.depthCm : item.widthCm;
            const effD = isRotated90 ? item.widthCm : item.depthCm;

            const leftPct = (item.xCm / roomWidthCm) * 100;
            const topPct = (item.yCm / roomDepthCm) * 100;
            const widthPct = (effW / roomWidthCm) * 100;
            const heightPct = (effD / roomDepthCm) * 100;

            // Simulated 3D height elevation shadow
            const elevationPx = is3DPerspective ? Math.min(18, Math.round(item.heightCm / 12)) : 3;

            return (
              <div
                key={item.instanceId}
                onPointerDown={(e) => handlePiecePointerDown(e, item)}
                onPointerMove={handlePiecePointerMove}
                onPointerUp={handlePiecePointerUp}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveInstanceId(item.instanceId);
                }}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                  boxShadow: isSelected
                    ? `0 ${elevationPx}px 0 #b38f22, 0 ${elevationPx + 10}px 25px rgba(0,0,0,0.75)`
                    : `0 ${elevationPx}px 0 rgba(25,20,16,0.95), 0 ${elevationPx + 6}px 16px rgba(0,0,0,0.6)`,
                  transform: is3DPerspective ? `translateY(-${Math.round(elevationPx / 2)}px)` : 'none',
                }}
                className={cn(
                  "absolute rounded-lg cursor-grab active:cursor-grabbing transition-shadow select-none touch-none",
                  isSelected
                    ? "ring-2 ring-accent z-30"
                    : "ring-1 ring-white/25 hover:ring-white/60 z-20"
                )}
              >
                {/* Inner rotated representation */}
                <div className="w-full h-full relative overflow-hidden rounded-lg">
                  {renderPieceInterior(item)}
                </div>

                {/* Live Dimensions Pill when Selected */}
                {isSelected && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-accent text-black text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg pointer-events-none z-40">
                    {effW}×{effD} cm ({item.rotation}°)
                  </div>
                )}
              </div>
            );
          })}

          {placedPieces.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
              <p className="text-xs font-black uppercase tracking-widest text-accent mb-1">
                Oda Şu An Boş
              </p>
              <p className="text-[10px] text-neutral-300 max-w-xs">
                Yukarıdaki takım parçalarından istediğinize dokunarak veya sürükleyerek odaya yerleştirin.
              </p>
            </div>
          )}
        </div>

        {/* Mini Live 3D Model-Viewer PIP of Active Piece */}
        {showMini3D && activePiece && (
          <div className="hidden sm:flex flex-col absolute bottom-4 right-4 z-30 w-44 h-44 bg-[#0b0b10]/95 backdrop-blur-xl border border-accent/40 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-2.5 py-1.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-wider text-accent truncate">
                3D: {activePiece.shortName}
              </span>
              {onInspect3D && (
                <button
                  type="button"
                  onClick={() => onInspect3D(activePiece)}
                  className="text-[8px] font-bold text-white/70 hover:text-white underline cursor-pointer"
                >
                  Büyüt
                </button>
              )}
            </div>
            <div className="flex-1 relative">
              <model-viewer
                src={activePiece.url}
                alt={activePiece.name}
                camera-controls
                auto-rotate
                style={{ width: '100%', height: '100%', backgroundColor: 'transparent' } as any}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. SEÇİLİ PARÇA KONTROL PANELİ (DÖNDÜR, DUVARA YASLA, SİL) */}
      {activePiece ? (
        <div className="bg-[#14141c] border border-accent/30 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-black text-xs">
              3D
            </div>
            <div>
              <div className="text-xs font-black text-white flex items-center gap-2">
                {activePiece.name}
                <span className="text-[9px] bg-white/10 text-accent px-2 py-0.5 rounded-full">
                  {activePiece.widthCm} × {activePiece.depthCm} × {activePiece.heightCm} cm
                </span>
              </div>
              <div className="text-[10px] text-neutral-400">
                Konum: Soldan {activePiece.xCm} cm, Üst Duvar {activePiece.yCm} cm • Açı: {activePiece.rotation}°
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => rotateActivePiece(45)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-accent hover:text-black text-white text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
            >
              <RotateCw size={12} /> 45° Döndür
            </button>
            <button
              type="button"
              onClick={() => rotateActivePiece(90)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-accent hover:text-black text-white text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
            >
              <RotateCw size={12} /> 90° Döndür
            </button>
            <button
              type="button"
              onClick={() => snapActiveToWall('top')}
              className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 text-[9px] font-bold uppercase transition-all cursor-pointer"
            >
              Üst Duvara Yasla
            </button>
            <button
              type="button"
              onClick={() => snapActiveToWall('left')}
              className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 text-[9px] font-bold uppercase transition-all cursor-pointer"
            >
              Sol Duvara Yasla
            </button>
            {onInspect3D && (
              <button
                type="button"
                onClick={() => onInspect3D(activePiece)}
                className="px-3 py-2 rounded-xl bg-accent/20 hover:bg-accent text-accent hover:text-black border border-accent/40 text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                360° 3D İncele
              </button>
            )}
            <button
              type="button"
              onClick={removeActivePiece}
              className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={12} /> Kaldır
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#14141c]/60 border border-white/5 rounded-2xl p-3 text-center text-[10px] text-neutral-400 font-bold">
          💡 Odadaki herhangi bir mobilyaya dokunarak yerini değiştirebilir, döndürebilir veya duvara hizalayabilirsiniz.
        </div>
      )}
    </div>
  );
}
