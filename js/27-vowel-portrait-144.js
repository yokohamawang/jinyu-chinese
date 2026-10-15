/* 151: initial-to-vowel animation with opaque cavity compositing; native HTML/canvas portrait; no SVG foreignObject compositing. Source crops stay intact.
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
 var triangles=[],cache=new Map(),pending=new Set(),restImage=new Image(),restReady=false;
 function clamp(x){return Math.max(0,Math.min(1,x))}
 function smooth(x){x=clamp(x);return x*x*(3-2*x)}
 function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
 function ring(cx,cy,rx,top,bottom){return Array.from({length:N},function(_,i){var a=2*Math.PI*i/N,s=Math.sin(a);return [cx+rx*Math.cos(a),cy+(s<0?top:bottom)*s]})}
 function points(s,pose){
  var width=pose?Math.max(.82,Math.min(1.18,pose[0]/s.pose[0])):1;
  var height=pose?Math.max(.7,Math.min(1.8,pose[1]/s.pose[1])):1;
  var inside=ring(205,s.cy,s.inner[0]*width,s.inner[1]*height,s.inner[2]*height);
  var outside=ring(205,s.cy,s.outer[0]*width,s.outer[1]*Math.sqrt(height),s.outer[2]*Math.sqrt(height));
  return [[205,s.cy-s.inner[1]*height+s.tooth*Math.sqrt(height)]].concat(inside,outside,ring(205,213,188,107,147),ring(205,189,205,189,189));
 }
 // The outer boundary is a rectangle; the two skin rings anchor the nose and chin.
 Object.keys(source).forEach(function(k){var s=source[k];s.points=points(s);for(var i=0;i<N;i++){var a=2*Math.PI*i/N,c=Math.cos(a),n=Math.sin(a),t=Math.min(205/Math.max(.00001,Math.abs(c)),189/Math.max(.00001,Math.abs(n)));s.points[1+N*3+i]=[205+c*t,189+n*t]}});
 for(var i=0;i<N;i++){var j=(i+1)%N;triangles.push([0,1+i,1+j]);for(var r=0;r<3;r++){var a=1+r*N+i,b=1+r*N+j,c=1+(r+1)*N+i,d=1+(r+1)*N+j;triangles.push([a,c,d],[a,d,b])}}
 function closest(p){var keys=p[2]>=.5?['o','u','\u00fc']:['a','e','i'];return keys.reduce(function(best,k){var s=source[k],v=Math.pow((p[0]-s.pose[0])/20,2)+Math.pow((p[1]-s.pose[1])/14,2);return !best||v<best.score?{key:k,score:v}:best},null).key}
 function sample(key,f,opening){
  if(opening!==undefined&&source['rest-'+key]){var open=clamp(opening),rp=source['rest-'+key].points,op=source[key].points;
   // Do not stretch the almost closed texture into a wide open cavity.
   return {a:key,b:'rest-'+key,t:1-smooth(open/.15),points:rp.map(function(v,i){return [v[0]+(op[i][0]-v[0])*open,v[1]+(op[i][1]-v[1])*open]})};
  }
  var d=window.KP134_DATA[key];
  if(d.kind==='initial'){
   var carrier=d.carrier==='apical'?'i':d.carrier,cg=window.KP139.carrierFraction(key,f);
   if((key==='m'||key==='b'||key==='p')&&restReady){
    var r=source['rest-a'].points,o=points(source[carrier],d.poses.at(-1)),t=key==='m'?cg:Math.max(cg,window.KP139.releaseFraction(key,f)*.18);
    for(var j=1+N*2;j<o.length;j++)o[j]=r[j];
    return {a:'rest-a',b:carrier,t:t,points:r.map(function(v,i){return [v[0]+(o[i][0]-v[0])*t,v[1]+(o[i][1]-v[1])*t]})};
   }
   if(key==='f'&&source.f){var ff=source.f.points,oo=source.o.points,target=ff.map(function(v,i){return i>=1+N*2?v.slice():[v[0]+(oo[i][0]-v[0])*cg,v[1]+(oo[i][1]-v[1])*cg]});return {a:'f',b:'o',t:cg,points:target}}
   var v=d.poses[0],q=points(source.i,[v[0],Math.max(7,v[1]),0]),end=source[carrier].points;
   q=q.map(function(v,i){return i>=1+N*2?v:[v[0]+(end[i][0]-v[0])*cg,v[1]+(end[i][1]-v[1])*cg]});
   for(var j=1+N*2;j<q.length;j++)q[j]=source.i.points[j];
   return {a:'i',b:carrier,t:cg,points:q};
  }
  var p=window.KP134_DATA[key].poses,knots=p.length===3?[0,.48,1]:[0,1],g=window.KP139.motionFraction(key,f),idx=p.length===3&&g>.48?1:0;
  var keys=p.map(function(v,i){return plans[key]?plans[key][Math.min(i,plans[key].length-1)]:closest(v)});
  var frames=p.map(function(v,i){var pp=points(source[keys[i]],v);for(var j=1+N*2;j<pp.length;j++)pp[j]=source[keys[i]].points[j];return pp});
  var target=frames[0].map(function(_,i){return [0,1].map(function(j){return window.KP139.spline(g,knots,frames.map(function(v){return v[i][j]}))})});
  return {a:keys[idx],b:keys[idx+1],t:clamp((g-knots[idx])/(knots[idx+1]-knots[idx])),points:target};
 }
 function determinant(a,b,c){return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])}
 function triangle(ctx,img,src,dst,tri){var p=tri.map(function(i){return src[i]}),q=tri.map(function(i){return dst[i]}),det=determinant(p[0],p[1],p[2]);if(Math.abs(det)<.00001)return;
  var ax=p[1][0]-p[0][0],ay=p[1][1]-p[0][1],bx=p[2][0]-p[0][0],by=p[2][1]-p[0][1],ux=q[1][0]-q[0][0],uy=q[1][1]-q[0][1],vx=q[2][0]-q[0][0],vy=q[2][1]-q[0][1];
  var a=(ux*by-vx*ay)/det,b=(uy*by-vy*ay)/det,c=(vx*ax-ux*bx)/det,d=(vy*ax-uy*bx)/det;
  ctx.save();ctx.beginPath();var cx=(q[0][0]+q[1][0]+q[2][0])/3,cy=(q[0][1]+q[1][1]+q[2][1])/3;q.forEach(function(v,i){var dx=v[0]-cx,dy=v[1]-cy,len=Math.hypot(dx,dy)||1,x=v[0]+dx/len*.65,y=v[1]+dy/len*.65;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.clip();ctx.transform(a,b,c,d,q[0][0]-a*p[0][0]-c*p[0][1],q[0][1]-b*p[0][0]-d*p[0][1]);ctx.drawImage(img,0,0);ctx.restore();
 }
 var pixelSources=new Map(),blockedPixelSources=new WeakSet();
 function warp(ctx,s,target){
  // Inverse rasterization samples every output pixel exactly once. Expanding
  // canvas triangle clips makes dark seams and repeated texture at the lips.
  if(blockedPixelSources.has(s)){triangles.forEach(function(t){triangle(ctx,s.texture,s.points,target,t)});return}var pixels=pixelSources.get(s);if(!pixels){try{pixels=s.texture.getContext('2d').getImageData(0,0,W,H).data}catch(e){blockedPixelSources.add(s);triangles.forEach(function(t){triangle(ctx,s.texture,s.points,target,t)});return}pixelSources.set(s,pixels);while(pixelSources.size>2)pixelSources.delete(pixelSources.keys().next().value)}
  var out=ctx.createImageData(W,H),dst=out.data;for(var z=0;z<dst.length;z+=4){dst[z]=251;dst[z+1]=232;dst[z+2]=217;dst[z+3]=255}
  triangles.forEach(function(tri){var p=tri.map(function(i){return s.points[i]}),q=tri.map(function(i){return target[i]}),ax=q[1][0]-q[0][0],ay=q[1][1]-q[0][1],bx=q[2][0]-q[0][0],by=q[2][1]-q[0][1],det=ax*by-ay*bx;if(Math.abs(det)<1e-8)return;
   var minX=Math.max(0,Math.floor(Math.min(q[0][0],q[1][0],q[2][0]))),maxX=Math.min(W-1,Math.ceil(Math.max(q[0][0],q[1][0],q[2][0]))),minY=Math.max(0,Math.floor(Math.min(q[0][1],q[1][1],q[2][1]))),maxY=Math.min(H-1,Math.ceil(Math.max(q[0][1],q[1][1],q[2][1])));
   var du=by/det,dv=-ay/det,sax=p[1][0]-p[0][0],say=p[1][1]-p[0][1],sbx=p[2][0]-p[0][0],sby=p[2][1]-p[0][1];
   for(var y=minY;y<=maxY;y++){var dx=minX+.5-q[0][0],dy=y+.5-q[0][1],u=(dx*by-dy*bx)/det,v=(ax*dy-ay*dx)/det;
    for(var x=minX;x<=maxX;x++,u+=du,v+=dv){if(u<-.000001||v<-.000001||u+v>1.000001)continue;
     var sx=Math.max(0,Math.min(W-1,p[0][0]+sax*u+sbx*v)),sy=Math.max(0,Math.min(H-1,p[0][1]+say*u+sby*v)),ix=Math.floor(sx),iy=Math.floor(sy),tx=sx-ix,ty=sy-iy,a=(iy*W+ix)*4,b=(iy*W+Math.min(W-1,ix+1))*4,c=(Math.min(H-1,iy+1)*W+ix)*4,d=(Math.min(H-1,iy+1)*W+Math.min(W-1,ix+1))*4,j=(y*W+x)*4;
     for(var ch=0;ch<3;ch++)dst[j+ch]=(pixels[a+ch]*(1-tx)+pixels[b+ch]*tx)*(1-ty)+(pixels[c+ch]*(1-tx)+pixels[d+ch]*tx)*ty;
    }
   }
  });ctx.putImageData(out,0,0);
 }
 function staticLip(key){var p=window.KP134_DATA[key].poses;return p.every(function(v){return v.every(function(n,j){return n===p[0][j]})})}
 function render(key,f,opening){var bin=staticLip(key)?0:Math.round(clamp(f)*32),ob=opening===undefined?null:Math.round(clamp(opening)*24),tag=key+':'+bin+':'+ob;if(cache.has(tag))return cache.get(tag);var m=sample(key,bin/32,ob===null?undefined:ob/24),canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;var ctx=canvas.getContext('2d');ctx.fillStyle='#fbe8d9';ctx.fillRect(0,0,W,H);
  if(m.points.every(function(p,i){return Math.abs(p[0]-source[m.a].points[i][0])<.00001&&Math.abs(p[1]-source[m.a].points[i][1])<.00001}))ctx.drawImage(source[m.a].texture,0,0);else warp(ctx,source[m.a],m.points);if(m.t>0&&m.a!==m.b){var layer=document.createElement('canvas');layer.width=W;layer.height=H;var lc=layer.getContext('2d');lc.fillStyle='#fbe8d9';lc.fillRect(0,0,W,H);warp(lc,source[m.b],m.points);if(key==='f'){var mask=lc.createRadialGradient(205,205,96,205,205,151);mask.addColorStop(0,'rgba(0,0,0,1)');mask.addColorStop(1,'rgba(0,0,0,0)');lc.globalCompositeOperation='destination-in';lc.fillStyle=mask;lc.fillRect(0,0,W,H)}ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=m.t;ctx.drawImage(layer,0,0);ctx.restore();
   // A closed lip texture must never be stretched/translucent over the new
   // oral cavity. Reveal the destination cavity through its moving aperture.
   if(window.KP134_DATA[key].kind==='initial'&&m.t>.04){ctx.save();ctx.beginPath();m.points.slice(1,1+N).forEach(function(v,i){i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1])});ctx.closePath();ctx.clip();ctx.drawImage(layer,0,0);ctx.restore()}
  }
  cache.set(tag,canvas);while(cache.size>32)cache.delete(cache.keys().next().value);return canvas;
 }
 function seek(canvas,f){var vector=canvas.closest('.kp144-front')?.querySelector('.kp150-emergency svg');if(vector)try{vector.pauseAnimations();vector.setCurrentTime(4*clamp(f))}catch(e){}canvas.dataset.kp144Progress=String(clamp(f));if(!ready||(canvas.dataset.kp144Key==='f'&&!source.f)||(/^(b|p|m)$/.test(canvas.dataset.kp144Key)&&!restReady)){if(!failed)pending.add(canvas);return}if(!canvas.isConnected){pending.delete(canvas);return}var key=canvas.dataset.kp144Key,opening=restReady&&canvas.dataset.kpOpening!==undefined?Number(canvas.dataset.kpOpening):undefined,bin=staticLip(key)?0:Math.round(clamp(f)*32),tag=key+':'+bin+':'+(opening===undefined?'':Math.round(opening*24));if(canvas.dataset.kp144Frame===tag)return;var ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(render(key,f,opening),0,0,canvas.width,canvas.height);canvas.dataset.kp144Frame=tag;canvas.dataset.kp144Ready='true';var fallback=canvas.closest('.kp144-front').querySelector('.kp144-fallback');if(fallback)fallback.style.visibility='hidden';pending.delete(canvas)}
 // One preparation and one relaxation, independent of tone. During the vowel
 // the opening is held; this is a teaching illustration, not a filmed take.
 function activity(canvas,state,reduced){if(!/^(a|o|e|i|u|ü)$/.test(canvas.dataset.kp144Key))return;var token=Number(canvas.dataset.kpCycle||0)+1;canvas.dataset.kpCycle=String(token);var from=Number(canvas.dataset.kpOpening===undefined?1:canvas.dataset.kpOpening),target=state==='ended'?0:1;
  if(state==='loading'){canvas.dataset.kpOpening=reduced?'1':'0';seek(canvas,0);return}
  if(reduced||!restReady||state==='idle'||state==='error'){canvas.dataset.kpOpening='1';seek(canvas,Number(canvas.dataset.kp144Progress)||0);return}
  var start=performance.now(),duration=state==='ended'?220:160;
  function tick(now){if(!canvas.isConnected||Number(canvas.dataset.kpCycle)!==token)return;var t=clamp((now-start)/duration);canvas.dataset.kpOpening=String(from+(target-from)*smooth(t));seek(canvas,Number(canvas.dataset.kp144Progress)||0);if(t<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)
 }
 function hydrate(root){root.querySelectorAll('canvas[data-kp144-key]').forEach(function(c){seek(c,Number(c.dataset.kp144Progress)||0)})}
 function front(key,live,id){var f=live?0:1,m=sample(key,f),closed=/^(b|p|m)$/.test(key),s=closed?source.a:source[m.t<.5?m.a:m.b],x=s.crop[0]/(1312-W)*100,y=s.crop[1]/(1199-H)*100;return '<div class="kp134-front kp144-front" data-kp134-key="'+esc(key)+'" role="img" aria-label="'+esc(key)+' の口形。鼻・頬・あごを含むイラスト" style="display:block;position:relative;max-width:100%;aspect-ratio:412/378;overflow:hidden;border-radius:18px;isolation:isolate"><span class="kp150-emergency" aria-hidden="true">'+window.KP134.front(key,true,(id||'kp150')+'-vector',true)+'</span><span class="kp144-fallback" aria-hidden="true" style="position:absolute;inset:0;display:block;background-image:url(&quot;./assets/articulation/'+(key==='f'?'f-portrait-147.webp':'vowel-'+(closed?'rest':'mouth')+'-101.png')+'&quot;);background-size:'+(key==='f'?'100% 100%':'318.4466019417% 317.1957671958%')+';background-position:'+x+'% '+y+'%;background-repeat:no-repeat"></span><canvas class="kp144-canvas" width="412" height="378" data-kp144-key="'+esc(key)+'" data-kp144-progress="'+f+'" aria-hidden="true" style="display:block;position:absolute;inset:0;width:100%;height:100%;max-width:100%;max-height:100%"></canvas></div>'}

 var scriptUrl=document.currentScript.src;
 image.onload=function(){Object.keys(source).filter(function(k){return k!=='f'&&k.indexOf('rest-')!==0}).forEach(function(k){var s=source[k],c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').drawImage(image,s.crop[0],s.crop[1],W,H,0,0,W,H);s.texture=c});ready=true;hydrate(document);pending.clear()};image.onerror=function(){failed=true;pending.clear()};image.src=new URL('../assets/articulation/vowel-mouth-101.png',scriptUrl).href;
 restImage.onload=function(){['a','o','e','i','u','ü'].forEach(function(k,i){var s={crop:source[k].crop.slice(),pose:source[k].pose.slice(),cy:[205,208,207,204,209,207][i],outer:[115,57,66],inner:[114,.8,.8],tooth:.8},c=document.createElement('canvas');s.points=points(s);for(var j=1+N*2;j<s.points.length;j++)s.points[j]=source[k].points[j].slice();c.width=W;c.height=H;c.getContext('2d').drawImage(restImage,s.crop[0],s.crop[1],W,H,0,0,W,H);s.texture=c;source['rest-'+k]=s});restReady=true;cache.clear();document.querySelectorAll('canvas[data-kp144-key]').forEach(function(c){delete c.dataset.kp144Frame});hydrate(document)};restImage.src=new URL('../assets/articulation/vowel-rest-101.png',scriptUrl).href;

 var fImage=new Image();fImage.onload=function(){var s={crop:[0,0],pose:[61,7,0],cy:190,outer:[121,49,49],inner:[114,9,1],tooth:14};s.points=points(s);for(var j=1+N*2;j<s.points.length;j++)s.points[j]=source.o.points[j].slice();var c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').drawImage(fImage,0,0,W,H);s.texture=c;source.f=s;cache.clear();document.querySelectorAll('canvas[data-kp144-key="f"]').forEach(function(c){delete c.dataset.kp144Frame;seek(c,Number(c.dataset.kp144Progress)||0)})};fImage.src=new URL('../assets/articulation/f-portrait-147.webp',scriptUrl).href;
 function init(){hydrate(document);new MutationObserver(function(records){records.forEach(function(r){r.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.matches('canvas[data-kp144-key]'))seek(n,Number(n.dataset.kp144Progress)||0);else if(n.querySelector('canvas[data-kp144-key]'))hydrate(n)})})}).observe(document.body,{childList:true,subtree:true})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.KP144={front:front,seek:seek,activity:activity,sample:sample,triangles:triangles,source:source,determinant:determinant,status:function(){return {ready:ready,restReady:restReady,failed:failed,cache:cache.size}}};
})();
