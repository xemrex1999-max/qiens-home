(function () {
  if (window.__LIMOON_WIDGET_LOADED__) return;
  window.__LIMOON_WIDGET_LOADED__ = true;

  const PHONE = '905334852216';
  const DISPLAY_PHONE = '+90 533 485 22 16';
  const ADDRESS = 'Wobilimoda Mobilya AVM, No: 85, İnegöl / Bursa';
  const EMAIL = 'info@limoonhome.com';
  const EMBED_3D_URL = 'https://qiens-home.vercel.app/embed/showroom?firma=L%C4%B0MOON%20HOME';

  const PAGES = {
    sss: {
      title: 'Sıkça Sorulan Sorular (SSS)',
      html: `
        <h4>1. Siparişim ne kadar sürede teslim edilir?</h4>
        <p>Stokta bulunan ürünlerimiz <strong>7–14 iş günü</strong>, size özel renk, kumaş veya ölçüyle üretilen siparişleriniz ise <strong>15–25 iş günü</strong> içerisinde İnegöl üretim tesislerimizden sevkiyata çıkarılmaktadır.</p>
        <h4>2. Türkiye geneli ve Avrupa'ya teslimatınız var mı?</h4>
        <p>Evet. Türkiye'nin 81 iline özel mobilya nakliye araçlarımızla güvenli teslimat ve profesyonel kurulum yapıyoruz. Almanya, Hollanda, Belçika, Fransa, Avusturya ve İsviçre başta olmak üzere tüm Avrupa ülkelerine gümrükleme dahil sigortalı kapı teslim ihracat sevkiyatımız mevcuttur.</p>
        <h4>3. Kumaş rengi ve ölçü değişikliği yapabilir miyim?</h4>
        <p>Evet, Limoon Home üretici kimliğiyle çalıştığı için koltuk takımlarında silinebilir ithal kumaş kartelamızdan dilediğiniz rengi seçebilir; gardırop, yatak ve yemek masalarında odanıza uygun özel ölçü talebinde bulunabilirsiniz.</p>
        <h4>4. Ürünleriniz garantili mi?</h4>
        <p>Tüm ürünlerimiz üretim ve işçilik hatalarına karşı <strong>2 (iki) yıl Limoon Home Fabrika Garantisi</strong> altındadır. İskelet yapılarımızda 1. sınıf fırınlanmış gürgen ağacı kullanılmaktadır.</p>
      `,
    },
    teslimat: {
      title: 'Teslimat ve Kurulum Bilgileri',
      html: `
        <h4>1. Özel Mobilya Lojistiği</h4>
        <p>Standart kargo şirketleri yerine yalnızca mobilya taşımasına özel ekipmanlı araçlarımız ve uzman montaj kadromuzla teslimat gerçekleştiriyoruz.</p>
        <h4>2. Randevulu Sevkiyat</h4>
        <p>Ürünleriniz İnegöl tesisimizden çıkmadan 24–48 saat önce lojistik ekibimiz sizi arayarak müsaitlik durumunuza göre teslimat gününü planlar.</p>
        <h4>3. Katınıza Kadar Taşıma ve Ücretsiz Kurulum</h4>
        <p>Teslimat ekibimiz tüm paketleri evinizin içine taşır; gardırop, baza, yemek masası, konsol ve koltuk takımlarınızın kurulumunu yerinde eksiksiz tamamlayarak teslim eder.</p>
        <h4>4. Avrupa Kapı Teslim İhracat</h4>
        <p>Avrupa siparişleriniz darbe emici ihracat ambalajı ve sandıklama ile paketlenir, tüm gümrük işlemleri firmamızca takip edilerek adresinize sigortalı olarak ulaştırılır.</p>
      `,
    },
    musteri: {
      title: 'Müşteri Hizmetleri & İletişim',
      html: `
        <p><strong>Limoon Home &amp; Living Müşteri İlişkileri Merkezi</strong></p>
        <ul>
          <li><strong>Mağaza &amp; Showroom Adresi:</strong> ${ADDRESS}</li>
          <li><strong>Telefon &amp; WhatsApp Destek:</strong> <a href="https://wa.me/${PHONE}" target="_blank" style="color:#b8922f;font-weight:700;">${DISPLAY_PHONE}</a></li>
          <li><strong>E-Posta:</strong> ${EMAIL}</li>
          <li><strong>Çalışma Saatleri:</strong> Pazartesi – Cumartesi: 09:00 – 19:00 | Pazar: 10:00 – 18:00</li>
        </ul>
        <p>Sipariş durumu sorgulama, iç mimari ölçü danışmanlığı, kumaş kartelası talebi ve satış sonrası destek için bize WhatsApp hattımızdan doğrudan ulaşabilirsiniz.</p>
      `,
    },
    satissonrasi: {
      title: 'Satış Sonrası Hizmet & 2 Yıl Garanti',
      html: `
        <h4>2 Yıl Tam Fabrika Garantisi</h4>
        <p>Satın aldığınız tüm Limoon Home ürünleri teslim tarihinden itibaren <strong>2 yıl boyunca</strong> mekanizma, sünger, iskelet ve üretim kaynaklı hatalara karşı garantilidir.</p>
        <h4>Yedek Parça ve Teknik Servis Desteği</h4>
        <p>Garanti süresi sonrasında dahi ihtiyaç duyabileceğiniz kumaş, ayak, menteşe, ray veya tamamlayıcı modül taleplerinizde İnegöl fabrikamız doğrudan yedek parça desteği sağlar.</p>
        <h4>Hasarsız Teslimat Güvencesi</h4>
        <p>Nakliye veya kurulum esnasında oluşabilecek en ufak bir kusurda ilgili parça ücretsiz olarak yenisiyle değiştirilir. Hızlı servis kaydı için: <strong>${DISPLAY_PHONE}</strong>.</p>
      `,
    },
    mesafeli: {
      title: 'Mesafeli Satış Sözleşmesi',
      html: `
        <h4>MADDE 1 – TARAFLAR</h4>
        <p><strong>SATICI:</strong> Limoon Home &amp; Living (${ADDRESS} • Tel: ${DISPLAY_PHONE} • E-posta: ${EMAIL})<br/>
        <strong>ALICI:</strong> limoonhome.com üzerinden sipariş veren müşteri.</p>
        <h4>MADDE 2 – KONU</h4>
        <p>İşbu sözleşme, ALICI'nın SATICI'ya ait limoonhome.com internet sitesinden sipariş verdiği mobilya ürünlerinin 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca satışı ve teslimi koşullarını düzenler.</p>
        <h4>MADDE 3 – TESLİMAT</h4>
        <p>Ürünler yasal 30 günlük süreyi aşmamak kaydıyla ALICI'nın adresine özel mobilya nakliyesi ile teslim ve monte edilir.</p>
        <h4>MADDE 4 – CAYMA HAKKI</h4>
        <p>Standart stok ürünlerinde teslimden itibaren 14 gün cayma hakkı mevcuttur. Yönetmeliğin 15/1-b maddesi uyarınca ALICI'nın özel talebiyle (özel ölçü veya özel kumaş/renk ile) üretilen mobilyalarda cayma hakkı kullanılamaz; ancak üretim ve nakliye kusurlarına karşı ücretsiz değişim/onarım garantisi tamdır.</p>
      `,
    },
    gizlilik: {
      title: 'Gizlilik, Güvenlik ve KVKK Politikası',
      html: `
        <p><strong>Limoon Home &amp; Living</strong> (limoonhome.com) olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerinizin güvenliğini koruyoruz.</p>
        <h4>1. Veri İşleme Amacı</h4>
        <p>Ad, soyad, telefon, e-posta ve teslimat adresi bilgileriniz yalnızca siparişinizin üretimi, faturalandırılması, nakliye/kurulum planlaması ve satış sonrası garanti desteği amacıyla işlenmektedir.</p>
        <h4>2. Ödeme Güvenliği</h4>
        <p>Sitemiz üzerinden yapılan işlemlerde kredi kartı bilgileriniz sunucularımızda kesinlikle saklanmaz; tüm işlemler 256-bit SSL şifreleme ve 3D Secure üzerinden gerçekleşir.</p>
        <h4>3. Üçüncü Taraflarla Paylaşım</h4>
        <p>Bilgileriniz yasal zorunluluklar ve siparişinizi adresinize ulaştıracak lojistik ekibimiz haricinde hiçbir üçüncü taraf ile paylaşılmaz. KVKK talepleriniz için: <strong>${EMAIL}</strong>.</p>
      `,
    },
  };

  const style = document.createElement('style');
  style.textContent = `
    .lmw-fab-left { position: fixed; bottom: 22px; left: 22px; z-index: 99990; display: flex; align-items: center; gap: 10px; padding: 13px 20px; border-radius: 999px; background: #141414; color: #fff; border: 1.5px solid #c9a341; box-shadow: 0 14px 36px rgba(0,0,0,0.25); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: transform .2s; }
    .lmw-fab-left:hover { transform: translateY(-2px); background: #c9a341; color: #111; }
    .lmw-fab-right { position: fixed; bottom: 22px; right: 22px; z-index: 99990; display: flex; align-items: center; gap: 10px; }
    .lmw-wa-btn { width: 52px; height: 52px; border-radius: 50%; background: #25D366; color: #fff; border: none; box-shadow: 0 10px 28px rgba(37,211,102,0.38); display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; text-decoration: none; transition: transform .2s; }
    .lmw-wa-btn:hover { transform: scale(1.07); }
    .lmw-modal-bg { position: fixed; inset: 0; z-index: 99999; background: rgba(10,10,12,0.78); backdrop-filter: blur(6px); display: none; align-items: center; justify-content: center; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .lmw-modal-bg.open { display: flex; }
    .lmw-modal-card { width: 100%; max-width: 780px; max-height: 88vh; overflow-y: auto; background: #fff; color: #1b1b1b; border-radius: 24px; padding: 28px 30px; position: relative; box-shadow: 0 28px 80px rgba(0,0,0,0.45); line-height: 1.65; font-size: 14px; }
    .lmw-modal-card.wide { max-width: 1240px; padding: 14px; background: #0e0e12; color: #fff; }
    .lmw-modal-card h3 { margin: 0 0 16px; font-size: 22px; color: #141414; border-bottom: 2px solid #f0ead8; padding-bottom: 12px; }
    .lmw-modal-card h4 { margin: 16px 0 6px; font-size: 15px; color: #9c7a23; }
    .lmw-close { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; border-radius: 50%; border: none; background: #f2efe9; color: #111; font-size: 18px; font-weight: 700; cursor: pointer; }
    .lmw-quick-bar { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
    .lmw-quick-pill { padding: 6px 12px; border-radius: 999px; border: 1px solid #e2dac8; background: #faf8f3; color: #443d32; font-size: 12px; font-weight: 600; cursor: pointer; }
    .lmw-quick-pill.active, .lmw-quick-pill:hover { background: #c9a341; color: #111; border-color: #c9a341; }
  `;
  document.head.appendChild(style);

  // Floating 3D Showroom button + Info Helper + WhatsApp
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button class="lmw-fab-left" id="lmw-open-3d">
      <span>🧊 3D Oda Planla &amp; Özel Ölçü</span>
    </button>
    <div class="lmw-fab-right">
      <button class="lmw-fab-left" id="lmw-open-info" style="position:static;background:#fff;color:#141414;">
        <span>📋 Teslimat, Garanti &amp; SSS</span>
      </button>
      <a class="lmw-wa-btn" href="https://wa.me/${PHONE}?text=${encodeURIComponent('Merhaba Limoon Home, ürünleriniz ve teslimat hakkında bilgi almak istiyorum.')}" target="_blank" title="WhatsApp Destek">
        💬
      </a>
    </div>

    <div class="lmw-modal-bg" id="lmw-modal-info">
      <div class="lmw-modal-card">
        <button class="lmw-close" id="lmw-close-info">×</button>
        <div class="lmw-quick-bar" id="lmw-tabs">
          <button class="lmw-quick-pill active" data-page="sss">Sıkça Sorulan Sorular</button>
          <button class="lmw-quick-pill" data-page="teslimat">Teslimat ve Kurulum</button>
          <button class="lmw-quick-pill" data-page="satissonrasi">Satış Sonrası &amp; Garanti</button>
          <button class="lmw-quick-pill" data-page="musteri">Müşteri Hizmetleri</button>
          <button class="lmw-quick-pill" data-page="mesafeli">Mesafeli Satış Sözleşmesi</button>
          <button class="lmw-quick-pill" data-page="gizlilik">Gizlilik &amp; KVKK</button>
        </div>
        <div id="lmw-info-body"></div>
      </div>
    </div>

    <div class="lmw-modal-bg" id="lmw-modal-3d">
      <div class="lmw-modal-card wide">
        <button class="lmw-close" id="lmw-close-3d" style="background:#c9a341;color:#111;z-index:20;">×</button>
        <iframe id="lmw-iframe-3d" style="width:100%;height:80vh;border:0;border-radius:16px;" allow="camera; xr-spatial-tracking; fullscreen"></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  const infoModal = document.getElementById('lmw-modal-info');
  const infoBody = document.getElementById('lmw-info-body');
  const modal3d = document.getElementById('lmw-modal-3d');
  const iframe3d = document.getElementById('lmw-iframe-3d');

  function showInfoPage(key) {
    const p = PAGES[key] || PAGES.sss;
    infoBody.innerHTML = `<h3>${p.title}</h3>${p.html}`;
    document.querySelectorAll('#lmw-tabs [data-page]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-page') === key);
    });
    infoModal.classList.add('open');
  }

  document.getElementById('lmw-open-info').addEventListener('click', () => showInfoPage('sss'));
  document.getElementById('lmw-close-info').addEventListener('click', () => infoModal.classList.remove('open'));
  infoModal.addEventListener('click', e => { if (e.target === infoModal) infoModal.classList.remove('open'); });

  document.querySelectorAll('#lmw-tabs [data-page]').forEach(btn => {
    btn.addEventListener('click', () => showInfoPage(btn.getAttribute('data-page')));
  });

  document.getElementById('lmw-open-3d').addEventListener('click', () => {
    if (!iframe3d.getAttribute('src')) iframe3d.setAttribute('src', EMBED_3D_URL);
    modal3d.classList.add('open');
  });
  document.getElementById('lmw-close-3d').addEventListener('click', () => modal3d.classList.remove('open'));
  modal3d.addEventListener('click', e => { if (e.target === modal3d) modal3d.classList.remove('open'); });

  // Automatically intercept clicks on empty/broken footer & header policy links on limoonhome.com!
  document.addEventListener('click', function (e) {
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const txt = (a.textContent || '').toLowerCase().trim();
    const href = (a.getAttribute('href') || '').toLowerCase();

    if (txt.includes('sıkça sorulan') || txt.includes('sikca sorulan') || txt === 'sss' || href.includes('sss') || href.includes('faq')) {
      e.preventDefault(); showInfoPage('sss');
    } else if (txt.includes('teslimat ve kurulum') || txt.includes('teslimat & kurulum') || href.includes('teslimat')) {
      e.preventDefault(); showInfoPage('teslimat');
    } else if (txt.includes('satış sonrası') || txt.includes('satis sonrasi') || txt.includes('garanti')) {
      e.preventDefault(); showInfoPage('satissonrasi');
    } else if (txt.includes('müşteri hizmetleri') || txt.includes('musteri hizmetleri')) {
      e.preventDefault(); showInfoPage('musteri');
    } else if (txt.includes('mesafeli satış') || txt.includes('mesafeli satis')) {
      e.preventDefault(); showInfoPage('mesafeli');
    } else if (txt.includes('gizlilik') || txt.includes('güvenlik politikası') || txt.includes('kvkk')) {
      e.preventDefault(); showInfoPage('gizlilik');
    }
  }, true);
})();
