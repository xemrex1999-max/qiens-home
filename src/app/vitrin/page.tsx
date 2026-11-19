import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { DEMO_THEME_LIST } from '@/data/demoThemes';
import { Sparkles, ArrowUpRight, CheckCircle2, Box, Globe, Bot, CreditCard, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '5 Canlı Mobilya Web Sitesi Konsepti | Sunum Vitrini',
  description: 'İnegöl ve Avrupa pazarı için 3D Showroom, Sürükle-Bırak Oda Planlayıcı, AI Robot, WhatsApp ve Ödeme entegrasyonlu 5 farklı mobilya e-ticaret konsepti.',
};

export default function VitrinPage() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white px-4 sm:px-8 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-[0.28em]">
            <Sparkles size={12} /> ANAHTAR TESLİM MOBİLYA WEB SİTESİ VİTRİNİ
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-tight">
            5 Farklı Konsept, <span className="text-amber-400">Tek Altyapı</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Aşağıdaki 5 canlı mobilya sitesinin her biri farklı müşteri kitlesine özel tasarlandı.
            Beğendiğiniz tasarımı markanızın logosu, ürünleri ve özel alan adınızla 48 saat içinde yayına alıyoruz.
          </p>

          {/* Included Features Badges */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {[
              { icon: <Box size={12} />, label: 'Tam Takım 3D Showroom' },
              { icon: <Sparkles size={12} />, label: 'Sürükle-Bırak Oda Planlayıcı' },
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

        {/* 5 Live Websites Grid */}
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
                      title="Ana Marka Rengi"
                    />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {theme.targetAudience}
                  </p>
                  <div className="space-y-1.5 text-[11px] text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                      <span>Tam Takım 3D Showroom + Sürükle-Bırak Oda Dizici</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                      <span>{theme.botName} + WhatsApp + Taksitli Ödeme</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                      <span>Mobil Uyumlu + TR / EN / DE Çok Dilli Altyapı</span>
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

          {/* 6th Card: Qiens Home Main Store Link */}
          <div className="bg-gradient-to-br from-amber-400/15 to-[#12121a] border border-amber-400/40 rounded-[28px] p-6 flex flex-col justify-between gap-6 shadow-2xl">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest">
                ANA MAĞAZA + 3D STÜDYO
              </span>
              <h2 className="text-2xl font-serif font-black text-white">QIENS HOME</h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Gelişmiş 3D Sanal Showroom, Sürükle-Bırak Oda Yerleşim Planlayıcısı ve tam katalog altyapısına sahip ana referans sitemiz.
              </p>
            </div>
            <div className="space-y-2.5">
              <Link
                href="/"
                className="w-full py-3.5 px-5 rounded-full bg-white text-black hover:bg-amber-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                Qiens Home Ana Sayfa <ArrowUpRight size={15} />
              </Link>
              <Link
                href="/showroom"
                className="w-full py-3.5 px-5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 hover:bg-amber-400 hover:text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                3D Showroom & Sürükle-Bırak <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
