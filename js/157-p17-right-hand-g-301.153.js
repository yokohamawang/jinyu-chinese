/* 301.153 — P17: Xiaoyin's screen-left/right hand points to the first g tile; mouth poses follow audio stages. */
(function(){
 'use strict';
 function init(){
  var root=document.getElementById('kidsThreeSpellingLesson'),hero=root&&root.querySelector('.kp223-hero'),base=hero&&hero.querySelector('.kp223-art'),board=hero&&hero.querySelector('.kp223-board');
  if(!root||!hero||!base||!board)return;
  var assetBase='./assets/pinyin/lesson-illustrations/',files=['p17-right-hand-g-301.153-0.webp','p17-right-hand-g-301.153-1.webp','p17-right-hand-g-301.153-2.webp','p17-right-hand-g-301.153-3.webp'];
  var urls=files.map(function(file){var url=new URL(assetBase+file,document.baseURI);url.searchParams.set('v','10.108.301.153');return url.href});
  var layer=document.createElement('img');layer.className='kp223-motion-frame';layer.alt='';layer.setAttribute('aria-hidden','true');layer.draggable=false;hero.insertBefore(layer,board);
  var loaded=0,failed=false,pending=0,current=0,returnTimer=0;
  var phaseFrame={1:1,2:2,3:3,4:0};
  function reset(){if(returnTimer){window.clearTimeout(returnTimer);returnTimer=0}pending=0;current=0;hero.classList.remove('kp223-motion-active');layer.removeAttribute('src')}
  function setPhase(phase){phase=Math.max(0,Math.min(4,Number(phase)||0));if(returnTimer){window.clearTimeout(returnTimer);returnTimer=0}if(!phase||failed){reset();return}if(loaded<files.length){pending=phase;return}if(current===phase)return;current=phase;layer.src=urls[phaseFrame[phase]];hero.classList.add('kp223-motion-active');if(phase===4)returnTimer=window.setTimeout(reset,240)}
  files.forEach(function(file,index){var image=new Image();image.onload=function(){loaded++;if(loaded===files.length&&pending){var phase=pending;pending=0;setPhase(phase)}};image.onerror=function(){failed=true;pending=0;reset()};image.src=urls[index]});
  window.addEventListener('koepandaP17MotionPhase',function(event){setPhase(event.detail&&event.detail.phase)});
  window.KP_P17_POINTING_ANIM={stop:reset};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
