/* 10.108.140: textbook articulation sequences, separate from audio timing.
 * TUFS 1.4/1.5/1.6/1.7; USTS language training IV; SXFTC q training.
 * The palate is a fixed boundary; only the relevant tongue region deforms.
 * These are qualitative diagrams, not measured anatomy or phoneme alignment.
 */
(function(){
 'use strict';
 var data=window.KP134_DATA,serial=0;
 function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
 function clamp(x){return Math.max(0,Math.min(1,x))}
 function smooth(t){t=clamp(t);return t*t*(3-2*t)}
 function mix(a,b,t){return a.map(function(p,i){return [p[0]+(b[i][0]-p[0])*t,p[1]+(b[i][1]-p[1])*t]})}
 // Nonnegative separation from the fixed palate prevents the tongue passing
 // through the roof. The final point anchors the tongue base in every model.
 var xs=[54,64,78,96,116,136,154,168,174],roof=[62,52,44,39,39,42,49,54,57];
 function curve(x,xx,yy){var i=0;while(i<xx.length-2&&x>xx[i+1])i++;var h=xx[i+1]-xx[i],t=clamp((x-xx[i])/h),delta=(yy[i+1]-yy[i])/h;
  function tangent(j){if(j===0)return (yy[1]-yy[0])/(xx[1]-xx[0]);if(j===yy.length-1)return (yy[j]-yy[j-1])/(xx[j]-xx[j-1]);var l=(yy[j]-yy[j-1])/(xx[j]-xx[j-1]),r=(yy[j+1]-yy[j])/(xx[j+1]-xx[j]);return l*r<=0?0:2*l*r/(l+r)}
  var a=tangent(i),b=tangent(i+1);if(delta===0){a=0;b=0}else{var norm=Math.hypot(a/delta,b/delta);if(norm>3){a*=3/norm;b*=3/norm}}
  return (2*t*t*t-3*t*t+1)*yy[i]+(t*t*t-2*t*t+t)*h*a+(-2*t*t*t+3*t*t)*yy[i+1]+(t*t*t-t*t)*h*b;
 }
 function palate(x){return curve(x,xs,roof)}
 function shape(gaps,xx){return (xx||xs).map(function(x,i){return [x,gaps[i]]})}
 var shapes={
  a:shape([46,54,62,73,73,70,61,65,71]),
  ae:shape([44,50,47,43,49,59,61,65,71]),
  frontmid:shape([44,50,43,36,43,55,61,65,71]),
  schwa:shape([45,53,53,53,52,53,57,64,71]),
  e:shape([45,55,61,57,47,35,39,58,71]),
  o:shape([45,55,61,60,50,39,41,58,71]),
  i:shape([44,48,22,14,23,45,61,65,71]),
  u:shape([45,54,63,48,24,15,23,56,71]),
  n:shape([4,0,0,27,46,60,64,65,71]),
  ni:shape([4,0,0,18,29,45,61,65,71]),
  ng:shape([46,54,62,59,43,15,0,21,71]),
  ngi:shape([44,48,22,14,18,10,0,21,71]),
  ngmid:shape([45,54,53,44,32,12,0,21,71]),
  palatal:shape([44,45,10,0,14,41,61,65,71]),
  palatalGap:shape([44,45,14,4,18,43,61,65,71]),
  dental:shape([6,13,30,44,57,62,62,65,71]),
  dentalGap:shape([10,16,31,44,57,62,62,65,71]),
  retro:shape([0,9,29,49,60,63,64,65,71],[74,82,94,108,124,141,156,169,174]),
  retroGap:shape([5,13,31,49,60,63,64,65,71],[74,82,94,108,124,141,156,169,174])
 };
 shapes['ü']=shapes.i;
 var components={ai:['a','i'],ei:['frontmid','i'],ui:['u','frontmid','i'],ao:['a','u'],ou:['o','u'],iu:['i','o','u'],ie:['i','ae'],'üe':['ü','ae']};
 var labels={a:'舌を低く保つ',o:'舌は奥寄り・唇は丸く',e:'舌は奥寄り・唇は丸めない',i:'舌の前面を高く・触れない',u:'舌の奥を高く・唇を丸く','ü':'舌は前・高く、唇は丸く',ai:'低い位置から、前・上の方向へ',ei:'前寄りから、さらに前・上へ',ui:'奥から前へ・一息でつなぐ',ao:'低い位置から、奥・上の方向へ',ou:'奥寄りの舌を少し高く',iu:'前から奥へ・一息でつなぐ',ie:'前の高い舌を、少し下げる','üe':'前寄りの舌を、少し下げる',er:'舌先を軽く上げる・触れない'};
 function nasalFinal(key){return /^(an|en|in|un|ün|ang|eng|ing|ong)$/.test(key)}
 function posture(key){return shapes[key]||shapes.schwa}
 function model(key,f){
  f=clamp(f);var d=data[key]||{},m=d.mechanism||'',initial=d.kind==='initial',nf=nasalFinal(key),comp=components[key],p=posture(key),oral=1,nasal=0,lip=0,dental=0,contact=0,voice=1,marker=null,lateral=0,stage=f<.22?0:f<.78?1:2;
  var release=smooth((f-.24)/.16),vowel=smooth((f-.65)/.25),asp=false;
  if(comp){
   var start=posture(comp[0]),end=posture(comp[comp.length-1]);
   if(/^(ai|ei|ao|ou)$/.test(key))end=mix(start,end,.72);
   if(comp.length===3){var mid=posture(comp[1]);p=f<.45?mix(start,mid,smooth((f-.12)/.33)):mix(mid,end,smooth((f-.45)/.4));stage=f<.3?0:f<.72?1:2}
   else p=mix(start,end,smooth((f-.18)/.62));
  }else if(nf){
   var ng=/ng$/.test(key),high=/^(in|ün|ing)$/.test(key),startKey=key==='an'?'ae':key==='ang'?'a':key==='en'?'schwa':key==='eng'?'e':/^(in|ing)$/.test(key)?'i':key==='ün'?'ü':'u';
   var start=posture(startKey),end=ng?(high?shapes.ngi:key==='ang'?shapes.ng:shapes.ngmid):(high?shapes.ni:shapes.n);
   var t=smooth((f-.35)/.45);if(key==='un'&&f<.35)p=mix(start,shapes.schwa,smooth(f/.35));else p=mix(key==='un'?shapes.schwa:start,end,t);
   nasal=smooth((f-.53)/.27);oral=1-nasal;contact=t;marker=ng?[154,palate(154)]:[64,palate(64)];stage=f<.35?0:f<.8?1:2;
  }else if(initial){
   var finish=shapes.e;
   if(/bilabial/.test(m)){
    p=shapes.o;marker=[34,80];
    if(key==='m'){var nrel=smooth((f-.65)/.25);lip=1-nrel;nasal=1-nrel;oral=nrel;contact=lip}
    else{lip=1-release;contact=lip;oral=release;voice=smooth((f-(d.aspirated?.54:.4))/.1)}
   }else if(m==='labiodental'){p=shapes.o;dental=1-vowel;marker=[48,80];contact=1-vowel;voice=vowel}
   else if(/^alveolar/.test(m)||m==='lateral'){
    var r=(key==='n'||key==='l')?vowel:release;p=mix(shapes.n,finish,r);contact=1-r;marker=[64,palate(64)];
    if(key==='n'){nasal=1-r;oral=r}else if(key==='l'){lateral=1-r;oral=r}else{oral=release;voice=smooth((f-(d.aspirated?.54:.4))/.1)}
   }else if(/^velar/.test(m)){
    var closed=m==='velar-stop',base=closed?shapes.ngmid:mix(shapes.ngmid,shapes.e,.16);p=mix(base,finish,closed?release:vowel);marker=[154,palate(154)];contact=closed?1-release:0;oral=closed?release:1;voice=closed?smooth((f-(d.aspirated?.54:.4))/.1):vowel;
   }else if(/^palatal/.test(m)){
    var aff=/affricate/.test(m);p=aff?mix(shapes.palatal,shapes.palatalGap,release):shapes.palatalGap;p=mix(p,shapes.i,vowel);marker=[96,palate(96)];contact=aff?1-release:0;oral=aff?release:1;voice=vowel;
   }else if(/^dental/.test(m)){
    var aff=/affricate/.test(m);p=aff?mix(shapes.dental,shapes.dentalGap,release):shapes.dentalGap;marker=[54,68];contact=aff?1-release:0;oral=aff?release:1;voice=vowel;
   }else if(/^retroflex/.test(m)){
    var aff=/affricate/.test(m);p=aff?mix(shapes.retro,shapes.retroGap,release):shapes.retroGap;marker=[74,palate(74)];contact=aff?1-release:0;oral=aff?release:1;voice=key==='r'?1:vowel;
   }
   asp=!!d.aspirated&&f>.32&&f<.64;stage=f<.24?0:f<.65?1:2;
  }else if(key==='er'){p=shapes.retroGap}
  var round=({o:1,u:1,'ü':1,ong:1,'ün':1})[key]||0;
  if(comp){var pp=d.poses,t=f<.45&&pp.length===3?f/.45:pp.length===3?(f-.45)/.4:f/.85,a=pp.length===3&&f>=.45?1:0,b=Math.min(a+1,pp.length-1);round=pp[a][2]+(pp[b][2]-pp[a][2])*clamp(t)}
  if(key==='un')round=1-smooth(f/.52);if(/bilabial|labiodental/.test(m))round=vowel;
  var flowing=f>0&&f<1?1:0;
  return {tongue:p,oral:oral*flowing,nasal:nasal*flowing,velum:nasal,voice:voice*flowing,lip:lip,dental:dental,round:round,contact:contact,marker:marker,stage:stage,lateral:lateral*flowing,aspirated:asp};
 }
 function surface(p,x){var xx=p.map(function(a){return a[0]}),yy=p.map(function(a){return a[1]});return palate(x)+Math.max(0,curve(x,xx,yy))}
 function topPath(p){var out='';for(var x=p[0][0];x<174;x+=1.5)out+=(out?' L':'M')+x.toFixed(2)+' '+surface(p,x).toFixed(2);return out+' L174 128'}
 function tonguePath(p){var x=p[0][0],y=surface(p,x);return topPath(p)+(x>60?' L174 136 C145 143 94 138 61 123 C49 114 54 93 62 83 C68 68 '+(x-6)+' '+(y+6)+' '+x+' '+y.toFixed(2)+' Z':' L174 136 C145 143 91 138 60 122 Q49 116 50 103 Q47 '+(y+4)+' '+x+' '+y.toFixed(2)+' Z')}
 function palatePath(from,to){var s='';for(var x=from;x<to;x+=1.5)s+=(s?' L':'M')+x+' '+palate(x).toFixed(2);return s+' L'+to+' '+palate(to).toFixed(2)}
 function velumPath(s){var n=s.velum;return palatePath(136,168)+' Q'+(182-8*n)+' '+(55+10*n)+' '+(190-16*n)+' '+(49+29*n)}
 function lipPaths(s){var opening=(1-clamp(s.lip))*20,upperTip=34-s.round*5,lowerTip=upperTip,upper=80-opening*.32,lower=80+opening*.68;var contact=s.dental||0;lower=lower+(80-lower)*contact;lowerTip=lowerTip+(48-lowerTip)*contact;return ['M43 64 Q37 71 '+upperTip+' '+(upper-2)+' Q'+(upperTip-2)+' '+upper+' 43 '+upper,'M43 116 Q37 109 '+lowerTip+' '+(lower+2)+' Q'+(lowerTip-2)+' '+lower+' 43 '+lower]}
 function label(key,s){
  if(labels[key])return labels[key];
  if(nasalFinal(key))return /ng$/.test(key)?(s.stage===0?'母音から・舌先は上げない':s.stage===1?'舌の後部を、軟口蓋へ':'奥で収める・g は足さない'):(s.stage===0?'母音の構えから':s.stage===1?'舌の前部を、上の前歯の後ろへ':'前で収める・母音を足さない');
  if(key==='l')return s.stage<2?'舌先は接触・息は舌の両側へ':'舌先を離して、母音へ';
  if(key==='m'||key==='n')return s.stage<2?(key==='m'?'唇を閉じ、鼻に声を通す':'舌の前部をつけ、鼻に声を通す'):'閉鎖をほどいて、母音へ';
  if(key==='d'||key==='t')return s.stage===0?'舌の前部を、上の前歯の後ろへ':s.stage===1?(key==='t'?'前部を離す・強い息':'前部を離す・短い息'):'舌をゆるめ、母音へ';
  if(key==='g'||key==='k')return s.stage===0?'舌の後部を、軟口蓋へつける':s.stage===1?(key==='k'?'後部を離す・強い息':'後部を離す・短い息'):'舌をゆるめ、母音へ';
  if(key==='h')return s.stage<2?'舌の後部のすき間から、息を続ける':'奥をゆるめ、母音へ';
  if(key==='f')return s.stage<2?'上の前歯を、下唇の内側へ':'歯と下唇を離し、母音へ';
  if(key==='b'||key==='p')return s.stage===0?'両唇を軽く閉じる':s.stage===1?(key==='p'?'両唇を開き、強い息':'両唇を開き、短い息'):'母音へつなぐ';
  if(/^(j|q|x)$/.test(key))return s.stage<2?(key==='x'?'舌先は下・舌面のすき間から':'舌先は下・舌面で閉じて細く開く'):'舌先は下のまま、i へ';
  if(/^(z|c|s)$/.test(key))return s.stage<2?(key==='s'?'前歯の後ろに、細いすき間':'前歯の後ろで、閉鎖→すき間'):'舌は前寄りのまま、声を続ける';
  if(/^(zh|ch|sh|r)$/.test(key))return key==='r'?'舌先を軽く上げ、声を響かせる':s.stage<2?(key==='sh'?'舌先を軽く上げ、すき間を保つ':'舌先を軽く上げ、閉鎖→すき間'):'大きく巻かず、声へつなぐ';
  return data[key]?data[key].phase[s.stage]:'舌の構え';
 }
 function referenceFrame(key){var d=data[key]||{};return d.kind==='initial'?(/stop|affricate/.test(d.mechanism)?0:.36):nasalFinal(key)?.9:.6}
 function hasMotion(key){return !!(data[key]&&key!=='r'&&key!=='er'&&(data[key].kind==='initial'||nasalFinal(key)||components[key]))}
 function mechanism(key,id){
  id=(id||'kp140-'+(++serial)).replace(/[^a-zA-Z0-9_-]/g,'');var s=model(key,referenceFrame(key)),lp=lipPaths(s);
  return '<svg class="kp134-position kp139-position" data-kp139-key="'+esc(key)+'" viewBox="0 0 220 190" role="img" aria-label="'+esc(key)+' の舌位と息の出口を示す教材模式図"><defs><linearGradient id="'+id+'-tongue" x2="0.25" y2="1"><stop stop-color="#e9b1a2"/><stop offset=".6" stop-color="#d58f84"/><stop offset="1" stop-color="#c3827a"/></linearGradient><linearGradient id="'+id+'-skin" x2="0" y2="1"><stop stop-color="#fff9f2"/><stop offset="1" stop-color="#f1dfce"/></linearGradient><marker id="'+id+'-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 .5 L4 2.5 L0 4.5" fill="none" stroke="#659b91" stroke-width="1.2"/></marker></defs>'
   +'<rect x="1" y="1" width="218" height="188" rx="20" fill="#fffaf4"/><text x="20" y="20" fill="#8b897c" font-size="10">前</text><text x="185" y="20" fill="#8b897c" font-size="10">奥</text>'
   +'<path d="M43 64 Q53 37 85 27 Q142 11 190 44 L194 127 Q153 154 95 145 Q54 139 43 116" fill="url(#'+id+'-skin)" stroke="#dbc2ad" stroke-width="1.2"/>'
   +'<path d="M56 35 Q47 37 42 44 L28 51 Q24 55 32 57 L43 59 L43 64" fill="#fbefe1" stroke="#dbc2ad" stroke-width="1.2" stroke-linejoin="round"/>'
   +'<path d="M43 53 Q63 33 101 27 Q149 21 181 42 L181 48 Q147 32 109 36 Q66 38 49 60" fill="#f9f3e8" stroke="#e4d9c7" stroke-width=".8"/>'
   +'<path d="'+palatePath(54,136)+'" fill="none" stroke="#c5aa92" stroke-width="3.5" stroke-linecap="round"/>'
   +'<path class="kp139-velum" d="'+velumPath(s)+'" fill="none" stroke="#c5aa92" stroke-width="3.5" stroke-linecap="round"/>'
   +'<path d="M44 117 Q90 145 174 136" fill="none" stroke="#d7b79f" stroke-width="2.5"/>'
   +'<rect x="43" y="64" width="11" height="16" rx="3" fill="#fffefa" stroke="#d8cbbb"/><rect x="43" y="103" width="11" height="14" rx="3" fill="#fffefa" stroke="#d8cbbb"/>'
   +'<path class="kp139-tongue" d="'+tonguePath(s.tongue)+'" fill="url(#'+id+'-tongue)" stroke="#bd8175" stroke-width="1.1" stroke-linejoin="round"/>'
   +'<path class="kp140-tongue-edge" d="'+topPath(s.tongue)+'" fill="none" stroke="#ffe6d6" stroke-width="1.4" opacity=".55"/>'
   +'<path class="kp139-lip-upper" d="'+lp[0]+'" fill="none" stroke="#c68e84" stroke-width="4" stroke-linecap="round"/><path class="kp139-lip-lower" d="'+lp[1]+'" fill="none" stroke="#c68e84" stroke-width="4" stroke-linecap="round"/>'
   +'<circle class="kp139-contact" cx="'+(s.marker?s.marker[0]:64)+'" cy="'+(s.marker?s.marker[1]:52)+'" r="3" fill="#599b7d" opacity="'+(s.marker?s.contact*.75:0)+'"/>'
   +'<path class="kp139-oral" d="M41 88 H18" fill="none" stroke="#659b91" stroke-width="1.5" stroke-linecap="round" marker-end="url(#'+id+'-arrow)" opacity="'+(s.oral*.8)+'"/>'
   +'<path class="kp139-nasal" d="M184 96 Q188 63 182 42 Q150 23 108 31 Q63 33 31 52" fill="none" stroke="#659b91" stroke-width="1.8" stroke-linecap="round" marker-end="url(#'+id+'-arrow)" opacity="'+(s.nasal*.8)+'"/>'
   +(key==='l'?'<g class="kp139-lateral" opacity="'+s.lateral+'"><rect x="151" y="92" width="63" height="48" rx="9" fill="#fffaf4" stroke="#e2d5c5"/><path d="M161 125 Q154 105 181 101 Q208 105 203 125" fill="none" stroke="#cbb39c" stroke-width="2"/><path d="M173 132 L173 110 Q181 104 189 110 L189 132" fill="#d99a8e" stroke="#bc8176"/><path d="M166 130 Q162 119 166 112 M196 130 Q200 119 196 112" fill="none" stroke="#659b91" stroke-width="1.4" marker-end="url(#'+id+'-arrow)"/><text x="182" y="152" text-anchor="middle" font-size="9" fill="#7b8575">上から・両側</text></g>':'')
   +'<text x="101" y="29" text-anchor="middle" font-size="8.5" fill="#8f8a7c">硬口蓋</text><text x="159" y="31" text-anchor="middle" font-size="8.5" fill="#8f8a7c">軟口蓋</text>'
   +'<text class="kp139-label" x="110" y="176" text-anchor="middle" font-size="10" fill="#557767">'+esc(label(key,s))+'</text></svg>';
 }
 function seek(svg,f,flow){var key=svg.dataset.kp139Key,s=model(key,f),lp=lipPaths(s);svg.dataset.motionPhase=String(s.stage);svg.querySelector('.kp139-tongue').setAttribute('d',tonguePath(s.tongue));svg.querySelector('.kp140-tongue-edge').setAttribute('d',topPath(s.tongue));svg.querySelector('.kp139-lip-upper').setAttribute('d',lp[0]);svg.querySelector('.kp139-lip-lower').setAttribute('d',lp[1]);var oral=svg.querySelector('.kp139-oral');oral.setAttribute('opacity',String(flow===false?0:s.oral*.8));oral.setAttribute('stroke-width',s.aspirated?'2.5':'1.5');oral.setAttribute('d',s.aspirated?'M41 88 Q25 84 10 87':'M41 88 H18');svg.querySelector('.kp139-nasal').setAttribute('opacity',String(flow===false?0:s.nasal*.8));svg.querySelector('.kp139-velum').setAttribute('d',velumPath(s));var marker=svg.querySelector('.kp139-contact');marker.setAttribute('opacity',String(s.marker?s.contact*.75:0));svg.querySelector('.kp139-label').textContent=label(key,s);var side=svg.querySelector('.kp139-lateral');if(side)side.setAttribute('opacity',String(flow===false?0:s.lateral));}
 function audioFraction(a){var path=new URL(a.currentSrc||a.src,document.baseURI).pathname,idx=path.indexOf('/assets/'),key=idx<0?'':path.slice(idx+1),w=window.KP139_AUDIO_WINDOWS&&window.KP139_AUDIO_WINDOWS[key];return w?clamp((a.currentTime-w[0])/(w[1]-w[0])):a.duration>0?clamp(a.currentTime/a.duration):0}
 window.KP139={referenceFrame:referenceFrame,audioFraction:audioFraction,mechanism:mechanism,seek:seek,model:model,hasMotion:hasMotion,palate:palate,surface:surface,label:label};
})();
