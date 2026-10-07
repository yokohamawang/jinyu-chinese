/* DEMO 10.108.06 — restore ü to the verified same-speaker Yanyu source.
   Ear replay follows the last tone heard above, imitation is free-choice 1–4 tones,
   playback buttons have tactile feedback, and all six vowel groups use one speaker. */
(function(){
  window.KOEPANDA_PINYIN_BUILD="10.108.10";
  var data=window.KOEPANDA_KIDS_FIRST_LESSON;if(!data)return;
  var vowelIndex=0, localAudio=null, audioRequestId=0, audioPool={}, heard={}, completed={}, mastery={}, activeLetters=null, activeGroupTitle='';
  var introToneBusy=false, introTonePending=null, introToneLastEnd=0, introToneGuardMs=180;
  var STORE='koepandaVowelProgress54', MASTERY_STORE='koepandaVowelMastery69';
  var aFlow=null;
  function el(id){return document.getElementById(id)}
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
  function leaveKids(){document.body.classList.remove('app-kids-mode');var c=el('kidsCourse');if(c)c.setAttribute('aria-hidden','true');if(typeof window.returnToAppHome==='function')window.returnToAppHome();else{document.body.classList.add('app-home-mode');window.scrollTo(0,0)}}
  function stopAudio(){audioRequestId++;var oldAudio=localAudio;localAudio=null;try{if(oldAudio){oldAudio.pause();oldAudio.currentTime=0}}catch(e){}try{if(typeof pinyinSource!=='undefined'&&pinyinSource){pinyinSource.stop();pinyinSource.disconnect();pinyinSource=null}}catch(e){}try{if('speechSynthesis' in window)window.speechSynthesis.cancel()}catch(e){}}

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
  function getPinyinAudio(letter,tone){var info=audioInfo(letter,tone),a=audioPool[info.key];if(!a){a=new Audio();a.preload='auto';a.playsInline=true;a.crossOrigin='anonymous';a.src=info.src;audioPool[info.key]=a;try{a.load()}catch(e){}}return {audio:a,info:info}}
  function warmPinyin(letter){for(var t=1;t<=4;t++)getPinyinAudio(letter,t)}
  function showAudioMissing(letter,tone){var msg='音声の読み込みに失敗しました。通信状態を確認して、もう一度押してください。';console.error(msg,letter,tone);var hint=el('kidsToneHint');if(hint)hint.textContent='⚠ '+msg}
  function playLocalPinyin(letter,tone){
    stopAudio();var requestId=audioRequestId,p=getPinyinAudio(letter,tone),a=p.audio,isO=p.info.isO;localAudio=a;
    return new Promise(function(resolve){var settled=false,started=false;
      function isCurrent(){return requestId===audioRequestId&&localAudio===a}
      function cleanup(){try{a.removeEventListener('canplay',start);a.removeEventListener('error',fail)}catch(e){}}
      function finish(value){if(settled)return;settled=true;cleanup();resolve(value)}
      function fail(){if(settled)return;if(!isCurrent()){finish(null);return}try{a.pause();a.currentTime=0}catch(e){}if(localAudio===a)localAudio=null;showAudioMissing(letter,tone);finish(null)}
      function start(){if(started||!isCurrent()){if(!isCurrent())finish(null);return}started=true;try{a.pause();a.currentTime=0;var profile=p.info.profile||{rate:1,start:0};a.playbackRate=profile.rate||1;try{a.preservesPitch=true;a.mozPreservesPitch=true;a.webkitPreservesPitch=true}catch(_e){}a.volume=1;if(profile.start&&a.duration>0.12)a.currentTime=Math.min(profile.start,a.duration*0.06)}catch(e){}try{var pr=a.play();if(pr&&typeof pr.then==='function')pr.then(function(){if(isCurrent())finish(a);else{try{a.pause();a.currentTime=0}catch(e){}finish(null)}}).catch(fail);else finish(isCurrent()?a:null)}catch(e){fail()}}
      a.addEventListener('ended',function(){if(localAudio===a)localAudio=null},{once:true});a.addEventListener('error',fail,{once:true});
      if(a.readyState>=2)start();else{a.addEventListener('canplay',start,{once:true});try{a.load()}catch(e){start()}}
    })
  }
  function playToneExample(tone){return playLocalPinyin('a',tone)}
  function playVowelExample(v,tone){return playLocalPinyin(v.letter,tone)}
  function playIntroToneSerialized(v,tone){
    introTonePending={v:v,tone:tone};
    if(introToneBusy)return;
    function launch(){
      if(!introTonePending){introToneBusy=false;return}
      var job=introTonePending;introTonePending=null;introToneBusy=true;
      var wait=Math.max(0,introToneGuardMs-(Date.now()-introToneLastEnd));
      setTimeout(function(){
        playVowelExample(job.v,job.tone).then(function(a){
          if(!a){introToneBusy=false;launch();return}
          var done=false;
          function finish(){
            if(done)return;done=true;introToneLastEnd=Date.now();introToneBusy=false;
            setTimeout(launch,introToneGuardMs);
          }
          if(a.ended||a.paused){finish();return}
          a.addEventListener('ended',finish,{once:true});
          a.addEventListener('pause',function(){if(a.currentTime>0&&!a.ended)finish()},{once:true});
        }).catch(function(){introToneBusy=false;launch()});
      },wait);
    }
    launch();
  }
  window.koepandaPlayToneIntro=playToneExample;
  function toneMarks(letter){var m={a:['ā','á','ǎ','à'],o:['ō','ó','ǒ','ò'],e:['ē','é','ě','è'],i:['ī','í','ǐ','ì'],u:['ū','ú','ǔ','ù'],'ü':['ǖ','ǘ','ǚ','ǜ']};return m[letter]||[letter,letter,letter,letter]}
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
      +'<div class="kids-a-progress" id="kidsAProgress" hidden><span data-step="listen">1 きく</span><span data-step="ear">2 ききわけ</span><span data-step="imitate">3 まねる</span><span data-step="quiz">4 ミニチェック</span></div>'
      +'<div class="kids-vowel-tone-title">🔊 4つの声調を順番に聞いてみよう</div><div class="kids-vowel-tone-grid" id="kidsVowelToneGrid"></div>'
      +'<section class="kids-a-stage" id="kidsAEarStage" hidden><div class="kids-a-stage-head"><span>👂</span><div><b>耳でえらんでみよう</b><small>音を1回聞いて、どの声調か選ぼう</small></div></div><button type="button" class="kids-a-listen-button" id="kidsAEarListen">▶ もう一度聞く</button><div class="kids-a-choice-row" id="kidsAEarChoices"></div><div class="kids-a-feedback" id="kidsAEarFeedback"></div></section>'
      +'<section class="kids-a-stage kids-a-imitate-stage" id="kidsAImitateStage" hidden><div class="kids-a-stage-head"><span>🗣️</span><div><b>小音といっしょにまねよう</b><small>練習したい声調をえらんで、何度でも自由にまねしてみよう</small></div></div><div class="kids-a-imitate-prompt">練習したい声調をえらぼう</div><div class="kids-a-choice-row kids-a-imitate-choices" id="kidsAImitateChoices"></div><div class="practice-console vowel-practice-console"><div class="practice-console-top"><span>FREE PRACTICE</span><small>好きな声調を何度でも練習</small></div><button type="button" class="kids-a-listen-button" id="kidsAImitateListen">▶ お手本を聞く</button><div class="kids-a-record-row"><button type="button" class="kids-a-record-button" id="kidsAImitateRecord">● 録音する</button><button type="button" class="kids-a-playback-button" id="kidsAImitatePlayback" disabled>▶ 自分の声を聞く</button></div><div class="kids-a-feedback" id="kidsAImitateFeedback"></div></div><div class="practice-next-label"><span>練習できたら</span></div><button type="button" class="kids-a-confirm-button" id="kidsAImitateDone" disabled>できた！ ミニチェックへ</button></section>'
      +'<section class="kids-a-stage" id="kidsAQuizStage" hidden><div class="kids-a-stage-head"><span>⭐</span><div><b>ミニチェック</b><small>4問中3問できたら次へ進めるよ</small></div></div><div class="kids-a-quiz-count" id="kidsAQuizCount">1 / 4</div><button type="button" class="kids-a-listen-button" id="kidsAQuizListen">▶ 音を聞く</button><div class="kids-a-choice-row" id="kidsAQuizChoices"></div><div class="kids-a-feedback" id="kidsAQuizFeedback"></div><button type="button" class="kids-a-next-question" id="kidsAQuizNext" hidden>次の問題へ</button></section>'
      +'<section class="kids-a-reward" id="kidsAReward" hidden><div class="kids-a-reward-icon">🌱</div><div><strong>a クリア！</strong><span>「はじめての音」バッジをゲット</span><small>o のレッスンが開いたよ</small></div></section>'
      +'<div class="kids-vowel-write"><b>✍️ 声調記号もいっしょに覚えよう</b><div class="kids-vowel-trace-row" id="kidsVowelTraceRow"></div></div><div class="kids-vowel-special-note" id="kidsVowelSpecialNote" hidden></div>'
      +'<div class="kids-vowel-drill-actions"><button type="button" class="kids-vowel-complete" id="kidsVowelComplete">この母音、できた！</button><button type="button" class="kids-vowel-back-bottom" id="kidsVowelBackBottom">戻る</button></div>';
    progress.insertAdjacentElement('afterend',d);
    el('kidsVowelDrillBack').addEventListener('click',closeDrill);el('kidsVowelBackBottom').addEventListener('click',closeDrill);el('kidsVowelComplete').addEventListener('click',completeCurrent);
    el('kidsAEarListen').addEventListener('click',function(){if(!aFlow)return;var btn=this;pulseButton(btn);aFlow.earPlayed=true;btn.textContent='▶ もう一度聞く';setEarChoicesEnabled(true);playLocalPinyin(aFlow.letter,aFlow.earTone)});
    el('kidsAImitateListen').addEventListener('click',function(){if(aFlow){pulseButton(this);playLocalPinyin(aFlow.letter,aFlow.imitateTone)}});
    el('kidsAImitateRecord').addEventListener('click',toggleImitateRecording);
    el('kidsAImitatePlayback').addEventListener('click',playImitateRecording);
    el('kidsAImitateDone').addEventListener('click',completeImitate);
    el('kidsAQuizListen').addEventListener('click',playCurrentQuizTone);
    el('kidsAQuizNext').addEventListener('click',nextQuizQuestion);
    return d;
  }

  var imitateRecorder=null,imitateStream=null,imitateChunks=[],imitateAudioUrl='',imitateAudio=null;
  function clearImitateRecording(){
    if(imitateAudio){try{imitateAudio.pause()}catch(e){} imitateAudio=null}
    if(imitateAudioUrl){try{URL.revokeObjectURL(imitateAudioUrl)}catch(e){} imitateAudioUrl=''}
    if(imitateStream){try{imitateStream.getTracks().forEach(function(t){t.stop()})}catch(e){} imitateStream=null}
    imitateRecorder=null;imitateChunks=[];
    var rec=el('kidsAImitateRecord'),play=el('kidsAImitatePlayback'),done=el('kidsAImitateDone');
    if(rec){rec.textContent='● 録音する';rec.classList.remove('is-recording')}
    if(play)play.disabled=true;if(done)done.disabled=true;
  }
  function mimeForRecording(){
    if(typeof MediaRecorder==='undefined')return '';
    var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];
    for(var i=0;i<types.length;i++){try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}}
    return '';
  }
  async function startImitateRecording(){
    var fb=el('kidsAImitateFeedback'),recBtn=el('kidsAImitateRecord');
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){if(fb){fb.textContent='このブラウザでは録音が使えません。';fb.className='kids-a-feedback'};return}
    try{
      stopAudio();
      if(imitateAudioUrl){try{URL.revokeObjectURL(imitateAudioUrl)}catch(e){} imitateAudioUrl=''}
      imitateChunks=[];imitateStream=await navigator.mediaDevices.getUserMedia({audio:true});
      var mt=mimeForRecording(),opts=mt?{mimeType:mt}:undefined;imitateRecorder=new MediaRecorder(imitateStream,opts);
      imitateRecorder.ondataavailable=function(e){if(e.data&&e.data.size)imitateChunks.push(e.data)};
      imitateRecorder.onstop=function(){
        var type=(imitateRecorder&&imitateRecorder.mimeType)||mt||'audio/mp4';var blob=new Blob(imitateChunks,{type:type});
        imitateAudioUrl=URL.createObjectURL(blob);
        if(imitateStream){imitateStream.getTracks().forEach(function(t){t.stop()});imitateStream=null}
        if(recBtn){recBtn.textContent='↻ もう一度録音';recBtn.classList.remove('is-recording')}
        var play=el('kidsAImitatePlayback'),done=el('kidsAImitateDone');if(play)play.disabled=false;if(done)done.disabled=false;
        if(fb){fb.textContent='録音できたよ。自分の声も聞きくらべてみよう 👂';fb.className='kids-a-feedback is-good'}
      };
      imitateRecorder.start();if(recBtn){recBtn.textContent='■ 録音を止める';recBtn.classList.add('is-recording')}
      if(fb){fb.textContent='録音中… お手本と同じように声を出してみよう';fb.className='kids-a-feedback'}
    }catch(e){if(fb){fb.textContent='マイクを使えませんでした。マイクの許可を確認してね。';fb.className='kids-a-feedback'}}
  }
  function stopImitateRecording(){if(imitateRecorder&&imitateRecorder.state==='recording'){try{imitateRecorder.stop()}catch(e){}}}
  function toggleImitateRecording(){if(imitateRecorder&&imitateRecorder.state==='recording')stopImitateRecording();else startImitateRecording()}
  function pulseButton(btn){if(!btn)return;btn.classList.remove('is-pressed');void btn.offsetWidth;btn.classList.add('is-pressed');setTimeout(function(){btn.classList.remove('is-pressed')},180)}
  function playImitateRecording(){if(!imitateAudioUrl)return;var btn=el('kidsAImitatePlayback');pulseButton(btn);try{if(imitateAudio)imitateAudio.pause();imitateAudio=new Audio(imitateAudioUrl);if(btn)btn.classList.add('is-playing');imitateAudio.addEventListener('ended',function(){if(btn)btn.classList.remove('is-playing')},{once:true});var pr=imitateAudio.play();if(pr&&pr.catch)pr.catch(function(){if(btn)btn.classList.remove('is-playing')})}catch(e){if(btn)btn.classList.remove('is-playing')}}
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
  function resetAFlow(letter){clearImitateRecording();aFlow={letter:letter||'a',earTone:randomEarTone(),earPlayed:false,imitateTone:1,earDone:false,imitateDone:false,quizOrder:randomQuizOrder(),quizIndex:0,quizCorrect:0,quizAnswered:false,quizDone:false,passed:false}}
  function markAProgress(){
    var p=el('kidsAProgress');if(!p||!aFlow)return;var listenDone=Object.keys(heard).length===4;
    var states={listen:listenDone,ear:aFlow.earDone,imitate:aFlow.imitateDone,quiz:aFlow.passed};
    p.querySelectorAll('span').forEach(function(s){s.classList.toggle('is-done',!!states[s.dataset.step])});
    var ear=el('kidsAEarStage'),imit=el('kidsAImitateStage'),quiz=el('kidsAQuizStage');
    if(ear)ear.hidden=!listenDone;if(imit)imit.hidden=!aFlow.earDone;if(quiz)quiz.hidden=!aFlow.imitateDone;
    if(listenDone&&ear){/* Ear check is independent from the visible tone cards: keep one hidden random target and do not reveal it. */ear.dataset.autoPlayed='manual';var earBtn=el('kidsAEarListen');if(earBtn&&!aFlow.earPlayed)earBtn.textContent='▶ 問題の音を聞く';setEarChoicesEnabled(!!aFlow.earPlayed);}
  }
  function buildToneChoices(containerId,handler){var box=el(containerId);if(!box)return;box.replaceChildren();toneMarks(aFlow&&aFlow.letter?aFlow.letter:'a').forEach(function(mark,k){var b=document.createElement('button');b.type='button';b.className='kids-a-tone-choice';b.innerHTML='<strong>'+mark+'</strong><small>'+(k+1)+'声</small>';b.addEventListener('click',function(){handler(k+1,b)});box.appendChild(b)})}

  function renderImitateChoices(){
    var box=el('kidsAImitateChoices');if(!box||!aFlow)return;box.replaceChildren();
    toneMarks(aFlow.letter).forEach(function(mark,k){var tone=k+1,b=document.createElement('button');b.type='button';b.className='kids-a-tone-choice'+(tone===aFlow.imitateTone?' is-selected':'');b.innerHTML='<strong>'+mark+'</strong><small>'+tone+'声</small>';b.addEventListener('click',function(){if(!aFlow)return;if(aFlow.imitateTone!==tone){aFlow.imitateTone=tone;aFlow.imitateDone=false;clearImitateRecording();var done=el('kidsAImitateDone');if(done){done.disabled=true;done.classList.remove('is-done')}}box.querySelectorAll('.kids-a-tone-choice').forEach(function(x){x.classList.remove('is-selected')});b.classList.add('is-selected');pulseButton(b);playLocalPinyin(aFlow.letter,tone)});box.appendChild(b)});
  }
  function renderAEarChoices(){buildToneChoices('kidsAEarChoices',function(tone,b){if(!aFlow||aFlow.earDone||!aFlow.earPlayed)return;var fb=el('kidsAEarFeedback');if(tone===aFlow.earTone){aFlow.earDone=true;b.classList.add('is-good');if(fb){fb.textContent='✨ 正解！ 音の上がり下がりが聞こえたね。次は「お手本を聞く」へ';fb.className='kids-a-feedback is-good'};markAProgress()}else{b.classList.add('is-try');if(fb){fb.textContent='もう一度聞いてみよう。まちがえても大丈夫 👂';fb.className='kids-a-feedback'};setTimeout(function(){b.classList.remove('is-try');playLocalPinyin(aFlow.letter,aFlow.earTone)},180)}});setEarChoicesEnabled(!!(aFlow&&aFlow.earPlayed))}
  function completeImitate(){if(!aFlow||aFlow.imitateDone||!imitateAudioUrl)return;aFlow.imitateDone=true;var fb=el('kidsAImitateFeedback');if(fb){fb.textContent='いいね！ 自分の声まで確認できたね。次は4問チェック！';fb.className='kids-a-feedback is-good'};el('kidsAImitateDone').classList.add('is-done');markAProgress();renderQuizQuestion();setTimeout(playCurrentQuizTone,220)}
  function playCurrentQuizTone(){if(!aFlow||aFlow.quizDone)return;playLocalPinyin(aFlow.letter,aFlow.quizOrder[aFlow.quizIndex])}
  function renderQuizQuestion(){
    if(!aFlow)return;var count=el('kidsAQuizCount'),fb=el('kidsAQuizFeedback'),next=el('kidsAQuizNext');if(count)count.textContent=(aFlow.quizIndex+1)+' / 4';if(fb){fb.textContent='';fb.className='kids-a-feedback'}if(next)next.hidden=true;aFlow.quizAnswered=false;
    buildToneChoices('kidsAQuizChoices',function(tone,b){if(!aFlow||aFlow.quizAnswered||aFlow.quizDone)return;aFlow.quizAnswered=true;var correct=aFlow.quizOrder[aFlow.quizIndex],box=el('kidsAQuizChoices');if(tone===correct){aFlow.quizCorrect++;b.classList.add('is-good');if(fb){fb.textContent='✨ 正解！';fb.className='kids-a-feedback is-good'}}else{b.classList.add('is-wrong');if(box){Array.prototype.forEach.call(box.children,function(x,idx){if(idx+1===correct)x.classList.add('is-good')})}if(fb){fb.textContent='答えは '+toneMarks(aFlow.letter)[correct-1]+'。音をもう一度聞いてみよう';fb.className='kids-a-feedback'}}if(next){next.hidden=false;next.textContent=aFlow.quizIndex===3?'結果を見る':'次の問題へ'}})
  }
  function nextQuizQuestion(){if(!aFlow||!aFlow.quizAnswered)return;if(aFlow.quizIndex<3){aFlow.quizIndex++;renderQuizQuestion();setTimeout(playCurrentQuizTone,180);return}finishAQuiz()}
  function showVowelCelebration(letter,score){
    var old=document.getElementById('kidsVowelCelebration');if(old)old.remove();
    var perfect=score===4,wrap=document.createElement('div');wrap.id='kidsVowelCelebration';wrap.className='kids-vowel-celebration'+(perfect?' is-perfect':'');
    wrap.innerHTML='<div class="kids-vowel-celebration-burst" aria-hidden="true"><i>✦</i><i>★</i><i>✧</i><i>●</i><i>★</i><i>✦</i><i>●</i><i>✧</i></div><div class="kids-vowel-celebration-card"><div class="kids-vowel-celebration-mascot">🐼</div><b>'+(perfect?'PERFECT!':'やった！')+'</b><strong>'+score+' / 4　'+letter+' クリア！</strong><span>'+(perfect?'4問ぜんぶ正解！ すごい！':'3問できた！ 次の音がひらいたよ')+'</span></div>';
    document.body.appendChild(wrap);requestAnimationFrame(function(){wrap.classList.add('is-show')});
    setTimeout(function(){wrap.classList.add('is-leaving');setTimeout(function(){if(wrap.parentNode)wrap.remove()},420)},perfect?2100:1700);
  }
  function finishAQuiz(){
    aFlow.quizDone=true;var passed=aFlow.quizCorrect>=3;aFlow.passed=passed;var fb=el('kidsAQuizFeedback'),next=el('kidsAQuizNext');if(next)next.hidden=true;
    if(passed){
      var letter=aFlow.letter;if(fb){fb.textContent='🎉 '+aFlow.quizCorrect+' / 4！ '+letter+' クリア！';fb.className='kids-a-feedback is-good'};
      mastery[letter]={passed:true,score:aFlow.quizCorrect,total:4,updatedAt:Date.now()};completed[letter]=true;saveProgress();
      var reward=el('kidsAReward'),rewardStrong=reward?reward.querySelector('strong'):null,rewardSpan=reward?reward.querySelector('span'):null,rewardSmall=reward?reward.querySelector('small'):null;
      var list=visibleVowels(),pos=list.findIndex(function(v){return v.letter===letter}),nextVowel=(pos>=0&&pos+1<list.length)?list[pos+1]:null;
      if(reward){reward.hidden=false;if(rewardStrong)rewardStrong.textContent=letter+' クリア！';if(rewardSpan)rewardSpan.textContent=letter==='a'?'「はじめての音」バッジをゲット':'4つの声調チェック、よくできた！';if(rewardSmall)rewardSmall.textContent=nextVowel?(nextVowel.letter+' のレッスンが開いたよ'):(activeGroupTitle?activeGroupTitle+' クリア！':'母音レッスン、ここまでクリア！')}
      showVowelCelebration(letter,aFlow.quizCorrect);
      var complete=el('kidsVowelComplete');if(complete){complete.disabled=false;complete.textContent=nextVowel?('次へ：'+nextVowel.letter+' を見てみる'):'母音一覧へ戻る'};markAProgress();updateProgress()
    }
    else{if(fb){fb.textContent=aFlow.quizCorrect+' / 4。あと少し！ もう一度だけやってみよう';fb.className='kids-a-feedback'};var q=el('kidsAQuizStage'),retry=document.createElement('button');retry.type='button';retry.className='kids-a-retry';retry.textContent='もう一度チャレンジ';retry.addEventListener('click',function(){aFlow.quizOrder=randomQuizOrder();aFlow.quizIndex=0;aFlow.quizCorrect=0;aFlow.quizAnswered=false;aFlow.quizDone=false;aFlow.passed=false;retry.remove();renderQuizQuestion();setTimeout(playCurrentQuizTone,180)});q.appendChild(retry)}
  }

  function renderDrill(i){
    vowelIndex=i;heard={};introToneBusy=false;introTonePending=null;introToneLastEnd=0;var v=data.vowels[i],d=ensureDrill();if(!d)return;warmPinyin(v.letter);
    el('kidsVowelDrillTitle').textContent=v.letter+' の四声';el('kidsVowelDrillSubtitle').textContent='きく → ききわけ → まねる → ミニチェック';el('kidsVowelDrillLetter').textContent=v.letter;el('kidsVowelDrillImage').src=v.image;el('kidsVowelDrillImage').alt=v.sceneTitle||v.letter;el('kidsVowelDrillTip').textContent=v.tip+'。'+v.note;
    var p=el('kidsAProgress'),ear=el('kidsAEarStage'),imit=el('kidsAImitateStage'),quiz=el('kidsAQuizStage'),reward=el('kidsAReward');if(p)p.hidden=false;if(ear)ear.hidden=true;if(imit)imit.hidden=true;if(quiz)quiz.hidden=true;if(reward)reward.hidden=true;
    var marks=toneMarks(v.letter),labels=toneLabels(),g=el('kidsVowelToneGrid');g.replaceChildren();
    marks.forEach(function(mark,k){var tone=k+1,b=document.createElement('button');b.type='button';b.className='kids-vowel-tone-btn';b.innerHTML='<span class="tone-mark">'+mark+'</span><b>'+tone+'声</b><small>'+labels[k]+'</small>';b.setAttribute('aria-label',mark+' '+tone+'声を聞く');b.addEventListener('click',function(){heard[tone]=true;b.classList.add('is-heard');playIntroToneSerialized(v,tone);markAProgress()});g.appendChild(b)});
    var tr=el('kidsVowelTraceRow');tr.replaceChildren();marks.forEach(function(mark){var x=document.createElement('div');x.className='kids-vowel-trace';x.textContent=mark;tr.appendChild(x)});
    var sp=el('kidsVowelSpecialNote');if(v.letter==='ü'){sp.hidden=false;sp.innerHTML='<strong>u と ü は別の音。</strong> ü は u の上に点が2つ。<br>j・q・x ＋ ü は <strong>ju・qu・xu</strong> と書くけれど、点を省くだけで発音は ü のまま。'}else{sp.hidden=true;sp.textContent=''}
    var complete=el('kidsVowelComplete');resetAFlow(v.letter);var idone=el('kidsAImitateDone');if(idone){idone.disabled=true;idone.classList.remove('is-done')}renderAEarChoices();renderImitateChoices();if(complete){complete.disabled=true;complete.textContent='4つのステップでクリア'};markAProgress()
    el('kidsVowelGrid').hidden=true;var title=document.querySelector('.kids-lesson-card:has(#kidsVowelGrid) .kids-lesson-title');if(title)title.hidden=true;var prog=el('kidsVowelOverviewProgress');if(prog)prog.hidden=true;d.hidden=false;requestAnimationFrame(function(){d.scrollIntoView({block:'start',behavior:'auto'})})
  }
  function closeDrill(){introTonePending=null;introToneBusy=false;stopAudio();clearImitateRecording();var d=el('kidsVowelDrill');if(d)d.hidden=true;var grid=el('kidsVowelGrid');if(grid)grid.hidden=false;var title=document.querySelector('.kids-lesson-card:has(#kidsVowelGrid) .kids-lesson-title');if(title)title.hidden=false;var p=el('kidsVowelOverviewProgress');if(p)p.hidden=false;renderVowels();requestAnimationFrame(function(){grid.scrollIntoView({block:'start',behavior:'auto'})})}
  function completeCurrent(){var v=data.vowels[vowelIndex];if(!(aFlow&&aFlow.passed&&aFlow.letter===v.letter))return;var list=visibleVowels(),pos=list.findIndex(function(x){return x.letter===v.letter}),nextVowel=(pos>=0&&pos+1<list.length)?list[pos+1]:null;closeDrill();if(nextVowel){var nextIndex=data.vowels.indexOf(nextVowel);if(nextIndex>=0)setTimeout(function(){renderDrill(nextIndex)},40)}}
  function setVowelCardTitle(){var card=el('kidsVowelGrid');card=card?card.closest('.kids-lesson-card'):null;if(!card)return;var strong=card.querySelector('.kids-lesson-title strong'),small=card.querySelector('.kids-lesson-title small');if(strong)strong.textContent=activeGroupTitle?(activeGroupTitle+' の音あそび'):'6つの母音の音あそび';if(small)small.textContent='音・口の形・イメージをいっしょに覚えよう'}
  function renderVowels(){
    var box=el('kidsVowelGrid');if(!box)return;box.replaceChildren();visibleVowels().forEach(function(v){var i=data.vowels.indexOf(v),unlocked=isUnlocked(v.letter),b=document.createElement('button');b.type='button';b.className='kids-vowel-button';b.dataset.letter=v.letter;b.disabled=!unlocked;b.innerHTML='<img src="'+v.image+'" alt=""><span class="letter">'+v.letter+'</span><small class="hint">'+(unlocked?(v.buttonHint||''):'🔒 ひとつ前をクリア')+'</small>';b.setAttribute('aria-label',unlocked?(v.letter+' の四声練習を開く'):(v.letter+' はまだロックされています'));if(unlocked)b.addEventListener('click',function(){renderDrill(i)});box.appendChild(b)});ensureDrill();setVowelCardTitle();updateProgress()
  }
  window.koepandaOpenVowelGroup=function(letters,title){activeLetters=Array.isArray(letters)?letters.slice():null;activeGroupTitle=title||'';var d=el('kidsVowelDrill');if(d)d.hidden=true;var grid=el('kidsVowelGrid');if(grid)grid.hidden=false;var card=grid?grid.closest('.kids-lesson-card'):null;var t=card?card.querySelector('.kids-lesson-title'):null;if(t)t.hidden=false;var p=el('kidsVowelOverviewProgress');if(p)p.hidden=false;renderVowels()};
  window.koepandaResetVowelGroup=function(){activeLetters=null;activeGroupTitle='';setVowelCardTitle()};
  function init(){loadProgress();renderTones();renderVowels();var entry=el('kidsEntryButton'),back=el('kidsBackHome');if(entry)entry.addEventListener('click',enterKids);if(back)back.addEventListener('click',leaveKids)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
