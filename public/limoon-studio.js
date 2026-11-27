/**
 * Limoon Home - Native 3D Multi-Piece Studio, WebAR, Global Music Playlist & Smart Assistant
 * Geliştirici: Emre Balcı (EMRE WEB & 3D / Emre Art Stüdyo)
 */
(function () {
  'use strict';
  if (window.__LIMOON_STUDIO_V2__) return;
  window.__LIMOON_STUDIO_V2__ = true;

  var PHONE = '905334852216';
  var BASE = 'https://qiens-home.vercel.app';

  // Clean up any legacy floating/duplicate buttons from older snippets
  ['lm-float-sound-btn', 'lm-hsound-btn', 'lmw-desktop-header-sound-btn', 'lmw-active-sound-btn', 'limoon-3d-btn-wrapper'].forEach(function (id) {
    var old = document.getElementById(id);
    if (old) old.remove();
  });
  document.querySelectorAll('.limoon-corp-sound-btn, .lmw-sound-toggle-btn, .lm-sound-btn').forEach(function (el) { el.remove(); });

  // Inject Styles
  var css = document.createElement('style');
  css.id = 'lm-studio-v2-css';
  css.textContent = [
    '.lm2-sound-wrap{display:inline-flex!important;align-items:center!important;gap:4px!important;vertical-align:middle!important;margin:0 8px 0 4px!important;flex-shrink:0!important;padding:2px!important;border-radius:999px!important;background:#FAF8F4!important;border:1px solid #E4DCCB!important;}',
    '.lm2-sbtn{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:30px!important;min-width:30px!important;max-width:30px!important;height:30px!important;min-height:30px!important;max-height:30px!important;padding:0!important;border-radius:50%!important;border:0!important;background:transparent!important;color:#1C1917!important;cursor:pointer!important;transition:all .2s!important;line-height:1!important;box-sizing:border-box!important;}',
    '.lm2-sbtn:hover{background:rgba(212,160,23,.12)!important;}',
    '.lm2-sbtn.on{background:#1C1917!important;color:#D4A017!important;}',
    '.lm2-next{display:none!important;align-items:center!important;justify-content:center!important;width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;max-width:28px!important;max-height:28px!important;padding:0!important;border-radius:50%!important;border:0!important;background:transparent!important;color:#1C1917!important;cursor:pointer!important;line-height:1!important;box-sizing:border-box!important;transition:all .2s!important;}',
    '.lm2-next:hover{background:rgba(28,25,23,.08)!important;}',
    '.lm2-next.show{display:inline-flex!important;}',
    '@keyframes lm2Eq{0%,100%{transform:scaleY(.45);}50%{transform:scaleY(1);}}',
    '.lm2-eq-bar{transform-origin:bottom;animation:lm2Eq .9s ease-in-out infinite;}',
    '.lm2-eq-bar:nth-child(2){animation-delay:.2s;}.lm2-eq-bar:nth-child(3){animation-delay:.4s;}',
    '#lm2-modal{display:none;position:fixed;inset:0;z-index:2147483640;align-items:center;justify-content:center;touch-action:none;overscroll-behavior:contain;}',
    '#lm2-modal.open{display:flex;}',
    '.lm2-backdrop{position:absolute;inset:0;background:rgba(20,16,14,.76);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);}',
    '.lm2-card{position:relative;z-index:2;width:96%;max-width:1020px;height:90dvh;max-height:860px;background:#FAF8F4;border-radius:22px;border:1.5px solid #D4A017;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 25px 70px rgba(0,0,0,.4);touch-action:none;}',
    '@media(max-width:768px){.lm2-card{width:100%;height:100dvh;max-height:100dvh;border-radius:0;border:0;}}',
    '.lm2-head{padding:10px 14px;background:#FAF8F4;border-bottom:1px solid #EAE3D5;display:flex;flex-direction:column;gap:8px;flex-shrink:0;}',
    '.lm2-top{display:flex;align-items:center;justify-content:space-between;gap:8px;}',
    '.lm2-tabs{display:flex;gap:6px;flex-wrap:wrap;}',
    '.lm2-tab{padding:6px 12px;border-radius:999px;border:1px solid #DDD4C3;background:#FFF;color:#1C1917;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;}',
    '.lm2-tab.act{background:#1C1917;color:#FFF;border-color:#1C1917;}',
    '.lm2-close{width:32px;height:32px;border-radius:50%;border:1px solid #DDD4C3;background:#FFF;color:#1C1917;font-size:15px;font-weight:700;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;}',
    '.lm2-bar{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;align-items:center;-webkit-overflow-scrolling:touch;}',
    '.lm2-pill{padding:5px 11px;border-radius:999px;border:1px solid #DDD4C3;background:#FFF;color:#1C1917;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all .15s;}',
    '.lm2-pill.act,.lm2-pill:hover{background:#D4A017;color:#FFF;border-color:#D4A017;}',
    '.lm2-swatch{width:22px;height:22px;border-radius:50%;border:2px solid #FFF;box-shadow:0 0 0 1px #C5BAA6;cursor:pointer;flex-shrink:0;transition:transform .15s;}',
    '.lm2-swatch.act{box-shadow:0 0 0 2px #D4A017;transform:scale(1.15);}',
    '.lm2-stage{flex:1;position:relative;width:100%;overflow:hidden;background:radial-gradient(circle at 50% 45%,#FFFFFF 0%,#EFEAE0 100%);touch-action:none;}',
    '#lm2-three-host{width:100%;height:100%;position:relative;touch-action:none;}',
    '#lm2-three-host canvas{display:block;width:100%!important;height:100%!important;touch-action:none!important;}',
    '#lm2-mv-host{display:none;width:100%;height:100%;position:relative;touch-action:none;}',
    '.lm2-ctrl-dock{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);z-index:15;display:flex;align-items:center;gap:6px;background:rgba(28,25,23,.92);backdrop-filter:blur(8px);padding:6px 10px;border-radius:999px;border:1px solid rgba(212,160,23,.45);max-width:95%;overflow-x:auto;box-shadow:0 10px 28px rgba(0,0,0,.28);}',
    '.lm2-cbtn{background:rgba(255,255,255,.1);color:#FFF;border:0;border-radius:999px;padding:6px 11px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:4px;}',
    '.lm2-cbtn:hover,.lm2-cbtn.gold{background:#D4A017;color:#FFF;}',
    '.lm2-hint{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:12;background:rgba(255,253,248,.92);color:#1C1917;border:1px solid #E4DCCB;padding:5px 12px;border-radius:999px;font-size:11px;font-weight:600;pointer-events:none;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.06);}',
    'body.lm2-locked{overflow:hidden!important;position:fixed!important;width:100%!important;height:100%!important;}',
    /* Limoon Home Live Proactive Assistant (Evseren Engine + Limoon Brand Palette) */
    '#lm2-chat-fab{position:fixed;bottom:24px;right:22px;z-index:99998;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#1C1917,#332B24);color:#FFF;border:2px solid #D4A017;box-shadow:0 8px 26px rgba(28,25,23,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:22px;transition:transform .25s;animation:lm2Pulse 2.6s infinite;}',
    '#lm2-chat-fab:hover{transform:scale(1.08);}',
    '@keyframes lm2Pulse{0%,100%{box-shadow:0 8px 24px rgba(212,160,23,.35);}50%{box-shadow:0 8px 34px rgba(212,160,23,.65);}}',
    '.lm2-live-badge{position:absolute;top:-5px;right:-5px;background:#00b894;color:#FFF;font-size:9px;font-weight:800;padding:2px 6px;border-radius:999px;border:2px solid #FFF;letter-spacing:.3px;line-height:1.1;}',
    '@media(max-width:768px){#lm2-chat-fab{bottom:78px!important;right:14px!important;width:50px!important;height:50px!important;font-size:20px!important;}}',
    '#lm2-chat-box{position:fixed;bottom:92px;right:22px;z-index:99999;width:360px;max-width:calc(100vw - 24px);height:510px;max-height:74dvh;background:#FFF;border-radius:20px;border:1.5px solid #D4A017;box-shadow:0 22px 60px rgba(0,0,0,.24);display:flex;flex-direction:column;overflow:hidden;font-family:inherit;transform:scale(.9) translateY(18px);transform-origin:bottom right;opacity:0;pointer-events:none;transition:all .26s cubic-bezier(.34,1.56,.64,1);}',
    '#lm2-chat-box.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}',
    '@media(max-width:768px){#lm2-chat-box{bottom:136px!important;right:12px!important;height:68dvh;}}',
    '.lm2-ch-head{background:linear-gradient(135deg,#1C1917,#2E261F);color:#FFF;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;border-bottom:2px solid #D4A017;}',
    '.lm2-ch-av{width:38px;height:38px;border-radius:50%;background:rgba(212,160,23,.2);border:1.5px solid #D4A017;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}',
    '.lm2-online-dot{width:7px;height:7px;border-radius:50%;background:#00ff88;display:inline-block;margin-right:4px;animation:lm2Blink 1.5s infinite;}',
    '@keyframes lm2Blink{0%,100%{opacity:1;}50%{opacity:.35;}}',
    '.lm2-ch-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#FAF8F4;scroll-behavior:smooth;font-size:12.8px;}',
    '.lm2-row{display:flex;gap:7px;align-items:flex-end;animation:lm2In .22s ease;}',
    '@keyframes lm2In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}',
    '.lm2-row.usr{flex-direction:row-reverse;}',
    '.lm2-rav{width:26px;height:26px;border-radius:50%;background:#1C1917;color:#D4A017;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;border:1px solid #D4A017;}',
    '.lm2-row.usr .lm2-rav{background:#D4A017;color:#FFF;}',
    '.lm2-bub{max-width:80%;padding:9px 13px;border-radius:16px;line-height:1.5;word-break:break-word;}',
    '.lm2-row.bot .lm2-bub{background:#FFF;color:#1C1917;border:1px solid #EAE3D5;border-bottom-left-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.05);}',
    '.lm2-row.usr .lm2-bub{background:#1C1917;color:#FFF;border-bottom-right-radius:4px;}',
    '.lm2-typing{display:flex;gap:4px;padding:4px 2px;align-items:center;}',
    '.lm2-typing span{width:6px;height:6px;border-radius:50%;background:#D4A017;animation:lm2Dot 1.1s infinite ease;}',
    '.lm2-typing span:nth-child(2){animation-delay:.18s;}.lm2-typing span:nth-child(3){animation-delay:.36s;}',
    '@keyframes lm2Dot{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-5px);}}',
    '.lm2-qwrap{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:2px 0;}',
    '.lm2-qbtn{padding:7px 9px!important;min-height:34px!important;height:auto!important;border-radius:10px!important;border:1px solid #E2D7C3!important;background:#FFF!important;color:#1C1917!important;font-size:11px!important;font-weight:600!important;cursor:pointer!important;transition:all .18s!important;line-height:1.2!important;text-align:left!important;display:flex!important;align-items:center!important;gap:5px!important;box-shadow:0 1px 3px rgba(0,0,0,.04)!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}',
    '.lm2-qbtn:hover{background:#1C1917!important;color:#FFF!important;border-color:#1C1917!important;}',
    '.lm2-link-chip{display:inline-block;margin:4px 4px 0 0;padding:5px 10px;border-radius:8px;background:#FAF6EE;border:1px solid #DFC896;color:#1C1917!important;font-size:11px;font-weight:700;text-decoration:none!important;transition:all .15s;}',
    '.lm2-link-chip:hover{background:#D4A017;color:#FFF!important;border-color:#D4A017;}'
  ].join('');
  document.head.appendChild(css);

  /* =========================================================================
   * 1. GLOBAL PERSISTENT STORE MUSIC ENGINE (3 Selected YouTube Store Mixes)
   * ========================================================================= */
  var PLAYLIST = [
    { type: 'yt', id: 'KlbyHOjHfKQ', title: 'Zara Style Deep House' },
    { type: 'yt', id: '9cgSf8Lfmxo', title: 'LCW Store Music 2026' },
    { type: 'yt', id: 'QxKmJb9sz1c', title: 'Sınırsız Lüks Butik' }
  ];

  var KEY_ON = 'lm2_music_on';
  var KEY_IDX = 'lm2_music_idx';
  var KEY_SEC = 'lm2_music_sec';

  var ytHolder = document.createElement('div');
  ytHolder.style.cssText = 'position:fixed;width:2px;height:2px;left:-9999px;bottom:0;opacity:0.001;pointer-events:none;overflow:hidden;';
  ytHolder.innerHTML = '<div id="lm2-yt-player"></div>';
  document.body.appendChild(ytHolder);

  var ytPlayer = null;
  var ytReady = false;
  var ytLoading = false;
  var ytPendingPlay = false;
  var activeLoadedVideoId = null;
  var saveTimer = null;

  var isPlaying = false;
  var currentIdx = parseInt(localStorage.getItem(KEY_IDX) || '0', 10);
  if (isNaN(currentIdx) || currentIdx < 0 || currentIdx >= PLAYLIST.length) currentIdx = 0;

  function getSavedSec() {
    var s = parseFloat(localStorage.getItem(KEY_SEC) || '0');
    return isNaN(s) || s < 0 ? 0 : s;
  }

  function persistTime() {
    if (!isPlaying) return;
    try {
      if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
        var sec = ytPlayer.getCurrentTime() || 0;
        if (sec > 0.5) localStorage.setItem(KEY_SEC, String(Math.floor(sec)));
      }
    } catch (e) {}
  }

  var SVG_MUSIC_OFF = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
  var SVG_MUSIC_ON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect class="lm2-eq-bar" x="4" y="8" width="3" height="12" rx="1.5"/><rect class="lm2-eq-bar" x="10.5" y="4" width="3" height="16" rx="1.5"/><rect class="lm2-eq-bar" x="17" y="9" width="3" height="11" rx="1.5"/></svg>';
  var SVG_NEXT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>';

  function updateSoundUI() {
    document.querySelectorAll('.lm2-sbtn').forEach(function (b) {
      if (isPlaying) {
        b.classList.add('on');
        b.innerHTML = SVG_MUSIC_ON;
        b.title = 'Mağaza Müziğini Kapat';
      } else {
        b.classList.remove('on');
        b.innerHTML = SVG_MUSIC_OFF;
        b.title = 'Mağaza Müziğini Aç';
      }
    });
    document.querySelectorAll('.lm2-next').forEach(function (nb) {
      if (isPlaying) nb.classList.add('show');
      else nb.classList.remove('show');
    });
  }

  function ensureYTAPI(cb) {
    if (ytReady && ytPlayer) { cb(); return; }
    ytPendingPlay = true;
    if (ytLoading) return;
    ytLoading = true;
    var prevCb = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof prevCb === 'function') prevCb();
      var initTrack = PLAYLIST[currentIdx] || PLAYLIST[0];
      activeLoadedVideoId = initTrack.id;
      ytPlayer = new window.YT.Player('lm2-yt-player', {
        height: '2',
        width: '2',
        videoId: initTrack.id,
        playerVars: { autoplay: 0, controls: 0, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: function () {
            ytReady = true;
            if (ytPendingPlay && isPlaying) {
              startCurrentTrack(getSavedSec());
            }
          },
          onStateChange: function (ev) {
            if (ev && ev.data === 0 && isPlaying) {
              switchTrack(currentIdx + 1, 0);
            }
          },
          onError: function (ev) {
            if (isPlaying && ev && (ev.data === 100 || ev.data === 101 || ev.data === 150)) {
              switchTrack(currentIdx + 1, 0);
            }
          }
        }
      });
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      var s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    } else if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
  }

  function stopAllAudio() {
    try { if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo(); } catch (e) {}
  }

  function startCurrentTrack(seekSec) {
    var track = PLAYLIST[currentIdx];
    localStorage.setItem(KEY_IDX, String(currentIdx));
    updateSoundUI();

    if (!ytReady || !ytPlayer) {
      ensureYTAPI(function () { startCurrentTrack(seekSec); });
      return;
    }
    try {
      ytPlayer.setVolume(42);
      if (activeLoadedVideoId !== track.id) {
        activeLoadedVideoId = track.id;
        ytPlayer.loadVideoById({ videoId: track.id, startSeconds: Math.floor(seekSec || 0) });
      } else {
        if (seekSec > 1) ytPlayer.seekTo(seekSec, true);
        ytPlayer.playVideo();
      }
    } catch (e) {}
  }

  function switchTrack(idx, sec) {
    currentIdx = ((idx % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    localStorage.setItem(KEY_IDX, String(currentIdx));
    localStorage.setItem(KEY_SEC, String(sec || 0));
    if (isPlaying) startCurrentTrack(sec || 0);
    else updateSoundUI();
  }

  function toggleMusic(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (isPlaying) {
      persistTime();
      isPlaying = false;
      ytPendingPlay = false;
      localStorage.setItem(KEY_ON, '0');
      stopAllAudio();
      clearInterval(saveTimer);
      updateSoundUI();
    } else {
      isPlaying = true;
      localStorage.setItem(KEY_ON, '1');
      startCurrentTrack(getSavedSec());
      clearInterval(saveTimer);
      saveTimer = setInterval(persistTime, 500);
      updateSoundUI();
    }
  }

  function nextTrack(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!isPlaying) { toggleMusic(); return; }
    switchTrack(currentIdx + 1, 0);
  }

  window.addEventListener('pagehide', persistTime);
  window.addEventListener('beforeunload', persistTime);
  document.addEventListener('visibilitychange', persistTime);
  document.addEventListener('click', function (ev) {
    if (ev && ev.target && ev.target.closest && ev.target.closest('a[href]')) persistTime();
  }, true);

  // Global cross-page resume: stay on the EXACT same track & second!
  if (localStorage.getItem(KEY_ON) === '1') {
    isPlaying = true;
    saveTimer = setInterval(persistTime, 500);
    var resumedOnce = false;
    var resumeHandler = function (ev) {
      if (resumedOnce || localStorage.getItem(KEY_ON) !== '1') return;
      if (ev && ev.target && ev.target.closest && ev.target.closest('.lm2-sound-wrap')) return;
      resumedOnce = true;
      startCurrentTrack(getSavedSec());
      window.removeEventListener('pointerdown', resumeHandler);
      window.removeEventListener('click', resumeHandler);
    };
    window.addEventListener('pointerdown', resumeHandler, { passive: true });
    window.addEventListener('click', resumeHandler, { passive: true });
    setTimeout(function () {
      if (localStorage.getItem(KEY_ON) === '1' && !resumedOnce) {
        startCurrentTrack(getSavedSec());
      }
    }, 300);
  }

  function mountHeaderMusic() {
    if (document.querySelector('.lm2-sound-wrap')) { updateSoundUI(); return; }
    var acc = document.querySelector('.wd-header-my-account');
    var desktopCol = document.querySelector('.whb-general-header .whb-col-right.whb-visible-lg, .whb-header .whb-col-right.whb-visible-lg');
    var mobileCol = document.querySelector('.whb-general-header .whb-col-right.whb-hidden-lg');

    var wrap = document.createElement('span');
    wrap.className = 'lm2-sound-wrap';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lm2-sbtn';
    btn.addEventListener('click', toggleMusic);
    var nbtn = document.createElement('button');
    nbtn.type = 'button';
    nbtn.className = 'lm2-next';
    nbtn.title = 'Sonraki Parça';
    nbtn.innerHTML = SVG_NEXT;
    nbtn.addEventListener('click', nextTrack);
    wrap.appendChild(btn);
    wrap.appendChild(nbtn);

    if (acc && acc.offsetParent !== null && acc.parentElement) {
      acc.parentElement.insertBefore(wrap, acc);
    } else if (desktopCol && desktopCol.offsetParent !== null) {
      desktopCol.classList.remove('whb-empty-column');
      desktopCol.prepend(wrap);
    } else if (mobileCol && mobileCol.offsetParent !== null) {
      mobileCol.prepend(wrap);
    } else if (acc && acc.parentElement) {
      acc.parentElement.insertBefore(wrap, acc);
    }
    updateSoundUI();
  }

  /* =========================================================================
   * 2. WHATSAPP-MATCHING 3D BUTTON + MULTI-PIECE INTERACTIVE 3D & AR MODAL
   * ========================================================================= */
  var COLORS = [
    { name: 'Krem Boucle', hex: '#E4DAC8' },
    { name: 'Vizon Bej', hex: '#C6B39A' },
    { name: 'Antrasit', hex: '#34373E' },
    { name: 'Terracotta', hex: '#A55B43' },
    { name: 'Zümrüt', hex: '#235945' },
    { name: 'Gece Mavisi', hex: '#253D5E' }
  ];

  var PIECES = [
    { id: 'sofa3', label: "3'lü Koltuk", url: BASE + '/models/limoon-3lu-koltuk.glb', x: 0, z: -1.05, rot: 0 },
    { id: 'sofa2', label: "2'li Koltuk", url: BASE + '/models/limoon-2li-koltuk.glb', x: -1.55, z: 0.35, rot: 90 },
    { id: 'chair', label: 'Tekli Berjer', url: BASE + '/models/limoon-berjer.glb', x: 1.45, z: 0.35, rot: -105 },
    { id: 'table', label: 'Orta Sehpa', url: BASE + '/models/limoon-orta-sehpa.glb', x: 0, z: 0.35, rot: 0 }
  ];

  var FULL_SET_URL = BASE + '/models/limoon-koltuk-tam-takim.glb';

  // Ensure model-viewer script is loaded once
  if (!document.querySelector('script[src*="model-viewer"]')) {
    var mvScript = document.createElement('script');
    mvScript.type = 'module';
    mvScript.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    document.head.appendChild(mvScript);
  }

  // Build Modal DOM
  var modal = document.createElement('div');
  modal.id = 'lm2-modal';
  modal.innerHTML =
    '<div class="lm2-backdrop"></div>' +
    '<div class="lm2-card">' +
      '<div class="lm2-head">' +
        '<div class="lm2-top">' +
          '<div class="lm2-tabs">' +
            '<button type="button" class="lm2-tab act" data-tab="room">🛋️ Odayı Düzenle (Tek Tek Taşı/Çevir)</button>' +
            '<button type="button" class="lm2-tab" data-tab="ar">📱 1:1 Hızlı AR (Odanda Gör)</button>' +
          '</div>' +
          '<button type="button" class="lm2-close" id="lm2-close">✕</button>' +
        '</div>' +
        '<div class="lm2-bar" id="lm2-piece-bar"></div>' +
        '<div class="lm2-bar" id="lm2-color-bar"><span style="font-size:11px;font-weight:700;color:#786B5E;margin-right:4px;">Kumaş Rengi:</span></div>' +
      '</div>' +
      '<div class="lm2-stage">' +
        '<div id="lm2-three-host">' +
          '<div class="lm2-hint" id="lm2-hint">💡 Herhangi bir koltuğa dokunup sürükle veya çevir</div>' +
          '<div class="lm2-ctrl-dock" id="lm2-dock">' +
            '<button type="button" class="lm2-cbtn" id="lm2-rot-l">↶ Sola Çevir</button>' +
            '<button type="button" class="lm2-cbtn" id="lm2-rot-r">↷ Sağa Çevir</button>' +
            '<button type="button" class="lm2-cbtn" id="lm2-reset">🔄 Sıfırla</button>' +
            '<button type="button" class="lm2-cbtn gold" id="lm2-launch-ar">📱 Odamda Gör (AR)</button>' +
          '</div>' +
        '</div>' +
        '<div id="lm2-mv-host">' +
          '<model-viewer id="lm2-mv" src="" ar ar-modes="scene-viewer quick-look webxr" ar-scale="auto" ar-placement="floor" camera-controls touch-action="none" shadow-intensity="1.5" shadow-softness="0.9" environment-image="neutral" bounds="tight" style="width:100%;height:100%;outline:none;touch-action:none;">' +
            '<button slot="ar-button" style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:#1C1917;color:#FFF;border:1.5px solid #D4A017;border-radius:999px;padding:12px 24px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;box-shadow:0 10px 28px rgba(0,0,0,.3);">📱 Gerçek Ölçüyle Odama Koy (AR)</button>' +
          '</model-viewer>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);

  var pieceBar = document.getElementById('lm2-piece-bar');
  var colorBar = document.getElementById('lm2-color-bar');
  var threeHost = document.getElementById('lm2-three-host');
  var mvHost = document.getElementById('lm2-mv-host');
  var mvEl = document.getElementById('lm2-mv');
  var hintEl = document.getElementById('lm2-hint');

  var activeTab = 'room';
  var selectedPieceId = 'sofa3';
  var activeColorHex = COLORS[0].hex;
  var savedScrollY = 0;

  // Populate Piece Bar
  function renderPieceBar() {
    pieceBar.innerHTML = '';
    if (activeTab === 'ar') {
      var allBtn = document.createElement('button');
      allBtn.type = 'button';
      allBtn.className = 'lm2-pill' + (selectedPieceId === 'all' ? ' act' : '');
      allBtn.textContent = 'Tüm Takım';
      allBtn.onclick = function () { selectedPieceId = 'all'; mvEl.setAttribute('src', FULL_SET_URL); renderPieceBar(); };
      pieceBar.appendChild(allBtn);
    }
    PIECES.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lm2-pill' + (selectedPieceId === p.id ? ' act' : '');
      b.textContent = p.label;
      b.onclick = function () {
        selectedPieceId = p.id;
        renderPieceBar();
        if (activeTab === 'room') {
          selectThreePiece(p.id);
        } else {
          mvEl.setAttribute('src', p.url);
        }
      };
      pieceBar.appendChild(b);
    });
  }

  // Populate Color Swatches
  COLORS.forEach(function (c, i) {
    var sw = document.createElement('button');
    sw.type = 'button';
    sw.className = 'lm2-swatch' + (i === 0 ? ' act' : '');
    sw.style.background = c.hex;
    sw.title = c.name;
    sw.onclick = function () {
      activeColorHex = c.hex;
      colorBar.querySelectorAll('.lm2-swatch').forEach(function (x) { x.classList.remove('act'); });
      sw.classList.add('act');
      applyFabricColor(c.hex);
    };
    colorBar.appendChild(sw);
  });

  // Tab switching
  modal.querySelectorAll('.lm2-tab').forEach(function (t) {
    t.onclick = function () {
      activeTab = t.getAttribute('data-tab');
      modal.querySelectorAll('.lm2-tab').forEach(function (x) { x.classList.remove('act'); });
      t.classList.add('act');
      if (activeTab === 'room') {
        threeHost.style.display = 'block';
        mvHost.style.display = 'none';
        colorBar.style.display = 'flex';
        if (selectedPieceId === 'all') selectedPieceId = 'sofa3';
        renderPieceBar();
        initThreeStudio();
      } else {
        threeHost.style.display = 'none';
        mvHost.style.display = 'block';
        colorBar.style.display = 'none';
        renderPieceBar();
        var chosen = PIECES.find(function (p) { return p.id === selectedPieceId; });
        mvEl.setAttribute('src', chosen ? chosen.url : FULL_SET_URL);
      }
    };
  });

  // --- INTERACTIVE THREE.JS MULTI-PIECE STUDIO ---
  var threeInited = false;
  var threeAPI = { select: function () {}, rotate: function () {}, reset: function () {}, color: function () {}, exportAR: function () {} };

  function selectThreePiece(id) { threeAPI.select(id); }
  function applyFabricColor(hex) { threeAPI.color(hex); }

  async function initThreeStudio() {
    if (threeInited) return;
    threeInited = true;
    hintEl.textContent = '⏳ 3D Salon yükleniyor...';
    try {
      var THREE = await import('https://esm.sh/three@0.169.0');
      var OrbitControlsMod = await import('https://esm.sh/three@0.169.0/examples/jsm/controls/OrbitControls.js');
      var GLTFLoaderMod = await import('https://esm.sh/three@0.169.0/examples/jsm/loaders/GLTFLoader.js');
      var GLTFExporterMod = await import('https://esm.sh/three@0.169.0/examples/jsm/exporters/GLTFExporter.js');

      var scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf4efe6);

      var w = threeHost.clientWidth || 640;
      var h = threeHost.clientHeight || 480;
      var camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 60);
      camera.position.set(0, 3.1, 4.9);

      var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      threeHost.insertBefore(renderer.domElement, threeHost.firstChild);

      var controls = new OrbitControlsMod.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.maxPolarAngle = Math.PI / 2 - 0.06;
      controls.minDistance = 2.0;
      controls.maxDistance = 9.5;
      controls.target.set(0, 0.45, 0);
      controls.update();

      // Studio Lighting
      scene.add(new THREE.HemisphereLight(0xfffdf7, 0xd9cbb8, 1.35));
      var dir = new THREE.DirectionalLight(0xfff8ee, 1.45);
      dir.position.set(4.5, 7.5, 5.0);
      dir.castShadow = true;
      dir.shadow.mapSize.set(1024, 1024);
      dir.shadow.camera.near = 1;
      dir.shadow.camera.far = 22;
      dir.shadow.camera.left = -5;
      dir.shadow.camera.right = 5;
      dir.shadow.camera.top = 5;
      dir.shadow.camera.bottom = -5;
      dir.shadow.bias = -0.0005;
      scene.add(dir);

      var fill = new THREE.DirectionalLight(0xf3ece0, 0.55);
      fill.position.set(-4, 3, -3);
      scene.add(fill);

      // Open Studio Floor & Woven Rug
      var floor = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 24),
        new THREE.MeshStandardMaterial({ color: 0xefe9de, roughness: 0.92 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      var rug = new THREE.Mesh(
        new THREE.BoxGeometry(4.6, 0.014, 3.4),
        new THREE.MeshStandardMaterial({ color: 0xe3dacb, roughness: 0.96 })
      );
      rug.position.set(0, 0.007, 0.05);
      rug.receiveShadow = true;
      scene.add(rug);

      // Subtle Selection Ring
      var ring = new THREE.Mesh(
        new THREE.RingGeometry(0.95, 1.04, 48),
        new THREE.MeshBasicMaterial({ color: 0xd4a017, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.022;
      ring.visible = false;
      scene.add(ring);

      var loader = new GLTFLoaderMod.GLTFLoader();
      var pieceMap = {};
      var pieceMeshes = [];

      function updateRing() {
        var grp = pieceMap[selectedPieceId];
        if (!grp) { ring.visible = false; return; }
        ring.visible = true;
        ring.position.x = grp.position.x;
        ring.position.z = grp.position.z;
        var rad = grp.userData.radius || 0.9;
        ring.scale.set(rad, rad, 1);
      }

      var loadedCount = 0;
      PIECES.forEach(function (spec) {
        loader.load(spec.url, function (gltf) {
          var model = gltf.scene;
          var box = new THREE.Box3().setFromObject(model);
          var center = box.getCenter(new THREE.Vector3());
          var size = box.getSize(new THREE.Vector3());
          // Center XZ and snap bottom to y = 0 (zero floating!)
          model.position.x -= center.x;
          model.position.z -= center.z;
          model.position.y -= box.min.y;

          model.traverse(function (ch) {
            if (ch.isMesh) {
              ch.castShadow = true;
              ch.receiveShadow = true;
              ch.userData.pieceId = spec.id;
              if (ch.material && ch.material.color) {
                ch.material = ch.material.clone();
                ch.userData.origColor = ch.material.color.getHex();
              }
            }
          });

          var root = new THREE.Group();
          root.add(model);
          root.position.set(spec.x, 0.014, spec.z);
          root.rotation.y = THREE.MathUtils.degToRad(spec.rot);
          root.userData.pieceId = spec.id;
          root.userData.spec = spec;
          root.userData.radius = Math.max(size.x, size.z) * 0.56;

          scene.add(root);
          pieceMap[spec.id] = root;
          pieceMeshes.push(root);

          loadedCount++;
          if (loadedCount === PIECES.length) {
            hintEl.textContent = '💡 Koltuğa dokun: taşı • Boşluğa dokun: odayı döndür';
            updateRing();
          }
        });
      });

      // Drag individual piece on floor plane
      var raycaster = new THREE.Raycaster();
      var pointer = new THREE.Vector2();
      var floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.014);
      var hitPt = new THREE.Vector3();
      var dragOffset = new THREE.Vector3();
      var draggingGrp = null;

      function setPointer(ev) {
        var rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      }

      renderer.domElement.addEventListener('pointerdown', function (ev) {
        if (ev.button && ev.button !== 0) return;
        setPointer(ev);
        raycaster.setFromCamera(pointer, camera);
        var hits = raycaster.intersectObjects(pieceMeshes, true);
        if (hits.length > 0) {
          var pid = hits[0].object.userData.pieceId;
          if (pid && pieceMap[pid]) {
            selectedPieceId = pid;
            renderPieceBar();
            updateRing();
            draggingGrp = pieceMap[pid];
            controls.enabled = false;
            if (raycaster.ray.intersectPlane(floorPlane, hitPt)) {
              dragOffset.copy(draggingGrp.position).sub(hitPt);
            }
            var spec = PIECES.find(function (p) { return p.id === pid; });
            if (spec) hintEl.textContent = '✨ Seçili: ' + spec.label + ' — Sürükle veya alttan çevir';
          }
        }
      });

      renderer.domElement.addEventListener('pointermove', function (ev) {
        if (!draggingGrp) return;
        ev.preventDefault();
        setPointer(ev);
        raycaster.setFromCamera(pointer, camera);
        if (raycaster.ray.intersectPlane(floorPlane, hitPt)) {
          var nx = Math.max(-2.6, Math.min(2.6, hitPt.x + dragOffset.x));
          var nz = Math.max(-2.2, Math.min(2.2, hitPt.z + dragOffset.z));
          draggingGrp.position.x = nx;
          draggingGrp.position.z = nz;
          updateRing();
        }
      });

      function endDrag() {
        if (draggingGrp) {
          draggingGrp = null;
          controls.enabled = true;
        }
      }
      window.addEventListener('pointerup', endDrag);
      window.addEventListener('pointercancel', endDrag);

      // Resize observer
      function onResize() {
        var nw = threeHost.clientWidth;
        var nh = threeHost.clientHeight;
        if (nw > 20 && nh > 20) {
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
      }
      window.addEventListener('resize', onResize);
      if (window.ResizeObserver) new ResizeObserver(onResize).observe(threeHost);

      (function animate() {
        requestAnimationFrame(animate);
        if (modal.classList.contains('open') && activeTab === 'room') {
          controls.update();
          renderer.render(scene, camera);
        }
      })();

      threeAPI.select = function (id) {
        selectedPieceId = id;
        updateRing();
        var spec = PIECES.find(function (p) { return p.id === id; });
        if (spec) hintEl.textContent = '✨ Seçili: ' + spec.label + ' — Sürükle veya alttan çevir';
      };

      threeAPI.rotate = function (deg) {
        var grp = pieceMap[selectedPieceId];
        if (grp) grp.rotation.y += THREE.MathUtils.degToRad(deg);
      };

      threeAPI.reset = function () {
        PIECES.forEach(function (spec) {
          var grp = pieceMap[spec.id];
          if (grp) {
            grp.position.set(spec.x, 0.014, spec.z);
            grp.rotation.y = THREE.MathUtils.degToRad(spec.rot);
          }
        });
        controls.target.set(0, 0.45, 0);
        camera.position.set(0, 3.1, 4.9);
        controls.update();
        updateRing();
      };

      threeAPI.color = function (hex) {
        var targetCol = new THREE.Color(hex);
        Object.keys(pieceMap).forEach(function (id) {
          if (id === 'table') return; // keep coffee table travertine/wood
          pieceMap[id].traverse(function (ch) {
            if (ch.isMesh && ch.material && ch.material.color) {
              var hsl = {};
              new THREE.Color(ch.userData.origColor || 0xffffff).getHSL(hsl);
              // Recolor light/fabric meshes, keep dark wood legs intact
              if (hsl.l > 0.35) {
                ch.material.color.copy(targetCol);
              }
            }
          });
        });
      };

      threeAPI.exportAR = function () {
        // Export custom arranged layout for Quick Look / WebXR, or fallback to direct piece AR
        hintEl.textContent = '📱 Gerçek AR hazırlanıyor...';
        var exporter = new GLTFExporterMod.GLTFExporter();
        var exportGrp = new THREE.Group();
        Object.keys(pieceMap).forEach(function (id) {
          exportGrp.add(pieceMap[id].clone(true));
        });
        exporter.parse(
          exportGrp,
          function (res) {
            if (res instanceof ArrayBuffer) {
              var blob = new Blob([res], { type: 'model/gltf-binary' });
              var blobUrl = URL.createObjectURL(blob);
              mvEl.setAttribute('src', blobUrl);
              setTimeout(function () {
                hintEl.textContent = '💡 Koltuğa dokun: taşı • Boşluğa dokun: odayı döndür';
                if (typeof mvEl.activateAR === 'function') mvEl.activateAR();
              }, 220);
            }
          },
          function () {
            var chosen = PIECES.find(function (p) { return p.id === selectedPieceId; });
            mvEl.setAttribute('src', chosen ? chosen.url : FULL_SET_URL);
            setTimeout(function () { if (typeof mvEl.activateAR === 'function') mvEl.activateAR(); }, 180);
          },
          { binary: true }
        );
      };
    } catch (err) {
      // Fallback to Model Viewer if WebGL/ESM blocked
      threeHost.style.display = 'none';
      mvHost.style.display = 'block';
      mvEl.setAttribute('src', FULL_SET_URL);
    }
  }

  document.getElementById('lm2-rot-l').onclick = function () { threeAPI.rotate(-15); };
  document.getElementById('lm2-rot-r').onclick = function () { threeAPI.rotate(15); };
  document.getElementById('lm2-reset').onclick = function () { threeAPI.reset(); };
  document.getElementById('lm2-launch-ar').onclick = function () { threeAPI.exportAR(); };

  function openModal() {
    savedScrollY = window.scrollY;
    modal.classList.add('open');
    document.body.classList.add('lm2-locked');
    document.body.style.top = '-' + savedScrollY + 'px';
    renderPieceBar();
    if (activeTab === 'room') initThreeStudio();
    else mvEl.setAttribute('src', FULL_SET_URL);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.classList.remove('lm2-locked');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
  }

  document.getElementById('lm2-close').onclick = closeModal;
  modal.querySelector('.lm2-backdrop').onclick = closeModal;
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  function attach3DButton() {
    if (document.getElementById('limoon-3d-btn-wrapper')) return;
    var wa = document.querySelector("a[href*='wa.me'], .wd-single-add-cart, .single_add_to_cart_button");
    if (!wa) return;
    var w = document.createElement('div');
    w.id = 'limoon-3d-btn-wrapper';
    w.style.cssText = 'margin-top:10px;margin-bottom:14px;width:100%;clear:both;';
    w.innerHTML =
      '<button type="button" id="limoon-trigger-3d" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:48px;padding:12px 20px;background:#1C1917;color:#FFF;border:1.5px solid #D4A017;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.1);transition:all .2s;">' +
        '<span style="font-size:17px;">🧊</span>' +
        '<span>3D İncele &amp; Odanda Gör (AR)</span>' +
        '<span style="padding:2px 7px;background:#D4A017;color:#FFF;font-size:10px;font-weight:800;border-radius:4px;">1:1</span>' +
      '</button>';
    if (wa.nextSibling) wa.parentNode.insertBefore(w, wa.nextSibling);
    else wa.parentNode.appendChild(w);
    document.getElementById('limoon-trigger-3d').addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  }

  /* =========================================================================
   * 3. LIMOON HOME LIVE PROACTIVE ASSISTANT (Evseren Engine + Limoon Identity)
   * ========================================================================= */
  var ALL_TOPICS = [
    '🛋️ Koltuk Takımları',
    '🛏️ Yatak Odaları',
    '🍽️ Yemek Odaları',
    '📺 TV Üniteleri',
    '💍 Düğün Paketi',
    '🎨 Renk Kartelası',
    '🚚 Teslimat & Kurulum',
    '💳 Taksit & Ödeme',
    '📦 Sipariş Takibi',
    '📍 Mağaza Adresi'
  ];

  var chatFab = document.createElement('button');
  chatFab.id = 'lm2-chat-fab';
  chatFab.type = 'button';
  chatFab.title = 'Limoon Home Canlı Asistan';
  chatFab.innerHTML = '<span id="lm2-fab-ico">💬</span><span class="lm2-live-badge">Canlı</span>';
  document.body.appendChild(chatFab);

  var chatBox = document.createElement('div');
  chatBox.id = 'lm2-chat-box';
  chatBox.innerHTML =
    '<div class="lm2-ch-head">' +
      '<div class="lm2-ch-av">🛋️</div>' +
      '<div style="flex:1;">' +
        '<div style="font-size:13.5px;font-weight:800;line-height:1.2;">Limoon Home Asistanı</div>' +
        '<div style="font-size:10.5px;color:#E8DFD0;display:flex;align-items:center;margin-top:2px;"><span class="lm2-online-dot"></span>Çevrimiçi — İnegöl Müşteri Destek</div>' +
      '</div>' +
      '<button type="button" id="lm2-ch-close" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.14);border:0;color:#FFF;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>' +
    '</div>' +
    '<div class="lm2-ch-msgs" id="lm2-ch-msgs"></div>' +
    '<form id="lm2-ch-form" style="display:flex;border-top:1px solid #EAE3D5;padding:10px 12px;gap:8px;background:#FFF;flex-shrink:0;">' +
      '<input id="lm2-ch-in" type="text" placeholder="Model, ölçü, fiyat veya teslimat sorun..." maxlength="400" style="flex:1;border:1.5px solid #E4DCCB;border-radius:999px;padding:8px 14px;font-size:12.5px;outline:none;background:#FAF8F4;color:#1C1917;" />' +
      '<button type="submit" id="lm2-ch-send" style="width:36px;height:36px;background:linear-gradient(135deg,#1C1917,#332B24);color:#D4A017;border:1.5px solid #D4A017;border-radius:50%;font-size:14px;font-weight:800;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;">➤</button>' +
    '</form>' +
    '<div style="text-align:center;font-size:10px;color:#8C7F70;padding:5px 10px 7px;background:#FFF;border-top:1px solid #F2ECE2;">Limoon Home İnegöl • <a href="https://wa.me/' + PHONE + '" target="_blank" style="color:#B5893A;font-weight:700;text-decoration:none;">WhatsApp: +90 533 485 22 16</a></div>';
  document.body.appendChild(chatBox);

  var msgsEl = document.getElementById('lm2-ch-msgs');
  var prodTitle = (document.querySelector('h1.product_title') ? document.querySelector('h1.product_title').textContent.trim() : 'Limoon Home Mobilya');
  var chatTyping = false;

  function getReply(q) {
    var s = q.toLocaleLowerCase('tr-TR');
    var waLink = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Merhaba, ' + prodTitle + ' hakkında bilgi ve fiyat teklifi almak istiyorum.');
    var waBtn = '<br><a href="' + waLink + '" target="_blank" style="display:inline-block;margin-top:8px;padding:7px 13px;background:#25D366;color:#FFF;border-radius:999px;font-weight:700;text-decoration:none;font-size:11.5px;">📲 WhatsApp\'tan Hemen Teklif Al</a>';

    if (s.indexOf('başka') !== -1 || s.indexOf('baska') !== -1 || s.indexOf('neler var') !== -1 || s.indexOf('liste') !== -1 || s.indexOf('yardım') !== -1 || s.indexOf('yardim') !== -1 || s.indexOf('menu') !== -1 || s.indexOf('menü') !== -1) {
      return '<strong>Limoon Home Koleksiyonlarımız:</strong><br>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/koltuk-takimi/">🛋️ Koltuk Takımları →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/kose-koltuk/">🛋️ Köşe Koltuklar →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/yemek-odasi-takimi/">🍽️ Yemek Odaları →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/yatak-odasi-takimlari/">🛏️ Yatak Odaları →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/tv-unitesi/">📺 TV Üniteleri →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/kampanyalar/">🔥 Kampanyalar →</a>';
    }
    if (s.indexOf('düğün') !== -1 || s.indexOf('dugun') !== -1 || s.indexOf('paket') !== -1 || s.indexOf('çeyiz') !== -1 || s.indexOf('ceyiz') !== -1) {
      return '<strong>💍 Komple Düğün Paketleri:</strong><br>Koltuk Takımı + Yatak Odası + Yemek Odası 3\'lü kombinasyonlarında İnegöl fabrika çıkışı özel paket indirimi, ücretsiz renk/kumaş seçimi ve 81 ile ücretsiz kurulum sunuyoruz!<br>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/kampanyalar/">🔥 Kampanyalı Setleri Gör →</a>' + waBtn;
    }
    if (s.indexOf('yatak') !== -1 || s.indexOf('gardırop') !== -1 || s.indexOf('gardirop') !== -1 || s.indexOf('baza') !== -1 || s.indexOf('karyola') !== -1 || s.indexOf('şifonyer') !== -1) {
      return '<strong>🛏️ Yatak Odası Koleksiyonu:</strong><br>Sürgülü/kapaklı gardırop, bazalı karyola, şifonyer ve komodin takımları 1. sınıf MDF lake ve doğal ahşap kaplama ile odanıza özel ölçüde üretilir.<br>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/yatak-odasi-takimlari/">Tüm Yatak Odaları →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/yatak-odasi-takimlari/dolap/">Dolaplar →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/yatak-odasi-takimlari/karyola/">Karyolalar →</a>' + waBtn;
    }
    if (s.indexOf('yemek') !== -1 || s.indexOf('masa') !== -1 || s.indexOf('konsol') !== -1 || s.indexOf('sandalye') !== -1) {
      return '<strong>🍽️ Yemek Odası Koleksiyonu:</strong><br>Açılır/sabit traverten ve ahşap yemek masaları, aynalı konsol ve 6 adet silinebilir buklet/kadife sandalye seçenekleriyle üretilir.<br>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/yemek-odasi-takimi/">Tüm Yemek Odaları →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/yemek-odasi-takimi/yemek-masasi/">Yemek Masaları →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/yemek-odasi-takimi/konsol/">Konsollar →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/yemek-odasi-takimi/sandalye/">Sandalyeler →</a>' + waBtn;
    }
    if (s.indexOf('tv') !== -1 || s.indexOf('ünite') !== -1 || s.indexOf('unite') !== -1 || s.indexOf('sehpa') !== -1) {
      return '<strong>📺 TV Üniteleri &amp; Sehpalar:</strong><br>Modern salonlara özel lake ve doğal ahşap TV üniteleri ile orta/yan sehpalar.<br>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/tv-unitesi/">Tüm TV Üniteleri →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/tamamlayici-urunler/">Tamamlayıcı Ürünler →</a>' + waBtn;
    }
    if (s.indexOf('taksit') !== -1 || s.indexOf('ödeme') !== -1 || s.indexOf('odeme') !== -1 || s.indexOf('kart') !== -1 || s.indexOf('havale') !== -1 || s.indexOf('kupon') !== -1) {
      return '<strong>💳 Taksit ve Ödeme Seçenekleri:</strong><br>• Tüm kredi kartlarına avantajlı <strong>taksit imkânı</strong><br>• Havale / EFT ödemelerinde ekstra fabrika nakit indirimi<br>• 256-bit SSL ve 3D Secure ile %100 güvenli ödeme.' + waBtn;
    }
    if (s.indexOf('takip') !== -1 || s.indexOf('sipariş') !== -1 || s.indexOf('siparis') !== -1 || s.indexOf('durum') !== -1 || (s.indexOf('nerede') !== -1 && s.indexOf('adres') === -1 && s.indexOf('mağaza') === -1 && s.indexOf('magaza') === -1)) {
      var trackWa = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Merhaba, siparişimin üretim ve sevkiyat durumunu öğrenmek istiyorum.');
      return '<strong>📦 Sipariş Takibi:</strong><br>İnegöl üretim tesisimizdeki siparişinizin anlık üretim veya nakliye aşamasını ad-soyad ya da sipariş numaranızla hemen öğrenebilirsiniz:<br><a href="' + trackWa + '" target="_blank" style="display:inline-block;margin-top:8px;padding:7px 13px;background:#1C1917;color:#FFF;border:1px solid #D4A017;border-radius:999px;font-weight:700;text-decoration:none;font-size:11.5px;">📦 WhatsApp\'tan Sipariş Sorgula</a>';
    }
    if (s.indexOf('adres') !== -1 || s.indexOf('mağaza') !== -1 || s.indexOf('magaza') !== -1 || s.indexOf('showroom') !== -1 || s.indexOf('konum') !== -1 || s.indexOf('inegöl') !== -1 || s.indexOf('inegol') !== -1 || s.indexOf('yeriniz') !== -1 || s.indexOf('telefon') !== -1 || s.indexOf('iletişim') !== -1) {
      return '<strong>📍 Limoon Home &amp; Living Showroom:</strong><br>• <strong>Adres:</strong> Wobilimoda Mobilya AVM, No: 85, İnegöl / Bursa<br>• <strong>Tel &amp; WhatsApp:</strong> +90 533 485 22 16<br>• <strong>E-posta:</strong> info@limoonhome.com<br>• <strong>Saatler:</strong> Pzt–Cmt 09:00–19:00 | Pazar 10:00–18:00' + waBtn;
    }
    if (s.indexOf('teslim') !== -1 || s.indexOf('kurulum') !== -1 || s.indexOf('kargo') !== -1 || s.indexOf('nakliye') !== -1 || s.indexOf('avrupa') !== -1 || s.indexOf('garanti') !== -1 || s.indexOf('iade') !== -1) {
      return '<strong>🚚 Teslimat, Kurulum &amp; Garanti:</strong><br>• Stok ürünlerde <strong>7–14 iş günü</strong>, özel üretimde <strong>15–25 iş günü</strong> teslimat<br>• Türkiye\'nin 81 iline özel mobilya nakliyesiyle <strong>katınıza kadar taşıma ve ücretsiz kurulum</strong><br>• Tüm Avrupa\'ya gümrük dahil sigortalı kapı teslim ihracat<br>• <strong>2 Yıl Limoon Home Fabrika Garantisi</strong>.' + waBtn;
    }
    if (s.indexOf('ölçü') !== -1 || s.indexOf('olcu') !== -1 || s.indexOf('ebat') !== -1 || s.indexOf('boyut') !== -1 || s.indexOf('cm') !== -1 || s.indexOf('koltuk') !== -1 || s.indexOf('bonbon') !== -1 || s.indexOf('arden') !== -1) {
      return '<strong>🛋️ Koltuk Takımları &amp; Standart Ölçüler:</strong><br>• 3\'lü: <strong>235×95 cm</strong> • 2\'li: <strong>185×95 cm</strong> • Berjer: <strong>82×85 cm</strong><br>1. sınıf fırınlanmış gürgen iskelet, odanıza özel ölçü üretimi.<br>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/koltuk-takimi/">Tüm Koltuk Takımları →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun/bonbon-koltuk-takimi/">Bonbon Koltuk →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun/arden-koltuk-takimi/">Arden Koltuk →</a>' +
        '<a class="lm2-link-chip" href="/index.php/urun-kategori/kose-koltuk/">Köşe Koltuklar →</a>' + waBtn;
    }
    if (s.indexOf('renk') !== -1 || s.indexOf('kumaş') !== -1 || s.indexOf('kumas') !== -1 || s.indexOf('kartela') !== -1) {
      return '<strong>🎨 Kumaş &amp; Renk Kartelası:</strong><br>Silinebilir ithal <strong>Boucle</strong> ve <strong>Kadife</strong> kartelamızda Krem, Vizon/Bej, Antrasit, Terracotta, Zümrüt Yeşili ve Gece Mavisi dahil 30+ renk seçeneğimiz vardır. Ürün sayfasındaki <strong>3D İncele</strong> butonundan renkleri canlı deneyebilirsiniz!' + waBtn;
    }
    if (s.indexOf('fiyat') !== -1 || s.indexOf('kaç') !== -1 || s.indexOf('kac') !== -1 || s.indexOf('teklif') !== -1 || s.indexOf('ücret') !== -1 || s.indexOf('ne kadar') !== -1) {
      return '<strong>💰 Güncel Fabrika Satış Fiyatı &amp; Teklif:</strong><br><strong>' + prodTitle + '</strong> için seçtiğiniz kumaş, modül sayısı ve teslimat şehrine göre en avantajlı fabrika fiyatını hemen WhatsApp hattımızdan iletelim:' + waBtn;
    }
    if (s.indexOf('merhaba') !== -1 || s.indexOf('selam') !== -1 || s.indexOf('iyi günler') !== -1) {
      return 'Merhaba! 👋 <strong>Limoon Home &amp; Living</strong> İnegöl dijital asistanına hoş geldiniz. Aşağıdaki konulardan birini seçebilir veya aklınızdaki her şeyi yazabilirsiniz!';
    }
    return 'Size hemen yardımcı olalım! 🛋️ Koltuk, yatak/yemek odası, düğün paketi, taksit, sipariş takibi veya İnegöl showroom adresimizle ilgili aşağıdaki başlıklardan birini seçebilir ya da doğrudan ekibimize yazabilirsiniz:' + waBtn;
  }

  function addChatBubble(role, html) {
    var row = document.createElement('div');
    row.className = 'lm2-row ' + role;
    row.innerHTML = '<div class="lm2-rav">' + (role === 'bot' ? '🛋️' : '👤') + '</div><div class="lm2-bub">' + html + '</div>';
    msgsEl.appendChild(row);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function renderQuickReplies(options) {
    var old = document.getElementById('lm2-qr-block');
    if (old) old.remove();
    var row = document.createElement('div');
    row.id = 'lm2-qr-block';
    row.className = 'lm2-row bot';
    var btnsHtml = options.map(function (o) {
      return '<button type="button" class="lm2-qbtn">' + o + '</button>';
    }).join('');
    row.innerHTML =
      '<div class="lm2-rav" style="visibility:hidden;"></div>' +
      '<div style="flex:1;"><div style="font-size:10.5px;color:#8C7240;font-weight:700;margin-bottom:5px;">Başka ne sormak istersiniz?</div><div class="lm2-qwrap">' + btnsHtml + '</div></div>';
    msgsEl.appendChild(row);
    row.querySelectorAll('.lm2-qbtn').forEach(function (b) {
      b.onclick = function () {
        var clean = b.textContent.replace(/^[^\w\sÇĞİÖŞÜçğıöşü]+\s*/, '');
        sendChat(clean);
      };
    });
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function sendChat(text) {
    if (!text || chatTyping) return;
    var oldQr = document.getElementById('lm2-qr-block');
    if (oldQr) oldQr.remove();

    addChatBubble('usr', text.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    chatTyping = true;

    var tRow = document.createElement('div');
    tRow.id = 'lm2-typing-row';
    tRow.className = 'lm2-row bot';
    tRow.innerHTML = '<div class="lm2-rav">🛋️</div><div class="lm2-bub"><div class="lm2-typing"><span></span><span></span><span></span></div></div>';
    msgsEl.appendChild(tRow);
    msgsEl.scrollTop = msgsEl.scrollHeight;

    setTimeout(function () {
      var tr = document.getElementById('lm2-typing-row');
      if (tr) tr.remove();
      chatTyping = false;
      addChatBubble('bot', getReply(text));
      var norm = text.toLocaleLowerCase('tr-TR');
      var remaining = ALL_TOPICS.filter(function (o) { return o.toLocaleLowerCase('tr-TR').indexOf(norm) === -1; });
      renderQuickReplies(remaining.length >= 4 ? remaining : ALL_TOPICS);
    }, 320);
  }

  // Initial welcome + proactive topic buttons (keep scroll at top so greeting is fully visible)
  addChatBubble('bot', 'Merhaba! 👋 <strong>Limoon Home &amp; Living</strong> canlı dijital asistanıyım.<br><br>Koltuk takımları, yatak/yemek odası, düğün paketleri, taksit, sipariş takibi veya İnegöl showroomumuz hakkında size nasıl yardımcı olabilirim?');
  renderQuickReplies(ALL_TOPICS);
  msgsEl.scrollTop = 0;

  chatFab.onclick = function () {
    var open = chatBox.classList.toggle('open');
    var ico = document.getElementById('lm2-fab-ico');
    if (ico) ico.textContent = open ? '✕' : '💬';
  };
  document.getElementById('lm2-ch-close').onclick = function () {
    chatBox.classList.remove('open');
    var ico = document.getElementById('lm2-fab-ico');
    if (ico) ico.textContent = '💬';
  };
  document.getElementById('lm2-ch-form').onsubmit = function (e) {
    e.preventDefault();
    var inp = document.getElementById('lm2-ch-in');
    var val = inp.value.trim();
    if (!val) return;
    inp.value = '';
    sendChat(val);
  };

  // Boot
  mountHeaderMusic();
  attach3DButton();
  setTimeout(function () { mountHeaderMusic(); attach3DButton(); }, 900);
  setTimeout(function () { mountHeaderMusic(); attach3DButton(); }, 2200);
})();
