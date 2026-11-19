"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, MessageCircle, Sparkles, ShieldCheck, Truck, Wrench, CreditCard,
  X, Plus, Minus, CheckCircle2, Globe, Bot, Send, Box, Layers, ArrowRight,
  ChevronRight, Phone, MapPin, Star, Menu, Heart, Award, Sliders
} from 'lucide-react';
import { DemoThemeConfig, DemoProduct, SHARED_DEMO_PRODUCTS, DEMO_THEME_LIST } from '@/data/demoThemes';
import ShowroomRoomPlanner from '@/components/showroom/ShowroomRoomPlanner';
import { cn } from '@/lib/utils';

type Lang = 'TR' | 'EN' | 'DE';

const UI_TEXT: Record<Lang, any> = {
  TR: {
    navCatalog: 'Koleksiyon',
    navShowroom: '3D Showroom & Oda Planla',
    navTrust: 'Avantajlar',
    navContact: 'İletişim',
    ctaExplore: 'Koleksiyonu Keşfet',
    cta3D: '3D Oda Planlayıcı',
    allCats: 'Tümü',
    inspect: 'İncele & Renk Seç',
    addToCart: 'Sepete Ekle',
    whatsappOrder: 'WhatsApp Sipariş',
    showroomBadge: '3D SANAL SHOWROOM & SÜRÜKLE-BIRAK ODA PLANLAYICI',
    showroomHeading: 'TAKIMINIZI ODANIZA SÜRÜKLEYİP YERLEŞTİRİN',
    modeFull3D: '🌀 Tam Takım 360° 3D & AR',
    modePlanner: '📐 Sürükle-Bırak Oda Yerleşimi',
    cartTitle: 'Alışveriş Sepetiniz',
    checkoutBtn: 'Güvenli Ödemeye Geç',
    freeShipping: 'Türkiye & Avrupa Teslimat',
    freeInstall: 'Ücretsiz Kurulum',
    warranty: '2 Yıl Fabrika Garantisi',
    installment: '12 Aya Varan Taksit',
    botWelcome: 'Merhaba! 👋 Ben yapay zeka mobilya danışmanınız. Taksit, özel ölçü, Avrupa teslimat veya 3D oda yerleşimi hakkında her şeyi sorabilirsiniz.',
  },
  EN: {
    navCatalog: 'Collection',
    navShowroom: '3D Showroom',
    navTrust: 'Benefits',
    navContact: 'Contact',
    ctaExplore: 'Explore Collection',
    cta3D: '3D Room Planner',
    allCats: 'All',
    inspect: 'Details & Colors',
    addToCart: 'Add to Cart',
    whatsappOrder: 'Order on WhatsApp',
    showroomBadge: '3D VIRTUAL SHOWROOM & DRAG-AND-DROP PLANNER',
    showroomHeading: 'ARRANGE YOUR FURNITURE IN 3D',
    modeFull3D: '🌀 Full Set 360° 3D & AR',
    modePlanner: '📐 Drag & Drop Planner',
    cartTitle: 'Shopping Cart',
    checkoutBtn: 'Secure Checkout',
    freeShipping: 'Europe & Turkey Shipping',
    freeInstall: 'White-Glove Assembly',
    warranty: '2-Year Factory Warranty',
    installment: 'Flexible Installments',
    botWelcome: 'Hello! 👋 Ask me anything about European delivery, custom sizes, fabrics, or our 3D Room Planner.',
  },
  DE: {
    navCatalog: 'Kollektion',
    navShowroom: '3D Showroom',
    navTrust: 'Vorteile',
    navContact: 'Kontakt',
    ctaExplore: 'Kollektion Entdecken',
    cta3D: '3D Raumplaner',
    allCats: 'Alle',
    inspect: 'Details & Farben',
    addToCart: 'In den Warenkorb',
    whatsappOrder: 'Per WhatsApp',
    showroomBadge: '3D VIRTUELLER SHOWROOM & RAUMPLANER',
    showroomHeading: 'PLANEN SIE IHR ZIMMER IN 3D',
    modeFull3D: '🌀 Komplett-Set 360° 3D & AR',
    modePlanner: '📐 Drag & Drop Planer',
    cartTitle: 'Warenkorb',
    checkoutBtn: 'Zur Kasse',
    freeShipping: 'Europaweiter Versand',
    freeInstall: 'Montageservice',
    warranty: '2 Jahre Garantie',
    installment: 'Ratenzahlung',
    botWelcome: 'Hallo! 👋 Fragen Sie mich nach Lieferung nach Deutschland/Europa, Sondermaßen oder dem 3D-Raumplaner.',
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
  const [showroomMode, setShowroomMode] = useState<'full3d' | 'planner'>(
    theme.slug === 'nordika' || theme.slug === 'sarayli' ? 'planner' : 'full3d'
  );
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
  const [likedIds, setLikedIds] = useState<string[]>([]);

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

  const toggleLike = (id: string) => {
    setLikedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
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

  const jumpTo3D = (p: DemoProduct) => {
    setShowroomProduct(p);
    setShowroomColor(p.colors[0].name);
    document.getElementById('showroom3d')?.scrollIntoView({ behavior: 'smooth' });
  };

  // =========================================================================
  // REUSABLE SECTION: 3D SHOWROOM + DRAG & DROP PLANNER (STYLED PER THEME!)
  // =========================================================================
  const renderShowroomSection = (variant: 'dark-luxury' | 'nordic-card' | 'emerald-atelier' | 'royal-gold' | 'boho-warm') => {
    const wrapperStyles = {
      'dark-luxury': 'bg-[#09090d] text-white border-y border-amber-500/20',
      'nordic-card': 'bg-[#eceae3] text-[#1a1917] border-y border-neutral-300',
      'emerald-atelier': 'bg-[#07120e] text-[#f5f2eb] border-y border-emerald-700/40',
      'royal-gold': 'bg-[#1c1610] text-[#fbf9f5] border-y-4 border-amber-600/50',
      'boho-warm': 'bg-[#261914] text-[#fdf8f3] border-y border-orange-500/25',
    }[variant];

    const isLightStudio = variant === 'nordic-card';

    return (
      <section id="showroom3d" className={cn("py-14 sm:py-20 px-4 sm:px-8", wrapperStyles)}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span
                className="text-[10px] font-black uppercase tracking-[0.35em] block mb-2"
                style={{ color: isLightStudio ? theme.accentHex : '#fbbf24' }}
              >
                {t.showroomBadge}
              </span>
              <h2 className={cn("text-2xl sm:text-4xl font-black tracking-tight", theme.fontStyle === 'serif' && "font-serif")}>
                {variant === 'royal-gold'
                  ? 'DÜĞÜN PAKETİNİ 3D KUR & ODANA YERLEŞTİR'
                  : variant === 'nordic-card'
                  ? 'İskandinav Odanı Sürükle-Bırak Tasarla'
                  : t.showroomHeading}
              </h2>
            </div>

            <div className={cn(
              "flex flex-wrap gap-2 p-1.5 rounded-2xl border",
              isLightStudio ? "bg-white border-neutral-300" : "bg-white/5 border-white/10"
            )}>
              <button
                type="button"
                onClick={() => setShowroomMode('full3d')}
                className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                style={showroomMode === 'full3d' ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : undefined}
              >
                {t.modeFull3D}
              </button>
              <button
                type="button"
                onClick={() => setShowroomMode('planner')}
                className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                style={showroomMode === 'planner' ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : undefined}
              >
                {t.modePlanner}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SHARED_DEMO_PRODUCTS.slice(0, 3).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setShowroomProduct(p); setShowroomColor(p.colors[0].name); }}
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-xs font-black border transition-all flex-shrink-0 cursor-pointer flex items-center gap-2",
                  showroomProduct.id === p.id
                    ? isLightStudio ? "bg-[#2f483d] text-white border-[#2f483d]" : "bg-amber-400/20 border-amber-400 text-amber-300"
                    : isLightStudio ? "bg-white border-neutral-300 text-neutral-700" : "bg-white/5 border-white/10 text-neutral-300 hover:border-white/30"
                )}
              >
                <span>🛋️ {p.category}:</span>
                <span>{getProductName(p)}</span>
              </button>
            ))}
          </div>

          {showroomMode === 'full3d' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className={cn(
                "lg:col-span-8 relative h-[400px] sm:h-[500px] rounded-[32px] border overflow-hidden shadow-2xl",
                isLightStudio ? "bg-gradient-to-b from-white to-[#e6e3da] border-neutral-300" : "bg-gradient-to-b from-[#171722] to-[#0a0a0f] border-white/10"
              )}>
                <div className="absolute top-4 left-4 z-20 bg-black/75 backdrop-blur-md border border-amber-400/40 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-300 flex items-center gap-2">
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
                  className="absolute bottom-4 right-4 z-20 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl cursor-pointer flex items-center gap-1.5"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  <Layers size={13} /> Parçaları Tek Tek Odana Diz →
                </button>
              </div>

              <div className={cn(
                "lg:col-span-4 border rounded-[32px] p-6 flex flex-col justify-between gap-6",
                isLightStudio ? "bg-white border-neutral-300 text-neutral-900" : "bg-white/[0.04] border-white/10 text-white"
              )}>
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: theme.accentHex }}>
                    {showroomProduct.category} — TAM SET
                  </span>
                  <h3 className={cn("text-2xl font-black", theme.fontStyle === 'serif' && "font-serif")}>
                    {getProductName(showroomProduct)}
                  </h3>
                  <div className="text-2xl font-black" style={{ color: theme.accentHex }}>
                    {formatMoney(showroomProduct.price)}
                  </div>
                  <p className="text-xs opacity-75 leading-relaxed">{showroomProduct.description}</p>
                  <div className="space-y-1.5 pt-2">
                    {showroomProduct.dimensions.map((d) => (
                      <div key={d.piece} className={cn("flex justify-between text-xs px-3 py-2 rounded-xl", isLightStudio ? "bg-neutral-100" : "bg-white/5")}>
                        <span className="font-bold opacity-85">{d.piece}</span>
                        <span className="font-black" style={{ color: theme.accentHex }}>{d.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => addToCart(showroomProduct, showroomColor)}
                    className="w-full py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                    style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
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
            <div className="text-white">
              <ShowroomRoomPlanner
                selectedProduct={{
                  ...showroomProduct,
                  threeDModelUrl: showroomProduct.fullRoomModelUrl,
                }}
                selectedColor={showroomColor}
                onInspect3D={() => setShowroomMode('full3d')}
              />
            </div>
          )}
        </div>
      </section>
    );
  };

  // =========================================================================
  // REUSABLE SECTION: 5 COMPLETELY DIFFERENT PRODUCT CATALOGS & CARD DESIGNS
  // =========================================================================
  const renderCatalogSection = () => {
    return (
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
        {/* Catalog Header & Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.35em] block mb-2" style={{ color: theme.accentHex }}>
              {theme.slug === 'sarayli' ? 'KRALİYET & DÜĞÜN PAKETİ SERİSİ' : theme.slug === 'nordika' ? 'İSKANDİNAV KOLEKSİYON' : '2026 İNEGÖL KOLEKSİYONU'}
            </span>
            <h2 className={cn("text-3xl sm:text-4xl font-black tracking-tight", theme.fontStyle === 'serif' && "font-serif")}>
              {theme.slug === 'modaline' ? 'Instagram’da En Çok İstenenler' : theme.slug === 'velvet-co' ? 'İç Mimar Seçkisi' : 'Öne Çıkan Mobilya Takımları'}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Tümü', 'Yatak Odası', 'Yemek Odası', 'Koltuk Takımı'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                className={cn(
                  "px-4 py-2 text-[11px] font-black uppercase tracking-wider border transition-all cursor-pointer",
                  theme.slug === 'aura-luxe' ? "rounded-none" : "rounded-full",
                  theme.borderClass
                )}
                style={activeCat === cat ? { backgroundColor: theme.accentHex, color: theme.accentTextHex, borderColor: theme.accentHex } : { backgroundColor: theme.bgCard }}
              >
                {cat === 'Tümü' ? t.allCats : cat}
              </button>
            ))}
          </div>
        </div>

        {/* CARD STYLE 1: AURA LUXE -> 2-COLUMN WIDE ARCHITECTURAL SHARP LUXURY CARDS */}
        {theme.slug === 'aura-luxe' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="group relative border border-amber-500/20 hover:border-amber-400 bg-[#101016] transition-all duration-500 overflow-hidden"
              >
                <div
                  onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                  className="relative aspect-[16/10] overflow-hidden cursor-pointer"
                >
                  <img src={p.image} alt={getProductName(p)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 border border-amber-400/50 text-amber-400 text-[9px] font-black tracking-[0.25em] uppercase">
                    VIP • {p.category}
                  </div>
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-white">{getProductName(p)}</h3>
                      <p className="text-xs text-neutral-300 line-clamp-1 mt-1">{p.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-black text-amber-400">{formatMoney(p.price)}</div>
                      {p.oldPrice && <div className="text-[11px] line-through text-neutral-400">{formatMoney(p.oldPrice)}</div>}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#14141d] flex items-center justify-between gap-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    {p.colors.map(c => (
                      <span key={c.name} title={c.name} className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => jumpTo3D(p)} className="px-3 py-2 border border-white/15 hover:border-amber-400 text-[10px] font-black uppercase tracking-wider cursor-pointer">
                      3D Gör
                    </button>
                    <button onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }} className="px-3 py-2 bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-wider cursor-pointer">
                      Detay
                    </button>
                    <button onClick={() => addToCart(p, p.colors[0].name)} className="px-4 py-2 bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider cursor-pointer">
                      + Sepet
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CARD STYLE 2: NORDİKA -> 4-COLUMN SCANDINAVIAN CLEAN MINIMALIST CARDS */}
        {theme.slug === 'nordika' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) => (
              <div key={p.id} className="group bg-white rounded-2xl p-3 border border-neutral-200 hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div
                    onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                    className="relative aspect-square rounded-xl overflow-hidden bg-[#f4f2ec] cursor-pointer mb-3"
                  >
                    <img src={p.image} alt={getProductName(p)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); addToCart(p, p.colors[0].name); }}
                      className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-[#2f483d] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                      title="Hızlı Sepete Ekle"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{p.category}</div>
                  <h3
                    onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                    className="text-sm font-black text-neutral-900 mt-0.5 cursor-pointer hover:underline"
                  >
                    {getProductName(p)}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-black text-[#2f483d]">{formatMoney(p.price)}</span>
                    <div className="flex gap-1">
                      {p.colors.slice(0, 4).map(c => (
                        <span key={c.name} className="w-3 h-3 rounded-full border border-neutral-300" style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-neutral-100">
                  <button onClick={() => jumpTo3D(p)} className="py-2 rounded-lg bg-[#f1efe9] text-[10px] font-bold text-neutral-800 hover:bg-[#e4e1d8] cursor-pointer">
                    📐 3D Diz
                  </button>
                  <button onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }} className="py-2 rounded-lg border border-neutral-200 text-[10px] font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                    İncele →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CARD STYLE 3: VELVET & CO. -> HORIZONTAL SIDE-BY-SIDE EDITORIAL SHOWCASE CARDS */}
        {theme.slug === 'velvet-co' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="group bg-[#11241d] border border-emerald-700/40 hover:border-[#e2c275] rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 transition-all shadow-xl"
              >
                <div
                  onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                  className="sm:col-span-5 relative min-h-[210px] cursor-pointer overflow-hidden"
                >
                  <img src={p.image} alt={getProductName(p)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-3 left-3 bg-[#0b1914]/90 text-[#e2c275] text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-widest">
                    {p.category}
                  </span>
                </div>
                <div className="sm:col-span-7 p-5 flex flex-col justify-between gap-3">
                  <div>
                    <h3
                      onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                      className="text-xl font-serif font-bold text-[#f5f2eb] cursor-pointer hover:text-[#e2c275]"
                    >
                      {getProductName(p)}
                    </h3>
                    <p className="text-xs text-[#9eb8ae] mt-1.5 line-clamp-2 leading-relaxed">{p.description}</p>
                    <div className="mt-3 space-y-1">
                      {p.dimensions.slice(0, 2).map(d => (
                        <div key={d.piece} className="text-[10px] text-emerald-200/80 flex justify-between border-b border-emerald-800/40 pb-1">
                          <span>{d.piece}</span>
                          <span className="font-bold text-[#e2c275]">{d.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-serif font-black text-[#e2c275]">{formatMoney(p.price)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => jumpTo3D(p)} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase cursor-pointer">
                        3D
                      </button>
                      <button onClick={() => addToCart(p, p.colors[0].name)} className="px-3.5 py-2 rounded-lg bg-[#e2c275] text-[#0b1914] text-[10px] font-black uppercase cursor-pointer">
                        Sepete Ekle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CARD STYLE 4: SARAYLI -> DOUBLE-BORDERED ROYAL CLASSIC CARDS WITH INSTALLMENT BREAKDOWN */}
        {theme.slug === 'sarayli' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white p-2 border-2 border-amber-700/25 hover:border-amber-600 transition-all shadow-lg"
              >
                <div className="border border-amber-700/20 h-full flex flex-col justify-between">
                  <div>
                    <div
                      onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                      className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                    >
                      <img src={p.image} alt={getProductName(p)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                      {p.oldPrice && (
                        <div className="absolute top-0 right-0 bg-[#b8860b] text-white text-[10px] font-black px-3 py-1.5 uppercase tracking-wider">
                          Düğün İndirimi
                        </div>
                      )}
                    </div>
                    <div className="p-5 text-center space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">{p.category}</div>
                      <h3 className="text-lg font-serif font-bold text-[#241c15]">{getProductName(p)}</h3>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <span className="text-2xl font-serif font-black text-[#b8860b]">{formatMoney(p.price)}</span>
                        {p.oldPrice && <span className="text-xs line-through text-neutral-400">{formatMoney(p.oldPrice)}</span>}
                      </div>
                      <div className="inline-block bg-[#f4efe6] text-[#785a14] text-[10px] font-bold px-3 py-1 rounded-full">
                        💳 12 × {formatMoney(Math.round(p.price / 12))} / ay Taksitle
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                      className="py-2.5 border border-amber-800/30 text-[10px] font-black uppercase tracking-wider hover:bg-[#f4efe6] cursor-pointer"
                    >
                      Ölçü & Renkler
                    </button>
                    <button
                      onClick={() => addToCart(p, p.colors[0].name)}
                      className="py-2.5 bg-[#b8860b] text-white text-[10px] font-black uppercase tracking-wider hover:bg-[#966d08] cursor-pointer"
                    >
                      Pakete Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CARD STYLE 5: MODA LİNE -> TALL INSTAGRAM LOOKBOOK GLASSMORPHISM CARDS */}
        {theme.slug === 'modaline' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => {
              const liked = likedIds.includes(p.id);
              return (
                <div key={p.id} className="group relative aspect-[3/4] rounded-[32px] overflow-hidden shadow-xl">
                  <img
                    src={p.image}
                    alt={getProductName(p)}
                    onClick={() => { setSelectedProductModal(p); setModalColor(p.colors[0].name); }}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2b1d16]/90 via-transparent to-black/20 pointer-events-none" />
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-[#c25934] text-[10px] font-black uppercase shadow">
                      {p.badge || p.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLike(p.id)}
                      className="w-9 h-9 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center shadow cursor-pointer"
                    >
                      <Heart size={16} className={liked ? "fill-red-500 text-red-500" : "text-neutral-700"} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-white/92 backdrop-blur-xl rounded-2xl p-4 text-[#2b1d16] shadow-2xl space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-[#c25934]">{p.category}</div>
                        <h3 className="text-sm font-black leading-snug">{getProductName(p)}</h3>
                      </div>
                      <div className="text-base font-black text-[#c25934] flex-shrink-0">{formatMoney(p.price)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(p, p.colors[0].name)}
                        className="flex-1 py-2 rounded-xl bg-[#c25934] text-white text-[10px] font-black uppercase cursor-pointer"
                      >
                        Sepete Ekle
                      </button>
                      <button
                        onClick={() => jumpTo3D(p)}
                        className="px-3 py-2 rounded-xl bg-[#f6ebe0] text-[#2b1d16] text-[10px] font-black uppercase cursor-pointer"
                      >
                        3D Oda
                      </button>
                      <button
                        onClick={() => openWhatsApp(p)}
                        className="p-2 rounded-xl bg-emerald-600 text-white cursor-pointer"
                        title="WhatsApp"
                      >
                        <MessageCircle size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  return (
    <div
      className="min-h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: theme.bgPage, color: theme.textPrimary }}
    >
      {/* 0. PRESENTATION SWITCHER BAR (MÜŞTERİ SUNUM ÇUBUĞU) */}
      <div className="w-full bg-black text-white text-[10px] py-2 px-3 border-b border-white/15 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/ajans"
            className="px-3 py-1 rounded-full bg-amber-400 text-black font-black uppercase tracking-wider flex items-center gap-1 whitespace-nowrap"
          >
            ← Ajans Ana Sayfa
          </Link>
          <Link
            href="/vitrin"
            className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 font-black uppercase tracking-wider whitespace-nowrap"
          >
            5 Vitrin
          </Link>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {DEMO_THEME_LIST.map((item, i) => (
            <Link
              key={item.slug}
              href={`/demo/${item.slug}`}
              className={cn(
                "px-2.5 py-1 rounded-full font-black uppercase tracking-wider transition-all whitespace-nowrap",
                item.slug === theme.slug ? "" : "bg-white/10 text-neutral-300 hover:bg-white/20"
              )}
              style={item.slug === theme.slug ? { backgroundColor: item.accentHex, color: item.accentTextHex } : undefined}
            >
              {i + 1}. {item.brandName.split(' ')[0]}
            </Link>
          ))}
        </div>
      </div>

      {/* 1. THEME-SPECIFIC HEADER / NAVBAR */}
      {theme.slug === 'sarayli' && (
        <div className="bg-[#b8860b] text-white text-center py-2 px-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.22em]">
          ✨ 2026 Düğün Paketlerinde %25 İndirim + 12 Taksit + Türkiye & Avrupa Kapı Teslim ✨
        </div>
      )}

      <header
        className={cn(
          "sticky top-0 z-40 backdrop-blur-xl border-b",
          theme.slug === 'modaline' ? "mx-3 sm:mx-8 mt-3 rounded-full border shadow-lg" : "",
          theme.borderClass
        )}
        style={{ backgroundColor: theme.isDark ? 'rgba(10,10,15,0.9)' : 'rgba(255,255,255,0.92)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <a href="#hero" className="flex items-center gap-2.5 min-w-0">
            <span
              className={cn("w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md", theme.slug === 'aura-luxe' ? "rounded-none" : "rounded-xl")}
              style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
            >
              {theme.brandName.charAt(0)}
            </span>
            <div className="truncate">
              <div className={cn("text-sm sm:text-lg font-black tracking-[0.14em] truncate", theme.fontStyle === 'serif' && "font-serif")}>
                {theme.brandName}
              </div>
              <div className="text-[9px] uppercase tracking-widest opacity-60 hidden sm:block">
                {theme.styleLabel}
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-widest">
            <a href="#catalog" className="hover:opacity-70">{t.navCatalog}</a>
            <a href="#showroom3d" className="flex items-center gap-1.5 hover:opacity-70" style={{ color: theme.accentHex }}>
              <Sparkles size={13} /> {t.navShowroom}
            </a>
            <a href="#trust" className="hover:opacity-70">{t.navTrust}</a>
            <a href="#footer" className="hover:opacity-70">{t.navContact}</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
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
              onClick={() => { setCheckoutStep('cart'); setCartOpen(true); }}
              className={cn("relative p-2.5 rounded-full border cursor-pointer", theme.borderClass)}
              style={{ backgroundColor: theme.bgSurface }}
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

            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={cn("md:hidden p-2 rounded-xl border", theme.borderClass)}>
              <Menu size={18} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={cn("md:hidden px-6 py-4 border-t flex flex-col gap-3 text-xs font-black uppercase tracking-widest", theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
            <a href="#catalog" onClick={() => setMobileMenuOpen(false)}>{t.navCatalog}</a>
            <a href="#showroom3d" onClick={() => setMobileMenuOpen(false)} style={{ color: theme.accentHex }}>{t.navShowroom}</a>
            <a href="#trust" onClick={() => setMobileMenuOpen(false)}>{t.navTrust}</a>
            <button onClick={() => openWhatsApp()} className="text-left text-emerald-500">💬 WhatsApp Canlı Destek</button>
          </div>
        )}
      </header>

      {/* ===================================================================== */}
      {/* 2. FIVE COMPLETELY DISTINCT HERO BANNERS & SECTION ORDERS!            */}
      {/* ===================================================================== */}

      {/* THEME 1: AURA LUXE -> DARK CINEMATIC FULLBLEED HERO + STATS -> 3D SHOWROOM FIRST -> CATALOG */}
      {theme.slug === 'aura-luxe' && (
        <>
          <section id="hero" className="relative min-h-[76vh] flex items-center">
            <img src={theme.heroImage} alt={theme.brandName} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090d] via-[#09090d]/85 to-[#09090d]/35" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-amber-400/50 text-amber-400 text-[10px] font-black uppercase tracking-[0.35em]">
                  <Award size={13} /> VIP İHRACAT & EL İŞÇİLİĞİ
                </div>
                <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-[1.04]">
                  {theme.heroTitle}
                </h1>
                <p className="text-sm sm:text-lg text-neutral-300 max-w-2xl">{theme.heroSubtitle}</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a href="#showroom3d" className="px-8 py-4 bg-amber-400 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Box size={15} /> 3D VIP Showroom’a Gir
                  </a>
                  <a href="#catalog" className="px-8 py-4 border border-white/25 text-white text-xs font-black uppercase tracking-widest">
                    Koleksiyonu İncele →
                  </a>
                </div>
              </div>
              <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-3">
                {[
                  { n: '28 Ülke', l: 'Avrupa & Körfez İhracat' },
                  { n: '100% Gürgen', l: 'Masif Fırınlı İskelet' },
                  { n: '3D + AR', l: 'Canlı Oda Deneyimi' },
                ].map(s => (
                  <div key={s.n} className="bg-black/65 backdrop-blur-md border border-amber-400/25 p-4">
                    <div className="text-lg sm:text-2xl font-serif font-black text-amber-400">{s.n}</div>
                    <div className="text-[10px] uppercase tracking-widest text-neutral-400">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AURA LUXE PUTS 3D SHOWROOM RIGHT BELOW HERO! */}
          {renderShowroomSection('dark-luxury')}
          {renderCatalogSection()}
        </>
      )}

      {/* THEME 2: NORDİKA -> 3-CARD SCANDINAVIAN BENTO COLLAGE HERO -> 4-COL CATALOG -> NORDIC 3D STUDIO */}
      {theme.slug === 'nordika' && (
        <>
          <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Main Left Card */}
              <div className="lg:col-span-7 bg-[#e9e6dd] rounded-[32px] p-8 sm:p-12 flex flex-col justify-between gap-8 relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white text-[#2f483d] text-[10px] font-black uppercase tracking-widest">
                    🌿 İskandinav Minimalizm • İnegöl
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1a1917] leading-[1.08]">
                    {theme.heroTitle}
                  </h1>
                  <p className="text-sm text-[#5c5952] max-w-lg leading-relaxed">{theme.heroSubtitle}</p>
                </div>
                <div className="flex flex-wrap gap-3 relative z-10">
                  <a href="#catalog" className="px-7 py-3.5 rounded-full bg-[#2f483d] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2">
                    {t.ctaExplore} <ArrowRight size={14} />
                  </a>
                  <a href="#showroom3d" className="px-7 py-3.5 rounded-full bg-white text-[#1a1917] border border-neutral-300 text-xs font-black uppercase tracking-wider">
                    📐 Odanı Kendin Diz
                  </a>
                </div>
              </div>

              {/* Right 2 Stacked Visual Bento Cards */}
              <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="relative rounded-[28px] overflow-hidden min-h-[200px] group">
                  <img src={theme.heroImage} alt="Nordika Salon" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-3 left-3 bg-white/92 backdrop-blur-md px-4 py-2 rounded-2xl">
                    <div className="text-[10px] font-black uppercase text-[#2f483d]">Yeni Sezon</div>
                    <div className="text-xs font-black">Doğal Meşe Serisi</div>
                  </div>
                </div>
                <div className="relative rounded-[28px] overflow-hidden min-h-[200px] group">
                  <img src="/images/yatak_odasi.png" alt="Nordika Yatak Odası" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-3 left-3 bg-[#2f483d]/95 text-white px-4 py-2 rounded-2xl">
                    <div className="text-[10px] font-black uppercase text-emerald-300">Sürükle & Yerleştir</div>
                    <div className="text-xs font-black">3D Yatak Odası Planlayıcı</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {renderCatalogSection()}
          {renderShowroomSection('nordic-card')}
        </>
      )}

      {/* THEME 3: VELVET & CO -> EDITORIAL MAGAZINE ARCHED HERO -> HORIZONTAL CARDS -> EMERALD 3D ATELIER */}
      {theme.slug === 'velvet-co' && (
        <>
          <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-[1px] bg-[#e2c275]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#e2c275]">EDİTORYAL ATÖLYE • SAYI 2026</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-serif font-light italic tracking-tight leading-[1.06]">
                {theme.heroTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#9eb8ae] leading-relaxed">{theme.heroSubtitle}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#catalog" className="px-8 py-4 rounded-full bg-[#e2c275] text-[#0b1914] text-xs font-black uppercase tracking-widest">
                  Seçkiyi Görüntüle
                </a>
                <a href="#showroom3d" className="px-8 py-4 rounded-full border border-[#e2c275]/50 text-[#e2c275] text-xs font-black uppercase tracking-widest">
                  3D Mimar Stüdyosu
                </a>
              </div>
            </div>
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-t-full overflow-hidden border-2 border-[#e2c275]/40 p-2">
                <div className="w-full h-full rounded-t-full overflow-hidden relative">
                  <img src={theme.heroImage} alt="Velvet Editorial" className="w-full h-full object-cover" />
                  <div className="absolute bottom-5 inset-x-5 bg-[#0b1914]/90 backdrop-blur-md border border-[#e2c275]/30 p-4 rounded-2xl text-center">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-[#e2c275] font-black">İtalyan Kadife & Pirinç</div>
                    <div className="text-xs font-serif italic mt-1">Kumaş Rengini Canlı 3D Değiştir</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {renderCatalogSection()}
          {renderShowroomSection('emerald-atelier')}
        </>
      )}

      {/* THEME 4: SARAYLI -> CENTERED ROYAL HERO + 3 VISUAL WEDDING PACKAGE CARDS -> 3D PLANNER -> ROYAL CATALOG */}
      {theme.slug === 'sarayli' && (
        <>
          <section id="hero" className="relative py-16 sm:py-24 px-4 sm:px-8 text-center border-b border-amber-800/15 bg-gradient-to-b from-[#f4efe6] to-[#fbf9f5]">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="inline-block px-5 py-1.5 border border-amber-700/40 text-amber-800 text-[10px] font-black uppercase tracking-[0.35em]">
                👑 KRALİYET KLASİK & DÜĞÜN PAKETLERİ
              </div>
              <h1 className="text-3xl sm:text-6xl font-serif font-bold text-[#241c15] leading-tight">
                {theme.heroTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#6d6052] max-w-2xl mx-auto">{theme.heroSubtitle}</p>

              {/* 3 Visual Category Cards right inside Hero */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
                {[
                  { title: 'Yatak Odası Takımları', img: '/images/yatak_odasi.png', cat: 'Yatak Odası', price: '70.000 ₺’den' },
                  { title: 'Yemek Odası Takımları', img: '/images/yemek_odasi.png', cat: 'Yemek Odası', price: '58.800 ₺’den' },
                  { title: 'Koltuk Takımları', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80', cat: 'Koltuk Takımı', price: '68.500 ₺’den' },
                ].map(c => (
                  <a
                    key={c.title}
                    href="#catalog"
                    onClick={() => setActiveCat(c.cat)}
                    className="group bg-white p-2 border border-amber-700/25 hover:border-amber-600 shadow-md transition-all"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3 text-center">
                      <div className="text-sm font-serif font-bold text-[#241c15]">{c.title}</div>
                      <div className="text-[11px] font-black text-[#b8860b] mt-0.5">{c.price}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* SARAYLI PUTS 3D WEDDING PLANNER BEFORE CATALOG */}
          {renderShowroomSection('royal-gold')}
          {renderCatalogSection()}
        </>
      )}

      {/* THEME 5: MODA LİNE -> INTERACTIVE LIVE 3D MODEL DIRECTLY INSIDE THE HERO BANNER! */}
      {theme.slug === 'modaline' && (
        <>
          <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#c25934]/15 text-[#c25934] text-[10px] font-black uppercase tracking-widest">
                🔥 İNTERAKTİF 3D HERO — PARMAĞINLA ÇEVİR!
              </span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#2b1d16] leading-[1.06]">
                {theme.heroTitle}
              </h1>
              <p className="text-sm text-[#7a6155] leading-relaxed">{theme.heroSubtitle}</p>
              <div className="flex flex-wrap gap-2">
                {SHARED_DEMO_PRODUCTS.slice(0, 3).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setShowroomProduct(p)}
                    className={cn(
                      "px-3.5 py-2 rounded-full text-[10px] font-black uppercase border cursor-pointer transition-all",
                      showroomProduct.id === p.id ? "bg-[#c25934] text-white border-[#c25934]" : "bg-white border-orange-900/15 text-[#2b1d16]"
                    )}
                  >
                    3D: {p.category}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#catalog" className="px-7 py-3.5 rounded-full bg-[#c25934] text-white text-xs font-black uppercase tracking-wider shadow-lg">
                  Lookbook’u Keşfet →
                </a>
                <a href="#showroom3d" className="px-7 py-3.5 rounded-full bg-[#f6ebe0] text-[#2b1d16] text-xs font-black uppercase tracking-wider">
                  📐 Sürükle-Bırak Oda
                </a>
              </div>
            </div>

            {/* LIVE 360° 3D MODEL DIRECTLY INSIDE THE HERO BANNER */}
            <div className="lg:col-span-7 relative h-[380px] sm:h-[480px] rounded-[36px] bg-gradient-to-br from-[#2b1d16] to-[#1a100c] border-4 border-[#f6ebe0] shadow-2xl overflow-hidden">
              <div className="absolute top-4 left-4 z-20 bg-white/95 text-[#c25934] px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow">
                🌀 360° CANLI 3D: {showroomProduct.name}
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
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl text-xs">
                <span className="font-bold">Parmağınla döndür & yakınlaştır</span>
                <span className="font-black text-amber-300">{formatMoney(showroomProduct.price)}</span>
              </div>
            </div>
          </section>

          {renderCatalogSection()}
          {renderShowroomSection('boho-warm')}
        </>
      )}

      {/* 3. TRUST & CONVERSION BAR */}
      <section id="trust" className={cn("border-y", theme.borderClass)} style={{ backgroundColor: theme.bgSurface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

      {/* 4. FOOTER */}
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

      {/* 5. PRODUCT DETAIL MODAL */}
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
              <img src={selectedProductModal.image} alt={getProductName(selectedProductModal)} className="w-full h-full object-cover" />
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

                <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>{selectedProductModal.description}</p>

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
                          "px-3 py-1.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 cursor-pointer",
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
                  onClick={() => { addToCart(selectedProductModal, modalColor); setSelectedProductModal(null); }}
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

      {/* 6. CART & CHECKOUT DRAWER */}
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
                        className={cn("w-full text-left p-3.5 rounded-xl border font-bold cursor-pointer", theme.borderClass)}
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
                    <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Ad Soyad" className={cn("w-full p-3 rounded-xl border text-xs bg-transparent", theme.borderClass)} />
                    <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Telefon (05XX ...)" className={cn("w-full p-3 rounded-xl border text-xs bg-transparent", theme.borderClass)} />
                    <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} placeholder="Teslimat Adresi (İl / İlçe / Mahalle)" rows={2} className={cn("w-full p-3 rounded-xl border text-xs bg-transparent", theme.borderClass)} />
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 size={56} className="mx-auto text-emerald-500" />
                  <h4 className="text-xl font-black">Siparişiniz Oluşturuldu!</h4>
                  <p className="text-xs opacity-80 leading-relaxed">{theme.brandName} fabrika üretim ekibimiz onay için sizi en kısa sürede arayacaktır.</p>
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

      {/* 7. FLOATING AI ROBOT + WHATSAPP */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {botOpen && (
          <div className={cn("w-[320px] sm:w-[360px] rounded-3xl border shadow-2xl overflow-hidden flex flex-col", theme.borderClass)} style={{ backgroundColor: theme.bgCard }}>
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

            <div className="p-3.5 h-60 overflow-y-auto space-y-2.5 text-xs">
              {botMessages.map((m, i) => (
                <div
                  key={i}
                  className={cn("p-3 rounded-2xl max-w-[85%] leading-relaxed", m.from === 'user' ? "ml-auto font-bold" : "mr-auto")}
                  style={m.from === 'user' ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : { backgroundColor: theme.bgSurface }}
                >
                  {m.text}
                </div>
              ))}
            </div>

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
              <button type="button" onClick={() => handleBotSend()} className="p-2.5 rounded-xl cursor-pointer" style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}>
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
