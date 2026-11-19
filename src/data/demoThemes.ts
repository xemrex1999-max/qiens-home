export interface DemoProduct {
  id: string;
  name: string;
  nameEn: string;
  nameDe: string;
  category: 'Yatak Odası' | 'Yemek Odası' | 'Koltuk Takımı';
  price: number;
  oldPrice?: number;
  badge?: string;
  image: string;
  hoverImage?: string;
  fullRoomModelUrl: string;
  description: string;
  colors: { name: string; hex: string }[];
  dimensions: { piece: string; size: string }[];
}

export interface DemoThemeConfig {
  slug: string;
  brandName: string;
  tagline: string;
  taglineEn: string;
  taglineDe: string;
  styleLabel: string;
  targetAudience: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  whatsappPhone: string;
  botName: string;
  isDark: boolean;
  // Visual Palette
  bgPage: string;
  bgCard: string;
  bgSurface: string;
  textPrimary: string;
  textMuted: string;
  accentHex: string;
  accentTextHex: string;
  borderClass: string;
  heroLayout: 'fullbleed' | 'split' | 'editorial' | 'royal' | 'modern';
  fontStyle: 'serif' | 'sans';
}

export const SHARED_DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'ayca-yatak',
    name: 'Ayça Lüks Yatak Odası Takımı',
    nameEn: 'Ayça Luxury Bedroom Set',
    nameDe: 'Ayça Luxus-Schlafzimmer-Set',
    category: 'Yatak Odası',
    price: 75600,
    oldPrice: 89000,
    badge: '3D TAM TAKIM',
    image: '/images/yatak_odasi.png',
    hoverImage: '/evrensen/Aynalı Yatak Odası/WhatsApp Image 2025-09-01 at 11.43.59 (1).jpeg',
    fullRoomModelUrl: '/models/yatak-odasi-tam-takim.glb',
    description: '6 kapaklı aynalı gardırop, kapitone başlık & baza, şifonyer, 2 adet komodin ve ayak ucu pufu dahil komple İnegöl üretimi lüks yatak odası.',
    colors: [
      { name: 'Doğal Meşe', hex: '#c5a880' },
      { name: 'Ceviz', hex: '#5c3a21' },
      { name: 'Krem Boucle', hex: '#eae0c8' },
      { name: 'Antrasit', hex: '#2c3038' },
      { name: 'Zümrüt Yeşili', hex: '#164a38' },
    ],
    dimensions: [
      { piece: '6 Kapaklı Gardırop', size: '240 × 62 × 215 cm' },
      { piece: 'Karyola & Baza (160x200)', size: '175 × 215 × 125 cm' },
      { piece: 'Şifonyer & Ayna', size: '125 × 48 × 85 cm' },
      { piece: 'Komodin (2 Adet)', size: '55 × 45 × 50 cm' },
    ],
  },
  {
    id: 'ayca-yemek',
    name: 'Ayça Mermer Yemek Odası Takımı',
    nameEn: 'Ayça Marble Dining Room Set',
    nameDe: 'Ayça Marmor-Esszimmer-Set',
    category: 'Yemek Odası',
    price: 71400,
    oldPrice: 84500,
    badge: '3D TAM TAKIM',
    image: '/images/yemek_odasi.png',
    hoverImage: '/evrensen/Aynalı Yemek Odası/WhatsApp Image 2025-09-01 at 11.44.04 (2).jpeg',
    fullRoomModelUrl: '/models/yemek-odasi-tam-takim.glb',
    description: 'Açılır mermer desenli yemek masası, 6 adet kadife kaplama sandalye ve gold detaylı aynalı konsol ünitesiyle kusursuz davet sofraları.',
    colors: [
      { name: 'Beyaz Mermer', hex: '#f2f2f0' },
      { name: 'Ceviz', hex: '#5c3a21' },
      { name: 'Doğal Meşe', hex: '#c5a880' },
      { name: 'Antrasit', hex: '#2c3038' },
      { name: 'Krem', hex: '#eae0c8' },
    ],
    dimensions: [
      { piece: 'Açılır Yemek Masası', size: '205 × 100 × 78 cm' },
      { piece: 'Konsol & Ayna', size: '210 × 48 × 85 cm' },
      { piece: 'Sandalye (6 Adet)', size: '52 × 55 × 88 cm' },
    ],
  },
  {
    id: 'imperator-koltuk',
    name: 'Venedik Kadife Oturma Grubu',
    nameEn: 'Venice Velvet Living Room Set',
    nameDe: 'Venedig Samt-Wohnzimmer-Set',
    category: 'Koltuk Takımı',
    price: 84900,
    oldPrice: 98000,
    badge: '3D TAM TAKIM',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    fullRoomModelUrl: '/models/oturma-grubu-tam-takim.glb',
    description: '35 DNS HR sünger, 1. sınıf fırınlanmış gürgen iskelet ve kolay silinebilir ithal kadife kumaşla 3+3+1+1 komple salon takımı.',
    colors: [
      { name: 'Zümrüt Yeşili', hex: '#164a38' },
      { name: 'Krem Boucle', hex: '#eae0c8' },
      { name: 'Safir Mavi', hex: '#1a365d' },
      { name: 'Antrasit', hex: '#2c3038' },
      { name: 'Bej', hex: '#dfd3c3' },
    ],
    dimensions: [
      { piece: "3'lü Ana Koltuk", size: '235 × 98 × 85 cm' },
      { piece: "2'li / 3'lü Yan Koltuk", size: '195 × 95 × 85 cm' },
      { piece: 'Tekli Berjer (2 Adet)', size: '82 × 85 × 92 cm' },
      { piece: 'Orta Sehpa', size: '120 × 70 × 42 cm' },
    ],
  },
  {
    id: 'buglem-yatak',
    name: 'Buğlem Kapitone Yatak Odası',
    nameEn: 'Buglem Tufted Bedroom Suite',
    nameDe: 'Buglem Gestepptes Schlafzimmer',
    category: 'Yatak Odası',
    price: 78400,
    oldPrice: 92000,
    badge: 'YENİ 2026',
    image: '/evrensen/Buğlem Yatak Odası/page1_img17.jpeg',
    hoverImage: '/images/yatak_odasi.png',
    fullRoomModelUrl: '/models/yatak-odasi-tam-takim.glb',
    description: 'Özel el işçiliği kapitone başlık, LED aydınlatmalı geniş gardırop ve şifonyer ünitesiyle zamansız konfor.',
    colors: [
      { name: 'Krem', hex: '#eae0c8' },
      { name: 'Doğal Meşe', hex: '#c5a880' },
      { name: 'Ceviz', hex: '#5c3a21' },
      { name: 'Antrasit', hex: '#2c3038' },
    ],
    dimensions: [
      { piece: 'Gardırop', size: '245 × 64 × 218 cm' },
      { piece: 'Yatak & Baza', size: '175 × 215 × 128 cm' },
      { piece: 'Şifonyer', size: '125 × 48 × 85 cm' },
    ],
  },
  {
    id: 'buglem-yemek',
    name: 'Buğlem Açılır Yemek Odası',
    nameEn: 'Buglem Extendable Dining Suite',
    nameDe: 'Buglem Ausziehbares Esszimmer',
    category: 'Yemek Odası',
    price: 72800,
    oldPrice: 86000,
    badge: 'İNEGÖL ÖZEL',
    image: '/evrensen/Buğlem Yemek Odası/page1_img18.jpeg',
    hoverImage: '/images/yemek_odasi.png',
    fullRoomModelUrl: '/models/yemek-odasi-tam-takim.glb',
    description: 'Pirinç detaylı ahşap ayaklar, geniş açılır masa tablası ve ergonomik sırt destekli 6 sandalye ile şık yemek odası.',
    colors: [
      { name: 'Ceviz', hex: '#5c3a21' },
      { name: 'Krem', hex: '#eae0c8' },
      { name: 'Antrasit', hex: '#2c3038' },
    ],
    dimensions: [
      { piece: 'Yemek Masası', size: '200 × 100 × 78 cm' },
      { piece: 'Konsol', size: '210 × 48 × 85 cm' },
    ],
  },
  {
    id: 'bohem-koltuk',
    name: 'Bohem Boucle Oturma Grubu',
    nameEn: 'Bohemian Boucle Sofa Set',
    nameDe: 'Boho Bouclé Wohnlandschaft',
    category: 'Koltuk Takımı',
    price: 68500,
    oldPrice: 79900,
    badge: 'TREND',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
    fullRoomModelUrl: '/models/oturma-grubu-tam-takim.glb',
    description: 'Doğal kayın ayaklar, yumuşak dokulu krem bukle kumaş ve modüler oturum derinliği ile modern yaşam alanları.',
    colors: [
      { name: 'Krem Boucle', hex: '#eae0c8' },
      { name: 'Bej', hex: '#dfd3c3' },
      { name: 'Doğal Meşe', hex: '#c5a880' },
      { name: 'Zümrüt Yeşili', hex: '#164a38' },
    ],
    dimensions: [
      { piece: "3'lü Kanepe", size: '230 × 96 × 84 cm' },
      { piece: "2'li Kanepe", size: '190 × 94 × 84 cm' },
      { piece: 'Berjer', size: '80 × 84 × 90 cm' },
    ],
  },
];

