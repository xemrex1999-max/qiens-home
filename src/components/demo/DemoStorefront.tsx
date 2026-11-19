"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, MessageCircle, Sparkles, ShieldCheck, Truck, Wrench, CreditCard,
  X, Plus, Minus, CheckCircle2, Globe, Bot, Send, Box, Layers, ArrowRight,
  ChevronRight, Phone, MapPin, Star, Menu
} from 'lucide-react';
import { DemoThemeConfig, DemoProduct, SHARED_DEMO_PRODUCTS, DEMO_THEME_LIST } from '@/data/demoThemes';
import ShowroomRoomPlanner from '@/components/showroom/ShowroomRoomPlanner';
import { cn } from '@/lib/utils';

type Lang = 'TR' | 'EN' | 'DE';

const UI_TEXT: Record<Lang, any> = {
  TR: {
    navCatalog: 'Koleksiyon',
    navShowroom: '3D Showroom & Oda Planla',
    navTrust: 'Neden Biz?',
    navContact: 'İletişim',
    ctaExplore: 'Koleksiyonu Keşfet',
    cta3D: '3D Oda Planlayıcıya Geç',
    allCats: 'Tümü',
    inspect: 'İncele & Renk Seç',
    addToCart: 'Sepete Ekle',
    whatsappOrder: 'WhatsApp ile Sipariş Ver',
    showroomBadge: '3D SANAL SHOWROOM & SÜRÜKLE-BIRAK ODA PLANLAYICI',
    showroomHeading: 'TAKIMINIZI ODANIZA SÜRÜKLEYİP YERLEŞTİRİN',
    modeFull3D: '🌀 Tam Takım 360° 3D & AR',
    modePlanner: '📐 Sürükle-Bırak Oda Yerleşimi',
    cartTitle: 'Alışveriş Sepetiniz',
    checkoutBtn: 'Güvenli Ödemeye Geç',
    freeShipping: 'Türkiye & Avrupa Teslimat',
    freeInstall: 'Ücretsiz Kurulum',
    warranty: '2 Yıl Fabrika Garantisi',
    installment: 'Kredi Kartına 12 Taksit',
    botWelcome: 'Merhaba! 👋 Ben yapay zeka mobilya danışmanınız. Taksit, özel ölçü, teslimat veya 3D oda yerleşimi hakkında her şeyi sorabilirsiniz.',
  },
  EN: {
    navCatalog: 'Collection',
    navShowroom: '3D Showroom & Planner',
    navTrust: 'Why Us?',
    navContact: 'Contact',
    ctaExplore: 'Explore Collection',
    cta3D: 'Open 3D Room Planner',
    allCats: 'All',
    inspect: 'View & Colors',
    addToCart: 'Add to Cart',
    whatsappOrder: 'Order via WhatsApp',
    showroomBadge: '3D VIRTUAL SHOWROOM & DRAG-AND-DROP PLANNER',
    showroomHeading: 'ARRANGE YOUR FURNITURE IN 3D',
    modeFull3D: '🌀 Full Room 360° 3D & AR',
    modePlanner: '📐 Drag & Drop Room Planner',
    cartTitle: 'Shopping Cart',
    checkoutBtn: 'Proceed to Secure Checkout',
    freeShipping: 'Europe & Turkey Delivery',
    freeInstall: 'White-Glove Assembly',
    warranty: '2-Year Factory Warranty',
    installment: 'Flexible Installments',
    botWelcome: 'Hello! 👋 I am your AI furniture advisor. Ask me anything about European shipping, custom dimensions, fabrics, or 3D room planning.',
  },
  DE: {
    navCatalog: 'Kollektion',
    navShowroom: '3D Showroom & Planer',
    navTrust: 'Vorteile',
    navContact: 'Kontakt',
    ctaExplore: 'Kollektion Entdecken',
    cta3D: '3D Raumplaner Öffnen',
    allCats: 'Alle',
    inspect: 'Details & Farben',
    addToCart: 'In den Warenkorb',
    whatsappOrder: 'Per WhatsApp Bestellen',
    showroomBadge: '3D VIRTUELLER SHOWROOM & RAUMPLANER',
    showroomHeading: 'PLANEN SIE IHR ZIMMER IN 3D',
    modeFull3D: '🌀 Komplett-Set 360° 3D & AR',
    modePlanner: '📐 Drag & Drop Raumplaner',
    cartTitle: 'Warenkorb',
    checkoutBtn: 'Sicher zur Kasse',
    freeShipping: 'Europaweiter Versand',
    freeInstall: 'Montageservice',
    warranty: '2 Jahre Herstellergarantie',
    installment: 'Ratenzahlung Möglich',
    botWelcome: 'Hallo! 👋 Ich bin Ihr KI-Möbelberater. Fragen Sie mich nach Lieferung nach Deutschland/Europa, Sondermaßen oder dem 3D-Raumplaner.',
  },
};

