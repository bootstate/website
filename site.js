document.documentElement.classList.add('js');
/* ---------- gentle reveal ---------- */
(function(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.fade').forEach(el=>io.observe(el));
  setTimeout(()=>document.querySelectorAll('.fade').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight)el.classList.add('in')}),60);
})();

/* ---------- state rail ---------- */
(function(){
  const secs=[...document.querySelectorAll('[data-q]')];
  if(secs.length<3) return;
  const rail=document.createElement('div'); rail.className='rail'; rail.setAttribute('aria-hidden','true');
  rail.innerHTML=secs.map((s,i)=>'<div><i></i><span><em>q'+String.fromCharCode(8320+i)+'</em>'+s.dataset.q+'</span></div>').join('');
  document.body.appendChild(rail);
  const items=[...rail.children], hero=document.querySelector('.hero');
  function upd(){
    let a=0; secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.45)a=i});
    items.forEach((el,i)=>el.classList.toggle('on',i===a));
    rail.classList.toggle('show',!hero||hero.getBoundingClientRect().bottom<innerHeight*.4);
  }
  addEventListener('scroll',upd,{passive:true}); addEventListener('resize',upd); upd();
})();
