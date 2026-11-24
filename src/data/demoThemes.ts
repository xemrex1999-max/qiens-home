export interface ProductReview {
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
}

export interface DemoProduct {
  id: string;
  name: string;
  nameEn: string;
  nameDe: string;
  category: 'Yatak Odası' | 'Yemek Odası' | 'Koltuk Takımı';
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  image: string;
  hoverImage?: string;
  fullRoomModelUrl: string;
  description: string;
  colors: { name: string; hex: string }[];
  dimensions: { piece: string; size: string }[];
  reviews: ProductReview[];
}

export const STORE_REVIEWS: ProductReview[] = [
  {
    author: 'Selin & Mert K.',
    city: 'İstanbul / Kadıköy',
    rating: 5,
    date: '2 hafta önce',
    comment: 'İnegöl fabrikasından direkt aldık. 3D odada ölçüleri kontrol edip sipariş verdik, tam vaktinde gelip tertemiz kurdular.',
  },
  {
    author: 'Hakan Y.',
    city: 'Almanya / Köln',
    rating: 5,
    date: '3 hafta önce',
    comment: 'Avrupa kapı teslim ile 13 günde evimizin içine kadar hasarsız ulaştı. İşçilik ve ahşap kalitesi gerçekten kusursuz.',
  },
  {
    author: 'Zeynep A.',
    city: 'Ankara / Çankaya',
    rating: 5,
    date: '1 ay önce',
    comment: 'Düğün paketimizi tek seferde buradan seçtik. Kumaş dokusu ve renk uyumu fotoğraflardan bile daha güzel çıktı.',
  },
  {
    author: 'Emrah D.',
    city: 'İzmir / Karşıyaka',
    rating: 5,
    date: '1 ay önce',
    comment: 'Gardırop genişliğini odamıza göre özel 250 cm yaptırdık. Kurulum ekibi çok ilgiliydi, herkese gönül rahatlığıyla öneririm.',
  },
];

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
    rating: 4.9,
    reviewCount: 48,
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
    reviews: [
      { author: 'Büşra T.', city: 'Bursa', rating: 5, date: '10 gün önce', comment: 'Gardırop içi çok geniş, frenli menteşeler sessiz kapanıyor. Baza altı da devasa.' },
      { author: 'Murat E.', city: 'İstanbul', rating: 5, date: '3 hafta önce', comment: 'Doğal meşe rengini aldık, 1 saatte kurulumu tamamladılar. Çok memnunuz.' },
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
    rating: 4.9,
    reviewCount: 36,
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
    reviews: [
      { author: 'Derya S.', city: 'Ankara', rating: 5, date: '2 hafta önce', comment: 'Masa açıldığında 10 kişi çok rahat oturuyor, sandalyelerin sırt desteği harika.' },
      { author: 'Kerem Ö.', city: 'Almanya / Münih', rating: 5, date: '1 ay önce', comment: 'Münih’e sandıklı paketle sıfır çizikle geldi, konsol aynası salonu çok ferahlattı.' },
    ],
  },
  {
    id: 'imperator-koltuk',
    name: 'Limoon Bohem Bukle Koltuk Takımı',
    nameEn: 'Limoon Bohemian Boucle Sofa Set',
    nameDe: 'Limoon Boho Bouclé Wohnlandschaft',
    category: 'Koltuk Takımı',
    price: 84900,
    oldPrice: 98000,
    rating: 5.0,
    reviewCount: 61,
    badge: '3D TAM TAKIM',
    image: '/images/limoon-koltuk-takimi.jpg',
    hoverImage: '/images/limoon-3lu-koltuk.jpg',
    fullRoomModelUrl: '/models/limoon-koltuk-tam-takim.glb',
    description: 'Özel kolçak ahşap kapsül detaylı, masif ceviz bazalı, 35 DNS HR sünger ve kolay silinebilir krem bukle kumaşla 3+2+1+Sehpa komple salon takımı.',
    colors: [
      { name: 'Krem Boucle', hex: '#d8cbb8' },
      { name: 'Bej', hex: '#dfd3c3' },
      { name: 'Ceviz', hex: '#5c3a21' },
      { name: 'Zümrüt Yeşili', hex: '#164a38' },
      { name: 'Antrasit', hex: '#2c3038' },
    ],
    dimensions: [
      { piece: "3'lü Ana Koltuk", size: '235 × 98 × 85 cm' },
      { piece: "2'li Yan Koltuk", size: '185 × 96 × 85 cm' },
      { piece: 'Tekli Berjer', size: '84 × 86 × 86 cm' },
      { piece: 'Füme Cam Orta Sehpa', size: '125 × 70 × 44 cm' },
    ],
    reviews: [
      { author: 'Melis G.', city: 'İzmir', rating: 5, date: '1 hafta önce', comment: 'Kolçaktaki ahşap detaylar ve bukle kumaşı tek kelimeyle muazzam. Oturumu çok rahat.' },
      { author: 'Okan B.', city: 'Kocaeli', rating: 5, date: '3 hafta önce', comment: 'Gürgen iskelet ve ceviz baza kalitesi ağırlığından belli, 3D kamerayla odamızda deneyip aldık.' },
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
    rating: 4.8,
    reviewCount: 29,
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
    reviews: [
      { author: 'Esra N.', city: 'Antalya', rating: 5, date: '2 hafta önce', comment: 'Başlık kapitonesi ve krem rengi yatak odasına otel şıklığı kattı.' },
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
    rating: 4.9,
    reviewCount: 24,
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
    reviews: [
      { author: 'Tolga V.', city: 'Eskişehir', rating: 5, date: '3 hafta önce', comment: 'Ceviz tonu tam beklediğimiz gibi sıcak ve tok duruyor, paketleme özenliydi.' },
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
    rating: 4.9,
    reviewCount: 44,
    badge: 'TREND',
    image: '/images/limoon-3lu-koltuk.jpg',
    hoverImage: '/images/limoon-berjer.jpg',
    fullRoomModelUrl: '/models/limoon-koltuk-tam-takim.glb',
    description: 'Doğal ceviz ayaklar, ahşap kolçak kapsül detayı, yumuşak dokulu krem bukle kumaş ve modüler oturum derinliği ile modern yaşam alanları.',
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
    reviews: [
      { author: 'Ceren K.', city: 'İstanbul / Beşiktaş', rating: 5, date: '5 gün önce', comment: 'Krem bukle dokusu yumuşacık, salonumuz tamamen aydınlandı. Çok şık duruyor.' },
    ],
  },
];

export const DEMO_THEMES: Record<string, DemoThemeConfig> = {
  'aura-luxe': {
    slug: 'aura-luxe',
    brandName: 'AURA LUXE',
    tagline: 'Antrasit & Şampanya Altın Lüks Koleksiyon',
    taglineEn: 'Charcoal & Champagne Gold Luxury Collection',
    taglineDe: 'Anthrazit & Champagnergold Luxuskollektion',
    styleLabel: 'Lüks Mobilya & İhracat',
    targetAudience: 'Üst segment, ihracat ve lüks showroom müşterileri için',
    heroTitle: 'Zamansız İnegöl Zanaatı, Modern Lüks',
    heroSubtitle: 'Doğal ceviz, masif gürgen iskelet ve şampanya pirinç detaylarla hazırlanan özel koleksiyonları keşfedin.',
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    whatsappPhone: '905077567887',
    botName: 'Aura Danışman',
    isDark: true,
    bgPage: '#111114',
    bgCard: '#18181c',
    bgSurface: '#202026',
    textPrimary: '#f5f3ef',
    textMuted: '#a6a29a',
    accentHex: '#cbb07a',
    accentTextHex: '#111114',
    borderClass: 'border-white/10',
    heroLayout: 'fullbleed',
    fontStyle: 'serif',
  },
  'nordika': {
    slug: 'nordika',
    brandName: 'NORDİKA HOME',
    tagline: 'İskandinav Sade Tasarım & Doğal Meşe',
    taglineEn: 'Scandinavian Minimalism & Natural Oak',
    taglineDe: 'Skandinavischer Minimalismus & Natureiche',
    styleLabel: 'İskandinav Minimal Koleksiyon',
    targetAudience: 'Ferah, sade ve modern yaşam alanları arayan mağazalar için',
    heroTitle: 'Saflık, Işık ve Doğal Meşe Uyumu',
    heroSubtitle: 'Ferah çizgiler ve sıcak ahşap dokularla evinize huzur katan yeni nesil İnegöl mobilya seçkisi.',
    heroImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    whatsappPhone: '905077567887',
    botName: 'Nordika Danışman',
    isDark: false,
    bgPage: '#f8f7f4',
    bgCard: '#ffffff',
    bgSurface: '#efede7',
    textPrimary: '#1d1c1a',
    textMuted: '#6d6962',
    accentHex: '#2f453b',
    accentTextHex: '#ffffff',
    borderClass: 'border-stone-200',
    heroLayout: 'split',
    fontStyle: 'sans',
  },
  'velvet-co': {
    slug: 'velvet-co',
    brandName: 'VELVET & CO.',
    tagline: 'Derin Zümrüt & Pirinç Mimari Seçki',
    taglineEn: 'Deep Emerald & Brass Architectural Selection',
    taglineDe: 'Tiefes Smaragdgrün & Messing Kollektion',
    styleLabel: 'Mimari Butik Mobilya',
    targetAudience: 'İç mimarlık ofisleri ve tasarım odaklı butik markalar için',
    heroTitle: 'Mimari Dokunuş, Sakin Zarafet',
    heroSubtitle: 'İtalyan kadife dokuları ve el işçiliği ahşap detayların huzurlu buluşması.',
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80',
    whatsappPhone: '905077567887',
    botName: 'Velvet Danışman',
    isDark: true,
    bgPage: '#101d18',
    bgCard: '#162620',
    bgSurface: '#1d3029',
    textPrimary: '#f4f1ea',
    textMuted: '#a2b5ac',
    accentHex: '#d5be87',
    accentTextHex: '#101d18',
    borderClass: 'border-emerald-900/50',
    heroLayout: 'editorial',
    fontStyle: 'serif',
  },
  'sarayli': {
    slug: 'sarayli',
    brandName: 'SARAYLI HOME',
    tagline: 'Klasik Zarafet & Düğün Paketleri',
    taglineEn: 'Classic Elegance & Wedding Packages',
    taglineDe: 'Klassische Eleganz & Komplettpakete',
    styleLabel: 'Klasik & Düğün Paketleri',
    targetAudience: 'Düğün paketleri, klasik ve modern zarafet arayan mağazalar için',
    heroTitle: 'Şık Yaşam Alanları, Kusursuz Düğün Paketleri',
    heroSubtitle: 'Yatak odası, yemek odası ve oturma grubunu bir arada sunan fabrikadan doğrudan teslim koleksiyonlar.',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    whatsappPhone: '905077567887',
    botName: 'Saraylı Danışman',
    isDark: false,
    bgPage: '#faf8f4',
    bgCard: '#ffffff',
    bgSurface: '#f2ede4',
    textPrimary: '#241e18',
    textMuted: '#786f64',
    accentHex: '#9f7a34',
    accentTextHex: '#ffffff',
    borderClass: 'border-stone-200/90',
    heroLayout: 'royal',
    fontStyle: 'serif',
  },
  'modaline': {
    slug: 'modaline',
    brandName: 'MODA LİNE',
    tagline: 'Sıcak Terracotta & Modern Yaşam',
    taglineEn: 'Warm Terracotta & Modern Living',
    taglineDe: 'Warmes Terrakotta & Modernes Wohnen',
    styleLabel: 'Modern Bohem Mobilya',
    targetAudience: 'Dinamik, genç ve modern çizgili mobilya markaları için',
    heroTitle: 'Evinin Enerjisini Yeniden Tasarla',
    heroSubtitle: 'Yumuşak bukle kumaşlar, sıcak toprak tonları ve odana özel ölçülerle ferah mekanlar.',
    heroImage: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1600&q=80',
    whatsappPhone: '905077567887',
    botName: 'ModaLine Danışman',
    isDark: false,
    bgPage: '#faf6f1',
    bgCard: '#ffffff',
    bgSurface: '#f2e8dd',
    textPrimary: '#291f1a',
    textMuted: '#78655a',
    accentHex: '#b5583a',
    accentTextHex: '#ffffff',
    borderClass: 'border-stone-200',
    heroLayout: 'modern',
    fontStyle: 'sans',
  },
};

export const DEMO_THEME_LIST = Object.values(DEMO_THEMES);
