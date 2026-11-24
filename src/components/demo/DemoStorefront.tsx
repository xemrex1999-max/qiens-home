"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, MessageCircle, ShieldCheck, Truck, Wrench, CreditCard,
  X, Plus, Minus, CheckCircle2, Globe, Bot, Send, Box, Layers, ArrowRight,
  ChevronRight, Phone, MapPin, Menu, Camera, Star, Quote
} from 'lucide-react';
import { DemoThemeConfig, DemoProduct, SHARED_DEMO_PRODUCTS, DEMO_THEME_LIST, STORE_REVIEWS } from '@/data/demoThemes';
import ShowroomRoomPlanner from '@/components/showroom/ShowroomRoomPlanner';
import EuropeExportAndB2B from '@/components/shared/EuropeExportAndB2B';
import { cn } from '@/lib/utils';

type Lang = 'TR' | 'EN' | 'DE';
type StudioTab = '3d' | 'export';

const THEME_PRODUCT_ORDER: Record<string, string[]> = {
  'aura-luxe': ['ayca-yatak', 'imperator-koltuk', 'ayca-yemek', 'buglem-yatak', 'buglem-yemek', 'bohem-koltuk'],
  'nordika': ['bohem-koltuk', 'ayca-yemek', 'ayca-yatak', 'buglem-yemek', 'imperator-koltuk', 'buglem-yatak'],
  'velvet-co': ['imperator-koltuk', 'buglem-yemek', 'buglem-yatak', 'ayca-yemek', 'ayca-yatak', 'bohem-koltuk'],
  'sarayli': ['buglem-yatak', 'ayca-yatak', 'buglem-yemek', 'ayca-yemek', 'imperator-koltuk', 'bohem-koltuk'],
  'modaline': ['bohem-koltuk', 'imperator-koltuk', 'ayca-yatak', 'ayca-yemek', 'buglem-yatak', 'buglem-yemek'],
};

