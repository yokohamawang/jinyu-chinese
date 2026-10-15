/* 145: native HTML/canvas portrait; no SVG foreignObject compositing. Source crops stay intact.
 * Mesh interpolation aligns the lip and aperture before the textures blend.
 * This is an illustrated guide to lip shape, not filmed phoneme alignment. */
(function(){
 'use strict';
 var image=new Image(),ready=false,failed=false,serial=0,N=24,W=412,H=378;
 var source={
  a:{crop:[18,145],pose:[68,34,0],cy:210,outer:[110,76,106],inner:[108,34,53],tooth:7},
  o:{crop:[451,145],pose:[38,25,1],cy:213,outer:[88,71,81],inner:[53,23,21],tooth:3},
  e:{crop:[881,145],pose:[66,19,0],cy:212,outer:[126,67,66],inner:[124,19,15],tooth:12},
  i:{crop:[18,632],pose:[76,12,0],cy:196,outer:[130,55,62],inner:[127,10,10],tooth:12},
  u:{crop:[451,632],pose:[30,17,1],cy:207,outer:[83,68,73],inner:[19,12,12],tooth:3},
  '\u00fc':{crop:[881,632],pose:[34,14,1],cy:204,outer:[90,61,64],inner:[25,7,9],tooth:3}
 };
 var plans={a:['a','a'],o:['o','o'],e:['e','e'],i:['i','i'],u:['u','u'],'ü':['ü','ü'],ai:['a','i'],ei:['e','i'],ui:['u','e','i'],ao:['a','o'],ou:['o','u'],iu:['i','o','u'],ie:['i','e'],'üe':['ü','e'],er:['e','e'],an:['a','a'],en:['e','e'],in:['i','i'],un:['u','e'],'ün':['ü','ü'],ang:['a','a'],eng:['e','e'],ing:['i','i'],ong:['o','o']};
 var triangles=[],cache=new Map(),pending=new Set();
 function clamp(x){return Math.max(0,Math.min(1,x))}
 function smooth(x){x=clamp(x);return x*x*(3-2*x)}
 function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
 function ring(cx,cy,rx,top,bottom){return Array.from({length:N},function(_,i){var a=2*Math.PI*i/N,s=Math.sin(a);return [cx+rx*Math.cos(a),cy+(s<0?top:bottom)*s]})}
 function points(s,pose){
  var width=pose?Math.max(.82,Math.min(1.18,pose[0]/s.pose[0])):1;
  var height=pose?Math.max(.7,Math.min(1.35,pose[1]/s.pose[1])):1;
  var inside=ring(205,s.cy,s.inner[0]*width,s.inner[1]*height,s.inner[2]*height);
  var outside=ring(205,s.cy,s.outer[0]*width,s.outer[1]*Math.sqrt(height),s.outer[2]*Math.sqrt(height));
  return [[205,s.cy-s.inner[1]*height+s.tooth*Math.sqrt(height)]].concat(inside,outside,ring(205,213,188,107,147),ring(205,189,205,189,189));
 }
 // The outer boundary is a rectangle; the two skin rings anchor the nose and chin.
 Object.keys(source).forEach(function(k){var s=source[k];s.points=points(s);for(var i=0;i<N;i++){var a=2*Math.PI*i/N,c=Math.cos(a),n=Math.sin(a),t=Math.min(205/Math.max(.00001,Math.abs(c)),189/Math.max(.00001,Math.abs(n)));s.points[1+N*3+i]=[205+c*t,189+n*t]}});
 for(var i=0;i<N;i++){var j=(i+1)%N;triangles.push([0,1+i,1+j]);for(var r=0;r<3;r++){var a=1+r*N+i,b=1+r*N+j,c=1+(r+1)*N+i,d=1+(r+1)*N+j;triangles.push([a,c,d],[a,d,b])}}
 function closest(p){var keys=p[2]>=.5?['o','u','\u00fc']:['a','e','i'];return keys.reduce(function(best,k){var s=source[k],v=Math.pow((p[0]-s.pose[0])/20,2)+Math.pow((p[1]-s.pose[1])/14,2);return !best||v<best.score?{key:k,score:v}:best},null).key}
 function sample(key,f){var d=window.KP134_DATA[key],p=d.poses,idx=0,t=0;if(p.length===3&&p.some(function(v){return v[0]!==p[0][0]||v[1]!==p[0][1]})){if(f<=.38){idx=0;t=smooth(f/.38)}else{idx=1;t=smooth((f-.38)/.4)}}else{t=smooth((f-.14)/.64);idx=0}var a=p[idx],b=p[Math.min(idx+1,p.length-1)],ka=plans[key]?plans[key][idx]:closest(a),kb=plans[key]?plans[key][Math.min(idx+1,plans[key].length-1)]:closest(b);var pa=points(source[ka],a),pb=points(source[kb],b);for(var i=1+N*2;i<pa.length;i++){pa[i]=source[ka].points[i];pb[i]=source[kb].points[i]}
  return {a:ka,b:kb,t:t,points:pa.map(function(v,i){return [v[0]+(pb[i][0]-v[0])*t,v[1]+(pb[i][1]-v[1])*t]})};
 }
 function determinant(a,b,c){return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])}
 function triangle(ctx,img,src,dst,tri){var p=tri.map(function(i){return src[i]}),q=tri.map(function(i){return dst[i]}),det=determinant(p[0],p[1],p[2]);if(Math.abs(det)<.00001)return;
  var ax=p[1][0]-p[0][0],ay=p[1][1]-p[0][1],bx=p[2][0]-p[0][0],by=p[2][1]-p[0][1],ux=q[1][0]-q[0][0],uy=q[1][1]-q[0][1],vx=q[2][0]-q[0][0],vy=q[2][1]-q[0][1];
  var a=(ux*by-vx*ay)/det,b=(uy*by-vy*ay)/det,c=(vx*ax-ux*bx)/det,d=(vy*ax-uy*bx)/det;
  ctx.save();ctx.beginPath();var cx=(q[0][0]+q[1][0]+q[2][0])/3,cy=(q[0][1]+q[1][1]+q[2][1])/3;q.forEach(function(v,i){var dx=v[0]-cx,dy=v[1]-cy,len=Math.hypot(dx,dy)||1,x=v[0]+dx/len*.65,y=v[1]+dy/len*.65;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.clip();ctx.transform(a,b,c,d,q[0][0]-a*p[0][0]-c*p[0][1],q[0][1]-b*p[0][0]-d*p[0][1]);ctx.drawImage(img,0,0);ctx.restore();
 }
 function warp(ctx,s,target){triangles.forEach(function(tri){triangle(ctx,s.texture,s.points,target,tri)})}
 function render(key,f){var bin=Math.round(clamp(f)*32),tag=key+':'+bin;if(cache.has(tag))return cache.get(tag);var m=sample(key,bin/32),canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;var ctx=canvas.getContext('2d');ctx.fillStyle='#fbe8d9';ctx.fillRect(0,0,W,H);
  if(m.points.every(function(p,i){return Math.abs(p[0]-source[m.a].points[i][0])<.00001&&Math.abs(p[1]-source[m.a].points[i][1])<.00001}))ctx.drawImage(source[m.a].texture,0,0);else warp(ctx,source[m.a],m.points);if(m.t>0&&m.a!==m.b){var layer=document.createElement('canvas');layer.width=W;layer.height=H;var lc=layer.getContext('2d');lc.fillStyle='#fbe8d9';lc.fillRect(0,0,W,H);warp(lc,source[m.b],m.points);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=m.t;ctx.drawImage(layer,0,0);ctx.restore()}
  cache.set(tag,canvas);while(cache.size>32)cache.delete(cache.keys().next().value);return canvas;
 }
 function seek(canvas,f){canvas.dataset.kp144Progress=String(clamp(f));if(!ready){if(!failed)pending.add(canvas);return}if(!canvas.isConnected){pending.delete(canvas);return}var key=canvas.dataset.kp144Key,bin=Math.round(clamp(f)*32),tag=key+':'+bin;if(canvas.dataset.kp144Frame===tag)return;var ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(render(key,f),0,0,canvas.width,canvas.height);canvas.dataset.kp144Frame=tag;canvas.dataset.kp144Ready='true';var fallback=canvas.closest('.kp144-front').querySelector('.kp144-fallback');if(fallback)fallback.style.visibility='hidden';pending.delete(canvas)}
 function hydrate(root){root.querySelectorAll('canvas[data-kp144-key]').forEach(function(c){seek(c,Number(c.dataset.kp144Progress)||0)})}
 function front(key,live,id){var f=live?0:1,m=sample(key,f),s=source[m.t<.5?m.a:m.b],x=s.crop[0]/(1312-W)*100,y=s.crop[1]/(1199-H)*100;return '<div class="kp134-front kp144-front" data-kp134-key="'+esc(key)+'" role="img" aria-label="'+esc(key)+' の口形。鼻・頬・あごを含むイラスト" style="display:block;position:relative;max-width:100%;aspect-ratio:412/378;overflow:hidden;border-radius:18px;isolation:isolate"><span class="kp144-fallback" aria-hidden="true" style="position:absolute;inset:0;display:block;background-image:url(&quot;./assets/articulation/vowel-mouth-101.png&quot;);background-size:318.4466019417% 317.1957671958%;background-position:'+x+'% '+y+'%;background-repeat:no-repeat"></span><canvas class="kp144-canvas" width="412" height="378" data-kp144-key="'+esc(key)+'" data-kp144-progress="'+f+'" aria-hidden="true" style="display:block;position:absolute;inset:0;width:100%;height:100%;max-width:100%;max-height:100%"></canvas></div>'}

 image.onload=function(){Object.keys(source).forEach(function(k){var s=source[k],c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').drawImage(image,s.crop[0],s.crop[1],W,H,0,0,W,H);s.texture=c});ready=true;hydrate(document);pending.clear()};image.onerror=function(){failed=true;pending.clear()};image.src=new URL('../assets/articulation/vowel-mouth-101.png',document.currentScript.src).href;
 function init(){hydrate(document);new MutationObserver(function(records){records.forEach(function(r){r.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.matches('canvas[data-kp144-key]'))seek(n,Number(n.dataset.kp144Progress)||0);else if(n.querySelector('canvas[data-kp144-key]'))hydrate(n)})})}).observe(document.body,{childList:true,subtree:true})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.KP144={front:front,seek:seek,sample:sample,triangles:triangles,source:source,determinant:determinant,status:function(){return {ready:ready,failed:failed,cache:cache.size}}};
})();
