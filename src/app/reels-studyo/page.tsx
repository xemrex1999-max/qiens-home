"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play, Pause, SkipForward, ArrowLeft, Sparkles, Box, Globe,
  Camera, Ruler, QrCode, CheckCircle2, Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReelSlide {
  id: number;
  tag: string;
  headline: string;
  subline: string;
  highlightBadge: string;
  accent: string;
  bgGradient: string;
  image: string;
  bullets: string[];
  ctaText: string;
  durationMs: number;
}

const REEL_SLIDES: ReelSlide[] = [
  {
    id: 1,
    tag: 'İNEGÖL MOBİLYADA DEVRİM',
    headline: 'Müşteriniz Mağazanıza Gelmeden Gardırop Kapağını Açsın!',
    subline: 'Sıradan katalog siteleri devri bitti. Gerçek 3D WebGL odada kapak, çekmece ve amortisörlü baza açılıyor.',
    highlightBadge: 'GERÇEK 3D WEBGL SHOWROOM',
    accent: '#fbbf24',
    bgGradient: 'from-[#1a1408] via-[#0b0b12] to-[#050508]',
    image: '/images/yatak_odasi.png',
    bullets: ['360° Çevirme & Yakınlaştırma', 'Duvar Boyası & Parke Rengi Değişimi', 'Canlı Kumaş Kartelası'],
    ctaText: '48 Saatte Anahtar Teslim',
    durationMs: 4200,
  },
  {
    id: 2,
    tag: 'TYLKO TARZI PARAMETRİK 3D',
    headline: 'Santim Santim Özel Ölçü + Anında Canlı Fiyat!',
    subline: 'Müşteri gardırobunu 210 cm’den 260 cm’ye çeker, 3D model anında 6 kapaklı olur ve özel fiyat hesaplanır.',
    highlightBadge: 'CANLI CM ÖLÇÜ & FİYAT MOTORU',
    accent: '#34d399',
    bgGradient: 'from-[#071f17] via-[#0b1014] to-[#05070a]',
    image: '/images/yemek_odasi.png',
    bullets: ['Genişlik / Derinlik / Yükseklik', 'Anlık ₺ & € Fiyat Hesabı', 'Tek Tıkla WhatsApp Özel Sipariş'],
    ctaText: 'Ölçü Sorusu DM Trafiğini Bitir',
    durationMs: 4200,
  },
  {
    id: 3,
    tag: 'IKEA KREATIV TARZI AI STÜDYO',
    headline: 'Kendi Odanın Fotoğrafını Yükle, Mobilyayı İçinde Gör!',
    subline: 'Müşteriniz odasının fotoğrafını yükler, mobilyayı yerleştirir, Öncesi / Sonrası kaydırıp PNG indirir.',
    highlightBadge: 'YAPAY ZEKA ODA GÖRSELLEŞTİRME',
    accent: '#60a5fa',
    bgGradient: 'from-[#0a1930] via-[#0c0e18] to-[#06060b]',
    image: '/images/koltuk_takimi.png',
    bullets: ['Telefondan Direkt Fotoğraf Yükle', 'Işık & Perspektif Uyumu', 'Öncesi / Sonrası Kaydırıcı'],
    ctaText: 'Kararsız Müşteriyi Anında İkna Et',
    durationMs: 4200,
  },
  {
    id: 4,
    tag: 'AVRUPA İHRACAT & B2B BAYİ',
    headline: 'Almanya, Hollanda & Fransa’ya Kapı Teslim Euro Satış!',
    subline: 'Şehir seç, m³ konteyner doluluğunu ve kapı teslim Euro kargoyu anında hesapla. Şifreli %30 B2B Bayi Modu!',
    highlightBadge: 'TR / EN / DE • EURO & m³ MOTORU',
    accent: '#f59e0b',
    bgGradient: 'from-[#231407] via-[#0f0c0a] to-[#070608]',
    image: '/images/yatak_odasi.png',
    bullets: ['8 Avrupa Ülkesi Kapı Teslim €', '40ft Konteyner & Tır m³ Barı', 'Şifreli B2B Bayi İskonto Modu'],
    ctaText: 'Dövizle Satışa Hemen Başla',
    durationMs: 4200,
  },
  {
    id: 5,
    tag: 'EMRE WEB & 3D • İNEGÖL',
    headline: '10.000 ₺’den Başlayan Fiyatlarla 48 Saatte Yayında!',
    subline: 'Evseren Mobilya & Qiens Home referanslı, 5 özgün hazır konseptten seçin — markanızla hemen kuralım.',
    highlightBadge: 'DM ATIN • KENDİ MARKANIZLA DEMO GÖNDERELİM',
    accent: '#fbbf24',
    bgGradient: 'from-[#221a06] via-[#0d0d14] to-[#050508]',
    image: '/images/yemek_odasi.png',
    bullets: ['7/24 AI Satış Robotu', '12 Taksit + WhatsApp Sipariş', 'WhatsApp: 0507 756 78 87'],
    ctaText: 'Biyografideki Linkten 3D Dene ↑',
    durationMs: 4800,
  },
];

