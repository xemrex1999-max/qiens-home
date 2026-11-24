"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Copy, Check, Instagram, Sparkles, Box, Camera, ArrowLeft,
  ArrowUpRight, MessageCircle, Layers, ShieldCheck, Globe, Video
} from 'lucide-react';

const BIO_OPTIONS = [
  {
    title: 'Seçenek 1: Doğrudan İnegöl & Üretici Odaklı (Önerilen)',
    text: `🛋️ Mobilya Üreticilerine Özel 3D Web & AR Showroom
📸 Fotoğraftan Birebir 3D Modelleme (Stüdyo Çekimsiz)
📱 Tek Tek Seç & Odanın Köşesine Yerleştir (Sabit Ölçek AR)
🌍 TR / EN / DE Avrupa İhracat & 48 Saatte Teslim
👇 Canlı 3D Stüdyo & 5 Demo Siteyi Test Edin`,
  },
  {
    title: 'Seçenek 2: Prestij & Teknoloji Ajansı Odaklı',
    text: `✨ EMRE WEB & 3D | Yeni Nesil Mobilya E-Ticaret Sistemleri
🧊 Gardırop Kapağı & Baza Açılır 3D Oda Planlayıcı
📷 Arka Kamerayla Mobilyayı Tek Tek Evin Köşesine Koy
🚀 Evseren Mobilya • Limoon Home • Qiens 3D Referanslı
📲 Ücretsiz Demo & Fiyat Listesi İçin DM / WhatsApp`,
  },
  {
    title: 'Seçenek 3: Kısa & Net Satış Odaklı',
    text: `🏆 Mobilya Mağazanızı 48 Saatte 3D Showroom’a Taşıyoruz
🔹 Ürün Fotoğrafından 3D (.GLB) Model Üretimi
🔹 Telefonda Büyümeyen 1:1 Sabit Ölçekli Kamera AR
🔹 Mevcut Sitenizi Kırmadan 3D Entegrasyon (10.000 ₺'den Başlayan Paketler)
👇 Canlı Demolar:`,
  },
];

