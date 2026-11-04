"use client"

import React from 'react'
import { Truck, RotateCcw, AlertTriangle, ShieldCheck, MapPin, PackageCheck, Mail } from 'lucide-react'

const DeliveryReturnPage = () => {
  return (
    <div className="bg-white min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="space-y-4 border-b border-neutral-100 pb-12 text-center md:text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Müşteri Hizmetleri</span>
          <h1 className="text-4xl md:text-6xl font-serif text-secondary tracking-tighter">Teslimat & İade Politikası</h1>
          <p className="text-neutral-400 text-sm max-w-2xl font-light leading-relaxed mx-auto md:mx-0">
            Siparişinizin kapınıza ulaşmasından, olası iade süreçlerine kadar her aşamada şeffaflık ve güven sözü veriyoruz.
          </p>
        </header>

        <section className="space-y-24">
          {/* LOGistics */}
          <div className="space-y-10 group">
            <div className="flex items-center justify-center md:justify-start gap-6 text-accent">
               <div className="p-4 bg-neutral-50 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all">
                  <Truck size={32} strokeWidth={1} />
               </div>
               <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">1. Teslimat Süreci ve Lojistik</h2>
            </div>
            <div className="space-y-6 pl-0 md:pl-20 border-l-0 md:border-l border-neutral-100 italic md:not-italic">
              <p className="text-justify text-neutral-600 font-light leading-relaxed">
                Qiens Home olarak, siparişlerinizi Türkiye'nin mobilya başkenti İnegöl'den kapınıza kadar güvenle ulaştırıyoruz. Mobilya, yapısı gereği hassas ve hacimli bir ürün olduğu için standart kargo firmaları yerine, sadece mobilya taşımacılığı yapan profesyonel nakliye ekiplerimizle çalışmaktayız.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-italic">
                <div className="space-y-3">
                  <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                    <MapPin size={16} className="text-accent"/> Teslimat Kapsamı
                  </h3>
                  <p className="text-sm text-neutral-500 font-light">Türkiye'nin 81 il merkezine ve çoğu ilçe merkezine bina önü teslimatımız ücretsizdir. Köy ve uzak kasaba noktaları için ekstra ücret talep edilebilir.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                    <PackageCheck size={16} className="text-accent"/> Kat Teslimatı ve Montaj
                  </h3>
                  <p className="text-sm text-neutral-500 font-light">Teslimat ekiplerimiz, ürünleri genellikle daire içine kadar taşımaktadır. Ancak apartman asansörünün yetersiz olduğu durumlarda, 3. kattan sonrası için taşıma asansörü kurulumu müşteriye aittir.</p>
                </div>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-neutral-600 font-light">
                <li>Siparişlerinizin üretimi ve sevkiyat hazırlığı, ürün grubuna göre <span className="font-bold text-neutral-900">21 ile 35 iş günü</span> sürebilmektedir.</li>
                <li>Teslimat tarihinden en az 24 saat önce lojistik birimimiz sizi arayarak randevu oluşturmaktadır.</li>
                <li>Lütfen teslimat sırasında ürünlerin nakliye aracından indirilmesinden itibaren paketi kontrol ediniz.</li>
              </ul>
            </div>
          </div>

          {/* RETURNS */}
          <div className="space-y-10 group">
            <div className="flex items-center justify-center md:justify-start gap-6 text-accent">
               <div className="p-4 bg-neutral-50 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all">
                  <RotateCcw size={32} strokeWidth={1} />
               </div>
               <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">2. İade ve Cayma Hakkı Şartları</h2>
            </div>
            <div className="space-y-6 pl-0 md:pl-20 border-l-0 md:border-l border-neutral-100">
              <p className="text-justify text-neutral-600 font-light leading-relaxed">
                6502 sayılı Tüketicinin Korunması Hakkında Kanun gereği, tüketiciler 14 gün içerisinde cayma hakkına sahiptir. Ancak mobilya sektörü, "kişiye özel üretim" kategorisine girdiği için bazı özel durumlar mevcuttur:
              </p>
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-sm space-y-3">
                 <h4 className="text-amber-800 font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                   <AlertTriangle size={16} /> Önemli: Özel Üretim İstisnası
                 </h4>
                 <p className="text-xs md:text-sm text-amber-700 leading-relaxed">
                   Müşterinin talebi doğrultusunda üzerine özel kumaş kaplanan, rengi değiştirilen veya standart ölçülerin dışına çıkılarak üretilen (özel ölçü köşe takımları, yatak odaları vb.) ürünlerde cayma hakkı bulunmamaktadır. Siparişinizi onaylarken lütfen bu hususu göz önünde bulundurunuz.
                 </p>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600 font-light">
                <li>İade edilecek ürünlerin montajı yapılmamış olması, kutusunun bozulmamış olması ve yeniden satışına engel teşkil edecek bir unsuru bulunmaması şarttır.</li>
                <li>Kurulumu/montajı yapılan mobilyaların (ayıplı mal kapsamında değilse) iadesi mümkün değildir.</li>
                <li>İade kargo/nakliye bedeli, ürün ayıplı değilse "Mesafeli Sözleşmeler Yönetmeliği" uyarınca müşteriye aittir.</li>
              </ul>
            </div>
          </div>

          {/* DAMAGE REPORT */}
          <div className="space-y-10 group">
            <div className="flex items-center justify-center md:justify-start gap-6 text-accent">
               <div className="p-4 bg-neutral-50 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all">
                  <AlertTriangle size={32} strokeWidth={1} />
               </div>
               <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">3. Hasarlı Teslimat ve Tutanak</h2>
            </div>
            <div className="space-y-4 pl-0 md:pl-20 border-l-0 md:border-l border-neutral-100 font-light text-neutral-600">
              <p className="text-justify">
                Ürünlerimizi en güvenli paketleme sistemleriyle göndersek de, yolculuk esnasında istenmeyen durumlar oluşabilir. 
                <span className="font-bold text-neutral-900"> Teslimat sırasında pakette herhangi bir yırtık, ezik veya ıslaklık fark ederseniz ürünü teslim almayınız veya "DURUM TESPİT TUTANAĞI" tutturunuz.</span>
              </p>
              <p className="text-sm">Tutanak tutulmayan, nakliye personeli ayrıldıktan sonra bildirilen fiziksel hasarlar (kırık, çizik, yırtık) sigorta kapsamı dışında kalmaktadır ve iade/değişim yapılamamaktadır.</p>
            </div>
          </div>

          {/* GUARANTEE */}
          <div className="space-y-10 group">
            <div className="flex items-center justify-center md:justify-start gap-6 text-accent">
               <div className="p-4 bg-neutral-50 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all">
                  <ShieldCheck size={32} strokeWidth={1} />
               </div>
               <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">4. Garanti ve Servis</h2>
            </div>
            <div className="space-y-4 pl-0 md:pl-20 border-l-0 md:border-l border-neutral-100 font-light text-neutral-600">
              <p className="text-justify">
                Tüm ürünlerimiz üretim ve işçilik hatalarına karşı <span className="font-bold text-neutral-900">24 ay Qiens Home</span> resmi garantisi altındadır. Garanti süresi faturanızın kesildiği tarihten itibaren başlar.
              </p>
            </div>
          </div>

          <div className="p-12 bg-neutral-900 text-white rounded-sm text-center space-y-8 shadow-2xl overflow-hidden relative">
             <div className="relative z-10">
                <Mail className="mx-auto mb-6 text-accent" size={40} strokeWidth={1} />
                <h3 className="text-xl font-bold">Müşteri Destek Hattı</h3>
                <p className="text-white/60 font-light mt-4 max-w-lg mx-auto">Siparişinizin durumu, nakliye randevusu veya iade süreçleriyle ilgili bilgi almak için hafta içi 09:00 - 18:00 saatleri arasında bizimle iletişime geçebilirsiniz.</p>
                <p className="mt-4 font-bold text-accent">info@qienshome.com | +90 531 460 25 97</p>
             </div>
             <div className="absolute inset-0 bg-accent/5" />
          </div>
        </section>
      </div>
    </div>
  )
}

export default DeliveryReturnPage;
