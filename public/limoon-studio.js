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
    '.lm2-sound-wrap{display:inline-flex!important;align-items:center!important;gap:4px!important;vertical-align:middle!important;margin:0 6px!important;flex-shrink:0!important;}',
    '.lm2-sbtn{display:inline-flex!important;align-items:center!important;justify-content:center!important;height:32px!important;min-width:32px!important;padding:0 10px!important;border-radius:999px!important;border:1.5px solid #D4A017!important;background:#FFFDF8!important;color:#1C1917!important;font-size:11px!important;font-weight:700!important;cursor:pointer!important;transition:all .2s!important;line-height:1!important;white-space:nowrap!important;box-shadow:0 2px 6px rgba(212,160,23,.14)!important;}',
    '.lm2-sbtn.on{background:#D4A017!important;color:#FFF!important;}',
    '.lm2-next{display:none!important;align-items:center!important;justify-content:center!important;width:28px!important;height:28px!important;padding:0!important;border-radius:50%!important;border:1.5px solid #D4A017!important;background:#FFFDF8!important;color:#1C1917!important;font-size:11px!important;cursor:pointer!important;line-height:1!important;}',
    '.lm2-next.show{display:inline-flex!important;}',
    '@media(max-width:768px){.lm2-slbl{display:none!important;}.lm2-sbtn{padding:0!important;width:32px!important;}}',
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
    /* Smart Assistant Chat */
    '#lm2-chat-fab{position:fixed;bottom:24px;right:22px;z-index:99998;width:52px;height:52px;border-radius:50%;background:#1C1917;color:#FFF;border:2px solid #D4A017;box-shadow:0 8px 24px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:22px;transition:transform .2s;}',
    '#lm2-chat-fab:hover{transform:scale(1.06);}',
    '@media(max-width:768px){#lm2-chat-fab{bottom:78px!important;right:14px!important;width:46px!important;height:46px!important;font-size:20px!important;}}',
    '#lm2-chat-box{display:none;position:fixed;bottom:86px;right:22px;z-index:99999;width:330px;max-width:calc(100vw - 24px);height:440px;max-height:70dvh;background:#FFF;border-radius:18px;border:1.5px solid #D4A017;box-shadow:0 20px 50px rgba(0,0,0,.25);flex-direction:column;overflow:hidden;font-family:inherit;}',
    '@media(max-width:768px){#lm2-chat-box{bottom:132px!important;right:12px!important;}}',
    '#lm2-chat-box.open{display:flex;}',
    '.lm2-ch-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#FAF8F4;font-size:12.5px;}',
    '.lm2-m-bot{align-self:flex-start;background:#FFF;color:#1C1917;border:1px solid #EAE3D5;padding:9px 12px;border-radius:14px 14px 14px 4px;max-width:86%;line-height:1.45;}',
    '.lm2-m-usr{align-self:flex-end;background:#1C1917;color:#FFF;padding:9px 12px;border-radius:14px 14px 4px 14px;max-width:86%;line-height:1.45;}',
    '.lm2-qbtns{display:flex;flex-wrap:wrap;gap:5px;padding:6px 10px;background:#FFF;border-top:1px solid #F0EAE0;}',
    '.lm2-qbtn{padding:4px 9px;border-radius:999px;border:1px solid #D4A017;background:#FFFDF8;color:#1C1917;font-size:11px;font-weight:600;cursor:pointer;}'
  ].join('');
  document.head.appendChild(css);

  /* =========================================================================
   * 1. GLOBAL PERSISTENT STORE MUSIC ENGINE (Zara Deep House YT + 4 Real MP3s)
   * ========================================================================= */
  var PLAYLIST = [
    { type: 'yt', id: 'KlbyHOjHfKQ', title: 'Zara Style Deep House' },
    { type: 'mp3', url: BASE + '/audio/1-chill-wave.mp3', title: 'Chill Wave Lounge' },
    { type: 'mp3', url: BASE + '/audio/2-beauty-flow.mp3', title: 'Beauty Flow Boutique' },
    { type: 'mp3', url: BASE + '/audio/3-backbay-lounge.mp3', title: 'Backbay Lounge' },
    { type: 'mp3', url: BASE + '/audio/4-ultralounge.mp3', title: 'Ultralounge Showroom' }
  ];

  var KEY_ON = 'lm2_music_on';
  var KEY_IDX = 'lm2_music_idx';
  var KEY_SEC = 'lm2_music_sec';

  var audioEl = document.createElement('audio');
  audioEl.id = 'lm2-bg-audio';
  audioEl.preload = 'metadata';
  audioEl.crossOrigin = 'anonymous';
  audioEl.volume = 0.42;
  document.body.appendChild(audioEl);

  var ytHolder = document.createElement('div');
  ytHolder.style.cssText = 'position:fixed;width:2px;height:2px;left:-9999px;bottom:0;opacity:0.001;pointer-events:none;overflow:hidden;';
  ytHolder.innerHTML = '<div id="lm2-yt-player"></div>';
  document.body.appendChild(ytHolder);

  var ytPlayer = null;
  var ytReady = false;
  var ytLoading = false;
  var ytPendingPlay = false;
  var ytWatchdog = null;
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
      var track = PLAYLIST[currentIdx];
      var sec = 0;
      if (track.type === 'yt' && ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
        sec = ytPlayer.getCurrentTime() || 0;
      } else if (track.type === 'mp3') {
        sec = audioEl.currentTime || 0;
      }
      if (sec > 0.5) localStorage.setItem(KEY_SEC, String(Math.floor(sec)));
    } catch (e) {}
  }

  function updateSoundUI() {
    var track = PLAYLIST[currentIdx];
    document.querySelectorAll('.lm2-sbtn').forEach(function (b) {
      if (isPlaying) {
        b.classList.add('on');
        b.innerHTML = '<span>🔊</span><span class="lm2-slbl" style="margin-left:5px;">' + track.title + '</span>';
        b.title = 'Müziği Kapat (' + track.title + ')';
      } else {
        b.classList.remove('on');
        b.innerHTML = '<span>🎵</span><span class="lm2-slbl" style="margin-left:5px;">Mağaza Müziği</span>';
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
      ytPlayer = new window.YT.Player('lm2-yt-player', {
        height: '2',
        width: '2',
        videoId: PLAYLIST[0].id,
        playerVars: { autoplay: 0, controls: 0, playsinline: 1, loop: 1, playlist: PLAYLIST[0].id, rel: 0, modestbranding: 1 },
        events: {
          onReady: function () {
            ytReady = true;
            if (ytPendingPlay && isPlaying && PLAYLIST[currentIdx].type === 'yt') {
              startCurrentTrack(getSavedSec());
            }
          },
          onError: function () {
            if (isPlaying && PLAYLIST[currentIdx].type === 'yt') {
              switchTrack(1, 0);
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
    clearTimeout(ytWatchdog);
    try { audioEl.pause(); } catch (e) {}
    try { if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo(); } catch (e) {}
  }

  function startCurrentTrack(seekSec) {
    stopAllAudio();
    var track = PLAYLIST[currentIdx];
    localStorage.setItem(KEY_IDX, String(currentIdx));
    updateSoundUI();

    if (track.type === 'yt') {
      if (!ytReady || !ytPlayer) {
        ensureYTAPI(function () { startCurrentTrack(seekSec); });
        // Watchdog: if YT fails to load or play (e.g. iOS background restriction), fall back seamlessly to real MP3!
        ytWatchdog = setTimeout(function () {
          if (!isPlaying || PLAYLIST[currentIdx].type !== 'yt') return;
          var st = ytPlayer && typeof ytPlayer.getPlayerState === 'function' ? ytPlayer.getPlayerState() : -1;
          if (st !== 1 && st !== 3) {
            switchTrack(1, 0);
          }
        }, 4000);
        return;
      }
      try {
        ytPlayer.setVolume(42);
        if (seekSec > 1) ytPlayer.seekTo(seekSec, true);
        ytPlayer.playVideo();
        ytWatchdog = setTimeout(function () {
          if (!isPlaying || PLAYLIST[currentIdx].type !== 'yt') return;
          var st = typeof ytPlayer.getPlayerState === 'function' ? ytPlayer.getPlayerState() : -1;
          if (st !== 1 && st !== 3) {
            switchTrack(1, 0);
          }
        }, 3200);
      } catch (e) {
        switchTrack(1, 0);
      }
    } else {
      if (audioEl.src !== track.url) {
        audioEl.src = track.url;
      }
      var playNow = function () {
        if (seekSec > 1 && audioEl.duration && seekSec < audioEl.duration - 2) {
          try { audioEl.currentTime = seekSec; } catch (e) {}
        }
        var p = audioEl.play();
        if (p && p.catch) {
          p.catch(function () {
            // Browser blocked autoplay until gesture; keep desired state ON so first tap resumes
          });
        }
      };
      if (audioEl.readyState >= 1) playNow();
      else {
        audioEl.onloadedmetadata = playNow;
        audioEl.load();
      }
    }
  }

  function switchTrack(idx, sec) {
    currentIdx = ((idx % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    localStorage.setItem(KEY_IDX, String(currentIdx));
    localStorage.setItem(KEY_SEC, String(sec || 0));
    if (isPlaying) startCurrentTrack(sec || 0);
    else updateSoundUI();
  }

  audioEl.addEventListener('ended', function () {
    if (isPlaying) switchTrack(currentIdx + 1, 0);
  });

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
      saveTimer = setInterval(persistTime, 1000);
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

  // Global cross-page resume: if user left music ON on previous page, continue automatically!
  if (localStorage.getItem(KEY_ON) === '1') {
    isPlaying = true;
    saveTimer = setInterval(persistTime, 1000);
    // Try instant play + guaranteed resume on first gesture if browser pauses autoplay
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
    }, 350);
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
    nbtn.textContent = '⏭';
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
      '<button type="button" id="limoon-trigger-3d" style="display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;padding:12px 20px;background:#1C1917;color:#FFF;border:1.5px solid #D4A017;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.1);transition:all .2s;">' +
        '<span style="font-size:18px;margin-right:8px;">🧊</span>' +
        '<span>3D İncele &amp; Odanda Gör (AR)</span>' +
        '<span style="margin-left:auto;padding:2px 8px;background:#D4A017;color:#FFF;font-size:10px;font-weight:800;border-radius:4px;">1:1 BOYUT</span>' +
      '</button>';
    if (wa.nextSibling) wa.parentNode.insertBefore(w, wa.nextSibling);
    else wa.parentNode.appendChild(w);
    document.getElementById('limoon-trigger-3d').addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  }

  /* =========================================================================
   * 3. LIMOON HOME SMART ASSISTANT (CHATBOT: Ölçü, Renk, Teslimat & Teklif)
   * ========================================================================= */
  var chatFab = document.createElement('button');
  chatFab.id = 'lm2-chat-fab';
  chatFab.type = 'button';
  chatFab.title = 'Limoon Home Asistanı';
  chatFab.innerHTML = '💬';
  document.body.appendChild(chatFab);

  var chatBox = document.createElement('div');
  chatBox.id = 'lm2-chat-box';
  chatBox.innerHTML =
    '<div style="padding:12px 14px;background:#1C1917;color:#FFF;display:flex;align-items:center;justify-content:space-between;">' +
      '<div><div style="font-size:13px;font-weight:800;">Limoon Home Asistanı</div><div style="font-size:10px;color:#D4A017;">Ölçü • Renk • Fiyat Teklifi</div></div>' +
      '<button type="button" id="lm2-ch-close" style="background:none;border:0;color:#FFF;font-size:16px;cursor:pointer;">✕</button>' +
    '</div>' +
    '<div class="lm2-ch-msgs" id="lm2-ch-msgs">' +
      '<div class="lm2-m-bot">Merhaba! Limoon Home &amp; Living\'e hoş geldiniz. Koltuk ölçüleri, kumaş renkleri, teslimat veya fiyat teklifi hakkında ne sormak istersiniz?</div>' +
    '</div>' +
    '<div class="lm2-qbtns">' +
      '<button type="button" class="lm2-qbtn" data-q="Koltuk ölçüleri nedir?">📏 Ölçüler</button>' +
      '<button type="button" class="lm2-qbtn" data-q="Renk seçenekleri neler?">🎨 Renkler</button>' +
      '<button type="button" class="lm2-qbtn" data-q="Fiyat teklifi almak istiyorum">💬 Fiyat / Teklif Al</button>' +
      '<button type="button" class="lm2-qbtn" data-q="Teslimat ve garanti nasıl?">🚚 Teslimat</button>' +
    '</div>' +
    '<form id="lm2-ch-form" style="display:flex;border-top:1px solid #EAE3D5;padding:8px;gap:6px;background:#FFF;">' +
      '<input id="lm2-ch-in" type="text" placeholder="Sorunuzu yazın..." style="flex:1;border:1px solid #DDD4C3;border-radius:999px;padding:7px 12px;font-size:12px;outline:none;" />' +
      '<button type="submit" style="background:#D4A017;color:#FFF;border:0;border-radius:999px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;">Gönder</button>' +
    '</form>';
  document.body.appendChild(chatBox);

  var msgsEl = document.getElementById('lm2-ch-msgs');
  var prodTitle = (document.querySelector('h1.product_title') ? document.querySelector('h1.product_title').textContent.trim() : 'Limoon Home Mobilya');

  function getReply(q) {
    var s = q.toLowerCase();
    var waLink = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Merhaba, ' + prodTitle + ' hakkında fiyat teklifi ve bilgi almak istiyorum.');
    var waBtn = '<br><a href="' + waLink + '" target="_blank" style="display:inline-block;margin-top:8px;padding:7px 13px;background:#25D366;color:#FFF;border-radius:999px;font-weight:700;text-decoration:none;font-size:11.5px;">📲 WhatsApp\'tan Hemen Teklif Al</a>';

    if (s.indexOf('ölçü') !== -1 || s.indexOf('olcu') !== -1 || s.indexOf('ebat') !== -1 || s.indexOf('boyut') !== -1 || s.indexOf('cm') !== -1) {
      return '<strong>Standart Koltuk Takımı Ölçülerimiz:</strong><br>• 3\'lü Koltuk: 235 × 95 × 82 cm<br>• 2\'li Koltuk: 185 × 95 × 82 cm<br>• Tekli Berjer: 82 × 85 × 88 cm<br>• Orta Sehpa: 90 × 90 × 42 cm<br>Üretici olduğumuz için odanıza özel ölçüde üretim yapabiliyoruz.' + waBtn;
    }
    if (s.indexOf('renk') !== -1 || s.indexOf('kumaş') !== -1 || s.indexOf('kumas') !== -1 || s.indexOf('kartela') !== -1) {
      return 'Silinebilir ithal <strong>Boucle</strong> ve <strong>Kadife</strong> kartelamızda Krem, Vizon/Bej, Antrasit, Terracotta, Zümrüt Yeşili ve Gece Mavisi dahil 30+ renk seçeneğimiz mevcut. 3D ekrandan renkleri canlı deneyebilirsiniz!' + waBtn;
    }
    if (s.indexOf('yemek') !== -1 || s.indexOf('masa') !== -1 || s.indexOf('yatak') !== -1) {
      return 'Yemek odası ve yatak odası takımlarımızda 1. sınıf fırınlanmış gürgen iskelet ve MDF lake/ahşap kaplama kullanıyoruz; masa ve dolaplarda özel ölçü mümkündür.' + waBtn;
    }
    if (s.indexOf('teslim') !== -1 || s.indexOf('kargo') !== -1 || s.indexOf('avrupa') !== -1 || s.indexOf('garanti') !== -1) {
      return 'Türkiye\'nin 81 iline özel mobilya lojistiğiyle <strong>ücretsiz kurulum</strong>, tüm Avrupa\'ya sigortalı kapı teslim ihracatımız vardır. Tüm ürünlerimiz <strong>2 Yıl Limoon Home Fabrika Garantili</strong>dir.' + waBtn;
    }
    if (s.indexOf('fiyat') !== -1 || s.indexOf('kaç') !== -1 || s.indexOf('kac') !== -1 || s.indexOf('teklif') !== -1 || s.indexOf('ücret') !== -1 || s.indexOf('para') !== -1) {
      return '<strong>' + prodTitle + '</strong> için seçtiğiniz kumaş, modül sayısı ve teslimat şehrine göre en güncel fabrika satış fiyatını hemen WhatsApp hattımızdan iletelim:' + waBtn;
    }
    return 'Sorunuz için teşekkürler! İnegöl fabrikamızdan doğrudan üretim, özel ölçü, renk kartelası ve güncel fiyat bilgisi için ekibimize tek tıkla bağlanabilirsiniz:' + waBtn;
  }

  function sendChat(text) {
    if (!text) return;
    var u = document.createElement('div');
    u.className = 'lm2-m-usr';
    u.textContent = text;
    msgsEl.appendChild(u);
    var b = document.createElement('div');
    b.className = 'lm2-m-bot';
    b.innerHTML = getReply(text);
    msgsEl.appendChild(b);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  chatFab.onclick = function () { chatBox.classList.toggle('open'); };
  document.getElementById('lm2-ch-close').onclick = function () { chatBox.classList.remove('open'); };
  chatBox.querySelectorAll('.lm2-qbtn').forEach(function (qb) {
    qb.onclick = function () { sendChat(qb.getAttribute('data-q')); };
  });
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