const POST_PLANS = [
  {
    no: 'POST #1 (Sabitlenecek Ana Reels)',
    type: '9:16 Reels Video (Masaüstündeki INEGOL_3D_MOBILYA_REELS.mp4)',
    hook: 'Müşteriniz koltuk takımını satın almadan önce kendi salonunun köşesine tek tek yerleştirebilseydi satışlarınız ne kadar artardı?',
    caption: `Sıradan katalog siteleri artık mobilya sattırmıyor. Müşteri "Acaba bu berjer şu köşeye sığar mı, koltuk salonumu daraltır mı?" diye düşünürken siteden çıkıyor.

Yeni kurduğumuz 2026 Sabit Ölçekli 3D & Kamera AR sistemiyle:
✅ Müşteri telefonunun arka kamerasını tam ekran açar.
✅ Bütün oda karmaşık şekilde ekrana yığılmaz; üst menüden önce "Tekli Berjer"e tıklar, gelen berjeri parmağıyla odasının köşesine yerleştirir.
✅ Sonra yukarıdan "1. İkili Koltuk" ve "2. İkili Koltuk"u seçip diğer köşelere sabitler.
✅ Sabit Ölçek Kilidi (ar-scale="fixed") sayesinde ürün ekranda sürüklenirken asla kendi kendine büyümez veya bozulmaz!

Stüdyo çekimine gerek kalmadan, sadece ürün fotoğraflarınızdan 48 saatte 3D modellerinizi üretip sitenize entegre ediyoruz.

📩 Firmanıza özel canlı demo görmek için DM'den "DEMO" yazın veya profildeki WhatsApp hattımızdan ulaşın.

#inegölmobilya #mobilyatasarım #3dshowroom #artırılmışgerçeklik #mobilyaeticaret #imosab #mobilyaüretimi #3dmobilya`,
  },
  {
    no: 'POST #2 (Sabitlenecek Önce / Sonra Kaydırmalı Post)',
    type: 'Kaydırmalı Görsel (1. Kare: Limoon Koltuk Fotoğrafı -> 2. Kare: 3D Model -> 3. Kare: Kamerada Köşeye Yerleştirme)',
    hook: 'Stüdyo Yok, Kameraman Yok! Tek Bir Ürün Fotoğrafından 3D Modele ve Canlı Kamera AR’ye Geçiş.',
    caption: `İnegöl'deki mobilya üreticilerimizin en çok sorduğu soru: "3D modelleme için ürünleri stüdyoya mı taşıyacağız?"

Cevap: HAYIR! ❌
Limoon Home için yaptığımız çalışmada olduğu gibi, mevcut ürün fotoğraflarınızın arka planını ayıklıyor; kolçaktaki ahşap kapsül detayından ceviz ayaklara, düğmeli sırt minderlerinden füme camlı orta sehpaya kadar birebir 3D (.GLB) modele dönüştürüyoruz.

Üstelik mevcut web sitenizi hiç bozmadan sol alt köşeye "🧊 3D Showroom" butonu olarak tek satır kodla ekliyoruz.

📦 Başlangıç Paketi (Mevcut Site Onarımı + 3D Showroom + 3 Takım 3D Model): Sadece 10.000 ₺!
📲 Detaylı fiyat listesi PDF'imiz için DM'den yazabilirsiniz.

#inegölmobilya #limoonhome #3dmodelleme #mobilyafuarı #inegöl #mobilyamağazası #websitesi`,
  },
  {
    no: 'POST #3 (Sabitlenecek 5 Farklı Site Mimarisi Tanıtımı)',
    type: 'Ekran Kaydı / Carousel (5 Farklı Demo Mağaza: Aura Luxe, Nordika, Velvet & Co, Saraylı, Moda Line)',
    hook: 'Her Mobilya Markasının Ruhu Farklıdır: Birbirinin Kopyası Değil, 5 Tamamen Farklı E-Ticaret Mimarisi!',
    caption: `Avangard satan mağaza ile modern bohem satan mağaza aynı web sitesini kullanamaz.

İnegöl üreticileri için hazırladığımız 5 özgün mimari:
1️⃣ AURA LUXE: Antrasit & Şampanya Altın VIP İhracat Konsepti
2️⃣ NORDİKA HOME: Ferah İskandinav & Doğal Meşe Konsepti
3️⃣ VELVET & CO.: Zümrüt Yeşili & Pirinç İç Mimarlık Butik Konsepti
4️⃣ SARAYLI HOME: 12 Taksit Hesaplayıcılı Klasik & Düğün Paketi Konsepti
5️⃣ MODA LİNE: Modern Bohem & Canlı 3D Stüdyo Konsepti

Hepsinde 3D Oda Planlayıcı, Tek Tek Köşeye Kamera AR, Avrupa Kapı Teslim Hesaplayıcı ve 7/24 Yapay Zeka Satış Robotu hazır!

👇 Profildeki linkten 5 demoyu da telefonunuzda canlı test edin.

#mobilyawebtasarım #eticaret #inegölmobilyacılar #düğünpaketi #koltuktakımı #yatakodası`,
  },
  {
    no: 'POST #4 (Kapak & Baza Açılır 3D Yatak Odası Reels)',
    type: 'Reels Ekran Kaydı (3D Odada Gardırop Kapaklarının ve Yatak Bazasının Açılması + Özel Ölçü)',
    hook: 'Müşteriniz 6 kapaklı gardırobun içindeki askılığı ve bazanın altındaki sandığı telefondan açıp görebiliyor mu?',
    caption: `Yatak odası alan müşteri sadece dış görünüşe bakmaz; "Dolabın içi nasıl, rafı kaç tane, bazası açılıyor mu, 240 cm dolap benim duvarıma sığar mı?" diye sorar.

Tylko tarzı Parametrik 3D Oda Stüdyomuzda:
🚪 Gardıırop kapaklarına dokununca kapaklar açılır, iç raflar ve askılık görünür.
🛏️ Yatağa dokununca amortisörlü baza yukarı kalkar, sandık içi görünür.
📏 Müşteri dolap genişliğini 210 cm'den 250 cm'ye çektiğinde kapak sayısı ve özel üretim fiyatı saniyesinde hesaplanır, tek tıkla WhatsApp'ınıza ölçü listesi olarak düşer!

#yatakodasıtakımı #gardirop #3doda #mobilyaüreticisi #inegöl #içmimarlık`,
  },
  {
    no: 'POST #5 (Avrupa İhracat & Gurbetçi Satış Sistemi)',
    type: 'Görsel / Reels (Almanya, Hollanda, Fransa, Belçika Kapı Teslim & Konteyner Hesaplayıcı)',
    hook: 'Almanya ve Hollanda’daki gurbetçi müşteriye WhatsApp’tan saatlerce kargo fiyatı hesaplama devri bitti.',
    caption: `İnegöl’den Avrupa’ya mobilya satarken en büyük engel: "Almanya Köln’e kargo ve gümrük dahil kaça gelir?" sorusu.

Sitenize entegre ettiğimiz Avrupa İhracat & B2B Bayi Modülü ile:
🇩🇪🇳🇱🇫🇷🇧🇪🇦🇹🇨🇭 Ülke seçildiği anda m³ hacim, gümrük dahil kapı teslim nakliye ücreti ve teslim süresi (10–16 gün) Euro (€) olarak otomatik hesaplanır.
🚢 Toptan bayileriniz ise 20ft, 40ft HC konteyner veya Tır doluluk oranını canlı görerek tek tıkla proforma sipariş geçer.

#mobilyaihracat #avrupamobilya #almanyamobilya #inegölihracat #imosab #b2bmobilya`,
  },
];

