/* DEMO 10.107.68 — dedicated Mandarin pinyin audio.
   No Latin-letter TTS and no trimmed seed-word approximations.
   Uses the MIT-licensed Yanyu pinyin-syllables audio library as the online source. */
(function(){
  var data=window.KOEPANDA_KIDS_FIRST_LESSON;if(!data)return;
  var vowelIndex=0, localAudio=null, heard={}, completed={}, activeLetters=null, activeGroupTitle='';
  var STORE='koepandaVowelProgress54';
  function el(id){return document.getElementById(id)}
  function loadProgress(){try{completed=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(e){completed={}}}
  function saveProgress(){try{localStorage.setItem(STORE,JSON.stringify(completed))}catch(e){}}
  function enterKids(ev){if(typeof window.koepandaEnterKidsCourse==='function')return window.koepandaEnterKidsCourse(ev);document.body.classList.remove('app-home-mode','app-function-mode','app-area-listen','app-area-chat','app-area-repeat','app-area-settings');document.body.classList.add('app-kids-mode');var c=el('kidsCourse');if(c)c.setAttribute('aria-hidden','false');try{history.replaceState(null,'',location.pathname+location.search+'#kidsCourse')}catch(e){}requestAnimationFrame(function(){window.scrollTo({top:0,left:0,behavior:'auto'})})}
  function leaveKids(){document.body.classList.remove('app-kids-mode');var c=el('kidsCourse');if(c)c.setAttribute('aria-hidden','true');if(typeof window.returnToAppHome==='function')window.returnToAppHome();else{document.body.classList.add('app-home-mode');window.scrollTo(0,0)}}
  function stopAudio(){
    try{if(localAudio){localAudio.pause();localAudio.currentTime=0}}catch(e){}
    localAudio=null;
    try{if(pinyinSource){pinyinSource.stop();pinyinSource.disconnect();pinyinSource=null}}catch(e){}
    try{if('speechSynthesis' in window)window.speechSynthesis.cancel()}catch(e){}
  }
  /*
     Pinyin audio contract (10.107.66):
     - Never send isolated Latin pinyin to browser TTS.
     - Never trim consonants from Chinese seed words.
     - Use dedicated Mandarin pinyin syllable recordings only.
     - a/o/e use their own syllable recordings; i/u/ü use yi/wu/yu, whose y/w
       are zero-initial orthographic spellings in Hanyu Pinyin.
     - Source: byhow/yanyu pinyin-syllables (MIT).
  */
  var PINYIN_AUDIO_BASE='https://raw.githubusercontent.com/byhow/yanyu/main/pinyin-syllables/';
  function audioKey(letter,tone){
    var base=letter==='i'?'yi':(letter==='u'?'wu':(letter==='ü'?'yu':letter));
    return base+tone;
  }
  function showAudioMissing(letter,tone){
    var msg='音声の読み込みに失敗しました。通信状態を確認して、もう一度押してください。';
    console.error(msg,letter,tone);
    var hint=el('kidsToneHint');
    if(hint)hint.textContent='⚠ '+msg;
  }
  function playLocalPinyin(letter,tone){
    stopAudio();
    /* 10.107.68: keep all six vowel groups on the same Yanyu male speaker.
       The library's standalone o recording did not match the desired vowel quality,
       so o uses the same speaker's wo-tone recording with the very short initial glide
       skipped at playback start. This preserves speaker identity across a/e/i/u/ü/o. */
    var isO=letter==='o';
    var key=isO?('wo'+tone):audioKey(letter,tone);
    var src=PINYIN_AUDIO_BASE+key+'.mp3';
    return new Promise(function(resolve){
      var a=new Audio();localAudio=a;a.preload='auto';a.playsInline=true;a.crossOrigin='anonymous';
      var settled=false,started=false;
      function fail(){
        if(settled)return;settled=true;
        try{a.pause();a.currentTime=0}catch(e){}
        if(localAudio===a)localAudio=null;
        showAudioMissing(letter,tone);
        resolve(null);
      }
      function start(){
        if(started)return;started=true;
        try{if(isO&&a.duration>0.16)a.currentTime=Math.min(0.09,a.duration*0.18)}catch(e){}
        try{
          var pr=a.play();
          if(pr&&typeof pr.then==='function')pr.then(function(){settled=true;resolve(a)}).catch(fail);
          else{settled=true;resolve(a)}
        }catch(e){fail()}
      }
      a.addEventListener('ended',function(){if(localAudio===a)localAudio=null},{once:true});
      a.addEventListener('error',fail,{once:true});
      a.addEventListener('loadedmetadata',start,{once:true});
      a.src=src;
      try{a.load()}catch(e){start()}
    });
  }
  function playToneExample(tone){return playLocalPinyin('a',tone)}
  function playVowelExample(v,tone){return playLocalPinyin(v.letter,tone)}
  window.koepandaPlayToneIntro=playToneExample;
  function toneMarks(letter){
    var m={a:['ā','á','ǎ','à'],o:['ō','ó','ǒ','ò'],e:['ē','é','ě','è'],i:['ī','í','ǐ','ì'],u:['ū','ú','ǔ','ù'],'ü':['ǖ','ǘ','ǚ','ǜ']};
    return m[letter]||[letter,letter,letter,letter];
  }
  function toneLabels(){return ['高く平ら','低めから一気に上へ','低く下げてから上がる','高い所から一気に下へ']}
  function renderTones(){var box=el('kidsToneGrid');if(!box)return;box.replaceChildren();data.tones.forEach(function(t){var b=document.createElement('button');b.type='button';b.className='kids-tone-card tone-'+t.tone;b.innerHTML='<span class="mark">'+t.mark+'</span><b>'+t.label+'</b><small>'+t.jp+'</small>';b.addEventListener('click',function(){box.querySelectorAll('.kids-tone-card').forEach(function(x){x.classList.remove('is-active')});b.classList.add('is-active');var hint=el('kidsToneHint');if(hint)hint.textContent=t.label+'：'+t.jp+'。声の動きを聞こう。';playToneExample(t.tone)});box.appendChild(b)})}
  function visibleVowels(){
    if(!activeLetters||!activeLetters.length)return data.vowels.slice();
    return activeLetters.map(function(letter){return data.vowels.find(function(v){return v.letter===letter})}).filter(Boolean);
  }
  function updateProgress(){
    var list=visibleVowels(), done=list.filter(function(v){return !!completed[v.letter]}).length, total=list.length||6;
    var p=el('kidsVowelOverviewProgress');
    if(p)p.textContent=done===0?'好きな母音を1つ選んでみよう':(done<total?'できた母音 '+done+' / '+total:(activeGroupTitle?activeGroupTitle+'、ぜんぶできた！':'6つの母音、ぜんぶできた！'));
    document.querySelectorAll('.kids-vowel-button').forEach(function(b){b.classList.toggle('is-complete',!!completed[b.dataset.letter])});
    var note=el('kidsFinishNote');if(note){note.textContent='';note.classList.remove('is-visible')}
  }
  function ensureDrill(){
    if(el('kidsVowelDrill'))return el('kidsVowelDrill');
    var grid=el('kidsVowelGrid');if(!grid)return null;
    var progress=document.createElement('div');progress.id='kidsVowelOverviewProgress';progress.className='kids-vowel-overview-progress';grid.insertAdjacentElement('afterend',progress);
    var d=document.createElement('div');d.id='kidsVowelDrill';d.className='kids-vowel-drill';d.hidden=true;
    d.innerHTML='<div class="kids-vowel-drill-head"><button type="button" class="kids-vowel-drill-back" id="kidsVowelDrillBack">← 戻る　母音一覧</button><div class="kids-vowel-drill-title"><b id="kidsVowelDrillTitle">a の四声</b><small>きく → よむ → なぞって形を覚える</small></div></div><div class="kids-vowel-drill-hero"><img id="kidsVowelDrillImage" alt=""><div><div class="kids-vowel-drill-letter" id="kidsVowelDrillLetter">a</div><div class="kids-vowel-drill-tip" id="kidsVowelDrillTip"></div></div></div><div class="kids-vowel-tone-title">🔊 4つの声調を順番に聞いてみよう</div><div class="kids-vowel-tone-grid" id="kidsVowelToneGrid"></div><div class="kids-vowel-write"><b>✍️ 声調記号もいっしょに覚えよう</b><div class="kids-vowel-trace-row" id="kidsVowelTraceRow"></div></div><div class="kids-vowel-special-note" id="kidsVowelSpecialNote" hidden></div><div class="kids-vowel-drill-actions"><button type="button" class="kids-vowel-complete" id="kidsVowelComplete">この母音、できた！</button><button type="button" class="kids-vowel-back-bottom" id="kidsVowelBackBottom">戻る</button></div>';
    progress.insertAdjacentElement('afterend',d);
    el('kidsVowelDrillBack').addEventListener('click',closeDrill);el('kidsVowelBackBottom').addEventListener('click',closeDrill);el('kidsVowelComplete').addEventListener('click',completeCurrent);
    return d;
  }
  function renderDrill(i){
    vowelIndex=i;heard={};var v=data.vowels[i],d=ensureDrill();if(!d)return;
    el('kidsVowelDrillTitle').textContent=v.letter+' の四声';el('kidsVowelDrillLetter').textContent=v.letter;el('kidsVowelDrillImage').src=v.image;el('kidsVowelDrillImage').alt=v.sceneTitle||v.letter;el('kidsVowelDrillTip').textContent=v.tip+'。'+v.note;
    var marks=toneMarks(v.letter),labels=toneLabels(),g=el('kidsVowelToneGrid');g.replaceChildren();
    marks.forEach(function(mark,k){var tone=k+1,b=document.createElement('button');b.type='button';b.className='kids-vowel-tone-btn';b.innerHTML='<span class="tone-mark">'+mark+'</span><b>'+tone+'声</b><small>'+labels[k]+'</small>';b.setAttribute('aria-label',mark+' '+tone+'声を聞く');b.addEventListener('click',function(){heard[tone]=true;b.classList.add('is-heard');playVowelExample(v,tone)});g.appendChild(b)});
    var tr=el('kidsVowelTraceRow');tr.replaceChildren();marks.forEach(function(mark){var x=document.createElement('div');x.className='kids-vowel-trace';x.textContent=mark;tr.appendChild(x)});
    var sp=el('kidsVowelSpecialNote');if(v.letter==='ü'){sp.hidden=false;sp.innerHTML='<strong>u と ü は別の音。</strong> ü は u の上に点が2つ。<br>j・q・x ＋ ü は <strong>ju・qu・xu</strong> と書くけれど、点を省くだけで発音は ü のまま。'}else{sp.hidden=true;sp.textContent=''}
    el('kidsVowelGrid').hidden=true;var title=document.querySelector('.kids-lesson-card:has(#kidsVowelGrid) .kids-lesson-title');if(title)title.hidden=true;var prog=el('kidsVowelOverviewProgress');if(prog)prog.hidden=true;d.hidden=false;requestAnimationFrame(function(){d.scrollIntoView({block:'start',behavior:'auto'})});
  }
  function closeDrill(){stopAudio();var d=el('kidsVowelDrill');if(d)d.hidden=true;var grid=el('kidsVowelGrid');if(grid)grid.hidden=false;var title=document.querySelector('.kids-lesson-card:has(#kidsVowelGrid) .kids-lesson-title');if(title)title.hidden=false;var p=el('kidsVowelOverviewProgress');if(p)p.hidden=false;updateProgress();requestAnimationFrame(function(){grid.scrollIntoView({block:'start',behavior:'auto'})})}
  function completeCurrent(){var v=data.vowels[vowelIndex];completed[v.letter]=true;saveProgress();updateProgress();closeDrill()}
  function setVowelCardTitle(){
    var card=el('kidsVowelGrid');card=card?card.closest('.kids-lesson-card'):null;
    if(!card)return;
    var strong=card.querySelector('.kids-lesson-title strong');
    var small=card.querySelector('.kids-lesson-title small');
    if(strong)strong.textContent=activeGroupTitle?(activeGroupTitle+' の音あそび'):'6つの母音の音あそび';
    if(small)small.textContent='音・口の形・イメージをいっしょに覚えよう';
  }
  function renderVowels(){
    var box=el('kidsVowelGrid');if(!box)return;box.replaceChildren();
    visibleVowels().forEach(function(v){var i=data.vowels.indexOf(v),b=document.createElement('button');b.type='button';b.className='kids-vowel-button';b.dataset.letter=v.letter;b.innerHTML='<img src="'+v.image+'" alt=""><span class="letter">'+v.letter+'</span><small class="hint">'+(v.buttonHint||'')+'</small>';b.setAttribute('aria-label',v.letter+' の四声練習を開く');b.addEventListener('click',function(){renderDrill(i)});box.appendChild(b)});
    ensureDrill();setVowelCardTitle();updateProgress();
  }
  window.koepandaOpenVowelGroup=function(letters,title){
    activeLetters=Array.isArray(letters)?letters.slice():null;
    activeGroupTitle=title||'';
    var d=el('kidsVowelDrill');if(d)d.hidden=true;
    var grid=el('kidsVowelGrid');if(grid)grid.hidden=false;
    var card=grid?grid.closest('.kids-lesson-card'):null;
    var t=card?card.querySelector('.kids-lesson-title'):null;if(t)t.hidden=false;
    var p=el('kidsVowelOverviewProgress');if(p)p.hidden=false;
    renderVowels();
  };
  window.koepandaResetVowelGroup=function(){activeLetters=null;activeGroupTitle='';setVowelCardTitle();};
  function init(){loadProgress();renderTones();renderVowels();var entry=el('kidsEntryButton'),back=el('kidsBackHome');if(entry)entry.addEventListener('click',enterKids);if(back)back.addEventListener('click',leaveKids)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
