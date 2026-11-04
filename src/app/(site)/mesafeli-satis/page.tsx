"use client"

import React from 'react'

const DistanceSalesPage = () => {
  return (
    <div className="bg-white min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="space-y-4 border-b border-neutral-100 pb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Yasal Bilgilendirme</span>
          <h1 className="text-4xl md:text-6xl font-serif text-secondary tracking-tighter">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-neutral-400 text-sm max-w-2xl font-light leading-relaxed">
            Qiens Home üzerinden yapılan tüm alışverişler aşağıda belirtilen sözleşme hükümlerine tabidir.
          </p>
        </header>

        <section className="space-y-12 text-sm text-neutral-600 leading-[1.8] font-light">
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 uppercase tracking-wider">Madde 1 - Taraflar</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2 p-6 border border-neutral-100 rounded-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">1.1. Satıcı Bilgileri</h3>
                <p><span className="font-bold">Ünvan:</span> Qiens Home</p>
                <p><span className="font-bold">Adres:</span> Mahmudiye Mh. 14 Mob. Nil Sk. No:33 İnegöl / BURSA</p>
                <p><span className="font-bold">Telefon:</span> +90 531 460 25 97</p>
                <p><span className="font-bold">E-posta:</span> info@qienshome.com</p>
              </div>
              <div className="space-y-2 p-6 border border-neutral-100 rounded-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">1.2. Alıcı Bilgileri</h3>
                <p>İnternet sitesi üzerinden ürün satın alan gerçek veya tüzel kişi. Alıcının üye olurken veya sipariş verirken kullandığı adres ve iletişim bilgileri esas alınır.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 uppercase tracking-wider">Madde 2 - Tanımlar</h2>
            <p>İşbu sözleşmenin uygulanmasında ve yorumlanmasında aşağıda yazılı terimler karşılarındaki yazılı açıklamaları ifade edeceklerdir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-bold">Kanun:</span> 6502 sayılı Tüketicinin Korunması Hakkında Kanun,</li>
              <li><span className="font-bold">Yönetmelik:</span> Mesafeli Sözleşmeler Yönetmeliği,</li>
              <li><span className="font-bold">Ürün/Hizmet:</span> Alışverişe konu olan taşınır eşya, yazılım, ses, görüntü ve benzeri gayri maddi malları,</li>
              <li><span className="font-bold">Site:</span> qienshome.com internet sitesi.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 uppercase tracking-wider">Madde 3 - Konu</h2>
            <p>
              İşbu Sözleşme'nin konusu, Alıcı'nın, Satıcı'ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak Kanun ve Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 uppercase tracking-wider">Madde 4 - Malın Temel Özellikleri ve Fiyatı</h2>
            <p>
              Ürünün cinsi ve türü, miktarı, marka/modeli, rengi ve tüm vergiler dâhil satış bedeli, Satıcı'nın internet sitesindeki ürün tanıtım sayfasında yer alan bilgilerde ve işbu Sözleşme'nin ayrılmaz parçası sayılan faturada belirtildiği gibidir. İlan edilen fiyatlar ve vaatler güncelleme yapılana ve değiştirilene kadar geçerlidir.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 uppercase tracking-wider">Madde 5 - Genel Hükümler</h2>
            <ul className="list-decimal pl-5 space-y-3">
              <li>Alıcı, Satıcı'ya ait internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup, bilgi sahibi olduğunu, elektronik ortamda gerekli teyidi verdiğini kabul, beyan ve taahhüt eder.</li>
              <li>Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak kaydı ile Alıcı'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesindeki ön bilgiler kısmında açıklanan süre içinde Alıcı veya gösterdiği adresteki kişi/kuruluşa teslim edilir.</li>
              <li>Satıcı, sözleşme konusu ürünü eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri, kullanım kılavuzları ile teslim etmeyi taahhüt eder.</li>
              <li>Sipariş konusu mal veya hizmetin yerine getirilmesinin imkânsızlaşması halinde Satıcı, bu durumu öğrendiği tarihten itibaren 3 gün içinde Alıcıya yazılı olarak bildirmeyi ve 14 gün içinde toplam bedeli Alıcıya iade etmeyi kabul eder.</li>
              <li>Ürünün teslimatı için işbu Sözleşme'nin elektronik ortamda teyidi şarttır. Herhangi bir nedenle ürün bedeli ödenmez veya banka kayıtlarında iptal edilirse, Satıcı ürünün teslimi yükümlülüğünden kurtulmuş sayılır.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 uppercase tracking-wider">Madde 6 - Cayma Hakkı</h2>
            <p>
              Alıcı; mal satışına ilişkin mesafeli sözleşmelerde, ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkını kullanabilir. Cayma hakkının kullanılması için bu süre içinde Satıcı'ya yazılı bildirimde bulunulması şarttır.
            </p>
          </div>

          <div className="space-y-4">
             <h2 className="text-lg font-bold text-neutral-900 uppercase tracking-wider">Madde 7 - Cayma Hakkı Kullanılamayacak Ürünler</h2>
             <p>Alıcının isteği veya açıkça kişisel ihtiyaçları doğrultusunda hazırlanan, geri gönderilmeye müsait olmayan ürünler için cayma hakkı kullanılamaz. Özellikle:</p>
             <ul className="list-disc pl-5 space-y-2">
               <li>Tüketicinin özel istek ve talepleri uyarınca üretilen veya üzerinde değişiklik ya da ilaveler yapılarak kişiye özel hale getirilen mallar,</li>
               <li>Montajı yapılmış mobilyalar (ayıplı mal hali hariç),</li>
               <li>Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan mallardan; iadesi sağlık ve hijyen açısından uygun olmayanların teslimine ilişkin sözleşmeler.</li>
             </ul>
          </div>

          <p className="text-center font-bold text-neutral-900 pt-12 border-t border-neutral-50">
            Satıcı: Qiens Home <br />
            Alıcı: [Müşteri Adı / Sipariş Onay Tarihi]
          </p>
        </section>
      </div>
    </div>
  )
}

export default DistanceSalesPage;