const DM_TEMPLATES = [
  {
    title: 'DM Şablonu 1: Mevcut Sitesi Olan Mobilya Firmalarına (10.000 ₺ Paket İçin)',
    text: `Merhaba, hayırlı işler dilerim. İnegöl'de mobilya markalarına özel "Tek Tek Köşeye Yerleştirme Kamera AR ve 3D Showroom" sistemleri kuruyoruz. Sitenizi inceledim; mevcut sitenizi hiç bozmadan ürün fotoğraflarınızdan 3 ana takımınızı 3D modele çevirip müşterilerinizin telefon kamerasıyla kendi odalarının köşelerine tek tek yerleştirebileceği 3D Showroom butonunu 48 saatte entegre edebiliyoruz. Limoon Home ve Evseren Mobilya için yaptığımız canlı örneği 30 saniye incelemeniz için buradan gönderebilir miyim?`,
  },
  {
    title: 'DM Şablonu 2: Sitesi Olmayan veya Eski Olan Üreticilere (25.000 ₺ Paket İçin)',
    text: `Merhaba, hayırlı işler. Koleksiyonlarınız gerçekten çok şık ancak müşteriler artık ürünleri satın almadan önce telefon kamerasıyla kendi salonunun köşesine tek tek koyup ölçüsünü görmek istiyor. Stüdyo çekimine gerek kalmadan sadece mevcut ürün fotoğraflarınızdan 10 takımınızı 3D modele dönüştürüp, kapakları/bazası açılan 3D Oda Planlayıcılı ve Avrupa ihracat modüllü yeni nesil web sitenizi 48 saatte anahtar teslim kuruyoruz. Sizin tarzınıza uygun hazırladığımız canlı demo linkini paylaşmamı ister misiniz?`,
  },
  {
    title: 'DM Şablonu 3: İMOSAB & İhracat Yapan Fabrikalara (VIP Paket İçin)',
    text: `Merhaba, İnegöl'den Avrupa'ya ihracat yapan fabrikalarımız için TR/EN/DE 3 dilli, gerçek santim ölçek kilitli (ar-scale="fixed") 3D Showroom, ülke bazlı Avrupa kapı teslim lojistik hesaplayıcı ve 40ft HC konteyner B2B bayi sipariş modülü geliştirdik. Fabrikanızın ismiyle çalışan canlı 3D demoyu incelemeniz için özel linkinizi iletebilir miyim?`,
  },
];

