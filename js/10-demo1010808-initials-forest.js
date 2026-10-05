/* DEMO 10.108.13 — Safari-safe isolated initial-sound playback for b p m f.
   Local WAV is the primary path so iPhone Safari/Private mode can play on the first tap.
   Web Audio remains only as a fallback. These are vowel-free prototype sounds;
   the final course should still replace them with one native Mandarin speaker. */
(function(){
  var letters=['b','p','m','f'];
  var sounds={
    b:{mark:'[p]',label:'無気音',desc:'母音を足さず、くちびるを閉じて一瞬だけ開く'},
    p:{mark:'[pʰ]',label:'有気音',desc:'母音を足さず、同じ口の形で開く瞬間に強く息を出す'},
    m:{mark:'[m]',label:'鼻音',desc:'母音を足さず、くちびるを閉じたまま鼻に短く響かせる'},
    f:{mark:'[f]',label:'摩擦音',desc:'母音を足さず、上の歯を下くちびるに軽く当てて細く息を流す'}
  };
  var tips={
    b:'くちびるを閉じる → 一瞬だけ開く。母音を足さない（無気音）',
    p:'b と同じ口 → 開く瞬間に強く息を出す（有気音）',
    m:'くちびるを閉じたまま、鼻から「んー」と響かせる',
    f:'上の歯＋下くちびる。細い息だけを流す'
  };
  var selected='b', ctx=null, activeNodes=[], recorder=null, stream=null, chunks=[], recordingUrl='', playback=null, modelAudio=null;
  var soundFiles={
    b:'./assets/audio/initials/b.wav?v=10.108.13',
    p:'./assets/audio/initials/p.wav?v=10.108.13',
    m:'./assets/audio/initials/m.wav?v=10.108.13',
    f:'./assets/audio/initials/f.wav?v=10.108.13'
  };
  var quizOrder=['p','m','b','f'], quizIndex=0, quizAnswered=false, quizScore=0;

  function el(id){return document.getElementById(id)}
  function audioCtx(){
    if(!ctx){
      var AC=window.AudioContext||window.webkitAudioContext;
      if(AC) ctx=new AC();
    }
    if(ctx&&ctx.state==='suspended') ctx.resume().catch(function(){});
    return ctx;
  }
  function stopAudio(){
    activeNodes.forEach(function(n){try{n.stop&&n.stop()}catch(e){} try{n.disconnect&&n.disconnect()}catch(e){}});
    activeNodes=[];
  }
  function noiseBuffer(c,dur){
    var sr=c.sampleRate, len=Math.max(1,Math.floor(sr*dur)), b=c.createBuffer(1,len,sr), d=b.getChannelData(0);
    for(var i=0;i<len;i++) d[i]=Math.random()*2-1;
    return b;
  }
  function gainEnv(g,now,peak,attack,hold,release){
    g.gain.cancelScheduledValues(now);
    g.gain.setValueAtTime(0.0001,now);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002,peak),now+attack);
    g.gain.setValueAtTime(Math.max(0.0002,peak),now+attack+hold);
    g.gain.exponentialRampToValueAtTime(0.0001,now+attack+hold+release);
  }
  function burst(c, now, strong){
    var src=c.createBufferSource(), hp=c.createBiquadFilter(), g=c.createGain();
    src.buffer=noiseBuffer(c,strong?0.13:0.055);
    hp.type='highpass'; hp.frequency.value=strong?1800:1200; hp.Q.value=.45;
    gainEnv(g,now,strong?.45:.22,.003,strong?.045:.014,strong?.07:.025);
    src.connect(hp).connect(g).connect(c.destination);
    src.start(now); src.stop(now+(strong?.14:.065));
    activeNodes.push(src);
  }
  function hum(c, now){
    var master=c.createGain(), lp=c.createBiquadFilter();
    lp.type='lowpass'; lp.frequency.value=900; lp.Q.value=.7;
    gainEnv(master,now,.16,.025,.24,.09);
    [125,250,375].forEach(function(freq,i){
      var o=c.createOscillator(), g=c.createGain();
      o.type='sine'; o.frequency.value=freq; g.gain.value=[1,.42,.18][i];
      o.connect(g).connect(lp);
      o.start(now); o.stop(now+.38); activeNodes.push(o);
    });
    lp.connect(master).connect(c.destination);
  }
  function fricative(c, now){
    var src=c.createBufferSource(), bp=c.createBiquadFilter(), g=c.createGain();
    src.buffer=noiseBuffer(c,.38);
    bp.type='bandpass'; bp.frequency.value=5200; bp.Q.value=.55;
    gainEnv(g,now,.19,.02,.27,.08);
    src.connect(bp).connect(g).connect(c.destination);
    src.start(now); src.stop(now+.4); activeNodes.push(src);
  }
  function playSynthetic(letter){
    stopAudio();
    var c=audioCtx(); if(!c)return false;
    var now=c.currentTime+.025;
    if(letter==='b') burst(c,now,false);
    else if(letter==='p') burst(c,now,true);
    else if(letter==='m') hum(c,now);
    else if(letter==='f') fricative(c,now);
    return true;
  }
  function play(letter){
    stopAudio();
    try{
      if(modelAudio){modelAudio.pause();modelAudio.currentTime=0}
      modelAudio=new Audio(soundFiles[letter]);
      modelAudio.preload='auto';
      modelAudio.volume=1;
      var p=modelAudio.play();
      if(p&&typeof p.catch==='function'){p.catch(function(){playSynthetic(letter)})}
      return;
    }catch(e){}
    playSynthetic(letter);
  }
  function setStep(n){
    document.querySelectorAll('.initials-progress span').forEach(function(x){
      var k=Number(x.dataset.initialStep);
      x.classList.toggle('is-current',k===n);
      x.classList.toggle('is-done',k<n)
    })
  }
  function select(letter){
    selected=letter;
    document.querySelectorAll('.initials-letter-card,.initials-free-choice button').forEach(function(b){
      b.classList.toggle('is-active',b.dataset.letter===letter)
    });
    var f=el('initialsFocusLetter'),s=el('initialsFocusSyllable'),t=el('initialsFocusTip');
    if(f)f.textContent=letter;
    if(s)s.textContent=sounds[letter].mark+' · '+sounds[letter].label;
    if(t)t.textContent=tips[letter];
    renderToneButtons()
  }
  function renderToneButtons(){
    var box=el('initialsToneButtons'); if(!box)return;
    box.replaceChildren();
    var b=document.createElement('button');
    b.type='button'; b.textContent='▶ '+selected+' の単音を聞く';
    b.addEventListener('click',function(){play(selected)});
    box.appendChild(b)
  }
  function renderLetters(){
    var g=el('initialsLetterGrid'),free=el('initialsFreeChoice'); if(!g||!free)return;
    g.replaceChildren(); free.replaceChildren();
    letters.forEach(function(letter,i){
      var b=document.createElement('button'); b.type='button'; b.className='initials-letter-card'; b.dataset.letter=letter;
      b.innerHTML='<span class="big">'+letter+'</span><small>'+['弱い破裂','強い送気','鼻に響く','細い摩擦'][i]+'</small>';
      b.addEventListener('click',function(){select(letter);play(letter)}); g.appendChild(b);
      var c=document.createElement('button'); c.type='button'; c.dataset.letter=letter;
      c.textContent=letter+' '+sounds[letter].mark;
      c.addEventListener('click',function(){select(letter)}); free.appendChild(c)
    });
    select('b')
  }
  function renderQuiz(){
    var box=el('initialsQuizChoices'); if(!box)return; box.replaceChildren();
    letters.forEach(function(letter){
      var b=document.createElement('button'); b.type='button'; b.textContent=letter;
      b.addEventListener('click',function(){answerQuiz(letter,b)}); box.appendChild(b)
    });
    var count=el('initialsQuizCount'); if(count)count.textContent=(quizIndex+1)+' / '+quizOrder.length;
    var fb=el('initialsQuizFeedback'); if(fb){fb.textContent='';fb.className='initials-feedback'}
    var next=el('initialsQuizNext'); if(next)next.hidden=true; quizAnswered=false
  }
  function playQuiz(){play(quizOrder[quizIndex])}
  function answerQuiz(letter,button){
    if(quizAnswered)return; quizAnswered=true;
    var right=quizOrder[quizIndex],fb=el('initialsQuizFeedback');
    if(letter===right){
      quizScore++; button.classList.add('is-correct');
      if(fb){fb.textContent='いい耳！ '+right+' の単音だよ ✓';fb.className='initials-feedback is-good'}
    }else{
      button.classList.add('is-wrong');
      var rb=Array.prototype.find.call(el('initialsQuizChoices').children,function(x){return x.textContent===right});
      if(rb)rb.classList.add('is-correct');
      if(fb){fb.textContent='今回は '+right+'。母音を足さず、息と口の動きを聞こう';fb.className='initials-feedback is-bad'}
    }
    var next=el('initialsQuizNext');
    if(next){next.hidden=false;next.textContent=quizIndex===quizOrder.length-1?'結果を見る':'次の問題へ →'}
  }
  function nextQuiz(){
    if(!quizAnswered)return;
    if(quizIndex<quizOrder.length-1){quizIndex++;renderQuiz();playQuiz();return}
    finishQuiz()
  }
  function finishQuiz(){
    var panel=el('initialsQuizPanel'),reward=el('initialsReward');
    if(panel)panel.hidden=true; if(reward)reward.hidden=false; setStep(4);
    try{localStorage.setItem('koepandaInitialP3Complete','1');window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P3:true}}))}catch(e){}
    var small=reward&&reward.querySelector('small');
    if(small)small.textContent=quizScore>=3?'単音を聞き分けた！ 次は声母＋韻母へ':'まずはクリア！ 苦手な音はいつでも戻って練習できるよ'
  }
  function mimeType(){
    if(typeof MediaRecorder==='undefined')return '';
    var arr=['audio/mp4','audio/webm;codecs=opus','audio/webm'];
    for(var i=0;i<arr.length;i++){try{if(MediaRecorder.isTypeSupported(arr[i]))return arr[i]}catch(e){}}
    return ''
  }
  async function toggleRecord(){
    var btn=el('initialsRecord'),fb=el('initialsImitateFeedback');
    if(recorder&&recorder.state==='recording'){try{recorder.stop()}catch(e){}return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){
      if(fb)fb.textContent='このブラウザでは録音が使えません。';return
    }
    try{
      stopAudio(); chunks=[]; stream=await navigator.mediaDevices.getUserMedia({audio:true});
      var mt=mimeType(); recorder=new MediaRecorder(stream,mt?{mimeType:mt}:undefined);
      recorder.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      recorder.onstop=function(){
        var blob=new Blob(chunks,{type:recorder.mimeType||mt||'audio/mp4'});
        if(recordingUrl)URL.revokeObjectURL(recordingUrl); recordingUrl=URL.createObjectURL(blob);
        if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}
        btn.textContent='↻ もう一度録音'; btn.classList.remove('is-recording');
        el('initialsPlayback').disabled=false; el('initialsToQuiz').disabled=false;
        if(fb){fb.textContent='録音できたよ。お手本と聞きくらべてみよう 👂';fb.className='initials-feedback is-good'}
        setStep(3)
      };
      recorder.start(); btn.textContent='■ 録音を止める'; btn.classList.add('is-recording');
      if(fb){fb.textContent='録音中… '+selected+' の単音だけをまねしてみよう';fb.className='initials-feedback'}
    }catch(e){if(fb)fb.textContent='マイクの許可を確認してね。'}
  }
  function playRecording(){
    if(!recordingUrl)return;
    try{if(playback)playback.pause();playback=new Audio(recordingUrl);playback.play()}catch(e){}
  }
  function init(){
    if(!el('kidsInitialsLesson'))return;
    renderLetters();
    document.querySelectorAll('.air-card').forEach(function(b){b.addEventListener('click',function(){setStep(2);play(b.dataset.air)})});
    document.querySelectorAll('.mouth-sound-card').forEach(function(b){b.addEventListener('click',function(){setStep(2);play(b.dataset.mouth)})});
    el('initialsModelListen').addEventListener('click',function(){setStep(3);play(selected)});
    el('initialsRecord').addEventListener('click',toggleRecord);
    el('initialsPlayback').addEventListener('click',playRecording);
    el('initialsToQuiz').addEventListener('click',function(){
      el('initialsQuizPanel').hidden=false; this.closest('.initials-imitate-panel').hidden=true;
      quizIndex=0; quizScore=0; renderQuiz(); setStep(4);
      requestAnimationFrame(function(){el('initialsQuizPanel').scrollIntoView({block:'start',behavior:'smooth'})})
    });
    el('initialsQuizListen').addEventListener('click',playQuiz);
    el('initialsQuizNext').addEventListener('click',nextQuiz)
  }
  window.koepandaIsInitialUnitComplete=function(id){
    if(id==='P3'){try{return localStorage.getItem('koepandaInitialP3Complete')==='1'}catch(e){return false}}
    return false
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()
})();