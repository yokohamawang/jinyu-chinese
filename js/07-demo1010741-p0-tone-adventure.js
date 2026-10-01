/* DEMO 10.107.43 — gentle P0 tone mini-game.
   Keeps pressure low and prefers native zh-CN speech for tone samples. */
(function(){
  var data=window.KOEPANDA_KIDS_FIRST_LESSON;if(!data||!data.tones)return;
  var pair=[0,1],answer=0,round=0;
  function el(id){return document.getElementById(id)}
  function speakNativeZh(text){
    return new Promise(function(resolve,reject){
      if(!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return reject(new Error('speechSynthesis unavailable'));
      try{window.speechSynthesis.cancel()}catch(e){}
      var u=new SpeechSynthesisUtterance(String(text||'').trim());
      if(!u.text)return reject(new Error('empty'));
      u.lang='zh-CN';u.rate=0.78;u.pitch=1;u.volume=1;
      u.onend=function(){resolve()};
      u.onerror=function(ev){reject(ev&&ev.error?new Error(ev.error):new Error('speech error'))};
      try{window.speechSynthesis.speak(u)}catch(e){reject(e)}
    });
  }
  function play(text){
    var spoken=String(text||'').trim();
    if(!spoken)return;
    return speakNativeZh(spoken).catch(function(){
      try{if(typeof window.playMachine==='function')return window.playMachine(spoken,null,false);if(typeof window.speak==='function')return window.speak(spoken)}catch(e){}
    });
  }
  function choosePair(){
    var patterns=[[0,1],[2,3],[0,3],[1,2]];pair=patterns[round%patterns.length].slice();answer=pair[round%2];
  }
  function render(){
    choosePair();var box=el('p0GameChoices'),fb=el('p0GameFeedback'),next=el('p0GameNext');if(!box)return;box.replaceChildren();if(fb){fb.textContent='';fb.className='p0-game-feedback'}if(next)next.hidden=true;
    pair.forEach(function(i){var t=data.tones[i],b=document.createElement('button');b.type='button';b.className='p0-game-choice';b.innerHTML='<strong>'+t.mark+'</strong><small>'+t.label+'・'+t.jp+'</small>';b.addEventListener('click',function(){
      if(i===answer){b.classList.add('is-good');if(fb){fb.textContent='✨ そうそう！ 耳で感じられたね';fb.classList.add('is-good')}if(next)next.hidden=false}
      else{if(fb)fb.textContent='だいじょうぶ。もう一度聞いてみよう 👂';setTimeout(function(){play(data.tones[answer].audioText||data.tones[answer].sample)},180)}
    });box.appendChild(b)});
  }
  function init(){var listen=el('p0GameListen'),next=el('p0GameNext');render();if(listen)listen.addEventListener('click',function(){play(data.tones[answer].audioText||data.tones[answer].sample)});if(next)next.addEventListener('click',function(){round=(round+1)%4;render();setTimeout(function(){play(data.tones[answer].audioText||data.tones[answer].sample)},120)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
