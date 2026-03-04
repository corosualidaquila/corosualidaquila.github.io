/* ============================================================
   Coro Su Ali d'Aquila — final.js
   ============================================================ */

/* ── ANNO NEL FOOTER ── */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();

/* ── TEMA CHIARO / SCURO ── */
const html = document.documentElement;
const icon = document.getElementById('themeIcon');
function setTheme(t) {
  html.dataset.theme = t;
  localStorage.setItem('csaq-theme', t);
  if (icon) icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

  document.querySelectorAll('.nav-logo img, .footer-logo img').forEach(img => {
    img.src = t === 'dark' ? 'images/image-1.png' : 'images/image-12.png';
  });
}
setTheme(localStorage.getItem('csaq-theme') || 'light');
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) themeToggle.addEventListener('click', () =>
  setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark')
);

/* ── BURGER MENU ── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

/* ── HERO SLIDER (solo index.html) ── */
const slides = document.querySelectorAll('.slide');
const dotsEl = document.getElementById('dots');
if (slides.length && dotsEl) {
  let cur = 0, timer;
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => go(i);
    dotsEl.appendChild(d);
  });
  function go(n) {
    slides[cur].classList.remove('active');
    dotsEl.children[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dotsEl.children[cur].classList.add('active');
    clearInterval(timer);
    timer = setInterval(() => go(cur + 1), 5500);
  }
  timer = setInterval(() => go(cur + 1), 5500);
}

/* ── VIDEO TABS (solo index.html) ── */
document.querySelectorAll('.vtab').forEach(b =>
  b.addEventListener('click', function () {
    document.querySelectorAll('.vtab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.vpane').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(this.dataset.v).classList.add('active');
  })
);

/* ── LIGHTBOX ── */
const lb      = document.getElementById('lb');
const lbImg   = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
if (lb && lbImg) {
  document.querySelectorAll('.gitem').forEach(el =>
    el.addEventListener('click', () => {
      lbImg.src = el.dataset.src;
      lb.classList.add('open');
    })
  );
  if (lbClose) lbClose.addEventListener('click', () => lb.classList.remove('open'));
  lb.addEventListener('click', e => {
    if (e.target === lb) lb.classList.remove('open');
  });
}

