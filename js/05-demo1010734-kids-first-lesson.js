/* DEMO 10.107.49 — fixed pinyin teaching sounds use bundled WAV files only.
   No network TTS is used for the six vowels or the four-tone starter lesson. */
(function(){
  var data=window.KOEPANDA_KIDS_FIRST_LESSON;if(!data)return;
  var vowelIndex=0, localAudio=null;
  function playLessonAudio(src){
    if(!src)return Promise.resolve();
    return playFile(src);
  }
  function playVowelByLetter(letter){
    var i=data.vowels.findIndex(function(v){return v.letter===letter});
    if(i>=0){setVowel(i,false);return playLessonAudio(data.vowels[i].audioFile)}
    return Promise.resolve();
  }
  function renderTones(){var box=el('kidsToneGrid');if(!box)return;box.replaceChildren();data.tones.forEach(function(t){var b=document.createElement('button');b.type='button';b.className='kids-tone-card tone-'+t.tone;b.innerHTML='<span class="mark">'+t.mark+'</span><b>'+t.label+'</b><small>'+t.jp+'</small>';b.addEventListener('click',function(){box.querySelectorAll('.kids-tone-card').forEach(function(x){x.classList.remove('is-active')});b.classList.add('is-active');var hint=el('kidsToneHint');if(hint)hint.textContent=t.label+'：'+t.jp+'。母語話者の発音で声の動きを聞こう。';playLessonAudio(t.audioFile)});box.appendChild(b)})}
  function updateScene(v){var img=el('kidsSceneImage'),title=el('kidsSceneTitle'),text=el('kidsSceneText'),readAs=el('kidsReadAs'),note=el('kidsPracticeNote');if(img){img.src=v.image||'';img.alt=v.sceneTitle||v.letter}if(title)title.textContent=v.sceneTitle||'';if(text)text.textContent=v.sceneText||'';if(readAs)readAs.textContent=v.readAs||'';if(note)note.textContent=v.note||''}
  function setVowel(i,play){vowelIndex=(i+data.vowels.length)%data.vowels.length;var v=data.vowels[vowelIndex];var w=el('kidsPracticeWord'),tip=el('kidsPracticeTip');if(w)w.textContent=v.letter;if(tip)tip.textContent=v.tip;updateScene(v);document.querySelectorAll('.kids-vowel-button').forEach(function(b,j){b.classList.toggle('is-active',j===vowelIndex)});if(play)playLessonAudio(v.audioFile)}
  function renderVowels(){var box=el('kidsVowelGrid');if(!box)return;box.replaceChildren();data.vowels.forEach(function(v,i){var b=document.createElement('button');b.type='button';b.className='kids-vowel-button';b.innerHTML='<img src="'+v.image+'" alt=""><span class="letter">'+v.letter+'</span><small class="hint">'+(v.buttonHint||'')+'</small>';b.setAttribute('aria-label',v.letter+' の音を聞く');b.addEventListener('click',function(){setVowel(i,true)});box.appendChild(b)});setVowel(0,false)}
  function finishLesson(){try{localStorage.setItem('koepandaKidsFirstLessonDone','1')}catch(e){}var n=el('kidsFinishNote');if(n)n.textContent='🎉 できた！ 今日はここまでで十分。少しずつ進もう。';var nodes=document.querySelectorAll('.kids-map-node');if(nodes[1])nodes[1].classList.add('is-current')}
  function init(){renderTones();renderVowels();var entry=el('kidsEntryButton'),back=el('kidsBackHome'),listen=el('kidsListenVowel'),next=el('kidsNextVowel'),finish=el('kidsFinishLesson'),listenU=el('kidsListenU'),listenUmlaut=el('kidsListenUmlaut');if(entry)entry.addEventListener('click',enterKids);if(back)back.addEventListener('click',leaveKids);if(listen)listen.addEventListener('click',function(){var v=data.vowels[vowelIndex];playLessonAudio(v.audioFile)});if(listenU)listenU.addEventListener('click',function(){playVowelByLetter('u')});if(listenUmlaut)listenUmlaut.addEventListener('click',function(){playVowelByLetter('ü')});if(next)next.addEventListener('click',function(){setVowel(vowelIndex+1,true)});if(finish)finish.addEventListener('click',finishLesson)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
