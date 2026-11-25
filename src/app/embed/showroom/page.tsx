"use client";

import React, { useState, useEffect } from 'react';
import { Box, Layers, Copy, Check, Download } from 'lucide-react';
import { SHARED_DEMO_PRODUCTS, DemoProduct } from '@/data/demoThemes';
import ShowroomRoomPlanner, { getDetailedPiecesForProduct } from '@/components/showroom/ShowroomRoomPlanner';
import { DEFAULT_LIGHT_STUDIO_THEME, StudioThemeColors } from '@/components/showroom/Real3DRoomScene';
import ShowroomAmbienceToggle from '@/components/shared/ShowroomAmbienceToggle';

export default function EmbedShowroomPage() {
  const defaultSofaProduct =
    SHARED_DEMO_PRODUCTS.find((p) => p.category === 'Koltuk Takımı') || SHARED_DEMO_PRODUCTS[0];

  const [firma, setFirma] = useState<string>('LİMOON HOME');
  const [activeProduct, setActiveProduct] = useState<DemoProduct>(defaultSofaProduct);
  const [activeColor, setActiveColor] = useState<string>(defaultSofaProduct.colors[0]?.name || 'Krem Boucle');
  const [tab, setTab] = useState<'planner' | '360'>('planner');
  const pieceModels = getDetailedPiecesForProduct(
    activeProduct.name,
    activeProduct.category,
    activeProduct.fullRoomModelUrl
  );

  const [selectedGlbUrl, setSelectedGlbUrl] = useState<string>(
    pieceModels[0]?.url || '/models/limoon-berjer.glb'
  );
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [studioTheme, setStudioTheme] = useState<StudioThemeColors>(DEFAULT_LIGHT_STUDIO_THEME);

  useEffect(() => {
    const pieces = getDetailedPiecesForProduct(
      activeProduct.name,
      activeProduct.category,
      activeProduct.fullRoomModelUrl
    );
    setSelectedGlbUrl(pieces[0]?.url || activeProduct.fullRoomModelUrl);
  }, [activeProduct]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const f = params.get('firma')?.trim();
      if (f) setFirma(f.slice(0, 48).toUpperCase());
      if (params.get('helper') === '1' || params.get('kod') === '1') {
        setShowCode(true);
      }
      if (params.get('theme') === 'dark') {
        setStudioTheme({
          bgPage: '#121318',
          bgCard: '#1A1B22',
          textPrimary: '#F5F3EF',
          textMuted: '#A6A29A',
          accentHex: '#CBB07A',
          borderHex: '#2C2E38',
          sceneBgHex: 0x16171d,
        });
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

  const embedCode = `<!-- ${firma} 3D Sanal Showroom & Arka Kamera (AR) Oda Planlayıcı -->
<div style="width:100%;max-width:1280px;margin:24px auto;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.12);">
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

  const orderedCategories = [
    SHARED_DEMO_PRODUCTS.find((p) => p.category === 'Koltuk Takımı'),
    SHARED_DEMO_PRODUCTS.find((p) => p.category === 'Yatak Odası'),
    SHARED_DEMO_PRODUCTS.find((p) => p.category === 'Yemek Odası'),
  ].filter(Boolean) as DemoProduct[];

  return (
    <div
      className="min-h-screen p-3 sm:p-5 space-y-3"
      style={{ backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary }}
    >
      {/* Clean Single-Row Studio Header Matching Website Background */}
      <div
        className="max-w-7xl mx-auto rounded-2xl px-4 py-2.5 border shadow-2xs flex flex-wrap items-center justify-between gap-3"
        style={{ backgroundColor: studioTheme.bgCard, borderColor: studioTheme.borderHex }}
      >
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold tracking-wider uppercase">
            {firma} <span style={{ color: studioTheme.accentHex }} className="font-medium">• 3D Showroom</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l" style={{ borderColor: studioTheme.borderHex }}>
            {orderedCategories.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setActiveProduct(p); setActiveColor(p.colors[0].name); }}
                className="px-3.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer border"
                style={
                  activeProduct.id === p.id
                    ? { backgroundColor: studioTheme.accentHex, color: '#FFFFFF', borderColor: studioTheme.accentHex }
                    : { backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }
                }
              >
                {p.category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <ShowroomAmbienceToggle
            accentHex={studioTheme.accentHex}
            bgHex={studioTheme.bgPage}
            textHex={studioTheme.textPrimary}
            borderHex={studioTheme.borderHex}
          />
          {[
            { id: 'planner', label: '3D Oda & Kamerayla Yerleştir', icon: <Layers size={13} /> },
            { id: '360', label: '360° & 1:1 Lazer AR', icon: <Box size={13} /> },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as 'planner' | '360')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border"
              style={
                tab === item.id
                  ? { backgroundColor: studioTheme.accentHex, color: '#FFFFFF', borderColor: studioTheme.accentHex }
                  : { backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }
              }
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Category Switcher */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
        {orderedCategories.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => { setActiveProduct(p); setActiveColor(p.colors[0].name); }}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap"
            style={
              activeProduct.id === p.id
                ? { backgroundColor: studioTheme.accentHex, color: '#FFFFFF', borderColor: studioTheme.accentHex }
                : { backgroundColor: studioTheme.bgCard, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }
            }
          >
            {p.category}
          </button>
        ))}
      </div>

      {showCode && (
        <div
          className="max-w-7xl mx-auto rounded-2xl p-4 space-y-2.5 border"
          style={{ backgroundColor: studioTheme.bgCard, borderColor: studioTheme.accentHex }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: studioTheme.accentHex }}>WordPress Özel HTML Kodu</span>
            <button
              type="button"
              onClick={copyEmbed}
              className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: studioTheme.accentHex }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Kopyalandı' : 'Kopyala'}
            </button>
          </div>
          <pre
            className="p-3 rounded-xl border text-[11px] overflow-x-auto"
            style={{ backgroundColor: studioTheme.bgPage, borderColor: studioTheme.borderHex }}
          >
            {embedCode}
          </pre>
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
            studioTheme={studioTheme}
          />
        )}

        {tab === '360' && (
          <div className="space-y-3">
            <div
              className="rounded-2xl px-4 py-2.5 border flex flex-wrap items-center justify-between gap-2"
              style={{ backgroundColor: studioTheme.bgCard, borderColor: studioTheme.borderHex }}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                {pieceModels.map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedGlbUrl(pm.url)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border"
                    style={
                      selectedGlbUrl === pm.url
                        ? { backgroundColor: studioTheme.accentHex, color: '#FFFFFF', borderColor: studioTheme.accentHex }
                        : { backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }
                    }
                  >
                    {pm.shortName}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedGlbUrl(activeProduct.fullRoomModelUrl)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border"
                  style={
                    selectedGlbUrl === activeProduct.fullRoomModelUrl
                      ? { backgroundColor: studioTheme.accentHex, color: '#FFFFFF', borderColor: studioTheme.accentHex }
                      : { backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }
                  }
                >
                  Tam Takım
                </button>
              </div>

              <a
                href={selectedGlbUrl}
                download
                className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download size={13} /> .GLB İndir
              </a>
            </div>

            <div
              className="relative h-[480px] sm:h-[560px] rounded-3xl border overflow-hidden"
              style={{ backgroundColor: studioTheme.bgCard, borderColor: studioTheme.borderHex }}
            >
              <model-viewer
                src={selectedGlbUrl}
                alt={activeProduct.name}
                camera-controls
                auto-rotate
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="auto"
                ar-placement="floor"
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
