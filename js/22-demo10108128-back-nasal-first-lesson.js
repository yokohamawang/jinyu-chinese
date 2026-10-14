/* 10.108.137 — P13 native recordings and static ng reference; legacy looping tongue renderer removed. */
(function(){
  "use strict";
  function bnvDiagram(letter,mode,instance){return mode==='live'?window.KP134.front(letter,true,'bnv-'+instance):mode==='contact'?window.KP134.front(letter,false,'bnv-'+instance):window.KP134.mechanism(letter,'bnv-'+instance)}
  var letters=["ang", "eng", "ing", "ong"];
  var guide={"ang": {"hanzi": "肮", "pinyin": "āng", "ipa": "[ɑŋ]", "cue": "短い ng へ", "tip": "a からつなげ、舌先は低いまま、舌の後ろ側を軟口蓋へ。最後に g を破裂させません。", "poses": ["a"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ang1.wav?v=10.108.134"}, "eng": {"hanzi": "鞥", "pinyin": "ēng", "ipa": "[ɤŋ]", "cue": "短い ng へ", "tip": "奥寄りの e の構えから、舌の後ろ側で ng に収めます。舌全体を大きく持ち上げるように力ませません。", "poses": ["e"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/eng1.wav?v=10.108.134"}, "ing": {"hanzi": "鹰", "pinyin": "yīng", "ipa": "[iŋ]", "cue": "短い ng へ", "tip": "高い i の構えから、そのまま後ろ側で ng に収めます。舌をいったん低くして大きく上げ直したり、間の母音を意識して足したりしません。", "poses": ["i"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ying1.wav?v=10.108.134"}, "ong": {"hanzi": "", "pinyin": "ong", "ipa": "[ʊŋ]", "cue": "短い ng へ", "tip": "丸い唇を保ち、舌先を上げず、後ろ側で ng に収めます。最後に余分な「グ」を足しません。", "poses": ["u"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/back-nasal-129/ong1.wav?v=10.108.129"}};
  var quizTotal=letters.length+1,passScore=quizTotal-1;
  var selected='ang',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelAudio=null,modelCache={},modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='bnvModelFeedback'?'bnv-model-feedback':'bnv-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaCompoundP13Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-bnv-letter]').forEach(function(b){b.disabled=busy});
    el('bnvModel').disabled=busy;el('bnvToQuiz').disabled=busy;
    el('bnvPlayback').disabled=busy||!recordings[selected];
    el('bnvPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('bnvRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('bnvRecord').disabled=false;el('bnvRecord').classList.remove('is-recording');el('bnvRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(window.KP134)window.KP134.stopFor(root)}catch(e){}
    
    if(modelAudio){try{modelAudio.pause();modelAudio.currentTime=0}catch(e){}modelAudio=null}
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#bnvModel[aria-busy],#bnvQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
  }
  function resetArt(){window.KP134.progress(root,selected,matchMedia('(prefers-reduced-motion: reduce)').matches?1:0)}
  function recordedAudio(letter){
    if(!modelCache[letter]){var audio=new Audio(guide[letter].audio);audio.preload='auto';audio.playsInline=true;audio.playbackRate=.9;audio.defaultPlaybackRate=.9;audio.preservesPitch=true;modelCache[letter]=audio}
    return modelCache[letter];
  }
  async function playModel(letter,button,forQuiz){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var token=modelToken,index=quiz.index,fb=forQuiz?'bnvQuizFeedback':'bnvModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(forQuiz&&!quiz.answered){quiz.heard=false;el('bnvQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true})}
    feedback(fb,'お手本を準備しています…');
    function clear(){button.classList.remove('is-playing');button.removeAttribute('aria-busy')}
    try{await window.KP134.play(letter,{root:root,button:button,onCancel:clear,onPlaying:function(){if(token===modelToken&&!forQuiz){feedback(fb,'聞いて・見て・まねよう。')}},onEnded:function(){if(token!==modelToken)return;clear();if(forQuiz&&quiz.active&&quiz.index===index&&!quiz.answered){quiz.heard=true;el('bnvQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=false});feedback(fb,'聞こえた音を選ぼう。')}},onError:function(){if(token===modelToken){clear();feedback(fb,'音声を読み込めませんでした。もう一度押してね。','bad')}}})}
    catch(e){if(e&&e.name==='AbortError')return;if(token===modelToken){clear();feedback(fb,'音声を再生できませんでした。もう一度押してね。','bad')}}
  }
  function renderArt(){window.KP135.park(root,'bnv');
    el('bnvArticulation').innerHTML=window.KP134.panel(selected,'bnv');window.KP135.mount(root,'bnv',selected);
    var item=guide[selected];el('bnvStaticGuide').innerHTML='<div class="bnv-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+bnvDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('bnvStaticLetter').textContent=selected;
    if(root.hidden||!root.classList.contains('is-roadmap-lesson-active')||matchMedia('(prefers-reduced-motion: reduce)').matches)root.querySelectorAll('.bnv-art-svg,.bnv-route').forEach(function(svg){svg.pauseAnimations();svg.setCurrentTime(0)})
  }
  function revealTeachingArt(){}
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;root.querySelectorAll('[data-bnv-letter]').forEach(function(b){var active=b.dataset.bnvLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
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
    root=el('kidsBackNasalLesson');if(!root)return;window.KP134.attach(root,letters);
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='bnv-letter-card';button.dataset.bnvLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small>';button.onclick=function(){select(letter,true);revealTeachingArt()};el('bnvLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.bnvLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('bnvFreeChoice').appendChild(free)});
    el('bnvModel').onclick=function(){playModel(selected,this,false)};el('bnvRecord').onclick=toggleRecord;el('bnvPlayback').onclick=playRecording;el('bnvToQuiz').onclick=startQuiz;el('bnvRetry').onclick=startQuiz;
    el('bnvQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('bnvQuizNext').onclick=nextQuestion;
    el('bnvReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P13:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();else if(!wasActive&&active)resetArt();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    var motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
    if(motionPreference.addEventListener)motionPreference.addEventListener('change',function(){renderArt();resetArt()});
    window.addEventListener('pagehide',cleanup);el('bnvCompleteBadge').hidden=!complete();select('ang',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
