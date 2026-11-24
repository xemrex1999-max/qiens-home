"use client";

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  RotateCw, Trash2, Plus, Maximize2,
  X, Ruler, MessageCircle, RotateCcw, Camera, Lock, Unlock, Minus, Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_LIGHT_STUDIO_THEME, StudioThemeColors } from './Real3DRoomScene';

const Real3DRoomScene = dynamic(() => import('./Real3DRoomScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] rounded-2xl bg-[#F6F3EC] border border-[#E4DCCF] flex items-center justify-center text-xs font-semibold tracking-wider text-[#786B5E]">
      3D Showroom Yükleniyor...
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
  scale?: number;
  isLocked?: boolean;
  isOpen?: boolean;
}

export const getDetailedPiecesForProduct = (productName: string, category: string, defaultUrl: string): FurniturePieceSpec[] => {
  const combined = `${productName} ${category}`.toLowerCase()
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ç/g, 'c').replace(/ö/g, 'o');

  if (combined.includes('yemek') || combined.includes('masa')) {
    return [
      { id: 'piece-console', name: 'Konsol & Ayna Ünitesi', shortName: 'Konsol', type: 'console', widthCm: 210, depthCm: 48, heightCm: 85, url: '/models/konsol.glb', defaultX: 160, defaultY: 28, defaultRot: 0 },
      { id: 'piece-table', name: 'Açılır Yemek Masası', shortName: 'Yemek Masası', type: 'table', widthCm: 200, depthCm: 100, heightCm: 78, url: '/models/yemek-masasi.glb', defaultX: 165, defaultY: 165, defaultRot: 0 },
      { id: 'piece-chair-1', name: 'Yemek Sandalyesi (Sol)', shortName: 'Sandalye 1', type: 'chair', widthCm: 52, depthCm: 55, heightCm: 88, url: '/models/SheenChair.glb', defaultX: 185, defaultY: 102, defaultRot: 0 },
      { id: 'piece-chair-2', name: 'Yemek Sandalyesi (Sağ)', shortName: 'Sandalye 2', type: 'chair', widthCm: 52, depthCm: 55, heightCm: 88, url: '/models/SheenChair.glb', defaultX: 285, defaultY: 102, defaultRot: 0 },
    ];
  }

  if (combined.includes('koltuk') || combined.includes('sofa') || combined.includes('oturma') || combined.includes('kose')) {
    // Architectural magazine layout matching the Limoon Sofa Set catalog shoot:
    // - 1. İkili Koltuk: Center back facing front (0°)
    // - 2. İkili Koltuk: Left wing facing right (90°)
    // - Tekli Berjer: Right corner angled inward (245°)
    // - Orta Sehpa: Center in front of main sofa (0°)
    return [
      { id: 'piece-berjer-1', name: 'Tekli Bukle Berjer', shortName: 'Tekli Berjer', type: 'armchair', widthCm: 84, depthCm: 86, heightCm: 86, url: '/models/limoon-berjer.glb', defaultX: 382, defaultY: 162, defaultRot: 245 },
      { id: 'piece-sofa3', name: '1. İkili / Ana Bukle Koltuk', shortName: '1. İkili Koltuk', type: 'sofa3', widthCm: 225, depthCm: 98, heightCm: 85, url: '/models/limoon-3lu-koltuk.glb', defaultX: 152, defaultY: 52, defaultRot: 0 },
      { id: 'piece-sofa2', name: '2. İkili Yan Bukle Koltuk', shortName: '2. İkili Koltuk', type: 'sofa2', widthCm: 195, depthCm: 96, heightCm: 85, url: '/models/limoon-2li-koltuk.glb', defaultX: 32, defaultY: 148, defaultRot: 90 },
      { id: 'piece-coffee', name: 'Füme Camlı Ceviz Orta Sehpa', shortName: 'Orta Sehpa', type: 'coffeetable', widthCm: 125, depthCm: 70, heightCm: 44, url: '/models/limoon-orta-sehpa.glb', defaultX: 202, defaultY: 175, defaultRot: 0 }
    ];
  }

  return [
    { id: 'piece-wardrobe', name: '6 Kapaklı Gardırop', shortName: 'Gardırop', type: 'wardrobe', widthCm: 210, depthCm: 60, heightCm: 215, url: '/models/gardirop.glb', defaultX: 24, defaultY: 22, defaultRot: 0 },
    { id: 'piece-bed', name: 'Yatak & Baza Başlık', shortName: 'Yatak & Baza', type: 'bed', widthCm: 165, depthCm: 205, heightCm: 125, url: '/models/yatak-baza.glb', defaultX: 285, defaultY: 22, defaultRot: 0 },
    { id: 'piece-dresser', name: 'Şifonyer & Ayna', shortName: 'Şifonyer', type: 'dresser', widthCm: 125, depthCm: 48, heightCm: 85, url: '/models/sifonyer.glb', defaultX: 45, defaultY: 300, defaultRot: 180 },
    { id: 'piece-nightstand-l', name: 'Komodin', shortName: 'Komodin', type: 'nightstand', widthCm: 52, depthCm: 44, heightCm: 50, url: '/models/komodin.glb', defaultX: 228, defaultY: 22, defaultRot: 0 },
  ];
};

