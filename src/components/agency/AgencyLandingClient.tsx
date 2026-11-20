"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, ArrowUpRight, CheckCircle2, Box, Globe, Bot, CreditCard,
  MessageCircle, Layers, TrendingUp, ShieldCheck, Zap, Phone, MapPin, Award, Send
} from 'lucide-react';
import { DEMO_THEME_LIST } from '@/data/demoThemes';
import { cn } from '@/lib/utils';

const REAL_REFERENCES = [
  {
    name: 'EVSEREN MOBİLYA',
    badge: 'CANLI REFERANS #1',
    url: 'https://evserenmobilya.com',
    external: true,
    image: '/images/yatak_odasi.png',
    tag: 'E-Ticaret + Mobil Admin Paneli',
    summary: 'İnegöl üreticisi için geliştirilmiş canlı e-ticaret mağazası. Telefondan ürün yönetimi, renk/kumaş kartelası, ölçü tablosu, WhatsApp hızlı sipariş ve AI chatbot aktif.',
    highlights: ['Canlı Domain: evserenmobilya.com', 'Mobil Uyumlu Yönetim Paneli', 'WhatsApp & Kumaş Kartelası'],
  },
  {
    name: 'QIENS HOME 3D',
    badge: 'CANLI REFERANS #2',
    url: '/',
    external: false,
    showroomUrl: '/showroom',
    image: '/images/yemek_odasi.png',
    tag: '3D Sanal Showroom & Oda Planlayıcı',
    summary: 'Yeni nesil 3D mobilya e-ticaret platformu. Tam takım 3D modeller, parmakla sürükle-bırak oda planlayıcı, 360° çevirme ve kapak/baza açma deneyimi.',
    highlights: ['360° Tam Takım 3D Modeller', 'Sürükle-Bırak & Çevir Oda Planlayıcı', 'AR (Odanda Gör) Kamera Desteği'],
  },
];

const THEME_DIFFERENCES: Record<string, string> = {
  'aura-luxe': 'Koyu VIP Banner + En Üstte 3D Showroom + Geniş 2’li Lüks Kartlar',
  'nordika': '3’lü İskandinav Bento Banner + 4 Sütunlu Minimalist Kartlar + Ortada 3D Stüdyo',
  'velvet-co': 'Kemerli Dergi Kapağı Hero + Yatay Detaylı Mimari Kartlar + Zümrüt 3D Atölye',
  'sarayli': 'Düğün Paketi Kategori Vitrini + Taksitli Çift Çerçeveli Kartlar + 3D Düğün Planlayıcı',
  'modaline': 'Hero İçinde Canlı 360° 3D Model + Instagram Tarzı Cam Kartlar + Sıcak Bohem Tasarım',
};

