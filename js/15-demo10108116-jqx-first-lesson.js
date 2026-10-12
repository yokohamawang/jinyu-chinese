(function(){
  "use strict";
  var jqxRest='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46.4 42 45.4 44 45.2 C47 45 50 43 54 40 C59 37 67 35 76 35 C86 35 92 39 98 39 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var jqxTouch='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46.4 42 45.4 44 45.2 C47 45 50 41 54 37 C59 33 65 32 73 31.4 C81 31 90 35 98 39 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var jqxNarrow='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46.4 42 45.4 44 45.2 C47 45 50 42.5 54 39.7 C59 35.7 65 34.7 73 34.1 C81 33.7 90 36.5 98 39 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  function jqxDiagram(letter,mode,instance){
    var id='jqx116-'+letter+'-'+instance+'-',live=mode==='live',fricative=letter==='x';
    var target=fricative?jqxNarrow:jqxTouch,path=live?jqxRest:(mode==='contact'||fricative?target:jqxNarrow);
    var times=fricative?'0;.20;.78;.92;1':'0;.18;.35;.46;.68;.86;1';
    function pulse(values,t){return live?'<animate attributeName="opacity" values="'+values+'" keyTimes="'+t+'" dur="3.6s" repeatCount="indefinite"/>':''}
    var defs='<radialGradient id="'+id+'skin" cx="30%" cy="24%" r="82%"><stop offset="0" stop-color="#fff8ea"/><stop offset=".32" stop-color="#fae9d6"/><stop offset=".72" stop-color="#edcbb0"/><stop offset="1" stop-color="#dbb497"/></radialGradient>'
      +'<linearGradient id="'+id+'cavity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d5af96"/><stop offset=".2" stop-color="#efd5bc"/><stop offset=".55" stop-color="#fff3e2"/><stop offset="1" stop-color="#dbb599"/></linearGradient>'
      +'<linearGradient id="'+id+'roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ba937a"/><stop offset="1" stop-color="#e4c6aa"/></linearGradient>'
      +'<radialGradient id="'+id+'tooth" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#fffef7"/><stop offset=".52" stop-color="#fcf5e6"/><stop offset="1" stop-color="#e4d5b8"/></radialGradient>'
      +'<linearGradient id="'+id+'lip" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#f0b8a7"/><stop offset=".52" stop-color="#df9682"/><stop offset="1" stop-color="#bd7966"/></linearGradient>'
      +'<radialGradient id="'+id+'tongue" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(68 33) scale(68 24)"><stop offset="0" stop-color="#f5c5b0"/><stop offset=".4" stop-color="#e7a28a"/><stop offset="1" stop-color="#ba765f"/></radialGradient>'
      +'<linearGradient id="'+id+'air" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#568e73"/><stop offset="1" stop-color="#7aae92"/></linearGradient>';
    var profile='<path class="jqx-face" fill="url(#'+id+'skin)" d="M53 16 C45 23 41 31 39 39 C37 47 30 52 23 57 C17 61 17 65 23 68 C28 71 34 69 38 68 C39 75 35 81 29 85.2 C28 86 26.3 86.6 26 87.3 C28.5 88.2 32 88.3 36 88.1 L36 101.6 C33 101 29 100.7 26 101.4 C27 102.4 28.5 103.1 30 103.4 C34 109 32 112 32 115 C32 125 46 133 61 136 C85 140 109 138 127 131 L127 40 C91 20 70 18 53 16Z"/>'
      +'<path fill="none" stroke="#b58a6c" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" d="M127 40 C91 20 70 18 53 16 C45 23 41 31 39 39 C37 47 30 52 23 57 C17 61 17 65 23 68 C28 71 34 69 38 68 C39 75 35 81 29 85.2 C28 86 26.3 86.6 26 87.3 M26 101.4 C27 102.4 28.5 103.1 30 103.4 C34 109 32 112 32 115 C32 125 46 133 61 136 C85 140 109 138 127 131"/>'
      +'<path fill="none" stroke="#ead5bf" stroke-width="2" stroke-linecap="round" d="M45 34 Q42 48 29 58"/><ellipse fill="#987157" cx="30" cy="65" rx="4.4" ry="2.1" transform="rotate(-14 30 65)"/>';
    var morph=live?'<animate attributeName="d" values="'+(fricative?[jqxRest,target,target,jqxRest,jqxRest]:[jqxRest,target,target,jqxNarrow,jqxNarrow,jqxRest,jqxRest]).join(';')+'" keyTimes="'+times+'" dur="3.6s" repeatCount="indefinite"/>':'';
    var contact=fricative?'':'<path class="jqx-contact" d="M62 33.2 Q68 31.8 74 31.5" fill="none" stroke="#d3a64d" stroke-width="1.5" stroke-linecap="round" opacity="'+(live?'0':mode==='contact'?'.8':'0')+'">'+pulse('0;0;.8;.8;0;0','0;.17;.20;.34;.40;1')+'</path>';
    var airVisible=!live&&mode==='release',airValues=fricative?'0;0;.66;.66;0;0':letter==='q'?'0;0;.75;.75;0;0':'0;0;.35;.35;0;0';
    var airTimes=fricative?'0;.20;.28;.70;.78;1':letter==='q'?'0;.38;.46;.68;.79;1':'0;.38;.46;.62;.74;1';
    var air='<g class="jqx-air" fill="none" stroke="url(#'+id+'air)" stroke-width="'+(fricative?'1.3':'1.4')+'" stroke-linecap="round" stroke-linejoin="round" opacity="'+(airVisible?(letter==='q'?'.75':fricative?'.66':'.35'):'0')+'">'+pulse(airValues,airTimes)
      +'<path d="M124 38.5 Q108 37 94 35.8 Q85 33 77 32.5 Q67 32 56 36.5 Q49 39 44 39.3 Q32 39.4 18 38.5"/><path d="M24 36.5 L18 38.5 L24 40.3"/>'
      +(letter==='q'?'<path d="M27 40.2 Q22 40.6 16 41"/>':'')+'</g>';
    var oral='<path fill="url(#'+id+'cavity)" d="M35 34 Q70 25 101 29.8 L125 33 L131 49.8 Q95 56.2 38 51 L35 47Z"/>'
      +'<path class="jqx-hard-palate" fill="none" stroke="url(#'+id+'roof)" stroke-width="5" stroke-linecap="round" d="M36 32.2 Q39 31.2 42 31.8 Q48 33.8 59 31 Q86 26.6 101 29.8"/>'
      +'<path class="jqx-soft-palate" fill="none" stroke="url(#'+id+'roof)" stroke-width="5" stroke-linecap="round" d="M101 29.8 Q111 30.8 125 33"/>'
      +'<path fill="none" stroke="url(#'+id+'roof)" stroke-width="2.5" stroke-linecap="round" d="M34 51.4 C54 54.6 86 56.2 126 51.8"/>'
      +'<path fill="url(#'+id+'tooth)" stroke="#b9a689" stroke-width=".5" d="M37.3 45.9 Q38.5 45.9 39.7 46.5 Q40.7 47 41.2 48.3 L41.4 50.8 Q41.4 51.5 40.2 51.4 L37.5 50.8 Q36.8 50.7 36.5 49.7 L35.9 47 Q35.8 46 37.3 45.9Z"/>'
      +'<path class="jqx-tongue" fill="url(#'+id+'tongue)" stroke="#b1715b" stroke-width=".7" stroke-linejoin="round" d="'+path+'">'+morph+'</path>'
      +'<path fill="url(#'+id+'tooth)" stroke="#b9a689" stroke-width=".5" d="M38.4 29.8 C39.8 29.6 41.2 30.1 41.6 31.1 L40.7 35.9 Q40.3 37.2 39.1 37.1 L36.3 36.6 Q35.6 36.3 35.9 35.1 L37.2 31 Q37.6 30 38.4 29.8Z"/>'
      +'<path fill="url(#'+id+'lip)" d="M29 31.2 C28 32 26.3 32.6 26 33.3 C29.6 34.1 33.2 34.2 36 33.8 C34.6 32.9 31.8 32 29 31.2Z"/>'
      +'<path fill="url(#'+id+'lip)" d="M26 47.4 C29 46.7 33 47 36 47.6 C33.5 48.2 31.9 49 30 49.4 C28.5 49.1 27 48.4 26 47.4Z"/>'+contact+air
      +(live?'<text fill="#80624b" font-size="10.5" font-weight="600" x="66" y="17">前の上あご</text>':'');
    return '<svg class="jqx-art-svg" viewBox="0 0 144 154" data-letter="'+letter+'" aria-hidden="true" focusable="false"><defs>'+defs+'</defs>'+profile+'<g transform="translate(0 54)">'+oral+'</g></svg>';
  }

  var letters=['j','q','x'];
  var guide={"j": {"hanzi": "鸡", "pinyin": "jī", "ipa": "[tɕ]", "cue": "弱い息", "tip": "舌先は下の歯の裏。舌の前面で息を止め、細いすき間を開きます。", "labels": ["つける", "細く開く"], "notes": ["舌の前面で息を止める", "すき間から弱い息"]}, "q": {"hanzi": "七", "pinyin": "qī", "ipa": "[tɕʰ]", "cue": "強い息", "tip": "j と同じ場所。舌の前面で止め、すき間を開くときに強い息を出します。", "labels": ["つける", "強い息"], "notes": ["j と同じ場所で止める", "すき間から強い息"]}, "x": {"hanzi": "西", "pinyin": "xī", "ipa": "[ɕ]", "cue": "細く続く息", "tip": "舌先は下の歯の裏。舌の前面を近づけ、すき間から細い息を続けます。", "labels": ["すき間を残す", "息を通す"], "notes": ["完全にはふさがない", "細い息を続ける"]}};
  var selected='j',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='jqxModelFeedback'?'jqx-model-feedback':'jqx-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaInitialP6Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-jqx-letter]').forEach(function(b){b.disabled=busy});
    el('jqxModel').disabled=busy;el('jqxToQuiz').disabled=busy;
    el('jqxPlayback').disabled=busy||!recordings[selected];
    el('jqxPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('jqxRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('jqxRecord').disabled=false;el('jqxRecord').classList.remove('is-recording');el('jqxRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(typeof window.stopStandardAudio==='function')window.stopStandardAudio()}catch(e){}
    try{if('speechSynthesis' in window)window.speechSynthesis.cancel()}catch(e){}
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#jqxModel[aria-busy],#jqxQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
  }
  function resetArt(){
    var svg=el('jqxArticulation').querySelector('svg');if(!svg)return;
    try{if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}else{svg.unpauseAnimations();svg.setCurrentTime(selected==='x'?1.008:1.224)}}catch(e){}
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
    stopSound();var token=modelToken,item=guide[letter],fb=forQuiz?'jqxQuizFeedback':'jqxModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(!forQuiz)feedback(fb,'お手本を準備しています…');
    try{
      var audio=typeof window.playMachine==='function'?await window.playMachine(item.hanzi,null,false):null;
      if(token!==modelToken)return;
      if(!audio)audio=await fallbackSpeech(item.hanzi);
      if(token!==modelToken)return;
      if(!forQuiz){resetArt();feedback(fb,'舌の前面と、息の出方を見比べよう。')}
      if(audio&&typeof audio.addEventListener==='function')audio.addEventListener('ended',function(){if(token===modelToken)button.classList.remove('is-playing')},{once:true});
      playingTimer=setTimeout(function(){if(token===modelToken)button.classList.remove('is-playing')},2200);
    }catch(e){if(token===modelToken){button.classList.remove('is-playing');feedback(fb,'音声を再生できませんでした。もう一度聞いてみよう。','bad')}}
    finally{if(token===modelToken)button.removeAttribute('aria-busy')}
  }
  function renderArt(){
    el('jqxArticulation').innerHTML='<span class="jqx-diagram-shell">'+jqxDiagram(selected,'live','live')+'<small class="jqx-view-label">舌の前面・ゆっくり</small></span><span class="jqx-art-cue">'+guide[selected].cue+'</span>';
    var item=guide[selected];el('jqxStaticGuide').innerHTML='<div class="jqx-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+jqxDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('jqxStaticLetter').textContent=selected;
    var svg=el('jqxArticulation').querySelector('svg');if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;root.querySelectorAll('[data-jqx-letter]').forEach(function(b){var active=b.dataset.jqxLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('jqxFocusLetter').textContent=letter;el('jqxFocusGuide').textContent=item.hanzi+' '+item.pinyin+' · '+item.ipa;el('jqxFocusTip').textContent=item.tip;
    el('jqxModel').textContent='▶ '+letter+' のお手本を聞く';feedback('jqxModelFeedback','');feedback('jqxPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('jqxModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('jqxPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('jqxRecord').disabled=true;el('jqxRecord').textContent='マイクを準備中…';el('jqxRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('jqxPracticeFeedback','マイクを準備しています…');
    try{
      var media=await navigator.mediaDevices.getUserMedia({audio:true});
      if(token!==recordToken){media.getTracks().forEach(function(t){t.stop()});return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);media.getTracks().forEach(function(t){t.stop()});if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('jqxPracticeFeedback','録音できたよ。お手本と聞きくらべてみよう。','good')}else feedback('jqxPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('jqxPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}media.getTracks().forEach(function(t){t.stop()})};
      pendingRecord=false;rec.start(100);el('jqxRecord').disabled=false;el('jqxRecord').removeAttribute('aria-busy');el('jqxRecord').textContent='■ 録音を止める';el('jqxRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('jqxPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();feedback('jqxPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('jqxPlayback');playback=new Audio(recordings[selected]);playback.playsInline=true;button.classList.add('is-playing');
    playback.onended=function(){button.classList.remove('is-playing')};playback.onerror=function(){button.classList.remove('is-playing');feedback('jqxPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')};
    try{await playback.play()}catch(e){button.classList.remove('is-playing');feedback('jqxPracticeFeedback','もう一度「自分の声を聞く」を押してね。','bad')}
  }
  function quizOrder(){
    var source=letters.concat(letters[Math.floor(Math.random()*letters.length)]),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  function renderQuestion(){
    var box=el('jqxQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.jqxAnswer=letter;b.onclick=function(){answer(letter,b)};box.appendChild(b)});
    el('jqxQuizCount').textContent=(quiz.index+1)+' / 4';feedback('jqxQuizFeedback','');el('jqxQuizNext').hidden=true;quiz.answered=false;
  }
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:quizOrder(),index:0,score:0,answered:false};el('jqxToQuiz').hidden=true;el('jqxResult').hidden=true;el('jqxQuizPanel').hidden=false;root.querySelector('.jqx-practice').hidden=true;renderQuestion();
    el('jqxQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    if(!quiz.active||quiz.answered)return;quiz.answered=true;var right=quiz.order[quiz.index],correct=letter===right;
    el('jqxQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true;if(b.dataset.jqxAnswer===right)b.classList.add('is-correct')});
    if(correct){quiz.score++;feedback('jqxQuizFeedback','いい耳！ '+right+' だよ。','good')}else{button.classList.add('is-wrong');feedback('jqxQuizFeedback','今回は '+right+'。もう一度音を聞いて確かめよう。','bad')}
    if(quiz.index===3)quizTimer=setTimeout(function(){if(quiz.active&&quiz.answered&&quiz.index===3)finishQuiz()},650);else el('jqxQuizNext').hidden=false;
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=3)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('jqxQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-jqx-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=3;el('jqxQuizPanel').hidden=true;el('jqxResult').hidden=false;el('jqxRetry').hidden=passed;el('jqxReturn').hidden=!passed;
    el('jqxResultMark').textContent=passed?'✓':'↻';el('jqxResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('jqxResultScore').textContent='4問中 '+quiz.score+'問正解';
    var message=passed?'舌の前面と、j・q・x の息の違いがつかめたよ。':'j と q の息の強さ、x の続く息を聞いてみよう。';el('jqxResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaInitialP6Complete','1')}catch(e){}el('jqxCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:4,passed:passed,title:passed?'j・q・x クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('jqxResult'),celebration);var replay=el('jqxResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('jqxResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-jqx-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();
    feedback('jqxPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('jqxModelFeedback','');
    if(quiz.active){quiz.active=false;el('jqxQuizPanel').hidden=true;el('jqxToQuiz').hidden=false;root.querySelector('.jqx-practice').hidden=false}
  }
  function init(){
    root=el('kidsInitialsJQXLesson');if(!root)return;
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='jqx-letter-card';button.dataset.jqxLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small><em>'+(letter==='x'?'続く息':item.cue)+'</em>';button.onclick=function(){select(letter,true)};el('jqxLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.jqxLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('jqxFreeChoice').appendChild(free)});
    el('jqxModel').onclick=function(){playModel(selected,this,false)};el('jqxRecord').onclick=toggleRecord;el('jqxPlayback').onclick=playRecording;el('jqxToQuiz').onclick=startQuiz;el('jqxRetry').onclick=startQuiz;
    el('jqxQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('jqxQuizNext').onclick=nextQuestion;
    el('jqxReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P6:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pagehide',cleanup);el('jqxCompleteBadge').hidden=!complete();select('j',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
