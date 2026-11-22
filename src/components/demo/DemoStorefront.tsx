"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, MessageCircle, ShieldCheck, Truck, Wrench, CreditCard,
  X, Plus, Minus, CheckCircle2, Globe, Bot, Send, Box, Layers, ArrowRight,
  ChevronRight, Phone, MapPin, Menu, Camera
} from 'lucide-react';
import { DemoThemeConfig, DemoProduct, SHARED_DEMO_PRODUCTS, DEMO_THEME_LIST } from '@/data/demoThemes';
import ShowroomRoomPlanner from '@/components/showroom/ShowroomRoomPlanner';
import EuropeExportAndB2B from '@/components/shared/EuropeExportAndB2B';
import AIRoomVisualizer from '@/components/shared/AIRoomVisualizer';
import { cn } from '@/lib/utils';

type Lang = 'TR' | 'EN' | 'DE';
type StudioTab = '3d' | 'ai-room' | 'export';

const UI_TEXT: Record<Lang, any> = {
  TR: {
    navCatalog: 'Koleksiyon',
    navShowroom: '3D Stüdyo',
    navExport: 'Avrupa Teslimat',
    navContact: 'İletişim',
    ctaExplore: 'Koleksiyonu İncele',
    cta3D: '3D Oda Stüdyosu',
    allCats: 'Tümü',
    inspect: 'İncele',
    addToCart: 'Sepete Ekle',
    whatsappOrder: 'WhatsApp Sipariş',
    studioKicker: 'İnteraktif Deneyim',
    studioTitle: 'Eviniz İçin Tasarlayın',
    studioSub: 'Koleksiyonumuzu 360° inceleyin, odanızın fotoğrafında görün veya Avrupa kapı teslim fiyatını hesaplayın.',
    tab3D: '3D Showroom & Özel Ölçü',
    tabAIRoom: 'Odanın Fotoğrafında Gör',
    tabExport: 'Avrupa Teslimat & Bayi',
    modeFull3D: '360° Ürün Görünümü',
    modePlanner: '3D Oda Planlayıcı & Özel Ölçü',
    cartTitle: 'Alışveriş Sepeti',
    checkoutBtn: 'Siparişi Tamamla',
    freeShipping: 'Türkiye & Avrupa Teslimat',
    freeInstall: 'Ücretsiz Kurulum',
    warranty: '2 Yıl Fabrika Garantisi',
    installment: '12 Aya Varan Taksit',
    botWelcome: 'Merhaba, mobilya danışmanınızım. Ölçü, kumaş renkleri, taksit veya Avrupa teslimat hakkında dilediğinizi sorabilirsiniz.',
  },
  EN: {
    navCatalog: 'Collection',
    navShowroom: '3D Studio',
    navExport: 'Europe Delivery',
    navContact: 'Contact',
    ctaExplore: 'Explore Collection',
    cta3D: '3D Room Studio',
    allCats: 'All',
    inspect: 'Details',
    addToCart: 'Add to Cart',
    whatsappOrder: 'Order on WhatsApp',
    studioKicker: 'Interactive Experience',
    studioTitle: 'Design For Your Home',
    studioSub: 'Explore sets in 360° 3D, preview inside your room photo, or calculate door-to-door European delivery.',
    tab3D: '3D Showroom & Custom Size',
    tabAIRoom: 'View in Your Room',
    tabExport: 'Europe Delivery & B2B',
    modeFull3D: '360° Product View',
    modePlanner: '3D Room Planner & Sizing',
    cartTitle: 'Shopping Cart',
    checkoutBtn: 'Proceed to Checkout',
    freeShipping: 'Europe & Turkey Delivery',
    freeInstall: 'White-Glove Assembly',
    warranty: '2-Year Factory Warranty',
    installment: 'Flexible Installments',
    botWelcome: 'Hello! Ask me anything about custom sizes, fabrics, or European door-to-door delivery.',
  },
  DE: {
    navCatalog: 'Kollektion',
    navShowroom: '3D Studio',
    navExport: 'Europa-Lieferung',
    navContact: 'Kontakt',
    ctaExplore: 'Kollektion entdecken',
    cta3D: '3D Raumstudio',
    allCats: 'Alle',
    inspect: 'Details',
    addToCart: 'In den Warenkorb',
    whatsappOrder: 'Per WhatsApp',
    studioKicker: 'Interaktives Erlebnis',
    studioTitle: 'Für Ihr Zuhause gestaltet',
    studioSub: 'Entdecken Sie Sets in 360° 3D, testen Sie Ihr Raumfoto oder berechnen Sie die Lieferung nach Europa.',
    tab3D: '3D Showroom & Sondermaß',
    tabAIRoom: 'In Ihrem Raum testen',
    tabExport: 'Europa-Lieferung & B2B',
    modeFull3D: '360° Produktansicht',
    modePlanner: '3D Raumplaner & Maßanfertigung',
    cartTitle: 'Warenkorb',
    checkoutBtn: 'Zur Kasse',
    freeShipping: 'Europaweiter Versand',
    freeInstall: 'Montageservice',
    warranty: '2 Jahre Garantie',
    installment: 'Ratenzahlung',
    botWelcome: 'Hallo! Fragen Sie mich gern zu Sondermaßen, Stoffen oder der Lieferung nach Deutschland und Europa.',
  },
};

