document.getElementById('yr').textContent = new Date().getFullYear();

/* THEME */
const html = document.documentElement;
const icon = document.getElementById('themeIcon');
const saved = localStorage.getItem('csaq-theme') || 'dark';
setTheme(saved);
document.getElementById('themeToggle').addEventListener('click', () => setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark'));
function setTheme(t) { html.dataset.theme = t; localStorage.setItem('csaq-theme', t); icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon'; }

/* BURGER */
document.getElementById('burger').addEventListener('click', () => document.getElementById('navLinks').classList.toggle('open'));

/* SLIDER */
const slides = document.querySelectorAll('.slide');
const dotsEl = document.getElementById('dots');
let cur = 0, timer;
slides.forEach((_,i) => { const d = document.createElement('div'); d.className='dot'+(i===0?' active':''); d.onclick=()=>go(i); dotsEl.appendChild(d); });
function go(n) {
slides[cur].classList.remove('active'); dotsEl.children[cur].classList.remove('active');
cur = (n+slides.length)%slides.length;
slides[cur].classList.add('active'); dotsEl.children[cur].classList.add('active');
clearInterval(timer); timer = setInterval(()=>go(cur+1), 5500);
}
timer = setInterval(()=>go(cur+1), 5500);

/* VIDEO TABS */
document.querySelectorAll('.vtab').forEach(b => b.addEventListener('click', function() {
document.querySelectorAll('.vtab').forEach(x=>x.classList.remove('active'));
document.querySelectorAll('.vpane').forEach(x=>x.classList.remove('active'));
this.classList.add('active'); document.getElementById(this.dataset.v).classList.add('active');
}));

/* LIGHTBOX */
document.querySelectorAll('.gitem').forEach(el => el.addEventListener('click', () => { document.getElementById('lbImg').src=el.dataset.src; document.getElementById('lb').classList.add('open'); }));
document.getElementById('lbClose').addEventListener('click', () => document.getElementById('lb').classList.remove('open'));
document.getElementById('lb').addEventListener('click', e => { if(e.target===e.currentTarget) e.currentTarget.classList.remove('open'); });

/* REVEAL */
const ro = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target);} }), {threshold:.1});
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));