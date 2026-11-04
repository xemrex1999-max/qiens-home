import React from 'react'

const PrivacyPage = () => {
  return (
    <div className="bg-white min-h-screen pt-44 pb-24 px-6 md:px-12 font-light">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Hukuki Metinler</span>
           <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-secondary leading-none">Gizlilik Politikası</h1>
           <div className="w-16 h-1 bg-accent rounded-full" />
        </div>

        <section className="space-y-8 text-neutral-600 leading-relaxed text-sm md:text-base">
          <p>
            Beyazıt Mobilyam olarak, sitemizi ziyaret eden kullanıcılarımızın gizliliğini korumak ve kişisel verilerinin güvenliğini sağlamak en önemli önceliklerimizden biridir. Bu Gizlilik Politikası, hangi verileri topladığımızı ve bu verileri nasıl kullandığımızı açıklar.
          </p>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-secondary">1. Toplanan Veriler</h2>
            <p>
              Sitemiz üzerinden sipariş verdiğinizde veya üye olduğunuzda; adınız, e-posta adresiniz, teslimat adresiniz ve telefon numaranız gibi veriler toplanır. Bu veriler sadece siparişlerinizin işlenmesi ve size daha iyi hizmet sunulabilmesi amacıyla kullanılır.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-secondary">2. Çerezler (Cookies)</h2>
            <p>
              Kullanıcı deneyiminizi iyileştirmek için sitemizde çerezler kullanılmaktadır. Çerezler, tarayıcınız aracılığıyla cihazınıza yerleştirilen küçük veri dosyalarıdır. Çerez kullanımını tarayıcı ayarlarınızdan dilediğiniz zaman kısıtlayabilirsiniz.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-secondary">3. Veri Güvenliği</h2>
            <p>
              Kişisel verileriniz, yetkisiz erişime karşı SSL sertifikası ve diğer modern güvenlik yöntemleri ile korunmaktadır. Ödeme bilgileriniz doğrudan banka altyapısı (ODeal) üzerinden işlenir ve tarafımızca saklanmaz.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPage;