interface CartItem {
  product: DemoProduct;
  color: string;
  qty: number;
}

export default function DemoStorefront({ theme: baseTheme }: { theme: DemoThemeConfig }) {
  const [customFirma, setCustomFirma] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const firmaParam = params.get('firma')?.trim();
      if (firmaParam) {
        setCustomFirma(firmaParam.slice(0, 48));
      }
    }
  }, []);

  const theme = useMemo<DemoThemeConfig>(() => {
    if (!customFirma) return baseTheme;
    return {
      ...baseTheme,
      brandName: customFirma.toUpperCase(),
      styleLabel: 'İnegöl Mobilya & Tasarım',
      botName: `${customFirma} Danışman`,
    };
  }, [baseTheme, customFirma]);

  const [lang, setLang] = useState<Lang>('TR');
  const [activeCat, setActiveCat] = useState<string>('Tümü');
  const [selectedProductModal, setSelectedProductModal] = useState<DemoProduct | null>(null);
  const [modalColor, setModalColor] = useState<string>('Doğal Meşe');

  // Unified Studio Tabs (keeps the page clean & uncluttered!)
  const [studioTab, setStudioTab] = useState<StudioTab>('3d');
  const [showroomProduct, setShowroomProduct] = useState<DemoProduct>(SHARED_DEMO_PRODUCTS[0]);
  const [showroomMode, setShowroomMode] = useState<'full3d' | 'planner'>('full3d');
  const [showroomColor, setShowroomColor] = useState<string>('Doğal Meşe');

  // Cart & Checkout
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'door'>('card');
  const [installments, setInstallments] = useState<number>(6);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Assistant & Mobile Menu
  const [botOpen, setBotOpen] = useState(false);
  const [botInput, setBotInput] = useState('');
  const [botMessages, setBotMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = UI_TEXT[lang];

  useEffect(() => {
    setBotMessages([{ from: 'bot', text: t.botWelcome }]);
  }, [lang, theme.slug, t.botWelcome]);

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
      ? `Merhaba ${theme.brandName}, "${product.name}" (${color || product.colors[0].name}) - ${formatMoney(product.price)} hakkında bilgi almak istiyorum.`
      : `Merhaba ${theme.brandName}, mobilya koleksiyonunuz hakkında bilgi almak istiyorum.`;
    window.open(`https://wa.me/${theme.whatsappPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleBotSend = (customText?: string) => {
    const q = (customText ?? botInput).trim();
    if (!q) return;
    setBotInput('');
    const lower = q.toLowerCase();
    let reply = `${theme.brandName} koleksiyonumuzda 2 yıl fabrika garantisi, ücretsiz kurulum ve 12 aya varan taksit sunuyoruz. Detaylı bilgi için WhatsApp hattımıza bağlanabilirsiniz.`;

    if (lower.includes('taksit') || lower.includes('ödeme') || lower.includes('fiyat')) {
      reply = 'Tüm kredi kartlarına 6–12 taksit, Havale/EFT ödemelerinde %5 nakit indirim ve kapıda ödeme seçeneklerimiz mevcuttur.';
    } else if (lower.includes('avrupa') || lower.includes('almanya') || lower.includes('kargo') || lower.includes('teslimat')) {
      reply = 'Türkiye’nin 81 iline ücretsiz nakliye ve kurulum yapıyoruz. Almanya, Hollanda, Belçika, Fransa ve tüm Avrupa’ya gümrük dahil kapı teslim sevkiyatımız vardır.';
    } else if (lower.includes('ölçü') || lower.includes('özel') || lower.includes('renk') || lower.includes('kumaş')) {
      reply = 'Tüm takımlarımızda 40+ kolay silinebilir kumaş ve ahşap renk seçeneği bulunur. Odanızın ölçüsüne göre özel üretim yapıyoruz.';
    } else if (lower.includes('3d') || lower.includes('oda') || lower.includes('showroom')) {
      reply = 'Aşağıdaki "3D Stüdyo" sekmesinden takımları 360° inceleyebilir, kapak/bazaları açabilir veya odanızın ölçüsüne göre yerleştirebilirsiniz.';
    }
    setBotMessages(prev => [...prev, { from: 'user', text: q }, { from: 'bot', text: reply }]);
  };

  const jumpToStudio = (tab: StudioTab, p?: DemoProduct) => {
    if (p) {
      setShowroomProduct(p);
      setShowroomColor(p.colors[0].name);
    }
    setStudioTab(tab);
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = ['Tümü', 'Yatak Odası', 'Yemek Odası', 'Koltuk Takımı'];

  return (
    <div
      className="min-h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: theme.bgPage, color: theme.textPrimary }}
    >
      {/* 0. ULTRA-MINIMAL THEME SWITCHER BAR */}
      <div className="w-full bg-[#0d0d10] text-neutral-400 text-[11px] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-9 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href="/ajans" className="text-neutral-200 hover:text-white font-medium transition-colors whitespace-nowrap">
              ← Ajans
            </Link>
            <Link href="/vitrin" className="hover:text-white transition-colors whitespace-nowrap">
              Tüm Konseptler
            </Link>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            {DEMO_THEME_LIST.map((item) => {
              const active = item.slug === theme.slug;
              return (
                <Link
                  key={item.slug}
                  href={customFirma ? `/demo/${item.slug}?firma=${encodeURIComponent(customFirma)}` : `/demo/${item.slug}`}
                  className={cn(
                    'transition-colors whitespace-nowrap py-1 border-b-2',
                    active ? 'text-white font-semibold' : 'border-transparent hover:text-neutral-200'
                  )}
                  style={active ? { borderColor: item.accentHex } : undefined}
                >
                  {item.brandName}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. CLEAN, AIRY FURNITURE STORE HEADER */}
      <header
        className={cn('sticky top-0 z-40 backdrop-blur-md border-b', theme.borderClass)}
        style={{ backgroundColor: theme.isDark ? 'rgba(17,17,20,0.92)' : 'rgba(255,255,255,0.94)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-6">
          <a href="#hero" className="flex items-center gap-3 min-w-0">
            <div
              className={cn('w-8 h-8 flex items-center justify-center font-semibold text-sm flex-shrink-0', theme.slug === 'aura-luxe' ? 'rounded-none' : 'rounded-lg')}
              style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
            >
              {theme.brandName.charAt(0)}
            </div>
            <div className="truncate">
              <div className={cn('text-base sm:text-lg font-semibold tracking-[0.14em] truncate', theme.fontStyle === 'serif' && 'font-serif')}>
                {theme.brandName}
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium">
            <a href="#catalog" className="hover:opacity-65 transition-opacity">{t.navCatalog}</a>
            <button type="button" onClick={() => jumpToStudio('3d')} className="hover:opacity-65 transition-opacity cursor-pointer">
              {t.navShowroom}
            </button>
            <button type="button" onClick={() => jumpToStudio('export')} className="hover:opacity-65 transition-opacity cursor-pointer">
              {t.navExport}
            </button>
            <a href="#footer" className="hover:opacity-65 transition-opacity">{t.navContact}</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className={cn('hidden sm:flex items-center rounded-full border p-0.5 text-[11px] font-medium', theme.borderClass)}>
              {(['TR', 'EN', 'DE'] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className="px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                  style={lang === code ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : undefined}
                >
                  {code}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => { setCheckoutStep('cart'); setCartOpen(true); }}
              className={cn('relative p-2.5 rounded-full border transition-colors cursor-pointer hover:opacity-80', theme.borderClass)}
              aria-label="Sepet"
            >
              <ShoppingBag size={16} />
              {cart.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn('md:hidden p-2 rounded-lg border', theme.borderClass)}
              aria-label="Menü"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={cn('md:hidden px-6 py-4 border-t flex flex-col gap-3 text-sm font-medium', theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
            <a href="#catalog" onClick={() => setMobileMenuOpen(false)}>{t.navCatalog}</a>
            <button type="button" onClick={() => { setMobileMenuOpen(false); jumpToStudio('3d'); }} className="text-left">{t.navShowroom}</button>
            <button type="button" onClick={() => { setMobileMenuOpen(false); jumpToStudio('export'); }} className="text-left">{t.navExport}</button>
            <a href="#footer" onClick={() => setMobileMenuOpen(false)}>{t.navContact}</a>
          </div>
        )}
      </header>

      {/* ===================================================================== */}
      {/* 2. FIVE CLEAN, DISTINCT, SERENE FURNITURE HEROES                      */}
      {/* ===================================================================== */}

      {/* 1. AURA LUXE — Calm Dark Editorial Full-Bleed Hero */}
      {theme.slug === 'aura-luxe' && (
        <section id="hero" className="relative min-h-[72vh] flex items-center">
          <img src={theme.heroImage} alt={theme.brandName} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111114]/90 via-[#111114]/55 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-24 w-full">
            <div className="max-w-xl space-y-6">
              <p className="text-xs uppercase tracking-[0.25em]" style={{ color: theme.accentHex }}>
                {theme.styleLabel}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-medium leading-[1.12] tracking-tight text-white">
                {theme.heroTitle}
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                {theme.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#catalog"
                  className="px-7 py-3.5 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-90"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  {t.ctaExplore}
                </a>
                <button
                  type="button"
                  onClick={() => jumpToStudio('3d')}
                  className="px-7 py-3.5 border border-white/30 text-white text-xs font-semibold uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {t.cta3D}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. NORDİKA — Airy 2-Column Scandinavian Split Hero */}
      {theme.slug === 'nordika' && (
        <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <p className="text-xs uppercase tracking-[0.22em] font-medium" style={{ color: theme.accentHex }}>
                {theme.styleLabel}
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.12]">
                {theme.heroTitle}
              </h1>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.textMuted }}>
                {theme.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#catalog"
                  className="px-7 py-3.5 rounded-full text-xs font-semibold tracking-wide transition-opacity hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  {t.ctaExplore} <ArrowRight size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => jumpToStudio('3d')}
                  className={cn('px-7 py-3.5 rounded-full border text-xs font-semibold tracking-wide transition-colors cursor-pointer hover:opacity-75', theme.borderClass)}
                >
                  {t.cta3D}
                </button>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-sm">
                <img src={theme.heroImage} alt={theme.brandName} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. VELVET & CO. — Refined Editorial Arched Frame Hero */}
      {theme.slug === 'velvet-co' && (
        <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-px" style={{ backgroundColor: theme.accentHex }} />
              <span className="text-xs uppercase tracking-[0.25em]" style={{ color: theme.accentHex }}>
                {theme.styleLabel}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-normal leading-[1.12]">
              {theme.heroTitle}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: theme.textMuted }}>
              {theme.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#catalog"
                className="px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-90"
                style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
              >
                {t.ctaExplore}
              </a>
              <button
                type="button"
                onClick={() => jumpToStudio('3d')}
                className="px-7 py-3.5 rounded-full border text-xs font-semibold uppercase tracking-widest cursor-pointer transition-opacity hover:opacity-80"
                style={{ borderColor: `${theme.accentHex}66`, color: theme.accentHex }}
              >
                {t.cta3D}
              </button>
            </div>
          </div>
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md aspect-[4/5] rounded-t-full overflow-hidden border p-2" style={{ borderColor: `${theme.accentHex}44` }}>
              <img src={theme.heroImage} alt={theme.brandName} className="w-full h-full object-cover rounded-t-full" />
            </div>
          </div>
        </section>
      )}

      {/* 4. SARAYLI — Calm Centered Ivory & 3 Clean Category Tiles */}
      {theme.slug === 'sarayli' && (
        <section id="hero" className={cn('py-14 sm:py-20 px-4 sm:px-8 border-b', theme.borderClass)} style={{ backgroundColor: theme.bgSurface }}>
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <p className="text-xs uppercase tracking-[0.28em] font-medium" style={{ color: theme.accentHex }}>
              {theme.styleLabel}
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif font-medium leading-[1.15] max-w-3xl mx-auto">
              {theme.heroTitle}
            </h1>
            <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: theme.textMuted }}>
              {theme.heroSubtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6 text-left">
              {[
                { title: 'Yatak Odası', img: '/images/yatak_odasi.png', cat: 'Yatak Odası' },
                { title: 'Yemek Odası', img: '/images/yemek_odasi.png', cat: 'Yemek Odası' },
                { title: 'Koltuk Takımı', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80', cat: 'Koltuk Takımı' },
              ].map((c) => (
                <a
                  key={c.title}
                  href="#catalog"
                  onClick={() => setActiveCat(c.cat)}
                  className={cn('group bg-white rounded-xl overflow-hidden border transition-shadow hover:shadow-md', theme.borderClass)}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-sm font-serif font-medium">{c.title}</span>
                    <ArrowRight size={14} style={{ color: theme.accentHex }} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. MODA LİNE — Warm Modern Split with Clean 360° Live Showcase */}
      {theme.slug === 'modaline' && (
        <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] font-semibold" style={{ color: theme.accentHex }}>
              {theme.styleLabel}
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.12]">
              {theme.heroTitle}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.textMuted }}>
              {theme.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#catalog"
                className="px-7 py-3.5 rounded-full text-xs font-semibold tracking-wide transition-opacity hover:opacity-90"
                style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
              >
                {t.ctaExplore}
              </a>
              <button
                type="button"
                onClick={() => jumpToStudio('3d')}
                className={cn('px-7 py-3.5 rounded-full border text-xs font-semibold tracking-wide cursor-pointer hover:opacity-75', theme.borderClass)}
              >
                {t.cta3D}
              </button>
            </div>
          </div>
          <div className="lg:col-span-7 relative h-[360px] sm:h-[440px] rounded-3xl overflow-hidden border" style={{ backgroundColor: theme.bgSurface, borderColor: 'rgba(0,0,0,0.08)' }}>
            <model-viewer
              src={showroomProduct.fullRoomModelUrl}
              alt={showroomProduct.name}
              camera-controls
              auto-rotate
              ar
              ar-modes="webxr scene-viewer quick-look"
              shadow-intensity="1"
              exposure="1"
              style={{ width: '100%', height: '100%', backgroundColor: 'transparent' } as any}
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl text-xs shadow-sm">
              <span className="font-medium text-neutral-700">{getProductName(showroomProduct)} — 360°</span>
              <span className="font-semibold" style={{ color: theme.accentHex }}>{formatMoney(showroomProduct.price)}</span>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 3. CLEAN, ORGANIZED FURNITURE CATALOG (FIRST & FOREMOST ON ALL 5!)    */}
      {/* ===================================================================== */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6" style={{ borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: theme.accentHex }}>
              2026 Koleksiyonu
            </p>
            <h2 className={cn('text-2xl sm:text-3xl font-medium tracking-tight', theme.fontStyle === 'serif' && 'font-serif')}>
              Öne Çıkan Takımlar
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = activeCat === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  className={cn(
                    'px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border',
                    active ? 'border-transparent' : theme.borderClass
                  )}
                  style={active ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : { color: theme.textMuted }}
                >
                  {cat === 'Tümü' ? t.allCats : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean, Balanced Product Grid */}
        <div
          className={cn(
            'grid gap-7',
            theme.slug === 'aura-luxe' || theme.slug === 'velvet-co'
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {filteredProducts.map((p) => (
            <article
              key={p.id}
              className={cn(
                'group border overflow-hidden flex flex-col justify-between transition-all duration-300',
                theme.slug === 'aura-luxe' ? 'rounded-none' : 'rounded-2xl',
                theme.borderClass,
                !theme.isDark && 'hover:shadow-lg'
              )}
              style={{ backgroundColor: theme.bgCard }}
            >
              <div>
                <div
                  onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                  className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                  style={{ backgroundColor: theme.bgSurface }}
                >
                  <img
                    src={p.image}
                    alt={getProductName(p)}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>

                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-wider" style={{ color: theme.textMuted }}>
                      {p.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {p.colors.slice(0, 4).map((c) => (
                        <span
                          key={c.name}
                          title={c.name}
                          className="w-3 h-3 rounded-full border border-black/15"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <h3
                    onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                    className={cn('text-lg font-medium cursor-pointer hover:opacity-75 transition-opacity', theme.fontStyle === 'serif' && 'font-serif')}
                  >
                    {getProductName(p)}
                  </h3>

                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: theme.textMuted }}>
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t flex items-center justify-between gap-3" style={{ borderColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                <div>
                  <div className="text-base sm:text-lg font-semibold" style={{ color: theme.isDark ? theme.accentHex : theme.textPrimary }}>
                    {formatMoney(p.price)}
                  </div>
                  {p.oldPrice && (
                    <div className="text-[11px] line-through opacity-50">{formatMoney(p.oldPrice)}</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => jumpToStudio('3d', p)}
                    className={cn('p-2.5 border text-xs transition-colors cursor-pointer hover:opacity-75', theme.slug === 'aura-luxe' ? 'rounded-none' : 'rounded-full', theme.borderClass)}
                    title="3D İncele"
                  >
                    <Box size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                    className={cn('px-4 py-2 border text-xs font-medium transition-colors cursor-pointer hover:opacity-75', theme.slug === 'aura-luxe' ? 'rounded-none' : 'rounded-full', theme.borderClass)}
                  >
                    {t.inspect}
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(p, p.colors[0].name)}
                    className={cn('px-4 py-2 text-xs font-medium transition-opacity hover:opacity-90 cursor-pointer', theme.slug === 'aura-luxe' ? 'rounded-none' : 'rounded-full')}
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                  >
                    {t.addToCart}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. SINGLE CALM TABBED STUDIO (ONLY 1 TOOL VISIBLE AT A TIME!)         */}
      {/* ===================================================================== */}
      <section id="studio" className={cn('border-t py-14 sm:py-20', theme.borderClass)} style={{ backgroundColor: theme.bgSurface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: theme.accentHex }}>
                {t.studioKicker}
              </p>
              <h2 className={cn('text-2xl sm:text-3xl font-medium tracking-tight', theme.fontStyle === 'serif' && 'font-serif')}>
                {t.studioTitle}
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textMuted }}>
                {t.studioSub}
              </p>
            </div>

            {/* Clean 3-Tab Switcher */}
            <div className={cn('inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl border', theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
              {[
                { id: '3d' as StudioTab, label: t.tab3D, icon: <Box size={14} /> },
                { id: 'ai-room' as StudioTab, label: t.tabAIRoom, icon: <Camera size={14} /> },
                { id: 'export' as StudioTab, label: t.tabExport, icon: <Globe size={14} /> },
              ].map((tab) => {
                const active = studioTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStudioTab(tab.id)}
                    className="px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
                    style={
                      active
                        ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                        : { color: theme.textMuted }
                    }
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: CLEAN 3D SHOWROOM & OPTIONAL ROOM PLANNER */}
          {studioTab === '3d' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {SHARED_DEMO_PRODUCTS.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setShowroomProduct(p); setShowroomColor(p.colors[0].name); }}
                      className={cn('px-4 py-2 rounded-full text-xs font-medium border transition-colors cursor-pointer', theme.borderClass)}
                      style={
                        showroomProduct.id === p.id
                          ? { backgroundColor: theme.accentHex, color: theme.accentTextHex, borderColor: theme.accentHex }
                          : { backgroundColor: theme.bgCard, color: theme.textPrimary }
                      }
                    >
                      {p.category}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowroomMode('full3d')}
                    className={cn('px-3.5 py-2 rounded-full text-xs font-medium border cursor-pointer', theme.borderClass)}
                    style={showroomMode === 'full3d' ? { backgroundColor: theme.bgCard, borderColor: theme.accentHex } : { opacity: 0.7 }}
                  >
                    {t.modeFull3D}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowroomMode('planner')}
                    className={cn('px-3.5 py-2 rounded-full text-xs font-medium border cursor-pointer flex items-center gap-1.5', theme.borderClass)}
                    style={showroomMode === 'planner' ? { backgroundColor: theme.accentHex, color: theme.accentTextHex, borderColor: theme.accentHex } : { backgroundColor: theme.bgCard }}
                  >
                    <Layers size={13} /> {t.modePlanner}
                  </button>
                </div>
              </div>

              {showroomMode === 'full3d' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <div
                    className={cn('lg:col-span-8 relative h-[380px] sm:h-[460px] rounded-2xl border overflow-hidden', theme.borderClass)}
                    style={{ backgroundColor: theme.bgCard }}
                  >
                    <model-viewer
                      src={showroomProduct.fullRoomModelUrl}
                      alt={showroomProduct.name}
                      camera-controls
                      auto-rotate
                      ar
                      ar-modes="webxr scene-viewer quick-look"
                      shadow-intensity="1"
                      exposure="1"
                      style={{ width: '100%', height: '100%', backgroundColor: 'transparent' } as any}
                    />
                    <button
                      type="button"
                      onClick={() => setShowroomMode('planner')}
                      className="absolute bottom-4 right-4 px-4 py-2.5 rounded-full text-xs font-medium shadow-md cursor-pointer flex items-center gap-1.5"
                      style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                    >
                      <Layers size={14} /> Odada Yerleştir &amp; Özel Ölçü
                    </button>
                  </div>

                  <div className={cn('lg:col-span-4 rounded-2xl border p-6 flex flex-col justify-between gap-6', theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
                    <div className="space-y-4">
                      <span className="text-[11px] uppercase tracking-widest" style={{ color: theme.accentHex }}>
                        {showroomProduct.category}
                      </span>
                      <h3 className={cn('text-2xl font-medium', theme.fontStyle === 'serif' && 'font-serif')}>
                        {getProductName(showroomProduct)}
                      </h3>
                      <div className="text-xl font-semibold" style={{ color: theme.isDark ? theme.accentHex : theme.textPrimary }}>
                        {formatMoney(showroomProduct.price)}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                        {showroomProduct.description}
                      </p>
                      <div className="space-y-2 pt-2 border-t" style={{ borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                        {showroomProduct.dimensions.map((d) => (
                          <div key={d.piece} className="flex justify-between text-xs">
                            <span style={{ color: theme.textMuted }}>{d.piece}</span>
                            <span className="font-medium">{d.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => addToCart(showroomProduct, showroomColor)}
                        className="w-full py-3 rounded-full text-xs font-semibold tracking-wide cursor-pointer transition-opacity hover:opacity-90"
                        style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                      >
                        {t.addToCart}
                      </button>
                      <button
                        type="button"
                        onClick={() => openWhatsApp(showroomProduct, showroomColor)}
                        className={cn('w-full py-3 rounded-full border text-xs font-semibold tracking-wide cursor-pointer hover:opacity-75', theme.borderClass)}
                      >
                        {t.whatsappOrder}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-white">
                  <ShowroomRoomPlanner
                    selectedProduct={{
                      ...showroomProduct,
                      threeDModelUrl: showroomProduct.fullRoomModelUrl,
                    }}
                    selectedColor={showroomColor}
                    onChangeColor={(c) => setShowroomColor(c)}
                    onInspect3D={() => setShowroomMode('full3d')}
                    brandName={theme.brandName}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI ROOM PHOTO VISUALIZER (LOADED ONLY WHEN SELECTED) */}
          {studioTab === 'ai-room' && (
            <div className="-mx-4 sm:-mx-8 -my-8">
              <AIRoomVisualizer
                brandName={theme.brandName}
                accentHex={theme.accentHex}
                isDark={theme.isDark}
                whatsappPhone={theme.whatsappPhone}
              />
            </div>
          )}

          {/* TAB 3: EUROPE EXPORT & B2B CALCULATOR (LOADED ONLY WHEN SELECTED) */}
          {studioTab === 'export' && (
            <div className="-mx-4 sm:-mx-8 -my-8">
              <EuropeExportAndB2B
                brandName={theme.brandName}
                accentHex={theme.accentHex}
                isDark={theme.isDark}
                whatsappPhone={theme.whatsappPhone}
              />
            </div>
          )}
        </div>
      </section>

      {/* 5. CLEAN TRUST BAR */}
      <section id="trust" className={cn('border-t', theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Truck size={18} />, title: t.freeShipping, sub: '81 İl & Avrupa Teslimat' },
            { icon: <Wrench size={18} />, title: t.freeInstall, sub: 'Profesyonel Kurulum Ekibi' },
            { icon: <ShieldCheck size={18} />, title: t.warranty, sub: '1. Sınıf Masif İskelet' },
            { icon: <CreditCard size={18} />, title: t.installment, sub: 'Güvenli Ödeme & Taksit' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="mt-0.5" style={{ color: theme.accentHex }}>
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-semibold">{item.title}</div>
                <div className="text-[11px] mt-0.5" style={{ color: theme.textMuted }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MINIMAL FOOTER */}
      <footer id="footer" className={cn('border-t py-12 px-4 sm:px-8', theme.borderClass)} style={{ backgroundColor: theme.bgPage }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div className="space-y-2.5">
            <div className={cn('text-base font-semibold tracking-[0.14em]', theme.fontStyle === 'serif' && 'font-serif')}>
              {theme.brandName}
            </div>
            <p className="leading-relaxed max-w-xs" style={{ color: theme.textMuted }}>
              İnegöl’den Türkiye ve Avrupa’ya doğrudan fabrika teslimi, modern yaşam alanları için tasarlanan seçkin mobilya koleksiyonları.
            </p>
          </div>
          <div className="space-y-2" style={{ color: theme.textMuted }}>
            <div className="font-semibold text-current mb-2">İletişim</div>
            <div className="flex items-center gap-2"><MapPin size={13} /> Mahmudiye Mah. İnegöl, Bursa</div>
            <div className="flex items-center gap-2"><Phone size={13} /> +90 507 756 78 87</div>
            <div className="flex items-center gap-2"><Globe size={13} /> TR / EN / DE İhracat Desteği</div>
          </div>
          <div className="space-y-2" style={{ color: theme.textMuted }}>
            <div className="font-semibold text-current mb-2">Ödeme &amp; Garanti</div>
            <p className="leading-relaxed">3D Secure kredi kartı, 12 aya varan taksit, havale indirimi ve 2 yıl üretici garantisi.</p>
          </div>
        </div>
      </footer>

      {/* 7. PRODUCT DETAIL MODAL */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={cn('relative w-full max-w-4xl rounded-2xl border overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto', theme.borderClass)}
            style={{ backgroundColor: theme.bgCard }}
          >
            <button
              type="button"
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="relative min-h-[260px]" style={{ backgroundColor: theme.bgSurface }}>
              <img src={selectedProductModal.image} alt={getProductName(selectedProductModal)} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] uppercase tracking-widest" style={{ color: theme.accentHex }}>
                    {selectedProductModal.category}
                  </span>
                  <h3 className={cn('text-2xl font-medium mt-1', theme.fontStyle === 'serif' && 'font-serif')}>
                    {getProductName(selectedProductModal)}
                  </h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-xl font-semibold" style={{ color: theme.isDark ? theme.accentHex : theme.textPrimary }}>
                      {formatMoney(selectedProductModal.price)}
                    </span>
                    {selectedProductModal.oldPrice && (
                      <span className="text-sm line-through opacity-50">{formatMoney(selectedProductModal.oldPrice)}</span>
                    )}
                  </div>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>{selectedProductModal.description}</p>

                <div>
                  <div className="text-xs font-medium mb-2">
                    Renk: <span style={{ color: theme.accentHex }}>{modalColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProductModal.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setModalColor(c.name)}
                        className={cn('px-3 py-1.5 rounded-full text-xs border flex items-center gap-1.5 cursor-pointer', theme.borderClass)}
                        style={modalColor === c.name ? { borderColor: theme.accentHex, backgroundColor: theme.bgSurface } : undefined}
                      >
                        <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                  {selectedProductModal.dimensions.map((d) => (
                    <div key={d.piece} className="flex justify-between text-xs">
                      <span style={{ color: theme.textMuted }}>{d.piece}</span>
                      <span className="font-medium">{d.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => { addToCart(selectedProductModal, modalColor); setSelectedProductModal(null); }}
                  className="w-full py-3.5 rounded-full text-xs font-semibold tracking-wide cursor-pointer"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  {t.addToCart}
                </button>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => { const p = selectedProductModal; setSelectedProductModal(null); jumpToStudio('3d', p); }}
                    className={cn('py-3 rounded-full border text-xs font-medium cursor-pointer', theme.borderClass)}
                  >
                    3D Odada Gör
                  </button>
                  <button
                    type="button"
                    onClick={() => openWhatsApp(selectedProductModal, modalColor)}
                    className="py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. CLEAN CART & CHECKOUT DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto" style={{ backgroundColor: theme.bgCard }}>
            <div className="space-y-5">
              <div className={cn('flex items-center justify-between pb-4 border-b', theme.borderClass)}>
                <h3 className="text-base font-semibold">{t.cartTitle}</h3>
                <button type="button" onClick={() => setCartOpen(false)} className="p-1.5 rounded-full hover:opacity-70 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {checkoutStep === 'cart' && (
                <div className="space-y-3">
                  {cart.length === 0 ? (
                    <p className="text-center py-12 text-xs" style={{ color: theme.textMuted }}>Sepetiniz şu an boş.</p>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={`${item.product.id}-${item.color}`} className={cn('p-3 rounded-xl border flex items-center gap-3', theme.borderClass)} style={{ backgroundColor: theme.bgSurface }}>
                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{getProductName(item.product)}</div>
                          <div className="text-[11px]" style={{ color: theme.textMuted }}>{item.color}</div>
                          <div className="text-xs font-semibold mt-1" style={{ color: theme.accentHex }}>
                            {formatMoney(item.product.price * item.qty)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button type="button" onClick={() => updateCartQty(idx, -1)} className="p-1 rounded-md border cursor-pointer"><Minus size={12} /></button>
                          <span className="text-xs font-medium w-4 text-center">{item.qty}</span>
                          <button type="button" onClick={() => updateCartQty(idx, 1)} className="p-1 rounded-md border cursor-pointer"><Plus size={12} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    {[
                      { id: 'card', label: 'Kredi Kartı (6–12 Taksit)' },
                      { id: 'transfer', label: 'Havale / EFT (%5 İndirim)' },
                      { id: 'door', label: 'Kapıda Ödeme' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMethod(opt.id as any)}
                        className={cn('w-full text-left p-3.5 rounded-xl border font-medium cursor-pointer', theme.borderClass)}
                        style={paymentMethod === opt.id ? { borderColor: theme.accentHex, backgroundColor: `${theme.accentHex}15` } : { backgroundColor: theme.bgSurface }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-3 gap-2">
                      {[3, 6, 12].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setInstallments(m)}
                          className={cn('p-2.5 rounded-xl text-[11px] font-medium border cursor-pointer', theme.borderClass)}
                          style={installments === m ? { backgroundColor: theme.accentHex, color: theme.accentTextHex, borderColor: theme.accentHex } : undefined}
                        >
                          {m} Taksit<br />{formatMoney(Math.round(cartSubtotal / m))}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2.5 pt-2">
                    <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Ad Soyad" className={cn('w-full p-3 rounded-xl border text-xs bg-transparent', theme.borderClass)} />
                    <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Telefon" className={cn('w-full p-3 rounded-xl border text-xs bg-transparent', theme.borderClass)} />
                    <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} placeholder="Teslimat Adresi" rows={2} className={cn('w-full p-3 rounded-xl border text-xs bg-transparent', theme.borderClass)} />
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
                  <h4 className="text-lg font-semibold">Siparişiniz Alındı</h4>
                  <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                    {theme.brandName} ekibimiz onay ve teslimat planlaması için sizi en kısa sürede arayacaktır.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setCart([]); setCartOpen(false); setCheckoutStep('cart'); }}
                    className="w-full py-3 rounded-full text-xs font-semibold cursor-pointer"
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                  >
                    Alışverişe Devam Et
                  </button>
                </div>
              )}
            </div>

            {cart.length > 0 && checkoutStep !== 'success' && (
              <div className={cn('pt-4 border-t space-y-3', theme.borderClass)}>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Toplam</span>
                  <span style={{ color: theme.accentHex }}>{formatMoney(cartFinalTotal)}</span>
                </div>
                {checkoutStep === 'cart' ? (
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full py-3.5 rounded-full text-xs font-semibold cursor-pointer"
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                  >
                    {t.checkoutBtn} <ChevronRight size={14} className="inline" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('success')}
                    className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Siparişi Onayla ({formatMoney(cartFinalTotal)})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. SUBTLE FLOATING ASSISTANT & WHATSAPP */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {botOpen && (
          <div className={cn('w-[310px] sm:w-[340px] rounded-2xl border shadow-2xl overflow-hidden flex flex-col', theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Bot size={16} /> {theme.botName}
              </div>
              <button type="button" onClick={() => setBotOpen(false)} className="p-1 rounded-full hover:bg-black/15 cursor-pointer">
                <X size={15} />
              </button>
            </div>
            <div className="p-3.5 h-56 overflow-y-auto space-y-2.5 text-xs">
              {botMessages.map((m, i) => (
                <div
                  key={i}
                  className={cn('p-3 rounded-2xl max-w-[85%] leading-relaxed', m.from === 'user' ? 'ml-auto' : 'mr-auto')}
                  style={m.from === 'user' ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : { backgroundColor: theme.bgSurface }}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className={cn('p-2.5 border-t flex gap-2', theme.borderClass)}>
              <input
                value={botInput}
                onChange={(e) => setBotInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBotSend()}
                placeholder="Sorunuzu yazın..."
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-transparent outline-none"
              />
              <button type="button" onClick={() => handleBotSend()} className="p-2 rounded-xl cursor-pointer" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            title="WhatsApp"
          >
            <MessageCircle size={19} />
          </button>
          <button
            type="button"
            onClick={() => setBotOpen(!botOpen)}
            className="w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
            title="Canlı Danışman"
          >
            <Bot size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}