const AR_RESEARCH_TABLE = [
  {
    tech: '1. IKEA Kreativ Tarzı Çoklu Parça Kamera AR',
    problemSolved: 'Bütün takımın ekrana bir anda yığılması ve telefonda sürüklerken ürünün kendi kendine büyümesi sorunu.',
    ourImplementation: 'Kamera açıldığında ekran boş başlar. Müşteri üstten önce "Tekli Berjer"e tıklar, sabit ölçekle köşeye koyar; sonra "1. İkili Koltuk"a tıklayıp diğer köşeye koyar. Perspektif mesafe telafisi ve OrbitControls kilidiyle ürün asla büyümez.',
    status: 'CANLI & AKTİF',
  },
  {
    tech: '2. Apple AR Quick Look & Google Scene Viewer (ar-scale="fixed")',
    problemSolved: 'Telefonda iki parmakla dokunulduğunda koltuğun devleşmesi veya küçülmesi.',
    ourImplementation: 'Tüm <model-viewer> bileşenlerine ar-scale="fixed" ve ar-placement="floor" mühendislik kilidi eklendi. iOS ve Android lazer tarayıcıda ürün 1:1 gerçek santim ölçüsünde çivilenir.',
    status: 'CANLI & AKTİF',
  },
  {
    tech: '3. Tylko Tarzı Parametrik 3D Oda & Açılır Mekanizma',
    problemSolved: 'Müşterinin dolap içini, baza sandığını görememesi ve özel ölçü fiyatını sorup beklemesi.',
    ourImplementation: 'Three.js gerçek zamanlı 3D sahnede gardırop kapakları, çekmeceler, amortisörlü baza ve açılır yemek masası animasyonla açılır; özel santim girildiğinde fiyat anında güncellenir.',
    status: 'CANLI & AKTİF',
  },
  {
    tech: '4. Stüdyosuz Fotoğraftan 3D (.GLB) PBR Modelleme Hattı',
    problemSolved: 'Tripo vb. araçların ücretsiz planda indirmeyi kilitlemesi ve stüdyo çekim maliyetinin yüksekliği.',
    ourImplementation: 'Kendi yerel Blender 4.3 Python PBR üretim hattımızla ürün fotoğraflarından <5 MB yüksek hızlı .GLB modelleri ücretsiz, sınırsız ve doğrudan indirilebilir olarak üretiyoruz.',
    status: 'CANLI & AKTİF',
  },
];