export const DEMO_THEMES: Record<string, DemoThemeConfig> = {
  'aura-luxe': {
    slug: 'aura-luxe',
    brandName: 'AURA LUXE MOBİLYA',
    tagline: 'Siyah & 24K Altın VIP Lüks Showroom',
    taglineEn: 'Black & 24K Gold VIP Luxury Furniture',
    taglineDe: 'Schwarz & 24K Gold VIP Luxusmöbel',
    styleLabel: 'VIP Lüks & İhracat Konsepti',
    targetAudience: 'Üst segment, ihracat ve lüks showroom müşterileri için',
    heroTitle: 'KARANLIKTA PARLAYAN İNEGÖL ZANAATI',
    heroSubtitle: '24K altın detaylı el işçiliği koleksiyonları, 3D Sanal Oda Planlayıcı ve Avrupa kapı teslim güvencesiyle keşfedin.',
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    whatsappPhone: '905077567887',
    botName: 'Aura VIP Asistan',
    isDark: true,
    bgPage: '#09090d',
    bgCard: '#12121a',
    bgSurface: '#181822',
    textPrimary: '#f8f7f4',
    textMuted: '#a1a1aa',
    accentHex: '#d4af37',
    accentTextHex: '#000000',
    borderClass: 'border-white/10',
    heroLayout: 'fullbleed',
    fontStyle: 'serif',
  },
  'nordika': {
    slug: 'nordika',
    brandName: 'NORDİKA İNEGÖL',
    tagline: 'İskandinav Minimalizm & Doğal Ahşap',
    taglineEn: 'Scandinavian Minimalism & Natural Oak',
    taglineDe: 'Skandinavischer Minimalismus & Natureiche',
    styleLabel: 'İskandinav Beyaz & Doğal Meşe',
    targetAudience: 'Ferah, modern, genç aile ve Avrupa tarzı arayan mağazalar için',
    heroTitle: 'SAFLIK, IŞIK VE DOĞAL MEŞE UYUMU',
    heroSubtitle: 'Minimalist çizgiler, nefes alan yaşam alanları. Mobilyalarınızı odanıza 3D sürükleyip yerleştirerek anında deneyimleyin.',
    heroImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    whatsappPhone: '905077567887',
    botName: 'Nordika Tasarım Robotu',
    isDark: false,
    bgPage: '#f9f8f6',
    bgCard: '#ffffff',
    bgSurface: '#f1efe9',
    textPrimary: '#1a1917',
    textMuted: '#6b675f',
    accentHex: '#2f483d',
    accentTextHex: '#ffffff',
    borderClass: 'border-neutral-200',
    heroLayout: 'split',
    fontStyle: 'sans',
  },
  'velvet-co': {
    slug: 'velvet-co',
    brandName: 'VELVET & CO. HOME',
    tagline: 'Zümrüt Yeşili & Krem Mimari Seçki',
    taglineEn: 'Emerald & Cream Architectural Selection',
    taglineDe: 'Smaragdgrün & Creme Architektur-Kollektion',
    styleLabel: 'Editoryal Zümrüt & Krem Butik',
    targetAudience: 'İç mimarlık ofisleri, tasarım odaklı butik markalar için',
    heroTitle: 'MİMARİ DOKUNUŞ, ZAMANSIZ ZARAFET',
    heroSubtitle: 'İtalyan kadife dokuları ve İnegöl el işçiliğinin editoryal birleşimi. Kumaş rengini 3D stüdyoda canlı değiştirin.',
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80',
    whatsappPhone: '905077567887',
    botName: 'Velvet İç Mimar Bot',
    isDark: true,
    bgPage: '#0b1914',
    bgCard: '#12261f',
    bgSurface: '#18332a',
    textPrimary: '#f5f2eb',
    textMuted: '#9eb8ae',
    accentHex: '#e2c275',
    accentTextHex: '#0b1914',
    borderClass: 'border-emerald-800/40',
    heroLayout: 'editorial',
    fontStyle: 'serif',
  },
  'sarayli': {
    slug: 'sarayli',
    brandName: 'SARAYLI KOLEKSİYON',
    tagline: 'Kraliyet Klasik & Şampanya Mermer',
    taglineEn: 'Royal Classic & Champagne Marble',
    taglineDe: 'Königliche Klassik & Champagner-Marmor',
    styleLabel: 'Avangart, Klasik & Düğün Paketi',
    targetAudience: 'Düğün paketleri, avangart ve klasik mobilya üreticileri için',
    heroTitle: 'GÖRKEMLİ YAŞAM ALANLARI, KUSURSUZ DÜĞÜN PAKETLERİ',
    heroSubtitle: 'Şampanya altın detaylar, masif oymalar ve tam takım 3D showroom ayrıcalığıyla Türkiye ve Avrupa’ya doğrudan fabrika teslimi.',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    whatsappPhone: '905077567887',
    botName: 'Saraylı Düğün Danışmanı',
    isDark: false,
    bgPage: '#fbf9f5',
    bgCard: '#ffffff',
    bgSurface: '#f4efe6',
    textPrimary: '#241c15',
    textMuted: '#786c5e',
    accentHex: '#b8860b',
    accentTextHex: '#ffffff',
    borderClass: 'border-amber-900/15',
    heroLayout: 'royal',
    fontStyle: 'serif',
  },
  'modaline': {
    slug: 'modaline',
    brandName: 'MODA LİNE ATÖLYE',
    tagline: 'Terracotta & Sıcak Bohem Tasarım',
    taglineEn: 'Terracotta & Warm Bohemian Studio',
    taglineDe: 'Terrakotta & Warmes Boho-Studio',
    styleLabel: 'Trend Bohem & Instagram Konsepti',
    targetAudience: 'Sosyal medyadan hızlı satış yapan dinamik, genç mobilya markaları için',
    heroTitle: 'EVİNİN ENERJİSİNİ YENİDEN TASARLA',
    heroSubtitle: 'Sıcak terracotta tonları, bukle kumaşlar ve tek dokunuşla WhatsApp & 6 taksit kolaylığı. Odanı 3D kendin diz!',
    heroImage: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1600&q=80',
    whatsappPhone: '905077567887',
    botName: 'ModaLine Akıllı Asistan',
    isDark: false,
    bgPage: '#fdf8f3',
    bgCard: '#ffffff',
    bgSurface: '#f6ebe0',
    textPrimary: '#2b1d16',
    textMuted: '#7a6155',
    accentHex: '#c25934',
    accentTextHex: '#ffffff',
    borderClass: 'border-orange-900/15',
    heroLayout: 'modern',
    fontStyle: 'sans',
  },
};

export const DEMO_THEME_LIST = Object.values(DEMO_THEMES);