interface CartItem {
  product: DemoProduct;
  color: string;
  qty: number;
}

export default function DemoStorefront({ theme }: { theme: DemoThemeConfig }) {
  const [lang, setLang] = useState<Lang>('TR');
  const [activeCat, setActiveCat] = useState<string>('Tümü');
  const [selectedProductModal, setSelectedProductModal] = useState<DemoProduct | null>(null);
  const [modalColor, setModalColor] = useState<string>('Doğal Meşe');

  // 3D Showroom State
  const [showroomProduct, setShowroomProduct] = useState<DemoProduct>(SHARED_DEMO_PRODUCTS[0]);
  const [showroomMode, setShowroomMode] = useState<'full3d' | 'planner'>('full3d');
  const [showroomColor, setShowroomColor] = useState<string>('Doğal Meşe');

  // Cart & Checkout State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'door'>('card');
  const [installments, setInstallments] = useState<number>(6);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // AI Chatbot State
  const [botOpen, setBotOpen] = useState(false);
  const [botInput, setBotInput] = useState('');
  const [botMessages, setBotMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = UI_TEXT[lang];

  useEffect(() => {
    setBotMessages([{ from: 'bot', text: t.botWelcome }]);
  }, [lang, theme.slug, t.botWelcome]);

  // Ensure model-viewer script is loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.customElements?.get('model-viewer')) {
      const existing = document.querySelector('script[src*="model-viewer"]');
      if (!existing) {
        const s = document.createElement('script');
        s.type = 'module';
        s.src = '/scripts/model-viewer.min.js';
        document.head.appendChild(s);
      }
    }
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCat === 'Tümü') return SHARED_DEMO_PRODUCTS;
    return SHARED_DEMO_PRODUCTS.filter(p => p.category === activeCat);
  }, [activeCat]);

  const formatMoney = (val: number) => {
    if (lang === 'DE' || lang === 'EN') {
      return `€${Math.round(val / 37).toLocaleString('de-DE')}`;
    }
    return `₺${val.toLocaleString('tr-TR')}`;
  };

  const getProductName = (p: DemoProduct) => {
    if (lang === 'EN') return p.nameEn;
    if (lang === 'DE') return p.nameDe;
    return p.name;
  };

  const addToCart = (product: DemoProduct, color: string) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id && i.color === color);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { product, color, qty: 1 }];
    });
    setCheckoutStep('cart');
    setCartOpen(true);
  };

  const updateCartQty = (idx: number, delta: number) => {
    setCart(prev => {
      const copy = [...prev];
      const next = copy[idx].qty + delta;
      if (next <= 0) return copy.filter((_, i) => i !== idx);
      copy[idx] = { ...copy[idx], qty: next };
      return copy;
    });
  };

  const cartSubtotal = cart.reduce((acc, i) => acc + i.product.price * i.qty, 0);
  const cartFinalTotal = paymentMethod === 'transfer' ? Math.round(cartSubtotal * 0.95) : cartSubtotal;

  const openWhatsApp = (product?: DemoProduct, color?: string) => {
    const msg = product
      ? `Merhaba ${theme.brandName}, "${product.name}" (${color || product.colors[0].name}) - ${formatMoney(product.price)} hakkında bilgi ve sipariş oluşturmak istiyorum.`
      : `Merhaba ${theme.brandName}, mobilya koleksiyonunuz ve 3D showroom hakkında bilgi almak istiyorum.`;
    window.open(`https://wa.me/${theme.whatsappPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleBotSend = (customText?: string) => {
    const q = (customText ?? botInput).trim();
    if (!q) return;
    setBotInput('');
    const lower = q.toLowerCase();
    let reply = `${theme.brandName} olarak tüm İnegöl üretim takımlarımızda 2 yıl garanti, ücretsiz kurulum ve kredi kartına 12 taksit sunuyoruz. Hemen WhatsApp ekibimize bağlanabilir veya 3D Showroom'da odanızı planlayabilirsiniz.`;

    if (lower.includes('taksit') || lower.includes('ödeme') || lower.includes('fiyat')) {
      reply = '💳 Tüm kredi kartlarına 3D Secure ile 6–12 taksit, Havale/EFT ödemelerinde anında %5 nakit indirim ve kapıda ödeme seçeneklerimiz mevcuttur!';
    } else if (lower.includes('avrupa') || lower.includes('almanya') || lower.includes('europe') || lower.includes('kargo') || lower.includes('teslimat')) {
      reply = '🚚 Türkiye’nin 81 iline ücretsiz nakliye ve profesyonel kurulum yapıyoruz. Almanya, Hollanda, Belçika, Fransa ve tüm Avrupa’ya gümrük dahil kapı teslim ihracat kargomuz vardır!';
    } else if (lower.includes('ölçü') || lower.includes('özel') || lower.includes('renk') || lower.includes('kumaş')) {
      reply = '🎨 Tüm takımlarımızda 40+ ithal kolay silinebilir kumaş ve ahşap renk seçeneği vardır. Odanızın ölçüsüne göre özel üretim yapıyoruz.';
    } else if (lower.includes('3d') || lower.includes('oda') || lower.includes('showroom')) {
      reply = '📐 Sayfadaki "3D Showroom & Oda Planlayıcı" bölümünden tüm takımı 360° döndürebilir, Gardırop, Yatak, Şifonyer ve Komodinleri kendi odanıza sürükleyip yerleştirebilirsiniz!';
    }

    setBotMessages(prev => [...prev, { from: 'user', text: q }, { from: 'bot', text: reply }]);
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full transition-colors duration-300",
        theme.fontStyle === 'serif' ? "font-sans" : "font-sans"
      )}
      style={{ backgroundColor: theme.bgPage, color: theme.textPrimary }}
    >
      {/* 0. PRESENTATION SWITCHER BAR (MÜŞTERİ SUNUM GEÇİŞ ÇUBUĞU) */}
      <div className="w-full bg-black text-white text-[10px] py-2 px-3 border-b border-white/15 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/vitrin"
            className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 font-black uppercase tracking-wider flex items-center gap-1 whitespace-nowrap"
          >
            ← 5 Tasarım Vitrini
          </Link>
          <span className="hidden sm:inline text-neutral-400">Canlı Konsept:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {DEMO_THEME_LIST.map((item, i) => (
            <Link
              key={item.slug}
              href={`/demo/${item.slug}`}
              className={cn(
                "px-2.5 py-1 rounded-full font-black uppercase tracking-wider transition-all whitespace-nowrap",
                item.slug === theme.slug
                  ? "text-black"
                  : "bg-white/10 text-neutral-300 hover:bg-white/20"
              )}
              style={item.slug === theme.slug ? { backgroundColor: item.accentHex, color: item.accentTextHex } : undefined}
            >
              {i + 1}. {item.brandName.split(' ')[0]}
            </Link>
          ))}
        </div>
      </div>

      {/* 1. STICKY NAVBAR */}
      <header
        className={cn("sticky top-0 z-40 backdrop-blur-xl border-b", theme.borderClass)}
        style={{ backgroundColor: theme.isDark ? 'rgba(10,10,15,0.88)' : 'rgba(255,255,255,0.9)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <a href="#hero" className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md"
              style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
            >
              {theme.brandName.charAt(0)}
            </span>
            <div className="truncate">
              <div className={cn("text-sm sm:text-lg font-black tracking-[0.14em] truncate", theme.fontStyle === 'serif' && "font-serif")}>
                {theme.brandName}
              </div>
              <div className="text-[9px] uppercase tracking-widest opacity-60 hidden sm:block">
                İnegöl • Türkiye & Europa
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-widest">
            <a href="#catalog" className="hover:opacity-70 transition-opacity">{t.navCatalog}</a>
            <a href="#showroom3d" className="flex items-center gap-1.5 hover:opacity-70 transition-opacity" style={{ color: theme.accentHex }}>
              <Sparkles size={13} /> {t.navShowroom}
            </a>
            <a href="#trust" className="hover:opacity-70 transition-opacity">{t.navTrust}</a>
            <a href="#footer" className="hover:opacity-70 transition-opacity">{t.navContact}</a>
          </nav>

          {/* Right Controls: Language, WhatsApp, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher TR / EN / DE */}
            <div className={cn("flex items-center rounded-full border p-0.5 text-[10px] font-black", theme.borderClass)}>
              {(['TR', 'EN', 'DE'] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className="px-2 py-1 rounded-full transition-all cursor-pointer"
                  style={lang === code ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : undefined}
                >
                  {code}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => openWhatsApp()}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <MessageCircle size={13} /> WhatsApp
            </button>

            <button
              type="button"
              onClick={() => { setCheckoutStep('cart'); setCartOpen(true); }}
              className={cn("relative p-2.5 rounded-full border transition-all cursor-pointer", theme.borderClass)}
              style={{ backgroundColor: theme.bgSurface }}
              aria-label="Sepet"
            >
              <ShoppingBag size={16} />
              {cart.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn("md:hidden p-2 rounded-xl border", theme.borderClass)}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={cn("md:hidden px-6 py-4 border-t flex flex-col gap-3 text-xs font-black uppercase tracking-widest", theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
            <a href="#catalog" onClick={() => setMobileMenuOpen(false)}>{t.navCatalog}</a>
            <a href="#showroom3d" onClick={() => setMobileMenuOpen(false)} style={{ color: theme.accentHex }}>{t.navShowroom}</a>
            <a href="#trust" onClick={() => setMobileMenuOpen(false)}>{t.navTrust}</a>
            <button onClick={() => openWhatsApp()} className="text-left text-emerald-500">💬 WhatsApp Canlı Destek</button>
          </div>
        )}
      </header>

      {/* 2. THEME-DISTINCT HERO SECTION */}
      <section id="hero" className="relative overflow-hidden">
        {theme.heroLayout === 'split' || theme.heroLayout === 'modern' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ backgroundColor: theme.bgSurface, color: theme.accentHex }}
              >
                <Sparkles size={12} /> {lang === 'EN' ? theme.taglineEn : lang === 'DE' ? theme.taglineDe : theme.tagline}
              </div>
              <h1 className={cn("text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.06]", theme.fontStyle === 'serif' && "font-serif")}>
                {theme.heroTitle}
              </h1>
              <p className="text-sm sm:text-base leading-relaxed max-w-xl" style={{ color: theme.textMuted }}>
                {theme.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#catalog"
                  className="px-7 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-xl transition-transform hover:scale-105 flex items-center gap-2"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  {t.ctaExplore} <ArrowRight size={14} />
                </a>
                <a
                  href="#showroom3d"
                  className={cn("px-7 py-4 rounded-full text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2", theme.borderClass)}
                  style={{ backgroundColor: theme.bgCard }}
                >
                  <Box size={14} /> {t.cta3D}
                </a>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="rounded-[32px] overflow-hidden shadow-2xl border aspect-[4/3] relative" style={{ borderColor: `${theme.accentHex}33` }}>
                <img src={theme.heroImage} alt={theme.brandName} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md text-white p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-amber-400 font-black">3D Sanal Showroom Aktif</div>
                    <div className="text-xs font-bold">Gardırop, Yatak & Koltukları Odana Sürükle</div>
                  </div>
                  <a href="#showroom3d" className="px-3.5 py-2 rounded-xl text-[10px] font-black uppercase" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
                    Dene →
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative min-h-[74vh] sm:min-h-[82vh] flex items-center">
            <img
              src={theme.heroImage}
              alt={theme.brandName}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: theme.isDark
                  ? `linear-gradient(90deg, ${theme.bgPage}f5 0%, ${theme.bgPage}cc 52%, ${theme.bgPage}55 100%)`
                  : 'linear-gradient(90deg, rgba(251,249,245,0.95) 0%, rgba(251,249,245,0.82) 55%, rgba(251,249,245,0.25) 100%)'
              }}
            />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 w-full">
              <div className="max-w-2xl space-y-6">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border"
                  style={{ borderColor: `${theme.accentHex}66`, color: theme.accentHex, backgroundColor: theme.isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.75)' }}
                >
                  <Sparkles size={12} /> {lang === 'EN' ? theme.taglineEn : lang === 'DE' ? theme.taglineDe : theme.tagline}
                </div>
                <h1 className={cn("text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]", theme.fontStyle === 'serif' && "font-serif")}>
                  {theme.heroTitle}
                </h1>
                <p className="text-sm sm:text-lg leading-relaxed" style={{ color: theme.textMuted }}>
                  {theme.heroSubtitle}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="#catalog"
                    className="px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl transition-transform hover:scale-105 flex items-center gap-2"
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                  >
                    {t.ctaExplore} <ArrowRight size={15} />
                  </a>
                  <a
                    href="#showroom3d"
                    className={cn("px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest border backdrop-blur-md transition-all flex items-center gap-2", theme.borderClass)}
                    style={{ backgroundColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)' }}
                  >
                    <Box size={15} /> {t.cta3D}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. TRUST & CONVERSION BAR (EVSEREN TRUST STRIP) */}
      <section id="trust" className={cn("border-y", theme.borderClass)} style={{ backgroundColor: theme.bgSurface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: <Truck size={20} />, title: t.freeShipping, sub: '81 İl & Avrupa Kapı Teslim' },
            { icon: <Wrench size={20} />, title: t.freeInstall, sub: 'Uzman İnegöl Kurulum Ekibi' },
            { icon: <ShieldCheck size={20} />, title: t.warranty, sub: '1. Sınıf Fırınlanmış Gürgen' },
            { icon: <CreditCard size={20} />, title: t.installment, sub: '3D Secure & Havale %5 İndirim' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${theme.accentHex}22`, color: theme.accentHex }}
              >
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-black">{item.title}</div>
                <div className="text-[10px]" style={{ color: theme.textMuted }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRODUCT CATALOG SECTION */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.35em] block mb-2" style={{ color: theme.accentHex }}>
              2026 İNEGÖL KOLEKSİYONU
            </span>
            <h2 className={cn("text-3xl sm:text-4xl font-black tracking-tight", theme.fontStyle === 'serif' && "font-serif")}>
              Öne Çıkan Mobilya Takımları
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['Tümü', 'Yatak Odası', 'Yemek Odası', 'Koltuk Takımı'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                className={cn("px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider border transition-all cursor-pointer", theme.borderClass)}
                style={activeCat === cat ? { backgroundColor: theme.accentHex, color: theme.accentTextHex, borderColor: theme.accentHex } : { backgroundColor: theme.bgCard }}
              >
                {cat === 'Tümü' ? t.allCats : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className={cn("group rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col", theme.borderClass)}
              style={{ backgroundColor: theme.bgCard }}
            >
              <div
                onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-neutral-900/10"
              >
                <img
                  src={p.image}
                  alt={getProductName(p)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {p.badge && (
                  <span
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md"
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                  >
                    {p.badge}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowroomProduct(p);
                    setShowroomColor(p.colors[0].name);
                    document.getElementById('showroom3d')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1 cursor-pointer"
                >
                  <Box size={11} /> 3D İncele
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: theme.accentHex }}>
                    <span>{p.category}</span>
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Star size={11} fill="currentColor" /> 4.9
                    </span>
                  </div>
                  <h3
                    onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                    className={cn("text-lg font-black cursor-pointer hover:opacity-80", theme.fontStyle === 'serif' && "font-serif")}
                  >
                    {getProductName(p)}
                  </h3>
                  <div className="flex items-baseline gap-2.5 mt-2">
                    <span className="text-xl font-black" style={{ color: theme.accentHex }}>
                      {formatMoney(p.price)}
                    </span>
                    {p.oldPrice && (
                      <span className="text-xs line-through opacity-50">{formatMoney(p.oldPrice)}</span>
                    )}
                  </div>
                  {/* Color Swatch Preview */}
                  <div className="flex items-center gap-1.5 mt-3">
                    {p.colors.map((c) => (
                      <span
                        key={c.name}
                        title={c.name}
                        className="w-4 h-4 rounded-full border border-white/30 shadow-xs"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    <span className="text-[10px] ml-1" style={{ color: theme.textMuted }}>+{p.colors.length} Renk</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                    className={cn("py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer", theme.borderClass)}
                    style={{ backgroundColor: theme.bgSurface }}
                  >
                    {t.inspect}
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(p, p.colors[0].name)}
                    className="py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                  >
                    {t.addToCart}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTEGRATED 3D SHOWROOM + DRAG & DROP ROOM PLANNER */}
      <section id="showroom3d" className="py-16 px-4 sm:px-8 bg-[#0b0b10] text-white border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400 block mb-2">
                {t.showroomBadge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight">
                {t.showroomHeading}
              </h2>
            </div>

            {/* Mode Switcher: Full-Room 3D GLB vs Drag-and-Drop Planner */}
            <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setShowroomMode('full3d')}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                  showroomMode === 'full3d' ? "bg-amber-400 text-black shadow-lg" : "text-neutral-300 hover:text-white"
                )}
              >
                {t.modeFull3D}
              </button>
              <button
                type="button"
                onClick={() => setShowroomMode('planner')}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                  showroomMode === 'planner' ? "bg-amber-400 text-black shadow-lg" : "text-neutral-300 hover:text-white"
                )}
              >
                {t.modePlanner}
              </button>
            </div>
          </div>

          {/* Room Set Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SHARED_DEMO_PRODUCTS.slice(0, 3).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setShowroomProduct(p); setShowroomColor(p.colors[0].name); }}
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-xs font-black border transition-all flex-shrink-0 cursor-pointer flex items-center gap-2",
                  showroomProduct.id === p.id
                    ? "bg-amber-400/20 border-amber-400 text-amber-300"
                    : "bg-white/5 border-white/10 text-neutral-300 hover:border-white/30"
                )}
              >
                <span>🛋️ {p.category}:</span>
                <span className="text-white">{getProductName(p)}</span>
              </button>
            ))}
          </div>

          {showroomMode === 'full3d' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 relative h-[420px] sm:h-[520px] rounded-[32px] bg-gradient-to-b from-[#171722] to-[#0a0a0f] border border-white/10 overflow-hidden shadow-2xl">
                <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md border border-amber-400/40 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  TAM TAKIM 3D MODEL: {showroomProduct.category.toUpperCase()}
                </div>
                <model-viewer
                  src={showroomProduct.fullRoomModelUrl}
                  alt={showroomProduct.name}
                  camera-controls
                  auto-rotate
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  shadow-intensity="1.3"
                  exposure="1.05"
                  style={{ width: '100%', height: '100%', backgroundColor: 'transparent' } as any}
                />
                <button
                  type="button"
                  onClick={() => setShowroomMode('planner')}
                  className="absolute bottom-4 right-4 z-20 px-4 py-2.5 rounded-full bg-amber-400 hover:bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-2xl cursor-pointer flex items-center gap-1.5"
                >
                  <Layers size={13} /> Parçaları Tek Tek Odana Diz →
                </button>
              </div>

              <div className="lg:col-span-4 bg-[#13131b] border border-white/10 rounded-[32px] p-6 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
                    {showroomProduct.category} — TAM SET
                  </span>
                  <h3 className="text-2xl font-serif font-black">{getProductName(showroomProduct)}</h3>
                  <div className="text-2xl font-black text-amber-400">{formatMoney(showroomProduct.price)}</div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{showroomProduct.description}</p>

                  <div className="pt-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                      Set İçeriği & Ölçüler
                    </div>
                    <div className="space-y-1.5">
                      {showroomProduct.dimensions.map((d) => (
                        <div key={d.piece} className="flex justify-between text-xs bg-white/5 px-3 py-2 rounded-xl">
                          <span className="text-neutral-300 font-bold">{d.piece}</span>
                          <span className="text-amber-300 font-black">{d.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => addToCart(showroomProduct, showroomColor)}
                    className="w-full py-3.5 rounded-full bg-amber-400 hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    🛒 {t.addToCart}
                  </button>
                  <button
                    type="button"
                    onClick={() => openWhatsApp(showroomProduct, showroomColor)}
                    className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    💬 {t.whatsappOrder}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ShowroomRoomPlanner
              selectedProduct={{
                ...showroomProduct,
                threeDModelUrl: showroomProduct.fullRoomModelUrl,
              }}
              selectedColor={showroomColor}
              onInspect3D={() => setShowroomMode('full3d')}
            />
          )}
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer id="footer" className={cn("border-t py-12 px-4 sm:px-8", theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-lg font-black tracking-widest mb-2">{theme.brandName}</div>
            <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
              İnegöl Mobilya Başkenti’nden Türkiye ve tüm Avrupa’ya doğrudan fabrika teslimi, 3D Sanal Showroom destekli yeni nesil mobilya deneyimi.
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="font-black uppercase tracking-widest mb-2" style={{ color: theme.accentHex }}>İletişim & Showroom</div>
            <div className="flex items-center gap-2"><MapPin size={14} /> Mahmudiye / Ertuğrulgazi Cad. İnegöl, Bursa</div>
            <div className="flex items-center gap-2"><Phone size={14} /> +90 507 756 78 87</div>
            <div className="flex items-center gap-2"><Globe size={14} /> TR / EN / DE — Avrupa İhracat Hattı</div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="font-black uppercase tracking-widest mb-2" style={{ color: theme.accentHex }}>Güvenli Ödeme</div>
            <div className="flex flex-wrap gap-2">
              {['3D Secure', 'Visa / MasterCard', '12 Taksit', 'Havale %5 İndirim', 'Kapıda Ödeme'].map(badge => (
                <span key={badge} className={cn("px-2.5 py-1 rounded-lg border text-[10px] font-bold", theme.borderClass)}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* 7. PRODUCT DETAIL MODAL (SWATCHES + DIMENSIONS + TRUST + WHATSAPP + CART) */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className={cn("relative w-full max-w-4xl rounded-[32px] border overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 max-h-[92vh] overflow-y-auto", theme.borderClass)}
            style={{ backgroundColor: theme.bgCard }}
          >
            <button
              type="button"
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="relative min-h-[260px] bg-neutral-900">
              <img
                src={selectedProductModal.image}
                alt={getProductName(selectedProductModal)}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accentHex }}>
                    {selectedProductModal.category}
                  </span>
                  <h3 className="text-2xl font-black mt-1">{getProductName(selectedProductModal)}</h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-2xl font-black" style={{ color: theme.accentHex }}>
                      {formatMoney(selectedProductModal.price)}
                    </span>
                    {selectedProductModal.oldPrice && (
                      <span className="text-sm line-through opacity-50">{formatMoney(selectedProductModal.oldPrice)}</span>
                    )}
                  </div>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                  {selectedProductModal.description}
                </p>

                {/* Color & Fabric Swatches */}
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-2">
                    Kumaş & Renk Kartelası: <span style={{ color: theme.accentHex }}>{modalColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProductModal.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setModalColor(c.name)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 cursor-pointer transition-all",
                          modalColor === c.name ? "ring-2" : theme.borderClass
                        )}
                        style={modalColor === c.name ? { borderColor: theme.accentHex, backgroundColor: theme.bgSurface } : undefined}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions Table */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-widest">Ölçü Tablosu</div>
                  {selectedProductModal.dimensions.map((d) => (
                    <div key={d.piece} className="flex justify-between text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: theme.bgSurface }}>
                      <span className="font-bold">{d.piece}</span>
                      <span className="font-black" style={{ color: theme.accentHex }}>{d.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedProductModal, modalColor);
                    setSelectedProductModal(null);
                  }}
                  className="w-full py-3.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg cursor-pointer"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  🛒 {t.addToCart}
                </button>
                <button
                  type="button"
                  onClick={() => openWhatsApp(selectedProductModal, modalColor)}
                  className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest cursor-pointer"
                >
                  💬 {t.whatsappOrder}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. CART & CHECKOUT PAYMENT DRAWER (3D SECURE / TAKSİT / HAVALE / KAPIDA ÖDEME) */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
          <div
            className="w-full max-w-md h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
            style={{ backgroundColor: theme.bgCard, color: theme.textPrimary }}
          >
            <div>
              <div className={cn("flex items-center justify-between pb-4 border-b mb-5", theme.borderClass)}>
                <h3 className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag size={18} style={{ color: theme.accentHex }} />
                  {checkoutStep === 'cart' ? t.cartTitle : checkoutStep === 'payment' ? 'Ödeme Yöntemi' : 'Sipariş Alındı!'}
                </h3>
                <button type="button" onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-white/10 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {checkoutStep === 'cart' && (
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-xs opacity-60">Sepetiniz şu an boş.</div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={`${item.product.id}-${item.color}`} className={cn("p-3 rounded-2xl border flex gap-3 items-center", theme.borderClass)} style={{ backgroundColor: theme.bgSurface }}>
                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-black truncate">{getProductName(item.product)}</div>
                          <div className="text-[10px] opacity-70">Renk: {item.color}</div>
                          <div className="text-xs font-black mt-1" style={{ color: theme.accentHex }}>
                            {formatMoney(item.product.price * item.qty)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button type="button" onClick={() => updateCartQty(idx, -1)} className="p-1 rounded-lg bg-black/20 cursor-pointer"><Minus size={12} /></button>
                          <span className="text-xs font-black w-4 text-center">{item.qty}</span>
                          <button type="button" onClick={() => updateCartQty(idx, 1)} className="p-1 rounded-lg bg-black/20 cursor-pointer"><Plus size={12} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <div className="font-black uppercase tracking-widest text-[10px] opacity-70">Ödeme Yöntemi Seçin</div>
                    {[
                      { id: 'card', label: '💳 Kredi Kartı (3D Secure • 6-12 Taksit)' },
                      { id: 'transfer', label: '🏦 Havale / EFT (%5 Anında İndirim)' },
                      { id: 'door', label: '🚚 Kapıda Ödeme (Kurulum Sonrası)' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMethod(opt.id as any)}
                        className={cn("w-full text-left p-3.5 rounded-xl border font-bold cursor-pointer transition-all", theme.borderClass)}
                        style={paymentMethod === opt.id ? { borderColor: theme.accentHex, backgroundColor: `${theme.accentHex}18` } : { backgroundColor: theme.bgSurface }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="p-3 rounded-xl space-y-2" style={{ backgroundColor: theme.bgSurface }}>
                      <div className="font-black text-[10px] uppercase">Taksit Seçeneği:</div>
                      <div className="grid grid-cols-3 gap-2">
                        {[3, 6, 12].map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setInstallments(m)}
                            className="p-2 rounded-lg text-[10px] font-black border cursor-pointer"
                            style={installments === m ? { backgroundColor: theme.accentHex, color: theme.accentTextHex, borderColor: theme.accentHex } : undefined}
                          >
                            {m} Taksit<br />{formatMoney(Math.round(cartSubtotal / m))}/ay
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2.5 pt-2">
                    <input
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Ad Soyad"
                      className={cn("w-full p-3 rounded-xl border text-xs bg-transparent", theme.borderClass)}
                    />
                    <input
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="Telefon (05XX ...)"
                      className={cn("w-full p-3 rounded-xl border text-xs bg-transparent", theme.borderClass)}
                    />
                    <textarea
                      value={customerAddress}
                      onChange={e => setCustomerAddress(e.target.value)}
                      placeholder="Teslimat Adresi (İl / İlçe / Mahalle)"
                      rows={2}
                      className={cn("w-full p-3 rounded-xl border text-xs bg-transparent", theme.borderClass)}
                    />
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 size={56} className="mx-auto text-emerald-500" />
                  <h4 className="text-xl font-black">Siparişiniz Oluşturuldu!</h4>
                  <p className="text-xs opacity-80 leading-relaxed">
                    {theme.brandName} fabrika üretim ekibimiz onay için sizi en kısa sürede arayacaktır.
                  </p>
                  <div className="p-4 rounded-2xl text-xs font-bold" style={{ backgroundColor: theme.bgSurface }}>
                    Toplam Tutar: <span style={{ color: theme.accentHex }}>{formatMoney(cartFinalTotal)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setCart([]); setCartOpen(false); setCheckoutStep('cart'); }}
                    className="w-full py-3 rounded-full text-xs font-black uppercase cursor-pointer"
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                  >
                    Alışverişe Devam Et
                  </button>
                </div>
              )}
            </div>

            {cart.length > 0 && checkoutStep !== 'success' && (
              <div className={cn("pt-4 border-t space-y-3", theme.borderClass)}>
                <div className="flex justify-between text-sm font-black">
                  <span>Genel Toplam</span>
                  <span style={{ color: theme.accentHex }}>{formatMoney(cartFinalTotal)}</span>
                </div>
                {checkoutStep === 'cart' ? (
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-xl cursor-pointer"
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                  >
                    {t.checkoutBtn} <ChevronRight size={14} className="inline" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('success')}
                    className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest shadow-xl cursor-pointer"
                  >
                    ✅ Siparişi Onayla ({formatMoney(cartFinalTotal)})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. FLOATING AI ROBOT CHATBOT + WHATSAPP BUTTON */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {botOpen && (
          <div
            className={cn("w-[320px] sm:w-[360px] rounded-3xl border shadow-2xl overflow-hidden flex flex-col", theme.borderClass)}
            style={{ backgroundColor: theme.bgCard }}
          >
            <div className="p-4 flex items-center justify-between" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <div>
                  <div className="text-xs font-black">{theme.botName}</div>
                  <div className="text-[9px] opacity-80">Yapay Zeka Canlı Danışman • Çevrimiçi</div>
                </div>
              </div>
              <button type="button" onClick={() => setBotOpen(false)} className="p-1 rounded-full hover:bg-black/15 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="p-3.5 h-64 overflow-y-auto space-y-2.5 text-xs">
              {botMessages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-3 rounded-2xl max-w-[85%] leading-relaxed",
                    m.from === 'user' ? "ml-auto font-bold" : "mr-auto"
                  )}
                  style={
                    m.from === 'user'
                      ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                      : { backgroundColor: theme.bgSurface }
                  }
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* Quick Chips */}
            <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
              {['Taksit & Ödeme', 'Avrupa Teslimat', 'Özel Ölçü', '3D Oda Planla'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleBotSend(chip)}
                  className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap cursor-pointer", theme.borderClass)}
                  style={{ backgroundColor: theme.bgSurface }}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className={cn("p-2.5 border-t flex gap-2", theme.borderClass)}>
              <input
                value={botInput}
                onChange={(e) => setBotInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBotSend()}
                placeholder="Sorunuzu yazın..."
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => handleBotSend()}
                className="p-2.5 rounded-xl cursor-pointer"
                style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
            title="WhatsApp Hızlı Sipariş"
          >
            <MessageCircle size={22} />
          </button>
          <button
            type="button"
            onClick={() => setBotOpen(!botOpen)}
            className="px-4 h-12 rounded-full shadow-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
          >
            <Bot size={18} />
            <span className="hidden sm:inline">AI Robot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