/* ── AUDIO PLAYER (solo about.html) ── */
const audioEl = document.getElementById('audioEl');
if (audioEl) {
  const albums = {
    '2025': {
      cover: 'images/foto coro/bambini.JPG',
      tracks: [
        { t: 'A Betlemme di Giudea',           s: 'audio/Natale25/A betlemme di Giudea.mp3' },
        { t: 'Bolingo Nwzambee',               s: 'audio/epifania25/bolingo.mp3' },
        { t: 'Carol of the bells',             s: 'audio/Natale25/Carol of the bells.mp3' },
        { t: 'Hark the heralds',               s: 'audio/Natale25/Hark the heralds.mp3' },
        { t: 'Medley Sister Act',              s: 'audio/Natale25/Medley sister Act.mp3' },
        { t: 'Noel Noel',                      s: 'audio/Natale25/Noel Noel.mp3' },
        { t: 'Oh happy day!',                  s: 'audio/Natale25/Oh happy day.mp3' },
        { t: 'Piedad de mi',                   s: 'audio/epifania25/piedad-de-mi.mp3' },
        { t: 'Santa Claus is coming to town!', s: 'audio/Natale25/Santa claus is coming.mp3' },
        { t: "Smile – it's christmas day!",    s: 'audio/Natale25/Smile.mp3' },
        { t: 'Venite fedeli',                  s: 'audio/Natale25/Venite fedeli.mp3' },
      ]
    },
    '2024': {
      cover: 'images/foto coro/coro.JPG',
      tracks: [
        { t: 'Bianco Natal feat. Corpo Musicale',    s: 'audio/Natale24/BiancoNatal.mp3' },
        { t: 'Buon Natale',                          s: 'audio/Natale24/BuonNatale.mp3' },
        { t: 'Happy Xmas (War is Over) feat. Banda', s: 'audio/Natale24/HappyXmas.mp3' },
        { t: "Hark the herald's angels sing",        s: 'audio/Natale24/Harketheheralds.mp3' },
        { t: 'In notte Placida',                     s: 'audio/Natale24/inNotteplacida.mp3' },
        { t: 'Santa Claus is coming to town',        s: 'audio/Natale24/SantaClaus.mp3' },
        { t: 'Silent Night feat. Corpo Musicale',    s: 'audio/Natale24/SilentNight.mp3' },
      ]
    },
    '2018': {
      cover: 'images/foto_coro/cdnatale.jpg',
      tracks: [
        { t: 'Venite Fedeli',                 s: 'audio/CDNATALE/01.mp3' },
        { t: 'Hark the Herald – Gloria',      s: 'audio/CDNATALE/02.mp3' },
        { t: 'Somewhere in my memories',      s: 'audio/CDNATALE/03.mp3' },
        { t: 'Bianco Natal',                  s: 'audio/CDNATALE/04.mp3' },
        { t: 'Jingle Bless rock!',            s: 'audio/CDNATALE/05.mp3' },
        { t: 'Imagine',                       s: 'audio/CDNATALE/06.mp3' },
        { t: 'Santa Claus is coming to town', s: 'audio/CDNATALE/07.mp3' },
        { t: 'Merry Christmas everyone',      s: 'audio/CDNATALE/08.mp3' },
        { t: 'Tu scendi dalle stelle',        s: 'audio/CDNATALE/09.mp3' },
        { t: 'La vera gioia',                 s: 'audio/CDNATALE/10.mp3' },
        { t: 'In notte placida',              s: 'audio/CDNATALE/11.mp3' },
        { t: 'Rendid à Yahvé',               s: 'audio/CDNATALE/12.mp3' },
        { t: 'Rallegriamoci nel Signore',     s: 'audio/CDNATALE/13.mp3' },
        { t: "Come l'aurora verrai",          s: 'audio/CDNATALE/14.mp3' },
        { t: 'Oh happy day!',                 s: 'audio/CDNATALE/15.mp3' },
        { t: 'Noel Noel',                     s: 'audio/CDNATALE/16.mp3' },
        { t: 'Sing my soul',                  s: 'audio/CDNATALE/17.mp3' },
        { t: 'Feliz Navidad',                 s: 'audio/CDNATALE/18.mp3' },
      ]
    }
  };

  const playerNow = document.getElementById('playerNow');
  const playIcon  = document.getElementById('playIcon');
  const progBar   = document.getElementById('progBar');
  const timeNow   = document.getElementById('timeNow');
  const timeTot   = document.getElementById('timeTot');
  const cover     = document.getElementById('audioCover');
  let activeYear = '2025', activeIdx = -1, isPlaying = false;

  function fmt(s) { const m = Math.floor(s / 60); return m + ':' + String(Math.floor(s % 60)).padStart(2, '0'); }

  function buildPlaylist(year) {
    const pl = document.getElementById('pl-' + year);
    if (!pl) return;
    albums[year].tracks.forEach((tr, i) => {
      const div = document.createElement('div');
      div.className = 'pitem';
      div.innerHTML = `<span class="pnum">${String(i + 1).padStart(2, '0')}</span>
        <span class="ptitle">${tr.t}</span>
        <i class="fas fa-play pplay"></i>`;
      div.addEventListener('click', () => {
        if (activeYear === year && activeIdx === i) {
          if (isPlaying) {
            audioEl.pause(); isPlaying = false;
            if (playIcon) playIcon.className = 'fas fa-play';
            div.querySelector('.pplay').className = 'fas fa-play pplay';
          } else {
            audioEl.play(); isPlaying = true;
            if (playIcon) playIcon.className = 'fas fa-pause';
            div.querySelector('.pplay').className = 'fas fa-pause pplay';
          }
        } else {
          loadTrack(year, i);
        }
      });
      pl.appendChild(div);
    });
  }

  function loadTrack(year, idx) {
    document.querySelectorAll('.pitem').forEach(el => {
      el.classList.remove('playing');
      el.querySelector('.pplay').className = 'fas fa-play pplay';
    });
    activeYear = year; activeIdx = idx;
    const tr = albums[year].tracks[idx];
    audioEl.src = tr.s;
    if (playerNow) playerNow.textContent = '♪ ' + tr.t;
    if (cover) { cover.style.opacity = '0.6'; setTimeout(() => { cover.src = albums[year].cover; cover.style.opacity = '1'; }, 200); }
    const items = document.querySelectorAll('#pl-' + year + ' .pitem');
    if (items[idx]) {
      items[idx].classList.add('playing');
      items[idx].querySelector('.pplay').className = 'fas fa-pause pplay';
    }
    audioEl.play().then(() => { isPlaying = true; if (playIcon) playIcon.className = 'fas fa-pause'; }).catch(() => {});
  }

  document.getElementById('btnPlay')?.addEventListener('click', () => {
    if (activeIdx === -1) { loadTrack('2025', 0); return; }
    if (isPlaying) { audioEl.pause(); isPlaying = false; if (playIcon) playIcon.className = 'fas fa-play'; }
    else { audioEl.play(); isPlaying = true; if (playIcon) playIcon.className = 'fas fa-pause'; }
  });
  document.getElementById('btnNext')?.addEventListener('click', () =>
    loadTrack(activeYear, (activeIdx + 1) % albums[activeYear].tracks.length)
  );
  document.getElementById('btnPrev')?.addEventListener('click', () => {
    const len = albums[activeYear].tracks.length;
    loadTrack(activeYear, (activeIdx - 1 + len) % len);
  });

  audioEl.addEventListener('timeupdate', () => {
    if (audioEl.duration && progBar) { progBar.value = (audioEl.currentTime / audioEl.duration) * 100; if (timeNow) timeNow.textContent = fmt(audioEl.currentTime); }
  });
  audioEl.addEventListener('loadedmetadata', () => { if (timeTot) timeTot.textContent = fmt(audioEl.duration); });
  audioEl.addEventListener('ended', () => loadTrack(activeYear, (activeIdx + 1) % albums[activeYear].tracks.length));
  if (progBar) progBar.addEventListener('input', () => { if (audioEl.duration) audioEl.currentTime = (progBar.value / 100) * audioEl.duration; });

  document.querySelectorAll('.ytab').forEach(btn =>
    btn.addEventListener('click', function () {
      document.querySelectorAll('.ytab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ypane').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const y = this.dataset.year;
      const pane = document.getElementById('ypane-' + y);
      if (pane) pane.classList.add('active');
      if (cover) cover.src = albums[y].cover;
      activeYear = y;
    })
  );

  Object.keys(albums).forEach(buildPlaylist);
}

