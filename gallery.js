/* ---------- fields gallery: four ceramic objects, one renderer ---------- */
(function(){
  const canvas=document.getElementById('gallery');
  if(!canvas||!window.THREE) return;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});}catch(e){return;}
  document.documentElement.classList.add('gallery-gl');
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.92;
  renderer.setScissorTest(true);

  const ceramic=()=>new THREE.MeshStandardMaterial({color:0xE6E6E0,roughness:.5,metalness:0});
  function lit(scene){
    scene.add(new THREE.HemisphereLight(0xffffff,0xa9a9a1,.8));
    const key=new THREE.DirectionalLight(0xfffaf2,1.35); key.position.set(-3,5,4); scene.add(key);
    const rim=new THREE.DirectionalLight(0xffe8d2,.45); rim.position.set(4,1,-3); scene.add(rim);
    const fill=new THREE.DirectionalLight(0xffffff,.25); fill.position.set(2,-1,5); scene.add(fill);
    return scene;
  }

  const makers={
    // artificial intelligence: a faceted solid
    facet(){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1.05,1),new THREE.MeshStandardMaterial({color:0xE6E6E0,roughness:.55,metalness:0,flatShading:true}));return m},
    // decentralized systems: three linked rings
    links(){const g=new THREE.Group();[-.62,0,.62].forEach((x,i)=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.5,.12,48,120),ceramic());r.position.x=x;if(i===1)r.rotation.x=Math.PI/2;g.add(r)});g.rotation.set(.62,0,.22);const p=new THREE.Group();p.add(g);return p},
    // software: stacked layers
    layers(){const g=new THREE.Group();[-.38,0,.38].forEach((y,i)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(1.5,.2,1.05),ceramic());b.position.y=y;b.rotation.y=i*.16;g.add(b)});g.rotation.x=.42;return g},
    // emerging technology: a continuous knot
    knot(){return new THREE.Mesh(new THREE.TorusKnotGeometry(.62,.19,240,36,2,3),ceramic())}
  };

  const views=[...document.querySelectorAll('.g-art')].map(el=>{
    const scene=lit(new THREE.Scene());
    const obj=(makers[el.dataset.obj]||makers.facet)();
    scene.add(obj);
    const cam=new THREE.PerspectiveCamera(30,1,.1,50); cam.position.set(0,.4,6.2); cam.lookAt(0,0,0);
    const card=el.closest('.g-card'); let boost=0, hover=false;
    card.addEventListener('pointerenter',()=>hover=true); card.addEventListener('pointerleave',()=>hover=false);
    return {el,scene,obj,cam,get hover(){return hover},boost};
  });

  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size(){const w=canvas.clientWidth,h=canvas.clientHeight;if(canvas.width!==Math.floor(w*renderer.getPixelRatio())||canvas.height!==Math.floor(h*renderer.getPixelRatio()))renderer.setSize(w,h,false)}
  const t0=performance.now();
  function frame(now){
    requestAnimationFrame(frame);
    const sr=canvas.parentElement.getBoundingClientRect(); if(sr.bottom<-100||sr.top>innerHeight+100) return;
    size();
    const t=(now-t0)/1000, c=canvas.getBoundingClientRect();
    renderer.setScissor(0,0,c.width,c.height); renderer.clear();
    views.forEach((v,i)=>{
      const r=v.el.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight) return;
      v.boost+=((v.hover?1:0)-v.boost)*.06;
      if(!still){v.obj.rotation.y=t*.22+i*1.3+v.boost*.6;v.obj.position.y=Math.sin(t*.8+i)*.04}
      const x=r.left-c.left, y=c.bottom-r.bottom;
      renderer.setViewport(x,y,r.width,r.height); renderer.setScissor(x,y,r.width,r.height);
      v.cam.aspect=r.width/r.height; v.cam.updateProjectionMatrix();
      renderer.render(v.scene,v.cam);
    });
  }
  requestAnimationFrame(frame);
})();
