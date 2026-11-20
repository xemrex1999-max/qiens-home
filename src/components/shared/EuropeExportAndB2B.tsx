"use client";

import React, { useState } from 'react';
import {
  Globe, Truck, Package, Lock, Unlock, CheckCircle2, MessageCircle,
  Plus, Minus, Ship, ShieldCheck, Building2, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EuropeDestination {
  id: string;
  country: string;
  city: string;
  flag: string;
  ratePerM3: number; // EUR per m3
  customsFlatEur: number;
  days: string;
}

const EUROPE_DESTINATIONS: EuropeDestination[] = [
  { id: 'de-cgn', country: 'Almanya', city: 'Köln / Düsseldorf / Ruhr', flag: '🇩🇪', ratePerM3: 145, customsFlatEur: 180, days: '10–14 İş Günü' },
  { id: 'de-ber', country: 'Almanya', city: 'Berlin / Münih / Frankfurt', flag: '🇩🇪', ratePerM3: 155, customsFlatEur: 180, days: '12–16 İş Günü' },
  { id: 'nl-ams', country: 'Hollanda', city: 'Rotterdam / Amsterdam', flag: '🇳🇱', ratePerM3: 155, customsFlatEur: 195, days: '12–16 İş Günü' },
  { id: 'be-bru', country: 'Belçika', city: 'Brüksel / Anvers', flag: '🇧🇪', ratePerM3: 155, customsFlatEur: 195, days: '12–16 İş Günü' },
  { id: 'fr-par', country: 'Fransa', city: 'Paris / Lyon / Strazburg', flag: '🇫🇷', ratePerM3: 165, customsFlatEur: 210, days: '14–18 İş Günü' },
  { id: 'at-vie', country: 'Avusturya', city: 'Viyana / Graz', flag: '🇦🇹', ratePerM3: 135, customsFlatEur: 165, days: '9–13 İş Günü' },
  { id: 'ch-zrh', country: 'İsviçre', city: 'Zürih / Basel (Gümrük Dahil)', flag: '🇨🇭', ratePerM3: 185, customsFlatEur: 290, days: '14–19 İş Günü' },
  { id: 'uk-lon', country: 'İngiltere', city: 'Londra / Manchester', flag: '🇬🇧', ratePerM3: 210, customsFlatEur: 340, days: '16–22 İş Günü' },
];

interface ExportCatalogItem {
  id: string;
  name: string;
  m3: number;
  retailEur: number;
  wholesaleEur: number;
  tag: string;
}

const EXPORT_ITEMS: ExportCatalogItem[] = [
  { id: 'yatak', name: 'Yatak Odası Tam Takım (6 Kapak + Baza)', m3: 3.8, retailEur: 2050, wholesaleEur: 1435, tag: '3.8 m³' },
  { id: 'yemek', name: 'Yemek Odası Takımı (Konsol + Açılır Masa + 6 Sandalye)', m3: 3.2, retailEur: 1850, wholesaleEur: 1295, tag: '3.2 m³' },
  { id: 'koltuk', name: 'Lüks Koltuk Takımı (3+3+1+1)', m3: 4.4, retailEur: 1980, wholesaleEur: 1385, tag: '4.4 m³' },
  { id: 'dugun', name: 'Komple Ev / Düğün Paketi (3 Takım)', m3: 10.6, retailEur: 5250, wholesaleEur: 3675, tag: '10.6 m³' },
];

interface EuropeExportAndB2BProps {
  brandName?: string;
  accentHex?: string;
  isDark?: boolean;
  whatsappPhone?: string;
}

export default function EuropeExportAndB2B({
  brandName = 'İnegöl Fabrika',
  accentHex = '#d4af37',
  isDark = true,
  whatsappPhone = '905077567887',
}: EuropeExportAndB2BProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'b2b'>('export');
  const [selectedDestId, setSelectedDestId] = useState<string>('de-cgn');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    yatak: 1,
    yemek: 1,
    koltuk: 0,
    dugun: 0,
  });

  // B2B Password Mode
  const [b2bPassword, setB2bPassword] = useState<string>('');
  const [b2bUnlocked, setB2bUnlocked] = useState<boolean>(false);
  const [b2bError, setB2bError] = useState<string>('');

  const dest = EUROPE_DESTINATIONS.find(d => d.id === selectedDestId) || EUROPE_DESTINATIONS[0];

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, Math.min(20, (prev[id] || 0) + delta)),
    }));
  };

  const totals = EXPORT_ITEMS.reduce(
    (acc, item) => {
      const q = quantities[item.id] || 0;
      acc.count += q;
      acc.m3 += q * item.m3;
      acc.retailEur += q * item.retailEur;
      acc.wholesaleEur += q * item.wholesaleEur;
      return acc;
    },
    { count: 0, m3: 0, retailEur: 0, wholesaleEur: 0 }
  );

  const shippingEur = totals.m3 > 0 ? Math.round(totals.m3 * dest.ratePerM3 + dest.customsFlatEur) : 0;
  const activeProductTotalEur = b2bUnlocked ? totals.wholesaleEur : totals.retailEur;
  const grandTotalEur = activeProductTotalEur + shippingEur;
  const container40FillPct = Math.min(100, Math.round((totals.m3 / 68) * 100));
  const truckFillPct = Math.min(100, Math.round((totals.m3 / 82) * 100));

  const handleUnlockB2B = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (b2bPassword.trim().toUpperCase() === 'BAYI2026') {
      setB2bUnlocked(true);
      setB2bError('');
    } else {
      setB2bError('Geçersiz bayi kodu. Demo için: BAYI2026');
    }
  };

  const sendExportWhatsApp = () => {
    const itemLines = EXPORT_ITEMS.filter(i => (quantities[i.id] || 0) > 0)
      .map(i => `• ${quantities[i.id]}x ${i.name} (${(quantities[i.id] * i.m3).toFixed(1)} m³)`)
      .join('\n');

    const modeTitle = b2bUnlocked ? 'B2B TOPTAN BAYİ İHRACAT SİPARİŞİ (%30 İskontolu)' : 'AVRUPA KAPI TESLİM SİPARİŞ TEKLİFİ';
    const msg = `Merhaba ${brandName},\n${modeTitle}:\n\nHedef Ülke / Şehir: ${dest.flag} ${dest.country} - ${dest.city}\nSeçilen Ürünler:\n${itemLines || '• Genel Avrupa Fiyat Listesi'}\n\nToplam Hacim: ${totals.m3.toFixed(1)} m³ (40ft Konteyner %${container40FillPct})\nÜrün Tutarı: €${activeProductTotalEur.toLocaleString('de-DE')}\nSigortalı Nakliye + Gümrük: €${shippingEur.toLocaleString('de-DE')}\nTahmini Kapı Teslim Toplam: €${grandTotalEur.toLocaleString('de-DE')}\n\nKesin proforma fatura ve teslimat takvimi alabilir miyim?`;
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const containerCls = isDark
    ? 'bg-[#111218] text-white border-white/10'
    : 'bg-white text-neutral-900 border-neutral-200 shadow-xl';
  const surfaceCls = isDark
    ? 'bg-white/[0.04] border-white/10'
    : 'bg-neutral-50 border-neutral-200';
  const mutedCls = isDark ? 'text-neutral-400' : 'text-neutral-600';

  return (
    <section id="avrupa-ihracat" className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className={cn('rounded-[32px] border p-5 sm:p-8 lg:p-10 space-y-6', containerCls)}>
        {/* Header & Mode Switch */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border"
              style={{ borderColor: `${accentHex}55`, color: accentHex, backgroundColor: `${accentHex}15` }}>
              <Globe size={12} /> AVRUPA KAPI TESLİM & B2B BAYİ İHRACAT MODÜLÜ
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
              Avrupa Kargo, Gümrük & m³ Konteyner Hesaplayıcı
            </h2>
            <p className={cn('text-xs sm:text-sm max-w-2xl', mutedCls)}>
              Almanya, Hollanda, Belçika, Fransa, İsviçre ve İngiltere&apos;ye EUR1 belgeli, sigortalı kapı teslim Euro fiyatını saniyeler içinde hesaplayın.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('export')}
              className={cn(
                'px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border',
                activeTab === 'export'
                  ? 'text-black shadow-lg border-transparent'
                  : cn(surfaceCls, mutedCls)
              )}
              style={activeTab === 'export' ? { backgroundColor: accentHex } : undefined}
            >
              <Truck size={14} /> Avrupa Kapı Teslim (€)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('b2b')}
              className={cn(
                'px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border',
                activeTab === 'b2b'
                  ? 'text-black shadow-lg border-transparent'
                  : cn(surfaceCls, mutedCls)
              )}
              style={activeTab === 'b2b' ? { backgroundColor: accentHex } : undefined}
            >
              {b2bUnlocked ? <Unlock size={14} /> : <Lock size={14} />}
              {b2bUnlocked ? 'B2B Bayi Aktif (-%30)' : 'B2B Bayi / Toptan Giriş'}
            </button>
          </div>
        </div>

        {/* B2B PASSWORD UNLOCK BAR */}
        {activeTab === 'b2b' && !b2bUnlocked && (
          <div className={cn('rounded-2xl border p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4', surfaceCls)}>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-black">
                <Building2 size={16} style={{ color: accentHex }} />
                Yurt İçi & Avrupa Bayi / Mağaza Toptan Fiyat Girişi
              </div>
              <p className={cn('text-xs', mutedCls)}>
                Yetkili bayilerimize özel %30 fabrika çıkış iskontosu, konteyner bazlı yükleme planı ve EUR.1 ihracat fiyatlarını görmek için bayi şifrenizi girin.
              </p>
            </div>

            <form onSubmit={handleUnlockB2B} className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={b2bPassword}
                onChange={(e) => setB2bPassword(e.target.value)}
                placeholder="Bayi Kodu (örn. BAYI2026)"
                className={cn(
                  'px-3.5 py-2.5 rounded-xl border text-xs font-bold outline-none min-w-[190px]',
                  isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-white border-neutral-300 text-black'
                )}
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-black cursor-pointer"
                style={{ backgroundColor: accentHex }}
              >
                Kilidi Aç
              </button>
              <button
                type="button"
                onClick={() => { setB2bPassword('BAYI2026'); setB2bUnlocked(true); setB2bError(''); }}
                className="px-3 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase cursor-pointer hover:bg-emerald-600 hover:text-white transition-all"
              >
                Demo: BAYI2026
              </button>
              {b2bError && <div className="w-full text-[11px] font-bold text-red-400">{b2bError}</div>}
            </form>
          </div>
        )}

        {b2bUnlocked && (
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/40 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-black text-emerald-400">
              <CheckCircle2 size={16} /> B2B BAYİ MODU AKTİF — TÜM ÜRÜNLERDE %30 FABRİKA TOPTAN İSKONTOSU UYGULANDI
            </div>
            <button
              type="button"
              onClick={() => { setB2bUnlocked(false); setB2bPassword(''); }}
              className="text-[10px] font-bold underline opacity-80 hover:opacity-100 cursor-pointer"
            >
              Perakende Fiyatlara Dön
            </button>
          </div>
        )}

        {/* Main 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Destination & Furniture Quantities */}
          <div className="lg:col-span-7 space-y-5">
            {/* Step 1: Select Destination City */}
            <div className={cn('rounded-2xl border p-4 space-y-3', surfaceCls)}>
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentHex }}>
                1. TESLİMAT ÜLKESİ / ŞEHRİ SEÇİN
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EUROPE_DESTINATIONS.map((d) => {
                  const active = d.id === selectedDestId;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDestId(d.id)}
                      className={cn(
                        'p-2.5 rounded-xl border text-left transition-all cursor-pointer',
                        active
                          ? 'shadow-md'
                          : isDark ? 'bg-black/30 border-white/10 hover:border-white/30' : 'bg-white border-neutral-200 hover:border-neutral-400'
                      )}
                      style={active ? { borderColor: accentHex, backgroundColor: `${accentHex}22` } : undefined}
                    >
                      <div className="text-xs font-black flex items-center gap-1.5">
                        <span>{d.flag}</span>
                        <span className="truncate">{d.country}</span>
                      </div>
                      <div className={cn('text-[10px] truncate mt-0.5', mutedCls)}>{d.city}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Furniture Sets & Quantities */}
            <div className={cn('rounded-2xl border p-4 space-y-3', surfaceCls)}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentHex }}>
                  2. TAKIM ADETLERİNİ BELİRLEYİN (OTOMATİK m³ HESABI)
                </span>
                <span className={cn('text-[10px] font-bold', mutedCls)}>
                  {b2bUnlocked ? 'Bayi Toptan (€)' : 'Avrupa Perakende (€)'}
                </span>
              </div>

              <div className="space-y-2.5">
                {EXPORT_ITEMS.map((item) => {
                  const qty = quantities[item.id] || 0;
                  const unitPrice = b2bUnlocked ? item.wholesaleEur : item.retailEur;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'p-3 rounded-xl border flex flex-wrap sm:flex-nowrap items-center justify-between gap-3',
                        isDark ? 'bg-black/30 border-white/10' : 'bg-white border-neutral-200'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-black flex items-center gap-2 flex-wrap">
                          <span>{item.name}</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-black" style={{ backgroundColor: `${accentHex}22`, color: accentHex }}>
                            {item.tag}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold mt-0.5 flex items-center gap-2">
                          <span style={{ color: accentHex }}>€{unitPrice.toLocaleString('de-DE')} / takım</span>
                          {b2bUnlocked && (
                            <span className="line-through text-[10px] opacity-50">€{item.retailEur.toLocaleString('de-DE')}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          className={cn('w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer', isDark ? 'border-white/15 hover:bg-white/10' : 'border-neutral-300 hover:bg-neutral-100')}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm font-black">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="w-8 h-8 rounded-lg text-black font-black flex items-center justify-center cursor-pointer"
                          style={{ backgroundColor: accentHex }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 5 cols: Live Summary, Container Fill Bar & WhatsApp Export Quote */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className={cn('rounded-2xl border p-5 sm:p-6 space-y-5 flex-1', surfaceCls)}>
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentHex }}>
                    CANLI İHRACAT ÖZETİ
                  </div>
                  <div className="text-base font-black mt-0.5">
                    {dest.flag} {dest.country} — {dest.city}
                  </div>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  {dest.days}
                </span>
              </div>

              {/* Container / Truck Fill Gauge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="flex items-center gap-1.5">
                    <Ship size={14} style={{ color: accentHex }} /> 40ft Konteyner Doluluk (68 m³)
                  </span>
                  <span style={{ color: accentHex }}>{totals.m3.toFixed(1)} m³ (%{container40FillPct})</span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/30 overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(container40FillPct, totals.m3 > 0 ? 4 : 0)}%`, backgroundColor: accentHex }}
                  />
                </div>
                <div className={cn('flex justify-between text-[10px] font-bold', mutedCls)}>
                  <span>Parsiyel Tır (82 m³): %{truckFillPct}</span>
                  <span>EUR.1 & Sigorta Dahil</span>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 text-xs pt-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
                <div className="flex justify-between">
                  <span className={mutedCls}>Seçilen Takımlar ({totals.count} adet)</span>
                  <span className="font-black">€{activeProductTotalEur.toLocaleString('de-DE')}</span>
                </div>
                <div className="flex justify-between">
                  <span className={mutedCls}>Kapı Teslim Nakliye + Gümrük ({totals.m3.toFixed(1)} m³)</span>
                  <span className="font-black">€{shippingEur.toLocaleString('de-DE')}</span>
                </div>
                {b2bUnlocked && (
                  <div className="flex justify-between text-emerald-400 font-black">
                    <span>B2B Bayi Tasarrufunuz (%30)</span>
                    <span>-€{(totals.retailEur - totals.wholesaleEur).toLocaleString('de-DE')}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-3 border-t text-base sm:text-xl font-serif font-black"
                  style={{ borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }}>
                  <span>Kapı Teslim Toplam</span>
                  <span style={{ color: accentHex }}>€{grandTotalEur.toLocaleString('de-DE')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <div className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-400" /> Hasar Sigortalı Sevkiyat</div>
                <div className="flex items-center gap-1.5"><Package size={13} className="text-emerald-400" /> İhracat Sandık Paketleme</div>
              </div>

              <button
                type="button"
                onClick={sendExportWhatsApp}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
              >
                <MessageCircle size={16} />
                {b2bUnlocked ? 'B2B Proforma & Konteyner Teklifi Al' : 'Avrupa Kapı Teslim Teklifi İste'}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
