document.documentElement.classList.add('js');
/* ---------- gentle reveal ---------- */
(function(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.fade').forEach(el=>io.observe(el));
  setTimeout(()=>document.querySelectorAll('.fade').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight)el.classList.add('in')}),60);
})();

/* ---------- copy buttons ---------- */
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{
  const v=b.dataset.copy;
  try{await navigator.clipboard.writeText(v)}catch(e){const r=document.createRange();r.selectNodeContents(b.previousElementSibling);getSelection().removeAllRanges();getSelection().addRange(r)}
  b.textContent='Copied';b.classList.add('done');setTimeout(()=>{b.textContent='Copy';b.classList.remove('done')},1800);
}));
