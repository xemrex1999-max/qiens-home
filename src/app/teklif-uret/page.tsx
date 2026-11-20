"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles, Search, MessageCircle, ExternalLink, Copy, Check,
  QrCode, ArrowLeft, Building2, Phone, MapPin, Video
} from 'lucide-react';
import { DEMO_THEME_LIST } from '@/data/demoThemes';
import { cn } from '@/lib/utils';

interface ImosabLead {
  id: number;
  brand: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  recommendedTheme: string;
  strategy: string;
}

const IMOSAB_LEADS: ImosabLead[] = [
  { id: 1, brand: 'ONİX SOFA', phone: '0532 465 16 79', email: 'onix@onix.com.tr', address: 'Hamzabey OSB 5. Cad. No:21', category: 'Koltuk Takımı / Salon', recommendedTheme: 'aura-luxe', strategy: "Instagram DM'den manuel sipariş alıyor" },
  { id: 2, brand: 'VANİTTİ MOBİLİ', phone: '0549 313 00 78', email: 'muhasebe@vanitti.com', address: 'Hamzabey OSB 3. Cad. No:26', category: 'Lüks Yatak & Yemek', recommendedTheme: 'velvet-co', strategy: 'Lüks katalog var, web mağazası yok' },
  { id: 3, brand: 'ELMALI KOLTUK', phone: '0532 351 91 95', email: 'muhasebe@elmalimobilya.com', address: 'Hamzabey OSB 5. Cad. No:20', category: 'Koltuk / Oturma Grubu', recommendedTheme: 'modaline', strategy: 'Instagram ağırlıklı, online sipariş yok' },
  { id: 4, brand: 'EYMENSE EV & YAŞAM', phone: '0546 427 90 00', email: 'muhasebe@eymense.com', address: 'Hamzabey OSB 4. Cad. No:10', category: 'Yatak / Yemek / Koltuk', recommendedTheme: 'nordika', strategy: 'Takipçi yüksek, doğrudan satışa hazır' },
  { id: 5, brand: 'OCASSO MOBİLYA', phone: '0532 589 44 99', email: 'nijat.alemdar@gmail.com', address: 'Hamzabey OSB 1. Cad. No:32', category: 'Modüler Mobilya', recommendedTheme: 'nordika', strategy: 'Büyük üretici, B2B bayi vitrini yok' },
  { id: 6, brand: 'Pİ KONSEPT MOBİLYA', phone: '0530 432 82 82', email: 'fatura@pi-konsept.com', address: 'Hamzabey OSB 17. Cad. No:7', category: 'Modern Konsept', recommendedTheme: 'modaline', strategy: 'Sosyal medyadan tek tek fiyat veriyor' },
  { id: 7, brand: 'ODAM KOLTUK', phone: '0541 727 70 18', email: 'muhasebe@odam.com.tr', address: 'Hamzabey OSB 17. Cad. No:13', category: 'Koltuk & Kanepe', recommendedTheme: 'aura-luxe', strategy: 'Web sitesi hiç kurulmamış' },
  { id: 8, brand: 'RENZO HOME', phone: '0532 168 90 16', email: 'info@renzohome.com.tr', address: 'Hamzabey OSB 1. Cad. No:25', category: 'Koltuk / Oturma Grubu', recommendedTheme: 'velvet-co', strategy: 'Reels ile müşteri topluyor, sitesi yok' },
  { id: 9, brand: 'FEYZA İNSLEEP', phone: '0539 848 16 85', email: 'info@insleep.com.tr', address: 'Hamzabey OSB 17. Cad. No:7', category: 'Yatak & Baza', recommendedTheme: 'nordika', strategy: 'Fabrika satışı, perakende e-ticaret yok' },
  { id: 10, brand: 'KAMELYA MOBİLYA', phone: '0542 414 32 62', email: 'info@bursammobilya.com', address: 'Hamzabey OSB 5. Cad. No:13', category: 'Yemek Odası & Koltuk', recommendedTheme: 'sarayli', strategy: 'Toptan & Instagram ile çalışıyor' },
  { id: 11, brand: 'WHİTE MOBİLYA', phone: '0545 718 60 55', email: 'muhasebe@dasellmobilya.com', address: 'Hamzabey OSB 4. Cad. No:14', category: 'Yatak Odası', recommendedTheme: 'nordika', strategy: "WhatsApp'tan PDF katalog atıyor" },
  { id: 12, brand: 'ELİFYA MOBİLYA', phone: '0532 627 87 56', email: 'elifya@outlook.com.tr', address: 'Hamzabey OSB 5. Cad. No:19', category: 'Mobilya İmalatı', recommendedTheme: 'sarayli', strategy: 'Kendi markasını öne çıkaracak site yok' },
  { id: 13, brand: 'ERFA MOBİLYA', phone: '0549 250 22 11', email: 'info@erfamobilya.com', address: 'Hamzabey OSB 4. Cad. No:5', category: 'Yatak & Yemek', recommendedTheme: 'aura-luxe', strategy: 'Katalog çekimleri hazır, web yok' },
  { id: 14, brand: 'ÖZGÜR MOBİLYA', phone: '0532 390 88 23', email: 'ozgurmobilyamasko@htmail.com', address: 'Hamzabey OSB 4. Cad. No:6', category: 'Modern Mobilya', recommendedTheme: 'modaline', strategy: 'Masko & İnegöl bağlantılı, web yok' },
  { id: 15, brand: 'BAY-PA MOBİLYA', phone: '0532 715 68 92', email: 'Baypa.burhandemir@gmail.com', address: 'Hamzabey OSB 4. Cad. No:7', category: 'Mobilya Atölyesi', recommendedTheme: 'nordika', strategy: 'Anahtar teslim hızlı web arıyor' },
  { id: 16, brand: 'CELAL ÜLKE MOBİLYA', phone: '0532 549 51 60', email: 'celalulke@hotmail.com', address: 'Hamzabey OSB 3. Cad. No:8', category: 'Mobilya Ticaret', recommendedTheme: 'sarayli', strategy: 'Telefon ve çevre ile satış yapıyor' },
  { id: 17, brand: 'GALA MOBİLYA', phone: '0224 714 96 00', email: 'muhasebe@galamobilya.com', address: 'Hamzabey OSB 1. Cad. No:21', category: 'Büyük İmalatçı', recommendedTheme: 'aura-luxe', strategy: 'Yüksek ciro, kurumsal 3D & ihracat' },
  { id: 18, brand: 'İDOL MOBİLYA', phone: '0224 712 20 20', email: 'info@idolmobilya.com', address: 'Hamzabey OSB 23. Cad. No:1', category: 'Yatak & Yemek', recommendedTheme: 'velvet-co', strategy: 'Katalog güçlü, online sipariş yok' },
  { id: 19, brand: 'BOZTAŞ PREMİUM', phone: '0224 714 86 43', email: 'muhasebe@boztaspremium.com', address: 'Hamzabey OSB 9. Cad. No:3', category: 'Lüks Mobilya', recommendedTheme: 'aura-luxe', strategy: 'Instagram aktif, VIP 3D birebir uyar' },
  { id: 20, brand: 'MUZAFFER MOBİLYA', phone: '0224 711 77 99', email: 'muhasebe@muzaffermobilya.com', address: 'Hamzabey OSB 2. Cad. No:13', category: 'Panel & Yatak', recommendedTheme: 'sarayli', strategy: 'Köklü üretici, e-ticaret dönüşümü' },
  { id: 21, brand: 'VOİZ MOBİLYA', phone: '0224 718 60 40', email: 'info@voiz.com.tr', address: 'Hamzabey OSB 17. Cad. No:3', category: 'Yatak & Yemek', recommendedTheme: 'modaline', strategy: 'Marka tescilli, web sitesi boş' },
  { id: 22, brand: 'SABRİNO KOLTUK', phone: '0224 718 54 09', email: 'muhasebe@sabrino.com', address: 'Hamzabey OSB 1. Cad. No:5', category: 'Koltuk Takımları', recommendedTheme: 'velvet-co', strategy: "Instagram'dan müşteri topluyor" },
  { id: 23, brand: 'ONSS MOBİLYA', phone: '0224 714 14 70', email: 'muhasebe@onssmobilya.com', address: 'Hamzabey OSB 5. Cad. No:18', category: 'Modern Mobilya', recommendedTheme: 'nordika', strategy: 'Fuar katılımcısı, dijital sipariş yok' },
  { id: 24, brand: 'DECOHİLL MOBİLYA', phone: '0224 718 52 18', email: 'muhasebe@decohill.com.tr', address: 'Hamzabey OSB 1. Cad. No:55', category: 'Yatak & Yemek', recommendedTheme: 'aura-luxe', strategy: 'Yatak odalarında güçlü, web yok' },
  { id: 25, brand: 'BENİMODAM MOBİLYA', phone: '0224 724 25 45', email: 'muhasebe@bayras.com', address: 'Hamzabey OSB 1. Cad. No:4', category: 'Yatak & Genç Odası', recommendedTheme: 'nordika', strategy: 'Genç & yatak odası 3D vitrini şart' },
  { id: 26, brand: 'PİANNO MOBİLYA', phone: '0224 715 55 85', email: 'muhasebe@piannomobilya.com', address: 'Hamzabey OSB 3. Cad. No:9', category: 'Koltuk & Yemek', recommendedTheme: 'velvet-co', strategy: "Instagram'dan WhatsApp'a yönlendiriyor" },
  { id: 27, brand: 'BRAWWA KOLTUK', phone: '0224 777 02 05', email: 'muhasebe@brawwa.com', address: 'Hamzabey OSB 1. Cad. No:11', category: 'Lüks Koltuk', recommendedTheme: 'aura-luxe', strategy: 'Lüks koltuk var, web vitrini yok' },
  { id: 28, brand: 'LUXELME KOLTUK', phone: '0224 723 93 00', email: 'muhasebe@cemrekoltuk.com', address: 'Hamzabey OSB 4. Cad. No:1', category: 'Koltuk & Kanepe', recommendedTheme: 'modaline', strategy: 'İç pazar + Avrupa ihracat hedefli' },
  { id: 29, brand: 'DUSE KOLTUK', phone: '0224 718 61 94', email: 'info@dusesofa.com', address: 'Hamzabey OSB 1. Cad. No:35', category: 'Koltuk Üreticisi', recommendedTheme: 'nordika', strategy: 'Toptan & sosyal medya ile dönüyor' },
  { id: 30, brand: 'GABBA HOME', phone: '0224 714 82 80', email: 'muhasebe@gabba.com.tr', address: 'Hamzabey OSB 17. Cad. No:16', category: 'Lüks Salon Mobilyası', recommendedTheme: 'aura-luxe', strategy: 'Görsel kalite yüksek, web eksik' },
  { id: 31, brand: 'CALİTELLİ MOBİLYA', phone: '0224 715 51 55', email: 'cihan@calitelli.com', address: 'Hamzabey OSB 15. Cad. No:9', category: 'Yatak Odası & Baza', recommendedTheme: 'sarayli', strategy: 'Doğrudan tüketiciye satış sitesi yok' },
  { id: 32, brand: 'EWOS HOME', phone: '0224 713 50 49', email: 'info@Ewos.com.tr', address: 'Hamzabey OSB 1. Cad. No:10', category: 'Tasarım Mobilya', recommendedTheme: 'velvet-co', strategy: 'Özel tasarım var, e-ticaret sepeti yok' },
  { id: 33, brand: 'SANAT CONCEPT', phone: '0224 711 23 65', email: 'muhasebe@sanatmobilya.com', address: 'Hamzabey OSB 1. Cad. No:6', category: 'Yemek & Yatak Odası', recommendedTheme: 'modaline', strategy: 'Resmi kayıtta web sitesi boş' },
  { id: 34, brand: 'DONAT MOBİLYA', phone: '0224 714 19 20', email: 'salimakpolat@donatcollection.com', address: 'Hamzabey OSB 1. Cad. No:11', category: 'Büyük İmalatçı', recommendedTheme: 'aura-luxe', strategy: 'Devasa tesis, e-ticaret & B2B eksik' },
];

