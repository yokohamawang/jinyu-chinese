(function(){
  "use strict";
  var mouthCrops={a:[18,145],e:[881,145],o:[451,145],i:[18,632],u:[451,632],ü:[881,632]};
  function photo(pose,live,index){var p=mouthCrops[pose];return '<svg '+(live?'class="nsv-pose nsv-pose-'+index+'" ':'')+'x="0" y="0" width="144" height="132" viewBox="'+p[0]+' '+p[1]+' 412 378" aria-hidden="true"><image href="./assets/articulation/vowel-mouth-101.png" width="1312" height="1199" /></svg>'}
  function nasalDiagram(letter,live,instance){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)live=false;
    var id='nsv-'+instance,rest=letter==='an'?'M118 96 C96 80 74 83 54 85 C45 85 38 80 40 75 C44 69 51 73 57 75 C80 73 105 83 118 88 Z':letter==='un'?'M118 96 C100 80 70 84 51 80 C43 79 39 72 43 68 C49 62 59 68 69 68 C90 54 111 59 118 82 Z':'M118 96 C100 81 78 78 58 77 C47 77 38 70 41 62 C44 56 51 59 56 64 C75 54 101 68 118 84 Z';
    var closed='M118 96 C96 80 75 78 60 75 C46 73 39 60 42 48 Q45 43 49 42 Q54 41 59 41 C63 48 65 58 71 62 C89 64 106 77 118 85 Z';
    return '<svg class="nsv-art-svg nsv-nasal-diagram" viewBox="0 0 144 132" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f5b1a0"/><stop offset="1" stop-color="#d78079"/></linearGradient></defs><rect x="5" y="6" width="134" height="120" rx="22" fill="#fff6ef"/><path d="M25 50 Q39 26 74 29 Q108 29 122 49 L121 96 Q97 112 62 106 Q36 102 25 83" fill="#f5e6da" stroke="#d9b8a4" stroke-width="2"/><path d="M29 50 Q57 34 86 37 Q109 38 119 50" fill="none" stroke="#ba9180" stroke-width="4" stroke-linecap="round"/><path d="M28 84 Q66 107 119 94" fill="none" stroke="#d2ae99" stroke-width="3" stroke-linecap="round"/><rect x="30" y="49" width="9" height="13" rx="3" fill="#fffefa" stroke="#d8cbbb"/><rect x="30" y="75" width="8" height="10" rx="3" fill="#fffefa" stroke="#d8cbbb"/><path class="nsv-nasal-tongue" d="'+(live?rest:closed)+'" fill="url(#'+id+')" stroke="#c77d72" stroke-width="1.3">'+(live?'<animate attributeName="d" values="'+rest+';'+closed+';'+closed+';'+rest+'" keyTimes="0;.48;.86;1" dur="5.2s" repeatCount="indefinite"/>':'')+'</path><circle cx="52" cy="42" r="3" fill="#70ac8a" opacity="'+(live?'0':'.65')+'">'+(live?'<animate attributeName="opacity" values="0;0;.65;.65;0" keyTimes="0;.38;.5;.86;1" dur="5.2s" repeatCount="indefinite"/>':'')+'</circle><path d="M120 48 V27 Q120 17 105 17 H46" fill="none" stroke="#8abc9f" stroke-width="2.5" stroke-linecap="round"/><path d="M51 13 L46 17 L51 21" fill="none" stroke="#8abc9f" stroke-width="2" stroke-linecap="round"/><text x="82" y="14" text-anchor="middle" font-size="9" fill="#4d8064">鼻への通り道</text><text x="86" y="98" text-anchor="middle" font-size="10" fill="#8b544f">舌</text><text x="72" y="119" text-anchor="middle" font-size="9" fill="#678174">口の中・横からの模式図</text></svg>';
  }
  function nsvDiagram(letter,mode,instance){if(mode==='live'||mode==='release')return nasalDiagram(letter,mode==='live',instance);return '<svg class="nsv-art-svg" viewBox="0 0 144 132" aria-hidden="true">'+photo(guide[letter].poses[0],false,0)+'</svg>'}
  function route(letter){var marks=letter==='un'?['u','e','n']:[guide[letter].poses[0],'n'];return '<svg class="nsv-route" viewBox="0 0 180 54" aria-hidden="true"><path d="M12 22H166" stroke="#cfdfd2" stroke-width="3" fill="none"/>'+marks.map(function(p,i){var x=marks.length===3?[12,89,166][i]:[12,166][i];return '<circle cx="'+x+'" cy="22" r="4" fill="#dbeadf"/><text x="'+x+'" y="46" text-anchor="middle" fill="#376e53" font-size="14">'+p+'</text>'}).join('')+'<circle class="nsv-flow-dot" cx="12" cy="22" r="5" fill="#3c9975"><animate attributeName="cx" values="12;166;166;12;12" keyTimes="0;.72;.90;.9001;1" dur="5.2s" repeatCount="indefinite"/></circle></svg>'}


  var letters=['an','en','in','un','ün'];
  var guide={"an": {"hanzi": "安", "pinyin": "ān", "ipa": "[an]", "cue": "a → n", "tip": "a の開いた口形から、舌先・舌の前部を上の前歯のすぐ後ろへ。最後は鼻に響かせて収めます。", "poses": ["a"], "labels": ["スタート（a）", "ゴール（n の舌位）"], "notes": ["写真は口唇の目安", "舌の前部で閉じ、鼻に響かせる"]}, "en": {"hanzi": "恩", "pinyin": "ēn", "ipa": "[ən]", "cue": "e → n", "tip": "口を軽く開いた e のような音から、舌先・舌の前部で前歯のすぐ後ろを閉じます。最後に余分な母音を足しません。", "poses": ["e"], "labels": ["スタート（e）", "ゴール（n の舌位）"], "notes": ["写真は口唇の目安", "舌の前部で閉じ、鼻に響かせる"]}, "in": {"hanzi": "音", "pinyin": "yīn", "ipa": "[in]", "cue": "i → n", "tip": "i の横に開いた口形から、舌先・舌の前部で前歯のすぐ後ろを閉じます。短い鼻の響きで終えます。", "poses": ["i"], "labels": ["スタート（i）", "ゴール（n の舌位）"], "notes": ["写真は口唇の目安", "舌の前部で閉じ、鼻に響かせる"]}, "un": {"hanzi": "温", "pinyin": "wēn", "ipa": "[uən]", "cue": "u → e → n", "tip": "u の丸い口形から、短い e を通って n へ。唇の丸さをほどき、舌の前部で口の中を閉じます。", "poses": ["u"], "labels": ["スタート（u）", "ゴール（n の舌位）"], "notes": ["写真は口唇の目安", "舌の前部で閉じ、鼻に響かせる"]}, "ün": {"hanzi": "晕", "pinyin": "yūn", "ipa": "[yn]", "cue": "ü → n", "tip": "ü の小さく丸い口形から、舌の前部を上の前歯のすぐ後ろへ。u で始めず、舌は前寄りに保ちます。", "poses": ["ü"], "labels": ["スタート（ü）", "ゴール（n の舌位）"], "notes": ["写真は口唇の目安", "舌の前部で閉じ、鼻に響かせる"]}};
  var quizTotal=letters.length+1,passScore=quizTotal-1;
  var group='plain',groupSelection={plain:'an',rounded:'un'};
  var selected='an',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='nsvModelFeedback'?'nsv-model-feedback':'nsv-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaCompoundP12Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-nsv-letter],[data-nsv-group]').forEach(function(b){b.disabled=busy});
    el('nsvModel').disabled=busy;el('nsvToQuiz').disabled=busy;
    el('nsvPlayback').disabled=busy||!recordings[selected];
    el('nsvPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('nsvRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('nsvRecord').disabled=false;el('nsvRecord').classList.remove('is-recording');el('nsvRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(typeof window.stopStandardAudio==='function')window.stopStandardAudio()}catch(e){}
    try{if('speechSynthesis' in window)window.speechSynthesis.cancel()}catch(e){}
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#nsvModel[aria-busy],#nsvQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
  }
  function resetArt(){root.querySelectorAll('.nsv-art-svg,.nsv-route').forEach(function(svg){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(0)}else{svg.unpauseAnimations();svg.setCurrentTime(0)}}catch(e){}});var poses=root.querySelectorAll('.nsv-pose');poses.forEach(function(p){p.style.animation='none'});void root.offsetWidth;poses.forEach(function(p){p.style.animation=''})}
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
    stopSound();var token=modelToken,item=guide[letter],fb=forQuiz?'nsvQuizFeedback':'nsvModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(!forQuiz)feedback(fb,'お手本を準備しています…');
    try{
      var audio=typeof window.playMachine==='function'?await window.playMachine(item.hanzi,null,false):null;
      if(token!==modelToken)return;
      if(!audio)audio=await fallbackSpeech(item.hanzi);
      if(token!==modelToken)return;
      if(!forQuiz){resetArt();feedback(fb,'母音から n へ。舌の前部で口の中を閉じ、鼻に響かせて終えます。')}
      if(audio&&typeof audio.addEventListener==='function')audio.addEventListener('ended',function(){if(token===modelToken)button.classList.remove('is-playing')},{once:true});
      playingTimer=setTimeout(function(){if(token===modelToken)button.classList.remove('is-playing')},2200);
    }catch(e){if(token===modelToken){button.classList.remove('is-playing');feedback(fb,'音声を再生できませんでした。もう一度聞いてみよう。','bad')}}
    finally{if(token===modelToken)button.removeAttribute('aria-busy')}
  }
  function renderArt(){
    el('nsvArticulation').innerHTML='<span class="nsv-diagram-shell">'+nsvDiagram(selected,'live','live')+'<small class="nsv-view-label">舌と鼻音の目安・ゆっくり</small></span><span class="nsv-movement">'+route(selected)+'<p class="nsv-route-caption">舌の前部で閉じ、鼻に響かせる</p></span>';
    var item=guide[selected];el('nsvStaticGuide').innerHTML='<div class="nsv-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+nsvDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('nsvStaticLetter').textContent=selected;
    if(root.hidden||!root.classList.contains('is-roadmap-lesson-active')||matchMedia('(prefers-reduced-motion: reduce)').matches)root.querySelectorAll('.nsv-art-svg,.nsv-route').forEach(function(svg){svg.pauseAnimations();svg.setCurrentTime(0)})
  }
  function revealTeachingArt(){
    requestAnimationFrame(function(){
      if(root.hidden||!root.classList.contains('is-roadmap-lesson-active'))return;
      var grid=el('nsvLetterGrid'),art=el('nsvArticulation'),view=window.visualViewport;
      var top=view?view.offsetTop:0,height=view?view.height:window.innerHeight;
      var g=grid.getBoundingClientRect(),a=art.getBoundingClientRect();
      if(g.top<top+12||a.bottom>top+height-8){
        if(a.bottom-g.top<=height-120)grid.scrollIntoView({block:'start',inline:'nearest',behavior:'instant'});
        else art.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
      }
    });
  }
  function syncGroups(){
    var active=group==='plain'?['an','en','in']:['un','ün'];
    ['nsvLetterGrid','nsvFreeChoice'].forEach(function(id){var box=el(id);box.dataset.group=group;box.querySelectorAll('[data-nsv-letter]').forEach(function(b){b.hidden=active.indexOf(b.dataset.nsvLetter)<0})});
    root.querySelectorAll('[data-nsv-group]').forEach(function(b){var chosen=b.dataset.nsvGroup===group;b.classList.toggle('is-active',chosen);b.setAttribute('aria-pressed',String(chosen))});
  }
  function selectGroup(next,fromTeaching){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();group=next;select(groupSelection[next],false);if(fromTeaching)revealTeachingArt();
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;group=['un','ün'].indexOf(letter)>=0?'rounded':'plain';groupSelection[group]=letter;syncGroups();root.querySelectorAll('[data-nsv-letter]').forEach(function(b){var active=b.dataset.nsvLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('nsvFocusLetter').textContent=letter;el('nsvFocusGuide').textContent=item.hanzi+' '+item.pinyin+' · '+item.ipa;el('nsvFocusTip').textContent=item.tip;
    el('nsvModel').textContent='▶ '+letter+' のお手本を聞く';feedback('nsvModelFeedback','');feedback('nsvPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('nsvModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('nsvPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('nsvRecord').disabled=true;el('nsvRecord').textContent='マイクを準備中…';el('nsvRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('nsvPracticeFeedback','マイクを準備しています…');
    try{
      var media=await navigator.mediaDevices.getUserMedia({audio:true});
      if(token!==recordToken){media.getTracks().forEach(function(t){t.stop()});return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);media.getTracks().forEach(function(t){t.stop()});if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('nsvPracticeFeedback','録音できたよ。お手本と聞きくらべてみよう。','good')}else feedback('nsvPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('nsvPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}media.getTracks().forEach(function(t){t.stop()})};
      pendingRecord=false;rec.start(100);el('nsvRecord').disabled=false;el('nsvRecord').removeAttribute('aria-busy');el('nsvRecord').textContent='■ 録音を止める';el('nsvRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('nsvPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();feedback('nsvPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('nsvPlayback');playback=new Audio(recordings[selected]);playback.playsInline=true;button.classList.add('is-playing');
    playback.onended=function(){button.classList.remove('is-playing')};playback.onerror=function(){button.classList.remove('is-playing');feedback('nsvPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')};
    try{await playback.play()}catch(e){button.classList.remove('is-playing');feedback('nsvPracticeFeedback','もう一度「自分の声を聞く」を押してね。','bad')}
  }
  function quizOrder(){
    var source=letters.concat(letters[Math.floor(Math.random()*letters.length)]),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  function renderQuestion(){
    var box=el('nsvQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.nsvAnswer=letter;b.onclick=function(){answer(letter,b)};box.appendChild(b)});
    el('nsvQuizCount').textContent=(quiz.index+1)+' / '+quizTotal;feedback('nsvQuizFeedback','');el('nsvQuizNext').hidden=true;quiz.answered=false;
  }
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:quizOrder(),index:0,score:0,answered:false};el('nsvToQuiz').hidden=true;el('nsvResult').hidden=true;el('nsvQuizPanel').hidden=false;root.querySelector('.nsv-practice').hidden=true;renderQuestion();
    el('nsvQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    if(!quiz.active||quiz.answered)return;quiz.answered=true;var right=quiz.order[quiz.index],correct=letter===right;
    el('nsvQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true;if(b.dataset.nsvAnswer===right)b.classList.add('is-correct')});
    if(correct){quiz.score++;feedback('nsvQuizFeedback','いい耳！ '+right+' だよ。','good')}else{button.classList.add('is-wrong');feedback('nsvQuizFeedback','今回は '+right+'。もう一度音を聞いて確かめよう。','bad')}
    if(quiz.index===quizTotal-1)quizTimer=setTimeout(function(){if(quiz.active&&quiz.answered&&quiz.index===quizTotal-1)finishQuiz()},650);else el('nsvQuizNext').hidden=false;
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=quizTotal-1)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('nsvQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-nsv-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=passScore;el('nsvQuizPanel').hidden=true;el('nsvResult').hidden=false;el('nsvRetry').hidden=passed;el('nsvReturn').hidden=!passed;
    el('nsvResultMark').textContent=passed?'✓':'↻';el('nsvResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('nsvResultScore').textContent=quizTotal+'問中 '+quiz.score+'問正解';
    var message=passed?'an・en・in・un・ün の音色を聞き分けられたね。':'はじめの口形と、音のつながりを聞き比べよう。';el('nsvResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaCompoundP12Complete','1')}catch(e){}el('nsvCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:quizTotal,passed:passed,title:passed?'前鼻韻母 クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('nsvResult'),celebration);var replay=el('nsvResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('nsvResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();root.querySelectorAll('.nsv-route').forEach(function(svg){try{svg.pauseAnimations()}catch(e){}});recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-nsv-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();
    feedback('nsvPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('nsvModelFeedback','');
    quiz.active=false;el('nsvQuizPanel').hidden=true;el('nsvToQuiz').hidden=false;root.querySelector('.nsv-practice').hidden=false
  }
  function init(){
    root=el('kidsFrontNasalLesson');if(!root)return;
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='nsv-letter-card';button.dataset.nsvLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small><em>'+item.cue+'</em>';button.onclick=function(){select(letter,true);revealTeachingArt()};el('nsvLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.nsvLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('nsvFreeChoice').appendChild(free)});
    root.querySelectorAll('[data-nsv-group]').forEach(function(b){b.onclick=function(){selectGroup(b.dataset.nsvGroup,!!b.closest('.nsv-teaching'))}});
    el('nsvModel').onclick=function(){playModel(selected,this,false)};el('nsvRecord').onclick=toggleRecord;el('nsvPlayback').onclick=playRecording;el('nsvToQuiz').onclick=startQuiz;el('nsvRetry').onclick=startQuiz;
    el('nsvQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('nsvQuizNext').onclick=nextQuestion;
    el('nsvReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P12:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();else if(!wasActive&&active)resetArt();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pagehide',cleanup);el('nsvCompleteBadge').hidden=!complete();select('an',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
