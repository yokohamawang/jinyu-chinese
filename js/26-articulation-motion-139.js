/* Teaching articulation 10.108.155: source-reviewed qualitative schematics.
 * These schematic drawing coordinates are NOT measurements from an articulatory
 * recording. Source checks support movement type and contact, not these values.
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
 var xs=[54,64,78,96,116,136,154,168,174],roof=[62,52,44,39,39,42,49,54,57],tongueXs=[54,64,78,96,116,136,154,168,186];
 function curve(x,xx,yy){var i=0;while(i<xx.length-2&&x>xx[i+1])i++;var h=xx[i+1]-xx[i],t=clamp((x-xx[i])/h),delta=(yy[i+1]-yy[i])/h;
  function tangent(j){if(j===0)return (yy[1]-yy[0])/(xx[1]-xx[0]);if(j===yy.length-1)return (yy[j]-yy[j-1])/(xx[j]-xx[j-1]);var l=(yy[j]-yy[j-1])/(xx[j]-xx[j-1]),r=(yy[j+1]-yy[j])/(xx[j+1]-xx[j]);return l*r<=0?0:2*l*r/(l+r)}
  var a=tangent(i),b=tangent(i+1);if(delta===0){a=0;b=0}else{var norm=Math.hypot(a/delta,b/delta);if(norm>3){a*=3/norm;b*=3/norm}}
  return (2*t*t*t-3*t*t+1)*yy[i]+(t*t*t-2*t*t+t)*h*a+(-2*t*t*t+3*t*t)*yy[i+1]+(t*t*t-t*t)*h*b;
 }
 function palate(x){return curve(x,xs,roof)}
 function shape(gaps,xx){return (xx||tongueXs).map(function(x,i){return [i===gaps.length-1?186:x,gaps[i]]})}
 var shapes={
  // A vowel tongue body retains volume and a rounded surface; it does not
  // begin as a flat layer on the mouth floor and inflate toward the roof.
  a:shape([42,49,52,48,43,42,45,57,71]),
  aFront:shape([42,49,52,44,47,46,49,60,71]),
  aBack:shape([44,53,56,57,49,38,38,56,71]),
  ae:shape([42,48,43,38,42,48,56,64,71]),
  frontmid:shape([42,47,37,30,36,41,48,62,71]),
  engNucleus:shape([42,49,49,46,39,32,25,45,71]),
  schwa:shape([42,49,48,40,35,37,46,61,71]),
  e:shape([42,49,48,47,40,28,20,42,71]),
  o:shape([42,49,49,47,40,29,23,44,71]),
  i:shape([42,40,18,12,23,32,35,53,71]),
  u:shape([42,48,49,44,31,16,12,35,71]),
  // /ong/ has a rounded near-high nucleus; do not substitute independent u.
  ongNucleus:shape([42,49,50,45,34,23,19,41,71]),
  // Weak offglides have separate contextual targets, not a fixed percentage of a
  // full independent i/u posture. Front/back contour changes can oppose.
  iOff:shape([42,44,31,24,33,43,50,62,71]),
  uOff:shape([42,49,52,47,36,24,34,57,71]),
  n:shape([4,0,0,17,30,43,55,63,71],[59,64,75,96,116,136,154,168,174]),
  ni:shape([3,0,0,10,20,36,51,62,71],[59,64,75,96,116,136,154,168,174]),
  ng:shape([46,54,61,53,35,12,0,18,71]),
  ngi:shape([44,42,16,13,12,5,0,18,71]),
  ngmid:shape([45,54,53,48,41,26,12,26,71]),
  // MRI comparison of s/sh/x requires an anterior blade constriction for x
  // together with a broader palatal approximation behind it. One posterior
  // point at the palate apex cannot represent the whole gesture.
  palatal:shape([42,24,0,0,7,30,49,62,71]),
  palatalGap:shape([42,27,3,6,10,31,49,62,71]),
  // Dental initials meet the BACK of the upper incisors, anterior to d/t/n/l.
  dental:shape([8,20,27,39,45,51,57,64,71],[54,60,64,96,116,136,154,168,174]),
  dentalGap:shape([12,22,29,40,46,52,58,64,71],[57,63,70,96,116,136,154,168,174]),
  // Apical teaching variant: the free tip itself rises to the postalveolar
  // region. Keep the blade lower behind it, showing actual retroflexion rather
  // than confusing a bunched anterior dorsum with a curled tip.
  retro:shape([0,0,14,27,38,45,55,65,71],[75,81,91,105,122,141,158,173,186]),
  retroGap:shape([3,4,17,29,39,45,55,65,71],[75,81,91,105,122,141,158,173,186])
 };
 shapes.nGap=shape([9,5,5,19,30,43,55,63,71],[59,64,75,96,116,136,154,168,174]);// Velar constriction is a local posterior gesture, not a high mid-tongue
 // plateau. Preserve the low passive tip and the carrier's middle contour.
 // g/k still meet the soft palate; h retains an open dorsal constriction.
 shapes.velarClosed=shape([42,49,48,45,34,14,0,18,71]);shapes.velarGap=shape([42,49,48,45,34,18,7,24,71]);shapes.velarFricative=shape([42,49,48,45,34,18,7,24,71]);
 shapes.retroVowel=shape([10,12,22,31,39,45,55,65,71],[75,81,91,105,122,141,158,173,186]);shapes.retroApprox=shape([8,10,21,31,39,45,55,65,71],[75,81,91,105,122,141,158,173,186]);
 shapes.dentalVowel=shape([15,24,31,40,46,52,58,64,71],[57,63,70,96,116,136,154,168,186]);
 // Rhotic vowel: raised tip without the narrow fricative constriction of sh.
 shapes.rhotic=shape([12,17,25,32,35,39,46,58,71],[80,88,99,112,127,143,157,170,174]);
 // er teaching onset: local anterior rise; the posterior tongue stays stable.
 shapes.rhoticReady=shape([26,28,31,35,36,39,46,58,71],[72,81,94,109,126,143,157,170,186]);
 shapes['ü']=shapes.i;
 function motionFraction(key,f){if(/^(ai|ei|ao|ou)$/.test(key))return smooth((f-.35)/.55);if(/^(ie|üe)$/.test(key))return smooth(f/.45);if(key==='ui'||key==='iu')return curve(clamp(f),[0,.20,.72,1],[0,.42,.57,1]);if(components[key])return smooth(f);if(nasalFinal(key))return key==='un'?smooth(f/.35):smooth((f-.35)/.45);return smooth((f-.14)/.64)}
 function score(key){return window.KP151_ARTICULATION&&window.KP151_ARTICULATION.profiles[key]}
 function interval(f,r){return smooth((f-r[0])/(r[1]-r[0]))}
 function releaseFraction(key,f){var q=score(key);return interval(f,q?q.release:[.24,.40])}
 function carrierFraction(key,f){var q=score(key);return data[key]&&data[key].kind==='initial'?interval(f,q?q.carrier:[.38,.70]):0}
 function stepIndex(key,f){var q=score(key);if(!q)return model(key,f).stage;if(q.frames.length===4)return f<q.release[0]?0:f<q.aspiration[0]?1:f<q.carrier[0]?2:3;var onset=/^(m|n|l)$/.test(key)?.22:/stop|affricate/.test(data[key].mechanism)?q.release[0]:.16;return f<onset?0:f<q.carrier[0]?1:2}
 function lipPose(d,f){var p=d.poses||[[64,19,0]],seq,times;if(components[d.key]||nasalFinal(d.key)){var knots=p.length===3?[0,.48,1]:[0,1],g=motionFraction(d.key,f);return p[0].map(function(_,j){return curve(g,knots,p.map(function(v){return v[j]}))})}if(d.kind==='initial'){var g=carrierFraction(d.key,f),start=p[0],released=p[Math.min(1,p.length-1)],r=releaseFraction(d.key,f),held=start.map(function(v,j){return v+(released[j]-v)*r});return held.map(function(v,j){return v+(p[p.length-1][j]-v)*g})}else if(p.length===3){seq=[p[0],p[1],p[2],p[2]];times=[0,.38,.78,1]}else{seq=[p[0],p[0],p[p.length-1],p[p.length-1]];times=[0,.14,.78,1]}var i=0;while(i<times.length-2&&f>times[i+1])i++;var t=clamp((f-times[i])/(times[i+1]-times[i]));return seq[i].map(function(n,j){return n+(seq[i+1][j]-n)*t})}

 var components={ai:['aFront','iOff'],ei:['frontmid','iOff'],ui:['u','frontmid','iOff'],ao:['aBack','uOff'],ou:['o','uOff'],iu:['i','o','uOff'],ie:['i','ae'],'üe':['ü','ae']};
 function glide(parts,f,key){
  var frames=parts.map(posture),times=parts.length===3?[0,.48,1]:[0,1],t=motionFraction(key,f);
  // Continuous per-region trajectories. A three-part final is not rendered
  // as two independent stop/start transitions at its middle vowel.
  return frames[0].map(function(p,i){return [p[0],curve(t,times,frames.map(function(v){return v[i][1]}))]});
 }
 function nasalTarget(start,back){
  if(back){
   var travel=surface(start,154)-ceiling(154,{velum:1});
   return start.map(function(p){var x=p[0],w=Math.exp(-.5*Math.pow((x-154)/20,2));if(x<=96||x===186)w=0;
    // The contact is tangent, not an intersection with the descending velum.
    // Keep a local minimum at its contact point; adjacent dorsum stays clear.
    return [x,Math.max(x===136?17:x>=136?ceiling(x,{velum:1})-palate(x):4,p[1]-travel*w)];
   });
  }
  var xx=[59,64,75,96,116,136,154,168,186],height=surface(start,64)-palate(64);
  return xx.map(function(x,i){var gap=surface(start,x)-palate(x);return [x,i===0?4:i<3?0:x<=116?Math.max(12,gap-height*Math.exp(-.5*Math.pow((x-64)/22,2))):gap]});
 }
 // The hard/soft junction is fixed. The anterior contact region moves only
 // slightly; posterior lowering opens the nasal port without a sweeping flap.
 // The tongue supplies the ng closure; velum lowering supplies nasal access.
 // This is a qualitative schematic, not a measured displacement.
 // A lowered velum is a moving soft boundary, unlike the fixed hard palate.
 // The amount here remains a drawing parameter and is not a calibrated physiological measurement.
 // Keep the 149 anatomical boundary. Beyond x=158 use the actual displayed
 // soft-palate curve, rather than a different invisible ceiling for airflow.
 function velumEnd(s){var n=s.velum||0;return [198-8*n,43+18*n]}
 function ceiling(x,s){var n=s.velum||0;if(x<=158)return palate(x)+2*n*smooth((x-136)/18);var lo=0,hi=1,t=0,x0=158,cx=177-1*n,ex=velumEnd(s)[0];if(x>=ex)return velumEnd(s)[1];for(var i=0;i<20;i++){t=(lo+hi)/2;var px=(1-t)*(1-t)*x0+2*(1-t)*t*cx+t*t*ex;if(px<x)lo=t;else hi=t}return (1-t)*(1-t)*(palate(158)+2*n)+2*(1-t)*t*(49+8*n)+t*t*velumEnd(s)[1]}

 var labels={a:'舌を低く保つ',o:'舌は奥寄り・唇は丸く',e:'舌は奥寄り・唇は丸めない',i:'舌の前面を高く・触れない',u:'舌の奥を高く・唇を丸く','ü':'舌は前・高く、唇は丸く',ai:'低い位置から、前・上の方向へ',ei:'前寄りから、さらに前・上へ',ui:'奥から前へ・一息でつなぐ',ao:'低い位置から、奥・上の方向へ',ou:'奥寄りの舌を少し高く',iu:'前から奥へ・一息でつなぐ',ie:'前の高い舌を、下げていく','üe':'前寄りの舌を、下げていく',er:'舌先を軽く上げる・触れない'};
 function nasalFinal(key){return /^(an|en|in|un|ün|ang|eng|ing|ong)$/.test(key)}
 function posture(key){return shapes[key]||shapes.schwa}
 function model(key,f){
  f=clamp(f);var d=data[key]||{},m=d.mechanism||'',initial=d.kind==='initial',nf=nasalFinal(key),comp=components[key],p=posture(key),oral=1,nasal=0,lip=0,dental=0,contact=0,voice=1,marker=null,lateral=0,stage=f<.22?0:f<.78?1:2;
  var release=releaseFraction(key,f),asp=false,aspLevel=0,q=score(key),event=null;
  if(comp){
   p=glide(comp,f,key);stage=/^(ai|ei|ao|ou)$/.test(key)?(f<.35?0:f<.9?1:2):/^(ie|üe)$/.test(key)?(f<.12?0:f<.9?1:2):(f<.25?0:f<.75?1:2);
  }else if(nf){
   var ng=/ng$/.test(key),startKey=key==='an'?'aFront':key==='ang'?'aBack':key==='en'?'schwa':key==='eng'?'engNucleus':key==='ong'?'ongNucleus':/^(in|ing)$/.test(key)?'i':key==='ün'?'ü':'u';
   var start=posture(startKey),base=key==='un'?shapes.schwa:start,end=nasalTarget(base,ng);
   var t=smooth((f-.35)/.45);if(key==='un'&&f<.35)p=mix(start,shapes.schwa,smooth(f/.35));else p=mix(base,end,t);
   nasal=smooth((f-.53)/.27);oral=1-nasal;contact=t>=.999999?1:0;marker=ng?[154,ceiling(154,{velum:nasal})]:[64,palate(64)];stage=f<.35?0:f<.8?1:2;
  }else if(initial){
   // Establish the consonant contact, then connect to the recorded carrier.
   // Timing is a qualitative teaching sequence, not measured segmentation.
   voice=/^(m|n|l|r)$/.test(key)?1:0;
   if(/bilabial/.test(m)){
    p=shapes.schwa;marker=[34,80];
    if(key==='m'){lip=1;nasal=1;oral=0;contact=1}
    else{lip=1-release;contact=lip;oral=release}
   }else if(m==='labiodental'){p=shapes.schwa;dental=1;marker=[48,80];contact=1;oral=1}
   else if(/^alveolar/.test(m)||m==='lateral'){
    marker=[64,palate(64)];
    if(key==='n'||key==='l'){
     // Small anterior approach, then sustained contact. Root stays still.
     // Nasal/lateral closure is shown separately in the labelled top inset.
     var approach=smooth(f/.22),ready=shapes.n.map(function(v,i){return [v[0],v[1]+(i<3?6:i===3?2:0)]});
     p=mix(ready,shapes.n,approach);contact=approach>.999999?1:0;oral=0;
     if(key==='n')nasal=approach;else lateral=approach;
    }
    else{p=mix(shapes.n,shapes.nGap,release);contact=1-release;oral=release}
   }else if(/^velar/.test(m)){
    var closed=m==='velar-stop';p=closed?mix(shapes.velarClosed,shapes.velarGap,release):shapes.velarFricative;marker=[154,palate(154)];contact=closed&&release===0?1:0;oral=closed?release:1;
   }else if(/^palatal/.test(m)){
    var aff=/affricate/.test(m);p=aff?mix(shapes.palatal,shapes.palatalGap,release):shapes.palatalGap;marker=[78,palate(78)];contact=aff?1-release:0;oral=aff?release:1;
   }else if(/^dental/.test(m)){
    var aff=/affricate/.test(m);p=aff?mix(shapes.dental,shapes.dentalGap,release):shapes.dentalGap;marker=[54,70];contact=aff?1-release:0;oral=aff?release:1;
   }else if(/^retroflex/.test(m)){
    var aff=/affricate/.test(m);p=aff?mix(shapes.retro,shapes.retroGap,release):key==='r'?shapes.retroApprox:shapes.retroGap;marker=[78,palate(78)];contact=aff&&release===0?1:0;oral=aff?release:1;
   }
   // After affrication the constriction opens slightly for aspiration;
   // do not depict the entire aspirated interval as sustained sibilant friction.
   if(q&&q.aspiration&&/affricate/.test(m)){var ag=smooth((f-q.aspiration[0])/.09),open=p.map(function(v,i){return [v[0],v[1]+(i<3?(key==='q'?5:4):i===3?2:0)]});p=mix(p,open,ag)}
   var cg=carrierFraction(key,f),target=d.carrier==='apical'?(/^retroflex/.test(m)?shapes.retroVowel:shapes.dentalVowel):posture(d.carrier);
   // The tongue tip/blade releases its contact into the actual carrier vowel.
   // Lip consonants do not acquire a spurious tongue-palate contact.
   p=mix(p,target,cg);lip*=1-cg;dental*=1-cg;contact*=1-cg;
   nasal*=1-cg;lateral*=1-cg;oral=oral*(1-cg)+cg;
   if(cg>.001)voice=1;
   asp=!!(q&&q.aspiration&&f>q.aspiration[0]&&f<q.aspiration[1]);if(q&&q.aspiration)aspLevel=smooth((f-q.aspiration[0])/.035)*(1-smooth((f-q.aspiration[1]+.035)/.035));
   stage=cg>.001?2:(/stop|affricate/.test(m)?release===0:f<.16)?0:1;
   event=cg>.001?'vowel':/^(m|n|l)$/.test(key)?(f<.22?'approach':key==='l'?'lateral':'nasal'):/stop|affricate/.test(m)&&release===0?'closure':asp?'aspiration':(/affricate|fricative/.test(m)||key==='f')?'frication':key==='r'?'voiced':'release';
  }else if(key==='er'){var rhotic=smooth((f-.08)/.42);p=mix(shapes.rhoticReady,shapes.rhotic,rhotic);stage=f<.14?0:f<.5?1:2}
  // Lip opening/rounding share the front-view keyframes. The jaw is left
  // relaxed: lip closure is not a command to clench the teeth.
  var pose=lipPose(d,f),round=pose[2],aperture=pose[1]*20/34;
  // Flow begins and ends smoothly; a stop has a brief release, while an
  // aspirated partner keeps its breath visible for longer. Tongue travel is
  // the same for the pair. These times describe a teaching sequence only.
  var flowing=smooth(f/.12)*(1-smooth((f-.9)/.1));if(key==='n'||key==='l')flowing*=smooth((f-.22)/.10);
  if(initial&&/stop/.test(m)&&key!=='m'&&carrierFraction(key,f)===0)oral*=1-smooth((f-(d.aspirated?.65:.43))/(d.aspirated?.2:.15));
  else if(initial&&/affricate/.test(m)&&carrierFraction(key,f)===0)oral*=1-smooth((f-.78)/.2);
  
  // The mobile mandibular frame carries the passive low tip and underside.
  // Active coronal contacts stay at the upper articulator; the high dorsum
  // is not lifted wholesale by jaw closure. Angles are drawing parameters.
  var jawAngle=(22*(1-clamp(aperture/20)))/136;p=anteriorWithJaw(p,jawAngle);
  var contactDegree=contact;if(key==='n'||key==='l')contactDegree=smooth(f/.22)*(1-carrierFraction(key,f));if(initial)contact=contact>=.999999?1:0;
  return {contactDegree:contactDegree,aspirationLevel:aspLevel,progress:f,event:event,stepIndex:q?stepIndex(key,f):stage,aperture:aperture,jawAngle:jawAngle,tongue:p,oral:oral*flowing,nasal:nasal*flowing,velum:nasal,voiced:voice>0,voice:voice*flowing,lip:lip,dental:dental,round:round,contact:contact,marker:marker,stage:stage,lateral:lateral*flowing,aspirated:asp};
 }
 function jawPoint(x,y,a){var dx=x-184,dy=y-132;return [184+dx*Math.cos(a)-dy*Math.sin(a),132+dx*Math.sin(a)+dy*Math.cos(a)]}
 function jawTransform(a){return 'rotate('+(a*180/Math.PI)+' 184 132)'}
 function anteriorWithJaw(p,a){return p.map(function(v){var x=v[0],y=palate(x)+v[1],free=clamp((y-80)/24)*smooth((78-x)/24);if(!free)return v.slice();var q=jawPoint(x,y,a*free);return [q[0],q[1]-palate(q[0])]})}
 function surface(p,x){var xx=p.map(function(a){return a[0]}),yy=p.map(function(a){return a[1]});return palate(x)+Math.max(0,curve(x,xx,yy))}
 function topPath(p){var out='';for(var x=p[0][0];x<p[p.length-1][0];x+=1.5)out+=(out?' L':'M')+x.toFixed(2)+' '+surface(p,x).toFixed(2);return out+' L'+p[p.length-1][0]+' 128'}
 function palatePath(from,to){var s='';for(var x=from;x<to;x+=1.5)s+=(s?' L':'M')+x+' '+palate(x).toFixed(2);return s+' L'+to+' '+palate(to).toFixed(2)}
 function velumPath(s){var n=s.velum,out='';for(var x=136;x<158;x+=1.5)out+=(out?' L':'M')+x+' '+ceiling(x,s).toFixed(2);return out+' L158 '+ceiling(158,s).toFixed(2)+' Q'+(177-n)+' '+(49+8*n)+' '+velumEnd(s)[0]+' '+velumEnd(s)[1]}
 function tissueBand(points,width){return points.map(function(p,i){return (i?'L':'M')+p[0].toFixed(2)+' '+(p[1]-width).toFixed(2)}).join(' ')+points.slice().reverse().map(function(p){return 'L'+p[0].toFixed(2)+' '+p[1].toFixed(2)}).join(' ')+'Z'}
 function hardPalateBand(){var pts=[];for(var x=54;x<136;x+=1.5)pts.push([x,palate(x)]);pts.push([136,palate(136)]);return tissueBand(pts,4.4)}
 function softPalateBand(s){var pts=[];for(var x=136;x<158;x+=1.5)pts.push([x,ceiling(x,s)]);var x0=158,y0=ceiling(158,s),cx=177-s.velum,cy=49+8*s.velum,ex=velumEnd(s)[0],ey=velumEnd(s)[1];for(var i=0;i<=16;i++){var t=i/16;pts.push([(1-t)*(1-t)*x0+2*(1-t)*t*cx+t*t*ex,(1-t)*(1-t)*y0+2*(1-t)*t*cy+t*t*ey])}return tissueBand(pts,4)}
 function contactBand(s){var d='',inside=false;if(s.contact<.01)return d;for(var x=Math.max(54,s.tongue[0][0]);x<=158;x+=.6){var y=surface(s.tongue,x),hit=y-ceiling(x,s)<=.9;if(hit)d+=(inside?'L':'M')+x.toFixed(2)+' '+y.toFixed(2);inside=hit}return d}
 function nasalPath(){return 'M188 114 Q196 91 192 64 Q193 44 181 34 Q152 24 115 28 Q67 27 32 60 Q26 68 14 69'}
 function lipPaths(s){var opening=s.aperture,upperTip=34-s.round*5,lowerTip=upperTip,upper=80-opening*.32,lower=80+opening*.68;var contact=s.dental||0;upper-=5*contact;lower=lower+(80-lower)*contact;lowerTip=lowerTip+(48-lowerTip)*contact;return ['M43 64 Q37 71 '+upperTip+' '+(upper-2)+' Q'+(upperTip-2)+' '+upper+' 43 '+upper,'M43 116 Q37 109 '+lowerTip+' '+(lower+2)+' Q'+(lowerTip-2)+' '+lower+' 43 '+lower]}
 function outletY(s){return s.dental?81:80+s.aperture*.18}
 function oralArrow(s){var y=outletY(s),start=28-s.round*4;var a=s.aspirationLevel||0;return 'M'+start+' '+y+' Q18 '+(y-5*a)+' 7 '+(y-a)}
 function label(key,s){
  if(s.event){var retro=/^(zh|ch|sh|r)$/.test(key),velar=/^(g|k|h)$/.test(key);if(s.event==='vowel')return retro?'舌先の構えを残して、声へ':/^(z|c|s)$/.test(key)?'前の構えを残して、声へ':'声母から '+data[key].carrier+' へつなぐ';if(s.event==='closure'&&(retro||velar))return velar?'舌の奥で閉じ、息を止める':'舌の前部で閉じ、息を止める';if(s.event==='aspiration')return retro?'少し開き、息を出す':velar?'奥を離して、息を出す':'開放後に、息を出す';if(s.event==='frication'&&(retro||velar))return velar?'奥のすき間から、息を通す':'舌先のすき間から、息を通す';if(s.event==='release'&&velar)return '舌の奥を小さく離す'}

  if(data[key]&&data[key].kind==='initial'&&s.stage===2)return '声母から '+(data[key].carrier==='apical'?'後ろの母音':data[key].carrier)+' へ、一息でつなぐ';
  if(key==='er')return s.stage===0?'軽く開き、声を出す':s.stage===1?'舌先を少し上・後ろへ':'触れずに、響きを保つ';
  if(labels[key])return labels[key];
  if(nasalFinal(key))return /ng$/.test(key)?(s.stage===0?'母音から・舌先は上げない':s.stage===1?'舌の後部を、軟口蓋へ':'奥で収める・g は足さない'):(s.stage===0?'母音の構えから':s.stage===1?'舌先・前縁を、上の前歯の後ろへ':'前で収める・母音を足さない');
  if(key==='l')return s.stage===0?'舌先を、上の前歯の後ろへ':s.stage===1?'中央は接触・息は舌の両側へ':'舌先を保つ・鼻へは通さない';
  if(key==='n')return s.stage===0?'舌先・前縁を、上の前歯の後ろへ':s.stage===1?'口の通り道を閉じ、鼻へ通す':'接触を保ち、鼻に響かせる';
  if(key==='m')return s.stage<2?'唇を閉じ、鼻に声を通す':'接触を保ち、鼻に響かせる';
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
 function steps(key){var d=data[key];if(!d)return [];if(score(key))return score(key).steps.slice();if(d.kind!=='initial')return d.phase.slice();if(key==='n')return ['近づける','鼻に響く','母音へ'];if(key==='m')return ['閉じる','鼻に響く','o へ'];if(key==='l')return ['近づける','両側へ','母音へ'];if(/stop|affricate/.test(d.mechanism))return ['閉じる',d.aspirated?'息を出す':'短く開く','母音へ'];return ['構える','息を通す','母音へ']}
 function stepFrame(key,index){if(score(key))return score(key).frames[index];return (/^(ai|ei|ao|ou)$/.test(key)?[0,.625,.98]:/^(ie|üe)$/.test(key)?[0,.225,.92]:nasalFinal(key)?[0,.6,.92]:(data[key]&&data[key].kind==='initial'?[0,.30,.88]:[0,.48,.92]))[index]}
 function referenceFrame(key){var d=data[key]||{};return d.kind==='initial'?(/stop|affricate/.test(d.mechanism)?0:score(key)?score(key).frames[1]:.36):nasalFinal(key)?.9:.6}
 function hasMotion(key){return !!(data[key]&&(data[key].kind==='initial'||nasalFinal(key)||components[key]||key==='er'))}
 function tonguePath(p,jawAngle){var a=jawAngle||0,x=p[0][0],y=surface(p,x),base=jawPoint(54,107,a),rise=base[1]-y;
  function pt(x,y){var q=jawPoint(x,y,a);return q[0].toFixed(2)+' '+q[1].toFixed(2)}
  var capT=smooth((rise-8)/8),capX=x-.65+(Math.max(55,x-1.6)-(x-.65))*capT,capControl=x-.65+(Math.max(54,x-1.4)-(x-.65))*capT,capY=y+Math.max(1.2,Math.min(4,rise*.16));
  var front=x>68?'C'+base[0].toFixed(2)+' '+(base[1]-8).toFixed(2)+' 61 81 65 80 Q69 '+(y+16)+' '+capX.toFixed(2)+' '+capY.toFixed(2):'C'+base[0].toFixed(2)+' '+(base[1]-rise*.45).toFixed(2)+' '+capX.toFixed(2)+' '+(capY+Math.max(1,rise*.15)).toFixed(2)+' '+capX.toFixed(2)+' '+capY.toFixed(2);
  return topPath(p)+' C'+pt(188,136)+' '+pt(184,144)+' '+pt(173,144)+' C'+pt(150,154)+' '+pt(98,150)+' '+pt(64,130)+' C'+pt(56,125)+' '+pt(54,115)+' '+pt(54,107)+' '+front+' Q'+capControl.toFixed(2)+' '+(y+.7).toFixed(2)+' '+x.toFixed(2)+' '+y.toFixed(2)+' Z';
 }
 function oralPath(s){var p=s.tongue,bendX=Math.min(54.6,(54+p[0][0])/2),entry=ceiling(170,s)+(surface(p,170)-ceiling(170,s))*.44,out='M188 112 Q193 94 184 79 Q178 '+entry.toFixed(1)+' 170 '+entry.toFixed(1);for(var x=167;x>=p[0][0];x-=3){var y=ceiling(x,s)+(surface(p,x)-ceiling(x,s))*.44;out+=' L'+x.toFixed(1)+' '+y.toFixed(1)}return out+' L'+p[0][0]+' '+(p[0][0]<=54?Math.max(82,Math.min(84,surface(p,54)-1)):ceiling(p[0][0],s)+(surface(p,p[0][0])-ceiling(p[0][0],s))*.44).toFixed(1)+(p[0][0]<=54?' Q47 '+outletY(s)+' 37 '+outletY(s):' L'+bendX+' 68 L'+bendX+' 81 Q'+bendX+' 84 53 84 Q46 '+outletY(s)+' 37 '+outletY(s))}
 function route(s,key){if(s.stage===2&&s.oral===0&&s.nasal===0&&s.lateral===0)return '音を収める';if(s.stage===0&&s.oral===0&&s.nasal===0&&s.lateral===0)return '構えを確かめる';return key==='l'&&s.lateral>.1?'舌の両側へ':s.nasal>.1?'鼻へ通す':s.oral>.1?'口から息を出す':'いったん止める'}
 function coronalTongue(key,s){var c=(s.contactDegree===undefined?s.contact:s.contactDegree),t=function(a,b){return a+(b-a)*c};return key==='n'?'M'+t(221,218)+' 168 L'+t(221,218)+' '+t(146,145)+' Q'+t(224,218)+' '+t(136,127)+' 245 '+t(136,128)+' Q'+t(266,272)+' '+t(136,127)+' '+t(269,272)+' '+t(146,145)+' L'+t(269,272)+' 168Z':'M235 170 L234 '+t(145,140)+' Q235 '+t(136,128)+' 245 '+t(136,128)+' Q255 '+t(136,128)+' 256 '+t(145,140)+' L255 170Z';}

 function coronalInset(key,id,s){
  if(key!=='n'&&key!=='l')return '';
  var n=key==='n',flow=n?0:s.lateral;
  return '<g class="kp148-coronal-inset" aria-label="'+(n?'上から：口の前と両側を閉じる':'上から：中央は接触、両側は開く')+'"><rect x="203" y="101" width="85" height="85" rx="10" fill="#fffdf7" stroke="#d7dfd4"/><text x="245" y="115" text-anchor="middle" fill="#65786c" font-size="12">上から</text><path d="M216 166 C207 144 219 127 245 127 C271 127 283 144 274 166" fill="none" stroke="#c8b29d" stroke-width="3"/><path class="kp148-inset-tongue" d="'+coronalTongue(key,s)+'" fill="#dfa296" stroke="#b67e77" stroke-width="1"/><path class="kp148-inset-contact" d="'+(n?'M218 151 Q215 128 245 128 Q275 128 272 151':'M240 128 H250')+'" fill="none" stroke="#3b8261" stroke-width="2.5" opacity="'+s.contact+'"/><path class="kp139-lateral" d="M225 167 Q216 148 228 136 M265 167 Q274 148 262 136" fill="none" stroke="#347e77" stroke-width="1.8" marker-end="url(#'+id+'-arrow)" opacity="'+flow+'"/><text class="kp149-inset-caption" x="245" y="179" text-anchor="middle" fill="#416c58" font-size="11">'+(n?'口を閉じ、鼻へ':'中央は接触・両側へ')+'</text></g>';
 }
 function mechanism(key,id){
  id=(id||'kp-diagram-'+(++serial)).replace(/[^a-zA-Z0-9_-]/g,'');var s=model(key,referenceFrame(key)),lp=lipPaths(s),td=tonguePath(s.tongue,s.jawAngle),contact=s.marker||[64,52];
  return '<svg class="kp134-position kp139-position kp141-position" data-kp139-key="'+esc(key)+'" viewBox="0 0 300 232" role="img" aria-label="'+esc(key)+' の歯・舌・息。左が口の前、右が奥の側面模式図"><defs>'
   +'<linearGradient id="'+id+'-skin" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#faf1e7"/><stop offset="1" stop-color="#eddbcb"/></linearGradient>'
   +'<radialGradient id="'+id+'-tongue" cx=".38" cy=".15" r=".95"><stop stop-color="#efb9ad"/><stop offset=".52" stop-color="#d9958b"/><stop offset="1" stop-color="#bd7d78"/></radialGradient>'
   +'<linearGradient id="'+id+'-teeth" x2="0" y2="1"><stop stop-color="#fffefa"/><stop offset="1" stop-color="#eae3d7"/></linearGradient>'
   +'<clipPath id="'+id+'-tongue-clip"><path class="kp141-tongue-clip" d="'+td+'"/></clipPath>'
   +'<marker id="'+id+'-arrow" markerWidth="5" markerHeight="5" refX="4.4" refY="2.5" orient="auto"><path d="M.4 .5 L4.4 2.5 L.4 4.5" fill="none" stroke="#347e77" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>'
   +'<text x="15" y="20" font-size="14" font-weight="600" fill="#64796c">横から見た位置</text><text x="282" y="21" text-anchor="end" font-family="Arial,sans-serif" font-size="20" font-weight="600" fill="#294e40">'+esc(key)+'</text>'
   +'<g class="kp141-anatomy" transform="translate(19 27) scale(1.25 1.05)">'
   +'<path d="M201 44 C179 23 153 9 125 8 C99 6 76 9 63 18 C58 23 56 31 51 37 L20 51 Q16 55 21 58 Q29 63 38 58 Q43 59 43 64 L43 116 C42 121 41 124 45 130 C55 144 71 150 90 152 Q144 159 194 143 L201 44Z" fill="url(#'+id+'-skin)" stroke="#d3bdab" stroke-width=".9" stroke-linejoin="round"/>'
   +'<path d="M48 33 Q45 42 34 51" fill="none" stroke="#fffcf7" stroke-width="2" stroke-linecap="round"/>'
   +'<ellipse cx="32" cy="60" rx="3.8" ry="1.6" fill="#a78573" opacity=".5"/>'
   +'<path d="M32 60 Q66 23 112 19 Q162 17 189 34 Q203 45 202 67 L195 114 L181 116 L186 65 Q187 52 178 45 Q151 34 113 35 Q70 33 39 59Z" fill="#eff3ed" stroke="#d7dfd4" stroke-width=".8"/>'
   +'<path class="kp141-nasal-wash" d="'+nasalPath()+'" fill="none" stroke="#76b2a2" stroke-width="8" stroke-linecap="round" opacity="'+(s.nasal*.18)+'"/>'
   +'<path d="M54 62 Q71 44 98 39 Q126 33 150 47 Q178 45 188 74 L193 131 Q143 153 64 129 Q53 122 54 111Z" fill="#fffdf8"/>'
   +'<text x="113" y="30" text-anchor="middle" font-size="14" fill="#698273">鼻腔</text>'
   +'<path d="'+hardPalateBand()+'" fill="#f1e5d4" stroke="#bda88f" stroke-width=".8" stroke-linejoin="round"/>'
   +'<path d="'+palatePath(54,136)+'" fill="none" stroke="#bfa18c" stroke-width=".9" stroke-linecap="round"/>'
   +'<path class="kp139-velum" d="'+softPalateBand(s)+'" fill="#e7b5a8" stroke="#c59085" stroke-width=".8" stroke-linejoin="round"/>'
   +'<path class="kp-jaw-bone" transform="'+jawTransform(s.jawAngle)+'" d="M44 117 C68 140 114 150 178 144" fill="none" stroke="#c8ac94" stroke-width="3" stroke-linecap="round"/>'
   +'<path d="M43 59 Q48 59 54 62 L54 68 L43 68Z" fill="#deb8a5"/>'
   +'<path d="M44 64 Q49 62 54 65 L54 77 Q53 81 49 80 L43 78 Q42 75 43 64Z" fill="url(#'+id+'-teeth)" stroke="#c7bcae" stroke-width=".8"/>'
   +'<g class="kp145-lower-incisors" transform="'+jawTransform(s.jawAngle)+'"><path d="M43 109 Q47 104 54 104 L57 118 Q59 122 63 125 Q51 125 43 117Z" fill="#deb8a5"/><path d="M44 105 Q49 101 54 104 L55 115 Q52 119 44 115Z" fill="url(#'+id+'-teeth)" stroke="#c7bcae" stroke-width=".8"/></g>'
   +'<path class="kp139-tongue" d="'+td+'" fill="url(#'+id+'-tongue)" stroke="#b67e77" stroke-width="1" stroke-linejoin="round"/>'
   +'<g clip-path="url(#'+id+'-tongue-clip)"><g class="kp-tongue-shading" transform="'+jawTransform(s.jawAngle)+'"><path d="M62 130 Q109 150 182 144 L187 162 H47Z" fill="#935c59" opacity=".1"/><path d="M85 129 Q116 141 150 139" fill="none" stroke="#f4c4b9" stroke-width="7" stroke-linecap="round" opacity=".2"/></g></g>'
   +'<path class="kp140-tongue-edge" d="'+topPath(s.tongue)+'" fill="none" stroke="#f4c9bb" stroke-width="1.0" opacity=".75" stroke-linecap="round"/>'
   +'<path class="kp139-lip-upper" d="'+lp[0]+'" fill="none" stroke="#bf7f7b" stroke-width="3.7" stroke-linecap="round"/><path class="kp139-lip-lower" d="'+lp[1]+'" fill="none" stroke="#bf7f7b" stroke-width="3.7" stroke-linecap="round"/>'
   +'<path class="kp-contact-band" d="'+contactBand(s)+'" fill="none" stroke="#3b8261" stroke-width="2.2" stroke-linecap="round" opacity="'+s.contact*.85+'"/>'
   +'<ellipse class="kp139-contact" cx="'+contact[0]+'" cy="'+contact[1]+'" rx="4" ry="2.4" fill="#3b8261" opacity="'+(s.marker?s.contact*.85:0)+'"/>'
   +'<path class="kp141-oral-inner" d="'+oralPath(s)+'" fill="none" stroke="#438d80" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>'
   +'<path class="kp139-oral" d="'+oralArrow(s)+'" fill="none" stroke="#347e77" stroke-width="1.8" stroke-linecap="round" marker-end="url(#'+id+'-arrow)" opacity="'+(s.oral*.8)+'"/>'
   +'<g class="kp151-oral-particles" fill="#438d80" opacity="0"><circle r="1.15"/><circle r="1.0"/><circle r=".9"/></g><g class="kp151-nasal-particles" fill="#438d80" opacity="0"><circle r="1.1"/><circle r="1.1"/></g>'
   +'<path class="kp139-nasal" d="'+nasalPath()+'" fill="none" stroke="#347e77" stroke-width="1.8" stroke-linecap="round" marker-end="url(#'+id+'-arrow)" opacity="'+(s.nasal*.85)+'"/></g>'
   +coronalInset(key,id,s)
   +'<text x="116" y="43" text-anchor="middle" font-size="14" fill="#727d6e">硬口蓋</text><path d="M129 47 L140 63" fill="none" stroke="#b5c0b0" stroke-width=".75"/><text x="251" y="43" text-anchor="end" font-size="14" fill="#8f7467">軟口蓋</text><path class="kp-soft-palate-leader" d="M226 47 L'+velumEnd(s)[0]+' '+velumEnd(s)[1]+'" fill="none" stroke="#c9ada0" stroke-width=".75"/>'
   +'<text class="kp139-label" x="17" y="202" font-size="14" font-weight="500" fill="#416c58">'+esc(route(s,key))+'</text>'
   +'<circle cx="20" cy="220" r="3.4" fill="#d8948b"/><text x="29" y="224" font-size="16" fill="#65786c">舌</text><circle cx="65" cy="220" r="3.4" fill="#3b8261"/><text x="74" y="224" font-size="16" fill="#65786c">接触</text><path d="M113 220 H127" fill="none" stroke="#347e77" stroke-width="1.4" marker-end="url(#'+id+'-arrow)"/><text x="136" y="224" font-size="16" fill="#65786c">息</text>'
   +'<g class="kp-voicing" transform="translate(205 211)"><path d="M1 5 Q4 0 7 5 T13 5 T19 5" fill="none" stroke="#aa8243" stroke-width="1.6" opacity="'+(s.voice>.05?1:.18)+'"/><text class="kp-voicing-label" x="26" y="11" font-size="16" fill="#766b51">'+(s.voiced?'声あり':'声なし')+'</text></g></svg>';
 }
 function seek(svg,f,flow,opening){var key=svg.dataset.kp139Key,s=model(key,f);if(typeof opening==='number'&&/^(a|o|e|i|u|ü)$/.test(key)){opening=clamp(opening);s.aperture*=opening;s.jawAngle=(22*(1-clamp(s.aperture/20)))/136;s.tongue=mix(anteriorWithJaw(shapes.schwa,s.jawAngle),s.tongue,opening)}var lp=lipPaths(s),td=tonguePath(s.tongue,s.jawAngle);svg.dataset.motionPhase=String(s.stage);svg.querySelector('.kp145-lower-incisors').setAttribute('transform',jawTransform(s.jawAngle));svg.querySelector('.kp-jaw-bone').setAttribute('transform',jawTransform(s.jawAngle));svg.querySelector('.kp-tongue-shading').setAttribute('transform',jawTransform(s.jawAngle));var band=svg.querySelector('.kp-contact-band');band.setAttribute('d',contactBand(s));band.setAttribute('opacity',String(s.contact*.85));svg.querySelector('.kp139-tongue').setAttribute('d',td);svg.querySelector('.kp141-tongue-clip').setAttribute('d',td);svg.querySelector('.kp140-tongue-edge').setAttribute('d',topPath(s.tongue));svg.querySelector('.kp139-lip-upper').setAttribute('d',lp[0]);svg.querySelector('.kp139-lip-lower').setAttribute('d',lp[1]);var oral=svg.querySelector('.kp139-oral'),allowed=flow!==false;oral.setAttribute('opacity',String(allowed?s.oral*.85:0));oral.setAttribute('stroke-width',String(1.6+1.0*s.aspirationLevel));oral.setAttribute('d',oralArrow(s));var inner=svg.querySelector('.kp141-oral-inner');inner.setAttribute('d',oralPath(s));inner.setAttribute('opacity',String(allowed&&s.oral>.05&&key!=='f'&&key!=='l'?s.oral*.45:0));svg.querySelector('.kp139-nasal').setAttribute('opacity',String(allowed?s.nasal*.85:0));svg.querySelector('.kp141-nasal-wash').setAttribute('opacity',String(s.velum*.25));svg.querySelector('.kp139-velum').setAttribute('d',softPalateBand(s));var leader=svg.querySelector('.kp-soft-palate-leader');if(leader)leader.setAttribute('d','M226 47 L'+velumEnd(s)[0]+' '+velumEnd(s)[1]);var marker=svg.querySelector('.kp139-contact');if(s.marker){marker.setAttribute('cx',s.marker[0]);marker.setAttribute('cy',s.marker[1])}marker.setAttribute('opacity',String(s.marker?s.contact*.85:0));svg.querySelector('.kp139-label').textContent=route(s,key);var dots=svg.querySelector('.kp151-oral-particles');if(dots){dots.setAttribute('opacity',String(allowed?s.oral*.58:0));dots.querySelectorAll('circle').forEach(function(c,i){var t=(f*4.8+i/3)%1;c.setAttribute('cx',String(30-23*t));c.setAttribute('cy',String(outletY(s)+(i-1)*2.2*t*s.aspirationLevel));c.setAttribute('opacity',String(Math.sin(Math.PI*t)))})}var nd=svg.querySelector('.kp151-nasal-particles');if(nd){nd.setAttribute('opacity',String(allowed?s.nasal*.65:0));var np=svg.querySelector('.kp139-nasal'),len=np._kp151Length||(np._kp151Length=np.getTotalLength());nd.querySelectorAll('circle').forEach(function(c,i){var t=(f*2.8+i/2)%1,p=np.getPointAtLength(t*len);c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('opacity',String(Math.sin(Math.PI*t)))})}var voice=svg.querySelector('.kp-voicing');if(voice){voice.querySelector('path').setAttribute('opacity',s.voice>.05?'1':'.18');voice.querySelector('text').textContent=s.voiced?'声あり':'声なし'}var side=svg.querySelector('.kp139-lateral');if(side)side.setAttribute('opacity',String(allowed?s.lateral:0));var inset=svg.querySelector('.kp148-coronal-inset');if(inset){inset.querySelector('.kp148-inset-tongue').setAttribute('d',coronalTongue(key,s));inset.querySelector('.kp148-inset-contact').setAttribute('opacity',String(s.contact));inset.querySelector('.kp149-inset-caption').textContent=s.stage===2?'母音へ・舌を離す':s.stage===0?(key==='n'?'閉じる位置へ':'中央を近づける'):key==='n'?'口を閉じ、鼻へ':'中央は接触・両側へ'}}
 function audioFraction(a){var path=new URL(a.currentSrc||a.src,document.baseURI).pathname,idx=path.indexOf('/assets/'),key=idx<0?'':path.slice(idx+1),w=window.KP139_AUDIO_WINDOWS&&window.KP139_AUDIO_WINDOWS[key];var r=window.KP151_ARTICULATION&&window.KP151_ARTICULATION.audioAnchors[key];if(r){var pts=r.anchors;if(a.currentTime<=pts[0][0])return 0;if(a.currentTime>=pts[pts.length-1][0])return 1;return clamp(curve(a.currentTime,pts.map(function(p){return p[0]}),pts.map(function(p){return p[1]})))}return w?clamp((a.currentTime-w[0])/(w[1]-w[0])):a.duration>0?clamp(a.currentTime/a.duration):0}
 window.KP139={score:score,stepIndex:stepIndex,releaseFraction:releaseFraction,referenceFrame:referenceFrame,audioFraction:audioFraction,mechanism:mechanism,seek:seek,model:model,hasMotion:hasMotion,palate:palate,ceiling:ceiling,surface:surface,motionFraction:motionFraction,carrierFraction:carrierFraction,lipPose:lipPose,spline:curve,jawPoint:jawPoint,label:label,steps:steps,stepFrame:stepFrame};
})();
