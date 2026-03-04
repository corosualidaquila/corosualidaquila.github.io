
(function(){ emailjs.init("JGVsE97dJHzmx_dTg"); })();
document.getElementById('yr').textContent = new Date().getFullYear();
const html = document.documentElement;
const icon = document.getElementById('themeIcon');
const saved = localStorage.getItem('csaq-theme') || 'dark';
setTheme(saved);
document.getElementById('themeToggle').addEventListener('click', () => setTheme(html.dataset.theme==='dark'?'light':'dark'));
function setTheme(t) { html.dataset.theme=t; localStorage.setItem('csaq-theme',t); icon.className=t==='dark'?'fas fa-sun':'fas fa-moon'; }
document.getElementById('burger').addEventListener('click', () => document.getElementById('navLinks').classList.toggle('open'));

const form = document.getElementById('contactForm');
const msg  = document.getElementById('formMsg');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const rec = form.elements['_recipient'].value;
  const sid = rec==='c.sualidaquila@gmail.com' ? 'service_1ksoqaq' : 'service_k9pn8uf';
  msg.style.display='none'; msg.className='';
  emailjs.send(sid,'template_uj4romv',{ from_name:"Coro su Ali d'Aquila", to_email:rec, reply_to:form.elements['_replyto'].value, subject:form.elements['_subject'].value, message:form.elements['message'].value, user_name:form.elements['_name'].value })
  .then(()=>emailjs.send(sid,'template_pyaxslu',{ email_from:'coro-sualidaquila@no-reply.com', email:form.elements['_replyto'].value, name:form.elements['_name'].value, subject:form.elements['_subject'].value }))
  .then(()=>{ msg.style.display='block'; msg.className='ok'; msg.innerText='✓ Messaggio inviato! Controlla la tua email per la conferma.'; form.reset(); })
  .catch(()=>{ msg.style.display='block'; msg.className='err'; msg.innerText='✕ Errore nell\'invio. Riprova più tardi.'; });
});

const ro = new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target);}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

