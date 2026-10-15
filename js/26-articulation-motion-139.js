/* 10.108.145: place-specific tongue shapes and matched lip apertures.
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
  i:shape([44,42,15,9,12,30,48,62,71]),
  u:shape([45,52,52,38,24,13,17,44,71]),
  n:shape([4,0,0,17,30,43,55,63,71],[59,64,70,96,116,136,154,168,174]),
  ni:shape([3,0,0,10,20,36,51,62,71],[59,64,70,96,116,136,154,168,174]),
  ng:shape([46,54,61,53,35,12,0,18,71]),
  ngi:shape([44,42,16,13,12,5,0,18,71]),
  ngmid:shape([45,54,53,44,30,10,0,18,71]),
  palatal:shape([44,42,4,0,5,27,49,62,71]),
  palatalGap:shape([44,42,7,4,7,27,49,62,71]),
  // Dental initials meet the BACK of the upper incisors, anterior to d/t/n/l.
  dental:shape([8,20,27,39,45,51,57,64,71],[54,60,64,96,116,136,154,168,174]),
  dentalGap:shape([12,22,29,40,46,52,58,64,71],[57,63,70,96,116,136,154,168,174]),
  retro:shape([0,6,20,33,36,39,42,52,71],[74,82,94,108,124,141,156,169,174]),
  retroGap:shape([4,10,23,34,37,40,43,52,71],[74,82,94,108,124,141,156,169,174])
 };
 shapes.nGap=shape([9,5,5,19,30,43,55,63,71],[59,64,70,96,116,136,154,168,174]);shapes.velarGap=shape([45,54,53,44,30,14,6,21,71]);shapes.velarFricative=shape([45,54,53,44,30,16,8,23,71]);
 // Rhotic vowel: raised tip without the narrow fricative constriction of sh.
 shapes.rhotic=shape([12,16,23,31,31,35,43,55,71],[72,82,94,108,124,141,156,169,174]);
 shapes['ü']=shapes.i;
 function lipPose(d,f){var p=d.poses||[[64,19,0]],seq,times;if(d.kind==='initial'){seq=[p[0],p[0],p[p.length-1],p[p.length-1]];times=[0,.24,.40,1]}else if(p.length===3){seq=[p[0],p[1],p[2],p[2]];times=[0,.38,.78,1]}else{seq=[p[0],p[0],p[p.length-1],p[p.length-1]];times=[0,.14,.78,1]}var i=0;while(i<times.length-2&&f>times[i+1])i++;var t=clamp((f-times[i])/(times[i+1]-times[i]));return seq[i].map(function(n,j){return n+(seq[i+1][j]-n)*t})}

 var components={ai:['a','i'],ei:['frontmid','i'],ui:['u','frontmid','i'],ao:['a','u'],ou:['o','u'],iu:['i','o','u'],ie:['i','ae'],'üe':['ü','ae']};
 var labels={a:'舌を低く保つ',o:'舌は奥寄り・唇は丸く',e:'舌は奥寄り・唇は丸めない',i:'舌の前面を高く・触れない',u:'舌の奥を高く・唇を丸く','ü':'舌は前・高く、唇は丸く',ai:'低い位置から、前・上の方向へ',ei:'前寄りから、さらに前・上へ',ui:'奥から前へ・一息でつなぐ',ao:'低い位置から、奥・上の方向へ',ou:'奥寄りの舌を少し高く',iu:'前から奥へ・一息でつなぐ',ie:'前の高い舌を、少し下げる','üe':'前寄りの舌を、少し下げる',er:'舌先を軽く上げる・触れない'};
 function nasalFinal(key){return /^(an|en|in|un|ün|ang|eng|ing|ong)$/.test(key)}
 function posture(key){return shapes[key]||shapes.schwa}
 function model(key,f){
  f=clamp(f);var d=data[key]||{},m=d.mechanism||'',initial=d.kind==='initial',nf=nasalFinal(key),comp=components[key],p=posture(key),oral=1,nasal=0,lip=0,dental=0,contact=0,voice=1,marker=null,lateral=0,stage=f<.22?0:f<.78?1:2;
  var release=smooth((f-.24)/.16),asp=false;
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
   // Only the initial consonant is illustrated here. The carrier vowel in
   // the example recording is deliberately excluded from the movement model.
   voice=/^(m|n|l|r)$/.test(key)?1:0;
   if(/bilabial/.test(m)){
    p=shapes.schwa;marker=[34,80];
    if(key==='m'){lip=1;nasal=1;oral=0;contact=1}
    else{lip=1-release;contact=lip;oral=release}
   }else if(m==='labiodental'){p=shapes.schwa;dental=1;marker=[48,80];contact=1;oral=1}
   else if(/^alveolar/.test(m)||m==='lateral'){
    marker=[64,palate(64)];
    if(key==='n'){p=shapes.n;contact=1;nasal=1;oral=0}
    else if(key==='l'){p=shapes.n;contact=1;lateral=1;oral=0}
    else{p=mix(shapes.n,shapes.nGap,release);contact=1-release;oral=release}
   }else if(/^velar/.test(m)){
    var closed=m==='velar-stop';p=closed?mix(shapes.ngmid,shapes.velarGap,release):shapes.velarFricative;marker=[154,palate(154)];contact=closed?1-release:0;oral=closed?release:1;
   }else if(/^palatal/.test(m)){
    var aff=/affricate/.test(m);p=aff?mix(shapes.palatal,shapes.palatalGap,release):shapes.palatalGap;marker=[96,palate(96)];contact=aff?1-release:0;oral=aff?release:1;
   }else if(/^dental/.test(m)){
    var aff=/affricate/.test(m);p=aff?mix(shapes.dental,shapes.dentalGap,release):shapes.dentalGap;marker=[54,70];contact=aff?1-release:0;oral=aff?release:1;
   }else if(/^retroflex/.test(m)){
    var aff=/affricate/.test(m);p=aff?mix(shapes.retro,shapes.retroGap,release):shapes.retroGap;marker=[74,palate(74)];contact=aff?1-release:0;oral=aff?release:1;
   }
   asp=!!d.aspirated&&f>.32&&f<.64;stage=f<.24?0:f<.65?1:2;
  }else if(key==='er'){p=shapes.rhotic}
  // Lip opening/rounding share the front-view keyframes. The jaw is left
  // relaxed: lip closure is not a command to clench the teeth.
  var pose=lipPose(d,f),round=pose[2],aperture=pose[1]*20/34;
  // Flow begins and ends smoothly; a stop has a brief release, while an
  // aspirated partner keeps its breath visible for longer. Tongue travel is
  // the same for the pair. These times describe a teaching sequence only.
  var flowing=smooth(f/.12)*(1-smooth((f-.9)/.1));
  if(initial&&/stop/.test(m)&&key!=='m')oral*=1-smooth((f-(d.aspirated?.65:.43))/(d.aspirated?.2:.15));
  else if(initial&&/affricate/.test(m))oral*=1-smooth((f-.78)/.2);
  
  return {aperture:aperture,tongue:p,oral:oral*flowing,nasal:nasal*flowing,velum:nasal,voice:voice*flowing,lip:lip,dental:dental,round:round,contact:contact,marker:marker,stage:stage,lateral:lateral*flowing,aspirated:asp};
 }
 function surface(p,x){var xx=p.map(function(a){return a[0]}),yy=p.map(function(a){return a[1]});return palate(x)+Math.max(0,curve(x,xx,yy))}
 function topPath(p){var out='';for(var x=p[0][0];x<174;x+=1.5)out+=(out?' L':'M')+x.toFixed(2)+' '+surface(p,x).toFixed(2);return out+' L174 128'}
 function palatePath(from,to){var s='';for(var x=from;x<to;x+=1.5)s+=(s?' L':'M')+x+' '+palate(x).toFixed(2);return s+' L'+to+' '+palate(to).toFixed(2)}
 function velumPath(s){var n=s.velum;return palatePath(136,158)+' Q'+(174-2*n)+' '+(49+6*n)+' '+(198-22*n)+' '+(43+33*n)}
 function nasalPath(){return 'M188 114 Q196 91 192 64 Q193 44 181 34 Q152 24 115 28 Q67 27 31 53'}
 function lipPaths(s){var opening=s.aperture,upperTip=34-s.round*5,lowerTip=upperTip,upper=80-opening*.32,lower=80+opening*.68;var contact=s.dental||0;lower=lower+(80-lower)*contact;lowerTip=lowerTip+(48-lowerTip)*contact;return ['M43 64 Q37 71 '+upperTip+' '+(upper-2)+' Q'+(upperTip-2)+' '+upper+' 43 '+upper,'M43 116 Q37 109 '+lowerTip+' '+(lower+2)+' Q'+(lowerTip-2)+' '+lower+' 43 '+lower]}
 function label(key,s){
  if(labels[key])return labels[key];
  if(nasalFinal(key))return /ng$/.test(key)?(s.stage===0?'母音から・舌先は上げない':s.stage===1?'舌の後部を、軟口蓋へ':'奥で収める・g は足さない'):(s.stage===0?'母音の構えから':s.stage===1?'舌先・前縁を、上の前歯の後ろへ':'前で収める・母音を足さない');
  if(key==='l')return s.stage<2?'舌先は接触・息は舌の両側へ':'舌先をつけたまま保つ';
  if(key==='m'||key==='n')return s.stage<2?(key==='m'?'唇を閉じ、鼻に声を通す':'舌の前部をつけ、鼻に声を通す'):'接触を保ち、鼻に響かせる';
  if(key==='d'||key==='t')return s.stage===0?'舌の前部を、上の前歯の後ろへ':s.stage===1?(key==='t'?'前部を離す・強い息':'前部を離す・短い息'):'小さく離して保つ';
  if(key==='g'||key==='k')return s.stage===0?'舌の後部を、軟口蓋へつける':s.stage===1?(key==='k'?'後部を離す・強い息':'後部を離す・短い息'):'小さく離して保つ';
  if(key==='h')return s.stage<2?'舌の後部のすき間から、息を続ける':'奥のすき間を保つ';
  if(key==='f')return s.stage<2?'上の前歯を、下唇の内側へ':'歯と下唇の構えを保つ';
  if(key==='b'||key==='p')return s.stage===0?'両唇を軽く閉じる':s.stage===1?(key==='p'?'両唇を開き、強い息':'両唇を開き、短い息'):'唇を軽く開いて保つ';
  if(/^(j|q|x)$/.test(key))return s.stage<2?(key==='x'?'舌先は下・舌面のすき間から':'舌先は下・舌面で閉じて細く開く'):'舌先は下・舌面に狭いすき間';
  if(/^(z|c|s)$/.test(key))return s.stage<2?(key==='s'?'上の前歯の裏に、細いすき間':'上の前歯の裏で、閉鎖→すき間'):'舌は前寄りのまま、すき間を保つ';
  if(/^(zh|ch|sh|r)$/.test(key))return key==='r'?'舌先を軽く上げ、声を響かせる':s.stage<2?(key==='sh'?'舌先を軽く上げ、すき間を保つ':'舌先を軽く上げ、閉鎖→すき間'):'大きく巻かず、すき間を保つ';
  return data[key]?data[key].phase[s.stage]:'舌の構え';
 }
 function steps(key){var d=data[key];if(!d)return [];if(d.kind!=='initial')return d.phase.slice();if(key==='m'||key==='n')return ['閉じる','鼻に響く','形を保つ'];if(key==='l')return ['つける','両側へ','形を保つ'];if(/stop|affricate/.test(d.mechanism))return ['閉じる',d.aspirated?'強い息':'短く開く','形を保つ'];return ['構える','息を通す','形を保つ']}
 function referenceFrame(key){var d=data[key]||{};return d.kind==='initial'?(/stop|affricate/.test(d.mechanism)?0:.36):nasalFinal(key)?.9:.6}
 function hasMotion(key){return !!(data[key]&&key!=='r'&&key!=='er'&&(data[key].kind==='initial'||nasalFinal(key)||components[key]))}
 function tonguePath(p){var x=p[0][0],y=surface(p,x);return topPath(p)+' C177 134 180 141 180 145 C148 153 98 150 64 130 C56 125 54 115 54 107 '+(x>68?'C54 99 60 87 65 80 Q69 '+(y+12)+' '+x+' '+y.toFixed(2):x>54?'C54 88 '+(x-3)+' '+(y+10)+' '+x+' '+y.toFixed(2):'Q54 '+(y+5)+' '+x+' '+y.toFixed(2))+' Z'}
 function oralPath(s){var p=s.tongue,entry=palate(170)+(surface(p,170)-palate(170))*.44,out='M188 112 Q193 94 184 79 Q178 '+entry.toFixed(1)+' 170 '+entry.toFixed(1);for(var x=167;x>=p[0][0];x-=3){var y=palate(x)+(surface(p,x)-palate(x))*.44;out+=' L'+x.toFixed(1)+' '+y.toFixed(1)}return out+' L'+p[0][0]+' '+(p[0][0]<=54?Math.max(82,Math.min(84,surface(p,54)-1)):palate(p[0][0])+(surface(p,p[0][0])-palate(p[0][0]))*.44).toFixed(1)+(p[0][0]<=54?' Q47 86 37 88':' L57 69 Q55.5 70 55.5 73 L55.5 81 Q55.5 84 53 84 Q46 87 37 88')}
 function route(s,key){if(s.stage===2&&s.oral===0&&s.nasal===0&&s.lateral===0)return '音を収める';return key==='l'&&s.lateral>.1?'舌の両側へ':s.nasal>.1?'鼻へ通す':s.oral>.1?'口から息を出す':'いったん止める'}
 function mechanism(key,id){
  id=(id||'kp141-'+(++serial)).replace(/[^a-zA-Z0-9_-]/g,'');var s=model(key,referenceFrame(key)),lp=lipPaths(s),td=tonguePath(s.tongue);
  var contact=s.marker||[64,52];
  return '<svg class="kp134-position kp139-position kp141-position" data-kp139-key="'+esc(key)+'" viewBox="0 0 260 186" role="img" aria-label="'+esc(key)+' の舌位と息の出口。横からの教材模式図"><defs>'
   +'<radialGradient id="'+id+'-skin" cx=".38" cy=".23" r=".83"><stop stop-color="#fffaf1"/><stop offset=".62" stop-color="#f9e8d8"/><stop offset="1" stop-color="#e7c6ab"/></radialGradient>'
   +'<linearGradient id="'+id+'-cavity" x2=".2" y2="1"><stop stop-color="#eddbca"/><stop offset=".38" stop-color="#fff8ef"/><stop offset="1" stop-color="#f1dac7"/></linearGradient>'
   +'<radialGradient id="'+id+'-tongue" cx=".38" cy=".24" r=".93"><stop stop-color="#edb6a4"/><stop offset=".38" stop-color="#dfa08e"/><stop offset=".76" stop-color="#c48478"/><stop offset="1" stop-color="#b47970"/></radialGradient>'
   +'<linearGradient id="'+id+'-teeth" x2=".3" y2="1"><stop stop-color="#fffefa"/><stop offset=".6" stop-color="#fff8ec"/><stop offset="1" stop-color="#e4d8c4"/></linearGradient>'
   +'<clipPath id="'+id+'-tongue-clip"><path class="kp141-tongue-clip" d="'+td+'"/></clipPath>'
   +'<marker id="'+id+'-arrow" markerWidth="5" markerHeight="5" refX="4.4" refY="2.5" orient="auto"><path d="M.2 .6 L4.4 2.5 L.2 4.4" fill="none" stroke="#4d9580" stroke-width="1.25" stroke-linejoin="round"/></marker></defs>'
   +'<rect x="1" y="1" width="258" height="184" rx="18" fill="#fff9f1"/>'
   +'<rect x="12" y="10" width="53" height="21" rx="10.5" fill="#f3eadf"/><text x="38.5" y="24" text-anchor="middle" font-size="11.5" fill="#7c786e">横から</text>'
   +'<text x="226" y="24" text-anchor="middle" font-size="11" fill="#89857c">奥</text>'
   +'<g class="kp141-anatomy" transform="translate(11 30) scale(1.15 .73)">'
   +'<path d="M201 44 C168 17 123 9 82 19 C64 21 50 30 43 44 L26 51 Q22 54 26 58 Q33 62 41 58 C43 60 43 62 43 64 L43 116 C46 130 58 142 86 147 Q143 159 194 143 L201 44 Z" fill="url(#'+id+'-skin)"/>'
   +'<path d="M201 44 C168 17 123 9 82 19 C64 21 50 30 43 44 L26 51 Q22 54 26 58 Q33 62 41 58 Q43 61 43 64" fill="none" stroke="#cbaa91" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>'
   +'<path d="M201 44 Q202 88 194 143" fill="none" stroke="#d3b49b" stroke-width="1.1" opacity=".7"/>'
   +'<path d="M43 116 C46 130 58 142 86 147 Q143 159 194 143" fill="none" stroke="#cbaa91" stroke-width="1.3" stroke-linecap="round"/>'
   +'<path d="M48 33 Q45 42 34 51" fill="none" stroke="#fffdf6" stroke-width="2.2" opacity=".62" stroke-linecap="round"/>'
   +'<ellipse cx="34" cy="55" rx="3.9" ry="1.8" fill="#a9856c" opacity=".5" transform="rotate(-10 34 55)"/>'
   +'<path d="M32 52 Q66 23 112 19 Q162 17 189 34 Q203 45 202 67 L195 114 L181 116 L186 65 Q187 52 178 45 Q151 34 113 35 Q70 33 39 59Z" fill="#f4f0e2" stroke="#dcccb7" stroke-width=".8"/>'
   +'<path class="kp141-nasal-wash" d="M188 114 Q196 91 192 64 Q193 44 181 34 Q152 24 115 28 Q67 27 31 53" fill="none" stroke="#afd0bd" stroke-width="8" stroke-linecap="round" opacity="'+(s.nasal*.25)+'"/>'
   +'<path d="M54 62 Q71 44 98 39 Q126 33 150 47 Q178 45 188 74 L193 131 Q143 153 64 129 Q53 122 54 111Z" fill="url(#'+id+'-cavity)"/>'
   +'<text x="108" y="14" text-anchor="middle" font-size="10.5" fill="#7c8c78">鼻腔</text>'
   +'<path d="'+palatePath(54,136)+'" fill="none" stroke="#b89b83" stroke-width="4.5" stroke-linecap="round"/>'
   +'<path class="kp139-velum" d="'+velumPath(s)+'" fill="none" stroke="#b89b83" stroke-width="4.5" stroke-linecap="round"/>'
   +'<path d="M44 117 C68 140 114 150 178 144" fill="none" stroke="#d1ae92" stroke-width="3.5" stroke-linecap="round"/>'
   +'<path d="M43 59 Q48 59 54 62 L54 68 L43 68Z" fill="#e8c4af"/>'
   +'<path d="M44 64 Q49 62 54 65 L54 77 Q53 81 49 80 L43 78 Q42 75 43 64Z" fill="url(#'+id+'-teeth)" stroke="#cfc4b2" stroke-width="1"/>'
   +'<g class="kp145-lower-incisors" transform="translate(0 '+Math.min(0,(s.aperture-20)*.4)+')"><path d="M43 109 Q47 104 54 104 L57 118 Q59 122 63 125 Q51 125 43 117Z" fill="#e8c4af"/>'
   +'<path d="M44 105 Q49 101 54 104 L55 115 Q52 119 44 115Z" fill="url(#'+id+'-teeth)" stroke="#cfc4b2" stroke-width="1"/></g>'
   +'<path class="kp139-tongue" d="'+td+'" fill="url(#'+id+'-tongue)" stroke="#bb8175" stroke-width="1.1" stroke-linejoin="round"/>'
   +'<g clip-path="url(#'+id+'-tongue-clip)"><path d="M62 130 Q109 150 182 144 L187 162 H47Z" fill="#9e695e" opacity=".11"/><path d="M83 123 Q120 139 157 132" fill="none" stroke="#ffdcca" stroke-width="9" stroke-linecap="round" opacity=".1"/></g>'
   +'<path class="kp140-tongue-edge" d="'+topPath(s.tongue)+'" fill="none" stroke="#ffdfce" stroke-width="2.2" opacity=".72" stroke-linecap="round"/>'
   +'<path class="kp139-lip-upper" d="'+lp[0]+'" fill="none" stroke="#c88a7d" stroke-width="4.3" stroke-linecap="round"/><path class="kp139-lip-lower" d="'+lp[1]+'" fill="none" stroke="#c88a7d" stroke-width="4.3" stroke-linecap="round"/>'
   +'<ellipse class="kp139-contact" cx="'+contact[0]+'" cy="'+contact[1]+'" rx="5.3" ry="2.2" fill="#5e9e7d" opacity="'+(s.marker?s.contact*.85:0)+'"/>'
   +'<path class="kp141-oral-inner" d="'+oralPath(s)+'" fill="none" stroke="#5b9d87" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>'
   +'<path class="kp139-oral" d="M38 88 H13" fill="none" stroke="#4d9580" stroke-width="1.8" stroke-linecap="round" marker-end="url(#'+id+'-arrow)" opacity="'+(s.oral*.8)+'"/>'
   +'<path class="kp139-nasal" d="'+nasalPath()+'" fill="none" stroke="#4d9580" stroke-width="2" stroke-linecap="round" marker-end="url(#'+id+'-arrow)" opacity="'+(s.nasal*.85)+'"/>'
   +'</g>'
   +(key==='l'?'<g class="kp139-lateral" opacity="'+s.lateral+'"><rect x="175" y="101" width="71" height="58" rx="12" fill="#fffcf6" stroke="#dbcbb8"/><text x="210" y="115" text-anchor="middle" fill="#7a7c6b" font-size="10">上から</text><path d="M185 146 Q176 123 210 120 Q244 123 236 146" fill="none" stroke="#ccb399" stroke-width="3"/><path d="M201 153 L201 130 Q210 123 219 130 L219 153Z" fill="#d79d8a" stroke="#b97f6f" stroke-width="1"/><path d="M192 149 Q185 137 193 129 M228 149 Q235 137 227 129" fill="none" stroke="#4d9580" stroke-width="1.7" marker-end="url(#'+id+'-arrow)"/></g>':'')
   +'<circle cx="19" cy="170" r="3.5" fill="#5e9e7d"/><text x="29" y="174" font-size="12" fill="#758773">接触</text><path d="M81 170 H94" fill="none" stroke="#4d9580" stroke-width="1.4" marker-end="url(#'+id+'-arrow)"/><text x="103" y="174" font-size="12" fill="#758773">息</text>'
   +'<text class="kp139-label" x="231" y="174" text-anchor="end" font-size="12" fill="#53795f">'+esc(route(s,key))+'</text></svg>';
 }
 function seek(svg,f,flow){var key=svg.dataset.kp139Key,s=model(key,f),lp=lipPaths(s),td=tonguePath(s.tongue);svg.dataset.motionPhase=String(s.stage);svg.querySelector('.kp145-lower-incisors').setAttribute('transform','translate(0 '+Math.min(0,(s.aperture-20)*.4)+')');svg.querySelector('.kp139-tongue').setAttribute('d',td);svg.querySelector('.kp141-tongue-clip').setAttribute('d',td);svg.querySelector('.kp140-tongue-edge').setAttribute('d',topPath(s.tongue));svg.querySelector('.kp139-lip-upper').setAttribute('d',lp[0]);svg.querySelector('.kp139-lip-lower').setAttribute('d',lp[1]);var oral=svg.querySelector('.kp139-oral'),allowed=flow!==false;oral.setAttribute('opacity',String(allowed?s.oral*.85:0));oral.setAttribute('stroke-width',s.aspirated?'2.9':'1.8');oral.setAttribute('d',s.aspirated?'M38 88 Q23 83 9 87':'M38 88 H13');var inner=svg.querySelector('.kp141-oral-inner');inner.setAttribute('d',oralPath(s));inner.setAttribute('opacity',String(allowed&&s.oral>.05&&key!=='f'&&key!=='l'?s.oral*.45:0));svg.querySelector('.kp139-nasal').setAttribute('opacity',String(allowed?s.nasal*.85:0));svg.querySelector('.kp141-nasal-wash').setAttribute('opacity',String(s.velum*.25));svg.querySelector('.kp139-velum').setAttribute('d',velumPath(s));var marker=svg.querySelector('.kp139-contact');marker.setAttribute('opacity',String(s.marker?s.contact*.85:0));svg.querySelector('.kp139-label').textContent=route(s,key);var side=svg.querySelector('.kp139-lateral');if(side)side.setAttribute('opacity',String(allowed?s.lateral:0));}
 function audioFraction(a){var path=new URL(a.currentSrc||a.src,document.baseURI).pathname,idx=path.indexOf('/assets/'),key=idx<0?'':path.slice(idx+1),w=window.KP139_AUDIO_WINDOWS&&window.KP139_AUDIO_WINDOWS[key];return w?clamp((a.currentTime-w[0])/(w[1]-w[0])):a.duration>0?clamp(a.currentTime/a.duration):0}
 window.KP139={referenceFrame:referenceFrame,audioFraction:audioFraction,mechanism:mechanism,seek:seek,model:model,hasMotion:hasMotion,palate:palate,surface:surface,label:label,steps:steps};
})();
