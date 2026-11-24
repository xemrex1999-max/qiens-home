"use client";

import React, { useState, useEffect } from 'react';
import { Box, Layers, Copy, Check, Download } from 'lucide-react';
import { SHARED_DEMO_PRODUCTS, DemoProduct } from '@/data/demoThemes';
import ShowroomRoomPlanner, { getDetailedPiecesForProduct } from '@/components/showroom/ShowroomRoomPlanner';

export default function EmbedShowroomPage() {
  const defaultSofaProduct =
    SHARED_DEMO_PRODUCTS.find((p) => p.category === 'Koltuk Takımı') || SHARED_DEMO_PRODUCTS[0];

  const [firma, setFirma] = useState<string>('LİMOON HOME');
  const [activeProduct, setActiveProduct] = useState<DemoProduct>(defaultSofaProduct);
  const [activeColor, setActiveColor] = useState<string>(defaultSofaProduct.colors[0]?.name || 'Krem Boucle');
  const [tab, setTab] = useState<'planner' | '360'>('planner');
  const [selectedGlbUrl, setSelectedGlbUrl] = useState<string>(defaultSofaProduct.fullRoomModelUrl);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setSelectedGlbUrl(activeProduct.fullRoomModelUrl);
  }, [activeProduct]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const f = params.get('firma')?.trim();
      if (f) setFirma(f.slice(0, 48).toUpperCase());
      if (params.get('helper') === '1' || params.get('kod') === '1') {
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

  const pieceModels = getDetailedPiecesForProduct(
    activeProduct.name,
    activeProduct.category,
    activeProduct.fullRoomModelUrl
  );

  const embedCode = `<!-- ${firma} 3D Sanal Showroom & Arka Kamera (AR) Oda Planlayıcı -->
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

  // Show Koltuk Takımı first, then Yatak Odası, then Yemek Odası
  const orderedCategories = [
    SHARED_DEMO_PRODUCTS.find((p) => p.category === 'Koltuk Takımı'),
    SHARED_DEMO_PRODUCTS.find((p) => p.category === 'Yatak Odası'),
    SHARED_DEMO_PRODUCTS.find((p) => p.category === 'Yemek Odası'),
  ].filter(Boolean) as DemoProduct[];

  return (
    <div className="min-h-screen bg-[#0e0f14] text-white p-3 sm:p-5 space-y-3.5">
      {/* Clean Single-Row Studio Header */}
      <div className="max-w-7xl mx-auto bg-[#15161e] border border-white/10 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold tracking-wider uppercase text-white">
            {firma} <span className="text-[#cbb07a] font-normal">• 3D &amp; Kamera Stüdyo</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-white/10">
            {orderedCategories.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setActiveProduct(p); setActiveColor(p.colors[0].name); }}
                className="px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer"
                style={
                  activeProduct.id === p.id
                    ? { backgroundColor: '#cbb07a', color: '#111114', fontWeight: 600 }
                    : { backgroundColor: 'rgba(255,255,255,0.05)', color: '#d4d4d8' }
                }
              >
                {p.category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'planner', label: '3D Oda & Arka Kamerayla Yerleştir', icon: <Layers size={13} /> },
            { id: '360', label: '360° Tekil Parça İncele', icon: <Box size={13} /> },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as 'planner' | '360')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border"
              style={
                tab === item.id
                  ? { backgroundColor: '#cbb07a', color: '#111114', borderColor: '#cbb07a', fontWeight: 600 }
                  : { backgroundColor: 'rgba(255,255,255,0.04)', color: '#d4d4d8', borderColor: 'rgba(255,255,255,0.1)' }
              }
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Product Switcher */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {orderedCategories.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => { setActiveProduct(p); setActiveColor(p.colors[0].name); }}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap"
            style={
              activeProduct.id === p.id
                ? { backgroundColor: '#cbb07a', color: '#111114', borderColor: '#cbb07a' }
                : { backgroundColor: '#15161e', color: '#e4e4e7', borderColor: 'rgba(255,255,255,0.1)' }
            }
          >
            {p.category}
          </button>
        ))}
      </div>

      {showCode && (
        <div className="max-w-7xl mx-auto bg-[#15161e] border border-amber-400/35 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">WordPress Özel HTML Kodu</span>
            <button type="button" onClick={copyEmbed} className="px-3 py-1.5 rounded-lg bg-amber-400 text-black text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Kopyalandı' : 'Kopyala'}
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] text-neutral-200 overflow-x-auto">{embedCode}</pre>
        </div>
      )}

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
          <div className="space-y-3">
            {/* Individual Piece Selector + Direct Free .GLB Download Button */}
            <div className="bg-[#15161e] border border-white/10 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-400 mr-1">360° Model Seçin:</span>
                <button
                  type="button"
                  onClick={() => setSelectedGlbUrl(activeProduct.fullRoomModelUrl)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border ${
                    selectedGlbUrl === activeProduct.fullRoomModelUrl
                      ? 'bg-[#cbb07a] text-black border-[#cbb07a] font-semibold'
                      : 'bg-white/5 text-neutral-200 border-white/10'
                  }`}
                >
                  Tam Takım
                </button>
                {pieceModels.map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedGlbUrl(pm.url)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border ${
                      selectedGlbUrl === pm.url
                        ? 'bg-[#cbb07a] text-black border-[#cbb07a] font-semibold'
                        : 'bg-white/5 text-neutral-200 border-white/10'
                    }`}
                  >
                    {pm.shortName} ({pm.widthCm}×{pm.depthCm} cm)
                  </button>
                ))}
              </div>

              <a
                href={selectedGlbUrl}
                download
                className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download size={13} /> .GLB 3D Dosyasını İndir (Ücretsiz)
              </a>
            </div>

            <div className="relative h-[480px] sm:h-[560px] rounded-3xl bg-[#16161d] border border-white/10 overflow-hidden">
              <model-viewer
                src={selectedGlbUrl}
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
          </div>
        )}
      </div>
    </div>
  );
}
