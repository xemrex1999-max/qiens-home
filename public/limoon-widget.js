(function () {
  if (window.__LIMOON_WIDGET_LOADED__) return;
  window.__LIMOON_WIDGET_LOADED__ = true;

  const PHONE = '905334852216';
  const DISPLAY_PHONE = '+90 533 485 22 16';
  const ADDRESS = 'Wobilimoda Mobilya AVM, No: 85, İnegöl / Bursa';
  const EMAIL = 'info@limoonhome.com';
  const BASE_EMBED_3D_URL = 'https://qiens-home.vercel.app/embed/showroom?firma=L%C4%B0MOON%20HOME';

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

  // 1. SINGLE UNIFIED WORDPRESS STORE AMBIENCE MUSIC ENGINE (visible on BOTH Desktop & Mobile headers + Product Summary + 3D Modal!)
  let audioCtx = null;
  let musicTimer = null;
  let musicPlaying = false;
  let chordIdx = 0;
  const CHORDS = [
    [174.61, 220.0, 261.63, 329.63, 392.0],
    [164.81, 196.0, 246.94, 293.66, 392.0],
    [146.83, 174.61, 220.0, 261.63, 329.63],
    [130.81, 164.81, 196.0, 246.94, 293.66],
  ];

  // Use session-scoped pause flag so opening the site plays music on first interaction, but once muted by user it NEVER auto-restarts!
  function isMusicExplicitlyMuted() {
    try {
      return sessionStorage.getItem('lmw_music_user_paused') === '1';
    } catch (e) {
      return false;
    }
  }

  function setMusicMutedStorage(muted) {
    try {
      sessionStorage.setItem('lmw_music_user_paused', muted ? '1' : '0');
    } catch (e) {}
  }

  function broadcastMusicState() {
    const iconSvg = musicPlaying
      ? '<svg style="width:16px !important;height:16px !important;min-width:16px !important;display:inline-block !important;vertical-align:middle !important;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>'
      : '<svg style="width:16px !important;height:16px !important;min-width:16px !important;display:inline-block !important;vertical-align:middle !important;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';

    document.querySelectorAll('.lmw-sound-toggle-btn').forEach(function (btn) {
      const showLabel = btn.getAttribute('data-with-label') === '1';
      btn.innerHTML = showLabel
        ? iconSvg + '<span style="margin-left:6px;font-size:12px;font-weight:700;line-height:1;">' + (musicPlaying ? 'Mağaza Müziği: Açık' : 'Mağaza Müziği') + '</span>'
        : iconSvg;
      btn.style.color = musicPlaying ? '#FFFFFF' : '#261E19';
      btn.style.borderColor = '#B5893A';
      btn.style.background = musicPlaying ? '#B5893A' : '#FAF7F2';
      btn.title = musicPlaying ? 'Mağaza Müziğini Kapat' : 'Mağaza Müziğini Aç';
    });

    document.querySelectorAll('iframe').forEach(function (ifr) {
      try {
        if (ifr.contentWindow) {
          ifr.contentWindow.postMessage({ type: 'LIMOON_MUSIC_STATE', playing: musicPlaying }, '*');
        }
      } catch (e) {}
    });
  }

  function playLoungeChord() {
    if (!musicPlaying || !audioCtx || audioCtx.state !== 'running') return;
    const now = audioCtx.currentTime;
    const notes = CHORDS[chordIdx % CHORDS.length];
    chordIdx++;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(760, now);
    filter.connect(audioCtx.destination);
    notes.forEach(function (freq, idx) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      const st = idx * 0.14;
      osc.frequency.setValueAtTime(freq, now + st);
      gain.gain.setValueAtTime(0.0001, now + st);
      gain.gain.linearRampToValueAtTime(0.02 / (1 + idx * 0.2), now + st + 0.45);
      gain.gain.exponentialRampToValueAtTime(0.0006, now + st + 4.0);
      osc.connect(gain);
      gain.connect(filter);
      osc.start(now + st);
      osc.stop(now + st + 4.1);
    });
  }

  function startStoreMusic() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (musicTimer) {
        clearInterval(musicTimer);
        musicTimer = null;
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch (e) {}
        audioCtx = null;
      }
      audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      musicPlaying = true;
      setMusicMutedStorage(false);
      broadcastMusicState();
      playLoungeChord();
      musicTimer = setInterval(playLoungeChord, 4200);
    } catch (e) {}
  }

  function stopStoreMusic() {
    musicPlaying = false;
    setMusicMutedStorage(true);
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
    if (audioCtx) {
      const old = audioCtx;
      audioCtx = null;
      try { old.close(); } catch (e) {}
    }
    broadcastMusicState();
  }

  function toggleStoreMusic() {
    if (musicPlaying) {
      stopStoreMusic();
    } else {
      startStoreMusic();
    }
  }

  // Listen to messages from embedded 3D Showroom iframe so there is only ONE music engine
  window.addEventListener('message', function (ev) {
    if (!ev.data) return;
    if (ev.data.type === 'LIMOON_MUSIC_TOGGLE') {
      toggleStoreMusic();
    } else if (ev.data.type === 'LIMOON_MUSIC_QUERY') {
      broadcastMusicState();
    }
  });

  // Auto-start store ambience on the user's first click anywhere on the site ONLY if they haven't paused it!
  function handleFirstSiteClick(ev) {
    if (musicPlaying || isMusicExplicitlyMuted()) return;
    if (ev && ev.target && ev.target.closest && ev.target.closest('.lmw-sound-toggle-btn')) return;
    startStoreMusic();
  }
  window.addEventListener('click', handleFirstSiteClick, { passive: true });
  window.addEventListener('touchend', handleFirstSiteClick, { passive: true });

  // Mount Sound Button in BOTH Desktop Header (.whb-col-right.whb-visible-lg) AND Mobile Header (.wd-header-my-account)
  function mountHeaderSoundIcon() {
    // A) Desktop Top-Right Header Column (.whb-general-header .whb-col-right.whb-visible-lg)
    const desktopRightCol = document.querySelector('.whb-general-header .whb-col-right.whb-visible-lg');
    if (desktopRightCol && !document.getElementById('lmw-desktop-header-sound-btn')) {
      desktopRightCol.classList.remove('whb-empty-column');
      const dBtn = document.createElement('button');
      dBtn.id = 'lmw-desktop-header-sound-btn';
      dBtn.type = 'button';
      dBtn.className = 'lmw-sound-toggle-btn';
      dBtn.setAttribute('data-with-label', '1');
      dBtn.style.cssText =
        'padding:7px 14px !important;min-height:34px !important;border-radius:999px !important;border:1.5px solid #B5893A !important;background:#FAF7F2;color:#261E19;display:inline-flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;margin-left:auto !important;transition:all .2s;box-shadow:0 3px 10px rgba(181,137,58,0.12);';
      dBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleStoreMusic();
      });
      desktopRightCol.appendChild(dBtn);
    }

    // B) Mobile Header (next to User Account icon)
    const accountEls = document.querySelectorAll('.wd-header-my-account');
    accountEls.forEach(function (accountEl, idx) {
      const btnId = 'lmw-header-sound-btn-' + idx;
      if (document.getElementById(btnId)) return;
      const btn = document.createElement('button');
      btn.id = btnId;
      btn.type = 'button';
      btn.className = 'lmw-sound-toggle-btn';
      btn.style.cssText =
        'width:34px !important;height:34px !important;min-width:34px !important;min-height:34px !important;padding:0 !important;border-radius:50% !important;border:1.5px solid #B5893A !important;background:#FAF7F2;display:inline-flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;margin-left:6px !important;margin-right:4px !important;transition:all .2s;vertical-align:middle !important;';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleStoreMusic();
      });
      if (accountEl.parentElement) {
        accountEl.parentElement.insertBefore(btn, accountEl);
      }
    });
    broadcastMusicState();
  }

  // 2. CLEAN "3D İNCELE & ODANDA GÖR (AR)" BUTTON INSIDE PRODUCT SUMMARY (OPENS CLEAN POP-UP MODAL — NO GIANT INLINE BOX BELOW DESCRIPTION!)
  function mountInlineProduct3DShowroom() {
    const productPage = document.querySelector('.single-product-page') || document.querySelector('.single-product');
    if (!productPage) return;

    const titleEl = document.querySelector('h1.product_title') || document.querySelector('.entry-title');
    const productName = titleEl ? (titleEl.textContent || '').trim() : 'Limoon Home Koleksiyonu';

    const classBlob = (productPage.className + ' ' + document.body.className + ' ' + productName).toLowerCase();
    let categoryParam = 'koltuk';
    if (classBlob.includes('yemek') || classBlob.includes('masa') || classBlob.includes('konsol') || classBlob.includes('sandalye')) {
      categoryParam = 'yemek';
    } else if (classBlob.includes('yatak') || classBlob.includes('dolap') || classBlob.includes('gardirop') || classBlob.includes('karyola')) {
      categoryParam = 'yatak';
    }

    const productModalUrl =
      BASE_EMBED_3D_URL +
      '&inline=1&urun=' +
      encodeURIComponent(productName) +
      '&kategori=' +
      encodeURIComponent(categoryParam);

    const summaryTarget =
      document.querySelector('.wd-single-add-cart') ||
      document.querySelector('.product_meta') ||
      document.querySelector('.summary.entry-summary');

    if (summaryTarget && !document.getElementById('lmw-product-summary-cta')) {
      const ctaBar = document.createElement('div');
      ctaBar.id = 'lmw-product-summary-cta';
      ctaBar.style.cssText = 'margin:16px 0;display:flex;align-items:center;gap:8px;';
      ctaBar.innerHTML = `
        <button type="button" id="lmw-open-product-3d-modal" style="flex:1;min-width:190px;padding:13px 18px;border-radius:12px;border:1.5px solid #B5893A;background:#FAF7F2;color:#261E19;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 6px 20px rgba(181,137,58,0.12);transition:all .2s;">
          <span>🧊 3D İncele &amp; Odanda Gör (AR)</span>
        </button>
        <button type="button" id="lmw-summary-sound-btn" class="lmw-sound-toggle-btn" data-with-label="1" style="height:44px !important;min-height:44px !important;padding:0 14px !important;border-radius:12px !important;border:1.5px solid #B5893A !important;background:#FAF7F2;color:#261E19;cursor:pointer !important;display:inline-flex !important;align-items:center !important;justify-content:center !important;flex-shrink:0;transition:all .2s;" title="Mağaza Müziğini Aç / Kapat"></button>
      `;
      summaryTarget.parentNode.insertBefore(ctaBar, summaryTarget.nextSibling);
      const openBtn = document.getElementById('lmw-open-product-3d-modal');
      if (openBtn) {
        openBtn.addEventListener('click', function () {
          open3DModal(productModalUrl);
        });
      }
      const sumSoundBtn = document.getElementById('lmw-summary-sound-btn');
      if (sumSoundBtn) {
        sumSoundBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleStoreMusic();
        });
      }
      broadcastMusicState();
    }
  }

  // 3. GOOGLE RICH SNIPPETS ("Görünümlü SEO" — FurnitureStore & Product 3D Schema)
  function injectRichSEO() {
    if (document.getElementById('lmw-rich-seo-schema')) return;
    const titleEl = document.querySelector('h1.product_title');
    const productName = titleEl ? (titleEl.textContent || '').trim() : 'Limoon Home İnegöl Bohem Koltuk & Mobilya Koleksiyonu';
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FurnitureStore',
          name: 'Limoon Home & Living',
          url: window.location.origin,
          telephone: '+90-533-485-22-16',
          email: EMAIL,
          priceRange: '₺₺',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Wobilimoda Mobilya AVM, No: 85',
            addressLocality: 'İnegöl',
            addressRegion: 'Bursa',
            postalCode: '16400',
            addressCountry: 'TR',
          },
        },
        {
          '@type': 'Product',
          name: productName,
          brand: { '@type': 'Brand', name: 'Limoon Home' },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '61',
          },
        },
      ],
    };
    const script = document.createElement('script');
    script.id = 'lmw-rich-seo-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function attachNativeHeaderLink() {
    const allLinks = Array.from(document.querySelectorAll('a'));
    const teslimatLink = allLinks.find(function (a) {
      return (a.textContent || '').trim().toLowerCase() === 'teslimat ve kurulum';
    });
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
            const inlineSec = document.getElementById('lmw-inline-product-3d');
            if (inlineSec) {
              inlineSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              open3DModal();
            }
          });
          parentLi.parentElement.appendChild(cloneLi);
        }
      }
    }
  }

  function initAll() {
    fixExistingPageTypos();
    attachNativeHeaderLink();
    mountHeaderSoundIcon();
    mountInlineProduct3DShowroom();
    injectRichSEO();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  setTimeout(initAll, 1000);

  const style = document.createElement('style');
  style.textContent = `
    .lmw-modal-bg { position: fixed; inset: 0; z-index: 99999; background: rgba(38,30,25,0.45); backdrop-filter: blur(6px); display: none; align-items: center; justify-content: center; padding: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .lmw-modal-bg.open { display: flex; }
    .lmw-modal-bg.fullscreen-3d { padding: 0; background: #FAF7F2; }
    .lmw-modal-card { width: 100%; max-width: 760px; max-height: 85vh; overflow-y: auto; background: #FAF7F2; color: #261E19; border-radius: 20px; padding: 24px; position: relative; box-shadow: 0 28px 80px rgba(0,0,0,0.22); line-height: 1.6; font-size: 13.5px; }
    .lmw-modal-card.wide { width: 100vw; height: 100dvh; max-width: 100vw; max-height: 100dvh; padding: 0; border-radius: 0; background: #FAF7F2; color: #261E19; overflow: hidden; }
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
    document.querySelectorAll('#lmw-tabs [data-page]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-page') === key);
    });
    infoModal.classList.add('open');
  }

  let gyroBridgeAttached = false;
  function attachParentGyroBridge() {
    if (gyroBridgeAttached) return;
    gyroBridgeAttached = true;
    window.addEventListener('deviceorientation', function (ev) {
      const payload = { type: 'LIMOON_GYRO', alpha: ev.alpha, beta: ev.beta, gamma: ev.gamma };
      if (iframe3d && iframe3d.contentWindow && modal3d.classList.contains('open')) {
        iframe3d.contentWindow.postMessage(payload, '*');
      }
      const inlineIfr = document.getElementById('lmw-inline-iframe-3d');
      if (inlineIfr && inlineIfr.contentWindow) {
        inlineIfr.contentWindow.postMessage(payload, '*');
      }
    });
  }
  attachParentGyroBridge();

  function open3DModal(customUrl) {
    const target = (customUrl || BASE_EMBED_3D_URL) + '&v=' + Date.now();
    if (iframe3d.getAttribute('src') !== target) {
      iframe3d.setAttribute('src', target);
    }
    modal3d.classList.add('open');
  }

  document.getElementById('lmw-close-info').addEventListener('click', function () {
    infoModal.classList.remove('open');
  });
  infoModal.addEventListener('click', function (e) {
    if (e.target === infoModal) infoModal.classList.remove('open');
  });

  document.querySelectorAll('#lmw-tabs [data-page]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showInfoPage(btn.getAttribute('data-page'));
    });
  });

  document.getElementById('lmw-close-3d').addEventListener('click', function () {
    modal3d.classList.remove('open');
  });
  modal3d.addEventListener('click', function (e) {
    if (e.target === modal3d) modal3d.classList.remove('open');
  });

  document.addEventListener(
    'click',
    function (e) {
      const a = e.target.closest && e.target.closest('a');
      if (!a) return;
      const txt = (a.textContent || '').toLowerCase().trim();
      const href = (a.getAttribute('href') || '').toLowerCase();

      if (txt.includes('3d showroom')) {
        e.preventDefault();
        const inlineSec = document.getElementById('lmw-inline-product-3d');
        if (inlineSec) {
          inlineSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          open3DModal();
        }
      } else if (txt.includes('sıkça sorulan') || txt.includes('sikca sorulan') || txt === 'sss' || href.includes('sss') || href.includes('faq')) {
        e.preventDefault();
        showInfoPage('sss');
      } else if (txt.includes('teslimat ve kurulum') || txt.includes('teslimat & kurulum') || href.includes('teslimat')) {
        e.preventDefault();
        showInfoPage('teslimat');
      } else if (txt.includes('satış sonrası') || txt.includes('satis sonrasi') || txt.includes('garanti')) {
        e.preventDefault();
        showInfoPage('satissonrasi');
      } else if (txt.includes('müşteri hizmetleri') || txt.includes('musteri hizmetleri')) {
        e.preventDefault();
        showInfoPage('musteri');
      } else if (txt.includes('mesafeli satış') || txt.includes('mesafeli satis')) {
        e.preventDefault();
        showInfoPage('mesafeli');
      } else if (txt.includes('gizlilik') || txt.includes('güvenlik politikası') || txt.includes('kvkk')) {
        e.preventDefault();
        showInfoPage('gizlilik');
      }
    },
    true
  );
})();
