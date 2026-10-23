(() => {
'use strict';
// Número oficial com país e DDD, somente dígitos. Deixe vazio na demonstração.
const WHATSAPP = '';
const MESSAGE = 'Olá! Gostaria de informações sobre consultas na Orya Saúde Integrativa.';
const SPECIALTIES = [["Nutrição", "Alimentação e cuidado individualizado, respeitando sua rotina e seus objetivos."], ["Nutrologia", "Avaliação médica voltada à saúde nutricional e ao acompanhamento individual."], ["Ginecologia", "Atenção à saúde da mulher, com acolhimento e orientação em cada etapa."], ["Dermatologia", "Avaliação e acompanhamento dos cuidados com a pele."], ["Tricologia", "Avaliação das queixas relacionadas aos cabelos e ao couro cabeludo."]];
const $ = (s,c=document) => c.querySelector(s);
const $$ = (s,c=document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const configured = /^\d{10,15}$/.test(WHATSAPP);
const behavior = reduce ? 'auto' : 'smooth';
let revealStarted = false;
function initReveal(){
 if(revealStarted) return; revealStarted = true;
 const items=$$('.reveal');
 if(reduce || !('IntersectionObserver' in window)){items.forEach(i=>i.classList.add('in'));return;}
 items.forEach(el=>{const sib=[...el.parentElement.children].filter(c=>c.classList.contains('reveal'));el.style.setProperty('--d',Math.min(sib.indexOf(el),5)*80+'ms');});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.1});
 items.forEach(i=>io.observe(i));
}
// Contador decorativo: não representa o carregamento real da página.
const loader=$('#loader');
let loaderEnded=false;
function endLoader(){if(loaderEnded)return;loaderEnded=true;loader?.classList.add('done');setTimeout(()=>loader?.remove(),700);initReveal();}
// Ativa as animações apenas quando o script for executado.
document.documentElement.classList.add('js');
if(reduce || !loader){loader?.remove();initReveal();}
else{
 loader.hidden=false;
 const t0=performance.now();
 function step(now){if(loaderEnded)return;const p=Math.min((now-t0)/1500,1),e=1-Math.pow(1-p,3);const fill=$('#loader-fill'),count=$('#loader-count');if(fill)fill.style.transform=`scaleX(${e})`;if(count)count.textContent=Math.round(e*100)+'%';if(p<1)requestAnimationFrame(step);else setTimeout(endLoader,200);}
 requestAnimationFrame(step);setTimeout(endLoader,4000);
}
const header=$('#header'),topBtn=$('#back-to-top');
function onScroll(){header?.classList.toggle('scrolled',scrollY>40);topBtn?.classList.toggle('visible',scrollY>500);}
addEventListener('scroll',onScroll,{passive:true});onScroll();
topBtn?.addEventListener('click',()=>scrollTo({top:0,behavior}));
const toggle=$('.menu-toggle'),nav=$('#main-nav'),dropdown=$('.dropdown'),dropBtn=$('.drop-btn');
function setDrop(open){dropdown?.classList.toggle('open',open);dropBtn?.setAttribute('aria-expanded',String(open));}
function setMenu(open){nav?.classList.toggle('open',open);toggle?.setAttribute('aria-expanded',String(open));toggle?.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');if(!open)setDrop(false);}
toggle?.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
dropBtn?.addEventListener('click',()=>setDrop(!dropdown.classList.contains('open')));
$$('.main-nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('click',e=>{if(dropdown&&!dropdown.contains(e.target))setDrop(false);if(nav&&toggle&&!nav.contains(e.target)&&!toggle.contains(e.target))setMenu(false);});
addEventListener('keydown',e=>{if(e.key==='Escape'){const hadFocus=nav?.contains(document.activeElement);setMenu(false);if(hadFocus&&innerWidth<=980)toggle?.focus();}});
addEventListener('resize',()=>{if(innerWidth>980)setMenu(false);});
const links=$$('.main-nav>a[href^="#"]');
if('IntersectionObserver' in window){const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}),{rootMargin:'-25% 0px -55% 0px'});links.map(a=>$(a.hash)).filter(Boolean).forEach(s=>observer.observe(s));}
// Não há mais comparadores de antes/depois: esta seção agora é o corpo clínico.
const track=$('.rev-track');
$$('.rev-arrow').forEach(b=>b.addEventListener('click',()=>{const card=track&&$('.review',track);if(!card)return;const gap=parseFloat(getComputedStyle(track).gap)||18;track.scrollBy({left:Number(b.dataset.dir)*(card.offsetWidth+gap),behavior});}));
const procDialog=$('#proc-dialog'),bookDialog=$('#booking-dialog');
$$('[data-proc]').forEach(b=>b.addEventListener('click',()=>{const p=SPECIALTIES[Number(b.dataset.proc)];if(!p||!procDialog)return;$('#proc-title').textContent=p[0];$('#proc-desc').textContent=p[1];procDialog.showModal();}));
const select=$('#booking-form select[name="interesse"]');
$$('[data-booking]').forEach(b=>b.addEventListener('click',()=>{if(procDialog?.open){const title=$('#proc-title').textContent;if(select)select.value=title;procDialog.close();}setMenu(false);if(bookDialog&&!bookDialog.open)bookDialog.showModal();}));
$$('dialog').forEach(d=>{$('.dlg-close',d)?.addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});});
const form=$('#booking-form'),status=$('#form-status');
if(configured&&status)status.textContent='Os dados preenchidos serão incluídos em uma mensagem para o WhatsApp. Revise e confirme o envio por lá. Não informe dados sensíveis.';
form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const f=new FormData(form),nome=String(f.get('nome')||'').trim(),tel=String(f.get('telefone')||'').trim();if(!nome||tel.replace(/\D/g,'').length<10){status.textContent='Preencha seu nome e um WhatsApp com DDD válido.';return;}if(!configured){status.textContent='Demonstração: nenhum dado foi enviado ou armazenado. O WhatsApp oficial ainda não foi configurado.';return;}const extra=[['Especialidade',f.get('interesse')],['Mensagem',f.get('mensagem')]].filter(x=>String(x[1]||'').trim()).map(x=>`${x[0]}: ${String(x[1]).trim()}`);const text=[MESSAGE,'',`Nome: ${nome}`,`WhatsApp: ${tel}`,...extra].join('\n');const url=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;window.open(url,'_blank','noopener,noreferrer');status.textContent='Tente abrir o WhatsApp e confirme o envio por lá. Se não abriu, verifique o bloqueio de pop-ups.';});
const year=$('#year');if(year)year.textContent=new Date().getFullYear();/* CARROSSEL DO BANNER */
const heroCarousel = $('.hero-carousel');

