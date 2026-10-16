/* 10.108.104: clear teaching contours and a separate recording workspace. */
/* DEMO 10.108.06 — restore ü to the verified same-speaker Yanyu source.
   Ear replay follows the last tone heard above, imitation is free-choice 1–4 tones,
   playback buttons have tactile feedback, and all six vowel groups use one speaker. */
(function(){
  window.KOEPANDA_PINYIN_BUILD="10.108.154";
  var data=window.KOEPANDA_KIDS_FIRST_LESSON;if(!data)return;
  var vowelIndex=0, localAudio=null, audioRequestId=0, audioPool={}, heard={}, completed={}, mastery={}, activeLetters=null, activeGroupTitle='';
  var introToneBusy=false, introTonePending=null, introToneLastEnd=0, introToneGuardMs=180;
  var STORE='koepandaVowelProgress54', MASTERY_STORE='koepandaVowelMastery69';
  var aFlow=null, introToneEpoch=0, audioCleanup=null, mouthRestTimer=null;
  function el(id){return document.getElementById(id)}
  var VOWEL_MOUTH_GUIDES={
    a:{x:18,y:145,title:'口を大きく開く',tip:'力を入れすぎず、口を縦に開こう。'},
    o:{x:451,y:145,title:'くちびるを丸く',tip:'口を丸くして、少し開こう。'},
    e:{x:881,y:145,title:'丸めず、軽く開く',tip:'くちびるを丸めず、舌は奥へ。'},
    i:{x:18,y:632,title:'横に軽く広げる',tip:'口を横に軽く広げて、舌を前の高い位置へ。'},
    u:{x:451,y:632,title:'丸く、小さく、少し前へ',tip:'くちびるを寄せて、少し前へ。舌は奥の高い位置へ。'},
    'ü':{x:881,y:632,title:'少し平たい丸・舌は前',tip:'u より前に出しすぎず、やわらかく丸めよう。舌は i の位置へ。'}
  };
  function mouthFrame(id,rest){return '<svg id="'+id+'" viewBox="18 145 412 378" role="img"'+(rest?' aria-hidden="true"':'')+' aria-label="" focusable="false"><image href="./assets/articulation/vowel-'+(rest?'rest':'mouth')+'-101.png" width="1312" height="1199" /></svg>'}
  function renderMouth(letter){window.KP135.parkVowel();var d=window.KP134.data[letter],box=el('kidsVowelMouth');if(!d||!box)return;box.dataset.letter=letter;box.dataset.state='reference';box.hidden=false;box.innerHTML='<div class="kids-vowel-mouth-heading"><span>口形・舌・息</span><small>四声でも、母音の基本的な構えは同じ</small></div>'+window.KP134.panel(letter,'v134')+'<div id="kidsVowelMouthStatus" class="kids-vowel-mouth-status" role="status" aria-live="polite"></div>';window.KP134.warm([letter]);window.KP135.vowel(letter);setMouthState('reference')}
  function setMouthState(state,letter){
    if(mouthRestTimer!==null){clearTimeout(mouthRestTimer);mouthRestTimer=null}
    var box=el('kidsVowelMouth');if(!box||box.hidden)return;
    if(letter&&(!aFlow||aFlow.letter!==letter||aFlow.quizStarted))return;
    box.dataset.state=state;
    var status=el('kidsVowelMouthStatus');
    if(status)status.textContent=state==='playing'?'声を出すあいだ、この形をキープ':state==='waiting'?'音声を読み込んでいます…':state==='rest'?'力をぬいて、ひと休み':state==='error'?'もう一度、音を押してみよう':'音を押して、口の形も見てみよう';
    document.querySelectorAll('#kidsVowelToneGrid button, #kidsAImitateChoices button').forEach(function(b){b.classList.remove('is-sounding')});
  }
  function relaxMouth(letter,requestId){
    setMouthState('rest',letter);var session=aFlow;
    if(!session||session.letter!==letter||session.quizStarted)return;
    mouthRestTimer=setTimeout(function(){
      mouthRestTimer=null;var box=el('kidsVowelMouth');
      if(requestId===audioRequestId&&aFlow===session&&!session.quizStarted&&box&&!box.hidden&&box.dataset.state==='rest')setMouthState('reference',letter);
    },420);
  }
  function cancelIntroTones(){introToneEpoch++;introTonePending=null;introToneBusy=false;}
  function loadProgress(){
    try{completed=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(e){completed={}}
    try{mastery=JSON.parse(localStorage.getItem(MASTERY_STORE)||'{}')||{}}catch(e){mastery={}}
    /* 10.108.00 migration: older builds could mark o/e/i/u/ü complete without steps 2–4.
       Keep only completion backed by a passed mini-check so no vowel can be skipped. */
    ['a','o','e','i','u','ü'].forEach(function(letter){if(!(mastery[letter]&&mastery[letter].passed))delete completed[letter]});
  }
  function saveProgress(){
    try{localStorage.setItem(STORE,JSON.stringify(completed))}catch(e){}
    try{localStorage.setItem(MASTERY_STORE,JSON.stringify(mastery))}catch(e){}
    try{window.dispatchEvent(new CustomEvent('koepandaVowelProgressChanged',{detail:{completed:completed,mastery:mastery}}))}catch(e){}
  }
  function enterKids(ev){if(typeof window.koepandaEnterKidsCourse==='function')return window.koepandaEnterKidsCourse(ev);document.body.classList.remove('app-home-mode','app-function-mode','app-area-listen','app-area-chat','app-area-repeat','app-area-settings');document.body.classList.add('app-kids-mode');var c=el('kidsCourse');if(c)c.setAttribute('aria-hidden','false');try{history.replaceState(null,'',location.pathname+location.search+'#kidsCourse')}catch(e){}requestAnimationFrame(function(){window.scrollTo({top:0,left:0,behavior:'auto'})})}
  function leaveKids(){cancelIntroTones();stopAudio();clearImitateRecording();document.body.classList.remove('app-kids-mode');var c=el('kidsCourse');if(c)c.setAttribute('aria-hidden','true');if(typeof window.returnToAppHome==='function')window.returnToAppHome();else{document.body.classList.add('app-home-mode');window.scrollTo(0,0)}}
  function stopAudio(){if(window.KP134)window.KP134.stopFor(el('kidsVowelDrill'));audioRequestId++;if(audioCleanup){audioCleanup();audioCleanup=null}setMouthState('reference');var oldAudio=localAudio;localAudio=null;try{if(oldAudio){oldAudio.pause();oldAudio.currentTime=0}}catch(e){}try{if(typeof pinyinSource!=='undefined'&&pinyinSource){pinyinSource.stop();pinyinSource.disconnect();pinyinSource=null}}catch(e){}try{if('speechSynthesis' in window)window.speechSynthesis.cancel()}catch(e){}}

  /* Verified 10.107.68 pronunciation source. 10.107.92 keeps the same MP3s but reuses one preloaded Audio element per syllable/tone on iPhone Safari. */
  var PINYIN_AUDIO_BASE='https://raw.githubusercontent.com/byhow/yanyu/main/pinyin-syllables/';
  function audioKey(letter,tone){var base=letter==='i'?'yi':(letter==='u'?'wu':(letter==='ü'?'yu':letter));return base+tone}
  /* 10.108.02 teaching-tempo calibration.
     Tone 1/3 need enough duration to hear the contour; tone 2/4 stay crisp but are no longer clipped.
     o uses wo*.mp3, so only a very small onset trim is kept to reduce the initial w without cutting the vowel body. */
  var PINYIN_PLAYBACK_PROFILE={
    a:{1:{rate:.90,start:0},2:{rate:.92,start:0},3:{rate:.90,start:0},4:{rate:.94,start:0}},
    o:{1:{rate:.86,start:.025},2:{rate:.89,start:.015},3:{rate:.88,start:.025},4:{rate:.89,start:.015}},
    e:{1:{rate:.90,start:0},2:{rate:.92,start:0},3:{rate:.90,start:0},4:{rate:.94,start:0}},
    i:{1:{rate:.90,start:0},2:{rate:.92,start:0},3:{rate:.90,start:0},4:{rate:.94,start:0}},
    u:{1:{rate:.90,start:0},2:{rate:.92,start:0},3:{rate:.90,start:0},4:{rate:.94,start:0}},
    'ü':{1:{rate:.90,start:0},2:{rate:.92,start:0},3:{rate:.90,start:0},4:{rate:.94,start:0}}
  };
  function audioInfo(letter,tone){var isO=letter==='o',key=isO?('wo'+tone):audioKey(letter,tone),src=PINYIN_AUDIO_BASE+key+'.mp3';return {isO:isO,key:key,src:src,profile:(PINYIN_PLAYBACK_PROFILE[letter]&&PINYIN_PLAYBACK_PROFILE[letter][tone])||{rate:1,start:0}}}
  function getPinyinAudio(letter,tone){return {audio:window.KP134.audioFor(letter,tone),info:{key:letter+tone,profile:{rate:.9,start:0}}}}
  function warmPinyin(letter){window.KP134.warm([letter])}
  function showAudioMissing(letter,tone){var msg='音声の読み込みに失敗しました。通信状態を確認して、もう一度押してください。';console.error(msg,letter,tone);var hint=el('kidsToneHint');if(hint)hint.textContent='⚠ '+msg}
  function playLocalPinyin(letter,tone,ended,started){stopAudio();var request=audioRequestId;setMouthState('waiting',letter);return window.KP134.play(letter,{tone:tone,button:document.querySelector('#kidsVowelToneGrid [data-tone="'+tone+'"]'),root:el('kidsVowelDrill'),onPlaying:function(a){if(request===audioRequestId){localAudio=a;setMouthState('playing',letter);var card=document.querySelector('#kidsVowelToneGrid [data-tone="'+tone+'"]');if(card)card.classList.add('is-sounding');if(started)started()}},onEnded:function(){if(request===audioRequestId){relaxMouth(letter,request);if(ended)ended()}},onError:function(){if(request===audioRequestId){setMouthState('error',letter);showAudioMissing(letter,tone)}}}).catch(function(e){if(e&&e.name!=='AbortError')showAudioMissing(letter,tone);return null})}
  function playToneExample(tone){return playLocalPinyin('a',tone)}
  function playVowelExample(v,tone,ended,started){return playLocalPinyin(v.letter,tone,ended,started)}
  function playIntroToneSerialized(v,tone,ended,started){introTonePending=null;introToneBusy=false;introToneEpoch++;return playVowelExample(v,tone,ended,started)}
  window.koepandaPlayToneIntro=playToneExample;
  function toneMarks(letter){var m={a:['ā','á','ǎ','à'],o:['ō','ó','ǒ','ò'],e:['ē','é','ě','è'],i:['ī','í','ǐ','ì'],u:['ū','ú','ǔ','ù'],'ü':['ǖ','ǘ','ǚ','ǜ']};return m[letter]||[letter,letter,letter,letter]}
  function toneContour(tone){
    var paths=['M10 14 H98','M10 54 Q54 42 98 12','M10 32 Q46 66 60 54 Q80 38 98 14','M10 12 Q55 33 98 58'];
    return '<svg class="vowel-tone-contour" viewBox="0 0 108 70" aria-hidden="true" focusable="false"><path class="contour-guide" d="M10 62 H98"/><path class="contour-line" d="'+paths[tone-1]+'"/><circle class="contour-start" cx="10" cy="'+[14,54,32,12][tone-1]+'" r="3"/></svg>';
  }
  function toneLabels(){return ['高く平ら','低めから一気に上へ','低く下げてから上がる','高い所から一気に下へ']}
  function renderTones(){var box=el('kidsToneGrid');if(!box)return;box.replaceChildren();data.tones.forEach(function(t){var b=document.createElement('button');b.type='button';b.className='kids-tone-card tone-'+t.tone;b.innerHTML='<span class="mark">'+t.mark+'</span><b>'+t.label+'</b><small>'+t.jp+'</small>';b.addEventListener('click',function(){box.querySelectorAll('.kids-tone-card').forEach(function(x){x.classList.remove('is-active')});b.classList.add('is-active');var hint=el('kidsToneHint');if(hint)hint.textContent=t.label+'：'+t.jp+'。声の動きを聞こう。';playToneExample(t.tone)});box.appendChild(b)})}

  function visibleVowels(){if(!activeLetters||!activeLetters.length)return data.vowels.slice();return activeLetters.map(function(letter){return data.vowels.find(function(v){return v.letter===letter})}).filter(Boolean)}
  function isUnlocked(letter){
    if(!activeLetters||!activeLetters.length)return true;
    var idx=activeLetters.indexOf(letter);if(idx<=0)return true;
    var prev=activeLetters[idx-1];
    return !!(mastery[prev]&&mastery[prev].passed);
  }
  window.koepandaIsVowelUnlocked=isUnlocked;
  window.koepandaIsUnitComplete=function(id){
    if(id==='P1')return ['a','o','e'].every(function(x){return !!(mastery[x]&&mastery[x].passed)});
    if(id==='P2')return ['i','u','ü'].every(function(x){return !!(mastery[x]&&mastery[x].passed)});
    return false;
  };
  function updateProgress(){
    var list=visibleVowels(),done=list.filter(function(v){return !!completed[v.letter]}).length,total=list.length||6,p=el('kidsVowelOverviewProgress');
    if(p){if(activeLetters&&activeLetters[0]==='a'&&!(mastery.a&&mastery.a.passed))p.textContent='まず a のレッスンをクリアすると、o が開くよ';else p.textContent=done===0?'最初の母音からはじめよう':(done<total?'できた母音 '+done+' / '+total:(activeGroupTitle?activeGroupTitle+'、ぜんぶできた！':'6つの母音、ぜんぶできた！'))}
    document.querySelectorAll('.kids-vowel-button').forEach(function(b){var letter=b.dataset.letter,unlocked=isUnlocked(letter);b.classList.toggle('is-complete',!!completed[letter]);b.classList.toggle('is-locked',!unlocked);b.disabled=!unlocked;b.setAttribute('aria-disabled',unlocked?'false':'true')});
    var note=el('kidsFinishNote');if(note){note.textContent='';note.classList.remove('is-visible')}
  }

  function ensureDrill(){
    if(el('kidsVowelDrill'))return el('kidsVowelDrill');var grid=el('kidsVowelGrid');if(!grid)return null;
    var progress=document.createElement('div');progress.id='kidsVowelOverviewProgress';progress.className='kids-vowel-overview-progress';grid.insertAdjacentElement('afterend',progress);
    var d=document.createElement('div');d.id='kidsVowelDrill';d.className='kids-vowel-drill';d.hidden=true;
    d.innerHTML=''
      +'<div class="kids-vowel-drill-head"><button type="button" class="kids-vowel-drill-back" id="kidsVowelDrillBack">← 戻る　母音一覧</button><div class="kids-vowel-drill-title"><b id="kidsVowelDrillTitle">a の四声</b><small id="kidsVowelDrillSubtitle">きく → まねる → たしかめる</small></div></div>'
      +'<div class="kids-vowel-drill-hero"><img id="kidsVowelDrillImage" alt=""><div><div class="kids-vowel-drill-letter" id="kidsVowelDrillLetter">a</div><div class="kids-vowel-drill-tip" id="kidsVowelDrillTip"></div></div></div>'
      +'<div class="kids-a-progress" id="kidsAProgress" hidden><span data-step="listen">1 きく</span><span data-step="imitate">2 まねる</span><span data-step="quiz">3 チェック</span></div>'
      +'<section class="vowel-teaching-zone" id="kidsVowelTeaching" aria-labelledby="kidsVowelTeachingTitle"><div class="vowel-zone-head"><span class="vowel-zone-number">01</span><div><h2 id="kidsVowelTeachingTitle">聞いて、声調を知ろう</h2><p>口の形と、声の動きを見てみよう</p></div></div>'
      +'<section class="kids-vowel-mouth" id="kidsVowelMouth" data-state="reference"><div class="kids-vowel-mouth-heading"><span>口のかたち</span><small>四声が変わっても、口の形は同じ</small></div><div class="kids-vowel-mouth-main"><div class="kids-vowel-mouth-art">'+mouthFrame('kidsVowelMouthPose',false)+mouthFrame('kidsVowelMouthRest',true)+'</div><div class="kids-vowel-mouth-copy"><strong id="kidsVowelMouthTitle"></strong><p id="kidsVowelMouthTip"></p><p class="kids-vowel-mouth-compare" id="kidsVowelMouthCompare" hidden>u は舌が奥、ü は舌が前。<br>どちらも、息を強く吹く必要はないよ。</p></div></div><div class="kids-vowel-mouth-status" id="kidsVowelMouthStatus" role="status" aria-live="polite"></div></section>'
      +'<div class="kids-vowel-tone-title">4つの声の動き<span>押して聞く</span></div><div class="kids-vowel-tone-grid" id="kidsVowelToneGrid"></div></section>'
      +'<section class="kids-a-stage" id="kidsAEarStage" hidden><div class="kids-a-stage-head"><span>👂</span><div><b>耳でえらんでみよう</b><small>音を1回聞いて、どの声調か選ぼう</small></div></div><button type="button" class="kids-a-listen-button" id="kidsAEarListen">▶ もう一度聞く</button><div class="kids-a-choice-row" id="kidsAEarChoices"></div><div class="kids-a-feedback" id="kidsAEarFeedback"></div></section>'
      +'<section class="kids-a-stage kids-a-imitate-stage" id="kidsAImitateStage" hidden aria-labelledby="kidsVowelPracticeTitle"><div class="vowel-zone-head"><span class="vowel-zone-number">02</span><div><h2 id="kidsVowelPracticeTitle">えらんで、まねよう</h2><p>好きな声調で、くり返し練習</p></div></div><div class="kids-a-choice-row kids-a-imitate-choices" id="kidsAImitateChoices" aria-label="練習する声調"></div><p class="vowel-practice-hint">押して聞く → まねして録音</p><div class="practice-console vowel-practice-console"><div class="vowel-practice-target" id="kidsAImitateTarget" aria-live="polite"></div><div class="kids-a-record-row"><button type="button" class="kids-a-record-button" id="kidsAImitateRecord">● 録音する</button><button type="button" class="kids-a-playback-button" id="kidsAImitatePlayback" disabled>▶ 自分の声<br>を聞く</button></div><div class="kids-a-feedback" id="kidsAImitateFeedback"></div></div></section>'
      +'<section class="vowel-check-entry" id="kidsVowelCheckEntry" aria-labelledby="kidsVowelCheckTitle"><div class="vowel-zone-head"><span class="vowel-zone-number">03</span><div><h2 id="kidsVowelCheckTitle">ミニチェック</h2><p>いつでも、ここから挑戦できます</p></div></div><button type="button" class="kids-a-confirm-button kids-a-to-quiz" id="kidsAToQuiz">ミニチェックへ →</button></section>'
      +'<section class="kids-a-stage" id="kidsAQuizStage" hidden><div class="kids-a-stage-head"><span>⭐</span><div><b>声調のミニチェック</b><small>音を聞いて、4つの声調から選ぼう</small></div></div><div class="kids-a-quiz-count" id="kidsAQuizCount">1 / 4</div><button type="button" class="kids-a-listen-button" id="kidsAQuizListen">▶ 音を聞く</button><div class="kids-a-choice-row" id="kidsAQuizChoices"></div><div class="kids-a-feedback" id="kidsAQuizFeedback"></div><button type="button" class="kids-a-next-question" id="kidsAQuizNext" hidden>次の問題へ →</button></section>'
      +'<section class="kids-a-result" id="kidsAResult" hidden aria-live="polite"><div class="kids-a-result-badge" id="kidsAResultBadge">✓</div><div class="kids-a-result-copy"><strong id="kidsAResultTitle">ミニチェック結果</strong><span id="kidsAResultScore">4問中 0問正解</span><small id="kidsAResultMessage"></small></div><button type="button" class="kids-a-result-action" id="kidsAResultAction"></button></section>'
      +'<section class="kids-a-reward" id="kidsAReward" hidden><div class="kids-a-reward-icon">🌱</div><div><strong>a クリア！</strong><span>「はじめての音」バッジをゲット</span><small>o のレッスンが開いたよ</small></div></section>'
      +'<div class="kids-vowel-write" hidden><b>✍️ 声調記号もいっしょに覚えよう</b><div class="kids-vowel-trace-row" id="kidsVowelTraceRow"></div></div><div class="kids-vowel-special-note" id="kidsVowelSpecialNote" hidden></div>'
      +'<div class="kids-vowel-drill-actions"><button type="button" class="kids-vowel-complete" id="kidsVowelComplete" hidden>この母音、できた！</button><button type="button" class="kids-vowel-back-bottom" id="kidsVowelBackBottom">戻る</button></div>';
    progress.insertAdjacentElement('afterend',d);
    el('kidsVowelDrillBack').addEventListener('click',closeDrill);el('kidsVowelBackBottom').addEventListener('click',closeDrill);el('kidsVowelComplete').addEventListener('click',completeCurrent);
    el('kidsAEarListen').addEventListener('click',function(){if(!aFlow)return;var btn=this;pulseButton(btn);aFlow.earPlayed=true;btn.textContent='▶ もう一度聞く';setEarChoicesEnabled(true);playLocalPinyin(aFlow.letter,aFlow.earTone)});
    el('kidsAImitateRecord').addEventListener('click',toggleImitateRecording);
    el('kidsAImitatePlayback').addEventListener('click',playImitateRecording);
    el('kidsAToQuiz').addEventListener('click',startAQuiz);
    el('kidsAQuizListen').addEventListener('click',playCurrentQuizTone);
    el('kidsAQuizNext').addEventListener('click',nextQuizQuestion);
    return d;
  }

  var imitateRecorder=null,imitateStream=null,imitateChunks=[],imitateAudioUrl='',imitateAudio=null;
  function clearImitateRecording(){
    if(window.KP134)window.KP134.stopFor(el('kidsVowelDrill'));
    if(imitateAudio){try{imitateAudio.pause()}catch(e){} imitateAudio=null}
    if(imitateAudioUrl){try{URL.revokeObjectURL(imitateAudioUrl)}catch(e){} imitateAudioUrl=''}
    if(imitateStream){try{window.KP134.releaseMicrophone(imitateStream)}catch(e){} imitateStream=null}
    imitateRecorder=null;imitateChunks=[];
    var rec=el('kidsAImitateRecord'),play=el('kidsAImitatePlayback');
    if(rec){rec.textContent='● 録音する';rec.classList.remove('is-recording')}
    if(play)play.disabled=true;
  }
  function mimeForRecording(){
    if(typeof MediaRecorder==='undefined')return '';
    var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];
    for(var i=0;i<types.length;i++){try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}}
    return '';
  }
  function startImitateRecording(){
    if(!aFlow)return;cancelIntroTones();stopAudio();var session=aFlow,key=session.letter,button=el('kidsAImitateRecord'),playback=el('kidsAImitatePlayback'),fb=el('kidsAImitateFeedback');
    if(imitateAudioUrl){URL.revokeObjectURL(imitateAudioUrl);imitateAudioUrl=''}
    window.KP134.capture(el('kidsVowelDrill'),button,playback,key,fb,function(letter,url){if(aFlow!==session||aFlow.letter!==letter){URL.revokeObjectURL(url);return}imitateAudioUrl=url;button.textContent='↻ もう一度録音';session.imitateDone=true;markAProgress()});
  }
  function stopImitateRecording(){var root=el('kidsVowelDrill');if(window.KP134.isRecording(root))window.KP134.capture(root,el('kidsAImitateRecord'),el('kidsAImitatePlayback'),aFlow&&aFlow.letter,el('kidsAImitateFeedback'),function(){})}
  function toggleImitateRecording(){if(window.KP134.isRecording(el('kidsVowelDrill')))stopImitateRecording();else startImitateRecording()}
  function pulseButton(btn){if(!btn)return;btn.classList.remove('is-pressed');void btn.offsetWidth;btn.classList.add('is-pressed');setTimeout(function(){btn.classList.remove('is-pressed')},180)}
  function playImitateRecording(){if(!imitateAudioUrl||!aFlow)return;var btn=el('kidsAImitatePlayback');pulseButton(btn);function clear(){btn.classList.remove('is-playing')}window.KP134.play(aFlow.letter,{root:el('kidsVowelDrill'),clipUrl:imitateAudioUrl,referenceVisual:false,rate:1,button:btn,onPlaying:function(){btn.classList.add('is-playing')},onEnded:clear,onCancel:clear,onError:function(){clear();el('kidsAImitateFeedback').textContent='録音を再生できませんでした。もう一度押してね。'}}).catch(function(){clear()})}
  function randomEarTone(){return 1+Math.floor(Math.random()*4)}
  var lastQuizOrder='';
  function randomQuizOrder(){
    var arr=[1,2,3,4],i,j,t;
    do{
      for(i=arr.length-1;i>0;i--){j=Math.floor(Math.random()*(i+1));t=arr[i];arr[i]=arr[j];arr[j]=t}
    }while(arr.join(',')===lastQuizOrder);
    lastQuizOrder=arr.join(',');
    return arr.slice();
  }
  function setEarChoicesEnabled(enabled){var box=el('kidsAEarChoices');if(!box)return;box.querySelectorAll('button').forEach(function(b){b.disabled=!enabled})}
  function resetAFlow(letter){clearImitateRecording();aFlow={letter:letter||'a',earTone:randomEarTone(),earPlayed:false,imitateTone:1,earDone:false,imitateDone:false,quizOrder:randomQuizOrder(),quizIndex:0,quizCorrect:0,quizAnswered:false,quizStarted:false,quizDone:false,passed:false}}
  function markAProgress(){
    var p=el('kidsAProgress');if(!p||!aFlow)return;var listenDone=Object.keys(heard).length===4;
    var states={listen:listenDone,ear:aFlow.earDone,imitate:aFlow.imitateDone,quiz:aFlow.passed};
    p.querySelectorAll('span').forEach(function(s){s.classList.toggle('is-done',!!states[s.dataset.step])});
    var ear=el('kidsAEarStage'),imit=el('kidsAImitateStage'),quiz=el('kidsAQuizStage');
    var teaching=el('kidsVowelTeaching'),entry=el('kidsVowelCheckEntry');if(teaching)teaching.hidden=aFlow.quizStarted;if(entry)entry.hidden=aFlow.quizStarted;
    if(ear)ear.hidden=true;var mouth=el('kidsVowelMouth');if(mouth)mouth.hidden=aFlow.quizStarted;if(imit)imit.hidden=aFlow.quizStarted;if(quiz)quiz.hidden=!aFlow.quizStarted||aFlow.quizDone;
    /* The legacy ear exercise stays hidden; the mini-check is the explicit assessment entry. */
  }
  function buildToneChoices(containerId,handler){var box=el(containerId);if(!box)return;box.replaceChildren();toneMarks(aFlow&&aFlow.letter?aFlow.letter:'a').forEach(function(mark,k){var b=document.createElement('button');b.type='button';b.className='kids-a-tone-choice';b.innerHTML='<strong>'+mark+'</strong><small>'+(k+1)+'声</small>';b.addEventListener('click',function(){handler(k+1,b)});box.appendChild(b)})}

  function updateImitateTarget(){
    if(!aFlow)return;var target=el('kidsAImitateTarget');if(target)target.textContent='録音する音：'+toneMarks(aFlow.letter)[aFlow.imitateTone-1]+'（'+aFlow.imitateTone+'声）';
  }
  function renderImitateChoices(){
    var box=el('kidsAImitateChoices');if(!box||!aFlow)return;box.replaceChildren();
    toneMarks(aFlow.letter).forEach(function(mark,k){var tone=k+1,b=document.createElement('button');b.type='button';b.className='kids-a-tone-choice'+(tone===aFlow.imitateTone?' is-selected':'');b.innerHTML='<strong>'+mark+'</strong><small>'+tone+'声</small>';b.setAttribute('aria-label',mark+' '+tone+'声で練習');b.setAttribute('aria-pressed',tone===aFlow.imitateTone?'true':'false');b.addEventListener('click',function(){if(!aFlow)return;if(aFlow.imitateTone!==tone){aFlow.imitateTone=tone;aFlow.imitateDone=false;clearImitateRecording();var fb=el('kidsAImitateFeedback');if(fb){fb.textContent='';fb.className='kids-a-feedback'};markAProgress()}box.querySelectorAll('.kids-a-tone-choice').forEach(function(x){x.classList.remove('is-selected');x.setAttribute('aria-pressed','false')});b.classList.add('is-selected');b.setAttribute('aria-pressed','true');updateImitateTarget();pulseButton(b);cancelIntroTones();playLocalPinyin(aFlow.letter,tone)});box.appendChild(b)});updateImitateTarget();
  }
  function renderAEarChoices(){buildToneChoices('kidsAEarChoices',function(tone,b){if(!aFlow||aFlow.earDone||!aFlow.earPlayed)return;var fb=el('kidsAEarFeedback');if(tone===aFlow.earTone){aFlow.earDone=true;b.classList.add('is-good');if(fb){fb.textContent='✨ 正解！' ;fb.className='kids-a-feedback is-good'};markAProgress()}else{b.classList.add('is-try');if(fb){fb.textContent='もう一度聞いてみよう。まちがえても大丈夫 👂';fb.className='kids-a-feedback'};setTimeout(function(){b.classList.remove('is-try');playLocalPinyin(aFlow.letter,aFlow.earTone)},180)}});setEarChoicesEnabled(!!(aFlow&&aFlow.earPlayed))}
  function startAQuiz(){
    if(!aFlow)return;
    cancelIntroTones();stopAudio();clearImitateRecording();
    aFlow.quizStarted=true;aFlow.quizDone=false;aFlow.passed=false;
    aFlow.quizOrder=randomQuizOrder();aFlow.quizIndex=0;aFlow.quizCorrect=0;
    el('kidsAResult').hidden=true;el('kidsAReward').hidden=true;
    renderQuizQuestion();markAProgress();
    requestAnimationFrame(function(){el('kidsAQuizStage').scrollIntoView({block:'start',behavior:'smooth'})});
  }
  function playCurrentQuizTone(){if(!aFlow||!aFlow.quizStarted||aFlow.quizDone)return;var session=aFlow,index=aFlow.quizIndex;aFlow.quizHeard=false;el('kidsAQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true});playLocalPinyin(aFlow.letter,aFlow.quizOrder[index],function(){if(aFlow===session&&aFlow.quizIndex===index&&!aFlow.quizAnswered){aFlow.quizHeard=true;el('kidsAQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=false})}})}
  function renderQuizQuestion(){
    if(!aFlow)return;var count=el('kidsAQuizCount'),fb=el('kidsAQuizFeedback'),next=el('kidsAQuizNext');if(count)count.textContent=(aFlow.quizIndex+1)+' / 4';if(fb){fb.textContent='';fb.className='kids-a-feedback'}if(next)next.hidden=true;aFlow.quizAnswered=false;aFlow.quizHeard=false;
    buildToneChoices('kidsAQuizChoices',function(tone,b){if(!aFlow||aFlow.quizAnswered||aFlow.quizDone||!aFlow.quizHeard)return;aFlow.quizAnswered=true;var correct=aFlow.quizOrder[aFlow.quizIndex],box=el('kidsAQuizChoices');if(tone===correct){aFlow.quizCorrect++;b.classList.add('is-good');if(fb){fb.textContent='✨ 正解！';fb.className='kids-a-feedback is-good'}}else{b.classList.add('is-wrong');if(box){Array.prototype.forEach.call(box.children,function(x,idx){if(idx+1===correct)x.classList.add('is-good')})}if(fb){fb.textContent='答えは '+toneMarks(aFlow.letter)[correct-1]+'。音をもう一度聞いてみよう';fb.className='kids-a-feedback'}}if(aFlow.quizIndex===3){if(next)next.hidden=true;var quizSession=aFlow;setTimeout(function(){if(aFlow===quizSession&&aFlow.quizStarted&&aFlow.quizAnswered&&!aFlow.quizDone)finishAQuiz()},650)}else if(next){next.hidden=false;next.textContent='次の問題へ'}})
    el('kidsAQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true});
  }
  function nextQuizQuestion(){if(!aFlow||!aFlow.quizAnswered)return;if(aFlow.quizIndex<3){aFlow.quizIndex++;renderQuizQuestion();playCurrentQuizTone();return}finishAQuiz()}
  function showVowelCelebration(letter,score){
    var old=document.getElementById('kidsVowelCelebration');if(old)old.remove();
    var perfect=score===4,wrap=document.createElement('div');wrap.id='kidsVowelCelebration';wrap.className='kids-vowel-celebration'+(perfect?' is-perfect':'');
    wrap.innerHTML='<div class="kids-vowel-celebration-burst" aria-hidden="true"><i>✦</i><i>★</i><i>✧</i><i>●</i><i>★</i><i>✦</i><i>●</i><i>✧</i></div><div class="kids-vowel-celebration-card"><div class="kids-vowel-celebration-mascot">🐼</div><b>'+(perfect?'PERFECT!':'やった！')+'</b><strong>'+score+' / 4　'+letter+' クリア！</strong><span>'+(perfect?'4問ぜんぶ正解！ すごい！':'3問できた！ 次の音がひらいたよ')+'</span></div>';
    document.body.appendChild(wrap);requestAnimationFrame(function(){wrap.classList.add('is-show')});
    setTimeout(function(){wrap.classList.add('is-leaving');setTimeout(function(){if(wrap.parentNode)wrap.remove()},420)},perfect?2100:1700);
  }
  function retryAQuiz(){
    if(!aFlow)return;
    var quiz=el('kidsAQuizStage'),result=el('kidsAResult'),reward=el('kidsAReward');
    if(result)result.hidden=true;if(reward)reward.hidden=true;if(quiz)quiz.hidden=false;
    aFlow.quizOrder=randomQuizOrder();aFlow.quizIndex=0;aFlow.quizCorrect=0;aFlow.quizAnswered=false;aFlow.quizDone=false;aFlow.quizStarted=true;aFlow.passed=false;
    renderQuizQuestion();playCurrentQuizTone();
    requestAnimationFrame(function(){if(quiz)quiz.scrollIntoView({block:'start',behavior:'smooth'})});
  }
  function finishAQuiz(){
    aFlow.quizDone=true;var passed=aFlow.quizCorrect>=3;aFlow.passed=passed;
    var quiz=el('kidsAQuizStage'),result=el('kidsAResult'),reward=el('kidsAReward');
    if(quiz)quiz.hidden=true;if(result)result.hidden=false;if(reward)reward.hidden=!passed;
    var letter=aFlow.letter,total=4,badge=el('kidsAResultBadge'),title=el('kidsAResultTitle'),score=el('kidsAResultScore'),msg=el('kidsAResultMessage'),action=el('kidsAResultAction');
    if(badge){badge.textContent=passed?'✓':'↻';badge.className='kids-a-result-badge '+(passed?'is-pass':'is-retry')}
    if(title)title.textContent=passed?'ミニチェック合格！':'あと一歩！';
    if(score)score.textContent=total+'問中 '+aFlow.quizCorrect+'問正解';
    if(msg)msg.textContent=passed?'4つの声調を聞き分けられたよ。':'3問以上でクリア。苦手な声調をもう一度聞いて挑戦しよう。';
    var list=visibleVowels(),pos=list.findIndex(function(v){return v.letter===letter}),nextVowel=(pos>=0&&pos+1<list.length)?list[pos+1]:null;
    if(action){
      action.textContent=passed?(nextVowel?('次へ：'+nextVowel.letter+' →'):'母音一覧へ戻る →'):'もう一度やってみる';
      action.onclick=passed?function(){completeCurrent()}:retryAQuiz;
    }
    if(passed){
      mastery[letter]={passed:true,score:aFlow.quizCorrect,total:4,updatedAt:Date.now()};completed[letter]=true;saveProgress();
      var rewardStrong=reward?reward.querySelector('strong'):null,rewardSpan=reward?reward.querySelector('span'):null,rewardSmall=reward?reward.querySelector('small'):null;
      if(reward){if(rewardStrong)rewardStrong.textContent=letter+' クリア！';if(rewardSpan)rewardSpan.textContent=letter==='a'?'「はじめての音」バッジをゲット':'4つの声調チェック、よくできた！';if(rewardSmall)rewardSmall.textContent=nextVowel?(nextVowel.letter+' のレッスンが開いたよ'):(activeGroupTitle?activeGroupTitle+' クリア！':'母音レッスン、ここまでクリア！')}
      var complete=el('kidsVowelComplete');if(complete){complete.disabled=false;complete.textContent=nextVowel?('次へ：'+nextVowel.letter+' を見てみる'):'母音一覧へ戻る'};markAProgress();updateProgress()
    }
    var celebration={score:aFlow.quizCorrect,total:4,passed:passed,title:passed?(letter+' のミニチェック合格！'):'あと一歩！',message:passed?(aFlow.quizCorrect===4?'4つの声調をぜんぶ聞き分けられたね！':'4つの声調を聞き分けられたよ。あと1問で満点！'):'苦手な声調だけ確認して、もう一度挑戦しよう。'};
    if(window.koepandaAttachResultReplay)window.koepandaAttachResultReplay(result,celebration);
    if(window.koepandaQueueResultCelebration)window.koepandaQueueResultCelebration(celebration,90);else if(window.koepandaShowResultCelebration)window.setTimeout(function(){window.koepandaShowResultCelebration(celebration)},90);else if(passed)showVowelCelebration(letter,aFlow.quizCorrect);
    requestAnimationFrame(function(){if(result)result.scrollIntoView({block:'center',behavior:'smooth'})});
  }

  // Align content, never the fixed navigation bar. Recheck after header layout.
  function placeVowelEntry(anchor){
    function align(){
      if(!anchor||!anchor.isConnected||!anchor.getClientRects().length)return;
      var header=document.getElementById('kp148VowelHeader');
      if(!header||!header.getClientRects().length)header=document.querySelector('.kp148-lesson-header');
      var bottom=header&&header.getClientRects().length?header.getBoundingClientRect().bottom:0;
      window.scrollTo({top:Math.max(0,anchor.getBoundingClientRect().top+window.scrollY-bottom-10),left:0,behavior:'instant'});
    }
    align();requestAnimationFrame(align);
  }
  window.koepandaPlaceVowelEntry=placeVowelEntry;
  function renderDrill(i){
    cancelIntroTones();stopAudio();vowelIndex=i;heard={};introToneLastEnd=0;var v=data.vowels[i],d=ensureDrill();if(!d)return;warmPinyin(v.letter);
    el('kidsVowelDrillTitle').textContent=v.letter+' の四声';el('kidsVowelDrillSubtitle').textContent='聞く → 自由練習 → ミニチェック';el('kidsVowelDrillLetter').textContent=v.letter;el('kidsVowelDrillImage').src=v.image;el('kidsVowelDrillImage').alt=v.sceneTitle||v.letter;el('kidsVowelDrillTip').textContent=v.note;
    var p=el('kidsAProgress'),ear=el('kidsAEarStage'),imit=el('kidsAImitateStage'),quiz=el('kidsAQuizStage'),result=el('kidsAResult'),reward=el('kidsAReward');if(p)p.hidden=false;if(ear)ear.hidden=true;if(imit)imit.hidden=true;if(quiz)quiz.hidden=true;if(result)result.hidden=true;if(reward)reward.hidden=true;
    var marks=toneMarks(v.letter),labels=['高く、平らに','低めから、上へ','下げてから、上へ','高い音から、下へ'],g=el('kidsVowelToneGrid');g.replaceChildren();
    marks.forEach(function(mark,k){var tone=k+1,b=document.createElement('button');b.type='button';b.className='kids-vowel-tone-btn';b.innerHTML='<span class="vowel-tone-card-top"><b>'+tone+'声</b><span class="tone-mark">'+mark+'</span></span>'+toneContour(tone)+'<small>'+labels[k]+'</small>';b.dataset.tone=tone;b.setAttribute('aria-label',mark+' '+tone+'声を聞く');b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){var session=aFlow;g.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});var hint=el('kidsVowelToneHint');if(hint)hint.textContent=tone+'声：'+labels[k];playIntroToneSerialized(v,tone,function(){if(aFlow===session&&aFlow.letter===v.letter){heard[tone]=true;markAProgress()}},function(){if(aFlow===session&&aFlow.letter===v.letter)b.classList.add('is-heard')})});g.appendChild(b)});
    var tr=el('kidsVowelTraceRow');tr.replaceChildren();marks.forEach(function(mark){var x=document.createElement('div');x.className='kids-vowel-trace';x.textContent=mark;tr.appendChild(x)});
    var sp=el('kidsVowelSpecialNote');if(v.letter==='ü'){sp.hidden=false;sp.innerHTML='<strong>u と ü は別の音。</strong> ü は u の上に点が2つ。<br>j・q・x ＋ ü は <strong>ju・qu・xu</strong> と書くけれど、点を省くだけで発音は ü のまま。'}else{sp.hidden=true;sp.textContent=''}
    var complete=el('kidsVowelComplete');resetAFlow(v.letter);renderMouth(v.letter);renderAEarChoices();renderImitateChoices();if(complete){complete.disabled=true;complete.textContent='ミニチェックでクリア'};markAProgress()
    el('kidsVowelGrid').hidden=true;var title=document.querySelector('.kids-lesson-card:has(#kidsVowelGrid) .kids-lesson-title');if(title)title.hidden=true;var prog=el('kidsVowelOverviewProgress');if(prog)prog.hidden=true;d.hidden=false;var header=document.getElementById('kp148VowelHeader');if(!header){header=document.createElement('div');header.id='kp148VowelHeader';header.className='kp148-vowel-header';document.body.appendChild(header)}var head=d.querySelector('.kids-vowel-drill-head');if(head)header.appendChild(head);g.querySelector('button').click();placeVowelEntry(g)
  }
  function closeDrill(){var header=document.getElementById('kp148VowelHeader'),drill=el('kidsVowelDrill');if(header){if(drill&&header.firstElementChild)drill.prepend(header.firstElementChild);header.remove()}cancelIntroTones();stopAudio();clearImitateRecording();aFlow=null;var d=el('kidsVowelDrill');if(d)d.hidden=true;var grid=el('kidsVowelGrid');if(grid)grid.hidden=false;var title=document.querySelector('.kids-lesson-card:has(#kidsVowelGrid) .kids-lesson-title');if(title)title.hidden=false;var p=el('kidsVowelOverviewProgress');if(p)p.hidden=false;renderVowels();placeVowelEntry(grid)}
  function completeCurrent(){var v=data.vowels[vowelIndex];if(!(aFlow&&aFlow.passed&&aFlow.letter===v.letter))return;var list=visibleVowels(),pos=list.findIndex(function(x){return x.letter===v.letter}),nextVowel=(pos>=0&&pos+1<list.length)?list[pos+1]:null;closeDrill();if(nextVowel){var nextIndex=data.vowels.indexOf(nextVowel);if(nextIndex>=0)setTimeout(function(){renderDrill(nextIndex)},40)}}
  function setVowelCardTitle(){var card=el('kidsVowelGrid');card=card?card.closest('.kids-lesson-card'):null;if(!card)return;var strong=card.querySelector('.kids-lesson-title strong'),small=card.querySelector('.kids-lesson-title small');if(strong)strong.textContent=activeGroupTitle?(activeGroupTitle+' の音あそび'):'6つの母音の音あそび';if(small)small.textContent='音・口の形・イメージをいっしょに覚えよう'}
  function renderVowels(){
    var box=el('kidsVowelGrid');if(!box)return;box.replaceChildren();visibleVowels().forEach(function(v){var i=data.vowels.indexOf(v),unlocked=isUnlocked(v.letter),b=document.createElement('button');b.type='button';b.className='kids-vowel-button';b.dataset.letter=v.letter;b.disabled=!unlocked;b.innerHTML='<img src="'+v.image+'" alt=""><span class="letter">'+v.letter+'</span><small class="hint">'+(unlocked?(v.buttonHint||''):'🔒 ひとつ前をクリア')+'</small>';b.setAttribute('aria-label',unlocked?(v.letter+' の四声練習を開く'):(v.letter+' はまだロックされています'));if(unlocked)b.addEventListener('click',function(){renderDrill(i)});box.appendChild(b)});ensureDrill();setVowelCardTitle();updateProgress()
  }
  window.koepandaOpenVowelGroup=function(letters,title){cancelIntroTones();stopAudio();clearImitateRecording();aFlow=null;activeLetters=Array.isArray(letters)?letters.slice():null;activeGroupTitle=title||'';var d=el('kidsVowelDrill');if(d)d.hidden=true;var grid=el('kidsVowelGrid');if(grid)grid.hidden=false;var card=grid?grid.closest('.kids-lesson-card'):null;var t=card?card.querySelector('.kids-lesson-title'):null;if(t)t.hidden=false;var p=el('kidsVowelOverviewProgress');if(p)p.hidden=false;renderVowels()};
  window.koepandaResetVowelGroup=function(){activeLetters=null;activeGroupTitle='';setVowelCardTitle()};
  function init(){loadProgress();renderTones();renderVowels();var entry=el('kidsEntryButton'),back=el('kidsBackHome');if(entry)entry.addEventListener('click',enterKids);if(back)back.addEventListener('click',leaveKids)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