export default function AgencyLandingClient() {
  const [selectedConcept, setSelectedConcept] = useState<string>('Aura Luxe Mobilya (VIP)');
  const [firmName, setFirmName] = useState<string>('');
  const [firmCity, setFirmCity] = useState<string>('İnegöl / Bursa');
  const [selectedPkg, setSelectedPkg] = useState<string>('Anahtar Teslim Başlangıç (10.000 ₺)');

  const sendAgencyWhatsApp = (customMsg?: string) => {
    const text =
      customMsg ||
      `Merhaba, web sitenizden ulaşıyorum.\nFirma: ${firmName || 'Mobilya Mağazam'}\nŞehir: ${firmCity}\nBeğendiğim Tasarım: ${selectedConcept}\nPaket: ${selectedPkg}\nDetaylı bilgi almak istiyorum.`;
    window.open(`https://wa.me/905077567887?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-white selection:bg-amber-400 selection:text-black">
      {/* 1. AGENCY NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#07070b]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 text-black font-black flex items-center justify-center shadow-lg">
              E
            </div>
            <div>
              <div className="text-sm sm:text-base font-black tracking-[0.18em] uppercase">
                EMRE <span className="text-amber-400">WEB & 3D</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.22em] text-neutral-400">
                İnegöl Mobilya Dijital Dönüşüm Ajansı
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-neutral-300">
            <a href="#referanslar" className="hover:text-amber-400 transition-colors">Referanslar</a>
            <a href="#tasarimlar" className="hover:text-amber-400 transition-colors">5 Konsept</a>
            <Link href="/teklif-uret" className="text-emerald-400 hover:text-emerald-300 transition-colors">İMOSAB Teklif & QR</Link>
            <Link href="/reels-studyo" className="text-pink-400 hover:text-pink-300 transition-colors">Reels Stüdyo</Link>
            <a href="#paketler" className="hover:text-amber-400 transition-colors">Fiyatlar</a>
          </nav>

          <button
            type="button"
            onClick={() => sendAgencyWhatsApp('Merhaba, mobilya firmam için 3D Showroomlu web sitesi teklifi almak istiyorum.')}
            className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <MessageCircle size={14} /> Hemen Teklif Al
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="top" className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-8 border-b border-white/10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[420px] bg-amber-400/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-300 text-[10px] font-black uppercase tracking-[0.28em]">
            <Sparkles size={12} /> MOBİLYA ÜRETİCİLERİNE ÖZEL 48 SAATTE ANAHTAR TESLİM
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-[1.05]">
            Mobilya Mağazanızı <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
              3D Showroom & Avrupa Satışına
            </span>{' '}
            Taşıyın
          </h1>

          <p className="text-sm sm:text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Sıradan katalog sitelerini unutun. Müşterilerinizin gardırop, yatak, yemek odası ve koltuklarınızı
            <b> 3D döndürüp kendi odasına yerleştirebildiği</b>, kapak ve bazaları açabildiği, <b>Yapay Zeka Robotu</b>,
            <b> WhatsApp Sipariş</b> ve <b>TR / EN / DE Avrupa ihracat</b> altyapılı web sitenizi 48 saatte kuruyoruz.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <a
              href="#tasarimlar"
              className="px-8 py-4 rounded-full bg-amber-400 hover:bg-white text-black text-xs font-black uppercase tracking-widest shadow-2xl transition-all flex items-center gap-2"
            >
              5 Canlı Tasarımı İncele <ArrowUpRight size={16} />
            </a>
            <a
              href="#referanslar"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-black uppercase tracking-widest transition-all"
            >
              Evseren & Qiens Referansları
            </a>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 pt-10 max-w-4xl mx-auto">
            {[
              { val: '10.000 ₺', label: 'Başlangıç Anahtar Teslim' },
              { val: '48 Saat', label: 'Hızlı Yayına Alma' },
              { val: '3D + AR', label: 'Sürükle-Bırak Showroom' },
              { val: 'TR/EN/DE', label: 'Avrupa İhracat Hazır' },
            ].map((s) => (
              <div key={s.val} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                <div className="text-xl sm:text-2xl font-serif font-black text-amber-400">{s.val}</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. REAL LIVE CLIENT REFERENCES: EVSEREN MOBİLYA + QIENS HOME */}
      <section id="referanslar" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400 block mb-2">
              GERÇEK YAYINDAKİ PROJELERİMİZ
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black">
              Aktif Müşteri & Referans Sitelerimiz
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-md">
            Aşağıdaki iki gerçek marka şu an canlıda aktif olarak çalışmakta ve müşterilerine 7/24 hizmet vermektedir.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {REAL_REFERENCES.map((ref) => (
            <div
              key={ref.name}
              className="bg-gradient-to-br from-[#14141e] to-[#0d0d13] border border-amber-400/35 rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img src={ref.image} alt={ref.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14141e] via-black/35 to-transparent" />
                  <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest">
                    {ref.badge}
                  </span>
                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-300">{ref.tag}</div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">{ref.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{ref.summary}</p>
                  <div className="space-y-1.5">
                    {ref.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-neutral-200 font-bold">
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex flex-wrap gap-3">
                {ref.external ? (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 px-5 rounded-full bg-amber-400 hover:bg-white text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    Canlı Siteyi Aç <ArrowUpRight size={15} />
                  </a>
                ) : (
                  <>
                    <Link
                      href={ref.url}
                      className="flex-1 py-3.5 px-5 rounded-full bg-amber-400 hover:bg-white text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      Ana Mağazayı Aç <ArrowUpRight size={15} />
                    </Link>
                    {ref.showroomUrl && (
                      <Link
                        href={ref.showroomUrl}
                        className="py-3.5 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                      >
                        3D Showroom →
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 5 COMPLETELY DIFFERENT READY-TO-SELL FURNITURE WEBSITE CONCEPTS */}
      <section id="tasarimlar" className="bg-[#0c0c12] border-y border-white/10 py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400 block">
              5 ÖZGÜN TASARIM • FARKLI BANNER, KART & 3D DÜZENİ
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black">
              Markanıza En Uygun Tasarımı Seçin
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Her tasarım tamamen farklı yerleşime, banner yapısına ve ürün kartı stiline sahiptir.
              Beğendiğinizi tıklayıp canlı olarak telefonunuzda test edin; satın aldığınızda sizin markanız ve alan adınızla 48 saatte teslim edelim.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_THEME_LIST.map((theme, idx) => (
              <div
                key={theme.slug}
                className="group bg-[#13131c] border border-white/10 hover:border-amber-400/70 rounded-[28px] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-2xl"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={theme.heroImage}
                      alt={theme.brandName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13131c] via-black/30 to-transparent" />
                    <span
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow"
                      style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                    >
                      TASARIM #{idx + 1}
                    </span>
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                        {theme.styleLabel}
                      </div>
                      <h3 className="text-xl font-serif font-black text-white">{theme.brandName}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-[11px] font-bold text-amber-200">
                      ✨ {THEME_DIFFERENCES[theme.slug]}
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{theme.targetAudience}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['3D Showroom', 'Sürükle-Bırak', 'AI Robot', 'WhatsApp', 'TR/EN/DE', '12 Taksit'].map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-neutral-300">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-1 gap-2">
                  <Link
                    href={`/demo/${theme.slug}`}
                    className="w-full py-3.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                  >
                    Canlı İncele <ArrowUpRight size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedConcept(theme.brandName);
                      document.getElementById('teklif')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Bu Tasarımı İstiyorum →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CLIENTS GET HIGH ROI & CONVERSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400">
            SATIŞ & GERİ DÖNÜŞÜM ODAKLI ALTYAPI
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black">
            Sadece Güzel Site Değil, Müşteri Getiren Sistem
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <TrendingUp size={22} />, title: 'Yüksek WhatsApp Dönüşümü', desc: 'Her üründe renk/ölçü otomatik yazılı tek tık WhatsApp sipariş butonu sayesinde ziyaretçi doğrudan müşteriye döner.' },
            { icon: <Box size={22} />, title: '3D Oda Planlama Güveni', desc: 'Müşteri gardırop ve yatağın odasına sığıp sığmayacağını 3D görür; kapak ve bazayı açar, kararsızlık biter.' },
            { icon: <Globe size={22} />, title: 'Avrupa & Google SEO', desc: 'TR / EN / DE çok dilli destek ve Google yapısal veri (JSON-LD) ile Almanya, Hollanda, Belçika’dan müşteri çekin.' },
            { icon: <Bot size={22} />, title: '7/24 Yapay Zeka Robot', desc: 'Gece 02:00’de bile taksit, teslimat ve özel ölçü sorularını yanıtlayan kendi markanıza özel canlı satış robotu.' },
          ].map((b) => (
            <div key={b.title} className="bg-[#12121a] border border-white/10 rounded-3xl p-6 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
                {b.icon}
              </div>
              <h3 className="text-base font-black">{b.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PRICING PACKAGES */}
      <section id="paketler" className="bg-[#0c0c12] border-y border-white/10 py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400">ŞEFFAF FİYATLANDIRMA</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black">Anahtar Teslim Paketlerimiz</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Başlangıç Anahtar Teslim',
                price: '10.000 ₺',
                sub: 'Hızlı başlangıç yapan İnegöl mağazaları için',
                highlight: false,
                features: [
                  '5 Hazır Tasarımdan Seçtiğiniz 1 Konsept',
                  'Kendi Logonuz, Renkleriniz & Ürünleriniz',
                  'Telefondan Yönetim & Hızlı Katalog',
                  'WhatsApp Sipariş & Renk Kartelası',
                  '3D Secure / Havale / Kapıda Ödeme Altyapısı',
                  '48 Saatte Canlı Teslim',
                ],
              },
              {
                name: '3D Showroom + AI Robot Pro',
                price: '19.900 ₺',
                sub: 'En çok tercih edilen yüksek dönüşüm paketi',
                highlight: true,
                features: [
                  'Başlangıç Paketindeki Her Şey',
                  'Sürükle-Bırak 3D Oda Planlayıcı & AR',
                  'Kapak / Çekmece / Baza Açılır 3D Ürünler',
                  '7/24 Yapay Zeka Müşteri Robotu',
                  'TR / EN / DE Avrupa Çok Dilli Altyapı',
                  'Google SEO & Harita Optimizasyonu',
                ],
              },
              {
                name: 'VIP Fabrika & İhracat Özel',
                price: 'Özel Teklif',
                sub: 'Büyük üreticiler ve AutoCAD 3D kataloglar için',
                highlight: false,
                features: [
                  'Firmanıza Özel Sıfırdan Tasarım',
                  'AutoCAD Çizimlerinizden Özel 3D GLB Üretimi',
                  'Bayi & Toptan Fiyat Giriş Paneli',
                  'Avrupa Google & Instagram Reklam Kurulumu',
                  'Öncelikli Teknik Destek & Bakım',
                ],
              },
            ].map((pkg) => (
              <div
                key={pkg.name}
                className={cn(
                  "rounded-[28px] p-6 sm:p-8 border flex flex-col justify-between gap-6",
                  pkg.highlight
                    ? "bg-gradient-to-b from-amber-400/15 to-[#14141e] border-amber-400 shadow-2xl scale-[1.02]"
                    : "bg-[#12121a] border-white/10"
                )}
              >
                <div className="space-y-4">
                  {pkg.highlight && (
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest">
                      EN ÇOK TERCİH EDİLEN
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-black">{pkg.name}</h3>
                    <p className="text-xs text-neutral-400 mt-1">{pkg.sub}</p>
                  </div>
                  <div className="text-3xl sm:text-4xl font-serif font-black text-amber-400">{pkg.price}</div>
                  <div className="space-y-2 pt-2">
                    {pkg.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-xs text-neutral-200">
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPkg(`${pkg.name} (${pkg.price})`);
                    document.getElementById('teklif')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={cn(
                    "w-full py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer",
                    pkg.highlight ? "bg-amber-400 text-black hover:bg-white" : "bg-white/10 text-white hover:bg-amber-400 hover:text-black"
                  )}
                >
                  Bu Paketi Seç →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DIRECT WHATSAPP QUOTE FORM */}
      <section id="teklif" className="max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="bg-gradient-to-br from-[#151520] to-[#0e0e14] border border-amber-400/35 rounded-[32px] p-6 sm:p-10 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400">HEMEN BAŞLAYALIM</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black">48 Saatte Sitenizi Kuralım</h2>
            <p className="text-xs text-neutral-400">
              Beğendiğiniz tasarımı seçin, tek tıkla WhatsApp’tan anında görüşelim.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Firma / Mağaza Adınız</label>
              <input
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                placeholder="Örn: Yıldız Mobilya İnegöl"
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Şehir / Bölge</label>
              <input
                value={firmCity}
                onChange={(e) => setFirmCity(e.target.value)}
                placeholder="İnegöl / Bursa"
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Beğendiğiniz Tasarım</label>
              <select
                value={selectedConcept}
                onChange={(e) => setSelectedConcept(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#1a1a26] border border-white/10 text-white outline-none focus:border-amber-400"
              >
                <option>Aura Luxe Mobilya (VIP Koyu)</option>
                <option>Nordika İnegöl (İskandinav Beyaz)</option>
                <option>Velvet & Co. Home (Zümrüt Editoryal)</option>
                <option>Saraylı Koleksiyon (Klasik Düğün Paketi)</option>
                <option>Moda Line Atölye (Canlı 3D Hero Bohem)</option>
                <option>Evseren Mobilya Tarzı</option>
                <option>Qiens Home 3D Tarzı</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Tercih Ettiğiniz Paket</label>
              <select
                value={selectedPkg}
                onChange={(e) => setSelectedPkg(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#1a1a26] border border-white/10 text-white outline-none focus:border-amber-400"
              >
                <option>Başlangıç Anahtar Teslim (10.000 ₺)</option>
                <option>3D Showroom + AI Robot Pro (19.900 ₺)</option>
                <option>VIP Fabrika & İhracat Özel</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => sendAgencyWhatsApp()}
            className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl cursor-pointer transition-all"
          >
            <Send size={16} /> WhatsApp ile Hemen Teklif & Demo İste
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-8 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-bold text-neutral-300">EMRE WEB & 3D • İnegöl Mobilya Dijital Dönüşüm Ajansı</div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin size={12} /> İnegöl / Bursa</span>
            <span className="flex items-center gap-1"><Phone size={12} /> +90 507 756 78 87</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