/* ── FORM CONTATTI (solo contacts.html) ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  (function () { emailjs.init("JGVsE97dJHzmx_dTg"); })();
  const msg = document.getElementById('formMsg');
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const rec = contactForm.elements['_recipient'].value;
    const sid = rec === 'c.sualidaquila@gmail.com' ? 'service_1ksoqaq' : 'service_k9pn8uf';
    msg.style.display = 'none'; msg.className = '';
    emailjs.send(sid, 'template_uj4romv', {
      from_name: "Coro su Ali d'Aquila",
      to_email: rec,
      reply_to: contactForm.elements['_replyto'].value,
      subject: contactForm.elements['_subject'].value,
      message: contactForm.elements['message'].value,
      user_name: contactForm.elements['_name'].value
    })
    .then(() => emailjs.send(sid, 'template_pyaxslu', {
      email_from: 'coro-sualidaquila@no-reply.com',
      email: contactForm.elements['_replyto'].value,
      name: contactForm.elements['_name'].value,
      subject: contactForm.elements['_subject'].value
    }))
    .then(() => {
      msg.style.display = 'block'; msg.className = 'ok';
      msg.innerText = '✓ Messaggio inviato! Controlla la tua email per la conferma.';
      contactForm.reset();
    })
    .catch(() => {
      msg.style.display = 'block'; msg.className = 'err';
      msg.innerText = "✕ Errore nell'invio. Riprova più tardi.";
    });
  });
}

/* ── ANIMAZIONI SCROLL (reveal) ── */
const ro = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } }),
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ── ARCHIVIO (solo archivio.html) ── */
const archTabs = document.querySelectorAll('.arch-tab');
if (archTabs.length) {

  /* Tab principali Testi / Spartiti */
  archTabs.forEach(btn => {
    btn.addEventListener('click', function () {
      archTabs.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.arch-pane').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      document.getElementById('arch-' + this.dataset.arch).classList.add('active');
      // reset ricerca e ripristina il primo cat-tab attivo
      document.querySelectorAll('.search-bar input').forEach(i => i.value = '');
    });
  });

  /* Sottocategorie — limitato al pannello genitore */
  document.querySelectorAll('.cat-tab').forEach(btn => {
    btn.addEventListener('click', function () {
      const parent = this.closest('.arch-pane');
      parent.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.cat-pane').forEach(p => {
        p.classList.remove('active');
        p.style.display = ''; // pulizia display inline residuo
      });
      this.classList.add('active');
      const target = parent.querySelector('#' + this.dataset.cat);
      if (target) target.classList.add('active');
    });
  });

  /* Ricerca live — opera solo sul pannello attivo, usa classi non display */
  function filterFiles() {
    const activeArch = document.querySelector('.arch-tab.active');
    if (!activeArch) return;
    const archId = 'arch-' + activeArch.dataset.arch;
    const archPane = document.getElementById(archId);
    if (!archPane) return;

    const inputId = activeArch.dataset.arch === 'testi' ? 'searchTesti' : 'searchSpartiti';
    const input = document.getElementById(inputId);
    const q = input ? input.value.toLowerCase().trim() : '';

    if (q) {
      // Cerca: mostra tutti i cat-pane e filtra le card
      archPane.querySelectorAll('.cat-pane').forEach(p => p.classList.add('active'));
      archPane.querySelectorAll('.file-card').forEach(card => {
        const name = card.querySelector('.file-name')?.textContent.toLowerCase() || '';
        card.style.display = name.includes(q) ? '' : 'none';
      });
    } else {
      // Reset: ripristina solo il cat-pane con il cat-tab attivo
      archPane.querySelectorAll('.cat-pane').forEach(p => p.classList.remove('active'));
      archPane.querySelectorAll('.file-card').forEach(card => card.style.display = '');
      const activeCatTab = archPane.querySelector('.cat-tab.active');
      if (activeCatTab) {
        const target = archPane.querySelector('#' + activeCatTab.dataset.cat);
        if (target) target.classList.add('active');
      }
    }
  }

  // Collega ricerca solo se gli input esistono (solo su archivio.html)
  const stInput = document.getElementById('searchTesti');
  const ssInput = document.getElementById('searchSpartiti');
  if (stInput) stInput.addEventListener('input', filterFiles);
  if (ssInput) ssInput.addEventListener('input', filterFiles);

  /* Converti data-gdrive in link scaricabili */
  document.querySelectorAll('[data-gdrive]').forEach(el => {
    const match = el.dataset.gdrive.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) el.href = `https://drive.google.com/uc?export=download&id=${match[1]}`;
  });
}