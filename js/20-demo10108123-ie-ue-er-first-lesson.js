(function(){
  "use strict";
  var mouthCrops={a:[18,145],e:[881,145],o:[451,145],i:[18,632],u:[451,632],ü:[881,632]};
  function photo(pose,live,index){var p=mouthCrops[pose];return '<svg '+(live?'class="cpn-pose cpn-pose-'+index+'" ':'')+'x="0" y="0" width="144" height="132" viewBox="'+p[0]+' '+p[1]+' 412 378" aria-hidden="true"><image href="./assets/articulation/vowel-mouth-101.png" width="1312" height="1199" /></svg>'}
  function erDiagram(live,instance){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)live=false;
    // The anterior tip curls back; the posterior body/root stay fixed, without palate closure.
    var id='cpn-er-'+instance,rest='M43 72 C45 69 49 70 54 73 C59 74 64 73 70 73 C87 72 101 77 110 82 C115 85 117 91 118 94 C114 97 89 97 70 94 C57 92 49 88 45 85 C40 82 38 77 43 72 Z',raised='M62 53 C66 51 67 57 63 61 C57 67 59 72 70 73 C87 72 101 77 110 82 C115 85 117 91 118 94 C114 97 89 97 70 94 C57 92 49 88 45 85 C38 80 45 49 62 53 Z';
    return '<svg class="cpn-art-svg cpn-er-diagram" viewBox="0 0 144 132" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f5b1a0"/><stop offset="1" stop-color="#d78079"/></linearGradient></defs><rect x="5" y="6" width="134" height="120" rx="22" fill="#fff6ef"/><path d="M25 50 Q39 26 74 29 Q108 29 122 49 L121 96 Q97 112 62 106 Q36 102 25 83" fill="#f5e6da" stroke="#d9b8a4" stroke-width="2"/><path d="M29 50 Q57 34 86 37 Q109 38 119 50" fill="none" stroke="#ba9180" stroke-width="4" stroke-linecap="round"/><path d="M28 84 Q66 107 119 94" fill="none" stroke="#d2ae99" stroke-width="3" stroke-linecap="round"/><rect x="30" y="49" width="9" height="13" rx="3" fill="#fffefa" stroke="#d8cbbb"/><rect x="30" y="75" width="8" height="10" rx="3" fill="#fffefa" stroke="#d8cbbb"/><path class="cpn-er-tongue" d="'+(live?rest:raised)+'" fill="url(#'+id+')" stroke="#c77d72" stroke-width="1.3">'+(live?'<animate attributeName="d" values="'+rest+';'+raised+';'+raised+';'+rest+'" keyTimes="0;.4;.82;1" dur="4.8s" repeatCount="indefinite"/>':'')+'</path><text x="80" y="25" font-size="9" fill="#8d7668" text-anchor="middle">上あご</text><text x="90" y="99" font-size="10" fill="#8b544f" text-anchor="middle">舌</text><text x="72" y="119" font-size="9" fill="#678174" text-anchor="middle">口の中・横からの模式図</text></svg>';
  }
  function cpnDiagram(letter,mode,instance){return mode==='live'?window.KP134.front(letter,true,'cpn-'+instance):mode==='contact'?window.KP134.front(letter,false,'cpn-'+instance):window.KP134.mechanism(letter,'cpn-'+instance)}
  function route(letter){if(letter==='er')return '<svg class="cpn-route" viewBox="0 0 180 54" aria-hidden="true"><path d="M45 28 Q60 15 77 22" fill="none" stroke="#7fb899" stroke-width="2.5" stroke-linecap="round"/><path d="M69 17 L77 22 L72 29" fill="none" stroke="#7fb899" stroke-width="2.5" stroke-linecap="round"/><text x="109" y="28" text-anchor="middle" fill="#376e53" font-size="13">上・後ろへ</text><text x="90" y="49" text-anchor="middle" fill="#668174" font-size="10">舌先は上あごに触れない</text></svg>';var marks=guide[letter].marks;return '<svg class="cpn-route" viewBox="0 0 180 54" aria-hidden="true"><path d="M12 22H166" stroke="#cfdfd2" stroke-width="3" fill="none"/>'+marks.map(function(p,i){var x=[12,166][i];return '<circle cx="'+x+'" cy="22" r="4" fill="#dbeadf"/><text x="'+x+'" y="46" text-anchor="middle" fill="#376e53" font-size="14">'+p+'</text>'}).join('')+'<circle class="cpn-flow-dot" cx="12" cy="22" r="5" fill="#3c9975"><animate attributeName="cx" values="12;166;166;12;12" keyTimes="0;.72;.90;.9001;1" dur="4.8s" repeatCount="indefinite"/></circle></svg>'}


  var letters=['ie','üe','er'];
  var guide={"ie": {"hanzi": "耶", "pinyin": "yē", "ipa": "[iɛ]", "cue": "横から、少し開く", "tip": "i から前寄りの ê [ɛ] へ。後ろの音をしっかり、ひと息でつなぎます。", "poses": ["i", "e"], "marks": ["i", "ê"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ye1.wav?v=10.108.134"}, "üe": {"hanzi": "约", "pinyin": "yuē", "ipa": "[yɛ]", "cue": "丸さから、前寄りの ê", "tip": "ü の丸い唇から、丸さをほどいて前寄りの ê へ。舌は前寄りのままです。", "poses": ["ü", "e"], "marks": ["ü", "ê"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/yue1.wav?v=10.108.134"}, "er": {"hanzi": "儿", "pinyin": "ér · 2声", "ipa": "[ɚ]", "cue": "声を続け、軽く後ろへ", "tip": "舌の前部を軽く上・後ろへ向け、声を続けます。接触を強制せず、舌をはじきません。", "poses": ["e", "e"], "marks": ["er"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/er2.wav?v=10.108.134"}};;
  var selected='ie',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='cpnModelFeedback'?'cpn-model-feedback':'cpn-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaCompoundP11Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-cpn-letter]').forEach(function(b){b.disabled=busy});
    el('cpnModel').disabled=busy;el('cpnToQuiz').disabled=busy;
    el('cpnPlayback').disabled=busy||!recordings[selected];
    el('cpnPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('cpnRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('cpnRecord').disabled=false;el('cpnRecord').classList.remove('is-recording');el('cpnRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(window.KP134)window.KP134.stopFor(root)}catch(e){}
    
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#cpnModel[aria-busy],#cpnQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
  }
  function resetArt(){window.KP134.progress(root,selected,matchMedia('(prefers-reduced-motion: reduce)').matches?1:0)}
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
    stopSound();var token=modelToken,index=quiz.index,fb=forQuiz?'cpnQuizFeedback':'cpnModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(forQuiz&&!quiz.answered){quiz.heard=false;el('cpnQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true})}
    feedback(fb,'お手本を準備しています…');
    function clear(){button.classList.remove('is-playing');button.removeAttribute('aria-busy')}
    try{await window.KP134.play(letter,{root:root,button:button,onCancel:clear,onPlaying:function(){if(token===modelToken&&!forQuiz){feedback(fb,'聞いて・見て・まねよう。')}},onEnded:function(){if(token!==modelToken)return;clear();if(forQuiz&&quiz.active&&quiz.index===index&&!quiz.answered){quiz.heard=true;el('cpnQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=false});feedback(fb,'聞こえた音を選ぼう。')}},onError:function(){if(token===modelToken){clear();feedback(fb,'音声を読み込めませんでした。もう一度押してね。','bad')}}})}
    catch(e){if(e&&e.name==='AbortError')return;if(token===modelToken){clear();feedback(fb,'音声を再生できませんでした。もう一度押してね。','bad')}}
  }
  function renderArt(){window.KP135.park(root,'cpn');
    el('cpnArticulation').innerHTML=window.KP134.panel(selected,'cpn');window.KP135.mount(root,'cpn',selected);
    var item=guide[selected];el('cpnStaticGuide').innerHTML='<div class="cpn-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+cpnDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('cpnStaticLetter').textContent=selected;el('cpnStaticTitle').textContent=selected==='er'?'er の口唇と舌の位置':'スタートから ê の口形へ';el('cpnStaticNote').textContent=selected==='er'?'左は口形、右は舌位の模式図です。舌先を軽く上・後ろへ向け、上あごに押しつけずに声を続けます。':'口形の図は目安です。ie・üe の最後の e は前寄りの ê（[ɛ]）で、単母音 e とは違います。途中で音を切らずにつなぎます。';
    if(root.hidden||!root.classList.contains('is-roadmap-lesson-active')||matchMedia('(prefers-reduced-motion: reduce)').matches)root.querySelectorAll('.cpn-art-svg,.cpn-route').forEach(function(svg){svg.pauseAnimations();svg.setCurrentTime(0)})
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;root.querySelectorAll('[data-cpn-letter]').forEach(function(b){var active=b.dataset.cpnLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('cpnFocusLetter').textContent=letter;el('cpnFocusGuide').textContent=item.hanzi+' '+item.pinyin+' · '+item.ipa;el('cpnFocusTip').textContent=item.tip;
    el('cpnModel').textContent='▶ '+letter+' のお手本を聞く';feedback('cpnModelFeedback','');feedback('cpnPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('cpnModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('cpnPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('cpnRecord').disabled=true;el('cpnRecord').textContent='マイクを準備中…';el('cpnRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('cpnPracticeFeedback','マイクを準備しています…');
    try{
      var media=await navigator.mediaDevices.getUserMedia({audio:true});
      if(token!==recordToken){media.getTracks().forEach(function(t){t.stop()});return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);media.getTracks().forEach(function(t){t.stop()});if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('cpnPracticeFeedback','録音できたよ。お手本と聞きくらべてみよう。','good')}else feedback('cpnPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('cpnPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}media.getTracks().forEach(function(t){t.stop()})};
      pendingRecord=false;rec.start(100);el('cpnRecord').disabled=false;el('cpnRecord').removeAttribute('aria-busy');el('cpnRecord').textContent='■ 録音を止める';el('cpnRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('cpnPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();feedback('cpnPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('cpnPlayback');playback=new Audio(recordings[selected]);playback.playsInline=true;button.classList.add('is-playing');
    playback.onended=function(){button.classList.remove('is-playing')};playback.onerror=function(){button.classList.remove('is-playing');feedback('cpnPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')};
    try{await playback.play()}catch(e){button.classList.remove('is-playing');feedback('cpnPracticeFeedback','もう一度「自分の声を聞く」を押してね。','bad')}
  }
  function quizOrder(){
    var source=letters.concat(letters[Math.floor(Math.random()*letters.length)]),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  function renderQuestion(){
    var box=el('cpnQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.cpnAnswer=letter;b.disabled=true;b.onclick=function(){answer(letter,b)};box.appendChild(b)});
    el('cpnQuizCount').textContent=(quiz.index+1)+' / 4';feedback('cpnQuizFeedback','音を聞いてから選ぼう。');el('cpnQuizNext').hidden=true;quiz.answered=false;quiz.heard=false;
  }
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:quizOrder(),index:0,score:0,answered:false};el('cpnToQuiz').hidden=true;el('cpnResult').hidden=true;el('cpnQuizPanel').hidden=false;root.querySelector('.cpn-practice').hidden=true;renderQuestion();
    el('cpnQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    if(!quiz.active||quiz.answered||!quiz.heard)return;quiz.answered=true;var right=quiz.order[quiz.index],correct=letter===right;
    el('cpnQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true;if(b.dataset.cpnAnswer===right)b.classList.add('is-correct')});
    if(correct){quiz.score++;feedback('cpnQuizFeedback','いい耳！ '+right+' だよ。','good')}else{button.classList.add('is-wrong');feedback('cpnQuizFeedback','今回は '+right+'。もう一度音を聞いて確かめよう。','bad')}
    if(quiz.index===3)quizTimer=setTimeout(function(){if(quiz.active&&quiz.answered&&quiz.index===3)finishQuiz()},650);else el('cpnQuizNext').hidden=false;
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=3)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('cpnQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-cpn-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=3;el('cpnQuizPanel').hidden=true;el('cpnResult').hidden=false;el('cpnRetry').hidden=passed;el('cpnReturn').hidden=!passed;
    el('cpnResultMark').textContent=passed?'✓':'↻';el('cpnResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('cpnResultScore').textContent='4問中 '+quiz.score+'問正解';
    var message=passed?'ie・üe・er の音色を聞き分けられたね。':'はじめの口形と、音のつながりを聞き比べよう。';el('cpnResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaCompoundP11Complete','1')}catch(e){}el('cpnCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:4,passed:passed,title:passed?'ie・üe・er クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('cpnResult'),celebration);var replay=el('cpnResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('cpnResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();root.querySelectorAll('.cpn-route').forEach(function(svg){try{svg.pauseAnimations()}catch(e){}});recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-cpn-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();
    feedback('cpnPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('cpnModelFeedback','');
    quiz.active=false;el('cpnQuizPanel').hidden=true;el('cpnToQuiz').hidden=false;root.querySelector('.cpn-practice').hidden=false
  }
  function init(){
    root=el('kidsCompoundIEUEERLesson');if(!root)return;window.KP134.attach(root,letters);
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='cpn-letter-card';button.dataset.cpnLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small>';button.onclick=function(){select(letter,true)};el('cpnLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.cpnLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('cpnFreeChoice').appendChild(free)});
    el('cpnModel').onclick=function(){playModel(selected,this,false)};el('cpnRecord').onclick=toggleRecord;el('cpnPlayback').onclick=playRecording;el('cpnToQuiz').onclick=startQuiz;el('cpnRetry').onclick=startQuiz;
    el('cpnQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('cpnQuizNext').onclick=nextQuestion;
    el('cpnReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P11:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();else if(!wasActive&&active)resetArt();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    var motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
    if(motionPreference.addEventListener)motionPreference.addEventListener('change',function(){renderArt();resetArt()});
    window.addEventListener('pagehide',cleanup);el('cpnCompleteBadge').hidden=!complete();select('ie',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
