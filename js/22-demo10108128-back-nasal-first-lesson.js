/* 10.108.129 — P13 local recorded finals; no full-syllable or character TTS fallback. */
(function(){
  "use strict";
  var mouthCrops={a:[18,145],e:[881,145],o:[451,145],i:[18,632],u:[451,632],ü:[881,632]};
  function photo(pose,live,index){var p=mouthCrops[pose];return '<svg '+(live?'class="bnv-pose bnv-pose-'+index+'" ':'')+'x="0" y="0" width="144" height="132" viewBox="'+p[0]+' '+p[1]+' 412 378" aria-hidden="true"><image href="./assets/articulation/vowel-mouth-101.png" width="1312" height="1199" /></svg>'}
  function nasalDiagram(letter,live,instance){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)live=false;
    var id='bnv-'+instance;
    // Corresponding cubic segments keep the tongue tip/root fixed; only the dorsum rises.
    var starts={"ang": "M43 77 C49 79 58 79 66 78 C81 78 94 77 105 77 C113 78 116 87 118 94 C116 96 88 97 70 94 C57 92 48 87 43 83 C40 81 40 78 43 77 Z", "eng": "M43 77 C49 79 58 79 66 76 C81 70 94 66 105 68 C113 72 116 84 118 94 C116 96 88 97 70 94 C57 92 48 87 43 83 C40 81 40 78 43 77 Z", "ing": "M43 77 C49 76 58 65 66 61 C80 55 94 62 105 68 C113 72 116 84 118 94 C116 96 88 97 70 94 C57 92 48 87 43 83 C40 81 40 78 43 77 Z", "ong": "M43 77 C49 79 58 79 66 76 C81 70 94 59 105 60 C113 65 116 82 118 94 C116 96 88 97 70 94 C57 92 48 87 43 83 C40 81 40 78 43 77 Z"};
    var rest=starts[letter],closed='M43 77 C49 79 58 79 66 76 C83 71 96 47 105 44 C112 42 116 70 118 94 C116 96 88 97 70 94 C57 92 48 87 43 83 C40 81 40 78 43 77 Z';
    return '<svg class="bnv-art-svg bnv-nasal-diagram" viewBox="0 0 144 132" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f5b1a0"/><stop offset="1" stop-color="#d78079"/></linearGradient></defs><rect x="5" y="6" width="134" height="120" rx="22" fill="#fff6ef"/><path d="M25 50 Q39 26 74 29 Q108 29 122 49 L121 96 Q97 112 62 106 Q36 102 25 83" fill="#f5e6da" stroke="#d9b8a4" stroke-width="2"/><path d="M29 50 Q57 34 86 37 Q109 38 119 50" fill="none" stroke="#ba9180" stroke-width="4" stroke-linecap="round"/><path d="M28 84 Q66 107 119 94" fill="none" stroke="#d2ae99" stroke-width="3" stroke-linecap="round"/><rect x="30" y="49" width="9" height="13" rx="3" fill="#fffefa" stroke="#d8cbbb"/><rect x="30" y="75" width="8" height="10" rx="3" fill="#fffefa" stroke="#d8cbbb"/><path class="bnv-nasal-tongue" d="'+(live?rest:closed)+'" fill="url(#'+id+')" stroke="#c77d72" stroke-width="1.3">'+(live?'<animate attributeName="d" values="'+rest+';'+closed+';'+closed+';'+rest+'" keyTimes="0;.48;.86;1" dur="5.2s" repeatCount="indefinite"/>':'')+'</path><circle cx="109" cy="44" r="3" fill="#70ac8a" opacity="'+(live?'0':'.65')+'">'+(live?'<animate attributeName="opacity" values="0;0;.65;.65;0" keyTimes="0;.38;.5;.86;1" dur="5.2s" repeatCount="indefinite"/>':'')+'</circle><g opacity="'+(live?'.15':'1')+'"><path d="M120 48 V27 Q120 17 105 17 H46" fill="none" stroke="#8abc9f" stroke-width="2.5" stroke-linecap="round"/><path d="M51 13 L46 17 L51 21" fill="none" stroke="#8abc9f" stroke-width="2" stroke-linecap="round"/>'+(live?'<animate attributeName="opacity" values=".15;.15;1;1;.15" keyTimes="0;.38;.5;.86;1" dur="5.2s" repeatCount="indefinite"/>':'')+'</g><text x="82" y="14" text-anchor="middle" font-size="9" fill="#4d8064">鼻への通り道</text><text x="86" y="98" text-anchor="middle" font-size="10" fill="#8b544f">舌</text><text x="72" y="119" text-anchor="middle" font-size="9" fill="#678174">口の中・横からの模式図</text></svg>';
  }
  function bnvDiagram(letter,mode,instance){if(mode==='live'||mode==='release')return nasalDiagram(letter,mode==='live',instance);return '<svg class="bnv-art-svg" viewBox="0 0 144 132" aria-hidden="true">'+photo(guide[letter].poses[0],false,0)+'</svg>'}
  function route(letter){
    var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,marks=[letter==='ong'?'o':guide[letter].poses[0],'ng'];
    var values=marks.length===3?'12;89;166;166;12':'12;166;166;12';
    var times=marks.length===3?'0;.24;.48;.86;1':'0;.48;.86;1';
    return '<svg class="bnv-route" viewBox="0 0 180 54" aria-hidden="true"><path d="M12 22H166" stroke="#cfdfd2" stroke-width="3" fill="none"/>'+marks.map(function(p,i){var x=marks.length===3?[12,89,166][i]:[12,166][i];return '<circle cx="'+x+'" cy="22" r="4" fill="#dbeadf"/><text x="'+x+'" y="46" text-anchor="middle" fill="#376e53" font-size="14">'+p+'</text>'}).join('')+'<circle class="bnv-flow-dot" cx="'+(reduced?166:12)+'" cy="22" r="5" fill="#3c9975">'+(reduced?'':'<animate attributeName="cx" values="'+values+'" keyTimes="'+times+'" dur="5.2s" repeatCount="indefinite"/>')+'</circle></svg>';
  }


  var letters=["ang", "eng", "ing", "ong"];
  var guide={"ang": {"hanzi": "肮", "pinyin": "āng", "ipa": "[ɑŋ]", "cue": "a → ng", "tip": "口を開いた a の音から、舌の後ろ側を上あごの奥へ。舌先は前歯の後ろにつけず、鼻の響きで終えます。", "poses": ["a"], "labels": ["スタート（a）", "ゴール（ng の舌位）"], "notes": ["写真は口唇の目安", "舌の後ろ側で閉じ、鼻に響かせる"], "audio": "./assets/audio/back-nasal-129/ang1.wav?v=10.108.129"}, "eng": {"hanzi": "鞥", "pinyin": "ēng", "ipa": "[ɤŋ]", "cue": "e → ng", "tip": "唇を丸めず、中国語の e の音から ng へ。舌の後ろ側を上あごの奥に当て、最後に「グ」を足しません。", "poses": ["e"], "labels": ["スタート（e）", "ゴール（ng の舌位）"], "notes": ["写真は口唇の目安", "舌の後ろ側で閉じ、鼻に響かせる"], "audio": "./assets/audio/back-nasal-129/eng1.wav?v=10.108.129"}, "ing": {"hanzi": "鹰", "pinyin": "yīng", "ipa": "[iŋ]", "cue": "i → ng", "tip": "i の横に開いた口形から、舌の後ろ側を上あごの奥へ。唇を強く閉じず、ng の鼻の響きで収めます。", "poses": ["i"], "labels": ["スタート（i）", "ゴール（ng の舌位）"], "notes": ["写真は口唇の目安", "舌の後ろ側で閉じ、鼻に響かせる"], "audio": "./assets/audio/back-nasal-129/ing1.wav?v=10.108.129"}, "ong": {"hanzi": "", "pinyin": "ong", "ipa": "[ʊŋ]", "cue": "丸い口 → ng", "tip": "唇を小さく丸めた音から ng へ。唇の丸さを保ち、舌の後ろ側で口の奥を閉じて、鼻に響かせます。", "poses": ["u"], "labels": ["スタート（丸い口）", "ゴール（ng の舌位）"], "notes": ["写真は口唇の目安", "舌の後ろ側で閉じ、鼻に響かせる"], "audio": "./assets/audio/back-nasal-129/ong1.wav?v=10.108.129"}};
  var quizTotal=letters.length+1,passScore=quizTotal-1;
  var group='plain',groupSelection={plain:'ang',rounded:'ing'};
  var selected='ang',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelAudio=null,modelCache={},modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='bnvModelFeedback'?'bnv-model-feedback':'bnv-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaCompoundP13Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-bnv-letter],[data-bnv-group]').forEach(function(b){b.disabled=busy});
    el('bnvModel').disabled=busy;el('bnvToQuiz').disabled=busy;
    el('bnvPlayback').disabled=busy||!recordings[selected];
    el('bnvPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('bnvRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('bnvRecord').disabled=false;el('bnvRecord').classList.remove('is-recording');el('bnvRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(typeof window.stopStandardAudio==='function')window.stopStandardAudio()}catch(e){}
    try{if('speechSynthesis' in window)window.speechSynthesis.cancel()}catch(e){}
    if(modelAudio){try{modelAudio.pause();modelAudio.currentTime=0}catch(e){}modelAudio=null}
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#bnvModel[aria-busy],#bnvQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
  }
  function resetArt(){root.querySelectorAll('.bnv-art-svg,.bnv-route').forEach(function(svg){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(0)}else{svg.unpauseAnimations();svg.setCurrentTime(0)}}catch(e){}});var poses=root.querySelectorAll('.bnv-pose');poses.forEach(function(p){p.style.animation='none'});void root.offsetWidth;poses.forEach(function(p){p.style.animation=''})}
  function recordedAudio(letter){
    if(!modelCache[letter]){var audio=new Audio(guide[letter].audio);audio.preload='auto';audio.playsInline=true;audio.playbackRate=.9;audio.defaultPlaybackRate=.9;audio.preservesPitch=true;modelCache[letter]=audio}
    return modelCache[letter];
  }
  async function playModel(letter,button,forQuiz){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var token=modelToken,fb=forQuiz?'bnvQuizFeedback':'bnvModelFeedback';
    var questionIndex=quiz.index;
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(!forQuiz)feedback(fb,'お手本を準備しています…');
    var audio=recordedAudio(letter);modelAudio=audio;
    function failed(){if(token!==modelToken)return;clearTimeout(playingTimer);button.classList.remove('is-playing');button.removeAttribute('aria-busy');feedback(fb,'音声を読み込めませんでした。もう一度聞いてね。','bad')}
    audio.onended=function(){
      if(token!==modelToken)return;clearTimeout(playingTimer);button.classList.remove('is-playing');button.removeAttribute('aria-busy');
      if(forQuiz&&quiz.active&&quiz.index===questionIndex&&!quiz.answered){quiz.heard=true;el('bnvQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=false});feedback(fb,'聞こえた韻母を選ぼう。')}
    };
    audio.onerror=failed;
    playingTimer=setTimeout(function(){if(token===modelToken){try{audio.pause()}catch(e){}failed()}},10000);
    try{
      if(audio.error)audio.load();
      audio.currentTime=0;
      // Invoked directly from the user gesture; the WAV is already local and cached.
      await audio.play();
      if(token!==modelToken)return;
      if(!forQuiz){resetArt();feedback(fb,'韻母の音を聞こう。舌の後ろ側で閉じ、ng の響きで終えます。')}
    }catch(e){failed()}
    finally{if(token===modelToken)button.removeAttribute('aria-busy')}
  }
  function renderArt(){
    el('bnvArticulation').innerHTML='<span class="bnv-diagram-shell">'+bnvDiagram(selected,'live','live')+'<small class="bnv-view-label">舌と鼻音の目安・ゆっくり</small></span><span class="bnv-movement">'+route(selected)+'<p class="bnv-route-caption">舌先は低く、舌の後ろ側を上げて ng</p></span>';
    var item=guide[selected];el('bnvStaticGuide').innerHTML='<div class="bnv-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+bnvDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('bnvStaticLetter').textContent=selected;
    if(root.hidden||!root.classList.contains('is-roadmap-lesson-active')||matchMedia('(prefers-reduced-motion: reduce)').matches)root.querySelectorAll('.bnv-art-svg,.bnv-route').forEach(function(svg){svg.pauseAnimations();svg.setCurrentTime(0)})
  }
  function revealTeachingArt(){
    requestAnimationFrame(function(){
      if(root.hidden||!root.classList.contains('is-roadmap-lesson-active'))return;
      var grid=root.querySelector('.bnv-teaching .bnv-group-nav'),art=el('bnvArticulation'),view=window.visualViewport;
      var top=view?view.offsetTop:0,height=view?view.height:window.innerHeight;
      var g=grid.getBoundingClientRect(),a=art.getBoundingClientRect();
      if(g.top<top+12||a.bottom>top+height-8){
        if(a.bottom-g.top<=height-120)grid.scrollIntoView({block:'start',inline:'nearest',behavior:'instant'});
        else art.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
      }
    });
  }
  function syncGroups(){
    var active=group==='plain'?['ang','eng']:['ing','ong'];
    ['bnvLetterGrid','bnvFreeChoice'].forEach(function(id){var box=el(id);box.dataset.group=group;box.querySelectorAll('[data-bnv-letter]').forEach(function(b){b.hidden=active.indexOf(b.dataset.bnvLetter)<0})});
    root.querySelectorAll('[data-bnv-group]').forEach(function(b){var chosen=b.dataset.bnvGroup===group;b.classList.toggle('is-active',chosen);b.setAttribute('aria-pressed',String(chosen))});
  }
  function selectGroup(next,fromTeaching){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();group=next;select(groupSelection[next],false);if(fromTeaching)revealTeachingArt();
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;group=['ing','ong'].indexOf(letter)>=0?'rounded':'plain';groupSelection[group]=letter;syncGroups();root.querySelectorAll('[data-bnv-letter]').forEach(function(b){var active=b.dataset.bnvLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('bnvFocusLetter').textContent=letter;el('bnvFocusGuide').textContent=item.hanzi?item.hanzi+' '+item.pinyin+' · '+item.ipa:'韻母の音 '+item.ipa;el('bnvFocusTip').textContent=item.tip;
    el('bnvModel').textContent='▶ '+letter+' のお手本を聞く';feedback('bnvModelFeedback','');feedback('bnvPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('bnvModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('bnvPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('bnvRecord').disabled=true;el('bnvRecord').textContent='マイクを準備中…';el('bnvRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('bnvPracticeFeedback','マイクを準備しています…');
    try{
      var media=await navigator.mediaDevices.getUserMedia({audio:true});
      if(token!==recordToken){media.getTracks().forEach(function(t){t.stop()});return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);media.getTracks().forEach(function(t){t.stop()});if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('bnvPracticeFeedback','録音できたよ。お手本と聞きくらべてみよう。','good')}else feedback('bnvPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('bnvPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}media.getTracks().forEach(function(t){t.stop()})};
      pendingRecord=false;rec.start(100);el('bnvRecord').disabled=false;el('bnvRecord').removeAttribute('aria-busy');el('bnvRecord').textContent='■ 録音を止める';el('bnvRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('bnvPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();feedback('bnvPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('bnvPlayback');playback=new Audio(recordings[selected]);playback.playsInline=true;button.classList.add('is-playing');
    playback.onended=function(){button.classList.remove('is-playing')};playback.onerror=function(){button.classList.remove('is-playing');feedback('bnvPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')};
    try{await playback.play()}catch(e){button.classList.remove('is-playing');feedback('bnvPracticeFeedback','もう一度「自分の声を聞く」を押してね。','bad')}
  }
  function quizOrder(){
    var source=letters.concat(letters[Math.floor(Math.random()*letters.length)]),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  function renderQuestion(){
    var box=el('bnvQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.bnvAnswer=letter;b.disabled=true;b.onclick=function(){answer(letter,b)};box.appendChild(b)});
    el('bnvQuizCount').textContent=(quiz.index+1)+' / '+quizTotal;feedback('bnvQuizFeedback','音を聞いてから選ぼう。');el('bnvQuizNext').hidden=true;quiz.answered=false;quiz.heard=false;
  }
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:quizOrder(),index:0,score:0,answered:false};el('bnvToQuiz').hidden=true;el('bnvResult').hidden=true;el('bnvQuizPanel').hidden=false;root.querySelector('.bnv-practice').hidden=true;renderQuestion();
    el('bnvQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    if(!quiz.active||quiz.answered||!quiz.heard)return;quiz.answered=true;var right=quiz.order[quiz.index],correct=letter===right;
    el('bnvQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true;if(b.dataset.bnvAnswer===right)b.classList.add('is-correct')});
    if(correct){quiz.score++;feedback('bnvQuizFeedback','いい耳！ '+right+' だよ。','good')}else{button.classList.add('is-wrong');feedback('bnvQuizFeedback','今回は '+right+'。もう一度音を聞いて確かめよう。','bad')}
    if(quiz.index===quizTotal-1)quizTimer=setTimeout(function(){if(quiz.active&&quiz.answered&&quiz.index===quizTotal-1)finishQuiz()},650);else el('bnvQuizNext').hidden=false;
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=quizTotal-1)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('bnvQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-bnv-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=passScore;el('bnvQuizPanel').hidden=true;el('bnvResult').hidden=false;el('bnvRetry').hidden=passed;el('bnvReturn').hidden=!passed;
    el('bnvResultMark').textContent=passed?'✓':'↻';el('bnvResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('bnvResultScore').textContent=quizTotal+'問中 '+quiz.score+'問正解';
    var message=passed?'ang・eng・ing・ong の音色を聞き分けられたね。':'はじめの口形と、音のつながりを聞き比べよう。';el('bnvResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaCompoundP13Complete','1')}catch(e){}el('bnvCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:quizTotal,passed:passed,title:passed?'後鼻韻母 クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('bnvResult'),celebration);var replay=el('bnvResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('bnvResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();root.querySelectorAll('.bnv-route').forEach(function(svg){try{svg.pauseAnimations()}catch(e){}});recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-bnv-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();
    feedback('bnvPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('bnvModelFeedback','');
    quiz.active=false;el('bnvQuizPanel').hidden=true;el('bnvToQuiz').hidden=false;root.querySelector('.bnv-practice').hidden=false
  }
  function init(){
    root=el('kidsBackNasalLesson');if(!root)return;
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='bnv-letter-card';button.dataset.bnvLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small><em>'+item.cue+'</em>';button.onclick=function(){select(letter,true);revealTeachingArt()};el('bnvLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.bnvLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('bnvFreeChoice').appendChild(free)});
    root.querySelectorAll('[data-bnv-group]').forEach(function(b){b.onclick=function(){selectGroup(b.dataset.bnvGroup,!!b.closest('.bnv-teaching'))}});
    el('bnvModel').onclick=function(){playModel(selected,this,false)};el('bnvRecord').onclick=toggleRecord;el('bnvPlayback').onclick=playRecording;el('bnvToQuiz').onclick=startQuiz;el('bnvRetry').onclick=startQuiz;
    el('bnvQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('bnvQuizNext').onclick=nextQuestion;
    el('bnvReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P13:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();else if(!wasActive&&active)resetArt();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    var motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
    if(motionPreference.addEventListener)motionPreference.addEventListener('change',function(){renderArt();resetArt()});
    window.addEventListener('pagehide',cleanup);el('bnvCompleteBadge').hidden=!complete();letters.forEach(recordedAudio);select('ang',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
