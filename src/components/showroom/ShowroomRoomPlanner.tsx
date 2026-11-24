"use client";

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  RotateCw, Trash2, Plus, Sparkles, Maximize2, Move,
  Box, Layers, Eye, X, DoorOpen, Sliders, Ruler, MessageCircle, RotateCcw, Camera
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
      { id: 'piece-berjer-1', name: 'Limoon Tekli Bukle Berjer', shortName: 'Tekli Berjer', type: 'armchair', widthCm: 84, depthCm: 86, heightCm: 86, url: '/models/limoon-berjer.glb', defaultX: 405, defaultY: 155, defaultRot: 250 },
      { id: 'piece-sofa3', name: 'Limoon 1. İkili / Ana Bukle Koltuk', shortName: '1. İkili Koltuk', type: 'sofa3', widthCm: 225, depthCm: 98, heightCm: 85, url: '/models/limoon-3lu-koltuk.glb', defaultX: 150, defaultY: 22, defaultRot: 0 },
      { id: 'piece-sofa2', name: 'Limoon 2. İkili Yan Bukle Koltuk', shortName: '2. İkili Koltuk', type: 'sofa2', widthCm: 195, depthCm: 96, heightCm: 85, url: '/models/limoon-2li-koltuk.glb', defaultX: 16, defaultY: 145, defaultRot: 90 },
      { id: 'piece-coffee', name: 'Füme Cam & Ceviz Orta Sehpa', shortName: 'Orta Sehpa', type: 'coffeetable', widthCm: 125, depthCm: 70, heightCm: 44, url: '/models/limoon-orta-sehpa.glb', defaultX: 200, defaultY: 165, defaultRot: 0 }
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
  onChangeColor?: (color: string) => void;
  onInspect3D?: (piece: FurniturePieceSpec) => void;
  brandName?: string;
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
  onInspect3D,
  brandName = 'İnegöl Fabrika',
}: ShowroomRoomPlannerProps) {
  const availablePieces = getDetailedPiecesForProduct(
    selectedProduct?.name || '',
    selectedProduct?.category || '',
    selectedProduct?.threeDModelUrl || '/models/yatak-odasi-tam-takim.glb'
  );

  const [roomWidthCm, setRoomWidthCm] = useState<number>(530);
  const [roomDepthCm, setRoomDepthCm] = useState<number>(400);
  const [is3DPerspective] = useState<boolean>(false);
  const [inlineViewMode, setInlineViewMode] = useState<'plan' | 'real3d'>('real3d');
  const [isCameraAR, setIsCameraAR] = useState<boolean>(false);
  const [showSizingDrawer, setShowSizingDrawer] = useState<boolean>(false);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);
  const [showMini3D] = useState<boolean>(true);
  const [activeColor, setActiveColor] = useState<string>(selectedColor);

  useEffect(() => {
    setActiveColor(selectedColor);
  }, [selectedColor]);

  const handleColorUpdate = (c: string) => {
    setActiveColor(c);
    onChangeColor?.(c);
  };

  // Synced Full-Screen REAL THREE.JS 3D / AR Camera Room Expansion Modal (100% Full Screen!)
  const [expandedRoomModal, setExpandedRoomModal] = useState<boolean>(false);
  const [arManualScale, setArManualScale] = useState<number>(1.0);

  const openFullScreenCameraAR = () => {
    setInlineViewMode('real3d');
    setIsCameraAR(true);
    setArManualScale(1.0);
    // Start EMPTY so the user taps each piece one by one (e.g. + Tekli Berjer -> place in corner -> + 1. İkili Koltuk -> place in corner)
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
    if (playedEmptyRef.current && placedPieces.length === 0) {
      applyAutoLayout();
    }
    if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const playedEmptyRef = useRef<boolean>(true);

  const floorRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{
    instanceId: string;
    startX: number;
    startY: number;
    origXCm: number;
    origYCm: number;
  } | null>(null);

  const palette = COLOR_HEX_MAP[activeColor] || COLOR_HEX_MAP['Doğal Meşe'];

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

  const updateActivePieceDim = (field: 'widthCm' | 'depthCm' | 'heightCm', value: number) => {
    const targetId = activeInstanceId || placedPieces[0]?.instanceId;
    if (!targetId) return;
    setPlacedPieces(prev =>
      prev.map(p => (p.instanceId === targetId ? { ...p, [field]: value } : p))
    );
  };

  const resetActivePieceDims = () => {
    const targetId = activeInstanceId || placedPieces[0]?.instanceId;
    if (!targetId) return;
    setPlacedPieces(prev =>
      prev.map(p => {
        if (p.instanceId !== targetId) return p;
        const orig = availablePieces.find(s => s.id === p.id);
        return orig
          ? { ...p, widthCm: orig.widthCm, depthCm: orig.depthCm, heightCm: orig.heightCm }
          : p;
      })
    );
  };

  const activePiece = placedPieces.find(p => p.instanceId === activeInstanceId) || placedPieces[0] || null;

  // Tylko-style real-time parametric pricing calculation across all placed pieces
  const baseProductPrice = Number(selectedProduct?.price) || 68900;
  const customDeltaDetails = placedPieces.reduce(
    (acc, item) => {
      const base = availablePieces.find(s => s.id === item.id);
      if (!base) return acc;
      const baseVol = base.widthCm * base.depthCm * base.heightCm;
      const curVol = item.widthCm * item.depthCm * item.heightCm;
      const ratioDiff = (curVol - baseVol) / Math.max(1, baseVol);
      const isModified =
        item.widthCm !== base.widthCm ||
        item.depthCm !== base.depthCm ||
        item.heightCm !== base.heightCm;
      if (isModified) {
        acc.modifiedList.push(`${item.shortName}: ${item.widthCm}×${item.depthCm}×${item.heightCm} cm`);
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
      .map(p => `• ${p.shortName}: ${p.widthCm}×${p.depthCm}×${p.heightCm} cm`)
      .join('\n');
    const msg = `Merhaba ${brandName},\n3D Parametrik Oda Planlayıcı'da özel ölçü hazırladım:\n\nTakım: ${selectedProduct?.name || 'Mobilya Takımı'}\nSeçilen Renk / Kumaş: ${activeColor}\nOda Ölçüsü: ${(roomWidthCm / 100).toFixed(1)}m × ${(roomDepthCm / 100).toFixed(1)}m\n\nParça Ölçüleri:\n${pieceLines}\n\nTahmini Özel Üretim Fiyatı: ${liveCustomPrice.toLocaleString('tr-TR')} ₺ (~€${liveCustomEuro.toLocaleString('de-DE')})\n\nKesin üretim süresi ve sipariş onayı alabilir miyim?`;
    window.open(`https://wa.me/905077567887?text=${encodeURIComponent(msg)}`, '_blank');
  };

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
    <div className="w-full flex flex-col gap-3 select-none">
      {/* 1. COMPACT SINGLE-ROW TOP TOOLBAR (PIECES + CAMERA AR + VIEW SWITCHER) */}
      <div className="bg-[#14151c] border border-white/10 rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-medium text-neutral-400 mr-1 whitespace-nowrap">
            {isCameraAR ? 'Kameraya İndir:' : 'Parçalar:'}
          </span>
          {availablePieces.map((spec) => {
            const existing = placedPieces.find(p => p.id === spec.id);
            const isActive = existing && existing.instanceId === activePiece?.instanceId;
            return (
              <button
                key={spec.id}
                type="button"
                draggable={true}
                onDragStart={(e) => handleDragStartFromShelf(e, spec)}
                onClick={() => {
                  if (existing) {
                    setActiveInstanceId(existing.instanceId);
                  } else {
                    addPieceToRoom(spec);
                  }
                }}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5',
                  isActive
                    ? 'bg-amber-400 text-black border-amber-400 font-semibold'
                    : existing
                    ? 'bg-white/5 text-neutral-200 border-white/10 hover:border-white/25'
                    : 'bg-emerald-500/15 text-emerald-300 border-dashed border-emerald-400/40 hover:bg-emerald-500 hover:text-black font-semibold'
                )}
                title={existing ? 'Seçmek için dokunun (veya sahnede parmağınızla sürükleyin)' : 'Kameranın / Odanın önüne indirmek için dokunun'}
              >
                <span>{spec.shortName}</span>
                {!existing && <Plus size={12} />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => { setPlacedPieces([]); setActiveInstanceId(null); }}
            className="px-2.5 py-1.5 rounded-full text-[11px] text-amber-300 hover:text-white bg-amber-400/10 border border-amber-400/25 cursor-pointer whitespace-nowrap"
            title="Odayı boşaltıp parçaları üstten tek tek kameranın önüne indirin"
          >
            Boşalt (Tek Tek İndir)
          </button>
          <button
            type="button"
            onClick={applyAutoLayout}
            className="px-2.5 py-1.5 rounded-full text-[11px] text-neutral-400 hover:text-white cursor-pointer whitespace-nowrap"
            title="Tüm Takımı Diz"
          >
            Tam Takım Diz
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={openFullScreenCameraAR}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border',
              isCameraAR
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                : 'bg-amber-400 hover:bg-amber-300 text-black border-amber-400 shadow-md'
            )}
          >
            <Camera size={13} />
            <span>Odanda Gör (Tam Ekran Kamera)</span>
          </button>

          <div className="inline-flex rounded-full bg-black/40 border border-white/10 p-0.5 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => { setInlineViewMode('real3d'); setIsCameraAR(false); }}
              className={cn(
                'px-3 py-1 rounded-full transition-colors cursor-pointer',
                inlineViewMode === 'real3d' && !isCameraAR ? 'bg-amber-400 text-black font-semibold' : 'text-neutral-300 hover:text-white'
              )}
            >
              3D Oda
            </button>
            <button
              type="button"
              onClick={() => { setInlineViewMode('plan'); setIsCameraAR(false); }}
              className={cn(
                'px-3 py-1 rounded-full transition-colors cursor-pointer',
                inlineViewMode === 'plan' ? 'bg-amber-400 text-black font-semibold' : 'text-neutral-300 hover:text-white'
              )}
            >
              2D Yerleşim
            </button>
          </div>

          <button
            type="button"
            onClick={() => setExpandedRoomModal(true)}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Maximize2 size={12} /> <span className="hidden sm:inline">Tam Ekran</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN ROOM STAGE (DEFAULT: CLEAN REAL 3D ROOM OR LIVE REAR-CAMERA AR) */}
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
          arManualScale={arManualScale}
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
          onDropNewPiece3D={(pieceId, dropXCm, dropYCm) => {
            const spec = availablePieces.find((p) => p.id === pieceId);
            if (!spec) return;
            const existing = placedPieces.find((p) => p.id === pieceId);
            if (existing) {
              setPlacedPieces((prev) =>
                prev.map((p) =>
                  p.instanceId === existing.instanceId
                    ? { ...p, xCm: dropXCm - Math.round(p.widthCm / 2), yCm: dropYCm - Math.round(p.depthCm / 2) }
                    : p
                )
              );
              setActiveInstanceId(existing.instanceId);
            } else {
              addPieceToRoom(spec, dropXCm, dropYCm);
            }
          }}
        />
      ) : (
        <div className="relative w-full h-[430px] sm:h-[500px] bg-[#111218] border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-4 sm:p-8">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black/65 backdrop-blur-md border border-white/10 px-3.5 py-1 rounded-full text-[11px] font-medium text-neutral-300 flex items-center gap-2 whitespace-nowrap">
            <Move size={12} className="text-amber-400" />
            Mobilyaları sürükleyip yerleştirin, ardından &ldquo;3D Oda&rdquo; görünümüne geçin
          </div>
          {renderRoomFloorCanvas(false)}
        </div>
      )}

      {/* 3. CLEAN SINGLE-LINE BOTTOM ACTION BAR + OPTIONAL COLLAPSIBLE SIZING DRAWER */}
      {activePiece && (
        <div className="bg-[#14151c] border border-white/10 rounded-2xl p-3.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2 flex-wrap">
                  <span>{activePiece.name}</span>
                  <span className="text-[11px] font-normal text-neutral-400">
                    ({activePiece.widthCm} × {activePiece.depthCm} × {activePiece.heightCm} cm)
                  </span>
                </div>
                <div className="text-xs text-amber-300 font-semibold mt-0.5">
                  Toplam Takım: {liveCustomPrice.toLocaleString('tr-TR')} ₺{' '}
                  <span className="text-[11px] font-normal text-neutral-400">(~€{liveCustomEuro.toLocaleString('de-DE')})</span>
                  {customPriceDelta !== 0 && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300">
                      Özel Ölçü
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 bg-black/40 border border-white/10 rounded-full px-2 py-1 text-[11px]">
                <span className="text-neutral-400 px-1">Köşeye Koy:</span>
                <button
                  type="button"
                  onClick={() => snapActiveToWall('left')}
                  className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black text-neutral-200 cursor-pointer"
                >
                  Sol
                </button>
                <button
                  type="button"
                  onClick={() => snapActiveToWall('top')}
                  className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black text-neutral-200 cursor-pointer"
                >
                  Karşı
                </button>
                <button
                  type="button"
                  onClick={() => snapActiveToWall('right')}
                  className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black text-neutral-200 cursor-pointer"
                >
                  Sağ
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleOpenPiece(activePiece.instanceId)}
                className={cn(
                  'px-3.5 py-2 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border',
                  activePiece.isOpen
                    ? 'bg-emerald-500 text-black border-emerald-500 font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/15'
                )}
              >
                <DoorOpen size={13} /> {getOpenLabel(activePiece)}
              </button>

              <button
                type="button"
                onClick={() => rotatePieceById(activePiece.instanceId, 45)}
                className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw size={13} /> 45° Çevir
              </button>

              <button
                type="button"
                onClick={removeActivePiece}
                className="px-3 py-2 rounded-full bg-red-500/15 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 text-xs font-medium flex items-center gap-1 cursor-pointer"
                title="Seçili parçayı odadan kaldır"
              >
                <Trash2 size={13} /> Kaldır
              </button>

              <button
                type="button"
                onClick={() => setShowSizingDrawer(!showSizingDrawer)}
                className={cn(
                  'px-3.5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer border transition-colors',
                  showSizingDrawer
                    ? 'bg-amber-400 text-black border-amber-400 font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-amber-300 border-amber-400/35'
                )}
              >
                <Ruler size={13} /> Özel Ölçü Ayarla
              </button>

              <button
                type="button"
                onClick={sendCustomParametricWhatsApp}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle size={13} /> WhatsApp Sipariş
              </button>
            </div>
          </div>

          {/* COLLAPSIBLE CUSTOM SIZING & ROOM DIMENSIONS DRAWER */}
          {showSizingDrawer && (() => {
            const origSpec = availablePieces.find(s => s.id === activePiece.id);
            const bounds = getParametricBounds(activePiece, origSpec);
            return (
              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">Oda Boyutu:</span>
                    {[
                      { label: '3.5×4m', w: 400, d: 350 },
                      { label: '4×5m', w: 500, d: 400 },
                      { label: '5×6m', w: 600, d: 500 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => { setRoomWidthCm(preset.w); setRoomDepthCm(preset.d); }}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer border',
                          roomWidthCm === preset.w && roomDepthCm === preset.d
                            ? 'bg-amber-400 text-black border-amber-400'
                            : 'bg-white/5 text-neutral-300 border-white/10'
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={resetActivePieceDims}
                      className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={11} /> Standart Ölçü
                    </button>
                    <button
                      type="button"
                      onClick={removeActivePiece}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={11} /> Parçayı Kaldır
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div className="bg-black/35 border border-white/10 rounded-xl p-2.5">
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span className="text-neutral-300">Genişlik</span>
                      <span className="text-amber-300">{activePiece.widthCm} cm</span>
                    </div>
                    <input
                      type="range"
                      min={bounds.wMin}
                      max={bounds.wMax}
                      step={5}
                      value={activePiece.widthCm}
                      onChange={(e) => updateActivePieceDim('widthCm', Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="bg-black/35 border border-white/10 rounded-xl p-2.5">
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span className="text-neutral-300">Derinlik</span>
                      <span className="text-amber-300">{activePiece.depthCm} cm</span>
                    </div>
                    <input
                      type="range"
                      min={bounds.dMin}
                      max={bounds.dMax}
                      step={2}
                      value={activePiece.depthCm}
                      onChange={(e) => updateActivePieceDim('depthCm', Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="bg-black/35 border border-white/10 rounded-xl p-2.5">
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span className="text-neutral-300">Yükseklik</span>
                      <span className="text-amber-300">{activePiece.heightCm} cm</span>
                    </div>
                    <input
                      type="range"
                      min={bounds.hMin}
                      max={bounds.hMax}
                      step={5}
                      value={activePiece.heightCm}
                      onChange={(e) => updateActivePieceDim('heightCm', Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="bg-black/35 border border-white/10 rounded-xl p-2.5">
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span className="text-neutral-300">Dönüş Açısı</span>
                      <span className="text-amber-300">{activePiece.rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={355}
                      step={5}
                      value={activePiece.rotation}
                      onChange={(e) => setActivePieceRotation(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 4. 100% EDGE-TO-EDGE FULL-SCREEN 3D & LIVE REAR-CAMERA AR MODAL */}
      {expandedRoomModal && (
        <div className="fixed inset-0 z-[150] w-screen h-[100dvh] bg-black overflow-hidden select-none">
          {/* FLOATING TOP PIECE TRAY & CAMERA BAR OVER FULL-SCREEN CAMERA */}
          <div className="absolute top-3 left-3 right-3 z-40 bg-black/75 backdrop-blur-xl border border-white/15 rounded-2xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-2xl">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
              <span className="text-[11px] font-semibold text-amber-300 mr-1 whitespace-nowrap">
                {isCameraAR ? 'Kameraya İndir:' : 'Parçalar:'}
              </span>
              {availablePieces.map((spec) => {
                const existing = placedPieces.find((p) => p.id === spec.id);
                const isActive = existing && existing.instanceId === activePiece?.instanceId;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    draggable={true}
                    onDragStart={(e) => handleDragStartFromShelf(e, spec)}
                    onClick={() => {
                      if (existing) {
                        setActiveInstanceId(existing.instanceId);
                      } else {
                        addPieceToRoom(spec);
                      }
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1',
                      isActive
                        ? 'bg-amber-400 text-black border-amber-400 font-semibold'
                        : existing
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-emerald-500/25 text-emerald-300 border-dashed border-emerald-400/60 hover:bg-emerald-500 hover:text-black font-semibold'
                    )}
                  >
                    <span>{spec.shortName}</span>
                    {!existing && <Plus size={12} />}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => { setPlacedPieces([]); setActiveInstanceId(null); }}
                className="px-2.5 py-1.5 rounded-full text-[11px] text-amber-300 bg-amber-400/15 border border-amber-400/30 cursor-pointer whitespace-nowrap"
              >
                Boşalt (Tek Tek İndir)
              </button>
              <button
                type="button"
                onClick={applyAutoLayout}
                className="px-2.5 py-1.5 rounded-full text-[11px] text-neutral-300 hover:text-white bg-white/5 cursor-pointer whitespace-nowrap"
              >
                Tam Takım
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsCameraAR((prev) => !prev)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer border',
                  isCameraAR
                    ? 'bg-emerald-500 text-black border-emerald-400'
                    : 'bg-amber-400 text-black border-amber-400'
                )}
              >
                <Camera size={13} />
                <span>{isCameraAR ? 'Kamera Açık' : 'Kamerayı Aç'}</span>
              </button>
              <button
                type="button"
                onClick={closeFullScreenModal}
                className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <X size={14} /> Çık
              </button>
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
            arManualScale={arManualScale}
            onToggleCameraAR={() => setIsCameraAR((prev) => !prev)}
            activeInstanceId={activeInstanceId}
            onSelectPiece3D={(id) => setActiveInstanceId(id)}
            onMovePiece3D={(id, newXCm, newYCm) => {
              setPlacedPieces((prev) =>
                prev.map((p) => (p.instanceId === id ? { ...p, xCm: newXCm, yCm: newYCm } : p))
              );
            }}
            onDropNewPiece3D={(pieceId, dropXCm, dropYCm) => {
              const spec = availablePieces.find((p) => p.id === pieceId);
              if (!spec) return;
              const existing = placedPieces.find((p) => p.id === pieceId);
              if (existing) {
                setPlacedPieces((prev) =>
                  prev.map((p) =>
                    p.instanceId === existing.instanceId
                      ? { ...p, xCm: dropXCm - Math.round(p.widthCm / 2), yCm: dropYCm - Math.round(p.depthCm / 2) }
                      : p
                  )
                );
                setActiveInstanceId(existing.instanceId);
              } else {
                addPieceToRoom(spec, dropXCm, dropYCm);
              }
            }}
          />

          {/* FLOATING BOTTOM ACTIVE PIECE BAR OVER FULL-SCREEN CAMERA */}
          <div className="absolute bottom-3 left-3 right-3 z-40 bg-black/75 backdrop-blur-xl border border-white/15 rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xl">
            {activePiece ? (
              <>
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{activePiece.shortName}</span>
                  <span className="text-[11px] font-normal text-neutral-300">
                    ({activePiece.widthCm}×{activePiece.depthCm} cm)
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => snapActiveToWall('left')}
                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-amber-400 hover:text-black text-white text-[11px] font-medium cursor-pointer"
                  >
                    Sol Köşe
                  </button>
                  <button
                    type="button"
                    onClick={() => snapActiveToWall('top')}
                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-amber-400 hover:text-black text-white text-[11px] font-medium cursor-pointer"
                  >
                    Karşı
                  </button>
                  <button
                    type="button"
                    onClick={() => snapActiveToWall('right')}
                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-amber-400 hover:text-black text-white text-[11px] font-medium cursor-pointer"
                  >
                    Sağ Köşe
                  </button>
                  <button
                    type="button"
                    onClick={() => rotatePieceById(activePiece.instanceId, -45)}
                    className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={11} /> -45°
                  </button>
                  <button
                    type="button"
                    onClick={() => rotatePieceById(activePiece.instanceId, 45)}
                    className="px-2.5 py-1 rounded-full bg-amber-400 text-black text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw size={11} /> +45° Çevir
                  </button>
                  {isCameraAR && (
                    <div className="inline-flex items-center gap-1 bg-white/10 border border-white/15 rounded-full px-2 py-0.5 text-[11px] text-neutral-200">
                      <span>Sabit Ölçek: %{Math.round(arManualScale * 100)}</span>
                      <button
                        type="button"
                        onClick={() => setArManualScale((s) => Math.max(0.65, Number((s - 0.1).toFixed(2))))}
                        className="px-1.5 rounded bg-black/50 hover:bg-amber-400 hover:text-black font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setArManualScale((s) => Math.min(1.45, Number((s + 0.1).toFixed(2))))}
                        className="px-1.5 rounded bg-black/50 hover:bg-amber-400 hover:text-black font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleOpenPiece(activePiece.instanceId)}
                    className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <DoorOpen size={11} /> Aç/Kapa
                  </button>
                  <button
                    type="button"
                    onClick={removeActivePiece}
                    className="px-2.5 py-1 rounded-full bg-red-500/25 text-red-200 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={11} /> Kaldır
                  </button>
                  <button
                    type="button"
                    onClick={sendCustomParametricWhatsApp}
                    className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle size={11} /> Sipariş
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full text-center text-xs text-amber-300 font-medium">
                Üstteki parçalardan birine dokunarak kameranın önüne indirin ve parmağınızla istediğiniz köşeye sürükleyin.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
