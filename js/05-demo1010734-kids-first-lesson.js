/* DEMO 10.107.64 — native-vowel fallback fix.
   Dedicated local Azure WAVs remain the first choice.
   When they are not present, NEVER send Latin pinyin marks (á / ǒ / ü...) to TTS.
   Instead request native Mandarin seed syllables and trim consonant onsets in WebAudio. */
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
     Pinyin audio contract (10.107.64):
     1) Prefer a dedicated local WAV for each vowel + tone.
     2) If a WAV is absent, DO NOT pass Latin pinyin to TTS: Azure/browser voices can
        interpret it as English/foreign text (the source of “打/嗷”-like playback).
     3) Fallback uses a real Mandarin seed syllable and removes a short consonant onset
        with WebAudio. The learner therefore hears the Mandarin vowel/tone, not the seed word.
  */
  var PINYIN_AUDIO_BASE='./assets/audio/pinyin/azure/';
  var PINYIN_TTS_API='https://worker-xiaoshuang.wangjinyu00.workers.dev';
  var pinyinBufferCache=new Map(), pinyinAudioContext=null, pinyinSource=null;
  var NATIVE_SEEDS={
    a:[{text:'阿',trim:0},{text:'达',trim:.095},{text:'打',trim:.095},{text:'大',trim:.085}],
    o:[{text:'窝',trim:.055},{text:'哦',trim:0},{text:'我',trim:.055},{text:'卧',trim:.055}],
    e:[{text:'喝',trim:.115},{text:'鹅',trim:0},{text:'可',trim:.115},{text:'饿',trim:0}],
    i:[{text:'衣',trim:0},{text:'姨',trim:0},{text:'椅',trim:0},{text:'意',trim:0}],
    u:[{text:'屋',trim:0},{text:'无',trim:0},{text:'五',trim:0},{text:'物',trim:0}],
    'ü':[{text:'迂',trim:0},{text:'鱼',trim:0},{text:'雨',trim:0},{text:'玉',trim:0}]
  };
  function audioKey(letter,tone){return (letter==='ü'?'yu':letter)+tone}
  function getPinyinAudioContext(){
    var Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)throw new Error('AudioContext unsupported');
    if(!pinyinAudioContext)pinyinAudioContext=new Ctx();
    if(pinyinAudioContext.state==='suspended')pinyinAudioContext.resume().catch(function(){});
    return pinyinAudioContext;
  }
  function stopPinyinSource(){
    try{if(pinyinSource){pinyinSource.stop();pinyinSource.disconnect()}}catch(e){}
    pinyinSource=null;
  }
  async function fetchNativeSeedBuffer(letter,tone){
    var key=audioKey(letter,tone);
    if(pinyinBufferCache.has(key))return pinyinBufferCache.get(key);
    var seed=(NATIVE_SEEDS[letter]||[])[tone-1];
    if(!seed)throw new Error('missing native seed '+key);
    var r=await fetch(PINYIN_TTS_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:seed.text})});
    if(!r.ok)throw new Error('pinyin TTS '+r.status);
    var raw=await r.arrayBuffer();
    var ctx=getPinyinAudioContext();
    var decoded=await ctx.decodeAudioData(raw.slice(0));
    var value={buffer:decoded,trim:seed.trim||0};
    pinyinBufferCache.set(key,value);
    return value;
  }
  async function playNativeSeed(letter,tone){
    stopAudio();stopPinyinSource();
    var data=await fetchNativeSeedBuffer(letter,tone);
    var ctx=getPinyinAudioContext();
    if(ctx.state==='suspended')await ctx.resume();
    var src=ctx.createBufferSource();pinyinSource=src;src.buffer=data.buffer;src.connect(ctx.destination);
    src.onended=function(){if(pinyinSource===src)pinyinSource=null};
    var offset=Math.min(data.trim,Math.max(0,data.buffer.duration-.16));
    src.start(0,offset);
    return src;
  }
  function playLocalPinyin(letter,tone){
    stopAudio();stopPinyinSource();
    var src=PINYIN_AUDIO_BASE+audioKey(letter,tone)+'.wav';
    return new Promise(function(resolve){
      var a=new Audio(src);localAudio=a;a.preload='auto';a.playsInline=true;
      var finished=false;
      function fallback(){
        if(finished)return;finished=true;
        try{a.pause();a.currentTime=0}catch(e){}
        if(localAudio===a)localAudio=null;
        playNativeSeed(letter,tone).then(resolve).catch(function(err){console.error('Pinyin native fallback failed',err);resolve(null)});
      }
      a.addEventListener('canplaythrough',function(){
        if(finished)return;finished=true;
        a.play().then(function(){resolve(a)}).catch(function(){finished=false;fallback()});
      },{once:true});
      a.addEventListener('error',fallback,{once:true});
      try{a.load()}catch(e){fallback()}
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
