(() => {
'use strict';
// CONFIGURE AQUI: código do país + DDD + número, apenas dígitos.
const WHATSAPP = '';
const INITIAL_MESSAGE = 'Olá! Gostaria de agendar uma avaliação com a Dra. Stefany Gomes.';
const SERVICES = [["Harmonização facial", "Planejamento individual", "Um espaço para apresentar a proposta de harmonização facial da profissional. Confirmar descrição e indicação na revisão do conteúdo."], ["Preenchimento labial", "Proporções e expressão", "Descrição do tratamento a ser validada pela profissional antes da publicação."], ["Toxina botulínica", "Avaliação personalizada", "Descrição do tratamento a ser validada pela profissional antes da publicação."], ["Bioestimuladores", "Plano de cuidado", "Descrição do tratamento a ser validada pela profissional antes da publicação."], ["Contorno facial", "Atenção aos detalhes", "Descrição do tratamento a ser validada pela profissional antes da publicação."], ["Cuidados com a pele", "Acompanhamento individual", "Descrição do tratamento a ser validada pela profissional antes da publicação."]];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const configured = /^\d{10,15}$/.test(WHATSAPP);
const whatsapp = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

function reveal() {
 const els = $$('.reveal');
 if (reduce || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
 const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
 }), {threshold: .08});
 els.forEach(el => observer.observe(el));
}
// Contador visual de apresentação; não é progresso real de download.
const loader = $('#loader');
function finishLoader() {
 if (!loader || loader.classList.contains('done')) return;
 loader.classList.add('done'); setTimeout(() => loader.remove(), 650); reveal();
}
if (reduce) { loader?.remove(); reveal(); }
else {
 const start = performance.now();
 function step(now) {
  if (!loader || loader.classList.contains('done')) return;
  const p = Math.min((now-start)/1400,1), eased = 1-Math.pow(1-p,3);
  $('#loader-fill').style.transform = `scaleX(${eased})`;
  $('#loader-count').textContent = Math.round(eased*100)+'%';
  if(p<1) requestAnimationFrame(step); else setTimeout(finishLoader,180);
 }
 requestAnimationFrame(step); setTimeout(finishLoader,3500);
}

const toggle = $('.menu-toggle'), menu = $('#navigation');
function setMenu(open) { menu.classList.toggle('open',open); toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu'); }
toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
addEventListener('resize',()=>{if(innerWidth>680)setMenu(false)});

const topButton = $('#back-to-top');
const updateTop = () => topButton.classList.toggle('visible',scrollY>500);
addEventListener('scroll',updateTop,{passive:true});updateTop();
topButton.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'instant':'smooth'}));

$$('.compare').forEach(box=>{
 const input=box.querySelector('.compare-range');
 const update=()=>box.style.setProperty('--pos',input.value+'%');
 input.addEventListener('input',update);update();
});

if(configured){
 $$('[data-whatsapp]').forEach(a=>{a.href=whatsapp(INITIAL_MESSAGE);a.target='_blank';a.rel='noopener noreferrer'});
 $('#form-status').textContent='Ao enviar, sua mensagem será aberta no WhatsApp. Não inclua dados sensíveis.';
}
$('#booking-form').addEventListener('submit',e=>{
 e.preventDefault();
 const status=$('#form-status');
 if(!configured){status.textContent='Demonstração: nenhum dado foi enviado ou armazenado. Configure o WhatsApp no script.js.';return;}
 const form=new FormData(e.currentTarget);
 const lines=[INITIAL_MESSAGE,'',...Array.from(form,([k,v])=>v.trim()?`${({nome:'Nome',telefone:'WhatsApp',email:'E-mail',interesse:'Interesse',mensagem:'Mensagem'})[k]}: ${v.trim()}`:'').filter(Boolean)];
 const win=window.open(whatsapp(lines.join('\n')),'_blank','noopener,noreferrer');
 status.textContent='A mensagem foi preparada para o WhatsApp. Confirme o envio no aplicativo.';
});

const dialog=$('#service-dialog');
$$('[data-service]').forEach(btn=>btn.addEventListener('click',()=>{
 const s=SERVICES[Number(btn.dataset.service)];
 $('#dialog-title').textContent=s[0];$('#dialog-description').textContent=s[2];
 dialog.showModal();
}));
$('.dialog-close').addEventListener('click',()=>dialog.close());
$('#dialog-contact').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
$('#year').textContent=new Date().getFullYear();
})();