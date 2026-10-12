(function(){
  "use strict";
  var zhrRest='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46 41 44 43 41 C44 43.3 48 40.6 53 39.8 C55 39 57 39.2 58 40 C59 41 56.7 43 54.5 44 C53 44.8 55 45.8 60 41.5 C75 43 91 41 98 40 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var zhrTouch='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46 41 44 43 41 C44 38.5 48 35.8 53 35 C55 34.2 57 34.4 58 35.2 C59 36.2 56.7 38.2 54.5 39.2 C53 40 55 41 60 41.5 C75 43 91 41 98 40 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var zhrNarrow='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46 41 44 43 41 C44 41.2 48 38.5 53 37.7 C55 36.9 57 37.1 58 37.9 C59 38.9 56.7 40.9 54.5 41.9 C53 42.7 55 43.7 60 41.5 C75 43 91 41 98 40 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var zhrVoiced='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46 41 44 43 41 C44 42.1 48 39.4 53 38.6 C55 37.8 57 38 58 38.8 C59 39.8 56.7 41.8 54.5 42.8 C53 43.6 55 44.6 60 41.5 C75 43 91 41 98 40 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  function zhrDiagram(letter,mode,instance){
    var id='zhr117-'+letter+'-'+instance+'-',live=mode==='live',fricative=letter==='sh'||letter==='r',voiced=letter==='r';
    var target=voiced?zhrVoiced:fricative?zhrNarrow:zhrTouch,path=live?zhrRest:(mode==='contact'||fricative?target:zhrNarrow);
    var times=fricative?'0;.20;.78;.92;1':'0;.18;.35;.46;.68;.86;1';
    function pulse(values,t){return live?'<animate attributeName="opacity" values="'+values+'" keyTimes="'+t+'" dur="3.6s" repeatCount="indefinite"/>':''}
    var defs='<radialGradient id="'+id+'skin" cx="30%" cy="24%" r="82%"><stop offset="0" stop-color="#fff8ea"/><stop offset=".32" stop-color="#fae9d6"/><stop offset=".72" stop-color="#edcbb0"/><stop offset="1" stop-color="#dbb497"/></radialGradient>'
      +'<linearGradient id="'+id+'cavity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d5af96"/><stop offset=".2" stop-color="#efd5bc"/><stop offset=".55" stop-color="#fff3e2"/><stop offset="1" stop-color="#dbb599"/></linearGradient>'
      +'<linearGradient id="'+id+'roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ba937a"/><stop offset="1" stop-color="#e4c6aa"/></linearGradient>'
      +'<radialGradient id="'+id+'tooth" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#fffef7"/><stop offset=".52" stop-color="#fcf5e6"/><stop offset="1" stop-color="#e4d5b8"/></radialGradient>'
      +'<linearGradient id="'+id+'lip" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#f0b8a7"/><stop offset=".52" stop-color="#df9682"/><stop offset="1" stop-color="#bd7966"/></linearGradient>'
      +'<radialGradient id="'+id+'tongue" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(56 38) scale(67 25)"><stop offset="0" stop-color="#f5c5b0"/><stop offset=".4" stop-color="#e7a28a"/><stop offset="1" stop-color="#ba765f"/></radialGradient>'
      +'<linearGradient id="'+id+'air" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#568e73"/><stop offset="1" stop-color="#7aae92"/></linearGradient>';
    var profile='<path class="zhr-face" fill="url(#'+id+'skin)" d="M53 16 C45 23 41 31 39 39 C37 47 30 52 23 57 C17 61 17 65 23 68 C28 71 34 69 38 68 C39 75 35 81 29 85.2 C28 86 26.3 86.6 26 87.3 C28.5 88.2 32 88.3 36 88.1 L36 101.6 C33 101 29 100.7 26 101.4 C27 102.4 28.5 103.1 30 103.4 C34 109 32 112 32 115 C32 125 46 133 61 136 C85 140 109 138 127 131 L127 40 C91 20 70 18 53 16Z"/>'
      +'<path fill="none" stroke="#b58a6c" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" d="M127 40 C91 20 70 18 53 16 C45 23 41 31 39 39 C37 47 30 52 23 57 C17 61 17 65 23 68 C28 71 34 69 38 68 C39 75 35 81 29 85.2 C28 86 26.3 86.6 26 87.3 M26 101.4 C27 102.4 28.5 103.1 30 103.4 C34 109 32 112 32 115 C32 125 46 133 61 136 C85 140 109 138 127 131"/>'
      +'<path fill="none" stroke="#ead5bf" stroke-width="2" stroke-linecap="round" d="M45 34 Q42 48 29 58"/><ellipse fill="#987157" cx="30" cy="65" rx="4.4" ry="2.1" transform="rotate(-14 30 65)"/>';
    var morph=live?'<animate attributeName="d" values="'+(fricative?[zhrRest,target,target,zhrRest,zhrRest]:[zhrRest,target,target,zhrNarrow,zhrNarrow,zhrRest,zhrRest]).join(';')+'" keyTimes="'+times+'" dur="3.6s" repeatCount="indefinite"/>':'';
    var contact=fricative?'':'<path class="zhr-contact" d="M52 35.3 Q55 34.3 58 35.2" fill="none" stroke="#d3a64d" stroke-width="1.5" stroke-linecap="round" opacity="'+(live?'0':mode==='contact'?'.8':'0')+'">'+pulse('0;0;.8;.8;0;0','0;.17;.20;.34;.40;1')+'</path>';
    var airVisible=!live&&mode==='release',airValues=voiced?'0;0;.42;.42;0;0':fricative?'0;0;.66;.66;0;0':letter==='ch'?'0;0;.75;.75;0;0':'0;0;.35;.35;0;0';
    var airTimes=fricative?'0;.20;.28;.70;.78;1':letter==='ch'?'0;.46;.50;.68;.79;1':'0;.46;.50;.62;.74;1';
    var air='<g class="zhr-air" fill="none" stroke="url(#'+id+'air)" stroke-width="'+(fricative?'1.3':'1.4')+'" stroke-linecap="round" stroke-linejoin="round" opacity="'+(airVisible?(letter==='ch'?'.75':voiced?'.42':fricative?'.66':'.35'):'0')+'">'+pulse(airValues,airTimes)
      +'<path d="M124 38.5 Q105 37.5 85 40.3 Q71 40.3 64 40.5 Q60 40 59 37.5 Q58 36.6 56 36.4 Q50 36.8 18 38.5"/><path d="M24 36.5 L18 38.5 L24 40.3"/>'
      +(letter==='ch'?'<path d="M27 40.2 Q22 40.6 16 41"/>':'')+'</g>';
    var oral='<path fill="url(#'+id+'cavity)" d="M35 34 Q70 25 101 29.8 L125 33 L131 49.8 Q95 56.2 38 51 L35 47Z"/>'
      +'<path class="zhr-hard-palate" fill="none" stroke="url(#'+id+'roof)" stroke-width="5" stroke-linecap="round" d="M36 32.2 Q39 31.2 42 31.8 Q48 33.8 59 31 Q86 26.6 101 29.8"/>'
      +'<path class="zhr-soft-palate" fill="none" stroke="url(#'+id+'roof)" stroke-width="5" stroke-linecap="round" d="M101 29.8 Q111 30.8 125 33"/>'
      +'<path fill="none" stroke="url(#'+id+'roof)" stroke-width="2.5" stroke-linecap="round" d="M34 51.4 C54 54.6 86 56.2 126 51.8"/>'
      +'<path fill="url(#'+id+'tooth)" stroke="#b9a689" stroke-width=".5" d="M37.3 45.9 Q38.5 45.9 39.7 46.5 Q40.7 47 41.2 48.3 L41.4 50.8 Q41.4 51.5 40.2 51.4 L37.5 50.8 Q36.8 50.7 36.5 49.7 L35.9 47 Q35.8 46 37.3 45.9Z"/>'
      +'<path class="zhr-tongue" fill="url(#'+id+'tongue)" stroke="#b1715b" stroke-width=".7" stroke-linejoin="round" d="'+path+'">'+morph+'</path>'
      +'<path fill="url(#'+id+'tooth)" stroke="#b9a689" stroke-width=".5" d="M38.4 29.8 C39.8 29.6 41.2 30.1 41.6 31.1 L40.7 35.9 Q40.3 37.2 39.1 37.1 L36.3 36.6 Q35.6 36.3 35.9 35.1 L37.2 31 Q37.6 30 38.4 29.8Z"/>'
      +'<path fill="url(#'+id+'lip)" d="M29 31.2 C28 32 26.3 32.6 26 33.3 C29.6 34.1 33.2 34.2 36 33.8 C34.6 32.9 31.8 32 29 31.2Z"/>'
      +'<path fill="url(#'+id+'lip)" d="M26 47.4 C29 46.7 33 47 36 47.6 C33.5 48.2 31.9 49 30 49.4 C28.5 49.1 27 48.4 26 47.4Z"/>'+contact+air
      +(live?'<text fill="#80624b" font-size="9" font-weight="600" x="53" y="17">歯ぐきの奥</text>':'');
    return '<svg class="zhr-art-svg" viewBox="0 0 144 154" data-letter="'+letter+'" aria-hidden="true" focusable="false"><defs>'+defs+'</defs>'+profile+'<g transform="translate(0 54)">'+oral+'</g></svg>';
  }

  var letters=['zh','ch','sh','r'];
  var guide={"zh": {"hanzi": "智", "pinyin": "zhì", "ipa": "[tʂ]", "cue": "弱い息", "tip": "舌先を少し上げ、奥の上あごにつけます。息を止め、細いすき間を開きます。", "labels": ["つける", "細く開く"], "notes": ["舌先で息を止める", "すき間から弱い息"]}, "ch": {"hanzi": "赤", "pinyin": "chì", "ipa": "[tʂʰ]", "cue": "強い息", "tip": "zh と同じ場所で止め、すき間を開くときに強い息を出します。", "labels": ["つける", "強い息"], "notes": ["zh と同じ場所で止める", "すき間から強い息"]}, "sh": {"hanzi": "是", "pinyin": "shì", "ipa": "[ʂ]", "cue": "息を続ける", "tip": "舌先を少し上げ、奥の上あごとのすき間から息を続けます。", "labels": ["すき間を残す", "息を通す"], "notes": ["舌先を近づける", "すき間から息を続ける"]}, "r": {"hanzi": "日", "pinyin": "rì", "ipa": "[ʐ]", "cue": "声を響かせる", "tip": "舌先を少し上げ、声帯を振動させます。sh よりやわらかく声を通します。", "labels": ["すき間を残す", "声を響かせる"], "notes": ["完全にはふさがない", "喉の振動を感じる"]}};
  var selected='zh',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='zhrModelFeedback'?'zhr-model-feedback':'zhr-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaInitialP7Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-zhr-letter]').forEach(function(b){b.disabled=busy});
    el('zhrModel').disabled=busy;el('zhrToQuiz').disabled=busy;
    el('zhrPlayback').disabled=busy||!recordings[selected];
    el('zhrPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('zhrRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('zhrRecord').disabled=false;el('zhrRecord').classList.remove('is-recording');el('zhrRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(typeof window.stopStandardAudio==='function')window.stopStandardAudio()}catch(e){}
    try{if('speechSynthesis' in window)window.speechSynthesis.cancel()}catch(e){}
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#zhrModel[aria-busy],#zhrQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
  }
  function resetArt(){
    var svg=el('zhrArticulation').querySelector('svg');if(!svg)return;
    try{if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}else{svg.unpauseAnimations();svg.setCurrentTime((selected==='sh'||selected==='r')?1.008:1.224)}}catch(e){}
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
    stopSound();var token=modelToken,item=guide[letter],fb=forQuiz?'zhrQuizFeedback':'zhrModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(!forQuiz)feedback(fb,'お手本を準備しています…');
    try{
      var audio=typeof window.playMachine==='function'?await window.playMachine(item.hanzi,null,false):null;
      if(token!==modelToken)return;
      if(!audio)audio=await fallbackSpeech(item.hanzi);
      if(token!==modelToken)return;
      if(!forQuiz){resetArt();feedback(fb,'舌先と、息・声の出方を見比べよう。')}
      if(audio&&typeof audio.addEventListener==='function')audio.addEventListener('ended',function(){if(token===modelToken)button.classList.remove('is-playing')},{once:true});
      playingTimer=setTimeout(function(){if(token===modelToken)button.classList.remove('is-playing')},2200);
    }catch(e){if(token===modelToken){button.classList.remove('is-playing');feedback(fb,'音声を再生できませんでした。もう一度聞いてみよう。','bad')}}
    finally{if(token===modelToken)button.removeAttribute('aria-busy')}
  }
  function renderArt(){
    el('zhrArticulation').innerHTML='<span class="zhr-diagram-shell">'+zhrDiagram(selected,'live','live')+'<small class="zhr-view-label">舌先を上げる・ゆっくり</small></span><span class="zhr-art-cue-wrap"><span class="zhr-art-cue">'+guide[selected].cue+'</span>'+(selected==='r'?'<small class="zhr-voice"><svg viewBox="0 0 32 18" aria-hidden="true"><path d="M2 9 Q6 2 10 9 T18 9 T26 9 T30 9"/></svg>声帯の振動</small>':'')+'</span>';
    var item=guide[selected];el('zhrStaticGuide').innerHTML='<div class="zhr-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+zhrDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('zhrStaticLetter').textContent=selected;
    var svg=el('zhrArticulation').querySelector('svg');if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;root.querySelectorAll('[data-zhr-letter]').forEach(function(b){var active=b.dataset.zhrLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('zhrFocusLetter').textContent=letter;el('zhrFocusGuide').textContent=item.hanzi+' '+item.pinyin+' · '+item.ipa;el('zhrFocusTip').textContent=item.tip;
    el('zhrModel').textContent='▶ '+letter+' のお手本を聞く';feedback('zhrModelFeedback','');feedback('zhrPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('zhrModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('zhrPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('zhrRecord').disabled=true;el('zhrRecord').textContent='マイクを準備中…';el('zhrRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('zhrPracticeFeedback','マイクを準備しています…');
    try{
      var media=await navigator.mediaDevices.getUserMedia({audio:true});
      if(token!==recordToken){media.getTracks().forEach(function(t){t.stop()});return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);media.getTracks().forEach(function(t){t.stop()});if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('zhrPracticeFeedback','録音できたよ。お手本と聞きくらべてみよう。','good')}else feedback('zhrPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('zhrPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}media.getTracks().forEach(function(t){t.stop()})};
      pendingRecord=false;rec.start(100);el('zhrRecord').disabled=false;el('zhrRecord').removeAttribute('aria-busy');el('zhrRecord').textContent='■ 録音を止める';el('zhrRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('zhrPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();feedback('zhrPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('zhrPlayback');playback=new Audio(recordings[selected]);playback.playsInline=true;button.classList.add('is-playing');
    playback.onended=function(){button.classList.remove('is-playing')};playback.onerror=function(){button.classList.remove('is-playing');feedback('zhrPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')};
    try{await playback.play()}catch(e){button.classList.remove('is-playing');feedback('zhrPracticeFeedback','もう一度「自分の声を聞く」を押してね。','bad')}
  }
  function quizOrder(){
    var source=letters.slice(),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  function renderQuestion(){
    var box=el('zhrQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.zhrAnswer=letter;b.onclick=function(){answer(letter,b)};box.appendChild(b)});
    el('zhrQuizCount').textContent=(quiz.index+1)+' / 4';feedback('zhrQuizFeedback','');el('zhrQuizNext').hidden=true;quiz.answered=false;
  }
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:quizOrder(),index:0,score:0,answered:false};el('zhrToQuiz').hidden=true;el('zhrResult').hidden=true;el('zhrQuizPanel').hidden=false;root.querySelector('.zhr-practice').hidden=true;renderQuestion();
    el('zhrQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    if(!quiz.active||quiz.answered)return;quiz.answered=true;var right=quiz.order[quiz.index],correct=letter===right;
    el('zhrQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true;if(b.dataset.zhrAnswer===right)b.classList.add('is-correct')});
    if(correct){quiz.score++;feedback('zhrQuizFeedback','いい耳！ '+right+' だよ。','good')}else{button.classList.add('is-wrong');feedback('zhrQuizFeedback','今回は '+right+'。もう一度音を聞いて確かめよう。','bad')}
    if(quiz.index===3)quizTimer=setTimeout(function(){if(quiz.active&&quiz.answered&&quiz.index===3)finishQuiz()},650);else el('zhrQuizNext').hidden=false;
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=3)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('zhrQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-zhr-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=3;el('zhrQuizPanel').hidden=true;el('zhrResult').hidden=false;el('zhrRetry').hidden=passed;el('zhrReturn').hidden=!passed;
    el('zhrResultMark').textContent=passed?'✓':'↻';el('zhrResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('zhrResultScore').textContent='4問中 '+quiz.score+'問正解';
    var message=passed?'舌先と、zh・ch・sh・r の息・声の違いがつかめたよ。':'zh と ch の息、sh と r の声の違いを聞いてみよう。';el('zhrResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaInitialP7Complete','1')}catch(e){}el('zhrCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:4,passed:passed,title:passed?'zh・ch・sh・r クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('zhrResult'),celebration);var replay=el('zhrResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('zhrResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-zhr-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();
    feedback('zhrPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('zhrModelFeedback','');
    if(quiz.active){quiz.active=false;el('zhrQuizPanel').hidden=true;el('zhrToQuiz').hidden=false;root.querySelector('.zhr-practice').hidden=false}
  }
  function init(){
    root=el('kidsInitialsZHRLesson');if(!root)return;
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='zhr-letter-card';button.dataset.zhrLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small><em>'+(letter==='sh'?'続く息':item.cue)+'</em>';button.onclick=function(){select(letter,true)};el('zhrLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.zhrLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('zhrFreeChoice').appendChild(free)});
    el('zhrModel').onclick=function(){playModel(selected,this,false)};el('zhrRecord').onclick=toggleRecord;el('zhrPlayback').onclick=playRecording;el('zhrToQuiz').onclick=startQuiz;el('zhrRetry').onclick=startQuiz;
    el('zhrQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('zhrQuizNext').onclick=nextQuestion;
    el('zhrReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P7:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pagehide',cleanup);el('zhrCompleteBadge').hidden=!complete();select('zh',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
