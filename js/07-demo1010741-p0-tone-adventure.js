/* DEMO 10.107.44 — P0 tone mini-game uses fixed local a-tone audio, not example characters. */
(function(){
  var data=window.KOEPANDA_KIDS_FIRST_LESSON;if(!data||!data.tones)return;var pair=[0,1],answer=0,round=0,localAudio=null;
  function el(id){return document.getElementById(id)}
  function playFile(src){try{if(localAudio){localAudio.pause();localAudio.currentTime=0}}catch(e){}localAudio=new Audio(src);localAudio.playsInline=true;return localAudio.play().catch(function(e){console.warn(e)})}
  function choosePair(){var patterns=[[0,1],[2,3],[0,3],[1,2]];pair=patterns[round%patterns.length].slice();answer=pair[round%2]}
  function render(){choosePair();var box=el('p0GameChoices'),fb=el('p0GameFeedback'),next=el('p0GameNext');if(!box)return;box.replaceChildren();if(fb){fb.textContent='';fb.className='p0-game-feedback'}if(next)next.hidden=true;pair.forEach(function(i){var t=data.tones[i],b=document.createElement('button');b.type='button';b.className='p0-game-choice';b.innerHTML='<strong>'+t.mark+'</strong><small>'+t.label+'・'+t.jp+'</small>';b.addEventListener('click',function(){if(i===answer){b.classList.add('is-good');if(fb){fb.textContent='✨ そうそう！ 耳で感じられたね';fb.classList.add('is-good')}if(next)next.hidden=false}else{if(fb)fb.textContent='だいじょうぶ。もう一度聞いてみよう 👂';setTimeout(function(){playFile(data.tones[answer].audioFile)},180)}});box.appendChild(b)})}
  function init(){var listen=el('p0GameListen'),next=el('p0GameNext');render();if(listen)listen.addEventListener('click',function(){playFile(data.tones[answer].audioFile)});if(next)next.addEventListener('click',function(){round=(round+1)%4;render();setTimeout(function(){playFile(data.tones[answer].audioFile)},120)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
