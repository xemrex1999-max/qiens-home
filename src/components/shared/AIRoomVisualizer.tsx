"use client";

import React, { useState, useRef } from 'react';
import {
  Camera, Upload, Sparkles, Sliders, Download, MessageCircle,
  FlipHorizontal, RotateCcw, Sun, Move, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomPreset {
  id: string;
  label: string;
  wallBg: string;
  floorBg: string;
  accentNote: string;
  imageUrl: string;
}

const ROOM_PRESETS: RoomPreset[] = [
  {
    id: 'modern-bedroom',
    label: 'Aydınlık Modern Yatak Odası',
    wallBg: 'linear-gradient(180deg, #e8e2d8 0%, #d4cbc0 62%, #8e6c4b 62%, #6e4f34 100%)',
    floorBg: '#7a593c',
    accentNote: 'Gün Işığı + Meşe Parke',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'luxury-salon',
    label: 'Geniş Minimalist Salon',
    wallBg: 'linear-gradient(180deg, #dde0e4 0%, #c6cbd1 60%, #7d6752 60%, #5b4837 100%)',
    floorBg: '#6d5845',
    accentNote: 'Modern Gri Duvar',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'dining-hall',
    label: 'Şık Yemek & Misafir Odası',
    wallBg: 'linear-gradient(180deg, #f2ede6 0%, #dfd5c7 61%, #5c4028 61%, #422c1b 100%)',
    floorBg: '#4f3520',
    accentNote: 'Sıcak Ceviz Parke',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
  },
];

interface OverlayFurniture {
  id: string;
  name: string;
  category: string;
  priceText: string;
  image: string;
}

const OVERLAY_SETS: OverlayFurniture[] = [
  {
    id: 'set-yatak',
    name: 'Aynalı Lüks Yatak Odası Takımı',
    category: 'Yatak Odası',
    priceText: '75.600 ₺',
    image: '/images/yatak_odasi.png',
  },
  {
    id: 'set-yemek',
    name: 'Elit Açılır Yemek Odası Takımı',
    category: 'Yemek Odası',
    priceText: '68.900 ₺',
    image: '/images/yemek_odasi.png',
  },
  {
    id: 'set-koltuk',
    name: 'Bohem Kadife Koltuk Takımı',
    category: 'Oturma Grubu',
    priceText: '64.500 ₺',
    image: '/images/koltuk_takimi.png',
  },
];

interface AIRoomVisualizerProps {
  brandName?: string;
  accentHex?: string;
  isDark?: boolean;
  whatsappPhone?: string;
}

export default function AIRoomVisualizer({
  brandName = 'İnegöl Fabrika',
  accentHex = '#d4af37',
  isDark = true,
  whatsappPhone = '905077567887',
}: AIRoomVisualizerProps) {
  const [selectedPreset, setSelectedPreset] = useState<RoomPreset>(ROOM_PRESETS[0]);
  const [uploadedRoomUrl, setUploadedRoomUrl] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<OverlayFurniture>(OVERLAY_SETS[0]);

  // Interactive placement & AI lighting match controls
  const [posX, setPosX] = useState<number>(50); // %
  const [posY, setPosY] = useState<number>(64); // %
  const [scalePct, setScalePct] = useState<number>(54); // % width
  const [brightness, setBrightness] = useState<number>(100);
  const [warmth, setWarmth] = useState<number>(6);
  const [perspectiveY, setPerspectiveY] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [compareSplit, setCompareSplit] = useState<number>(100); // 100 = full after, 50 = split
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeRoomBg = uploadedRoomUrl || selectedPreset.imageUrl;

  const handleRoomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedRoomUrl(reader.result);
        setCompareSplit(100);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: posX, origY: posY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const dxPct = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const dyPct = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
    setPosX(Math.max(12, Math.min(88, Math.round(dragRef.current.origX + dxPct))));
    setPosY(Math.max(20, Math.min(86, Math.round(dragRef.current.origY + dyPct))));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      dragRef.current = null;
    }
  };

  const resetPlacement = () => {
    setPosX(50);
    setPosY(64);
    setScalePct(54);
    setBrightness(100);
    setWarmth(6);
    setPerspectiveY(0);
    setFlipped(false);
    setCompareSplit(100);
  };

  // Client-side PNG Snapshot Exporter
  const handleDownloadComposite = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 760;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      // Draw room background
      try {
        const bgImg = await loadImage(activeRoomBg);
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      } catch {
        ctx.fillStyle = '#dcd5ca';
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.62);
        ctx.fillStyle = selectedPreset.floorBg;
        ctx.fillRect(0, canvas.height * 0.62, canvas.width, canvas.height * 0.38);
      }

      // Draw furniture overlay with shadow & lighting match
      const furnImg = await loadImage(selectedSet.image);
      const drawW = (scalePct / 100) * canvas.width;
      const aspect = furnImg.height / Math.max(1, furnImg.width);
      const drawH = drawW * aspect;
      const cx = (posX / 100) * canvas.width;
      const cy = (posY / 100) * canvas.height;

      // Ground ambient shadow
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      ctx.filter = 'blur(18px)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + drawH * 0.44, drawW * 0.46, drawH * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Furniture image
      ctx.save();
      ctx.translate(cx, cy);
      if (flipped) ctx.scale(-1, 1);
      ctx.filter = `brightness(${brightness}%) sepia(${warmth}%) contrast(104%)`;
      ctx.beginPath();
      ctx.roundRect(-drawW / 2, -drawH / 2, drawW, drawH, 22);
      ctx.clip();
      ctx.drawImage(furnImg, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Brand badge watermark
      ctx.fillStyle = 'rgba(10,10,15,0.82)';
      ctx.beginPath();
      ctx.roundRect(28, 28, 370, 56, 14);
      ctx.fill();
      ctx.fillStyle = accentHex;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`${brandName.toUpperCase()} • AI ODA ÖNİZLEME`, 46, 54);
      ctx.fillStyle = '#ffffff';
      ctx.font = '13px sans-serif';
      ctx.fillText(`${selectedSet.name} (${selectedSet.priceText})`, 46, 74);

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-oda-onizleme.png`;
      a.click();
    } catch {
      alert('Görsel indirilemedi, lütfen kendi oda fotoğrafınızı yükleyip tekrar deneyin.');
    } finally {
      setIsDownloading(false);
    }
  };

  const sendVisualWhatsApp = () => {
    const msg = `Merhaba ${brandName},\n"Odanın Fotoğrafında Gör" AI stüdyosunda ${selectedSet.name} (${selectedSet.priceText}) takımını odamda denedim.\nKumaş/ölçü seçenekleri ve teslimat bilgisi alabilir miyim?`;
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const containerCls = isDark
    ? 'bg-[#101117] text-white border-white/10'
    : 'bg-white text-neutral-900 border-neutral-200 shadow-xl';
  const surfaceCls = isDark
    ? 'bg-white/[0.04] border-white/10'
    : 'bg-neutral-50 border-neutral-200';
  const mutedCls = isDark ? 'text-neutral-400' : 'text-neutral-600';

  return (
    <section id="ai-oda-gor" className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className={cn('rounded-[32px] border p-5 sm:p-8 lg:p-10 space-y-6', containerCls)}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border"
              style={{ borderColor: `${accentHex}55`, color: accentHex, backgroundColor: `${accentHex}15` }}
            >
              <Sparkles size={12} /> IKEA KREATIV TARZI • AI ODA FOTOĞRAFI YERLEŞTİRME
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
              Kendi Odanın Fotoğrafını Yükle, Mobilyayı İçinde Gör
            </h2>
            <p className={cn('text-xs sm:text-sm max-w-2xl', mutedCls)}>
              Telefonunuzdan odanızın fotoğrafını yükleyin (veya hazır odalardan seçin), mobilyayı sürükleyip boyutlandırın, ışık uyumunu ayarlayın ve Öncesi / Sonrası farkını anında görün.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleRoomUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider text-black shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: accentHex }}
            >
              <Upload size={15} /> Kendi Odanın Fotoğrafını Yükle
            </button>
            <button
              type="button"
              onClick={resetPlacement}
              className={cn('px-4 py-3 rounded-full text-xs font-bold border flex items-center gap-1.5 cursor-pointer', surfaceCls)}
            >
              <RotateCcw size={13} /> Sıfırla
            </button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 cols: Interactive Photo Stage with Before/After Divider */}
          <div className="lg:col-span-8 space-y-3">
            <div
              ref={stageRef}
              className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden border border-white/15 shadow-2xl select-none bg-[#18181f]"
              style={{ background: selectedPreset.wallBg }}
            >
              {/* Base Room Image (Before) */}
              <img
                src={activeRoomBg}
                alt="Oda Fotoğrafı"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Furnished Layer (Clipped by Before/After slider) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - compareSplit}% 0 0)` }}
              >
                {/* Ground Shadow */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: `${posX}%`,
                    top: `${posY + scalePct * 0.25}%`,
                    width: `${scalePct * 0.92}%`,
                    height: `${Math.max(18, scalePct * 0.16)}px`,
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0) 72%)',
                    filter: 'blur(6px)',
                  }}
                />

                {/* Draggable, Perspective & Light-Matched Furniture Overlay */}
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="absolute cursor-grab active:cursor-grabbing pointer-events-auto group"
                  style={{
                    left: `${posX}%`,
                    top: `${posY}%`,
                    width: `${scalePct}%`,
                    transform: `translate(-50%, -50%) perspective(900px) rotateY(${perspectiveY}deg) scaleX(${flipped ? -1 : 1})`,
                  }}
                >
                  <img
                    src={selectedSet.image}
                    alt={selectedSet.name}
                    draggable={false}
                    className="w-full h-auto rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.65)] ring-2 ring-white/25 group-hover:ring-amber-400 transition-shadow"
                    style={{
                      filter: `brightness(${brightness}%) sepia(${warmth}%) contrast(104%)`,
                    }}
                  />
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/80 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 whitespace-nowrap opacity-90 group-hover:opacity-100"
                    style={{ transform: `translateX(-50%) scaleX(${flipped ? -1 : 1})` }}
                  >
                    <Move size={10} style={{ color: accentHex }} /> Sürükle & Yerleştir
                  </div>
                </div>
              </div>

              {/* Before / After Divider Line */}
              {compareSplit < 99 && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_16px_rgba(0,0,0,0.9)] pointer-events-none z-20"
                  style={{ left: `${compareSplit}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-white text-black text-[9px] font-black shadow-xl whitespace-nowrap">
                    ↔ Öncesi / Sonrası
                  </div>
                </div>
              )}

              {/* Top Overlay Badges */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/15">
                  <Camera size={11} style={{ color: accentHex }} />
                  {uploadedRoomUrl ? 'Senin Odan' : selectedPreset.label}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 z-20 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold border border-white/15">
                {selectedSet.name} • <b style={{ color: accentHex }}>{selectedSet.priceText}</b>
              </div>
            </div>

            {/* Before / After Slider + Preset Room Selector */}
            <div className={cn('rounded-2xl border p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3', surfaceCls)}>
              <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1">
                <Eye size={14} style={{ color: accentHex }} />
                <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                  ÖNCESİ / SONRASI: %{compareSplit}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={compareSplit}
                  onChange={(e) => setCompareSplit(Number(e.target.value))}
                  className="flex-1 cursor-pointer"
                  style={{ accentColor: accentHex }}
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {ROOM_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => { setUploadedRoomUrl(null); setSelectedPreset(preset); }}
                    className={cn(
                      'px-2.5 py-1.5 rounded-lg text-[10px] font-black border cursor-pointer transition-all',
                      !uploadedRoomUrl && selectedPreset.id === preset.id
                        ? 'text-black border-transparent'
                        : isDark ? 'border-white/15 text-neutral-300 hover:bg-white/10' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                    )}
                    style={!uploadedRoomUrl && selectedPreset.id === preset.id ? { backgroundColor: accentHex } : undefined}
                  >
                    {preset.label.split(' ')[1] || preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right 4 cols: Furniture Picker + AI Perspective & Light Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <div className={cn('rounded-2xl border p-4 space-y-4', surfaceCls)}>
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentHex }}>
                1. ODANA YERLEŞTİRİLECEK TAKIMI SEÇ
              </div>
              <div className="space-y-2">
                {OVERLAY_SETS.map((item) => {
                  const active = item.id === selectedSet.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedSet(item)}
                      className={cn(
                        'w-full p-2.5 rounded-xl border flex items-center gap-3 text-left cursor-pointer transition-all',
                        active ? 'shadow-md' : isDark ? 'bg-black/30 border-white/10 hover:border-white/30' : 'bg-white border-neutral-200'
                      )}
                      style={active ? { borderColor: accentHex, backgroundColor: `${accentHex}1c` } : undefined}
                    >
                      <img src={item.image} alt={item.name} className="w-14 h-11 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-black truncate">{item.name}</div>
                        <div className="text-[10px] font-bold" style={{ color: accentHex }}>{item.priceText}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 pt-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
                <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5" style={{ color: accentHex }}>
                  <Sliders size={12} /> 2. PERSPEKTİF & IŞIK UYUMU
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span>Mobilya Boyutu</span>
                    <span style={{ color: accentHex }}>%{scalePct}</span>
                  </div>
                  <input type="range" min={26} max={84} value={scalePct} onChange={e => setScalePct(Number(e.target.value))} className="w-full cursor-pointer" style={{ accentColor: accentHex }} />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span>Perspektif Açısı (3D Dönüş)</span>
                    <span style={{ color: accentHex }}>{perspectiveY}°</span>
                  </div>
                  <input type="range" min={-28} max={28} value={perspectiveY} onChange={e => setPerspectiveY(Number(e.target.value))} className="w-full cursor-pointer" style={{ accentColor: accentHex }} />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="flex items-center gap-1"><Sun size={11} /> Oda Işık Uyumu</span>
                    <span style={{ color: accentHex }}>%{brightness}</span>
                  </div>
                  <input type="range" min={65} max={135} value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full cursor-pointer" style={{ accentColor: accentHex }} />
                </div>

                <button
                  type="button"
                  onClick={() => setFlipped(!flipped)}
                  className={cn('w-full py-2 rounded-xl border text-[11px] font-black flex items-center justify-center gap-1.5 cursor-pointer', isDark ? 'border-white/15 hover:bg-white/10' : 'border-neutral-300 hover:bg-neutral-100')}
                >
                  <FlipHorizontal size={13} /> Yönü Çevir (Ayna)
                </button>
              </div>
            </div>

            {/* Export & WhatsApp Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={handleDownloadComposite}
                disabled={isDownloading}
                className="w-full py-3.5 rounded-2xl text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-opacity disabled:opacity-60"
                style={{ backgroundColor: accentHex }}
              >
                <Download size={15} /> {isDownloading ? 'Hazırlanıyor...' : 'Oda Tasarımını PNG İndir'}
              </button>
              <button
                type="button"
                onClick={sendVisualWhatsApp}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <MessageCircle size={15} /> Bu Takımı WhatsApp&apos;tan Sor
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