if (heroCarousel) {
  const slides = $$('.hero-slide', heroCarousel);
  const playButton = $('.hero-play', heroCarousel);
  const previousButton = $('.hero-prev', heroCarousel);
  const nextButton = $('.hero-next', heroCarousel);

  let currentSlide = 0;
  let timer = null;
  let autoplay = !reduce;
  let pointerInside = false;

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentSlide;

      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
  }

  function updatePlayButton() {
    playButton.textContent = autoplay ? 'Pausar' : 'Reproduzir';

    playButton.setAttribute(
      'aria-label',
      autoplay
        ? 'Pausar troca automática de fotos'
        : 'Iniciar troca automática de fotos'
    );
  }

  function startTimer() {
    stopTimer();

    if (
      !autoplay ||
      pointerInside ||
      document.hidden ||
      slides.length < 2
    ) {
      return;
    }

    timer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 4000);
  }

  function manualSlide(direction) {
    autoplay = false;
    stopTimer();
    showSlide(currentSlide + direction);
    updatePlayButton();
  }

  previousButton.addEventListener('click', () => {
    manualSlide(-1);
  });

  nextButton.addEventListener('click', () => {
    manualSlide(1);
  });

  playButton.addEventListener('click', () => {
    autoplay = !autoplay;
    updatePlayButton();
    startTimer();
  });

  heroCarousel.addEventListener('mouseenter', () => {
    pointerInside = true;
    stopTimer();
  });

  heroCarousel.addEventListener('mouseleave', () => {
    pointerInside = false;
    startTimer();
  });

  /* Ao navegar por teclado, pausa até o usuário reativar. */
  heroCarousel.addEventListener('focusin', () => {
    autoplay = false;
    stopTimer();
    updatePlayButton();
  });

  document.addEventListener('visibilitychange', startTimer);

  showSlide(0);
  updatePlayButton();
  startTimer();
}
})();
