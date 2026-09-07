(() => {
 'use strict';
 const params=new URLSearchParams(location.search);
 // Preserve links shared before Home was introduced, including every filter and hash.
 if(['overview','compare','policy','data','sources'].includes(params.get('view'))){
  location.replace('dashboard.html'+location.search+location.hash);
  return;
 }
 let language=params.get('lang')==='en'?'en':'th';
 function setLanguage(lang){
  language=lang;document.documentElement.lang=lang;
  document.querySelectorAll('[data-th][data-en]').forEach(el=>{el.textContent=el.getAttribute('data-'+lang);});
  document.querySelectorAll('[data-th-alt][data-en-alt]').forEach(el=>{el.alt=el.getAttribute('data-'+lang+'-alt');});
  document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===lang)));
  document.querySelectorAll('[data-dashboard-link]').forEach(el=>{const href=el.getAttribute('href'),[path,query]=href.split('?'),p=new URLSearchParams(query);p.set('lang',lang);el.setAttribute('href',path+'?'+p.toString());});
  const p=new URLSearchParams(location.search);p.delete('view');if(lang==='en')p.set('lang','en');else p.delete('lang');
  try{history.replaceState(null,'',location.pathname+(p.size?'?'+p.toString():'')+location.hash);}catch{/* Native links remain usable when opened directly as a file. */}
 }
 document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
 setLanguage(language);
})();
