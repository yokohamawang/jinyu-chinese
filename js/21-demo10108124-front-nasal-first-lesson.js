(function(){
  "use strict";
  var mouthCrops={a:[18,145],e:[881,145],o:[451,145],i:[18,632],u:[451,632],ü:[881,632]};
  function photo(pose,live,index){var p=mouthCrops[pose];return '<svg '+(live?'class="nsv-pose nsv-pose-'+index+'" ':'')+'x="0" y="0" width="144" height="132" viewBox="'+p[0]+' '+p[1]+' 412 378" aria-hidden="true"><image href="./assets/articulation/vowel-mouth-101.png" width="1312" height="1199" /></svg>'}
  function mouthDiagram(letter,live,instance){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)live=false;
    var poses={an:[[68,30],[68,19]],en:[[70,17],[72,13]],in:[[76,13],[76,10]],un:[[34,19],[68,16]],'ün':[[34,15],[42,13]]};
    var begin=poses[letter][0],end=poses[letter][1],id='nsv-mouth-'+instance;
    function paths(p){
      var w=p[0],h=p[1],l=90-w/2,r=90+w/2,top=60-h/2,bottom=60+h/2;
      return {
        opening:'M'+l+' 60 C'+l+' '+(top+3)+' '+(90-w*.25)+' '+top+' 90 '+top+' C'+(90+w*.25)+' '+top+' '+r+' '+(top+3)+' '+r+' 60 C'+r+' '+(bottom-3)+' '+(90+w*.25)+' '+bottom+' 90 '+bottom+' C'+(90-w*.25)+' '+bottom+' '+l+' '+(bottom-3)+' '+l+' 60 Z',
        upper:'M'+l+' 60 C'+(l+w*.15)+' '+(top-8)+' 78 '+(top-8)+' 90 '+(top-5)+' C102 '+(top-8)+' '+(r-w*.15)+' '+(top-8)+' '+r+' 60 C'+(r-w*.20)+' '+(top+1)+' 100 '+top+' 90 '+top+' C80 '+top+' '+(l+w*.20)+' '+(top+1)+' '+l+' 60 Z',
        lower:'M'+l+' 60 C'+(l+w*.20)+' '+(bottom-1)+' 80 '+bottom+' 90 '+bottom+' C100 '+bottom+' '+(r-w*.20)+' '+(bottom-1)+' '+r+' 60 C'+(r-w*.15)+' '+(bottom+10)+' 102 '+(bottom+11)+' 90 '+(bottom+11)+' C78 '+(bottom+11)+' '+(l+w*.15)+' '+(bottom+10)+' '+l+' 60 Z',
        highlight:'M'+(l+w*.23)+' '+(bottom+5)+' Q90 '+(bottom+9)+' '+(r-w*.23)+' '+(bottom+5)
      };
    }
    var start=paths(begin),finish=paths(end);
    function motion(kind){return live?'<animate attributeName="d" values="'+start[kind]+';'+start[kind]+';'+finish[kind]+';'+finish[kind]+';'+start[kind]+'" keyTimes="0;.16;.64;.86;1" dur="5.2s" repeatCount="indefinite"/>':''}
    var pose=live?start:finish;
    var rounded=letter==='un'||letter==='ün',teethStart=rounded?.12:.85,teethEnd=letter==='ün'?.18:.8;
    return '<svg class="nsv-art-svg nsv-mouth-diagram" data-letter="'+letter+'" viewBox="0 0 180 132" aria-hidden="true"><defs><linearGradient id="'+id+'-skin" x2="0" y2="1"><stop stop-color="#fff8f3"/><stop offset="1" stop-color="#fae7dc"/></linearGradient><linearGradient id="'+id+'-upper" x2="0" y2="1"><stop stop-color="#bf7472"/><stop offset=".5" stop-color="#da9490"/><stop offset="1" stop-color="#a45d61"/></linearGradient><linearGradient id="'+id+'-lower" x2="0" y2="1"><stop stop-color="#d68a87"/><stop offset=".5" stop-color="#e8aaa2"/><stop offset="1" stop-color="#b96e70"/></linearGradient><radialGradient id="'+id+'-inside"><stop stop-color="#542832"/><stop offset="1" stop-color="#301c27"/></radialGradient><clipPath id="'+id+'-clip"><path class="nsv-mouth-clip" d="'+pose.opening+'">'+motion('opening')+'</path></clipPath></defs><rect x="5" y="6" width="170" height="120" rx="22" fill="url(#'+id+'-skin)"/><path d="M84 14 Q88 19 86 24 M96 14 Q92 19 94 24" fill="none" stroke="#dbbbae" stroke-width="1" opacity=".4"/><ellipse cx="90" cy="99" rx="45" ry="6" fill="#cfaba0" opacity=".1"/><g transform="translate(-30 -20) scale(1.333333)"><path class="nsv-mouth-opening" d="'+pose.opening+'" fill="url(#'+id+'-inside)">'+motion('opening')+'</path><g clip-path="url(#'+id+'-clip)"><path d="M46 43 Q90 48 134 43 L132 59 Q90 65 48 59 Z" fill="#fffaf0" stroke="#dccfc4" stroke-width=".5" opacity="'+(live?teethStart:teethEnd)+'">'+(live?'<animate attributeName="opacity" values="'+teethStart+';'+teethStart+';'+teethEnd+';'+teethEnd+';'+teethStart+'" keyTimes="0;.16;.64;.86;1" dur="5.2s" repeatCount="indefinite"/>':'')+'</path><path d="M69 81 Q90 74 111 81" fill="none" stroke="#b87a7c" stroke-width="5" opacity=".22"/></g><path class="nsv-lip nsv-lip-upper" d="'+pose.upper+'" fill="url(#'+id+'-upper)" stroke="#a96a69" stroke-width=".55">'+motion('upper')+'</path><path class="nsv-lip nsv-lip-lower" d="'+pose.lower+'" fill="url(#'+id+'-lower)" stroke="#b77472" stroke-width=".55">'+motion('lower')+'</path><path d="'+pose.highlight+'" fill="none" stroke="#fff4e9" stroke-width="1.4" stroke-linecap="round" opacity=".25">'+motion('highlight')+'</path></g><text x="90" y="118" text-anchor="middle" font-size="9" fill="#678174">正面から見た口形の目安</text></svg>';
  }
  function nsvDiagram(letter,mode,instance){if(mode==='live'||mode==='release')return mouthDiagram(letter,mode==='live',instance);return '<svg class="nsv-art-svg" viewBox="0 0 144 132" aria-hidden="true">'+photo(guide[letter].poses[0],false,0)+'</svg>'}
  function route(letter){
    var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,marks=letter==='un'?['u','e','n']:[guide[letter].poses[0],'n'];
    var values=marks.length===3?'12;89;166;166;12':'12;166;166;12';
    var times=marks.length===3?'0;.24;.48;.86;1':'0;.48;.86;1';
    return '<svg class="nsv-route" viewBox="0 0 180 54" aria-hidden="true"><path d="M12 22H166" stroke="#cfdfd2" stroke-width="3" fill="none"/>'+marks.map(function(p,i){var x=marks.length===3?[12,89,166][i]:[12,166][i];return '<circle cx="'+x+'" cy="22" r="4" fill="#dbeadf"/><text x="'+x+'" y="46" text-anchor="middle" fill="#376e53" font-size="14">'+p+'</text>'}).join('')+'<circle class="nsv-flow-dot" cx="'+(reduced?166:12)+'" cy="22" r="5" fill="#3c9975">'+(reduced?'':'<animate attributeName="cx" values="'+values+'" keyTimes="'+times+'" dur="5.2s" repeatCount="indefinite"/>')+'</circle></svg>';
  }


  var letters=['an','en','in','un','ün'];
  var guide={"an": {"hanzi": "安", "pinyin": "ān", "ipa": "[an]", "cue": "a → n", "tip": "a から、開いた唇を少し収めて n へ。舌を大きく持ち上げる動きをまねしません。", "poses": ["a"], "labels": ["はじめの口形", "収めるときの口形"], "notes": ["写真は母音の唇の参考", "唇を力ませず、短い n へ"], "audio": "./assets/audio/front-nasal-133/an1.wav?v=10.108.133"}, "en": {"hanzi": "恩", "pinyin": "ēn", "ipa": "[ən]", "cue": "e → n", "tip": "唇を丸めず、口の開きは小さめ。短い n へ、ひと息で収めます。", "poses": ["e"], "labels": ["はじめの口形", "収めるときの口形"], "notes": ["写真は母音の唇の参考", "唇を力ませず、短い n へ"], "audio": "./assets/audio/front-nasal-133/en1.wav?v=10.108.133"}, "in": {"hanzi": "音", "pinyin": "yīn", "ipa": "[in]", "cue": "i → n", "tip": "i の横に引いた唇を保ち、短い n へ。唇や舌を大きく動かしません。", "poses": ["i"], "labels": ["はじめの口形", "収めるときの口形"], "notes": ["写真は母音の唇の参考", "唇を力ませず、短い n へ"], "audio": "./assets/audio/front-nasal-133/in1.wav?v=10.108.133"}, "un": {"hanzi": "温", "pinyin": "wēn", "ipa": "[uən]", "cue": "u → e → n", "tip": "u の丸い唇から、力をほどいて少し横に開き、短い e・n へ。", "poses": ["u"], "labels": ["はじめの口形", "収めるときの口形"], "notes": ["写真は母音の唇の参考", "唇を力ませず、短い n へ"], "audio": "./assets/audio/front-nasal-133/un1.wav?v=10.108.133"}, "ün": {"hanzi": "晕", "pinyin": "yūn", "ipa": "[yn]", "cue": "ü → n", "tip": "ü の小さく丸い唇を保ち、少しだけ力をほどいて n へ。un のように大きく横へ開きません。", "poses": ["ü"], "labels": ["はじめの口形", "収めるときの口形"], "notes": ["写真は母音の唇の参考", "唇を力ませず、短い n へ"], "audio": "./assets/audio/front-nasal-133/vn1.wav?v=10.108.133"}};
  var quizTotal=letters.length+1,passScore=quizTotal-1;
  var group='plain',groupSelection={plain:'an',rounded:'un'};
  var selected='an',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelAudio=null,modelCache={},artFrame=0,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
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
    modelToken++;clearTimeout(playingTimer);cancelAnimationFrame(artFrame);artFrame=0;
    try{if(typeof window.stopStandardAudio==='function')window.stopStandardAudio()}catch(e){}
    try{if('speechSynthesis' in window)window.speechSynthesis.cancel()}catch(e){}
    if(modelAudio){try{modelAudio.pause();modelAudio.currentTime=0}catch(e){}modelAudio=null}
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#nsvModel[aria-busy],#nsvQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
  }
  function resetArt(){root.querySelectorAll('.nsv-art-svg,.nsv-route').forEach(function(svg){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(0)}else{svg.unpauseAnimations();svg.setCurrentTime(0)}}catch(e){}});var poses=root.querySelectorAll('.nsv-pose');poses.forEach(function(p){p.style.animation='none'});void root.offsetWidth;poses.forEach(function(p){p.style.animation=''})}
  function finishAudioArt(){cancelAnimationFrame(artFrame);artFrame=0;if(!root)return;root.querySelectorAll('#nsvArticulation svg').forEach(function(svg){try{svg.pauseAnimations();svg.setCurrentTime(5.2*.75)}catch(e){}})}
  function syncAudioArt(audio){
    cancelAnimationFrame(artFrame);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    var svgs=root.querySelectorAll('#nsvArticulation svg');svgs.forEach(function(svg){svg.pauseAnimations();svg.setCurrentTime(0)});
    function tick(){if(modelAudio!==audio||audio.paused||audio.ended){artFrame=0;return}var fraction=audio.duration?Math.min(1,audio.currentTime/audio.duration):0;svgs.forEach(function(svg){svg.setCurrentTime(5.2*.75*fraction)});artFrame=requestAnimationFrame(tick)}tick();
  }
  function recordedAudio(letter){
    if(!modelCache[letter]){var audio=new Audio(guide[letter].audio);audio.preload='auto';audio.playsInline=true;audio.playbackRate=.9;audio.defaultPlaybackRate=.9;audio.preservesPitch=true;modelCache[letter]=audio}
    return modelCache[letter];
  }
  async function playModel(letter,button,forQuiz){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var token=modelToken,fb=forQuiz?'nsvQuizFeedback':'nsvModelFeedback';
    var questionIndex=quiz.index;
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(!forQuiz)feedback(fb,'お手本を準備しています…');
    var audio=recordedAudio(letter);modelAudio=audio;
    function failed(){if(token!==modelToken)return;cancelAnimationFrame(artFrame);artFrame=0;clearTimeout(playingTimer);button.classList.remove('is-playing');button.removeAttribute('aria-busy');feedback(fb,'音声を読み込めませんでした。もう一度聞いてね。','bad')}
    audio.onended=function(){
      if(token!==modelToken)return;finishAudioArt();if(!forQuiz)root.querySelector('.nsv-view-label').textContent='収めるときの口形';clearTimeout(playingTimer);button.classList.remove('is-playing');button.removeAttribute('aria-busy');
      if(forQuiz&&quiz.active&&quiz.index===questionIndex&&!quiz.answered){quiz.heard=true;el('nsvQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=false});feedback(fb,'聞こえた韻母を選ぼう。')}
    };
    audio.onerror=failed;
    playingTimer=setTimeout(function(){if(token===modelToken){try{audio.pause()}catch(e){}failed()}},10000);
    try{
      if(audio.error)audio.load();
      try{audio.currentTime=0}catch(e){}
      // Invoked directly from the user gesture; the WAV is already local and cached.
      await audio.play();
      if(token!==modelToken)return;
      if(!forQuiz){syncAudioArt(audio);root.querySelector('.nsv-view-label').textContent='お手本に合わせて見る';feedback(fb,'ひと息で韻母を聞こう。舌を強く動かさず、短い n へ。')}
    }catch(e){failed()}
    finally{if(token===modelToken)button.removeAttribute('aria-busy')}
  }
  function renderArt(){
    el('nsvArticulation').innerHTML='<span class="nsv-diagram-shell">'+nsvDiagram(selected,'live','live')+'<small class="nsv-view-label">口形の変化・ゆっくり</small></span><span class="nsv-movement">'+route(selected)+'<p class="nsv-route-caption">母音から、短い n に収める</p></span>';
    var item=guide[selected];el('nsvStaticGuide').innerHTML='<div class="nsv-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+nsvDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('nsvStaticLetter').textContent=selected;el('nsvStaticNote').textContent='口形の外観を示す図です。口の中の舌の動きを再現する図ではありません。un は丸い唇から少し開き、ün は比較的丸い唇を保ちます。強く押しつける動きをまねせず、お手本を短い n で収めよう。';
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
    var box=el('nsvQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.nsvAnswer=letter;b.disabled=true;b.onclick=function(){answer(letter,b)};box.appendChild(b)});
    el('nsvQuizCount').textContent=(quiz.index+1)+' / '+quizTotal;feedback('nsvQuizFeedback','音を聞いてから選ぼう。');el('nsvQuizNext').hidden=true;quiz.answered=false;quiz.heard=false;
  }
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:quizOrder(),index:0,score:0,answered:false};el('nsvToQuiz').hidden=true;el('nsvResult').hidden=true;el('nsvQuizPanel').hidden=false;root.querySelector('.nsv-practice').hidden=true;renderQuestion();
    el('nsvQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    if(!quiz.active||quiz.answered||!quiz.heard)return;quiz.answered=true;var right=quiz.order[quiz.index],correct=letter===right;
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
    var motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
    if(motionPreference.addEventListener)motionPreference.addEventListener('change',function(){renderArt();resetArt()});
    window.addEventListener('pagehide',cleanup);el('nsvCompleteBadge').hidden=!complete();letters.forEach(recordedAudio);select('an',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
