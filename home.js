/* ---------- the object: a matte ceramic ring, a copper wire from nowhere ---------- */
(function(){
  const canvas=document.getElementById('stage');
  if(!window.THREE) return;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});}catch(e){return;}
  document.documentElement.classList.add('webgl');
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.92;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(28,1,.1,100);

  scene.add(new THREE.HemisphereLight(0xffffff,0xa9a9a1,.8));
  const key=new THREE.DirectionalLight(0xfffaf2,1.35);
  key.position.set(-3,5,4); key.castShadow=true;
  key.shadow.mapSize.set(2048,2048); key.shadow.radius=12; key.shadow.bias=-.0004;
  Object.assign(key.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.5,far:20});
  scene.add(key);
  const rim=new THREE.DirectionalLight(0xffe8d2,.45); rim.position.set(4,1,-3); scene.add(rim);
  const fill=new THREE.DirectionalLight(0xffffff,.25); fill.position.set(2,-1,5); scene.add(fill);

  const group=new THREE.Group(); scene.add(group);

  // ring: the start state
  const R=1, T=.3;
  const ring=new THREE.Mesh(
    new THREE.TorusGeometry(R,T,96,220),
    new THREE.MeshStandardMaterial({color:0xE6E6E0,roughness:.5,metalness:0})
  );
  ring.castShadow=true; ring.receiveShadow=true;
  group.add(ring);

  // copper wire + arrowhead: the arrow from nowhere
  const copper=new THREE.MeshStandardMaterial({color:0x7E3A0E,roughness:.5,metalness:.12});
  const tip=-(R+T);
  const headLen=.2;
  const wireLen=14;
  const wire=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,wireLen,24),copper);
  wire.rotation.z=Math.PI/2; wire.position.x=tip-headLen-wireLen/2+.01; wire.castShadow=true;
  group.add(wire);
  const head=new THREE.Mesh(new THREE.ConeGeometry(.065,headLen,40),copper);
  head.rotation.z=-Math.PI/2; head.position.x=tip-headLen/2; head.castShadow=true;
  group.add(head);

  // floor that only shows the soft shadow
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({opacity:0}));
  

  let w=0,h=0,mx=0,my=0,tx=0,ty=0;
  function size(){
    w=canvas.clientWidth; h=canvas.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    const narrow=w<760;
    camera.position.set(0,narrow?.25:.35,narrow?15:9.6);
    camera.lookAt(0,narrow?-.2:.15,0);
    group.position.set(narrow?.3:.35,narrow?1.15:.38,0);
    camera.updateProjectionMatrix();
  }
  addEventListener('resize',size); size();
  addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)},{passive:true});

  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t0=performance.now();
  function frame(now){
    const t=(now-t0)/1000;
    mx+=(tx-mx)*.04; my+=(ty-my)*.04;
    const intro=Math.min(1,t/2.2), e=1-Math.pow(1-intro,4);
    group.rotation.y=-.32+mx*.28+(1-e)*-.5;
    group.rotation.x=.12+my*.12;
    group.position.y+= ((still?0:Math.sin(t*.8)*.035) - (group.userData.f||0)); group.userData.f=still?0:Math.sin(t*.8)*.035;
    wire.scale.y=Math.max(.001,e); wire.position.x=tip-headLen-(wireLen*e)/2+.01;
    head.material.opacity=1;
    renderer.render(scene,camera);
    if(!still||t<2.4) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
/* ---------- manifesto: words warm up as you read ---------- */
(function(){
  const p=document.getElementById('manifesto');
  const walk=n=>{[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(s=>{if(!s)return;if(/^\s+$/.test(s)){f.append(s)}else{const sp=document.createElement('span');sp.className='w';sp.textContent=s;f.append(sp)}});c.replaceWith(f)}
    else walk(c)})};
  walk(p);
  const words=[...p.querySelectorAll('.w')];
  function upd(){const r=p.getBoundingClientRect(),vh=innerHeight;const prog=Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.35)));const n=Math.round(prog*words.length);words.forEach((w,i)=>w.classList.toggle('on',i<n));const sec=p.closest('section');sec.style.setProperty('--a',Math.min(1,prog*1.7).toFixed(3));sec.style.setProperty('--b',Math.min(1,Math.max(0,(prog-.5)*2.2)).toFixed(3))}
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
})();
