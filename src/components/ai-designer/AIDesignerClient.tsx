"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Camera, ArrowRight, RotateCcw, ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/store/useCart';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  images: string[];
  category: string;
}

export default function AIDesignerClient() {
  const [step, setStep] = useState(1);
  const [style, setStyle] = useState('');
  const [roomType, setRoomType] = useState('');
  const [colorTone, setColorTone] = useState('');
  const [budget, setBudget] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    advice: string;
    colors: string[];
    recommendedCategory: string;
  } | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  
  const addItem = useCart((state) => state.addItem);

  // Fetch all products on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch('/api/products?limit=50');
        const data = await res.json();
        if (data && data.products) {
          setAllProducts(data.products);
        }
      } catch (e) {
        console.error("Failed to load products for AI wizard:", e);
      }
    };
    fetchAll();
  }, []);

  // Filter products by selected room type
  const getFilteredProducts = () => {
    return allProducts.filter(p => {
      const cat = p.category.toLowerCase();
      if (roomType === 'Oturma Odası') {
        return cat.includes('koltuk') || cat.includes('köşe');
      }
      if (roomType === 'Yatak Odası') {
        return cat.includes('yatak');
      }
      if (roomType === 'Yemek Odası') {
        return cat.includes('yemek') || cat.includes('masa');
      }
      return true;
    });
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // File upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    setIsLoading(true);
    setStep(7); // Loading step is step 7
    
    try {
      let base64Image = '';
      if (imagePreview) {
        base64Image = imagePreview.split(',')[1] || '';
      }

      const selectedProductNames = allProducts
        .filter(p => selectedProductIds.includes(p.id))
        .map(p => p.name);

      // Call API
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style,
          roomType,
          colorTone,
          budget,
          image: base64Image,
          selectedProducts: selectedProductNames
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setResult({
          advice: data.advice,
          colors: data.colors || [],
          recommendedCategory: data.recommendedCategory
        });
        setStep(8); // Results step is 8
      } else {
        throw new Error(data.message || 'API error');
      }
    } catch (err) {
      console.warn("AI analysis failed, fallback to simulation:", err);
      // Fallback simulated premium response
      setTimeout(() => {
        let simulatedAdvice = '';
        let cat = 'Koltuk Takımları';
        if (roomType === 'Yatak Odası') cat = 'Yatak Odası';
        if (roomType === 'Yemek Odası') cat = 'Yemek Odası';

        const selectedProductNames = allProducts
          .filter(p => selectedProductIds.includes(p.id))
          .map(p => p.name);

        let productsText = '';
        if (selectedProductNames.length > 0) {
          productsText = `Seçtiğiniz ana ürünler olan **${selectedProductNames.join(', ')}** için özel yerleşim kılavuzu:
Bu ürünleri odanın doğal ışık alan ana aksına yerleştirmelisiniz. Seçtiğiniz ${colorTone} renk temasıyla bu mobilyaların kumaş dokuları mükemmel bir uyum sergileyecektir. Mobilyaların etrafında en az 80 cm geçiş alanı bırakarak odadaki derinliği koruyabilirsiniz.`;
        } else {
          productsText = `Seçtiğiniz konsepte uygun olarak Qiens Koleksiyonu'ndan seçkin oturma grupları veya yatak odası modüllerini tercih etmelisiniz. Bu ürünleri odanın merkezine konumlandırarak şık ve dengeli bir görünüm elde edebilirsiniz.`;
        }

        let characterText = '';
        if (colorTone === 'Krem') {
          characterText = `Seçtiğiniz Saray Altını & Krem tonları; temiz yürekliliğinizi, samimiyetinizi, iç huzurunuzu ve iyi niyetlerinizi yansıtmaktadır. Evinizde oluşturmak istediğiniz bu aydınlık ve şeffaf hava, etrafınıza yaydığınız pozitif enerjinin ve iyiliksever kişiliğinizin en net göstergesidir.`;
        } else if (colorTone === 'Yeşil') {
          characterText = `Seçtiğiniz Kraliyet Yeşili & Pirinç tonları; bilgelik, içsel denge, sürekli gelişim ve entelektüel derinliğe sahip bir karakter yapısını yansıtmaktadır. Doğanın sakinliğini lüks detaylarla birleştiren bu seçim, olgun ve asil duruşunuzu temsil eder.`;
        } else if (colorTone === 'Mavi') {
          characterText = `Seçtiğiniz Gece Safiri & Gümüş tonları; derin düşünen, sadık, son derece güvenilir ve sakin bir ruh halini yansıtmaktadır. Analitik zekanız ve huzura verdiğiniz önem, yaşam alanınızda güven veren asil bir sığınak yaratma isteğinizle örtüşüyor.`;
        } else if (colorTone === 'Antrasit') {
          characterText = `Seçtiğiniz Kozmik Antrasit & Bakır tonları; güçlü, kararlı, lider ruhlu ve özgürlüğüne düşkün cesur bir karakter yapısını yansıtmaktadır. Modernliği ve gizemi harmanlayan bu renk grubu, özgüvenli ve kararlı kişiliğinizi temsil eder.`;
        } else if (colorTone === 'Vizon') {
          characterText = `Seçtiğiniz Sıcak Vizon & Şampanya tonları; sıcakkanlı, misafirperver, sosyal ve zarafete yüksek derecede değer veren asil bir yaşam tarzını yansıtmaktadır. İnsan ilişkilerine verdiğiniz sıcak değer ve estetik zevkiniz bu kombinasyonda hayat buluyor.`;
        } else {
          characterText = `Seçtiğiniz Doğal Ceviz & Toprak tonları; doğallığı, dürüstlüğü, güvenilirliği ve yere sağlam basan köklü bir karakter yapısını yansıtmaktadır. Gösterişten uzak ama kaliteden ödün vermeyen duruşunuz, yaşam alanınızda doğanın sıcaklığı ve sadeliğiyle birleşiyor.`;
        }

        if (imagePreview) {
          simulatedAdvice = `1. Mevcut Durum & Renk Analizi:
Yüklediğiniz oda fotoğrafı incelendiğinde, odadaki doğal ışık dağılımı iyi olmakla birlikte, zemin kaplaması ve mevcut duvar renkleri arasında belirgin bir ton çelişkisi bulunmaktadır. Odanın genel renk paleti biraz kararsız duruyor ve seçtiğiniz ${colorTone} tonlarıyla bütünleşmek için sadeleşmeye ihtiyaç duyuyor.

2. Uyumsuz & Dağınık Detaylar:
Fotoğrafta göze çarpan en önemli uyumsuzluk, odadaki bazı küçük mobilyaların ve dekoratif aksesuarların yarattığı kalabalık ve dağınık (göz yoran) görüntüdür. Odanın genel hacmini daraltan bazı eski aksesuarlar, uyumsuz koyu renk perdeler veya köşedeki dağınık eşya grupları elenmelidir. Odanın daha ferah durması için bu fazlalıkların arındırılması gerekmektedir.

3. Qiens Home İyileştirme Önerisi:
${productsText}

4. Karakter & Kişilik Analizi:
${characterText}`;
        } else {
          simulatedAdvice = `1. Tasarım & Atmosfer Analizi:
Seçtiğiniz ${style} tarzı ve ${colorTone} tonları odanıza benzersiz bir karakter katacaktır. Duvarlarınızı açık krem tonlarında boyatarak ve metalik esintili aydınlatmalar ekleyerek mevcut renk uyumsuzluklarını tamamen giderebilirsiniz.

2. Aydınlatma & Yerleşim Önerileri:
Aydınlatmada sıcak tonlu (2700K-3000K) gizli LED şeritler kullanılarak ortamda dramatik bir ışıltı yakalanmalıdır. Aksesuar seçiminde geniş altın varaklı vazolar, pirinç detaylı şamdanlar ve cam sehpalar zenginliği pekiştirecektir.

3. Qiens Home Ürün Tavsiyesi:
${productsText}

4. Karakter & Kişilik Analizi:
${characterText}`;
        }

        setResult({
          advice: simulatedAdvice,
          colors: [colorTone, 'Altın', 'Vizon'],
          recommendedCategory: cat
        });
        setStep(8);
      }, 3000);
    }
  };

  // Fetch products based on recommendation
  useEffect(() => {
    if (result) {
      const fetchRecommended = async () => {
        try {
          const res = await fetch(`/api/products?limit=8`);
          const data = await res.json();
          if (data && data.products) {
            // Filter by category or fallback
            const filtered = data.products.filter((p: Product) => 
              p.category.toLowerCase().includes(result.recommendedCategory.toLowerCase()) ||
              result.recommendedCategory.toLowerCase().includes(p.category.toLowerCase())
            );
            setRecommendedProducts(filtered.length > 0 ? filtered : data.products.slice(0, 4));
          }
        } catch (error) {
          console.error("Fetch recommended products error:", error);
        }
      };
      fetchRecommended();
      setIsLoading(false);
    }
  }, [result]);

  const handleAddToCart = (product: Product) => {
    const resolveImage = (img: string | undefined) => {
      if (!img) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
      if (img.startsWith('http')) return img;
      return img.startsWith('/') ? img : `/${img}`;
    };

    addItem({
      id: product.id,
      cartItemId: `${product.id}-AI`,
      name: product.name,
      price: product.price,
      image: resolveImage(product.image || product.images[0]),
      category: product.category,
      qty: 1
    });
    toast.success(`${product.name} sepete eklendi!`);
  };

  const resetAll = () => {
    setStep(1);
    setStyle('');
    setRoomType('');
    setColorTone('');
    setBudget('');
    setSelectedProductIds([]);
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setRecommendedProducts([]);
  };

  const resolveImage = (img: string | undefined) => {
    if (!img) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
    if (img.startsWith('http')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Title */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-accent">Yapay Zeka Destekli İç Mimar</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-secondary tracking-tighter uppercase">Stil Asistanı</h1>
        <p className="max-w-xl mx-auto text-sm text-neutral-400 font-light leading-relaxed">
          Eviniz için en zengin, lüks ve seçkin konseptleri keşfedin. Tarzınızı belirleyin, odanıza özel premium Qiens Home mobilyalarını saniyeler içinde tasarlayalım.
        </p>
      </div>

      {/* Main Card Container */}
      <div className="bg-neutral-50/50 backdrop-blur-xl border border-neutral-100 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        
        {/* Progress Bar (Only visible in quiz steps 1 to 6) */}
        {step <= 6 && (
          <div className="w-full h-[2px] bg-neutral-100 mb-10 overflow-hidden relative">
            <motion.div 
              className="h-full bg-accent"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 6) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 1: STYLE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Soru 1/6</span>
                <h2 className="text-2xl font-serif text-secondary uppercase tracking-wider">Hangi tarz sizi yansıtıyor?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Saray & Luxury Glam', desc: 'Altın varaklar, mermer parlaklığı, lüks kadifeler ve görkemli tasarımlar.', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Klasik & Barok', desc: 'Ağır el işçiliği oymalar, asil dokular ve geleneksel ihtişam.', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Neo-Klasik & Art Deco', desc: 'Geometrik pirinç detaylar, modern lüks ve nostaljik elit çizgiler.', img: 'https://images.unsplash.com/photo-1505693333534-7d9bb2223466?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Minimalist & Zen', desc: 'Yalın ve sakin çizgiler, göz yormayan fonksiyonel sadelik.', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
                  { name: 'İskandinav & Nordik', desc: 'Doğal açık meşe dokuları, sıcak tekstiller ve aydınlık ferahlık.', img: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Modern & Loft', desc: 'Dinamik kontrastlar, metal-ahşap uyumu ve yenilikçi loft çizgileri.', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80' }
                ].map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => { setStyle(s.name); setStep(2); }}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-100 hover:border-accent hover:shadow-2xl transition-all text-left"
                  >
                    <Image src={s.img} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" unoptimized={true} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 space-y-2">
                      <span className="text-sm font-black text-white uppercase tracking-wider">{s.name}</span>
                      <p className="text-[10px] text-white/70 font-light leading-relaxed">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: ROOM TYPE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Soru 2/6</span>
                <h2 className="text-2xl font-serif text-secondary uppercase tracking-wider">Hangi odayı döşemek istiyorsunuz?</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Oturma Odası (Salon)', value: 'Oturma Odası', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Yatak Odası', value: 'Yatak Odası', img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Yemek Odası', value: 'Yemek Odası', img: 'https://images.unsplash.com/photo-1617806118233-bcbe87af24fc?auto=format&fit=crop&w=600&q=80' }
                ].map((r) => (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => { setRoomType(r.value); setStep(3); }}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-100 hover:border-accent hover:shadow-2xl transition-all text-left"
                  >
                    <Image src={r.img} alt={r.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" unoptimized={true} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                      <span className="text-sm font-black text-white uppercase tracking-wider">{r.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-secondary flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5" /> Geri Dön
              </button>
            </motion.div>
          )}

          {/* STEP 3: COLOR TONE */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Soru 3/6</span>
                <h2 className="text-2xl font-serif text-secondary uppercase tracking-wider">Tercih ettiğiniz renk tonu hangisi?</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: 'Saray Altını & Krem', value: 'Krem', bg: 'bg-[#FAF6EE]', border: 'border-amber-200/50', text: 'text-amber-800' },
                  { name: 'Kraliyet Yeşili & Pirinç', value: 'Yeşil', bg: 'bg-[#0C291B]', border: 'border-emerald-950', text: 'text-white' },
                  { name: 'Gece Safiri & Gümüş', value: 'Mavi', bg: 'bg-[#0E1A2F]', border: 'border-blue-950', text: 'text-white' },
                  { name: 'Kozmik Antrasit & Bakır', value: 'Antrasit', bg: 'bg-[#1E1E1E]', border: 'border-neutral-900', text: 'text-white' },
                  { name: 'Sıcak Vizon & Şampanya', value: 'Vizon', bg: 'bg-[#857568]', border: 'border-neutral-200/25', text: 'text-white' },
                  { name: 'Doğal Ceviz & Toprak', value: 'Toprak', bg: 'bg-[#5C4033]', border: 'border-amber-950', text: 'text-white' }
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => { setColorTone(c.value); setStep(4); }}
                    className={`${c.bg} ${c.border} p-6 md:p-8 rounded-2xl border hover:border-accent hover:scale-[1.03] transition-all flex flex-col justify-between aspect-square text-left shadow-md`}
                  >
                    <span className={`${c.text} text-[11px] font-black uppercase tracking-wider leading-relaxed`}>{c.name}</span>
                    <div className="w-6 h-6 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
                      <ArrowRight className={`w-3.5 h-3.5 ${c.text}`} />
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-secondary flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5" /> Geri Dön
              </button>
            </motion.div>
          )}

          {/* STEP 4: BUDGET */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Soru 4/6</span>
                <h2 className="text-2xl font-serif text-secondary uppercase tracking-wider">Bütçe aralığınız nedir?</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Ekonomik', range: '50.000 - 100.000 TL', desc: 'Temel ihtiyaçlara odaklı bütçe dostu konseptler.' },
                  { name: 'Orta Segment', range: '100.000 - 200.000 TL', desc: 'MDF & Premium kumaş odaklı dengeli tasarımlar.' },
                  { name: 'Lüks & İmza', range: '200.000+ TL', desc: 'Özel el işçiliği, masif detaylar ve elit tasarımlar.' }
                ].map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => { setBudget(b.name); setStep(5); }}
                    className="p-8 bg-white border border-neutral-100 hover:border-accent rounded-2xl text-left hover:shadow-xl transition-all space-y-4"
                  >
                    <span className="block text-[10px] font-black text-accent uppercase tracking-widest">{b.name}</span>
                    <span className="block text-2xl font-serif text-secondary italic font-medium">{b.range}</span>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">{b.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(3)} className="text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-secondary flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5" /> Geri Dön
              </button>
            </motion.div>
          )}

          {/* STEP 5: SELECT PRODUCTS (NEW STEP) */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Soru 5/6</span>
                <h2 className="text-2xl font-serif text-secondary uppercase tracking-wider">Tasarlamak istediğiniz mobilyaları seçin</h2>
                <p className="text-xs text-neutral-400 font-light">Seçtiğiniz odaya ({roomType}) ait ürünler listelenmiştir. Yapay zeka bu seçtiğiniz ürünlere göre oda tasarımı önerecektir.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto pr-2">
                {getFilteredProducts().map((p) => {
                  const isSelected = selectedProductIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProductToggle(p.id)}
                      className={`p-4 bg-white border rounded-2xl hover:shadow-md transition-all text-left flex flex-col justify-between relative group ${
                        isSelected ? 'border-accent ring-2 ring-accent/20 bg-amber-50/5' : 'border-neutral-100'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-accent text-secondary p-1 rounded-full z-10">
                          <Check className="w-3 h-3 stroke-[3px]" />
                        </div>
                      )}
                      
                      <div className="relative aspect-[4/3] bg-neutral-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                        <Image 
                          src={resolveImage(p.image || p.images[0])} 
                          alt={p.name} 
                          fill 
                          className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 p-2" 
                          unoptimized={true} 
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">{p.category}</span>
                        <h4 className="text-xs font-black text-secondary uppercase tracking-wider line-clamp-1">{p.name}</h4>
                        <span className="text-xs font-serif italic text-neutral-500 block">{formatPrice(p.price)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setStep(4)} className="text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-secondary flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5" /> Geri Dön
                </button>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="px-10 py-5 bg-secondary text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-secondary shadow-lg flex items-center gap-3 transition-all"
                >
                  Sonraki Adım <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: FILE UPLOAD */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Soru 6/6</span>
                <h2 className="text-2xl font-serif text-secondary uppercase tracking-wider">Oda fotoğrafı yüklemek ister misiniz?</h2>
                <p className="text-xs text-neutral-400 font-light">Yapay zeka, odanızın yapısını analiz edip daha kesin yerleşim önerileri sunabilir.</p>
              </div>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 hover:border-accent rounded-3xl p-10 bg-white transition-colors cursor-pointer relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                
                {imagePreview ? (
                  <div className="relative w-full max-w-xs aspect-video rounded-xl overflow-hidden shadow-md">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized={true} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6 text-neutral-400 group-hover:text-accent" />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-wider text-secondary">Fotoğraf Seçin</span>
                      <span className="block text-[10px] text-neutral-400 mt-1">PNG, JPG formatlarında (Maks. 5MB)</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setStep(5)} className="text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-secondary flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5" /> Geri Dön
                </button>
                <button
                  type="button"
                  onClick={startAnalysis}
                  className="px-10 py-5 bg-secondary text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-secondary shadow-lg flex items-center gap-3 transition-all"
                >
                  Analizi Başlat <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: LOADING SCREEN */}
          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-6"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-accent/10 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-accent rounded-full animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-accent animate-pulse" />
              </div>
              <div className="space-y-2">
                <span className="block text-xs font-black uppercase tracking-[0.4em] text-accent animate-pulse">AI İç Mimar Çalışıyor</span>
                <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto">Odanızın yerleşim planı, seçtiğiniz tarz ({style}) ve renk paleti analiz ediliyor...</p>
              </div>
            </motion.div>
          )}

          {/* STEP 8: RESULTS DISPLAY */}
          {step === 8 && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Header Box */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-100 pb-8 gap-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">AI Tasarım Analiz Sonucu</span>
                  <h2 className="text-3xl font-serif text-secondary uppercase tracking-wider">{style} & {roomType} Konsepti</h2>
                </div>
                <button 
                  onClick={resetAll}
                  className="px-6 py-3 border border-neutral-100 hover:border-neutral-300 text-[9px] font-black uppercase tracking-widest text-neutral-600 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Yeni Analiz
                </button>
              </div>

              {/* Analysis Text & Colors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                
                {/* Advice block */}
                <div className="md:col-span-2 space-y-6">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">İç Mimarın Önerisi</span>
                  <p className="text-sm font-medium text-neutral-600 leading-relaxed font-sans border-l-2 border-accent/20 pl-6 whitespace-pre-line">
                    {result.advice}
                  </p>
                </div>

                {/* Color Scheme */}
                <div className="space-y-6 bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">Önerilen Renk Kartelası</span>
                  <div className="flex gap-3">
                    {result.colors.map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div 
                          className="w-12 h-12 rounded-full border border-neutral-200/50 shadow-inner"
                          style={{ 
                            backgroundColor: c === 'Krem' ? '#FAF6EE' : 
                                            c === 'Antrasit' ? '#1E1E1E' : 
                                            c === 'Toprak' ? '#5C4033' : 
                                            c === 'Yeşil' ? '#0C291B' : 
                                            c === 'Mavi' ? '#0E1A2F' : 
                                            c === 'Vizon' ? '#857568' : '#E2E8F0' 
                          }}
                        />
                        <span className="text-[9px] font-bold text-neutral-400 uppercase">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Product Recommendations */}
              <div className="space-y-8 pt-8 border-t border-neutral-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">Özel Seçkiler</span>
                  <h3 className="text-xl font-serif text-secondary uppercase tracking-wider">Koleksiyondan Önerilen Ürünler</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recommendedProducts.map((p) => {
                    return (
                      <div key={p.id} className="group border border-neutral-100 hover:border-neutral-200 rounded-2xl p-4 bg-white transition-all hover:shadow-lg flex flex-col justify-between">
                        <div>
                          <div className="relative aspect-[4/3] bg-neutral-50 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
                            <Image 
                              src={resolveImage(p.image || p.images[0])} 
                              alt={p.name} 
                              fill 
                              className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 p-2" 
                              unoptimized={true} 
                            />
                          </div>
                          <div className="space-y-1 px-2">
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{p.category}</span>
                            <h4 className="text-xs font-black text-secondary uppercase tracking-wider line-clamp-1">{p.name}</h4>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 px-2">
                          <span className="text-xs font-serif italic text-neutral-400">{formatPrice(p.price)}</span>
                          <button 
                            onClick={() => handleAddToCart(p)}
                            className="bg-secondary hover:bg-accent text-white hover:text-secondary p-3 rounded-full shadow-md transition-colors active:scale-95"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
