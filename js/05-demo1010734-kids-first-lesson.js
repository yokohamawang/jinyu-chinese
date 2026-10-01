/* DEMO 10.107.43 — kids course entry + first lesson behavior.
   Starts visualized single-vowel learning and prefers native zh-CN speech
   for pinyin starter items so a/o/e are not read as Latin letters. */
(function(){
  var data=window.KOEPANDA_KIDS_FIRST_LESSON;
  if(!data)return;
  var vowelIndex=0;

  function el(id){return document.getElementById(id)}
  function enterKids(){
    document.body.classList.remove('app-home-mode','app-function-mode','app-area-listen','app-area-chat','app-area-repeat','app-area-settings');
    document.body.classList.add('app-kids-mode');
    var c=el('kidsCourse'); if(c)c.setAttribute('aria-hidden','false');
    try{history.replaceState(null,'',location.pathname+location.search+'#kidsCourse')}catch(e){}
    requestAnimationFrame(function(){window.scrollTo({top:0,left:0,behavior:'auto'})});
  }
  function leaveKids(){
    document.body.classList.remove('app-kids-mode');
    var c=el('kidsCourse'); if(c)c.setAttribute('aria-hidden','true');
    if(typeof window.returnToAppHome==='function')window.returnToAppHome();
    else{document.body.classList.add('app-home-mode');window.scrollTo(0,0)}
  }
  function speakNativeZh(text){
    return new Promise(function(resolve,reject){
      if(!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return reject(new Error('speechSynthesis unavailable'));
      try{window.speechSynthesis.cancel()}catch(e){}
      var u=new SpeechSynthesisUtterance(String(text||'').trim());
      if(!u.text)return reject(new Error('empty'));
      u.lang='zh-CN';
      u.rate=0.78;
      u.pitch=1;
      u.volume=1;
      u.onend=function(){resolve()};
      u.onerror=function(ev){reject(ev&&ev.error?new Error(ev.error):new Error('speech error'))};
      try{window.speechSynthesis.speak(u)}catch(e){reject(e)}
    });
  }
  function safePlay(text,preferNativeZh){
    var spoken=String(text||'').trim();
    if(!spoken)return Promise.resolve();
    if(preferNativeZh){
      return speakNativeZh(spoken).catch(function(){
        try{
          if(typeof window.playMachine==='function') return window.playMachine(spoken,null,false);
          if(typeof window.speak==='function') return window.speak(spoken);
        }catch(e){}
      });
    }
    try{
      if(typeof window.playMachine==='function') return window.playMachine(spoken,null,false);
      if(typeof window.speak==='function') return window.speak(spoken);
    }catch(e){}
  }
  function renderTones(){
    var box=el('kidsToneGrid');if(!box)return;box.replaceChildren();
    data.tones.forEach(function(t){
      var b=document.createElement('button');b.type='button';b.className='kids-tone-card';
      b.innerHTML='<span class="mark">'+t.mark+'</span><b>'+t.label+'</b><small>'+t.jp+'</small>';
      b.addEventListener('click',function(){
        box.querySelectorAll('.kids-tone-card').forEach(function(x){x.classList.remove('is-active')});b.classList.add('is-active');
        var hint=el('kidsToneHint');if(hint)hint.textContent=t.label+'：'+t.jp+'。小音のお手本を聞いて、同じように声を出してみよう。';
        safePlay(t.audioText||t.sample,true);
      });
      box.appendChild(b);
    });
  }
  function updateScene(v){
    var emoji=el('kidsSceneEmoji'),title=el('kidsSceneTitle'),text=el('kidsSceneText'),readAs=el('kidsReadAs'),note=el('kidsPracticeNote');
    if(emoji)emoji.textContent=v.sceneEmoji||'🐼';
    if(title)title.textContent=v.sceneTitle||'';
    if(text)text.textContent=v.sceneText||'';
    if(readAs)readAs.textContent=v.readAs||'';
    if(note)note.textContent=v.note||'';
  }
  function setVowel(i,play){
    vowelIndex=(i+data.vowels.length)%data.vowels.length;var v=data.vowels[vowelIndex];
    var w=el('kidsPracticeWord'),tip=el('kidsPracticeTip');
    if(w)w.textContent=v.letter;if(tip)tip.textContent=v.tip;
    updateScene(v);
    document.querySelectorAll('.kids-vowel-button').forEach(function(b,j){b.classList.toggle('is-active',j===vowelIndex)});
    if(play)safePlay(v.audioText||v.letter,true);
  }
  function renderVowels(){
    var box=el('kidsVowelGrid');if(!box)return;box.replaceChildren();
    data.vowels.forEach(function(v,i){
      var b=document.createElement('button');
      b.type='button';
      b.className='kids-vowel-button';
      b.innerHTML='<span class="letter">'+v.letter+'</span><small class="hint">'+(v.buttonHint||'')+'</small>';
      b.setAttribute('aria-label',v.letter+' の音を聞く');
      b.addEventListener('click',function(){setVowel(i,true)});
      box.appendChild(b)
    });
    setVowel(0,false);
  }
  function finishLesson(){
    try{localStorage.setItem('koepandaKidsFirstLessonDone','1')}catch(e){}
    var n=el('kidsFinishNote');if(n)n.textContent='🎉 できた！ 次は「聞いてえらぶ」ミニゲームにつなげるよ。';
    var nodes=document.querySelectorAll('.kids-map-node');if(nodes[1])nodes[1].classList.add('is-current');
  }
  function init(){
    renderTones();renderVowels();
    var entry=el('kidsEntryButton'),back=el('kidsBackHome'),listen=el('kidsListenVowel'),next=el('kidsNextVowel'),finish=el('kidsFinishLesson');
    if(entry)entry.addEventListener('click',enterKids);
    if(back)back.addEventListener('click',leaveKids);
    if(listen)listen.addEventListener('click',function(){var v=data.vowels[vowelIndex];safePlay(v.audioText||v.letter,true)});
    if(next)next.addEventListener('click',function(){setVowel(vowelIndex+1,true)});
    if(finish)finish.addEventListener('click',finishLesson);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