const UI_TEXT: Record<Lang, any> = {
  TR: {
    navCatalog: 'Koleksiyon',
    navShowroom: '3D Stüdyo',
    navReviews: 'Yorumlar',
    navExport: 'Avrupa Teslimat',
    navContact: 'İletişim',
    ctaExplore: 'Koleksiyonu Keşfet',
    cta3D: '3D Oda Stüdyosu',
    allCats: 'Tümü',
    inspect: 'İncele',
    addToCart: 'Sepete Ekle',
    whatsappOrder: 'WhatsApp Sipariş',
    studioKicker: 'İnteraktif Stüdyo',
    studioTitle: 'Eviniz İçin Deneyin',
    studioSub: 'Takımları 360° inceleyin, odanızın fotoğrafında görün veya Avrupa kapı teslim fiyatını hesaplayın.',
    tab3D: '3D Showroom & Özel Ölçü',
    tabAIRoom: 'Odanın Fotoğrafında Gör',
    tabExport: 'Avrupa Teslimat & Bayi',
    modeFull3D: '360° Görünüm',
    modePlanner: '3D Oda Planla & Özel Ölçü',
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
    navReviews: 'Reviews',
    navExport: 'Europe Delivery',
    navContact: 'Contact',
    ctaExplore: 'Explore Collection',
    cta3D: '3D Room Studio',
    allCats: 'All',
    inspect: 'Details',
    addToCart: 'Add to Cart',
    whatsappOrder: 'Order on WhatsApp',
    studioKicker: 'Interactive Studio',
    studioTitle: 'Try For Your Home',
    studioSub: 'Explore sets in 360° 3D, preview inside your room photo, or calculate door-to-door European delivery.',
    tab3D: '3D Showroom & Custom Size',
    tabAIRoom: 'View in Your Room',
    tabExport: 'Europe Delivery & B2B',
    modeFull3D: '360° View',
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
    navReviews: 'Bewertungen',
    navExport: 'Europa-Lieferung',
    navContact: 'Kontakt',
    ctaExplore: 'Kollektion entdecken',
    cta3D: '3D Raumstudio',
    allCats: 'Alle',
    inspect: 'Details',
    addToCart: 'In den Warenkorb',
    whatsappOrder: 'Per WhatsApp',
    studioKicker: 'Interaktives Studio',
    studioTitle: 'Für Ihr Zuhause testen',
    studioSub: 'Entdecken Sie Sets in 360° 3D, testen Sie Ihr Raumfoto oder berechnen Sie die Lieferung nach Europa.',
    tab3D: '3D Showroom & Sondermaß',
    tabAIRoom: 'In Ihrem Raum testen',
    tabExport: 'Europa-Lieferung & B2B',
    modeFull3D: '360° Ansicht',
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

  const orderedProducts = useMemo(() => {
    const order = THEME_PRODUCT_ORDER[theme.slug];
    if (!order) return SHARED_DEMO_PRODUCTS;
    return [...SHARED_DEMO_PRODUCTS].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }, [theme.slug]);

  const [lang, setLang] = useState<Lang>('TR');
  const [activeCat, setActiveCat] = useState<string>('Tümü');
  const [selectedProductModal, setSelectedProductModal] = useState<DemoProduct | null>(null);
  const [modalColor, setModalColor] = useState<string>('Doğal Meşe');

  const [studioTab, setStudioTab] = useState<StudioTab>('3d');
  const [showroomProduct, setShowroomProduct] = useState<DemoProduct>(orderedProducts[0]);
  const [showroomMode, setShowroomMode] = useState<'full3d' | 'planner'>('planner');
  const [showroomColor, setShowroomColor] = useState<string>(orderedProducts[0]?.colors[0]?.name || 'Krem Boucle');
  const [activeReviewIdx, setActiveReviewIdx] = useState<number>(0);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'door'>('card');
  const [installments, setInstallments] = useState<number>(6);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const [botOpen, setBotOpen] = useState(false);
  const [botInput, setBotInput] = useState('');
  const [botMessages, setBotMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = UI_TEXT[lang];

  useEffect(() => {
    setShowroomProduct(orderedProducts[0]);
  }, [orderedProducts]);

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
    if (activeCat === 'Tümü') return orderedProducts;
    return orderedProducts.filter(p => p.category === activeCat);
  }, [activeCat, orderedProducts]);

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
    let reply = `${theme.brandName} koleksiyonumuzda 2 yıl fabrika garantisi, ücretsiz kurulum ve 12 aya varan taksit sunuyoruz.`;
    if (lower.includes('taksit') || lower.includes('ödeme') || lower.includes('fiyat')) {
      reply = 'Tüm kredi kartlarına 6–12 taksit, Havale/EFT ödemelerinde %5 nakit indirim ve kapıda ödeme seçeneklerimiz mevcuttur.';
    } else if (lower.includes('avrupa') || lower.includes('almanya') || lower.includes('kargo')) {
      reply = 'Türkiye’nin 81 iline ücretsiz nakliye ve kurulum yapıyoruz. Almanya, Hollanda, Belçika, Fransa ve tüm Avrupa’ya gümrük dahil kapı teslim sevkiyatımız vardır.';
    } else if (lower.includes('ölçü') || lower.includes('renk') || lower.includes('kumaş')) {
      reply = '40+ kolay silinebilir kumaş ve ahşap renk seçeneğimiz vardır; odanızın ölçüsüne göre özel üretim yapıyoruz.';
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
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  return (
    <div
      className="min-h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: theme.bgPage, color: theme.textPrimary }}
    >
      {/* 0. SUBTLE TOP DEMO SWITCHER */}
      <div className="w-full bg-[#0b0b0e] text-neutral-400 text-[11px] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-9 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href="/ajans" className="text-neutral-200 hover:text-white font-medium whitespace-nowrap">
              ← Ajans
            </Link>
            <Link href="/vitrin" className="hover:text-white whitespace-nowrap">
              Vitrin
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

      {/* ===================================================================== */}
      {/* 1. FIVE COMPLETELY DISTINCT HEADERS                                   */}
      {/* ===================================================================== */}

      {/* HEADER 1: AURA LUXE — Centered Luxury Monogram Split Nav */}
      {theme.slug === 'aura-luxe' && (
        <header className="sticky top-0 z-40 bg-[#111114]/92 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[76px] grid grid-cols-3 items-center">
            <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.18em] text-neutral-300">
              <a href="#catalog" className="hover:text-white transition-colors">{t.navCatalog}</a>
              <button type="button" onClick={() => jumpToStudio('3d')} className="hover:text-white cursor-pointer">{t.navShowroom}</button>
              <a href="#reviews" className="hover:text-white transition-colors">{t.navReviews}</a>
            </nav>
            <div className="md:hidden">
              <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 border border-white/15">
                <Menu size={18} />
              </button>
            </div>
            <a href="#hero" className="text-center">
              <div className="text-lg sm:text-xl font-serif tracking-[0.28em] text-white">{theme.brandName}</div>
              <div className="text-[9px] uppercase tracking-[0.35em] mt-0.5" style={{ color: theme.accentHex }}>ATELIER İNEGÖL</div>
            </a>
            <div className="flex items-center justify-end gap-4">
              <button type="button" onClick={() => jumpToStudio('export')} className="hidden md:inline text-xs uppercase tracking-[0.18em] text-neutral-300 hover:text-white cursor-pointer">
                {t.navExport}
              </button>
              <div className="hidden sm:flex items-center gap-1 text-[10px] tracking-widest">
                {(['TR', 'EN', 'DE'] as Lang[]).map(c => (
                  <button key={c} type="button" onClick={() => setLang(c)} className={cn('px-1.5 py-0.5 cursor-pointer', lang === c ? 'text-white font-semibold underline' : 'text-neutral-500')}>
                    {c}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => { setCheckoutStep('cart'); setCartOpen(true); }} className="relative p-2 border border-white/15 hover:border-white/40 cursor-pointer">
                <ShoppingBag size={15} />
                {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>{cartCount}</span>}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* HEADER 2: NORDİKA — Airy Scandinavian Clean Left Logo + Pill Cart */}
      {theme.slug === 'nordika' && (
        <header className="sticky top-0 z-40 bg-[#f8f7f4]/95 backdrop-blur-md border-b border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between gap-6">
            <a href="#hero" className="text-xl font-semibold tracking-tight text-[#1d1c1a]">
              {theme.brandName.toLowerCase()}<span style={{ color: theme.accentHex }}>.</span>
            </a>
            <nav className="hidden md:flex items-center gap-2 bg-[#efede7] px-2 py-1.5 rounded-full text-xs font-medium text-[#54514b]">
              <a href="#catalog" className="px-4 py-1.5 rounded-full hover:bg-white transition-colors">{t.navCatalog}</a>
              <button type="button" onClick={() => jumpToStudio('3d')} className="px-4 py-1.5 rounded-full hover:bg-white transition-colors cursor-pointer">{t.navShowroom}</button>
              <a href="#reviews" className="px-4 py-1.5 rounded-full hover:bg-white transition-colors">{t.navReviews}</a>
              <button type="button" onClick={() => jumpToStudio('export')} className="px-4 py-1.5 rounded-full hover:bg-white transition-colors cursor-pointer">{t.navExport}</button>
            </nav>
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center text-[11px] font-medium text-stone-500 gap-1">
                {(['TR', 'EN', 'DE'] as Lang[]).map(c => (
                  <button key={c} type="button" onClick={() => setLang(c)} className={cn('px-2 py-1 rounded-full cursor-pointer', lang === c ? 'bg-stone-200 text-stone-900' : '')}>{c}</button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => { setCheckoutStep('cart'); setCartOpen(true); }}
                className="px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
              >
                <ShoppingBag size={14} /> <span>Sepet ({cartCount})</span>
              </button>
              <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-full border border-stone-300">
                <Menu size={17} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* HEADER 3: VELVET & CO. — Deep Emerald Editorial Boutique Header */}
      {theme.slug === 'velvet-co' && (
        <header className="sticky top-0 z-40 bg-[#101d18]/94 backdrop-blur-md border-b border-emerald-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[74px] flex items-center justify-between gap-4">
            <a href="#hero" className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border flex items-center justify-center font-serif italic text-sm" style={{ borderColor: theme.accentHex, color: theme.accentHex }}>
                {theme.brandName.charAt(0)}
              </span>
              <span className="text-lg font-serif italic tracking-wide text-[#f4f1ea]">{theme.brandName}</span>
            </a>
            <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.14em] uppercase text-[#a2b5ac]">
              <a href="#catalog" className="hover:text-[#d5be87] transition-colors">{t.navCatalog}</a>
              <button type="button" onClick={() => jumpToStudio('3d')} className="hover:text-[#d5be87] cursor-pointer">{t.navShowroom}</button>
              <a href="#reviews" className="hover:text-[#d5be87] transition-colors">{t.navReviews}</a>
              <button type="button" onClick={() => jumpToStudio('export')} className="hover:text-[#d5be87] cursor-pointer">{t.navExport}</button>
            </nav>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#a2b5ac]">
                {(['TR', 'EN', 'DE'] as Lang[]).map(c => (
                  <button key={c} type="button" onClick={() => setLang(c)} className={cn('px-1.5 cursor-pointer', lang === c ? 'text-[#d5be87] font-semibold' : '')}>{c}</button>
                ))}
              </div>
              <button type="button" onClick={() => { setCheckoutStep('cart'); setCartOpen(true); }} className="relative p-2.5 rounded-full border border-emerald-800/70 hover:border-[#d5be87] cursor-pointer">
                <ShoppingBag size={15} />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>{cartCount}</span>}
              </button>
              <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-full border border-emerald-800/70">
                <Menu size={17} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* HEADER 4: SARAYLI HOME — Classic 2-Tier Ivory Showroom Header */}
      {theme.slug === 'sarayli' && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
          <div className="bg-[#f2ede4] text-[#6d5c42] text-center py-1.5 px-4 text-[11px] font-medium tracking-wide border-b border-stone-200/70">
            Türkiye Geneli Ücretsiz Kurulum • 12 Aya Varan Taksit • Avrupa Kapı Teslim
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
            <a href="#hero" className="text-lg sm:text-xl font-serif font-medium tracking-[0.16em] text-[#241e18]">
              {theme.brandName}
            </a>
            <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#695f54]">
              <a href="#catalog" className="hover:text-[#9f7a34] transition-colors">{t.navCatalog}</a>
              <button type="button" onClick={() => jumpToStudio('3d')} className="hover:text-[#9f7a34] cursor-pointer">{t.navShowroom}</button>
              <a href="#reviews" className="hover:text-[#9f7a34] transition-colors">{t.navReviews}</a>
              <button type="button" onClick={() => jumpToStudio('export')} className="hover:text-[#9f7a34] cursor-pointer">{t.navExport}</button>
              <a href="#footer" className="hover:text-[#9f7a34] transition-colors">{t.navContact}</a>
            </nav>
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-stone-500">
                {(['TR', 'EN', 'DE'] as Lang[]).map(c => (
                  <button key={c} type="button" onClick={() => setLang(c)} className={cn('px-1.5 py-0.5 rounded cursor-pointer', lang === c ? 'bg-[#f2ede4] text-[#9f7a34] font-semibold' : '')}>{c}</button>
                ))}
              </div>
              <button type="button" onClick={() => { setCheckoutStep('cart'); setCartOpen(true); }} className="relative px-3.5 py-2 rounded-lg border border-stone-200 hover:border-[#9f7a34] text-xs font-medium flex items-center gap-2 cursor-pointer">
                <ShoppingBag size={14} style={{ color: theme.accentHex }} />
                <span>{cartCount}</span>
              </button>
              <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg border border-stone-200">
                <Menu size={17} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* HEADER 5: MODA LİNE — Floating White Pill Navbar */}
      {theme.slug === 'modaline' && (
        <div className="sticky top-2 z-40 px-3 sm:px-6 pt-2">
          <header className="max-w-6xl mx-auto rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-sm px-5 sm:px-7 h-14 flex items-center justify-between gap-4">
            <a href="#hero" className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.accentHex }} />
              <span className="text-sm sm:text-base font-bold tracking-tight text-[#291f1a]">{theme.brandName}</span>
            </a>
            <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#6e5c52]">
              <a href="#catalog" className="hover:text-[#b5583a] transition-colors">{t.navCatalog}</a>
              <button type="button" onClick={() => jumpToStudio('3d')} className="hover:text-[#b5583a] cursor-pointer">{t.navShowroom}</button>
              <a href="#reviews" className="hover:text-[#b5583a] transition-colors">{t.navReviews}</a>
              <button type="button" onClick={() => jumpToStudio('export')} className="hover:text-[#b5583a] cursor-pointer">{t.navExport}</button>
            </nav>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center text-[11px] gap-1 text-stone-500">
                {(['TR', 'EN', 'DE'] as Lang[]).map(c => (
                  <button key={c} type="button" onClick={() => setLang(c)} className={cn('px-1.5 py-0.5 rounded-full cursor-pointer', lang === c ? 'bg-[#f2e8dd] text-[#b5583a] font-semibold' : '')}>{c}</button>
                ))}
              </div>
              <button type="button" onClick={() => { setCheckoutStep('cart'); setCartOpen(true); }} className="relative p-2 rounded-full text-white cursor-pointer" style={{ backgroundColor: theme.accentHex }}>
                <ShoppingBag size={14} />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#291f1a] text-white text-[9px] font-bold flex items-center justify-center">{cartCount}</span>}
              </button>
              <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 rounded-full border border-stone-200">
                <Menu size={16} />
              </button>
            </div>
          </header>
        </div>
      )}

      {mobileMenuOpen && (
        <div className={cn('md:hidden px-6 py-4 border-b flex flex-col gap-3 text-sm font-medium', theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
          <a href="#catalog" onClick={() => setMobileMenuOpen(false)}>{t.navCatalog}</a>
          <button type="button" onClick={() => { setMobileMenuOpen(false); jumpToStudio('3d'); }} className="text-left">{t.navShowroom}</button>
          <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>{t.navReviews}</a>
          <button type="button" onClick={() => { setMobileMenuOpen(false); jumpToStudio('export'); }} className="text-left">{t.navExport}</button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. FIVE DISTINCT HERO BANNERS                                         */}
      {/* ===================================================================== */}

      {theme.slug === 'aura-luxe' && (
        <section id="hero" className="relative min-h-[76vh] flex items-end">
          <img src={theme.heroImage} alt={theme.brandName} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-[#111114]/45 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pb-16 pt-28 w-full flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl space-y-4">
              <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: theme.accentHex }}>Koleksiyon 2026</p>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-normal leading-[1.1] text-white">
                {theme.heroTitle}
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">{theme.heroSubtitle}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#catalog" className="px-7 py-3.5 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
                {t.ctaExplore}
              </a>
              <button type="button" onClick={() => jumpToStudio('3d')} className="px-7 py-3.5 border border-white/30 text-white text-xs font-semibold uppercase tracking-widest hover:bg-white/10 cursor-pointer">
                {t.cta3D}
              </button>
            </div>
          </div>
        </section>
      )}

      {theme.slug === 'nordika' && (
        <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
          <div className="bg-[#efede7] rounded-[36px] p-7 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white text-[11px] font-medium" style={{ color: theme.accentHex }}>
                İskandinav Doğal Koleksiyon
              </span>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-[#1d1c1a]">
                {theme.heroTitle}
              </h1>
              <p className="text-sm sm:text-base leading-relaxed text-[#625e57]">{theme.heroSubtitle}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#catalog" className="px-7 py-3.5 rounded-full text-xs font-medium flex items-center gap-2" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
                  {t.ctaExplore} <ArrowRight size={14} />
                </a>
                <button type="button" onClick={() => jumpToStudio('3d')} className="px-7 py-3.5 rounded-full bg-white text-[#1d1c1a] text-xs font-medium cursor-pointer hover:opacity-80">
                  {t.cta3D}
                </button>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="aspect-[16/10] rounded-[28px] overflow-hidden">
                <img src={theme.heroImage} alt={theme.brandName} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      )}

      {theme.slug === 'velvet-co' && (
        <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-px" style={{ backgroundColor: theme.accentHex }} />
              <span className="text-[11px] uppercase tracking-[0.28em]" style={{ color: theme.accentHex }}>Editoryal Seçki</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-normal italic leading-[1.12]">
              {theme.heroTitle}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: theme.textMuted }}>{theme.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#catalog" className="px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
                {t.ctaExplore}
              </a>
              <button type="button" onClick={() => jumpToStudio('3d')} className="px-7 py-3.5 rounded-full border text-xs font-semibold uppercase tracking-widest cursor-pointer" style={{ borderColor: `${theme.accentHex}66`, color: theme.accentHex }}>
                {t.cta3D}
              </button>
            </div>
          </div>
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md aspect-[4/5] rounded-t-full overflow-hidden border p-2.5" style={{ borderColor: `${theme.accentHex}44` }}>
              <img src={theme.heroImage} alt={theme.brandName} className="w-full h-full object-cover rounded-t-full" />
            </div>
          </div>
        </section>
      )}

      {theme.slug === 'sarayli' && (
        <section id="hero" className="py-14 sm:py-20 px-4 sm:px-8 border-b border-stone-200 bg-gradient-to-b from-[#f3eee5] to-[#faf8f4]">
          <div className="max-w-5xl mx-auto text-center space-y-5">
            <p className="text-xs uppercase tracking-[0.28em] font-medium" style={{ color: theme.accentHex }}>
              2026 Düğün &amp; Ev Koleksiyonu
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif font-medium leading-[1.15] max-w-3xl mx-auto text-[#241e18]">
              {theme.heroTitle}
            </h1>
            <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed text-[#72685d]">{theme.heroSubtitle}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6 text-left">
              {[
                { title: 'Yatak Odası', sub: '6 Kapaklı & Bazalı', img: '/images/yatak_odasi.png', cat: 'Yatak Odası' },
                { title: 'Yemek Odası', sub: 'Açılır Masa & Konsol', img: '/images/yemek_odasi.png', cat: 'Yemek Odası' },
                { title: 'Koltuk Takımı', sub: 'Silinebilir İthal Kumaş', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80', cat: 'Koltuk Takımı' },
              ].map((c) => (
                <a
                  key={c.title}
                  href="#catalog"
                  onClick={() => setActiveCat(c.cat)}
                  className="group bg-white p-2 rounded-xl border border-stone-200 hover:border-[#9f7a34] transition-all shadow-xs"
                >
                  <div className="aspect-[16/10] rounded-lg overflow-hidden">
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3 text-center">
                    <div className="text-sm font-serif font-medium text-[#241e18]">{c.title}</div>
                    <div className="text-[11px] text-[#8a7f72] mt-0.5">{c.sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {theme.slug === 'modaline' && (
        <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#f2e8dd] text-xs font-semibold" style={{ color: theme.accentHex }}>
              Yeni Sezon Lookbook
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-[#291f1a]">
              {theme.heroTitle}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-[#756258]">{theme.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#catalog" className="px-7 py-3.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: theme.accentHex }}>
                {t.ctaExplore}
              </a>
              <button type="button" onClick={() => jumpToStudio('3d')} className="px-7 py-3.5 rounded-full bg-[#f2e8dd] text-[#291f1a] text-xs font-semibold cursor-pointer">
                {t.cta3D}
              </button>
            </div>
          </div>
          <div className="lg:col-span-7 relative h-[360px] sm:h-[440px] rounded-[36px] overflow-hidden border border-stone-200 bg-[#f2e8dd]">
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
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-white/92 backdrop-blur-md px-5 py-3 rounded-full text-xs shadow-sm">
              <span className="font-semibold text-[#291f1a]">{getProductName(showroomProduct)}</span>
              <span className="font-bold" style={{ color: theme.accentHex }}>{formatMoney(showroomProduct.price)}</span>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 3. FIVE COMPLETELY DIFFERENT PRODUCT CARD ARCHITECTURES               */}
      {/* ===================================================================== */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6" style={{ borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.22em]" style={{ color: theme.accentHex }}>Koleksiyon</p>
            <h2 className={cn('text-2xl sm:text-3xl font-medium tracking-tight', theme.fontStyle === 'serif' && 'font-serif')}>
              Seçkin Mobilya Takımları
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
                    'px-4 py-2 text-xs font-medium transition-all cursor-pointer border',
                    theme.slug === 'aura-luxe' ? 'rounded-none' : 'rounded-full',
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

        {/* CARD ARCHITECTURE 1: AURA LUXE — Tall Full-Bleed Dark Editorial Poster Cards */}
        {theme.slug === 'aura-luxe' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <article
                key={p.id}
                onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                className="group relative aspect-[3/4] overflow-hidden cursor-pointer border border-white/10 hover:border-[#cbb07a]/60 transition-colors bg-[#18181c]"
              >
                <img src={p.image} alt={getProductName(p)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-[#0d0d10]/30 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-white/85">
                  <span>{p.category}</span>
                  <span className="flex items-center gap-1"><Star size={10} className="fill-[#cbb07a] text-[#cbb07a]" /> {p.rating.toFixed(1)}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 space-y-3">
                  <div className="w-8 h-px" style={{ backgroundColor: theme.accentHex }} />
                  <h3 className="text-xl font-serif font-normal text-white leading-snug">{getProductName(p)}</h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-base font-medium" style={{ color: theme.accentHex }}>{formatMoney(p.price)}</span>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => jumpToStudio('3d', p)} className="p-2 border border-white/25 text-white hover:border-[#cbb07a] cursor-pointer" title="3D">
                        <Box size={13} />
                      </button>
                      <button type="button" onClick={() => addToCart(p, p.colors[0].name)} className="px-3.5 py-2 text-[11px] uppercase tracking-wider font-semibold cursor-pointer" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
                        {t.addToCart}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CARD ARCHITECTURE 2: NORDİKA — Borderless Scandinavian Floating Photo Tiles */}
        {theme.slug === 'nordika' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
            {filteredProducts.map((p) => (
              <article key={p.id} className="group flex flex-col">
                <div
                  onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                  className="relative aspect-[4/3] rounded-[28px] overflow-hidden bg-[#efede7] cursor-pointer mb-4"
                >
                  <img src={p.image} alt={getProductName(p)} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); addToCart(p, p.colors[0].name); }}
                    className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-white text-[#2f453b] hover:bg-[#2f453b] hover:text-white shadow-md flex items-center justify-center transition-colors cursor-pointer"
                    title="Sepete Ekle"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="px-1 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                      className="text-base font-semibold text-[#1d1c1a] leading-snug cursor-pointer hover:underline"
                    >
                      {getProductName(p)}
                    </h3>
                    <span className="text-base font-semibold text-[#2f453b] flex-shrink-0">{formatMoney(p.price)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      {p.colors.slice(0, 4).map(c => (
                        <span key={c.name} title={c.name} className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }} />
                      ))}
                      <span className="text-[11px] text-stone-500 ml-1 flex items-center gap-0.5">
                        <Star size={11} className="fill-amber-400 text-amber-400" /> {p.rating.toFixed(1)}
                      </span>
                    </div>
                    <button type="button" onClick={() => jumpToStudio('3d', p)} className="text-xs font-medium text-[#2f453b] hover:underline cursor-pointer">
                      3D İncele →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CARD ARCHITECTURE 3: VELVET & CO. — Horizontal Architectural Split Cards */}
        {theme.slug === 'velvet-co' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {filteredProducts.map((p) => (
              <article
                key={p.id}
                className="group grid grid-cols-1 sm:grid-cols-12 border border-emerald-800/50 hover:border-[#d5be87]/60 rounded-2xl overflow-hidden bg-[#162620] transition-colors"
              >
                <div
                  onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                  className="sm:col-span-5 relative aspect-[4/3] sm:aspect-auto sm:min-h-[240px] cursor-pointer overflow-hidden"
                >
                  <img src={p.image} alt={getProductName(p)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="sm:col-span-7 p-6 flex flex-col justify-between gap-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-[#a2b5ac]">
                      <span className="uppercase tracking-[0.18em]" style={{ color: theme.accentHex }}>{p.category}</span>
                      <span className="flex items-center gap-1"><Star size={11} className="fill-[#d5be87] text-[#d5be87]" /> {p.rating.toFixed(1)} ({p.reviewCount})</span>
                    </div>
                    <h3
                      onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                      className="text-xl font-serif text-[#f4f1ea] cursor-pointer hover:text-[#d5be87] transition-colors"
                    >
                      {getProductName(p)}
                    </h3>
                    <p className="text-xs text-[#a2b5ac] leading-relaxed line-clamp-2">{p.description}</p>
                    <div className="text-[11px] text-emerald-200/75 pt-1">
                      {p.dimensions[0]?.piece}: <span className="text-[#d5be87]">{p.dimensions[0]?.size}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-emerald-800/50 flex items-center justify-between gap-3">
                    <span className="text-lg font-serif font-medium text-[#d5be87]">{formatMoney(p.price)}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => jumpToStudio('3d', p)} className="px-3 py-1.5 rounded-full border border-emerald-700/70 text-[11px] text-[#f4f1ea] hover:border-[#d5be87] cursor-pointer">
                        3D
                      </button>
                      <button type="button" onClick={() => addToCart(p, p.colors[0].name)} className="px-4 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
                        {t.addToCart}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CARD ARCHITECTURE 4: SARAYLI HOME — Classic Double-Bordered Centered Cream Cards */}
        {theme.slug === 'sarayli' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((p) => (
              <article key={p.id} className="group bg-white p-2.5 rounded-xl border border-stone-200 hover:border-[#9f7a34] transition-all flex flex-col">
                <div className="border border-stone-100 rounded-lg overflow-hidden flex flex-col flex-1 justify-between">
                  <div>
                    <div
                      onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                      className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-[#f2ede4]"
                    >
                      <img src={p.image} alt={getProductName(p)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-5 text-center space-y-2">
                      <div className="flex items-center justify-center gap-0.5 text-amber-500">
                        {[0, 1, 2, 3, 4].map(i => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
                        <span className="text-[11px] text-stone-500 ml-1">({p.reviewCount})</span>
                      </div>
                      <h3
                        onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                        className="text-lg font-serif font-medium text-[#241e18] cursor-pointer hover:text-[#9f7a34] min-h-[2.75rem] line-clamp-2"
                      >
                        {getProductName(p)}
                      </h3>
                      <div className="pt-1">
                        <div className="text-lg font-semibold text-[#241e18]">{formatMoney(p.price)}</div>
                        <div className="text-[11px] text-[#9f7a34] font-medium mt-0.5">
                          12 × {formatMoney(Math.round(p.price / 12))} / ay
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 border-t border-stone-100 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                      className="py-3 text-[#6d6256] hover:bg-[#faf8f4] border-r border-stone-100 cursor-pointer"
                    >
                      Detay &amp; Ölçü
                    </button>
                    <button
                      type="button"
                      onClick={() => addToCart(p, p.colors[0].name)}
                      className="py-3 hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: '#f2ede4', color: '#241e18' }}
                    >
                      {t.addToCart}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CARD ARCHITECTURE 5: MODA LİNE — Asymmetric Modern Lookbook Cards with Floating Price Pill */}
        {theme.slug === 'modaline' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((p) => (
              <article
                key={p.id}
                className="group bg-white rounded-tl-[32px] rounded-br-[32px] rounded-tr-xl rounded-bl-xl border border-stone-200/90 hover:border-[#b5583a]/60 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                    className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-[#f2e8dd]"
                  >
                    <img src={p.image} alt={getProductName(p)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#291f1a] shadow-sm">
                      {formatMoney(p.price)}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#291f1a]/75 text-white text-[10px] font-medium flex items-center gap-1">
                      <Star size={10} className="fill-amber-400 text-amber-400" /> {p.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-[11px] font-medium" style={{ color: theme.accentHex }}>{p.category}</div>
                    <h3
                      onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                      className="text-base font-bold text-[#291f1a] leading-snug cursor-pointer hover:opacity-75 min-h-[2.5rem] line-clamp-2"
                    >
                      {getProductName(p)}
                    </h3>
                    <div className="flex items-center gap-1.5 pt-1">
                      {p.colors.slice(0, 4).map(c => (
                        <span key={c.name} title={c.name} className="w-3 h-3 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addToCart(p, p.colors[0].name)}
                    className="flex-1 py-2.5 rounded-full text-xs font-semibold text-white cursor-pointer"
                    style={{ backgroundColor: theme.accentHex }}
                  >
                    {t.addToCart}
                  </button>
                  <button
                    type="button"
                    onClick={() => jumpToStudio('3d', p)}
                    className="px-3.5 py-2.5 rounded-full bg-[#f2e8dd] text-[#291f1a] text-xs font-semibold cursor-pointer"
                  >
                    3D
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ===================================================================== */}
      {/* 4. FIVE COMPLETELY DIFFERENT REVIEW SECTIONS                          */}
      {/* ===================================================================== */}

      {/* REVIEWS 1: AURA LUXE — Single Editorial Quote Spotlight */}
      {theme.slug === 'aura-luxe' && (
        <section id="reviews" className="border-t border-white/10 py-16 sm:py-24 px-4 sm:px-8 bg-[#151519]">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Quote size={28} className="mx-auto opacity-45" style={{ color: theme.accentHex }} />
            <p className="text-xl sm:text-2xl font-serif italic leading-relaxed text-white">
              &ldquo;{STORE_REVIEWS[activeReviewIdx].comment}&rdquo;
            </p>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: theme.accentHex }}>
                {STORE_REVIEWS[activeReviewIdx].author} — {STORE_REVIEWS[activeReviewIdx].city}
              </div>
              <div className="text-[11px] text-neutral-400">Onaylı Teslimat • 4.9 / 5.0 (240+ Müşteri)</div>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              {STORE_REVIEWS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveReviewIdx(idx)}
                  className="h-1.5 transition-all cursor-pointer"
                  style={{
                    width: activeReviewIdx === idx ? '28px' : '10px',
                    backgroundColor: activeReviewIdx === idx ? theme.accentHex : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REVIEWS 2: NORDİKA — 2-Column Airy Soft Cards with Sage Avatars */}
      {theme.slug === 'nordika' && (
        <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-8 py-14 space-y-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium" style={{ color: theme.accentHex }}>Mutlu Evler • 4.9 ★</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1c1a] mt-1">Müşterilerimiz Ne Diyor?</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STORE_REVIEWS.map((rev, idx) => (
              <div key={idx} className="bg-white rounded-[28px] p-7 space-y-4 shadow-xs border border-stone-200/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#efede7] text-[#2f453b] font-semibold text-xs flex items-center justify-center">
                    {rev.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#1d1c1a]">{rev.author}</div>
                    <div className="text-xs text-stone-500">{rev.city} • {rev.date}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5 text-amber-400">
                    {[0, 1, 2, 3, 4].map(s => <Star key={s} size={12} className="fill-amber-400" />)}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#4b4842]">{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* REVIEWS 3: VELVET & CO. — Border-Left Brass Architectural Columns */}
      {theme.slug === 'velvet-co' && (
        <section id="reviews" className="border-t border-emerald-900/60 py-16 px-4 sm:px-8 bg-[#12221c]">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-serif italic text-[#f4f1ea]">Atölye &amp; Teslimat Notları</h2>
              <span className="text-xs tracking-widest uppercase" style={{ color: theme.accentHex }}>4.9 / 5.0 Puan</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STORE_REVIEWS.slice(0, 3).map((rev, idx) => (
                <div key={idx} className="border-l pl-6 space-y-4" style={{ borderColor: `${theme.accentHex}66` }}>
                  <p className="text-sm font-serif italic leading-relaxed text-[#eae6dc]">&ldquo;{rev.comment}&rdquo;</p>
                  <div className="text-xs text-[#a2b5ac]">
                    <span className="text-[#d5be87] font-medium">{rev.author}</span> — {rev.city}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REVIEWS 4: SARAYLI HOME — Classic Trust Score Card + 3 Warm Ivory Cards */}
      {theme.slug === 'sarayli' && (
        <section id="reviews" className="border-t border-stone-200 py-16 px-4 sm:px-8 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-3 rounded-xl p-6 bg-[#f2ede4] border border-stone-200 flex flex-col justify-center text-center space-y-2">
              <div className="text-4xl font-serif font-medium text-[#241e18]">4.9</div>
              <div className="flex justify-center gap-1 text-amber-500">
                {[0, 1, 2, 3, 4].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <div className="text-xs font-medium text-[#6d6256]">240+ Onaylı Teslimat</div>
              <div className="text-[11px] text-[#9f7a34]">Türkiye &amp; Avrupa</div>
            </div>
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-5">
              {STORE_REVIEWS.slice(0, 3).map((rev, idx) => (
                <div key={idx} className="rounded-xl p-5 bg-[#faf8f4] border border-stone-200/80 flex flex-col justify-between gap-4">
                  <p className="text-xs leading-relaxed text-[#3a322a]">&ldquo;{rev.comment}&rdquo;</p>
                  <div className="pt-3 border-t border-stone-200/70 text-[11px]">
                    <div className="font-semibold text-[#241e18]">{rev.author}</div>
                    <div className="text-[#8a7f72]">{rev.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REVIEWS 5: MODA LİNE — Modern Compact Social Chips */}
      {theme.slug === 'modaline' && (
        <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-8 py-14 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-semibold" style={{ color: theme.accentHex }}>Onaylı Müşteri Deneyimleri</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#291f1a]">Evine Moda Line Seçenler</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STORE_REVIEWS.map((rev, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map(s => <Star key={s} size={11} style={{ color: theme.accentHex, fill: theme.accentHex }} />)}
                  </div>
                  <CheckCircle2 size={13} className="text-emerald-600" />
                </div>
                <p className="text-xs leading-relaxed text-[#4f4038]">{rev.comment}</p>
                <div className="text-[11px] font-semibold text-[#291f1a]">{rev.author} <span className="font-normal text-stone-400">• {rev.city}</span></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 5. SINGLE CALM TABBED STUDIO                                          */}
      {/* ===================================================================== */}
      <section id="studio" className={cn('border-t py-14 sm:py-20', theme.borderClass)} style={{ backgroundColor: theme.bgSurface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: theme.accentHex }}>{t.studioKicker}</p>
              <h2 className={cn('text-2xl sm:text-3xl font-medium tracking-tight', theme.fontStyle === 'serif' && 'font-serif')}>
                {t.studioTitle}
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textMuted }}>{t.studioSub}</p>
            </div>

            <div className={cn('inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl border', theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
              {[
                { id: '3d' as StudioTab, label: t.tab3D, icon: <Box size={14} /> },
                { id: 'export' as StudioTab, label: t.tabExport, icon: <Globe size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStudioTab(tab.id)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
                  style={studioTab === tab.id ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : { color: theme.textMuted }}
                >
                  {tab.icon}<span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {studioTab === '3d' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {SHARED_DEMO_PRODUCTS.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setShowroomProduct(p); setShowroomColor(p.colors[0].name); }}
                      className={cn('px-4 py-2 rounded-full text-xs font-medium border cursor-pointer', theme.borderClass)}
                      style={showroomProduct.id === p.id ? { backgroundColor: theme.accentHex, color: theme.accentTextHex, borderColor: theme.accentHex } : { backgroundColor: theme.bgCard }}
                    >
                      {p.category}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowroomMode('full3d')} className={cn('px-3.5 py-2 rounded-full text-xs font-medium border cursor-pointer', theme.borderClass)} style={showroomMode === 'full3d' ? { backgroundColor: theme.bgCard, borderColor: theme.accentHex } : { opacity: 0.7 }}>
                    {t.modeFull3D}
                  </button>
                  <button type="button" onClick={() => setShowroomMode('planner')} className={cn('px-3.5 py-2 rounded-full text-xs font-medium border cursor-pointer flex items-center gap-1.5', theme.borderClass)} style={showroomMode === 'planner' ? { backgroundColor: theme.accentHex, color: theme.accentTextHex, borderColor: theme.accentHex } : { backgroundColor: theme.bgCard }}>
                    <Layers size={13} /> {t.modePlanner}
                  </button>
                </div>
              </div>

              {showroomMode === 'full3d' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <div className={cn('lg:col-span-8 relative h-[380px] sm:h-[450px] rounded-2xl border overflow-hidden', theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
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
                    <button type="button" onClick={() => setShowroomMode('planner')} className="absolute bottom-4 right-4 px-4 py-2.5 rounded-full text-xs font-medium shadow-md cursor-pointer flex items-center gap-1.5" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
                      <Layers size={14} /> Odada Yerleştir &amp; Özel Ölçü
                    </button>
                  </div>

                  <div className={cn('lg:col-span-4 rounded-2xl border p-6 flex flex-col justify-between gap-6', theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
                    <div className="space-y-4">
                      <span className="text-[11px] uppercase tracking-widest" style={{ color: theme.accentHex }}>{showroomProduct.category}</span>
                      <h3 className={cn('text-2xl font-medium', theme.fontStyle === 'serif' && 'font-serif')}>{getProductName(showroomProduct)}</h3>
                      <div className="text-xl font-semibold" style={{ color: theme.isDark ? theme.accentHex : theme.textPrimary }}>{formatMoney(showroomProduct.price)}</div>
                      <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>{showroomProduct.description}</p>
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
                      <button type="button" onClick={() => addToCart(showroomProduct, showroomColor)} className="w-full py-3 rounded-full text-xs font-semibold cursor-pointer" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>{t.addToCart}</button>
                      <button type="button" onClick={() => openWhatsApp(showroomProduct, showroomColor)} className={cn('w-full py-3 rounded-full border text-xs font-semibold cursor-pointer', theme.borderClass)}>{t.whatsappOrder}</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-white">
                  <ShowroomRoomPlanner
                    selectedProduct={{ ...showroomProduct, threeDModelUrl: showroomProduct.fullRoomModelUrl }}
                    selectedColor={showroomColor}
                    onChangeColor={(c) => setShowroomColor(c)}
                    onInspect3D={() => setShowroomMode('full3d')}
                    brandName={theme.brandName}
                  />
                </div>
              )}
            </div>
          )}

          {studioTab === 'export' && (
            <div className="-mx-4 sm:-mx-8 -my-8">
              <EuropeExportAndB2B brandName={theme.brandName} accentHex={theme.accentHex} isDark={theme.isDark} whatsappPhone={theme.whatsappPhone} />
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. FIVE DISTINCT FOOTERS                                              */}
      {/* ===================================================================== */}

      {theme.slug === 'aura-luxe' && (
        <footer id="footer" className="border-t border-white/10 bg-[#0b0b0e] py-14 px-4 sm:px-8 text-xs text-neutral-400">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-2">
              <div className="text-2xl font-serif tracking-[0.28em] text-white">{theme.brandName}</div>
              <p className="max-w-sm">İnegöl’den 28 ülkeye lüks el işçiliği mobilya ve özel proje çözümleri.</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div><div className="text-white font-medium mb-1">Showroom</div>Mahmudiye Mah. İnegöl, Bursa</div>
              <div><div className="text-white font-medium mb-1">VIP Hat</div>+90 507 756 78 87</div>
              <div><div className="text-white font-medium mb-1">Güvence</div>2 Yıl Garanti • 12 Taksit</div>
            </div>
          </div>
        </footer>
      )}

      {theme.slug === 'nordika' && (
        <footer id="footer" className="bg-[#e9e6de] rounded-t-[40px] mt-10 py-14 px-4 sm:px-8 text-xs text-[#59554e]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-2">
              <div className="text-xl font-semibold text-[#1d1c1a]">{theme.brandName.toLowerCase()}<span style={{ color: theme.accentHex }}>.</span></div>
              <p className="max-w-sm leading-relaxed">Doğal ahşap, sade çizgiler ve sürdürülebilir İnegöl işçiliği ile ferah yaşam alanları.</p>
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-[#1d1c1a]">Hizmetler</div>
              <div>Ücretsiz Nakliye &amp; Kurulum</div>
              <div>Avrupa Kapı Teslimat</div>
              <div>2 Yıl Üretici Garantisi</div>
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-[#1d1c1a]">İletişim</div>
              <div>İnegöl / Bursa</div>
              <div>+90 507 756 78 87</div>
            </div>
          </div>
        </footer>
      )}

      {theme.slug === 'velvet-co' && (
        <footer id="footer" className="border-t border-emerald-900/60 bg-[#0b1511] py-14 px-4 sm:px-8 text-center text-xs text-[#9cb0a7] space-y-4">
          <div className="text-2xl font-serif italic text-[#f4f1ea]">{theme.brandName}</div>
          <div className="w-12 h-px mx-auto" style={{ backgroundColor: theme.accentHex }} />
          <p className="max-w-md mx-auto">İnegöl Mobilya Atölyesi • Mahmudiye Mah. Bursa • +90 507 756 78 87 • TR / EN / DE İhracat</p>
        </footer>
      )}

      {theme.slug === 'sarayli' && (
        <footer id="footer" className="bg-[#efe9df] border-t border-stone-200 py-14 px-4 sm:px-8 text-xs text-[#695f54]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-lg font-serif font-medium text-[#241e18] tracking-wider">{theme.brandName}</div>
              <p>Düğün paketleri ve klasik koleksiyonlarda doğrudan fabrikadan evinize.</p>
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-[#241e18]">Avantajlar</div>
              <div className="flex items-center gap-1.5"><Truck size={13} /> 81 İl Ücretsiz Kurulum</div>
              <div className="flex items-center gap-1.5"><CreditCard size={13} /> 12 Aya Varan Taksit</div>
              <div className="flex items-center gap-1.5"><ShieldCheck size={13} /> 2 Yıl Fabrika Garantisi</div>
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-[#241e18]">Adres</div>
              <div className="flex items-center gap-1.5"><MapPin size={13} /> Mahmudiye Mah. İnegöl, Bursa</div>
              <div className="flex items-center gap-1.5"><Phone size={13} /> +90 507 756 78 87</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-[#241e18]">Hızlı Danışmanlık</div>
              <button type="button" onClick={() => openWhatsApp()} className="px-4 py-2.5 rounded-lg bg-[#9f7a34] text-white font-medium cursor-pointer">
                WhatsApp&apos;tan Yazın
              </button>
            </div>
          </div>
        </footer>
      )}

      {theme.slug === 'modaline' && (
        <footer id="footer" className="bg-[#241a15] text-[#e7dcd4] rounded-t-[36px] mt-10 py-14 px-4 sm:px-8 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="text-xl font-bold text-white">{theme.brandName}</div>
              <p className="text-[#baa99e] max-w-sm">Modern yaşam alanları için sıcak dokular, 3D tasarım deneyimi ve hızlı teslimat.</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-[#d2c4ba]">
              <span>İnegöl / Bursa</span>
              <span>+90 507 756 78 87</span>
              <button type="button" onClick={() => openWhatsApp()} className="px-5 py-2.5 rounded-full text-white font-semibold cursor-pointer" style={{ backgroundColor: theme.accentHex }}>
                Sipariş &amp; Destek
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* ===================================================================== */}
      {/* 7. PRODUCT DETAIL MODAL WITH VERIFIED PRODUCT REVIEWS                 */}
      {/* ===================================================================== */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={cn('relative w-full max-w-4xl rounded-2xl border overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto', theme.borderClass)}
            style={{ backgroundColor: theme.bgCard }}
          >
            <button type="button" onClick={() => setSelectedProductModal(null)} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer">
              <X size={16} />
            </button>

            <div className="relative min-h-[260px]" style={{ backgroundColor: theme.bgSurface }}>
              <img src={selectedProductModal.image} alt={getProductName(selectedProductModal)} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] uppercase tracking-widest" style={{ color: theme.accentHex }}>{selectedProductModal.category}</span>
                  <h3 className={cn('text-2xl font-medium mt-1', theme.fontStyle === 'serif' && 'font-serif')}>{getProductName(selectedProductModal)}</h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-xl font-semibold" style={{ color: theme.isDark ? theme.accentHex : theme.textPrimary }}>{formatMoney(selectedProductModal.price)}</span>
                    {selectedProductModal.oldPrice && <span className="text-sm line-through opacity-50">{formatMoney(selectedProductModal.oldPrice)}</span>}
                  </div>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>{selectedProductModal.description}</p>

                <div>
                  <div className="text-xs font-medium mb-2">Renk: <span style={{ color: theme.accentHex }}>{modalColor}</span></div>
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

                {selectedProductModal.reviews?.length > 0 && (
                  <div className="space-y-2 pt-3 border-t" style={{ borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Ürün Yorumları ({selectedProductModal.reviewCount})</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Star size={12} className="fill-amber-400 text-amber-400" /> {selectedProductModal.rating.toFixed(1)}
                      </span>
                    </div>
                    {selectedProductModal.reviews.map((r, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl text-[11px] space-y-1" style={{ backgroundColor: theme.bgSurface }}>
                        <div className="flex justify-between">
                          <span className="font-semibold">{r.author} <span className="font-normal opacity-70">({r.city})</span></span>
                          <span className="opacity-60">{r.date}</span>
                        </div>
                        <p className="opacity-90">&ldquo;{r.comment}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <button type="button" onClick={() => { addToCart(selectedProductModal, modalColor); setSelectedProductModal(null); }} className="w-full py-3.5 rounded-full text-xs font-semibold cursor-pointer" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
                  {t.addToCart}
                </button>
                <div className="grid grid-cols-2 gap-2.5">
                  <button type="button" onClick={() => { const p = selectedProductModal; setSelectedProductModal(null); jumpToStudio('3d', p); }} className={cn('py-3 rounded-full border text-xs font-medium cursor-pointer', theme.borderClass)}>
                    3D Odada Gör
                  </button>
                  <button type="button" onClick={() => openWhatsApp(selectedProductModal, modalColor)} className="py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer">
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto" style={{ backgroundColor: theme.bgCard }}>
            <div className="space-y-5">
              <div className={cn('flex items-center justify-between pb-4 border-b', theme.borderClass)}>
                <h3 className="text-base font-semibold">{t.cartTitle}</h3>
                <button type="button" onClick={() => setCartOpen(false)} className="p-1.5 rounded-full hover:opacity-70 cursor-pointer"><X size={18} /></button>
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
                          <div className="text-xs font-semibold mt-1" style={{ color: theme.accentHex }}>{formatMoney(item.product.price * item.qty)}</div>
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
                      <button key={opt.id} type="button" onClick={() => setPaymentMethod(opt.id as any)} className={cn('w-full text-left p-3.5 rounded-xl border font-medium cursor-pointer', theme.borderClass)} style={paymentMethod === opt.id ? { borderColor: theme.accentHex, backgroundColor: `${theme.accentHex}15` } : { backgroundColor: theme.bgSurface }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-3 gap-2">
                      {[3, 6, 12].map(m => (
                        <button key={m} type="button" onClick={() => setInstallments(m)} className={cn('p-2.5 rounded-xl text-[11px] font-medium border cursor-pointer', theme.borderClass)} style={installments === m ? { backgroundColor: theme.accentHex, color: theme.accentTextHex, borderColor: theme.accentHex } : undefined}>
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
                  <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>{theme.brandName} ekibimiz onay için sizi en kısa sürede arayacaktır.</p>
                  <button type="button" onClick={() => { setCart([]); setCartOpen(false); setCheckoutStep('cart'); }} className="w-full py-3 rounded-full text-xs font-semibold cursor-pointer" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
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
                  <button type="button" onClick={() => setCheckoutStep('payment')} className="w-full py-3.5 rounded-full text-xs font-semibold cursor-pointer" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
                    {t.checkoutBtn} <ChevronRight size={14} className="inline" />
                  </button>
                ) : (
                  <button type="button" onClick={() => setCheckoutStep('success')} className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer">
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
              <div className="flex items-center gap-2 text-xs font-semibold"><Bot size={16} /> {theme.botName}</div>
              <button type="button" onClick={() => setBotOpen(false)} className="p-1 rounded-full hover:bg-black/15 cursor-pointer"><X size={15} /></button>
            </div>
            <div className="p-3.5 h-56 overflow-y-auto space-y-2.5 text-xs">
              {botMessages.map((m, i) => (
                <div key={i} className={cn('p-3 rounded-2xl max-w-[85%] leading-relaxed', m.from === 'user' ? 'ml-auto' : 'mr-auto')} style={m.from === 'user' ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : { backgroundColor: theme.bgSurface }}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className={cn('p-2.5 border-t flex gap-2', theme.borderClass)}>
              <input value={botInput} onChange={(e) => setBotInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleBotSend()} placeholder="Sorunuzu yazın..." className="flex-1 text-xs px-3 py-2 rounded-xl bg-transparent outline-none" />
              <button type="button" onClick={() => handleBotSend()} className="p-2 rounded-xl cursor-pointer" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}><Send size={14} /></button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => openWhatsApp()} className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer" title="WhatsApp">
            <MessageCircle size={19} />
          </button>
          <button type="button" onClick={() => setBotOpen(!botOpen)} className="w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }} title="Canlı Danışman">
            <Bot size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}
