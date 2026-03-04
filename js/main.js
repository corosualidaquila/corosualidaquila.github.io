document.getElementById('yr').textContent = new Date().getFullYear();
const html = document.documentElement;
const icon = document.getElementById('themeIcon');
const saved = localStorage.getItem('csaq-theme') || 'dark';
setTheme(saved);
document.getElementById('themeToggle').addEventListener('click', () => setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark'));
function setTheme(t) { html.dataset.theme=t; localStorage.setItem('csaq-theme',t); icon.className=t==='dark'?'fas fa-sun':'fas fa-moon'; }
document.getElementById('burger').addEventListener('click', () => document.getElementById('navLinks').classList.toggle('open'));
document.querySelectorAll('.gs-item').forEach(el => el.addEventListener('click', () => { document.getElementById('lbImg').src=el.dataset.src; document.getElementById('lb').classList.add('open'); }));
// document.getElementById('lbClose').addEventListener('click', () => document.getElementById('lb').classList.remove('open'));

/* ── AUDIO PLAYER ── */
const albums = {
'2025': {
    cover: 'images/foto coro/bambini.JPG',
    tracks: [
    { t:'A Betlemme di Giudea',           s:'audio/Natale25/A betlemme di Giudea.mp3' },
    { t:'Bolingo Nwzambee',               s:'audio/epifania25/bolingo.mp3' },
    { t:'Carol of the bells',             s:'audio/Natale25/Carol of the bells.mp3' },
    { t:'Hark the heralds',               s:'audio/Natale25/Hark the heralds.mp3' },
    { t:'Medley Sister Act',              s:'audio/Natale25/Medley sister Act.mp3' },
    { t:'Noel Noel',                      s:'audio/Natale25/Noel Noel.mp3' },
    { t:'Oh happy day!',                  s:'audio/Natale25/Oh happy day.mp3' },
    { t:'Piedad de mi',                   s:'audio/epifania25/piedad-de-mi.mp3' },
    { t:'Santa Claus is coming to town!', s:'audio/Natale25/Santa claus is coming.mp3' },
    { t:"Smile – it's christmas day!",    s:'audio/Natale25/Smile.mp3' },
    { t:'Venite fedeli',                  s:'audio/Natale25/Venite fedeli.mp3' },
    ]
},
'2024': {
    cover: 'images/foto coro/coro.JPG',
    tracks: [
    { t:'Bianco Natal feat. Corpo Musicale',       s:'audio/Natale24/BiancoNatal.mp3' },
    { t:'Buon Natale',                             s:'audio/Natale24/BuonNatale.mp3' },
    { t:'Happy Xmas (War is Over) feat. Banda',    s:'audio/Natale24/HappyXmas.mp3' },
    { t:"Hark the herald's angels sing",           s:'audio/Natale24/Harketheheralds.mp3' },
    { t:'In notte Placida',                        s:'audio/Natale24/inNotteplacida.mp3' },
    { t:'Santa Claus is coming to town',           s:'audio/Natale24/SantaClaus.mp3' },
    { t:'Silent Night feat. Corpo Musicale',       s:'audio/Natale24/SilentNight.mp3' },
    ]
},
'2018': {
    cover: 'images/foto_coro/cdnatale.jpg',
    tracks: [
    { t:'Venite Fedeli',                 s:'audio/CDNATALE/01.mp3' },
    { t:'Hark the Herald – Gloria',      s:'audio/CDNATALE/02.mp3' },
    { t:'Somewhere in my memories',      s:'audio/CDNATALE/03.mp3' },
    { t:'Bianco Natal',                  s:'audio/CDNATALE/04.mp3' },
    { t:'Jingle Bless rock!',            s:'audio/CDNATALE/05.mp3' },
    { t:'Imagine',                       s:'audio/CDNATALE/06.mp3' },
    { t:'Santa Claus is coming to town', s:'audio/CDNATALE/07.mp3' },
    { t:'Merry Christmas everyone',      s:'audio/CDNATALE/08.mp3' },
    { t:'Tu scendi dalle stelle',        s:'audio/CDNATALE/09.mp3' },
    { t:'La vera gioia',                 s:'audio/CDNATALE/10.mp3' },
    { t:'In notte placida',              s:'audio/CDNATALE/11.mp3' },
    { t:'Rendid à Yahvé',                s:'audio/CDNATALE/12.mp3' },
    { t:'Rallegriamoci nel Signore',     s:'audio/CDNATALE/13.mp3' },
    { t:"Come l'aurora verrai",          s:'audio/CDNATALE/14.mp3' },
    { t:'Oh happy day!',                 s:'audio/CDNATALE/15.mp3' },
    { t:'Noel Noel',                     s:'audio/CDNATALE/16.mp3' },
    { t:'Sing my soul',                  s:'audio/CDNATALE/17.mp3' },
    { t:'Feliz Navidad',                 s:'audio/CDNATALE/18.mp3' },
    ]
}
};

const audioEl   = document.getElementById('audioEl');
const playerNow = document.getElementById('playerNow');
const playIcon  = document.getElementById('playIcon');
const progBar   = document.getElementById('progBar');
const timeNow   = document.getElementById('timeNow');
const timeTot   = document.getElementById('timeTot');
const cover     = document.getElementById('audioCover');
let activeYear  = '2025', activeIdx = -1, isPlaying = false;

function fmt(s) { const m=Math.floor(s/60); return m+':'+String(Math.floor(s%60)).padStart(2,'0'); }

function buildPlaylist(year) {
const pl = document.getElementById('pl-'+year);
albums[year].tracks.forEach((tr, i) => {
    const div = document.createElement('div');
    div.className = 'pitem';
    div.innerHTML = `<span class="pnum">${String(i+1).padStart(2,'0')}</span>
    <span class="ptitle">${tr.t}</span>
    <i class="fas fa-play pplay"></i>`;
    div.addEventListener('click', () => loadTrack(year, i));
    pl.appendChild(div);
});
}

function loadTrack(year, idx) {
document.querySelectorAll('.pitem').forEach(el => el.classList.remove('playing'));
activeYear = year; activeIdx = idx;
const tr = albums[year].tracks[idx];
audioEl.src = tr.s;
playerNow.textContent = '♪ ' + tr.t;
cover.style.opacity = '0.6';
setTimeout(() => { cover.src = albums[year].cover; cover.style.opacity = '1'; }, 200);
const items = document.querySelectorAll('#pl-'+year+' .pitem');
if (items[idx]) items[idx].classList.add('playing');
audioEl.play().then(() => { isPlaying=true; playIcon.className='fas fa-pause'; }).catch(()=>{});
}

document.getElementById('btnPlay').addEventListener('click', () => {
if (activeIdx === -1) { loadTrack('2025', 0); return; }
if (isPlaying) { audioEl.pause(); isPlaying=false; playIcon.className='fas fa-play'; }
else { audioEl.play(); isPlaying=true; playIcon.className='fas fa-pause'; }
});
document.getElementById('btnNext').addEventListener('click', () => {
loadTrack(activeYear, (activeIdx+1) % albums[activeYear].tracks.length);
});
document.getElementById('btnPrev').addEventListener('click', () => {
const len = albums[activeYear].tracks.length;
loadTrack(activeYear, (activeIdx-1+len) % len);
});

audioEl.addEventListener('timeupdate', () => {
if (audioEl.duration) { progBar.value=(audioEl.currentTime/audioEl.duration)*100; timeNow.textContent=fmt(audioEl.currentTime); }
});
audioEl.addEventListener('loadedmetadata', () => { timeTot.textContent=fmt(audioEl.duration); });
audioEl.addEventListener('ended', () => { loadTrack(activeYear, (activeIdx+1) % albums[activeYear].tracks.length); });
progBar.addEventListener('input', () => { if(audioEl.duration) audioEl.currentTime=(progBar.value/100)*audioEl.duration; });

document.querySelectorAll('.ytab').forEach(btn => {
btn.addEventListener('click', function() {
    document.querySelectorAll('.ytab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.ypane').forEach(p=>p.classList.remove('active'));
    this.classList.add('active');
    const y = this.dataset.year;
    document.getElementById('ypane-'+y).classList.add('active');
    cover.src = albums[y].cover;
    activeYear = y;
});
});

Object.keys(albums).forEach(buildPlaylist);
// Chiudi il lightbox cliccando sullo sfondo o sulla X
document.getElementById('lb').addEventListener('click', function(e) {
if (e.target.id === 'lb' || e.target.id === 'lbClose') {
    this.classList.remove('open');
}
});

/* ── ANIMAZIONI AL CARICAMENTO E SCROLL ── */
// Intersection Observer per attivare le classi .reveal
const observerOptions = {
threshold: 0.1,
rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    // Una volta visibile, smettiamo di osservare l'elemento
    observer.unobserve(entry.target);
    }
});
}, observerOptions);

// Applica l'osservatore a tutti gli elementi con classe .reveal
document.querySelectorAll('.reveal').forEach(el => {
observer.observe(el);
});

// Gestione Burger Menu (Mobile)
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger) {
burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});
}

// Chiudi il menu mobile se si clicca su un link
document.querySelectorAll('.nav-links a').forEach(link => {
link.addEventListener('click', () => {
    navLinks.classList.remove('open');
});
});