export default function ReelsStudioPage() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [brandLabel, setBrandLabel] = useState('EMRE WEB & 3D');
  const [progress, setProgress] = useState(0);

  const slide = REEL_SLIDES[slideIdx];

  useEffect(() => {
    if (!isPlaying) return;
    setProgress(0);
    const stepMs = 50;
    const total = slide.durationMs;
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + (stepMs / total) * 100;
        if (next >= 100) {
          setSlideIdx(curr => (curr + 1) % REEL_SLIDES.length);
          return 0;
        }
        return next;
      });
    }, stepMs);
    return () => clearInterval(timer);
  }, [isPlaying, slideIdx, slide.durationMs]);

  return (
    <div className="min-h-screen bg-[#06060a] text-white flex flex-col">
      {/* Top Studio Controls */}
      <header className="border-b border-white/10 bg-[#0b0b12]/90 backdrop-blur-xl px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/ajans"
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-amber-400 hover:text-black text-xs font-black flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Ajans
          </Link>
          <div>
            <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400">
              INSTAGRAM REELS / TIKTOK 9:16 VİDEO STÜDYOSU
            </div>
            <div className="text-[10px] text-neutral-400">
              Telefon veya Bilgisayardan Ekran Kaydı Alıp Direkt Yeni Instagram Sayfana Yükle (20 sn Hazır Akış)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={brandLabel}
            onChange={(e) => setBrandLabel(e.target.value)}
            placeholder="Sayfa Adın..."
            className="px-3 py-1.5 rounded-full bg-black/50 border border-white/15 text-xs font-bold text-amber-300 outline-none w-40"
          />
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-1.5 rounded-full bg-amber-400 text-black text-xs font-black flex items-center gap-1 cursor-pointer"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'Duraklat' : 'Oynat'}
          </button>
          <button
            type="button"
            onClick={() => { setSlideIdx((slideIdx + 1) % REEL_SLIDES.length); setProgress(0); }}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-black flex items-center gap-1 cursor-pointer"
          >
            <SkipForward size={13} /> Sonraki
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 9:16 VERTICAL PHONE REELS PLAYER */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-[340px] sm:w-[380px] aspect-[9/16] rounded-[36px] border-[6px] border-[#262632] shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden bg-black flex flex-col justify-between">
            {/* Background Gradient + Image */}
            <div className={cn('absolute inset-0 bg-gradient-to-b transition-all duration-700', slide.bgGradient)} />
            <div className="absolute inset-x-0 top-0 h-[48%] overflow-hidden">
              <img
                key={slide.id}
                src={slide.image}
                alt={slide.headline}
                className="w-full h-full object-cover opacity-55 scale-105 transition-transform duration-[4000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#08080e]" />
            </div>

            {/* Progress Bars (Instagram Story/Reels Top Bar) */}
            <div className="relative z-20 p-4 space-y-3">
              <div className="grid grid-cols-5 gap-1">
                {REEL_SLIDES.map((s, idx) => (
                  <div key={s.id} className="h-1 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-75"
                      style={{
                        backgroundColor: slide.accent,
                        width: idx < slideIdx ? '100%' : idx === slideIdx ? `${progress}%` : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-black font-black text-xs" style={{ backgroundColor: slide.accent }}>
                    3D
                  </div>
                  <span className="text-[11px] font-black tracking-wider uppercase">{brandLabel}</span>
                </div>
                <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-black/70 border border-white/15 text-amber-300">
                  {slideIdx + 1} / {REEL_SLIDES.length}
                </span>
              </div>
            </div>

            {/* Middle Dynamic Content */}
            <div className="relative z-20 px-5 py-4 space-y-4 mt-auto">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-black shadow-lg"
                style={{ backgroundColor: slide.accent }}
              >
                <Sparkles size={11} /> {slide.highlightBadge}
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] opacity-75">
                  {slide.tag}
                </div>
                <h1 className="text-2xl sm:text-[26px] font-serif font-black leading-[1.12] tracking-tight text-white">
                  {slide.headline}
                </h1>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {slide.subline}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {slide.bullets.map((b) => (
                  <div key={b} className="flex items-center gap-2 bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-xs font-bold">
                    <CheckCircle2 size={14} style={{ color: slide.accent }} className="flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Bottom CTA Pill */}
              <div
                className="w-full py-3.5 rounded-2xl text-center text-xs font-black uppercase tracking-widest text-black shadow-2xl"
                style={{ backgroundColor: slide.accent }}
              >
                {slide.ctaText}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 6 COLS: SCENE PICKER + RECORDING GUIDE */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-[#12121a] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest">
              <Smartphone size={15} /> YENİ INSTAGRAM SAYFAN İÇİN 15 SANİYEDE REELS ÇEKME REHBERİ
            </div>
            <ol className="space-y-2 text-xs text-neutral-300 list-decimal list-inside leading-relaxed">
              <li>Yukarıdaki kutuya yeni açtığın Instagram kullanıcı adını yaz (otomatik videoda görünür).</li>
              <li>Telefonundan bu sayfayı aç veya PC&apos;de ekran kaydını başlat (<b className="text-white">Win + Alt + R</b>).</li>
              <li>Soldaki 9:16 dikey oynatıcı 5 sahneyi 21 saniyede otomatik akıtır — kaydet ve direkt Reels&apos;e yükle!</li>
              <li>Masaüstündeki <b className="text-amber-300">INSTAGRAM_REELS_ICERIK_KITI.md</b> dosyasındaki hazır açıklama ve etiketleri kopyalayıp yapıştır.</li>
            </ol>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              SAHNELER ARASINDA GEÇİŞ YAP:
            </div>
            {REEL_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setSlideIdx(idx); setProgress(0); }}
                className={cn(
                  'w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-all',
                  idx === slideIdx
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-[#111118] border-white/10 text-neutral-300 hover:border-white/30'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-xl flex items-center justify-center text-black font-black text-xs flex-shrink-0" style={{ backgroundColor: s.accent }}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-black truncate">{s.headline}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{s.highlightBadge}</div>
                  </div>
                </div>
                {idx === 0 ? <Box size={15} /> : idx === 1 ? <Ruler size={15} /> : idx === 2 ? <Camera size={15} /> : idx === 3 ? <Globe size={15} /> : <QrCode size={15} />}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/teklif-uret"
              className="flex-1 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider text-center"
            >
              🎯 İMOSAB 34 Fabrika Teklif & QR Motoru →
            </Link>
            <Link
              href="/vitrin"
              className="py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider text-center"
            >
              5 Hazır Site Vitrini
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