export default function InstagramKitiPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#08090e] text-white py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#12131c] border border-white/10 rounded-3xl p-5 sm:p-7">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Instagram size={14} /> EMRE WEB &amp; 3D • INSTAGRAM KURULUM &amp; 2026 AR REHBERİ
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black">
              Instagram Hesap Kurulum Kiti &amp; En İyi 3D/AR Sistemleri
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
              Instagram hesabını açarken kullanacağın hazır biyografiler, öne çıkanlar, ilk 5 gönderi/Reels metni,
              mobilyacılara atılacak DM şablonları ve sistemimize entegre ettiğimiz 2026 dünya standardı AR teknolojileri.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/ajans"
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Ajans Ana Sayfa
            </Link>
            <Link
              href="/embed/showroom?firma=L%C4%B0MOON%20HOME"
              className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-white text-black text-xs font-black flex items-center gap-1.5"
            >
              Canlı Kamera AR Stüdyosu <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* SECTION 1: 2026 WORLD-CLASS AR & 3D BENCHMARK TABLE */}
        <section className="bg-[#11121a] border border-amber-400/30 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
              ARAŞTIRMA &amp; UYGULAMA RAPORU
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black">
              2026 Dünyadaki En İyi 4 Mobilya AR &amp; 3D Teknolojisi (Sitemize Entegre Edildi)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AR_RESEARCH_TABLE.map((row) => (
              <div key={row.tech} className="bg-black/45 border border-white/10 rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-black text-amber-300">{row.tech}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                    {row.status}
                  </span>
                </div>
                <p className="text-xs text-red-300/90">
                  <strong>Çözdüğü Sorun:</strong> {row.problemSolved}
                </p>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  <strong>Bizim Sistemimizdeki Çözüm:</strong> {row.ourImplementation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: INSTAGRAM USERNAME, BIO & HIGHLIGHTS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#11121a] border border-white/10 rounded-3xl p-6 space-y-5">
            <h2 className="text-lg font-black text-amber-400">1. Kullanıcı Adı (@) &amp; Öne Çıkanlar</h2>
            <div className="space-y-2">
              <div className="text-xs font-bold text-neutral-300">Önerilen Instagram Kullanıcı Adları:</div>
              <div className="flex flex-wrap gap-2">
                {['@emreweb3d', '@inegol3dshowroom', '@mobilya3dstudio', '@emredijital3d', '@3dmobilyaajansi'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => copyText(u, u)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-black border border-white/10 text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{u}</span>
                    {copiedKey === u ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-xs font-bold text-neutral-300">Öne Çıkanlar (Highlights) Başlıkları:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  '📷 Odanda Gör AR',
                  '🛋️ Foto -> 3D',
                  '💻 5 Demo Site',
                  '💰 Fiyat & Paket',
                  '🏆 Referanslar',
                  '🌍 Avrupa İhracat',
                ].map((h) => (
                  <div key={h} className="p-2.5 rounded-xl bg-black/40 border border-white/10 font-semibold text-neutral-200">
                    {h}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-xs font-bold text-neutral-300">Biyografi (Website) Linki:</div>
              <div className="p-3 rounded-xl bg-black/50 border border-amber-400/30 flex items-center justify-between gap-2">
                <code className="text-xs text-amber-300 truncate">https://qiens-home.vercel.app/ajans</code>
                <button
                  type="button"
                  onClick={() => copyText('bio-url', 'https://qiens-home.vercel.app/ajans')}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-black text-xs font-bold cursor-pointer"
                >
                  {copiedKey === 'bio-url' ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#11121a] border border-white/10 rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-black text-amber-400">2. Hazır Instagram Biyografi (Bio) Metinleri</h2>
            {BIO_OPTIONS.map((b, idx) => (
              <div key={b.title} className="p-4 rounded-2xl bg-black/45 border border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white">{b.title}</span>
                  <button
                    type="button"
                    onClick={() => copyText(`bio-${idx}`, b.text)}
                    className="px-3 py-1 rounded-full bg-amber-400 hover:bg-white text-black text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === `bio-${idx}` ? <Check size={12} /> : <Copy size={12} />}
                    {copiedKey === `bio-${idx}` ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
                <pre className="text-xs text-neutral-300 whitespace-pre-wrap font-sans leading-relaxed">{b.text}</pre>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: FIRST 5 POSTS & REELS CAPTIONS */}
        <section className="bg-[#11121a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                KOPYALA &amp; PAYLAŞ
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black">
                İlk 5 Instagram Gönderi &amp; Reels Açıklama Metni
              </h2>
            </div>
            <Link
              href="/reels-studyo"
              className="px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold flex items-center gap-1.5"
            >
              <Video size={14} /> 9:16 Reels Stüdyosunu Aç
            </Link>
          </div>

          <div className="space-y-4">
            {POST_PLANS.map((post, idx) => (
              <div key={post.no} className="p-5 rounded-2xl bg-black/45 border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-black text-amber-400">{post.no}</span>
                    <span className="ml-2 text-xs text-neutral-400">• {post.type}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(`post-${idx}`, post.caption)}
                    className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-white text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === `post-${idx}` ? <Check size={13} /> : <Copy size={13} />}
                    {copiedKey === `post-${idx}` ? 'Açıklama Kopyalandı' : 'Açıklamayı Kopyala'}
                  </button>
                </div>
                <div className="text-xs font-semibold text-emerald-300">
                  🎯 Kapak / İlk Saniye Kancası: &ldquo;{post.hook}&rdquo;
                </div>
                <pre className="p-3.5 rounded-xl bg-black/60 border border-white/5 text-xs text-neutral-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {post.caption}
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: DM OUTREACH TEMPLATES FOR FURNITURE FACTORIES */}
        <section className="bg-[#11121a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-serif font-black text-amber-400">
            İnegöl Mobilya Firmalarına Gönderilecek Hazır DM / WhatsApp Mesajları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DM_TEMPLATES.map((dm, idx) => (
              <div key={dm.title} className="p-5 rounded-2xl bg-black/45 border border-white/10 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-white">{dm.title}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">{dm.text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(`dm-${idx}`, dm.text)}
                  className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === `dm-${idx}` ? <Check size={13} /> : <Copy size={13} />}
                  {copiedKey === `dm-${idx}` ? 'Mesaj Kopyalandı' : 'Mesajı Kopyala'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
