(() => {
  'use strict';
  const host = document.querySelector('[data-youtube-phone]');
  if (!host) return;
  const channel = 'https://www.youtube.com/@ThiagoIUTU';
  const paths = {
    back: '<path d="m15 4-8 8 8 8"/>',
    search: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 6 6"/>',
    more: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    bell: '<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5zM10 21h4M12 2v2"/>',
    link: '<path d="m10 14 4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(2 -2)"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    home: '<path d="m2 10 10-8 10 8-3 0v11h-5v-7h-4v7H5V10z" fill="currentColor" stroke="none"/>',
    shorts: '<path d="m14 2-8 5c-3 2-2 6 1 7l-2 1c-4 3 0 9 4 7l9-5c3-2 2-6-1-7l2-1c3-3-1-8-5-7z"/><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"/>',
    plus: '<path d="M12 3v18M3 12h18"/>',
    subscriptions: '<path d="M3 7h18v14H3zM5 4h14M7 1h10m-7 10 6 3-6 3z"/>',
    signal: '<rect x="2" y="15" width="3" height="7" fill="currentColor" stroke="none"/><rect x="7" y="11" width="3" height="11" fill="currentColor" stroke="none"/><rect x="12" y="7" width="3" height="15" fill="currentColor" stroke="none"/><rect x="17" y="3" width="3" height="19" fill="currentColor" stroke="none" opacity=".4"/>',
    wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>'
  };
  const icon = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
  host.innerHTML = `<div class="yn">
    <div class="yn-status" aria-hidden="true"><span class="yn-time"></span><span class="yn-signal">
      <svg class="yn-cellular" viewBox="0 0 20 14"><rect x="0" y="9" width="3.2" height="5" rx="1"/><rect x="5.3" y="6" width="3.2" height="8" rx="1"/><rect x="10.6" y="3" width="3.2" height="11" rx="1"/><rect x="15.9" y="0" width="3.2" height="14" rx="1" opacity=".35"/></svg>
      <svg class="yn-wifi" viewBox="0 0 17 13"><path d="M.4 3.6a12 12 0 0 1 16.2 0l-1.8 1.8a9.4 9.4 0 0 0-12.6 0zM3.5 6.8a7.5 7.5 0 0 1 10 0l-1.8 1.8a4.8 4.8 0 0 0-6.4 0zM6.6 10a2.8 2.8 0 0 1 3.8 0l-1.9 2z"/></svg>
      <svg class="yn-battery" viewBox="0 0 29 14"><defs><clipPath id="yn-battery-clip"><rect x="0" y="0" width="25" height="14" rx="4"/></clipPath></defs><rect width="25" height="14" rx="4" fill="#757575"/><rect width="13" height="14" fill="#f5f5f7" clip-path="url(#yn-battery-clip)"/><path d="M27 4.5a2.6 2.6 0 0 1 0 5z" fill="#a3a3a5"/></svg>
    </span></div>
    <div class="yn-toolbar"><button class="yn-icon" data-action="back" aria-label="Volver al inicio del canal">${icon('back')}</button><div class="yn-toolbar-right"><button class="yn-icon" data-action="search" aria-label="Buscar vídeos del canal">${icon('search')}</button><button class="yn-icon" data-action="more" aria-label="Opciones del canal">${icon('more')}</button></div></div>
    <div class="yn-scroll" data-lenis-prevent tabindex="0" aria-label="Contenido del canal">
      <div class="yn-banner" role="img" aria-label="Banner del canal"></div>
      <div class="yn-profile"><img class="yn-avatar" alt="Avatar del canal" hidden><div><h3 class="yn-name">ThiagoIUTU ${icon('check', 'yn-check')}</h3><div class="yn-handle">@ThiagoIUTU</div><div class="yn-stats">Cargando canal…</div></div></div>
      <button class="yn-description" data-action="about"><span>Mi meta es llegar a los 10 MILLONES !!! 🥳</span><b>…más</b></button>
      <button class="yn-links" data-action="links">${icon('link')}Instagram y más enlaces</button>
      <a class="yn-subscribe" href="${channel}?sub_confirmation=1" target="_blank" rel="noopener noreferrer">${icon('bell')}Suscribirse${icon('down')}</a>
      <div class="yn-tabs" role="tablist" aria-label="Secciones de YouTube">${[['home','Inicio'],['videos','Vídeos'],['live','En Directo'],['lists','Listas']].map(([id,label]) => `<button role="tab" class="yn-tab" id="yn-tab-${id}" data-tab="${id}" aria-controls="yn-feed" aria-selected="${id === 'home'}" tabindex="${id === 'home' ? 0 : -1}">${label}</button>`).join('')}</div>
      <div id="yn-feed" role="tabpanel" aria-labelledby="yn-tab-home"><div class="yn-loading" aria-label="Cargando vídeos"></div></div>
    </div>
    <nav class="yn-bottom" aria-label="Navegación de YouTube"><button data-action="back">${icon('home')}Inicio</button><a href="${channel}/shorts" target="_blank" rel="noopener noreferrer">${icon('shorts')}Shorts</a><a class="yn-create" href="https://www.youtube.com/upload" target="_blank" rel="noopener noreferrer" aria-label="Crear en YouTube">${icon('plus')}</a><a href="https://www.youtube.com/feed/subscriptions" target="_blank" rel="noopener noreferrer">${icon('subscriptions')}Suscripciones</a><a href="https://www.youtube.com/feed/you" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="9" r="3"/><path d="M5 20c0-8 14-8 14 0"/></svg>Tú</a><div class="yn-home-indicator" aria-hidden="true"></div></nav>
    <section class="yn-sheet" hidden data-lenis-prevent aria-label="Información del canal"><header><span></span><button class="yn-icon" data-action="close" aria-label="Cerrar">${icon('close')}</button></header><div class="yn-sheet-body"></div></section>
  </div>`;
  const ui = host.querySelector('.yn'), scroller = host.querySelector('.yn-scroll'), feed = host.querySelector('#yn-feed');
  // Read the device clock on every tick, including after sleep or a timezone change.
  const clock = host.querySelector('.yn-time');
  const updateClock = () => {
    const now = new Date();
    const value = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (clock.textContent !== value) clock.textContent = value;
  };
  let clockTimer;
  const syncClock = () => {
    clearInterval(clockTimer);
    updateClock();
    if (!document.hidden) clockTimer = setInterval(updateClock, 1000);
  };
  document.addEventListener('visibilitychange', syncClock);
  window.addEventListener('pageshow', syncClock);
  window.addEventListener('focus', updateClock);
  window.addEventListener('pagehide', () => clearInterval(clockTimer));
  syncClock();
  const sheet = host.querySelector('.yn-sheet'), body = sheet.querySelector('.yn-sheet-body');
  let data = null, active = 'home', lastFocus = null;
  const resize = () => { const scale = host.clientWidth / 390; if (!scale) return; ui.style.transform = `scale(${scale})`; ui.style.height = `${host.clientHeight / scale}px`; };
  new ResizeObserver(resize).observe(host); resize();
  const compact = n => new Intl.NumberFormat('es-ES', {notation: 'compact', maximumFractionDigits: 2}).format(Number(n));
  const age = date => { const days = Math.max(0, Math.floor((Date.now() - new Date(date)) / 86400000)); return days < 1 ? 'hoy' : days < 30 ? `hace ${days} d` : days < 365 ? `hace ${Math.floor(days / 30)} m` : `hace ${Math.floor(days / 365)} a`; };
  const duration = iso => { const m = (iso || '').match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/); if (!m) return ''; return [m[1], m[1] ? (m[2] || '0').padStart(2,'0') : (m[2] || '0'), (m[3] || '0').padStart(2,'0')].filter(v=>v!==undefined).join(':'); };
  const external = (url, label) => { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; if (label) a.textContent = label; return a; };
  function card(v, playlist = false) {
    const a = external(v.url); a.className = 'yn-card'; a.setAttribute('aria-label', `${v.title} — abrir en YouTube`);
    if (!playlist) {
      a.dataset.videoId = v.id;
      a.setAttribute('aria-label', `${v.title} — reproducir en el iPhone`);
    }
    const thumb = document.createElement('div'); thumb.className = 'yn-thumb';
    const img = document.createElement('img'); img.src = v.thumbnail; img.alt = ''; img.loading = 'lazy'; thumb.append(img);
    const time = document.createElement('span'); time.className = 'yn-duration'; time.textContent = playlist ? `${v.count} vídeos` : duration(v.duration); if (time.textContent) thumb.append(time);
    const copy = document.createElement('div'); copy.className = 'yn-card-copy';
    if (data.avatar) { const avatar = document.createElement('img'); avatar.src = data.avatar; avatar.alt = ''; copy.append(avatar); }
    const text = document.createElement('div'), title = document.createElement('h4'), meta = document.createElement('div'); title.textContent = v.title; meta.className = 'yn-card-meta';
    meta.textContent = `ThiagoIUTU · ${playlist ? 'Lista de reproducción' : `${v.views ? compact(v.views) + ' visualizaciones · ' : ''}${age(v.publishedAt)}`}`;
    text.append(title, meta); copy.append(text); a.append(thumb, copy); return a;
  }
  function render(tab) {
    active = tab;
    host.querySelectorAll('[data-tab]').forEach(b => { b.setAttribute('aria-selected', String(b.dataset.tab === tab)); b.tabIndex = b.dataset.tab === tab ? 0 : -1; });
    feed.setAttribute('aria-labelledby', `yn-tab-${tab}`);
    if (!data) return;
    feed.replaceChildren();
    const videos = data.videos || [];
    const featured = videos.find(v => /universal studios/i.test(v.title)) || videos[0];
    let items = tab === 'lists' ? data.playlists || [] : tab === 'live' ? videos.filter(v => v.isLive) : videos;
    if (tab === 'home' && featured) { feed.append(card(featured)); const h = document.createElement('h4'); h.className = 'yn-section-title'; h.textContent = 'Vídeos ›'; feed.append(h); items = videos.filter(v => v.id !== featured.id); }
    items.forEach(v => feed.append(card(v, tab === 'lists')));
    if (!items.length) { const p = document.createElement('div'); p.className = 'yn-message'; p.textContent = tab === 'live' ? 'No hay directos entre las publicaciones cargadas.' : 'No hay publicaciones disponibles.'; p.append(external(`${channel}/${tab === 'live' ? 'streams' : 'playlists'}`, 'Ver en YouTube ↗')); feed.append(p); }
  }
  const watch = document.createElement('section');
  watch.className = 'yn-watch';
  watch.hidden = true;
  watch.setAttribute('aria-label', 'Reproductor de vídeo');
  watch.setAttribute('data-lenis-prevent', '');
  ui.append(watch);
  let videoTrigger = null;
  function closeVideo() {
    watch.replaceChildren(); // Removing the iframe also stops playback and audio.
    watch.hidden = true;
    scroller.inert = false;
    sheet.inert = false;
    videoTrigger?.focus({preventScroll: true});
  }
  function playVideo(video, trigger) {
    videoTrigger = trigger;
    watch.replaceChildren();
    const back = document.createElement('button');
    back.className = 'yn-watch-back';
    back.innerHTML = `${icon('back')}<span>Volver al canal</span>`;
    back.addEventListener('click', closeVideo);
    const frame = document.createElement('iframe');
    frame.className = 'yn-player';
    frame.title = video.title;
    frame.src = `https://www.youtube.com/embed/${encodeURIComponent(video.id)}?autoplay=1&playsinline=1&rel=0`;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    const info = document.createElement('div');
    info.className = 'yn-watch-info';
    const title = document.createElement('h3');
    title.textContent = video.title;
    const author = document.createElement('p');
    author.textContent = 'ThiagoIUTU';
    const help = document.createElement('p');
    help.className = 'yn-watch-help';
    help.textContent = 'Si no empieza, pulsa reproducir. Si YouTube no permite verlo aquí, ábrelo en YouTube.';
    info.append(title, author, external(video.url, 'Abrir en YouTube ↗'), help);
    watch.append(back, frame, info);
    watch.hidden = false;
    watch.scrollTop = 0;
    scroller.inert = true;
    sheet.inert = true;
    back.focus({preventScroll: true});
  }
  // Capture before the existing navigation handler to preserve the current tab,
  // search results and scroll position when returning from a video.
  host.addEventListener('click', e => {
    const link = e.target.closest('[data-video-id]');
    if (link && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
      const video = data?.videos?.find(v => v.id === link.dataset.videoId);
      if (!video) return;
      e.preventDefault(); e.stopImmediatePropagation();
      playVideo(video, link);
    } else if (!watch.hidden && e.target.closest('[data-action]')) {
      closeVideo();
      if (e.target.closest('[data-action="back"]')) { e.preventDefault(); e.stopImmediatePropagation(); }
    }
  }, true);
  host.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !watch.hidden) {
      e.preventDefault(); e.stopImmediatePropagation(); closeVideo();
    }
  }, true);
  window.addEventListener('pagehide', closeVideo);
  function close() { sheet.hidden = true; lastFocus?.focus({preventScroll:true}); }
  function open(name) {
    lastFocus = document.activeElement;
    sheet.hidden = false; body.replaceChildren(); sheet.querySelector('header span').textContent = name === 'search' ? 'Buscar en el canal' : name === 'more' ? 'Opciones del canal' : 'Acerca del canal';
    if (name === 'search') {
      const input = document.createElement('input'); input.className = 'yn-search'; input.type = 'search'; input.placeholder = 'Buscar vídeos'; input.setAttribute('aria-label','Buscar vídeos');
      const results = document.createElement('div'); body.append(input, results);
      input.addEventListener('input', () => { results.replaceChildren(); const q = input.value.toLocaleLowerCase(); const found = (data?.videos || []).filter(v => v.title.toLocaleLowerCase().includes(q)); found.forEach(v => results.append(card(v))); if (!found.length) results.textContent = 'No hay coincidencias entre los vídeos cargados.'; }); input.focus();
    } else {
      if (name !== 'more') { const p = document.createElement('p'); p.textContent = data?.description || 'Cargando información del canal…'; body.append(p); }
      body.append(external(channel, 'Abrir canal en YouTube ↗'), external('https://www.instagram.com/thiagoiutux/', 'Instagram · @thiagoiutux ↗'));
      sheet.querySelector('button').focus();
    }
  }
  host.addEventListener('click', e => { const tab = e.target.closest('[data-tab]'); if (tab) { render(tab.dataset.tab); return; } const b = e.target.closest('[data-action]'); if (!b) return; const action = b.dataset.action; if (action === 'close') close(); else if (action === 'back') { sheet.hidden = true; render('home'); scroller.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); } else open(action); });
  host.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) close(); const b = e.target.closest('[data-tab]'); if (b && ['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) { e.preventDefault(); const tabs = [...host.querySelectorAll('[data-tab]')]; let i = tabs.indexOf(b); i = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length-1 : (i+(e.key === 'ArrowRight'?1:-1)+tabs.length)%tabs.length; tabs[i].focus(); render(tabs[i].dataset.tab); } });
  fetch('/api/youtube-channel').then(r => { if (!r.ok) throw Error('channel'); return r.json(); }).then(result => {
    data = result;
    host.querySelector('.yn-stats').textContent = `${compact(data.subscriberCount)} de suscriptores · ${data.videoCount} vídeos`;
    if (data.avatar) { const avatar = host.querySelector('.yn-avatar'); avatar.src = data.avatar; avatar.hidden = false; }
    if (data.banner) host.querySelector('.yn-banner').style.backgroundImage = `url("${data.banner}")`;
    host.querySelector('.yn-description span').textContent = (data.description || '').split('\n').find(s => s.trim()) || 'Acerca del canal';
    render(active);
  }).catch(() => { host.querySelector('.yn-stats').textContent = 'Canal de YouTube'; feed.replaceChildren(); const p = document.createElement('div'); p.className = 'yn-message'; p.textContent = 'No se pudo cargar el canal.'; p.append(external(channel, 'Abrir en YouTube ↗')); feed.append(p); });
})();
