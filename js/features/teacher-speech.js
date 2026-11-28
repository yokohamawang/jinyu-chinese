/* Shared teacher animation for Mandarin teaching playback. Uses existing matched poses. */
(function(){'use strict';
 const base=new URL('../../assets/hanzi/',document.currentScript.src);
 const rest=new URL('teacher-resting.webp',base).href, open=new URL('teacher-speaking.webp',base).href;
 [rest,open].forEach(src=>{const image=new Image();image.src=src;});
 let current=null;
 function pose(state,mouth){const image=state.image;if(image.isConnected){const src=mouth?open:rest;if(image.src!==src)image.src=src;image.classList.toggle('kp-teacher-speaking',mouth);}}
 function stop(state=current){if(!state||current!==state)return;clearInterval(state.timer);pose(state,false);current=null;}
 function bind(utterance){
   stop();if(!utterance||!/^zh(?:[-_]|$)/i.test(utterance.lang||''))return;
   const image=document.querySelector('[data-kp-teacher]');if(!image)return;
   const state={image,timer:null,started:false,paused:false,phase:0,rate:Math.max(.22,Number(utterance.rate)||1)};current=state;
   function beat(){if(current!==state)return;if(!image.isConnected||document.hidden){stop(state);return;}
     const synth=window.speechSynthesis;if(state.started&&!synth.speaking&&!synth.pending){stop(state);return;}
     if(state.paused||synth.paused){pose(state,false);return;}
     // Two visibly distinct poses, timed to the speech cadence. Boundary events reset the cycle.
     pose(state,state.phase++%3!==2);
   }
   function start(){if(current!==state)return;state.started=true;state.phase=1;pose(state,true);clearInterval(state.timer);state.timer=setInterval(beat,Math.max(95,Math.min(230,120/state.rate)));}
   utterance.addEventListener('start',start);
   utterance.addEventListener('boundary',()=>{if(current===state&&state.started&&!state.paused){state.phase=1;pose(state,true);}});
   utterance.addEventListener('pause',()=>{if(current===state){state.paused=true;pose(state,false);}});
   utterance.addEventListener('resume',()=>{if(current===state){state.paused=false;state.phase=1;pose(state,true);}});
   ['end','error'].forEach(event=>utterance.addEventListener(event,()=>stop(state)));
 }
 window.KP_TEACHER_SPEECH={bind,stop};
 window.addEventListener('pagehide',()=>stop());document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
})();
