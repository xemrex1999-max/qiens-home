import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { DEMO_THEME_LIST } from '@/data/demoThemes';
import { Sparkles, ArrowUpRight, CheckCircle2, Box, Globe, Bot, CreditCard, MessageCircle, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mobilya Web Sitesi Sunum Vitrini | 5 Konsept + Evseren & Qiens Home',
  description: 'İnegöl ve Avrupa pazarı için 3D Showroom, Sürükle-Bırak Oda Planlayıcı, AI Robot, WhatsApp ve Ödeme entegrasyonlu canlı mobilya siteleri.',
};

const THEME_TAGS: Record<string, string> = {
  'aura-luxe': 'Koyu VIP Banner • En Üstte 3D Showroom • Geniş 2’li Lüks Kart',
  'nordika': '3’lü İskandinav Bento Banner • 4 Sütunlu Minimalist Kart • Ortada 3D Stüdyo',
  'velvet-co': 'Kemerli Dergi Hero • Yatay Detaylı Mimari Kart • Zümrüt 3D Atölye',
  'sarayli': 'Düğün Paketi Kategori Vitrini • Taksitli Çift Çerçeveli Kart • 3D Düğün Planlayıcı',
  'modaline': 'Hero İçinde Canlı 3D Model • Instagram Cam Kartlar • Sıcak Bohem Tasarım',
};

export default function VitrinPage() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white px-4 sm:px-8 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Bar to Agency Home */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <Link
            href="/ajans"
            className="px-4 py-2 rounded-full bg-amber-400 hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all"
          >
            ← Ajans Ana Sayfam (/ajans)
          </Link>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">
            EMRE WEB & 3D • CANLI MÜŞTERİ SUNUM VİTRİNİ
          </span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-[0.28em]">
            <Sparkles size={12} /> 2 GERÇEK REFERANS + 5 ÖZGÜN MOBİLYA KONSEPTİ
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-tight">
            Canlı Mobilya Web Sitesi <span className="text-amber-400">Sunum Vitrini</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Gerçek yayındaki projelerimizi ve her biri farklı banner, ürün kartı ve 3D Showroom yerleşimine sahip 5 özgün tasarımımızı aşağıdan tek dokunuşla inceleyin.
          </p>

          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {[
              { icon: <Box size={12} />, label: 'Tam Takım 3D Showroom' },
              { icon: <Sparkles size={12} />, label: '360° Çevirme & Kapak/Baza Açma' },
              { icon: <MessageCircle size={12} />, label: 'WhatsApp Hızlı Sipariş' },
              { icon: <Bot size={12} />, label: 'Yapay Zeka Müşteri Robotu' },
              { icon: <CreditCard size={12} />, label: '3D Secure & 12 Taksit' },
              { icon: <Globe size={12} />, label: 'TR / EN / DE Avrupa Desteği' },
            ].map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-neutral-200"
              >
                <span className="text-amber-400">{f.icon}</span>
                {f.label}
              </span>
            ))}
          </div>
        </div>

        {/* SECTION A: REAL LIVE REFERENCES (EVSEREN MOBİLYA & QIENS HOME) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-amber-400">
            <Award size={15} /> GERÇEK YAYINDAKİ REFERANS SİTELERİMİZ
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Evseren Mobilya */}
            <div className="bg-gradient-to-br from-emerald-950/50 to-[#12121a] border border-emerald-400/40 rounded-[28px] p-6 flex flex-col justify-between gap-5 shadow-2xl">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest">
                  GERÇEK REFERANS • EVSERENMOBİLYA.COM
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">EVSEREN MOBİLYA</h2>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Canlı domaininde aktif çalışan İnegöl e-ticaret sitesi. Telefondan tam yönetilebilir admin paneli, renk/kumaş kartelası, ölçü tablosu, WhatsApp sipariş ve AI robot entegreli.
                </p>
              </div>
              <a
                href="https://evserenmobilya.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-full bg-emerald-500 hover:bg-white text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                evserenmobilya.com Sitesini Aç <ArrowUpRight size={15} />
              </a>
            </div>

            {/* Qiens Home */}
            <div className="bg-gradient-to-br from-amber-400/15 to-[#12121a] border border-amber-400/45 rounded-[28px] p-6 flex flex-col justify-between gap-5 shadow-2xl">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest">
                  GERÇEK REFERANS • 3D SHOWROOM PLATFORMU
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">QIENS HOME 3D</h2>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Gelişmiş 3D Sanal Showroom, 360° çevrilebilen sürükle-bırak oda planlayıcı, açılır gardırop kapakları/baza animasyonları ve tam katalog altyapısına sahip ana referans sitemiz.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/"
                  className="py-3.5 px-4 rounded-full bg-white text-black hover:bg-amber-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all"
                >
                  Ana Mağaza <ArrowUpRight size={14} />
                </Link>
                <Link
                  href="/showroom"
                  className="py-3.5 px-4 rounded-full bg-amber-400 text-black hover:bg-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all"
                >
                  3D Showroom <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION B: 5 COMPLETELY DIFFERENT CONCEPT WEBSITES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-amber-400">
            <Sparkles size={15} /> 5 FARKLI TASARIM & DÜZENDE HAZIR MOBİLYA SİTESİ
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {DEMO_THEME_LIST.map((theme, index) => (
              <div
                key={theme.slug}
                className="group bg-[#12121a] border border-white/10 hover:border-amber-400/60 rounded-[28px] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-2xl"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={theme.heroImage}
                      alt={theme.brandName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-black/30 to-transparent" />
                    <span
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg"
                      style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                    >
                      KONSEPT #{index + 1}
                    </span>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                          {theme.styleLabel}
                        </div>
                        <h2 className="text-xl font-serif font-black text-white">
                          {theme.brandName}
                        </h2>
                      </div>
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white/40 flex-shrink-0"
                        style={{ backgroundColor: theme.accentHex }}
                      />
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-[11px] font-bold text-amber-200">
                      🎨 {THEME_TAGS[theme.slug]}
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {theme.targetAudience}
                    </p>
                    <div className="space-y-1.5 text-[11px] text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                        <span>360° Çevirme + Kapak/Çekmece/Baza Açılan 3D Oda</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                        <span>{theme.botName} + WhatsApp + Taksitli Ödeme</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                        <span>TR / EN / DE Avrupa Çok Dilli Altyapı</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/demo/${theme.slug}`}
                    className="w-full py-3.5 px-5 rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                  >
                    Canlı Siteyi Aç & İncele <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
