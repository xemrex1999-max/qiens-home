"use client";

import React, { useState, useEffect } from 'react';
import { Box, Layers, Camera, Copy, Check } from 'lucide-react';
import { SHARED_DEMO_PRODUCTS, DemoProduct } from '@/data/demoThemes';
import ShowroomRoomPlanner from '@/components/showroom/ShowroomRoomPlanner';
import AIRoomVisualizer from '@/components/shared/AIRoomVisualizer';

export default function EmbedShowroomPage() {
  const [firma, setFirma] = useState<string>('LİMOON HOME');
  const [activeProduct, setActiveProduct] = useState<DemoProduct>(SHARED_DEMO_PRODUCTS[0]);
  const [activeColor, setActiveColor] = useState<string>('Doğal Meşe');
  const [tab, setTab] = useState<'planner' | '360' | 'ai-room'>('planner');
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const f = params.get('firma')?.trim();
      if (f) setFirma(f.slice(0, 48).toUpperCase());
      if (params.get(' helper') === '1' || params.get('kod') === '1') {
        setShowCode(true);
      }
      if (!window.customElements?.get('model-viewer')) {
        const existing = document.querySelector('script[src*="model-viewer"]');
        if (!existing) {
          const s = document.createElement('script');
          s.type = 'module';
          s.src = '/scripts/model-viewer.min.js';
          document.head.appendChild(s);
        }
      }
    }
  }, []);

  const embedCode = `<!-- ${firma} 3D Sanal Showroom & Oda Planlayıcı (WordPress Özel HTML Bloğuna Yapıştırın) -->
<div style="width:100%;max-width:1280px;margin:24px auto;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.18);">
  <iframe
    src="https://qiens-home.vercel.app/embed/showroom?firma=${encodeURIComponent(firma)}"
    style="width:100%;height:780px;border:0;"
    allow="camera; xr-spatial-tracking; fullscreen"
    loading="lazy"
  ></iframe>
</div>`;

  const copyEmbed = () => {
    navigator.clipboard?.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0e0e12] text-white p-3 sm:p-6 space-y-5">
      {/* Top White-Label Studio Bar */}
      <div className="max-w-7xl mx-auto bg-[#16161d] border border-white/10 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#cbb07a] text-black font-bold text-sm flex items-center justify-center">
            3D
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white">
              {firma} — 3D Sanal Showroom &amp; Oda Planlayıcı
            </div>
            <div className="text-[11px] text-neutral-400">
              Mobilyaları odanıza yerleştirin, kapak ve bazaları açın veya özel ölçü seçin
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'planner', label: '3D Oda Planla & Özel Ölçü', icon: <Layers size={13} /> },
            { id: '360', label: '360° & AR Görünüm', icon: <Box size={13} /> },
            { id: 'ai-room', label: 'Odanın Fotoğrafında Gör', icon: <Camera size={13} /> },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as any)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border"
              style={
                tab === item.id
                  ? { backgroundColor: '#cbb07a', color: '#111114', borderColor: '#cbb07a' }
                  : { backgroundColor: 'rgba(255,255,255,0.04)', color: '#d4d4d8', borderColor: 'rgba(255,255,255,0.1)' }
              }
            >
              {item.icon} {item.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className="px-3 py-2 rounded-xl text-[11px] font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 cursor-pointer"
          >
            {showCode ? 'Kodu Gizle' : 'WP Ekleme Kodu'}
          </button>
        </div>
      </div>

      {/* Optional WordPress Copy-Paste Embed Snippet Drawer */}
      {showCode && (
        <div className="max-w-7xl mx-auto bg-[#16161d] border border-amber-400/35 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">
              WordPress / WooCommerce Sayfasına Yapıştırılacak Hazır Kod (`Özel HTML` Bloğu)
            </span>
            <button
              type="button"
              onClick={copyEmbed}
              className="px-3 py-1.5 rounded-lg bg-amber-400 text-black text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Kopyalandı!' : 'Kodu Kopyala'}
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] text-neutral-200 overflow-x-auto">
            {embedCode}
          </pre>
        </div>
      )}

      {/* Product Selector Strip */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {SHARED_DEMO_PRODUCTS.slice(0, 3).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => { setActiveProduct(p); setActiveColor(p.colors[0].name); }}
            className="px-4 py-2 rounded-full text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap"
            style={
              activeProduct.id === p.id
                ? { backgroundColor: '#cbb07a', color: '#111114', borderColor: '#cbb07a' }
                : { backgroundColor: '#16161d', color: '#e4e4e7', borderColor: 'rgba(255,255,255,0.1)' }
            }
          >
            {p.category}: {p.name}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {tab === 'planner' && (
          <ShowroomRoomPlanner
            selectedProduct={{
              ...activeProduct,
              threeDModelUrl: activeProduct.fullRoomModelUrl,
            }}
            selectedColor={activeColor}
            onChangeColor={(c) => setActiveColor(c)}
            onInspect3D={() => setTab('360')}
            brandName={firma}
          />
        )}

        {tab === '360' && (
          <div className="relative h-[480px] sm:h-[560px] rounded-3xl bg-[#16161d] border border-white/10 overflow-hidden">
            <model-viewer
              src={activeProduct.fullRoomModelUrl}
              alt={activeProduct.name}
              camera-controls
              auto-rotate
              ar
              ar-modes="webxr scene-viewer quick-look"
              shadow-intensity="1.1"
              exposure="1"
              style={{ width: '100%', height: '100%', backgroundColor: 'transparent' } as any}
            />
          </div>
        )}

        {tab === 'ai-room' && (
          <div className="-mx-3 sm:-mx-6 -my-6">
            <AIRoomVisualizer brandName={firma} accentHex="#cbb07a" isDark={true} />
          </div>
        )}
      </div>
    </div>
  );
}
