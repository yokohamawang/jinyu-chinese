(function(){
  "use strict";
  var gkhRest='M126 49 C111 49 91 49 78 48 C64 47 51 46 45 43 C42 40 44 38 50 39 C58 39 66 43 76 43 C87 43 92 42 96 42 C100 42 104 40.5 108 40.5 C113 40.5 116 41 118 41.5 C121 42 124 42.6 126 43.8Z';
  var gkhTouch='M126 49 C111 49 91 49 78 48 C64 47 51 46 45 43 C42 40 44 38 50 39 C58 39 66 43 76 43 C87 43 92 36.8 96 34.8 C100 33 104 32.7 108 33 C113 33.4 116 35.8 118 38 C121 41 124 42.6 126 43.8Z';
  var gkhNarrow='M126 49 C111 49 91 49 78 48 C64 47 51 46 45 43 C42 40 44 38 50 39 C58 39 66 43 76 43 C87 43 92 39.4 96 38 C100 36.8 104 36.6 108 36.8 C113 37 116 38.8 118 40 C121 41.4 124 42.6 126 43.8Z';
  function gkhDiagram(letter,mode,instance){
    var id='gkh113-'+letter+'-'+instance+'-',live=mode==='live',fricative=letter==='h';
    var target=fricative?gkhNarrow:gkhTouch,path=live?gkhRest:(mode==='contact'||fricative?target:gkhRest);
    var times=fricative?'0;.20;.78;.92;1':'0;.20;.42;.58;1';
    function pulse(values,t){return live?'<animate attributeName="opacity" values="'+values+'" keyTimes="'+t+'" dur="3.6s" repeatCount="indefinite"/>':''}
    var defs='<radialGradient id="'+id+'skin" cx="30%" cy="24%" r="82%"><stop offset="0" stop-color="#fff8ea"/><stop offset=".32" stop-color="#fae9d6"/><stop offset=".72" stop-color="#edcbb0"/><stop offset="1" stop-color="#dbb497"/></radialGradient>'
      +'<linearGradient id="'+id+'cavity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d5af96"/><stop offset=".2" stop-color="#efd5bc"/><stop offset=".55" stop-color="#fff3e2"/><stop offset="1" stop-color="#dbb599"/></linearGradient>'
      +'<linearGradient id="'+id+'roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ba937a"/><stop offset="1" stop-color="#e4c6aa"/></linearGradient>'
      +'<radialGradient id="'+id+'tooth" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#fffef7"/><stop offset=".52" stop-color="#fcf5e6"/><stop offset="1" stop-color="#e4d5b8"/></radialGradient>'
      +'<linearGradient id="'+id+'lip" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#f0b8a7"/><stop offset=".52" stop-color="#df9682"/><stop offset="1" stop-color="#bd7966"/></linearGradient>'
      +'<radialGradient id="'+id+'tongue" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(95 34) scale(76 24)"><stop offset="0" stop-color="#f5c5b0"/><stop offset=".4" stop-color="#e7a28a"/><stop offset="1" stop-color="#ba765f"/></radialGradient>'
      +'<linearGradient id="'+id+'air" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#568e73"/><stop offset="1" stop-color="#7aae92"/></linearGradient>';
    var profile='<path class="gkh-face" fill="url(#'+id+'skin)" d="M53 16 C45 23 41 31 39 39 C37 47 30 52 23 57 C17 61 17 65 23 68 C28 71 34 69 38 68 C39 75 35 81 29 85.2 C28 86 26.3 86.6 26 87.3 C28.5 88.2 32 88.3 36 88.1 L36 101.6 C33 101 29 100.7 26 101.4 C27 102.4 28.5 103.1 30 103.4 C34 109 32 112 32 115 C32 125 46 133 61 136 C85 140 109 138 127 131 L127 40 C91 20 70 18 53 16Z"/>'
      +'<path fill="none" stroke="#b58a6c" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" d="M127 40 C91 20 70 18 53 16 C45 23 41 31 39 39 C37 47 30 52 23 57 C17 61 17 65 23 68 C28 71 34 69 38 68 C39 75 35 81 29 85.2 C28 86 26.3 86.6 26 87.3 M26 101.4 C27 102.4 28.5 103.1 30 103.4 C34 109 32 112 32 115 C32 125 46 133 61 136 C85 140 109 138 127 131"/>'
      +'<path fill="none" stroke="#ead5bf" stroke-width="2" stroke-linecap="round" d="M45 34 Q42 48 29 58"/><ellipse fill="#987157" cx="30" cy="65" rx="4.4" ry="2.1" transform="rotate(-14 30 65)"/>';
    var morph=live?'<animate attributeName="d" values="'+[gkhRest,target,target,gkhRest,gkhRest].join(';')+'" keyTimes="'+times+'" dur="3.6s" repeatCount="indefinite"/>':'';
    var contact=fricative?'':'<path class="gkh-contact" d="M102 32.7 Q108 32.6 113 34" fill="none" stroke="#d3a64d" stroke-width="1.5" stroke-linecap="round" opacity="'+(live?'0':mode==='contact'?'.8':'0')+'">'+pulse('0;0;.8;.8;0;0','0;.19;.22;.41;.46;1')+'</path>';
    var airVisible=!live&&mode==='release',airValues=fricative?'0;0;.66;.66;0;0':letter==='k'?'0;0;.75;.75;0;0':'0;0;.35;.35;0;0';
    var airTimes=fricative?'0;.20;.28;.70;.78;1':letter==='k'?'0;.44;.50;.64;.73;1':'0;.44;.50;.57;.66;1';
    var air='<g class="gkh-air" fill="none" stroke="url(#'+id+'air)" stroke-width="'+(fricative?'1.3':'1.4')+'" stroke-linecap="round" stroke-linejoin="round" opacity="'+(airVisible?(letter==='k'?'.75':fricative?'.66':'.35'):'0')+'">'+pulse(airValues,airTimes)
      +'<path d="M124 38.5 Q114 34.5 105 35.5 Q96 37.4 83 37.6 Q54 37.8 18 38.5"/><path d="M24 36.5 L18 38.5 L24 40.3"/>'
      +(letter==='k'?'<path d="M27 40.2 Q22 40.6 16 41"/>':'')+'</g>';
    var oral='<path fill="url(#'+id+'cavity)" d="M35 34 Q70 25 101 29.8 L125 33 L131 49.8 Q95 56.2 38 51 L35 47Z"/>'
      +'<path class="gkh-hard-palate" fill="none" stroke="url(#'+id+'roof)" stroke-width="5" stroke-linecap="round" d="M36 32.2 Q39 31.2 42 31.8 Q48 33.8 59 31 Q86 26.6 101 29.8"/>'
      +'<path class="gkh-soft-palate" fill="none" stroke="url(#'+id+'roof)" stroke-width="5" stroke-linecap="round" d="M101 29.8 Q111 30.8 125 33"/>'
      +'<path fill="none" stroke="url(#'+id+'roof)" stroke-width="2.5" stroke-linecap="round" d="M34 51.4 C54 54.6 86 56.2 126 51.8"/>'
      +'<path fill="url(#'+id+'tooth)" stroke="#b9a689" stroke-width=".5" d="M37.3 45.9 Q38.5 45.9 39.7 46.5 Q40.7 47 41.2 48.3 L41.4 50.8 Q41.4 51.5 40.2 51.4 L37.5 50.8 Q36.8 50.7 36.5 49.7 L35.9 47 Q35.8 46 37.3 45.9Z"/>'
      +'<path class="gkh-tongue" fill="url(#'+id+'tongue)" stroke="#b1715b" stroke-width=".7" stroke-linejoin="round" d="'+path+'">'+morph+'</path>'
      +'<path fill="url(#'+id+'tooth)" stroke="#b9a689" stroke-width=".5" d="M38.4 29.8 C39.8 29.6 41.2 30.1 41.6 31.1 L40.7 35.9 Q40.3 37.2 39.1 37.1 L36.3 36.6 Q35.6 36.3 35.9 35.1 L37.2 31 Q37.6 30 38.4 29.8Z"/>'
      +'<path fill="url(#'+id+'lip)" d="M29 31.2 C28 32 26.3 32.6 26 33.3 C29.6 34.1 33.2 34.2 36 33.8 C34.6 32.9 31.8 32 29 31.2Z"/>'
      +'<path fill="url(#'+id+'lip)" d="M26 47.4 C29 46.7 33 47 36 47.6 C33.5 48.2 31.9 49 30 49.4 C28.5 49.1 27 48.4 26 47.4Z"/>'+contact+air
      +(live?'<text fill="#80624b" font-size="10.5" font-weight="600" x="66" y="17">奥の上あご</text>':'');
    return '<svg class="gkh-art-svg" viewBox="0 0 144 154" data-letter="'+letter+'" aria-hidden="true" focusable="false"><defs>'+defs+'</defs>'+profile+'<g transform="translate(0 54)">'+oral+'</g></svg>';
  }

  var letters=['g','k','h'];
  var guide={
    g:{hanzi:'哥',pinyin:'gē',ipa:'[k]',cue:'弱い息',tip:'舌の奥で息を止めてから、軽く離す。強い息は出しません。',labels:['つける','離す'],notes:['舌の奥で息を止める','離して、短い息'],compare:'g と k は同じ場所。違いは、離すときの息の強さです。'},
    k:{hanzi:'科',pinyin:'kē',ipa:'[kʰ]',cue:'強い息',tip:'g と同じ場所につけ、離すときに強く息を出します。',labels:['つける','強い息'],notes:['g と同じ場所で止める','離すときに強い息'],compare:'手のひらを口の前へ。k の息を g と比べてみよう。'},
    h:{hanzi:'喝',pinyin:'hē',ipa:'[x]',cue:'細く続く息',tip:'舌の奥を近づけ、狭いすき間から息をこすります。',labels:['すき間を残す','息を通す'],notes:['完全にはふさがない','狭いすき間から息'],compare:'h は止めてから開く音ではなく、すき間で息をこする音です。'}
  };
  var selected='g',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='gkhModelFeedback'?'gkh-model-feedback':'gkh-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaInitialP5Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-gkh-letter]').forEach(function(b){b.disabled=busy});
    el('gkhModel').disabled=busy;el('gkhToQuiz').disabled=busy;
    el('gkhPlayback').disabled=busy||!recordings[selected];
    el('gkhPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('gkhRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('gkhRecord').disabled=false;el('gkhRecord').classList.remove('is-recording');el('gkhRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(typeof window.stopStandardAudio==='function')window.stopStandardAudio()}catch(e){}
    try{if('speechSynthesis' in window)window.speechSynthesis.cancel()}catch(e){}
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#gkhModel[aria-busy],#gkhQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
  }
  function resetArt(){
    var svg=el('gkhArticulation').querySelector('svg');if(!svg)return;
    try{if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}else{svg.unpauseAnimations();svg.setCurrentTime(selected==='h'?1.008:1.44)}}catch(e){}
  }
  function fallbackSpeech(text){
    return new Promise(function(resolve,reject){
      if(!('speechSynthesis' in window)){reject(new Error('speech unavailable'));return}
      var u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.78;
      var voices=speechSynthesis.getVoices(),voice=voices.find(function(v){return /^zh[-_](CN|Hans)/i.test(v.lang)});if(voice)u.voice=voice;
      var timer=setTimeout(function(){reject(new Error('speech timeout'))},6000);
      u.onstart=function(){clearTimeout(timer);resolve(true)};u.onerror=function(){clearTimeout(timer);reject(new Error('speech failed'))};
      speechSynthesis.speak(u);
    });
  }
  async function playModel(letter,button,forQuiz){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var token=modelToken,item=guide[letter],fb=forQuiz?'gkhQuizFeedback':'gkhModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(!forQuiz)feedback(fb,'お手本を準備しています…');
    try{
      var audio=typeof window.playMachine==='function'?await window.playMachine(item.hanzi,null,false):null;
      if(token!==modelToken)return;
      if(!audio)audio=await fallbackSpeech(item.hanzi);
      if(token!==modelToken)return;
      if(!forQuiz){resetArt();feedback(fb,'舌の奥と、息の出方を見比べよう。')}
      if(audio&&typeof audio.addEventListener==='function')audio.addEventListener('ended',function(){if(token===modelToken)button.classList.remove('is-playing')},{once:true});
      playingTimer=setTimeout(function(){if(token===modelToken)button.classList.remove('is-playing')},2200);
    }catch(e){if(token===modelToken){button.classList.remove('is-playing');feedback(fb,'音声を再生できませんでした。もう一度聞いてみよう。','bad')}}
    finally{if(token===modelToken)button.removeAttribute('aria-busy')}
  }
  function renderArt(){
    el('gkhArticulation').innerHTML='<span class="gkh-diagram-shell">'+gkhDiagram(selected,'live','live')+'<small class="gkh-view-label">舌の奥・ゆっくり</small></span><span class="gkh-art-cue">'+guide[selected].cue+'</span>';
    var item=guide[selected];el('gkhStaticGuide').innerHTML='<div class="gkh-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+gkhDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div><p class="gkh-static-note">'+item.compare+'</p>';
    var svg=el('gkhArticulation').querySelector('svg');if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;root.querySelectorAll('[data-gkh-letter]').forEach(function(b){var active=b.dataset.gkhLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('gkhFocusLetter').textContent=letter;el('gkhFocusGuide').textContent=item.hanzi+' '+item.pinyin+' · '+item.ipa;el('gkhFocusTip').textContent=item.tip;
    el('gkhModel').textContent='▶ '+letter+' のお手本を聞く';feedback('gkhModelFeedback','');feedback('gkhPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('gkhModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('gkhPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('gkhRecord').disabled=true;el('gkhRecord').textContent='マイクを準備中…';el('gkhRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('gkhPracticeFeedback','マイクを準備しています…');
    try{
      var media=await navigator.mediaDevices.getUserMedia({audio:true});
      if(token!==recordToken){media.getTracks().forEach(function(t){t.stop()});return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);media.getTracks().forEach(function(t){t.stop()});if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('gkhPracticeFeedback','録音できたよ。お手本と聞きくらべてみよう。','good')}else feedback('gkhPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('gkhPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}media.getTracks().forEach(function(t){t.stop()})};
      pendingRecord=false;rec.start(100);el('gkhRecord').disabled=false;el('gkhRecord').removeAttribute('aria-busy');el('gkhRecord').textContent='■ 録音を止める';el('gkhRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('gkhPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();feedback('gkhPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('gkhPlayback');playback=new Audio(recordings[selected]);playback.playsInline=true;button.classList.add('is-playing');
    playback.onended=function(){button.classList.remove('is-playing')};playback.onerror=function(){button.classList.remove('is-playing');feedback('gkhPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')};
    try{await playback.play()}catch(e){button.classList.remove('is-playing');feedback('gkhPracticeFeedback','もう一度「自分の声を聞く」を押してね。','bad')}
  }
  function quizOrder(){
    var source=letters.concat(letters[Math.floor(Math.random()*letters.length)]),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  function renderQuestion(){
    var box=el('gkhQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.gkhAnswer=letter;b.onclick=function(){answer(letter,b)};box.appendChild(b)});
    el('gkhQuizCount').textContent=(quiz.index+1)+' / 4';feedback('gkhQuizFeedback','');el('gkhQuizNext').hidden=true;quiz.answered=false;
  }
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:quizOrder(),index:0,score:0,answered:false};el('gkhToQuiz').hidden=true;el('gkhResult').hidden=true;el('gkhQuizPanel').hidden=false;renderQuestion();
    el('gkhQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});playModel(quiz.order[0],el('gkhQuizListen'),true);
  }
  function answer(letter,button){
    if(!quiz.active||quiz.answered)return;quiz.answered=true;var right=quiz.order[quiz.index],correct=letter===right;
    el('gkhQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true;if(b.dataset.gkhAnswer===right)b.classList.add('is-correct')});
    if(correct){quiz.score++;feedback('gkhQuizFeedback','いい耳！ '+right+' だよ。','good')}else{button.classList.add('is-wrong');feedback('gkhQuizFeedback','今回は '+right+'。もう一度音を聞いて確かめよう。','bad')}
    if(quiz.index===3)quizTimer=setTimeout(function(){if(quiz.active&&quiz.answered&&quiz.index===3)finishQuiz()},650);else el('gkhQuizNext').hidden=false;
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=3)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('gkhQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-gkh-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=3;el('gkhQuizPanel').hidden=true;el('gkhResult').hidden=false;
    el('gkhResultMark').textContent=passed?'✓':'↻';el('gkhResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('gkhResultScore').textContent='4問中 '+quiz.score+'問正解';
    var message=passed?'舌の奥と、g・k・h の息の違いがつかめたよ。':'g と k の息の強さ、h の続く息を聞いてみよう。';el('gkhResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaInitialP5Complete','1')}catch(e){}el('gkhCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:4,passed:passed,title:passed?'g・k・h クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('gkhResult'),celebration);var replay=el('gkhResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('gkhResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-gkh-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();
    feedback('gkhPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('gkhModelFeedback','');
    if(quiz.active){quiz.active=false;el('gkhQuizPanel').hidden=true;el('gkhToQuiz').hidden=false}
  }
  function init(){
    root=el('kidsInitialsGKHLesson');if(!root)return;
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='gkh-letter-card';button.dataset.gkhLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small><em>'+(letter==='h'?'続く息':item.cue)+'</em>';button.onclick=function(){select(letter,true)};el('gkhLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.gkhLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('gkhFreeChoice').appendChild(free)});
    el('gkhModel').onclick=function(){playModel(selected,this,false)};el('gkhRecord').onclick=toggleRecord;el('gkhPlayback').onclick=playRecording;el('gkhToQuiz').onclick=startQuiz;el('gkhRetry').onclick=startQuiz;
    el('gkhQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('gkhQuizNext').onclick=nextQuestion;
    el('gkhReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P5:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pagehide',cleanup);el('gkhCompleteBadge').hidden=!complete();select('g',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
