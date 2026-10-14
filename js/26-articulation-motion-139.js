/* 10.108.139 — qualitative articulation sequences, with bounded local deformation.
 * Sources: TUFS practical 1.4–1.11; USTS language training IV; SBS phonetics.
 * Coordinates illustrate places and order, not measured vocal-tract anatomy.
 */
(function(){
  'use strict';
  var data=window.KP134_DATA,serial=0;
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function clamp(x){return Math.max(0,Math.min(1,x))}
  function mix(a,b,t){return a.map(function(v,i){return v+(b[i]-v)*t})}
  function smooth(t){t=clamp(t);return t*t*(3-2*t)}
  // Four cubic segments: blade, anterior body, posterior body, fixed root/base.
  // The anterior edge remains at the lower incisors for palatals and ng endings.
  var shapes={
    a:[54,108, 65,106,75,110,89,112, 104,113,120,110,135,109, 151,108,165,115,173,125],
    ae:[54,106, 63,103,75,96,88,95, 103,94,119,100,135,105, 151,111,165,119,173,125],
    frontmid:[54,106, 64,104,70,86,82,78, 98,68,114,73,131,87, 147,101,164,117,173,125],
    schwa:[54,107, 66,106,78,97,91,93, 106,87,123,87,137,94, 153,102,166,115,173,125],
    e:[54,107, 66,107,78,106,91,98, 108,88,122,78,138,77, 154,77,166,104,173,125],
    o:[54,107, 66,107,78,106,91,99, 108,91,123,81,138,81, 154,81,166,105,173,125],
    i:[54,106, 61,106,64,75,77,61, 91,49,108,53,124,67, 143,82,162,107,173,125],
    u:[54,107, 66,107,79,106,94,96, 113,82,132,59,148,59, 163,59,169,98,173,125],
    n:[60,55, 70,52,81,55,91,67, 102,81,120,89,136,100, 153,109,165,119,173,125],
    ni:[60,55, 67,52,73,53,81,57, 97,57,113,65,129,80, 147,95,163,115,173,125],
    ng:[54,108, 66,108,80,110,94,104, 112,96,133,67,151,51, 161,48,169,54,173,63],
    ngi:[54,106, 61,106,65,75,77,61, 96,50,117,58,136,55, 152,48,165,48,173,63],
    ngmid:[54,107, 66,107,78,99,91,91, 110,81,134,62,151,51, 161,48,169,54,173,63],
    palatal:[54,106, 61,106,65,70,78,53, 90,41,103,43,117,55, 138,73,161,105,173,125],
    palatalGap:[54,106, 61,106,65,74,78,58, 90,47,103,49,117,60, 138,78,161,107,173,125],
    dental:[52,61, 60,58,70,70,81,79, 98,93,120,97,137,104, 153,111,165,121,173,125],
    dentalGap:[52,67, 60,64,70,73,81,81, 98,93,120,97,137,104, 153,111,165,121,173,125],
    retro:[74,48, 80,45,87,46,93,56, 101,73,112,83,128,95, 146,106,163,118,173,125],
    retroGap:[74,57, 80,53,87,55,93,65, 101,77,112,84,128,95, 146,106,163,118,173,125]
  };
  shapes['ü']=shapes.i;shapes['ê']=shapes.ae;
  var components={ai:['a','i'],ei:['frontmid','i'],ui:['u','frontmid','i'],ao:['a','u'],ou:['o','u'],iu:['i','o','u'],ie:['i','ae'],'üe':['ü','ae']};
  var labels={a:'舌を低く保つ',o:'舌は奥寄り・唇は丸く',e:'舌は奥寄り・唇は丸めない',i:'舌の前面を高く・接触しない',u:'舌の奥を高く・唇を丸める','ü':'舌は前・高く、唇は丸く',ai:'低い舌から、前・上へ滑る',ei:'前寄りの中間位から、前・上へ',ui:'奥の高い位置から、前へ滑る',ao:'低い位置から、奥・上の方向へ',ou:'奥寄りの舌を少し高く',iu:'前から奥へ・途中で少し下がる',ie:'前の高い舌が、少し下がる','üe':'前寄りのまま、舌を少し下げる',er:'舌の前部を軽く反らし、保つ'};
  function tonguePath(p){var f=function(n){return Number(n.toFixed(2))};return 'M'+f(p[0])+' '+f(p[1])+' C'+p.slice(2,8).map(f).join(' ')+' C'+p.slice(8,14).map(f).join(' ')+' C'+p.slice(14,20).map(f).join(' ')+' L175 135 C143 145 91 140 57 122 Q48 116 '+f(p[0])+' '+f(p[1])+' Z'}
  function nasalFinal(key){return /^(an|en|in|un|ün|ang|eng|ing|ong)$/.test(key)}
  function posture(key){return shapes[key]||shapes.schwa}
  function model(key,f){
    f=clamp(f);var d=data[key]||{kind:'vowel',mechanism:'front-mid'},m=d.mechanism||'',p=posture(key),oral=1,nasal=0,lip=0,contact=0,voice=1,marker=null,stage=f<.2?0:f<.8?1:2;
    var initial=d.kind==='initial',nf=nasalFinal(key),comp=components[key];
    if(comp){
      var end=posture(comp[comp.length-1]),start=posture(comp[0]);
      // Offglides move toward a high vowel, without forcing the full isolated vowel.
      if(/^(ai|ei|ao|ou)$/.test(key))end=mix(start,end,.78);
      if(comp.length===3){var mid=posture(comp[1]);p=f<.42?mix(start,mid,smooth(f/.42)):mix(mid,end,smooth((f-.42)/.48));stage=f<.27?0:f<.67?1:2}
      else{p=mix(start,end,smooth((f-.12)/.72));stage=f<.22?0:f<.74?1:2}
    }else if(nf){
      var ng=/ng$/.test(key),high=/^(in|ün|ing)$/.test(key),startKey=/^(an|ang)$/.test(key)?'a':/^(en|eng)$/.test(key)?'schwa':/^(in|ing)$/.test(key)?'i':key==='ün'?'ü':'u';
      var start=posture(startKey),end=ng?(high?shapes.ngi:key==='ang'?shapes.ng:shapes.ngmid):(high?shapes.ni:shapes.n);
      // un = uen: the short central nucleus precedes the anterior closure.
      var t=smooth((f-.34)/.48);if(key==='un'&&f<.4)p=mix(start,shapes.schwa,smooth(f/.4));else p=mix(key==='un'?shapes.schwa:start,end,t);
      nasal=smooth((f-.46)/.34);oral=1-nasal;contact=t;marker=ng?[155,51]:[63,55];stage=f<.34?0:f<.78?1:2;
    }else if(initial){
      var release=smooth((f-.13)/.18),vowel=smooth((f-.34)/.32),finish=shapes.e;
      if(/bilabial/.test(m)){p=shapes.o;lip=1-release;if(key==='m'){lip=1-smooth((f-.35)/.23);nasal=1-smooth((f-.36)/.24);oral=1-nasal;voice=1}else{oral=release;voice=smooth((f-(d.aspirated?.32:.22))/.1)}marker=[34,89];contact=lip}
      else if(m==='labiodental'){p=shapes.o;lip=2*(1-smooth((f-.35)/.24));oral=1;voice=vowel;marker=[42,77];contact=1-vowel}
      else if(/^alveolar/.test(m)||m==='lateral'){
        var r=(key==='n'||key==='l')?smooth((f-.42)/.23):release;
        p=mix(shapes.n,finish,r);contact=1-r;marker=[63,55];
        if(key==='n'){nasal=1-r;oral=r}else if(key==='l'){oral=r}else{oral=release;voice=smooth((f-(d.aspirated?.32:.22))/.1)}
      }else if(/^velar/.test(m)){var closed=m==='velar-stop';p=mix(closed?shapes.ngmid:mix(shapes.ngmid,shapes.e,.22),finish,closed?release:vowel);marker=[155,51];contact=closed?1-release:.3;oral=closed?release:1;voice=closed?smooth((f-(d.aspirated?.32:.22))/.1):vowel}
      else if(/^palatal/.test(m)){var aff=/affricate/.test(m);p=aff?mix(shapes.palatal,shapes.palatalGap,release):shapes.palatalGap;p=mix(p,shapes.i,vowel);marker=[90,47];contact=aff?1-release:.3;oral=aff?release:1;voice=vowel}
      else if(/^dental/.test(m)){var aff=/affricate/.test(m);p=aff?mix(shapes.dental,shapes.dentalGap,release):shapes.dentalGap;marker=[54,60];contact=aff?1-release:.3;oral=aff?release:1;voice=vowel}
      else if(/^retroflex/.test(m)){var aff=/affricate/.test(m);p=aff?mix(shapes.retro,shapes.retroGap,release):shapes.retroGap;marker=[80,47];contact=aff?1-release:.3;oral=aff?release:1;voice=key==='r'?1:vowel}
      stage=f<.16?0:f<.58?1:2;
    }else if(key==='er'){p=shapes.retroGap;marker=[80,47]}
    var rounded={o:1,u:1,'ü':1,ong:1,'ün':1};var round=rounded[key]||0;
    if(comp){var pp=data[key].poses,t=f<.4&&pp.length===3?f/.4:pp.length===3?(f-.4)/.5:f/.85;var a=pp.length===3&&f>=.4?1:0,b=Math.min(a+1,pp.length-1);round=pp[a][2]+(pp[b][2]-pp[a][2])*clamp(t)}
    if(key==='un')round=1-smooth(f/.52);if(/bilabial|labiodental/.test(m))round=smooth((f-.34)/.32);
    // No airflow is shown at rest or after the utterance ends.
    var flow=f>0&&f<1?1:0;
    return {tongue:p,oral:oral*flow,nasal:nasal*flow,voice:voice*flow,lip:lip,round:round,contact:contact,marker:marker,stage:stage,lateral:key==='l'?(1-smooth((f-.42)/.23))*flow:0,aspirated:!!d.aspirated&&f>.15&&f<.42};
  }
  function lipPaths(s){
    var a=1-clamp(s.lip),r=s.round,tip=34-r*6,upper=79-a*9,lower=80+a*21;
    if(s.lip>1){var t=clamp(s.lip-1);lower=lower+(77-lower)*t;tip=tip+(43-tip)*t}
    return ['M43 64 Q37 69 '+tip+' '+(upper-2)+' Q'+(tip-3)+' '+upper+' 43 '+upper,'M43 116 Q37 111 '+tip+' '+(lower+2)+' Q'+(tip-3)+' '+lower+' 43 '+lower];
  }
  function label(key,s){if(labels[key])return labels[key];if(nasalFinal(key))return /ng$/.test(key)?(s.stage===0?'舌先は低く、母音から':s.stage===1?'舌の後ろを軟口蓋へ':'奥で閉じ、鼻に響かせて終わる'):(s.stage===0?'母音の構えから':s.stage===1?'舌の前部が上がり、鼻へ':'前で収める・母音を足さない');var d=data[key];if(!d)return '舌の構え';if(key==='l')return s.stage<2?'舌先をつけ、両側に声を通す':'舌先を離し、母音へ';if(key==='m'||key==='n')return s.stage<2?'口を閉鎖し、鼻に声を通す':'閉鎖をほどいて、母音へ';return d.phase[s.stage]}
  function mechanism(key,id){
    id=(id||'kp139-'+(++serial)).replace(/[^a-zA-Z0-9_-]/g,'');var s=model(key,0),lp=lipPaths(s),d=data[key]||{},m=d.mechanism||'';
    return '<svg class="kp134-position kp139-position" data-kp139-key="'+esc(key)+'" viewBox="0 0 220 176" role="img" aria-label="'+esc(key)+' の舌と息の順序を示す模式図"><defs><linearGradient id="'+id+'-tongue" x2="0.3" y2="1"><stop stop-color="#e7b3a4"/><stop offset=".5" stop-color="#d78f85"/><stop offset="1" stop-color="#be7771"/></linearGradient><linearGradient id="'+id+'-skin" x2="0" y2="1"><stop stop-color="#fff8f0"/><stop offset="1" stop-color="#f1dfce"/></linearGradient><marker id="'+id+'-oral" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 .5 L4 2.5 L0 4.5" fill="none" stroke="#639caf" stroke-width="1.2"/></marker><marker id="'+id+'-nasal" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 .5 L4 2.5 L0 4.5" fill="none" stroke="#4e9b7e" stroke-width="1.2"/></marker></defs><rect x="1" y="1" width="218" height="174" rx="22" fill="#fff8f1"/>'
      +'<text x="44" y="16" fill="#8c887d" font-size="10">前</text><text x="169" y="16" fill="#8c887d" font-size="10">奥</text>'
      +'<path d="M43 64 Q53 37 85 27 Q139 12 180 45 L184 127 Q148 154 94 144 Q54 139 43 116" fill="url(#'+id+'-skin)" stroke="#d6b6a0" stroke-width="1.5"/>'
      +'<path d="M56 35 Q47 37 42 44 L28 51 Q24 55 32 57 L43 59 L43 64" fill="#f8ecdd" stroke="#d6b6a0" stroke-width="1.5" stroke-linejoin="round"/>'
      +'<path d="M43 53 Q59 32 95 26 Q140 19 173 42 L173 49 Q140 33 105 37 Q67 39 49 60" fill="#f5ebe1" stroke="#e5d2be" stroke-width="1"/>'
      +'<path d="M48 64 Q67 47 94 44 Q139 36 168 54" fill="none" stroke="#bfa08a" stroke-width="4" stroke-linecap="round"/>'
      +'<path class="kp139-velum" d="M168 54 Q179 59 178 70" fill="none" stroke="#bd9986" stroke-width="4" stroke-linecap="round"/>'
      +'<path d="M44 117 Q90 146 175 135" fill="none" stroke="#d4ae97" stroke-width="3"/>'
      +'<rect x="43" y="64" width="9" height="16" rx="3" fill="#fffef8" stroke="#d8cbbb"/><rect x="43" y="103" width="9" height="14" rx="3" fill="#fffef8" stroke="#d8cbbb"/>'
      +'<path class="kp139-tongue" d="'+tonguePath(s.tongue)+'" fill="url(#'+id+'-tongue)" stroke="#bc7d73" stroke-width="1.2" stroke-linejoin="round"/>'
      +'<path class="kp139-lip-upper" d="'+lp[0]+'" fill="none" stroke="#c18b81" stroke-width="4.5" stroke-linecap="round"/><path class="kp139-lip-lower" d="'+lp[1]+'" fill="none" stroke="#c18b81" stroke-width="4.5" stroke-linecap="round"/>'
      +'<ellipse class="kp139-contact" cx="'+(s.marker?s.marker[0]:63)+'" cy="'+(s.marker?s.marker[1]:55)+'" rx="8" ry="3" fill="#78b89d" opacity="'+(s.marker?.5:0)+'"/>'
      +'<path class="kp139-oral" d="M41 88 H17" fill="none" stroke="#639caf" stroke-width="1.8" stroke-linecap="round" marker-end="url(#'+id+'-oral)" opacity="0"/>'
      +'<path class="kp139-nasal" d="M178 84 Q180 50 165 39 Q125 22 75 38 Q51 42 31 52" fill="none" stroke="#4e9b7e" stroke-width="2" stroke-linecap="round" marker-end="url(#'+id+'-nasal)" opacity="0"/>'
      +'<path class="kp139-voice" d="M196 108 Q192 111 196 114 Q200 117 196 120" fill="none" stroke="#b19ab6" stroke-width="1.8" opacity="0"/>'
      +(key==='l'?'<g class="kp139-lateral" opacity="0"><rect x="153" y="69" width="59" height="36" rx="10" fill="#fffdf7" stroke="#dfd9cb"/><path d="M178 98 L178 79 Q183 73 188 79 L188 98" fill="#da9b8e"/><path d="M168 96 V79 M198 96 V79" stroke="#639caf" stroke-width="1.5" marker-end="url(#'+id+'-oral)"/><text x="183" y="112" text-anchor="middle" font-size="9" fill="#76897e">上から・両側</text></g>':'')
      +'<text class="kp139-label" x="110" y="164" text-anchor="middle" font-size="10.5" fill="#5e7c6c">'+esc(label(key,s))+'</text></svg>';
  }
  function seek(svg,f){var key=svg.dataset.kp139Key,s=model(key,f),lp=lipPaths(s);svg.dataset.motionPhase=String(s.stage);svg.querySelector('.kp139-tongue').setAttribute('d',tonguePath(s.tongue));svg.querySelector('.kp139-lip-upper').setAttribute('d',lp[0]);svg.querySelector('.kp139-lip-lower').setAttribute('d',lp[1]);var oral=svg.querySelector('.kp139-oral');oral.setAttribute('opacity',String(s.oral*.8));oral.setAttribute('stroke-width',s.aspirated?'2.7':'1.5');oral.setAttribute('d',s.aspirated?'M41 88 Q26 84 10 86':'M41 88 H20');svg.querySelector('.kp139-nasal').setAttribute('opacity',String(s.nasal*.8));svg.querySelector('.kp139-velum').setAttribute('d','M168 54 Q179 '+(59+s.nasal*6)+' '+(178-s.nasal*4)+' '+(70+s.nasal*6));svg.querySelector('.kp139-voice').setAttribute('opacity',String(s.voice*.65));var marker=svg.querySelector('.kp139-contact');marker.setAttribute('opacity',String(s.marker?Math.max(.15,s.contact*.55):0));svg.querySelector('.kp139-label').textContent=label(key,s);var side=svg.querySelector('.kp139-lateral');if(side)side.setAttribute('opacity',String(s.lateral));}
  function hasMotion(key){return !!(data[key]&&(data[key].kind==='initial'||nasalFinal(key)||components[key]))}
  function referenceFrame(key){var d=data[key]||{};return d.kind==='initial'?(/nasal|lateral|fricative|voiced|labiodental/.test(d.mechanism)?0.32:0):nasalFinal(key)?1:0.6}
  function audioFraction(a){var path=new URL(a.currentSrc||a.src,document.baseURI).pathname,idx=path.indexOf('/assets/'),key=idx<0?'':path.slice(idx+1),w=window.KP139_AUDIO_WINDOWS&&window.KP139_AUDIO_WINDOWS[key];return w?clamp((a.currentTime-w[0])/(w[1]-w[0])):a.duration>0?clamp(a.currentTime/a.duration):0}
  window.KP139={referenceFrame:referenceFrame,audioFraction:audioFraction,mechanism:mechanism,seek:seek,model:model,hasMotion:hasMotion};
})();
