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

  function fixExistingPageTypos() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && (node.nodeValue.includes('kadargüvenle') || node.nodeValue.includes('Türkiye`ye'))) {
        node.nodeValue = node.nodeValue
          .replace(/kadargüvenle/g, 'kadar güvenle')
          .replace(/Türkiye`ye/g, "Türkiye'ye");
      }
    }
  }

  function attachNativeHeaderLink() {
    const allLinks = Array.from(document.querySelectorAll('a'));
    const teslimatLink = allLinks.find(a => (a.textContent || '').trim().toLowerCase() === 'teslimat ve kurulum');
    if (teslimatLink && teslimatLink.parentElement && !document.getElementById('lmw-native-3d-link')) {
      const parentLi = teslimatLink.closest('li');
      if (parentLi && parentLi.parentElement) {
        const cloneLi = parentLi.cloneNode(true);
        const a = cloneLi.querySelector('a');
        if (a) {
          a.id = 'lmw-native-3d-link';
          a.textContent = '3D Showroom';
          a.href = '#3d-showroom';
          a.style.color = '#b8922f';
          a.style.fontWeight = '700';
          a.addEventListener('click', function (ev) {
            ev.preventDefault();
            open3DModal();
          });
          parentLi.parentElement.appendChild(cloneLi);
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fixExistingPageTypos();
      attachNativeHeaderLink();
    });
  } else {
    fixExistingPageTypos();
    attachNativeHeaderLink();
  }
  setTimeout(() => { fixExistingPageTypos(); attachNativeHeaderLink(); }, 1200);

  // Detect host website background color so the 3D Showroom button and modal match the site's theme (never harsh black on light sites!)
  function detectHostTheme() {
    let bg = '#FAF7F2';
    let text = '#261E19';
    let accent = '#B5893A';
    let border = '#DFD5C5';
    try {
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const m = bodyBg && bodyBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (m) {
        const r = Number(m[1]);
        const g = Number(m[2]);
        const b = Number(m[3]);
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        if (lum < 0.35 && !(r === 0 && g === 0 && b === 0 && bodyBg.includes('0)'))) {
          bg = `rgb(${r}, ${g}, ${b})`;
          text = '#F5F2EB';
          border = 'rgba(201,163,65,0.45)';
        } else if (lum >= 0.35) {
          bg = r > 245 && g > 245 && b > 245 ? '#FAF7F2' : `rgb(${r}, ${g}, ${b})`;
          text = '#261E19';
          border = '#D8CBB8';
        }
      }
    } catch (e) {}
    return { bg, text, accent, border };
  }

  const hostTheme = detectHostTheme();

  const style = document.createElement('style');
  style.textContent = `
    .lmw-3d-btn {
      position: fixed;
      bottom: 24px;
      left: 22px;
      z-index: 9990;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 18px;
      border-radius: 999px;
      background: ${hostTheme.bg};
      color: ${hostTheme.text};
      border: 1.5px solid ${hostTheme.accent};
      box-shadow: 0 10px 28px rgba(38,30,25,0.16);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all .2s;
    }
    .lmw-3d-btn:hover {
      background: ${hostTheme.accent};
      color: #fff;
      transform: translateY(-2px);
    }
    @media (max-width: 768px) {
      .lmw-3d-btn {
        bottom: 76px;
        left: 14px;
        padding: 9px 15px;
        font-size: 11.5px;
      }
    }
    .lmw-modal-bg { position: fixed; inset: 0; z-index: 99999; background: rgba(38,30,25,0.45); backdrop-filter: blur(6px); display: none; align-items: center; justify-content: center; padding: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .lmw-modal-bg.open { display: flex; }
    .lmw-modal-bg.fullscreen-3d { padding: 0; background: ${hostTheme.bg}; }
    .lmw-modal-card { width: 100%; max-width: 760px; max-height: 85vh; overflow-y: auto; background: #FAF7F2; color: #261E19; border-radius: 20px; padding: 24px; position: relative; box-shadow: 0 28px 80px rgba(0,0,0,0.22); line-height: 1.6; font-size: 13.5px; }
    .lmw-modal-card.wide { width: 100vw; height: 100dvh; max-width: 100vw; max-height: 100dvh; padding: 0; border-radius: 0; background: ${hostTheme.bg}; color: ${hostTheme.text}; overflow: hidden; }
    .lmw-modal-card h3 { margin: 0 0 14px; font-size: 20px; color: #141414; border-bottom: 1px solid #eee7d7; padding-bottom: 10px; padding-right: 36px; }
    .lmw-modal-card h4 { margin: 14px 0 5px; font-size: 14px; color: #9c7a23; }
    .lmw-close { position: absolute; top: 14px; right: 14px; width: 34px; height: 34px; border-radius: 50%; border: none; background: #f2efe9; color: #111; font-size: 18px; font-weight: 700; cursor: pointer; }
    .lmw-quick-bar { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; padding-right: 32px; }
    .lmw-quick-pill { padding: 6px 11px; border-radius: 999px; border: 1px solid #e2dac8; background: #faf8f3; color: #443d32; font-size: 11.5px; font-weight: 600; cursor: pointer; }
    .lmw-quick-pill.active, .lmw-quick-pill:hover { background: #c9a341; color: #111; border-color: #c9a341; }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button class="lmw-3d-btn" id="lmw-open-3d">
      <span>🧊 3D Showroom</span>
    </button>

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

    <div class="lmw-modal-bg fullscreen-3d" id="lmw-modal-3d">
      <div class="lmw-modal-card wide">
        <button class="lmw-close" id="lmw-close-3d" style="background:#c9a341;color:#111;z-index:20;top:12px;right:12px;width:36px;height:36px;box-shadow:0 6px 20px rgba(0,0,0,0.4);">×</button>
        <iframe id="lmw-iframe-3d" style="width:100vw;height:100dvh;border:0;border-radius:0;display:block;" allow="camera; accelerometer; gyroscope; magnetometer; xr-spatial-tracking; fullscreen"></iframe>
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

  let gyroBridgeAttached = false;
  function attachParentGyroBridge() {
    if (gyroBridgeAttached) return;
    gyroBridgeAttached = true;
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().catch(function () {});
      }
    } catch (e) {}
    window.addEventListener('deviceorientation', function (ev) {
      if (iframe3d && iframe3d.contentWindow && modal3d.classList.contains('open')) {
        iframe3d.contentWindow.postMessage({
          type: 'LIMOON_GYRO',
          alpha: ev.alpha,
          beta: ev.beta,
          gamma: ev.gamma
        }, '*');
      }
    });
  }

  function open3DModal() {
    attachParentGyroBridge();
    if (!iframe3d.getAttribute('src')) {
      iframe3d.setAttribute('src', EMBED_3D_URL + '&v=' + Date.now());
    }
    modal3d.classList.add('open');
  }

  document.getElementById('lmw-open-3d').addEventListener('click', open3DModal);
  document.getElementById('lmw-close-info').addEventListener('click', () => infoModal.classList.remove('open'));
  infoModal.addEventListener('click', e => { if (e.target === infoModal) infoModal.classList.remove('open'); });

  document.querySelectorAll('#lmw-tabs [data-page]').forEach(btn => {
    btn.addEventListener('click', () => showInfoPage(btn.getAttribute('data-page')));
  });

  document.getElementById('lmw-close-3d').addEventListener('click', () => modal3d.classList.remove('open'));
  modal3d.addEventListener('click', e => { if (e.target === modal3d) modal3d.classList.remove('open'); });

  // Intercept clicks on existing header & footer links (Sıkça Sorulan Sorular, Teslimat ve Kurulum, etc.)
  document.addEventListener('click', function (e) {
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const txt = (a.textContent || '').toLowerCase().trim();
    const href = (a.getAttribute('href') || '').toLowerCase();

    if (txt.includes('3d showroom')) {
      e.preventDefault(); open3DModal();
    } else if (txt.includes('sıkça sorulan') || txt.includes('sikca sorulan') || txt === 'sss' || href.includes('sss') || href.includes('faq')) {
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
