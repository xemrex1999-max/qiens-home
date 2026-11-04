"use client"

import React from 'react'

const KVKKPage = () => {
  return (
    <div className="bg-white min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="space-y-4 border-b border-neutral-100 pb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Yasal Bilgilendirme</span>
          <h1 className="text-4xl md:text-6xl font-serif text-secondary tracking-tighter">KVKK Aydınlatma Metni</h1>
          <p className="text-neutral-400 text-sm max-w-2xl font-light leading-relaxed">
            Kişisel verilerinizin korunması ve gizliliğiniz bizim için en yüksek önceliğe sahiptir.
          </p>
        </header>

        <section className="space-y-12 text-sm text-neutral-600 leading-[1.8] font-light">
          <p>
            Qiens Home ("Şirket") olarak, kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz. Bu bilinçle, Şirket olarak ürün ve hizmetlerimizden faydalanan kişiler dahil, Şirket ile ilişkili tüm şahıslara ait her türlü kişisel verilerin 6698 sayılı Kişisel Verilerin Korunması Kanunu'na ("KVK Kanunu") uygun olarak işlenerek, muhafaza edilmesine büyük önem vermekteyiz.
          </p>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wider">1. Veri Sorumlusunun Kimliği</h2>
            <p>
              6698 sayılı KVK Kanunu uyarınca, kişisel verileriniz; veri sorumlusu olarak Mahmudiye Mh. 14 Mob. Nil Sk. No:33 İnegöl / BURSA adresinde mukim Qiens Home tarafından aşağıda açıklanan kapsamda işlenebilecektir.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wider">2. Kişisel Verilerin İşleme Amaçları</h2>
            <p>
              Kişisel verileriniz, Şirketimiz tarafından sağlanan hizmet ve Şirketimizin ticari faaliyetlerine bağlı olarak değişkenlik gösterebilmekle birlikte; otomatik ya da otomatik olmayan yöntemlerle, Şirketimiz birimleri, internet sitesi, sosyal medya mecraları ve benzeri vasıtalarla sözlü, yazılı ya da elektronik olarak toplanabilecektir.
            </p>
            <p>Toplanan kişisel verileriniz, aşağıdaki amaçlarla işlenmektedir:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ürün ve hizmetlerimizin beğeni, kullanım alışkanlıkları ve ihtiyaçlarınıza göre özelleştirilmesi,</li>
              <li>Siparişlerinizin lojistik ve montaj süreçlerinin yönetilmesi,</li>
              <li>Ticari faaliyetlerimizin yürütülmesi ve iş stratejilerimizin belirlenmesi,</li>
              <li>Hukuki ve ticari güvenliğin temini.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wider">3. Veri Aktarımı</h2>
            <p>
              Verileriniz, yukarıdaki amaçlar doğrultusunda; iş ortaklarımıza, tedarikçilerimize (özellikle nakliye ve montaj ekipleri), kanunen yetkili kamu kurumlarına KVK Kanunu'nun 8. ve 9. maddeleri çerçevesinde aktarılabilecektir.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wider">4. Veri Sahibinin Hakları</h2>
            <p>KVK Kanunu'nun 11. maddesi uyarınca veri sahipleri;</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kişisel veri işlenip işlenmediğini öğrenme,</li>
              <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</li>
              <li>Verilerin işlenme amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Hatalı işlenmiş verilerin düzeltilmesini isteme,</li>
              <li>Verilerin silinmesini veya yok edilmesini isteme haklarına sahiptir.</li>
            </ul>
          </div>

          <div className="space-y-4 border-t border-neutral-100 pt-8 mt-12">
            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wider">5. İletişim ve Başvuru</h2>
            <p>
              Taleplerinizi yazılı olarak Mahmudiye Mh. 14 Mob. Nil Sk. No:33 İnegöl / BURSA adresine veya info@qienshome.com adresine güvenli elektronik imza ile iletebilirsiniz.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default KVKKPage;
