/* 301.151 — additive P16 scene-pose pilot, synchronized to the existing audio clock. */
(function(){
 'use strict';
 var root=document.getElementById('kidsTwoSpellingP16');
 if(!root)return;
 var practice=root.querySelector('#kp192Practice'),hero=root.querySelector('.kp205-hero'),image=hero&&hero.querySelector('.kp205-lesson-art');
 if(!practice||!hero||!image)return;
 var assetBase='./assets/pinyin/lesson-illustrations/p16-pose-301.150/';
 var frames={
  initialClosed:'p16-point-initial-closed-301.150.webp',initialNeutral:'p16-point-initial-neutral-301.150.webp',initialF:'p16-point-initial-f-301.150.webp',
  vowelO:'p16-point-vowel-o-301.150.webp',vowelE:'p16-point-vowel-e-301.150.webp',vowelI:'p16-point-vowel-i-301.150.webp',
  syllableO:'p16-point-syllable-o-301.150.webp',syllableE:'p16-point-syllable-e-301.150.webp',syllableI:'p16-point-syllable-i-301.150.webp'
 };
 var urls={},remaining=Object.keys(frames).length,failed=false,pendingEvent=null,activeAudio=null,activeItem=null,raf=0,currentFrame='';
 var layer=document.createElement('img');layer.className='kp151-pose-frame';layer.alt='';layer.setAttribute('aria-hidden','true');layer.draggable=false;hero.insertBefore(layer,root.querySelector('#kp192Blend'));
 Object.keys(frames).forEach(function(key){var preload=new Image();urls[key]=new URL(assetBase+frames[key],document.baseURI).href;preload.onload=function(){if(--remaining===0&&!failed&&pendingEvent){var event=pendingEvent;pendingEvent=null;start(event)}};preload.onerror=function(){failed=true;pendingEvent=null};preload.src=urls[key]});
 function vowelKey(it){if(it.f==='o'||it.f==='u'||it.f==='ü')return 'O';if(it.f==='i')return 'I';return 'E'}
 function initialKey(it){if(/^(b|p|m)$/.test(it.a||''))return 'Closed';if(it.a==='f')return 'F';return 'Neutral'}
 function setFrame(key){
  if(currentFrame===key)return;currentFrame=key;
  layer.src=urls[key];layer.style.opacity='1';
 }
 function restore(){
  if(raf){cancelAnimationFrame(raf);raf=0}
  if(activeAudio){activeAudio.removeEventListener('playing',onResume);activeAudio.removeEventListener('pause',onPause);activeAudio.removeEventListener('ended',stop);activeAudio.removeEventListener('error',stop)}
  activeAudio=null;activeItem=null;currentFrame='';hero.classList.remove('kp151-animating');image.style.visibility='visible';layer.removeAttribute('src');layer.style.opacity='0'
 }
 function stop(){pendingEvent=null;restore()}
 function onResume(){if(activeAudio===this)tick()}
 function onPause(){if(raf){cancelAnimationFrame(raf);raf=0}}
 function tick(){
  if(raf){cancelAnimationFrame(raf);raf=0}
  if(!activeAudio||activeAudio.paused||!activeItem)return;
  var t=activeItem.timings||[0,0,0],ms=activeAudio.currentTime*1000,onset=Math.max(0,Number(t[0])||0),vowel=Math.max(0,Number(t[1])||0),gap=220;
  var vowelAt=onset+gap,syllableAt=vowelAt+vowel+gap,key;
  if(ms<vowelAt)key='initial'+initialKey(activeItem);
  else if(ms<syllableAt)key='vowel'+vowelKey(activeItem);
  else key='syllable'+vowelKey(activeItem);
  setFrame(key);raf=requestAnimationFrame(tick);
 }
 function start(event){
  var detail=event.detail||{},audio=detail.audio,item=detail.item;
  if(failed||remaining||!audio||audio.ended||!item||root.hidden||practice.hidden)return;
  stop();activeAudio=audio;activeItem=item;hero.classList.add('kp151-animating');image.style.visibility='hidden';
  activeAudio.addEventListener('playing',onResume);activeAudio.addEventListener('pause',onPause);activeAudio.addEventListener('ended',stop);activeAudio.addEventListener('error',stop);
  tick();
 }
 window.addEventListener('koepandaP16AudioPlaying',function(event){if(failed)return;if(remaining){pendingEvent=event;return}start(event)});
 window.KP_P16_POINTING_ANIM={stop:stop};
})();