const COLOR_HEX_MAP: Record<string, { main: string; accent: string; wood: string }> = {
  'Doğal Meşe': { main: '#c5a880', accent: '#e6d5b8', wood: '#8c6d46' },
  'Ceviz': { main: '#5c3a21', accent: '#d8c3a5', wood: '#3d2514' },
  'Krem': { main: '#eae0c8', accent: '#d4af37', wood: '#b59e7a' },
  'Krem Boucle': { main: '#d8cbb8', accent: '#b5893a', wood: '#6e4c30' },
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
  onChangeColor?: (color: string) => void;
  onInspect3D?: (piece: FurniturePieceSpec) => void;
  brandName?: string;
  studioTheme?: StudioThemeColors;
}

function getParametricBounds(piece: PlacedPiece, baseSpec?: FurniturePieceSpec) {
  const bw = baseSpec?.widthCm ?? piece.widthCm;
  const bd = baseSpec?.depthCm ?? piece.depthCm;
  const bh = baseSpec?.heightCm ?? piece.heightCm;
  switch (piece.type) {
    case 'wardrobe':
      return { wMin: 160, wMax: 300, dMin: 55, dMax: 75, hMin: 195, hMax: 260 };
    case 'bed':
      return { wMin: 140, wMax: 210, dMin: 190, dMax: 225, hMin: 105, hMax: 155 };
    case 'dresser':
      return { wMin: 90, wMax: 180, dMin: 42, dMax: 60, hMin: 75, hMax: 110 };
    case 'nightstand':
      return { wMin: 40, wMax: 75, dMin: 36, dMax: 55, hMin: 42, hMax: 68 };
    case 'table':
      return { wMin: 150, wMax: 260, dMin: 85, dMax: 120, hMin: 74, hMax: 84 };
    case 'console':
      return { wMin: 150, wMax: 250, dMin: 42, dMax: 60, hMin: 75, hMax: 100 };
    case 'sofa3':
      return { wMin: 200, wMax: 310, dMin: 88, dMax: 115, hMin: 78, hMax: 100 };
    case 'sofa2':
      return { wMin: 150, wMax: 230, dMin: 85, dMax: 110, hMin: 78, hMax: 100 };
    default:
      return {
        wMin: Math.max(40, bw - 30),
        wMax: bw + 50,
        dMin: Math.max(35, bd - 15),
        dMax: bd + 30,
        hMin: Math.max(38, bh - 15),
        hMax: bh + 35,
      };
  }
}