const SITE_ORIGIN = 'https://qiens-home.vercel.app';

function cleanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('05')) return `90${digits.slice(1)}`;
  if (digits.startsWith('5')) return `90${digits}`;
  if (digits.startsWith('90')) return digits;
  return '';
}

export default function ImosabPitchGeneratorPage() {
  const [search, setSearch] = useState('');
  const [customBrand, setCustomBrand] = useState('ONİX SOFA');
  const [customPhone, setCustomPhone] = useState('0532 465 16 79');
  const [selectedThemeSlug, setSelectedThemeSlug] = useState('aura-luxe');
  const [offerPrice, setOfferPrice] = useState('14.900 ₺');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [onlyMobile, setOnlyMobile] = useState(false);

  const filteredLeads = useMemo(() => {
    return IMOSAB_LEADS.filter(lead => {
      if (onlyMobile && !lead.phone.startsWith('05')) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        lead.brand.toLowerCase().includes(q) ||
        lead.category.toLowerCase().includes(q) ||
        lead.address.toLowerCase().includes(q)
      );
    });
  }, [search, onlyMobile]);

  const liveDemoUrl = `${SITE_ORIGIN}/demo/${selectedThemeSlug}?firma=${encodeURIComponent(customBrand.trim() || 'MARKANIZ')}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(liveDemoUrl)}`;

  const pitchMessage = `Merhaba ${customBrand.trim()} yetkilisi,\n\nİnegöl'de mobilya üreticilerine özel 3D Sanal Showroom & Avrupa İhracat destekli web siteleri geliştiriyorum. Sizin firmanız için kendi markanızın adıyla çalışan canlı bir önizleme hazırladım:\n\n🔗 ${customBrand.trim()} Özel 3D Demo Siteniz:\n${liveDemoUrl}\n\nİçinde neler hazır?\n✅ Gerçek 3D Oda (Kapak / Çekmece / Baza açılıyor + Santim Santim Özel Ölçü & Canlı Fiyat)\n✅ Müşterinin Kendi Odasının Fotoğrafını Yükleyip Mobilyayı İçinde Görmesi\n✅ Avrupa Kapı Teslim € Kargo, m³ Konteyner & Şifreli B2B Bayi Modu (Kod: BAYI2026)\n✅ Yapay Zeka Satış Robotu + WhatsApp Sipariş + TR/EN/DE Dil\n\nKendi alan adınız ve ürünlerinizle 48 saatte anahtar teslim kurulum: ${offerPrice}.\n2 dakikanızı ayırıp linke tıklamanız yeterli, beğenmeniz halinde bugün yayına alabiliriz. İyi çalışmalar dilerim.\n— Emre (İnegöl Web & 3D)`;

  const handleSelectLead = (lead: ImosabLead) => {
    setCustomBrand(lead.brand);
    setCustomPhone(lead.phone);
    setSelectedThemeSlug(lead.recommendedTheme);
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const openDirectWhatsApp = (phoneStr: string, text: string) => {
    const wa = cleanPhoneForWhatsApp(phoneStr);
    const url = wa
      ? `https://wa.me/${wa}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#07070b]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/ajans"
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-amber-400 hover:text-black text-xs font-black flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft size={14} /> Ajans
            </Link>
            <div>
              <div className="text-sm font-black uppercase tracking-wider text-amber-400">
                İMOSAB 34+ FABRİKA KİŞİYE ÖZEL TEKLİF & QR MOTORU
              </div>
              <div className="text-[10px] text-neutral-400">
                Tek Tıkla Firmanın Kendi Adıyla Canlı 3D Demo + QR Kart + WhatsApp Satış Mesajı
              </div>
            </div>
          </div>

          <Link
            href="/reels-studyo"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
          >
            <Video size={14} /> Reels Stüdyo
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 5 COLS: LIVE PERSONALIZED DEMO & QR CARD BUILDER */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#12121a] border border-amber-400/40 rounded-3xl p-5 sm:p-6 space-y-4 sticky top-24 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 flex items-center gap-1.5">
                <Sparkles size={13} /> KİŞİSELLEŞTİRİLMİŞ CANLI TEKLİF
              </span>
              <span className="text-[10px] font-bold text-emerald-400">?firma= Aktif</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
                  Hedef Firma / Marka Adı (Sitenin Logosu Olur)
                </label>
                <input
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm font-black text-white outline-none focus:border-amber-400"
                  placeholder="Örn: ONİX SOFA"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
                    Firma Telefonu (Cep ise Direkt WA)
                  </label>
                  <input
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs font-bold text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
                    Teklif Fiyatı
                  </label>
                  <select
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs font-bold text-amber-300 outline-none"
                  >
                    <option value="10.000 ₺">10.000 ₺ (Başlangıç)</option>
                    <option value="14.900 ₺">14.900 ₺ (3D + AI Standart)</option>
                    <option value="19.900 ₺">19.900 ₺ (3D + Avrupa İhracat VIP)</option>
                    <option value="29.900 ₺">29.900 ₺ (Tam Kurumsal B2B + 3D)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Gösterilecek Tasarım Teması
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {DEMO_THEME_LIST.map((t) => (
                    <button
                      key={t.slug}
                      type="button"
                      onClick={() => setSelectedThemeSlug(t.slug)}
                      className={cn(
                        'px-2.5 py-2 rounded-xl text-[10px] font-black uppercase border cursor-pointer transition-all truncate',
                        selectedThemeSlug === t.slug
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'bg-white/5 text-neutral-300 border-white/10 hover:border-white/30'
                      )}
                    >
                      {t.brandName.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live QR Card Preview */}
            <div className="bg-black/60 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-white p-1.5 rounded-xl flex-shrink-0">
                <img src={qrUrl} alt="Firma Özel QR Kodu" className="w-24 h-24 object-contain" />
              </div>
              <div className="min-w-0 space-y-1.5 flex-1">
                <div className="text-[9px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                  <QrCode size={11} /> FİRMAYA ÖZEL QR & CANLI LİNK
                </div>
                <div className="text-sm font-black truncate">{customBrand || 'MARKANIZ'}</div>
                <div className="text-[10px] text-neutral-400 break-all line-clamp-2">{liveDemoUrl}</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <a
                    href={liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-amber-400 text-black text-[10px] font-black flex items-center gap-1"
                  >
                    Canlı Aç <ExternalLink size={10} />
                  </a>
                  <button
                    type="button"
                    onClick={() => copyText(liveDemoUrl, 'url')}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'url' ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                    {copiedKey === 'url' ? 'Kopyalandı' : 'Linki Kopyala'}
                  </button>
                </div>
              </div>
            </div>

            {/* Ready WhatsApp Pitch Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Hazır WhatsApp Satış Mesajı
                </span>
                <button
                  type="button"
                  onClick={() => copyText(pitchMessage, 'msg')}
                  className="text-[10px] font-black text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'msg' ? <Check size={11} /> : <Copy size={11} />}
                  {copiedKey === 'msg' ? 'Mesaj Kopyalandı!' : 'Mesajı Kopyala'}
                </button>
              </div>
              <textarea
                readOnly
                value={pitchMessage}
                rows={7}
                className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-neutral-200 leading-relaxed resize-none outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => openDirectWhatsApp(customPhone, pitchMessage)}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all"
            >
              <MessageCircle size={16} />
              {cleanPhoneForWhatsApp(customPhone)
                ? `${customBrand} Numarasına WhatsApp Gönder`
                : 'WhatsApp Paylaşım Ekranını Aç'}
            </button>
          </div>
        </div>

        {/* RIGHT 7 COLS: 34 İMOSAB FACTORIES WITHOUT WEBSITES */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#12121a] border border-white/10 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="34 İMOSAB fabrikasında ara (Marka, kategori, cadde)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="button"
              onClick={() => setOnlyMobile(!onlyMobile)}
              className={cn(
                'px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase border cursor-pointer transition-all',
                onlyMobile
                  ? 'bg-emerald-500 text-black border-emerald-400'
                  : 'bg-white/5 text-neutral-300 border-white/10 hover:border-white/30'
              )}
            >
              📱 Sadece Cep Nolu (16 Fabrika)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredLeads.map((lead) => {
              const isSelected = customBrand.toUpperCase() === lead.brand.toUpperCase();
              const isMobile = lead.phone.startsWith('05');
              const directUrl = `${SITE_ORIGIN}/demo/${lead.recommendedTheme}?firma=${encodeURIComponent(lead.brand)}`;
              return (
                <div
                  key={lead.id}
                  onClick={() => handleSelectLead(lead)}
                  className={cn(
                    'rounded-2xl border p-4 space-y-2.5 cursor-pointer transition-all',
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400 shadow-lg'
                      : 'bg-[#111118] border-white/10 hover:border-white/30'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <Building2 size={13} className="text-amber-400" />
                        {lead.id}. {lead.brand}
                      </div>
                      <div className="text-[10px] font-bold text-amber-300 mt-0.5">{lead.category}</div>
                    </div>
                    <span className={cn(
                      'text-[9px] font-black px-2 py-0.5 rounded-full',
                      isMobile ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-neutral-300'
                    )}>
                      {isMobile ? 'WA Cep' : 'Sabit Hat'}
                    </span>
                  </div>

                  <div className="space-y-1 text-[10px] text-neutral-400">
                    <div className="flex items-center gap-1.5"><Phone size={11} /> {lead.phone}</div>
                    <div className="flex items-center gap-1.5"><MapPin size={11} /> {lead.address}</div>
                    <div className="text-neutral-300 italic">&ldquo;{lead.strategy}&rdquo;</div>
                  </div>

                  <div className="flex items-center gap-2 pt-1.5 border-t border-white/10">
                    <a
                      href={directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-black text-[10px] font-black uppercase text-center transition-all"
                    >
                      Özel Demosunu Aç
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectLead(lead);
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase cursor-pointer"
                    >
                      QR & Teklif
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