export default function ShowroomRoomPlanner({
  selectedProduct,
  selectedColor,
  onChangeColor,
  brandName = 'Limoon Home',
  studioTheme = DEFAULT_LIGHT_STUDIO_THEME,
}: ShowroomRoomPlannerProps) {
  const availablePieces = getDetailedPiecesForProduct(
    selectedProduct?.name || '',
    selectedProduct?.category || '',
    selectedProduct?.threeDModelUrl || '/models/limoon-koltuk-tam-takim.glb'
  );

  const [roomWidthCm, setRoomWidthCm] = useState<number>(530);
  const [roomDepthCm, setRoomDepthCm] = useState<number>(400);
  const [inlineViewMode, setInlineViewMode] = useState<'plan' | 'real3d'>('real3d');
  const [isCameraAR, setIsCameraAR] = useState<boolean>(false);
  const [showSizingDrawer, setShowSizingDrawer] = useState<boolean>(false);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState<string>(selectedColor);
  const [expandedRoomModal, setExpandedRoomModal] = useState<boolean>(false);
  const [eraserTrigger, setEraserTrigger] = useState<number>(0);

  useEffect(() => {
    setActiveColor(selectedColor);
  }, [selectedColor]);

  const handleColorUpdate = (c: string) => {
    setActiveColor(c);
    onChangeColor?.(c);
  };

  const openFullScreenCameraAR = () => {
    setInlineViewMode('real3d');
    setIsCameraAR(true);
    setPlacedPieces([]);
    setActiveInstanceId(null);
    setExpandedRoomModal(true);
    if (typeof document !== 'undefined' && document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const closeFullScreenModal = () => {
    setExpandedRoomModal(false);
    setIsCameraAR(false);
    if (placedPieces.length === 0) {
      applyAutoLayout();
    }
    if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const floorRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{
    instanceId: string;
    startX: number;
    startY: number;
    origXCm: number;
    origYCm: number;
  } | null>(null);

  const palette = COLOR_HEX_MAP[activeColor] || COLOR_HEX_MAP['Krem Boucle'];

  const applyAutoLayout = () => {
    const initial: PlacedPiece[] = availablePieces.map((spec, idx) => ({
      ...spec,
      instanceId: `${spec.id}-${Date.now()}-${idx}`,
      xCm: spec.defaultX,
      yCm: spec.defaultY,
      rotation: spec.defaultRot,
      scale: 1.0,
      isLocked: false,
      isOpen: false,
    }));
    setPlacedPieces(initial);
    setActiveInstanceId(initial[0]?.instanceId || null);
  };

  useEffect(() => {
    applyAutoLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct?.id]);

  // Spawns a piece directly at its natural architectural slot (defaultX, defaultY, defaultRot) so the room always looks harmonious and non-cluttered!
  // Keeps pieces unlocked by default so the user can freely play with, drag, resize, or lock/unlock any piece at any time!
  const addPieceToRoom = (spec: FurniturePieceSpec, dropXCm?: number, dropYCm?: number) => {
    setPlacedPieces((prev) => {
      const newInstance: PlacedPiece = {
        ...spec,
        instanceId: `${spec.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        xCm: dropXCm !== undefined ? dropXCm - Math.round(spec.widthCm / 2) : spec.defaultX,
        yCm: dropYCm !== undefined ? dropYCm - Math.round(spec.depthCm / 2) : spec.defaultY,
        rotation: spec.defaultRot || 0,
        scale: 1.0,
        isLocked: false,
        isOpen: false,
      };
      setActiveInstanceId(newInstance.instanceId);
      return [...prev, newInstance];
    });
  };

  const selectOrSpawnPiece = (spec: FurniturePieceSpec) => {
    const existing = placedPieces.find((p) => p.id === spec.id);
    if (existing) {
      setActiveInstanceId(existing.instanceId);
    } else {
      addPieceToRoom(spec);
    }
  };

  const toggleLockPiece = (instanceId: string) => {
    setPlacedPieces((prev) =>
      prev.map((p) => (p.instanceId === instanceId ? { ...p, isLocked: !p.isLocked } : p))
    );
  };

  const updatePieceScale = (instanceId: string, nextScale: number) => {
    const clamped = Math.max(0.45, Math.min(2.1, Number(nextScale.toFixed(2))));
    setPlacedPieces((prev) =>
      prev.map((p) => (p.instanceId === instanceId ? { ...p, scale: clamped } : p))
    );
  };

  const handleDragStartFromShelf = (e: React.DragEvent, spec: FurniturePieceSpec) => {
    e.dataTransfer.setData('application/qiens-piece-id', spec.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDropOnFloor = (e: React.DragEvent) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('application/qiens-piece-id');
    if (!pieceId || !floorRef.current) return;
    const spec = availablePieces.find((p) => p.id === pieceId);
    if (!spec) return;

    const rect = floorRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    addPieceToRoom(spec, Math.round(relX * roomWidthCm), Math.round(relY * roomDepthCm));
  };

  const handlePiecePointerDown = (e: React.PointerEvent, item: PlacedPiece) => {
    e.stopPropagation();
    setActiveInstanceId(item.instanceId);
    if (item.isLocked) return;
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

    setPlacedPieces((prev) =>
      prev.map((p) => {
        if (p.instanceId !== instanceId) return p;
        const rawX = Math.round((origXCm + deltaXCm) / 5) * 5;
        const rawY = Math.round((origYCm + deltaYCm) / 5) * 5;
        return { ...p, xCm: rawX, yCm: rawY };
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
    setPlacedPieces((prev) =>
      prev.map((p) => (p.instanceId === instanceId ? { ...p, rotation: (p.rotation + deg + 360) % 360 } : p))
    );
  };

  const setPieceRotation = (instanceId: string, deg: number) => {
    setPlacedPieces((prev) =>
      prev.map((p) => (p.instanceId === instanceId ? { ...p, rotation: ((deg % 360) + 360) % 360 } : p))
    );
  };

  const toggleOpenPiece = (instanceId?: string) => {
    const targetId = instanceId || activeInstanceId;
    if (!targetId) return;
    setPlacedPieces((prev) =>
      prev.map((p) => (p.instanceId === targetId ? { ...p, isOpen: !p.isOpen } : p))
    );
  };

  const toggleOpenAll = () => {
    const anyClosed = placedPieces.some((p) => !p.isOpen);
    setPlacedPieces((prev) => prev.map((p) => ({ ...p, isOpen: anyClosed })));
  };

  const removeActivePiece = () => {
    if (!activeInstanceId) return;
    setPlacedPieces((prev) => prev.filter((p) => p.instanceId !== activeInstanceId));
    setActiveInstanceId(null);
  };

  const updateActivePieceDim = (field: 'widthCm' | 'depthCm' | 'heightCm', value: number) => {
    const targetId = activeInstanceId || placedPieces[0]?.instanceId;
    if (!targetId) return;
    setPlacedPieces((prev) =>
      prev.map((p) => (p.instanceId === targetId ? { ...p, [field]: value } : p))
    );
  };

  const resetActivePieceDims = () => {
    const targetId = activeInstanceId || placedPieces[0]?.instanceId;
    if (!targetId) return;
    setPlacedPieces((prev) =>
      prev.map((p) => {
        if (p.instanceId !== targetId) return p;
        const orig = availablePieces.find((s) => s.id === p.id);
        return orig
          ? { ...p, widthCm: orig.widthCm, depthCm: orig.depthCm, heightCm: orig.heightCm, scale: 1.0 }
          : p;
      })
    );
  };

  const activePiece = placedPieces.find((p) => p.instanceId === activeInstanceId) || placedPieces[0] || null;

  const baseProductPrice = Number(selectedProduct?.price) || 68900;
  const customDeltaDetails = placedPieces.reduce(
    (acc, item) => {
      const base = availablePieces.find((s) => s.id === item.id);
      if (!base) return acc;
      const baseVol = base.widthCm * base.depthCm * base.heightCm;
      const s = item.scale ?? 1.0;
      const curVol = item.widthCm * s * (item.depthCm * s) * (item.heightCm * s);
      const ratioDiff = (curVol - baseVol) / Math.max(1, baseVol);
      const isModified =
        item.widthCm !== base.widthCm ||
        item.depthCm !== base.depthCm ||
        item.heightCm !== base.heightCm ||
        s !== 1.0;
      if (isModified) {
        acc.modifiedList.push(`${item.shortName}: ${Math.round(item.widthCm * s)}×${Math.round(item.depthCm * s)}×${Math.round(item.heightCm * s)} cm`);
      }
      acc.totalRatio += ratioDiff / Math.max(1, placedPieces.length);
      return acc;
    },
    { totalRatio: 0, modifiedList: [] as string[] }
  );

  const customPriceDelta =
    customDeltaDetails.modifiedList.length > 0
      ? Math.round((baseProductPrice * customDeltaDetails.totalRatio * 0.45) / 100) * 100
      : 0;
  const liveCustomPrice = Math.max(Math.round(baseProductPrice * 0.78), baseProductPrice + customPriceDelta);
  const liveCustomEuro = Math.round(liveCustomPrice / 37);

  const sendCustomParametricWhatsApp = () => {
    const pieceLines = placedPieces
      .map((p) => {
        const s = p.scale ?? 1.0;
        return `• ${p.shortName}: ${Math.round(p.widthCm * s)}×${Math.round(p.depthCm * s)}×${Math.round(p.heightCm * s)} cm`;
      })
      .join('\n');
    const msg = `Merhaba ${brandName},\n3D Showroom'da odama göre yerleşim hazırladım:\n\nTakım: ${selectedProduct?.name || 'Mobilya Takımı'}\nSeçilen Renk / Kumaş: ${activeColor}\n\nYerleştirilen Parçalar:\n${pieceLines}\n\nToplam Fiyat: ${liveCustomPrice.toLocaleString('tr-TR')} ₺ (~€${liveCustomEuro.toLocaleString('de-DE')})\n\nSipariş ve teslimat bilgisi alabilir miyim?`;
    window.open(`https://wa.me/905077567887?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const renderRoomFloorCanvas = () => (
    <div
      ref={floorRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropOnFloor}
      onClick={() => setActiveInstanceId(null)}
      className="relative transition-transform duration-300 shadow-lg rounded-2xl"
      style={{
        width: '100%',
        maxWidth: '640px',
        aspectRatio: `${roomWidthCm} / ${roomDepthCm}`,
        maxHeight: '380px',
        backgroundColor: '#EDE6D9',
        backgroundImage: `
          linear-gradient(to right, rgba(38,30,25,0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(38,30,25,0.06) 1px, transparent 1px)
        `,
        backgroundSize: `${(50 / roomWidthCm) * 100}% ${(50 / roomDepthCm) * 100}%`,
        border: `6px solid ${studioTheme.borderHex}`,
      }}
    >
      {placedPieces.map((item) => {
        const isSelected = item.instanceId === activeInstanceId;
        const s = item.scale ?? 1;
        const leftPct = (item.xCm / roomWidthCm) * 100;
        const topPct = (item.yCm / roomDepthCm) * 100;
        const widthPct = (item.widthCm / roomWidthCm) * 100 * s;
        const heightPct = (item.depthCm / roomDepthCm) * 100 * s;

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
              transform: `rotate(${item.rotation}deg)`,
              transformOrigin: 'center center',
              backgroundColor: palette.main,
              borderColor: isSelected ? studioTheme.accentHex : '#8C7A68',
            }}
            className={cn(
              'absolute rounded-lg select-none touch-none flex flex-col items-center justify-center p-1 shadow-md border-2',
              item.isLocked ? 'cursor-pointer opacity-95' : 'cursor-grab active:cursor-grabbing',
              isSelected ? 'z-30' : 'z-20'
            )}
          >
            <span className="text-[8px] font-bold text-[#261E19] bg-white/90 px-1.5 py-0.5 rounded text-center leading-tight shadow-2xs">
              {item.isLocked ? '🔒 ' : ''}{item.shortName} ({Math.round(item.widthCm * s)}×{Math.round(item.depthCm * s)} cm)
            </span>
          </div>
        );
      })}
    </div>
  );

  // Compact Centered Bottom Dock with Live Centimeter Readout + Lock/Unlock Playable Anchor + Rotate + Scale
  const renderCenteredBottomDock = (piece: PlacedPiece) => {
    const s = piece.scale ?? 1.0;
    const curScalePct = Math.round(s * 100);
    const liveW = Math.round(piece.widthCm * s);
    const liveD = Math.round(piece.depthCm * s);
    const liveH = Math.round(piece.heightCm * s);

    return (
      <div
        className="max-w-3xl mx-auto rounded-2xl px-3.5 py-2.5 border shadow-lg flex flex-wrap items-center justify-between gap-2.5"
        style={{
          backgroundColor: `${studioTheme.bgCard}F5`,
          color: studioTheme.textPrimary,
          borderColor: studioTheme.borderHex,
        }}
      >
        {/* Left: Piece Name + Live Centimeter Dimensions + Playable Lock Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleLockPiece(piece.instanceId)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer border transition-all"
            style={
              piece.isLocked
                ? { backgroundColor: '#10b981', color: '#FFFFFF', borderColor: '#10b981' }
                : { backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }
            }
            title="Sabitle / Oynatmak için kilidi aç"
          >
            {piece.isLocked ? <Lock size={12} /> : <Unlock size={12} style={{ color: studioTheme.accentHex }} />}
            <span>{piece.isLocked ? 'Sabit (Oynat)' : 'Sabitle'}</span>
          </button>

          <div>
            <div className="text-xs font-bold leading-tight">{piece.shortName}</div>
            <div className="text-[11px] font-semibold" style={{ color: studioTheme.accentHex }}>
              {liveW} × {liveD} × {liveH} cm
            </div>
          </div>
        </div>

        {/* Center: Boyut (with live cm & %) + 360° Çevir */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scale Slider with Live Centimeter Display */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs"
            style={{ backgroundColor: studioTheme.bgPage, borderColor: studioTheme.borderHex }}
          >
            <span className="text-[10px] font-semibold" style={{ color: studioTheme.textMuted }}>Boyut:</span>
            <button
              type="button"
              onClick={() => updatePieceScale(piece.instanceId, s - 0.08)}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:opacity-75 cursor-pointer"
              style={{ backgroundColor: studioTheme.bgCard, color: studioTheme.textPrimary }}
              title="Küçült"
            >
              <Minus size={10} />
            </button>
            <input
              type="range"
              min={50}
              max={180}
              step={5}
              value={curScalePct}
              onChange={(e) => updatePieceScale(piece.instanceId, Number(e.target.value) / 100)}
              className="w-16 sm:w-20 cursor-pointer"
              style={{ accentColor: studioTheme.accentHex }}
            />
            <button
              type="button"
              onClick={() => updatePieceScale(piece.instanceId, s + 0.08)}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:opacity-75 cursor-pointer"
              style={{ backgroundColor: studioTheme.bgCard, color: studioTheme.textPrimary }}
              title="Büyüt"
            >
              <Plus size={10} />
            </button>
            <span className="text-[10px] font-bold whitespace-nowrap">
              {liveW}×{liveD}cm (%{curScalePct})
            </span>
          </div>

          {/* 360° Rotation Slider */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs"
            style={{ backgroundColor: studioTheme.bgPage, borderColor: studioTheme.borderHex }}
          >
            <span className="text-[10px] font-semibold" style={{ color: studioTheme.textMuted }}>Yön:</span>
            <button
              type="button"
              onClick={() => rotatePieceById(piece.instanceId, -30)}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:opacity-75 cursor-pointer"
              style={{ backgroundColor: studioTheme.bgCard, color: studioTheme.textPrimary }}
            >
              <RotateCcw size={10} />
            </button>
            <input
              type="range"
              min={0}
              max={355}
              step={5}
              value={piece.rotation}
              onChange={(e) => setPieceRotation(piece.instanceId, Number(e.target.value))}
              className="w-16 sm:w-20 cursor-pointer"
              style={{ accentColor: studioTheme.accentHex }}
            />
            <button
              type="button"
              onClick={() => rotatePieceById(piece.instanceId, 30)}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:opacity-75 cursor-pointer"
              style={{ backgroundColor: studioTheme.bgCard, color: studioTheme.textPrimary }}
            >
              <RotateCw size={10} />
            </button>
            <span className="text-[10px] font-bold w-7 text-right">{piece.rotation}°</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {!isCameraAR && (
            <button
              type="button"
              onClick={() => setShowSizingDrawer(!showSizingDrawer)}
              className="px-2.5 py-1.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 cursor-pointer"
              style={{
                backgroundColor: showSizingDrawer ? studioTheme.accentHex : studioTheme.bgPage,
                color: showSizingDrawer ? '#FFFFFF' : studioTheme.textPrimary,
                borderColor: studioTheme.borderHex,
              }}
            >
              <Ruler size={12} /> Ölçü
            </button>
          )}
          <button
            type="button"
            onClick={removeActivePiece}
            className="p-1.5 rounded-full border hover:opacity-80 cursor-pointer text-red-600"
            style={{ backgroundColor: studioTheme.bgPage, borderColor: studioTheme.borderHex }}
            title="Kaldır"
          >
            <Trash2 size={13} />
          </button>
          <button
            type="button"
            onClick={sendCustomParametricWhatsApp}
            className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <MessageCircle size={12} /> Sipariş
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* 1. COMPACT CENTERED TOP BAR */}
      <div
        className="rounded-2xl px-3.5 py-2 border shadow-2xs flex flex-wrap items-center justify-between gap-2"
        style={{
          backgroundColor: studioTheme.bgCard,
          color: studioTheme.textPrimary,
          borderColor: studioTheme.borderHex,
        }}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {availablePieces.map((spec) => {
            const existing = placedPieces.find((p) => p.id === spec.id);
            const isActive = existing && existing.instanceId === activePiece?.instanceId;
            return (
              <button
                key={spec.id}
                type="button"
                draggable={true}
                onDragStart={(e) => handleDragStartFromShelf(e, spec)}
                onClick={() => selectOrSpawnPiece(spec)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
                style={
                  isActive
                    ? { backgroundColor: studioTheme.accentHex, color: '#FFFFFF', borderColor: studioTheme.accentHex }
                    : existing
                    ? { backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }
                    : { backgroundColor: 'transparent', color: studioTheme.textMuted, borderColor: studioTheme.borderHex, borderStyle: 'dashed' }
                }
              >
                {existing?.isLocked ? <Lock size={11} className="text-emerald-600" /> : !existing ? <Plus size={12} /> : null}
                <span>{spec.shortName}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => { setPlacedPieces([]); setActiveInstanceId(null); }}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer whitespace-nowrap hover:opacity-80"
            style={{ backgroundColor: studioTheme.bgPage, color: studioTheme.textMuted, borderColor: studioTheme.borderHex }}
          >
            Temizle
          </button>
          <button
            type="button"
            onClick={applyAutoLayout}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer whitespace-nowrap hover:opacity-80"
            style={{ backgroundColor: studioTheme.bgPage, color: studioTheme.textMuted, borderColor: studioTheme.borderHex }}
          >
            Tam Takım
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openFullScreenCameraAR}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs text-white"
            style={{ backgroundColor: studioTheme.accentHex }}
          >
            <Camera size={13} />
            <span>Odanda Gör (Kamera)</span>
          </button>

          <div
            className="inline-flex rounded-full border p-0.5 text-[11px] font-medium"
            style={{ backgroundColor: studioTheme.bgPage, borderColor: studioTheme.borderHex }}
          >
            <button
              type="button"
              onClick={() => { setInlineViewMode('real3d'); setIsCameraAR(false); }}
              className="px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
              style={
                inlineViewMode === 'real3d' && !isCameraAR
                  ? { backgroundColor: studioTheme.accentHex, color: '#FFFFFF', fontWeight: 600 }
                  : { color: studioTheme.textMuted }
              }
            >
              3D
            </button>
            <button
              type="button"
              onClick={() => { setInlineViewMode('plan'); setIsCameraAR(false); }}
              className="px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
              style={
                inlineViewMode === 'plan'
                  ? { backgroundColor: studioTheme.accentHex, color: '#FFFFFF', fontWeight: 600 }
                  : { color: studioTheme.textMuted }
              }
            >
              2D
            </button>
          </div>

          <button
            type="button"
            onClick={() => setExpandedRoomModal(true)}
            className="p-1.5 rounded-full border hover:opacity-80 cursor-pointer"
            style={{ backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }}
            title="Tam Ekran"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* 2. MAIN ROOM STAGE */}
      {inlineViewMode === 'real3d' ? (
        <Real3DRoomScene
          placedPieces={placedPieces}
          roomWidthCm={roomWidthCm}
          roomDepthCm={roomDepthCm}
          selectedColor={activeColor}
          onChangeColor={handleColorUpdate}
          onTogglePieceOpen={(id) => toggleOpenPiece(id)}
          onToggleAllOpen={toggleOpenAll}
          heightClass="h-[440px] sm:h-[520px]"
          isCameraAR={isCameraAR}
          studioTheme={studioTheme}
          eraserTrigger={eraserTrigger}
          onToggleCameraAR={() => {
            if (!isCameraAR) {
              openFullScreenCameraAR();
            } else {
              setIsCameraAR(false);
            }
          }}
          activeInstanceId={activeInstanceId}
          onSelectPiece3D={(id) => setActiveInstanceId(id)}
          onMovePiece3D={(id, newXCm, newYCm) => {
            setPlacedPieces((prev) =>
              prev.map((p) => (p.instanceId === id ? { ...p, xCm: newXCm, yCm: newYCm } : p))
            );
          }}
          onScaleRotatePiece3D={(id, newScale, newRotation) => {
            setPlacedPieces((prev) =>
              prev.map((p) => (p.instanceId === id ? { ...p, scale: newScale, rotation: newRotation } : p))
            );
          }}
          onDropNewPiece3D={(pieceId, dropXCm, dropYCm) => {
            const spec = availablePieces.find((p) => p.id === pieceId);
            if (!spec) return;
            addPieceToRoom(spec, dropXCm, dropYCm);
          }}
        />
      ) : (
        <div
          className="relative w-full h-[430px] sm:h-[500px] border rounded-2xl overflow-hidden flex items-center justify-center p-4 sm:p-8"
          style={{ backgroundColor: studioTheme.bgPage, borderColor: studioTheme.borderHex }}
        >
          {renderRoomFloorCanvas()}
        </div>
      )}

      {/* 3. CENTERED BOTTOM DOCK */}
      {activePiece && renderCenteredBottomDock(activePiece)}

      {/* OPTIONAL COLLAPSIBLE CM SIZING DRAWER */}
      {activePiece && showSizingDrawer && (() => {
        const origSpec = availablePieces.find((s) => s.id === activePiece.id);
        const bounds = getParametricBounds(activePiece, origSpec);
        return (
          <div
            className="rounded-2xl p-4 border space-y-3"
            style={{ backgroundColor: studioTheme.bgCard, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold">{activePiece.name} — Özel Üretim Santim Ayarı</span>
              <button
                type="button"
                onClick={resetActivePieceDims}
                className="text-xs underline cursor-pointer"
                style={{ color: studioTheme.accentHex }}
              >
                Standart Ölçüye Dön
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Genişlik', field: 'widthCm' as const, min: bounds.wMin, max: bounds.wMax, val: activePiece.widthCm },
                { label: 'Derinlik', field: 'depthCm' as const, min: bounds.dMin, max: bounds.dMax, val: activePiece.depthCm },
                { label: 'Yükseklik', field: 'heightCm' as const, min: bounds.hMin, max: bounds.hMax, val: activePiece.heightCm },
              ].map((dim) => (
                <div
                  key={dim.field}
                  className="rounded-xl p-2.5 border"
                  style={{ backgroundColor: studioTheme.bgPage, borderColor: studioTheme.borderHex }}
                >
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span>{dim.label}</span>
                    <span className="font-bold" style={{ color: studioTheme.accentHex }}>{dim.val} cm</span>
                  </div>
                  <input
                    type="range"
                    min={dim.min}
                    max={dim.max}
                    step={2}
                    value={dim.val}
                    onChange={(e) => updateActivePieceDim(dim.field, Number(e.target.value))}
                    className="w-full cursor-pointer"
                    style={{ accentColor: studioTheme.accentHex }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 4. 100% EDGE-TO-EDGE FULL-SCREEN CAMERA AR STUDIO (WITH CENTERED TOP CAPSULE & CENTERED BOTTOM DOCK) */}
      {expandedRoomModal && (
        <div
          className="fixed inset-0 z-[150] w-screen h-[100dvh] overflow-hidden select-none"
          style={{ backgroundColor: studioTheme.bgPage }}
        >
          {/* COMPACT CENTERED TOP CAPSULE BAR */}
          <div className="absolute top-3 left-3 right-3 z-40 flex justify-center pointer-events-none">
            <div
              className="pointer-events-auto max-w-2xl w-full rounded-full px-3 py-1.5 border shadow-lg flex items-center justify-between gap-2"
              style={{
                backgroundColor: `${studioTheme.bgCard}F2`,
                color: studioTheme.textPrimary,
                borderColor: studioTheme.borderHex,
              }}
            >
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {availablePieces.map((spec) => {
                  const existing = placedPieces.find((p) => p.id === spec.id);
                  const isActive = existing && existing.instanceId === activePiece?.instanceId;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => selectOrSpawnPiece(spec)}
                      className="px-3 py-1 rounded-full text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
                      style={
                        isActive
                          ? { backgroundColor: studioTheme.accentHex, color: '#FFFFFF', borderColor: studioTheme.accentHex }
                          : existing
                          ? { backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }
                          : { backgroundColor: '#FFFFFF', color: studioTheme.textPrimary, borderColor: studioTheme.accentHex, borderStyle: 'dashed' }
                      }
                    >
                      {existing?.isLocked ? (
                        <Lock size={10} className="text-emerald-600" />
                      ) : !existing ? (
                        <Plus size={11} style={{ color: studioTheme.accentHex }} />
                      ) : null}
                      <span>{spec.shortName}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {isCameraAR && (
                  <button
                    type="button"
                    onClick={() => setEraserTrigger((c) => c + 1)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1 cursor-pointer"
                    style={{ backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }}
                    title="Eski eşyayı sil"
                  >
                    <Wand2 size={12} style={{ color: studioTheme.accentHex }} />
                    <span className="hidden sm:inline">Eski Eşyayı Sil</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeFullScreenModal}
                  className="p-1.5 rounded-full border cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }}
                  title="Kapat"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 100% EDGE-TO-EDGE FULL-SCREEN 3D / AR CAMERA CANVAS */}
          <Real3DRoomScene
            placedPieces={placedPieces}
            roomWidthCm={roomWidthCm}
            roomDepthCm={roomDepthCm}
            selectedColor={activeColor}
            onChangeColor={handleColorUpdate}
            onTogglePieceOpen={(id) => toggleOpenPiece(id)}
            onToggleAllOpen={toggleOpenAll}
            heightClass="w-screen h-[100dvh]"
            isFullScreen={true}
            isCameraAR={isCameraAR}
            studioTheme={studioTheme}
            eraserTrigger={eraserTrigger}
            onToggleCameraAR={() => setIsCameraAR((prev) => !prev)}
            activeInstanceId={activeInstanceId}
            onSelectPiece3D={(id) => setActiveInstanceId(id)}
            onMovePiece3D={(id, newXCm, newYCm) => {
              setPlacedPieces((prev) =>
                prev.map((p) => (p.instanceId === id ? { ...p, xCm: newXCm, yCm: newYCm } : p))
              );
            }}
            onScaleRotatePiece3D={(id, newScale, newRotation) => {
              setPlacedPieces((prev) =>
                prev.map((p) => (p.instanceId === id ? { ...p, scale: newScale, rotation: newRotation } : p))
              );
            }}
            onDropNewPiece3D={(pieceId, dropXCm, dropYCm) => {
              const spec = availablePieces.find((p) => p.id === pieceId);
              if (!spec) return;
              addPieceToRoom(spec, dropXCm, dropYCm);
            }}
          />

          {/* COMPACT CENTERED BOTTOM DOCK */}
          {activePiece && (
            <div className="absolute bottom-3 left-3 right-3 z-40">
              {renderCenteredBottomDock(activePiece)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
