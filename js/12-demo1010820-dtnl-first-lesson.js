/* DEMO 10.108.20 — P4 d/t/n/l first lesson */
(function(){
  var letters=['d','t','n','l'];
  var guide={d:{hanzi:'得',pinyin:'dé',ipa:'[t]',cue:'弱い息',tip:'舌先を、上の前歯のすぐ後ろの上あごにつけ、軽く離す。',title:'舌先は前歯のすぐ後ろ',sub:'触れてから、軽く離す'},t:{hanzi:'特',pinyin:'tè',ipa:'[tʰ]',cue:'強い息',tip:'d と同じ場所。舌先を離す瞬間に息を強く出す。',title:'舌先は d と同じ場所',sub:'離す瞬間に息を強く'},n:{hanzi:'讷',pinyin:'nè',ipa:'[n]',cue:'鼻に響く',tip:'舌先を、上の前歯のすぐ後ろの上あごにつけたまま、声を鼻へ響かせる。',title:'舌先はつけたまま',sub:'声は鼻へ響かせる'},l:{hanzi:'勒',pinyin:'lè',ipa:'[l]',cue:'左右に流す',tip:'舌先を、上の前歯のすぐ後ろの上あごにつけ、声を舌の左右から通す。',title:'舌先は前歯のすぐ後ろ',sub:'舌の左右から音を流す'}};
  var selected='d',quizOrder=['d','t','n','l'],quizIndex=0,quizScore=0,quizAnswered=false,audioCtxRef=null,nodes=[],recorder=null,stream=null,chunks=[],recordingUrl='',playback=null;
  function el(id){return document.getElementById(id)}
  function stopSynthetic(){nodes.forEach(function(n){try{n.stop(0)}catch(e){}});nodes=[]}
  function ctx(){try{audioCtxRef=audioCtxRef||new (window.AudioContext||window.webkitAudioContext)();if(audioCtxRef.state==='suspended')audioCtxRef.resume();return audioCtxRef}catch(e){return null}}
  function env(g,c,now,peak,dur){g.gain.cancelScheduledValues(now);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(peak,now+.015);g.gain.exponentialRampToValueAtTime(.0001,now+dur)}
  function noise(c,d){var b=c.createBuffer(1,Math.floor(c.sampleRate*d),c.sampleRate),a=b.getChannelData(0);for(var i=0;i<a.length;i++)a[i]=Math.random()*2-1;return b}
  function burst(asp){var c=ctx();if(!c)return;stopSynthetic();var now=c.currentTime+.02,src=c.createBufferSource(),bp=c.createBiquadFilter(),g=c.createGain();src.buffer=noise(c,asp?.18:.09);bp.type='bandpass';bp.frequency.value=3400;bp.Q.value=.8;env(g,c,now,asp?.22:.10,asp?.20:.10);src.connect(bp).connect(g).connect(c.destination);src.start(now);src.stop(now+(asp?.22:.12));nodes.push(src)}
  function nasal(){var c=ctx();if(!c)return;stopSynthetic();var now=c.currentTime+.02,o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='sine';o.frequency.value=190;lp.type='lowpass';lp.frequency.value=900;env(g,c,now,.11,.32);o.connect(lp).connect(g).connect(c.destination);o.start(now);o.stop(now+.34);nodes.push(o)}
  function lateral(){var c=ctx();if(!c)return;stopSynthetic();var now=c.currentTime+.02,o=c.createOscillator(),g=c.createGain(),bp=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=165;bp.type='bandpass';bp.frequency.value=1250;bp.Q.value=.5;env(g,c,now,.055,.30);o.connect(bp).connect(g).connect(c.destination);o.start(now);o.stop(now+.33);nodes.push(o)}
  function playRaw(letter){if(letter==='d')burst(false);else if(letter==='t')burst(true);else if(letter==='n')nasal();else lateral()}
  function playGuide(letter){var it=guide[letter];if(!it)return;stopSynthetic();try{if('speechSynthesis' in window)speechSynthesis.cancel()}catch(e0){}try{if(typeof window.playMachine==='function'){var r=window.playMachine(it.hanzi,null,false);if(r&&typeof r.catch==='function')r.catch(function(){playRaw(letter)});return}}catch(e){}try{if('speechSynthesis'in window){speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(it.hanzi);u.lang='zh-CN';u.rate=.78;u.pitch=1;u.onerror=function(){playRaw(letter)};speechSynthesis.speak(u);return}}catch(e2){}playRaw(letter)}
  function setStep(n){document.querySelectorAll('.dtnl-progress span').forEach(function(x){var k=Number(x.dataset.dtnlStep);x.classList.toggle('is-current',k===n);x.classList.toggle('is-done',k<n)})}
  function diagram(letter){
    var t=letter==='t',n=letter==='n',l=letter==='l';
    var motion=letter==='d'?'short':t?'strong':n?'nasal':'lateral';
    return '<div class="kp49-diagram kp49-'+letter+'" role="img" aria-label="'+letter+' の側面：舌先は上の前歯のすぐ後ろ、'+guide[letter].cue+'">'+
    '<svg viewBox="0 0 230 166" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<defs><linearGradient id="kp49skin" x2="0" y2="1"><stop stop-color="#fffdfb"/><stop offset="1" stop-color="#ffece4"/></linearGradient></defs>'+
    '<path d="M181 15 Q207 22 204 45 Q203 57 217 66 Q220 72 208 76 L200 80 Q201 87 213 91 Q216 98 203 103 Q202 127 184 143 Q146 157 84 145 L45 136 Q34 95 55 54 Q89 10 181 15Z" fill="url(#kp49skin)" stroke="#cd998d" stroke-width="2.8"/>'+
    '<path d="M70 57 Q115 25 176 49 Q194 56 195 66" fill="none" stroke="#dec2b2" stroke-width="8" stroke-linecap="round"/>'+
    '<path d="M184 51 Q199 55 197 72" fill="none" stroke="#f3dfce" stroke-width="8" stroke-linecap="round"/>'+
    '<path d="M185 76 L199 78 L196 94 L182 94 Q175 89 182 80Z" fill="#fff" stroke="#d8b9ad" stroke-width="2"/>'+
    '<path d="M177 78 Q171 72 162 76" fill="none" stroke="#d39e8d" stroke-width="4" stroke-linecap="round"/>'+
    '<path class="kp49-ridge" d="M177 79 Q172 76 167 79" fill="none" stroke="#f0ad76" stroke-width="7" stroke-linecap="round"/>'+
    '<path class="kp49-tongue" d="M60 119 Q98 96 135 93 Q162 83 174 81 Q181 83 176 90 Q162 97 153 104 Q120 135 69 133Z" fill="#ee8c8a" stroke="#d46c71" stroke-width="2.8"/>'+
    '<path d="M75 129 Q130 143 176 112" fill="none" stroke="#b77d74" stroke-width="2" opacity=".45"/>'+
    '<path class="kp49-nosepath" d="M172 48 Q184 35 190 45" fill="none" stroke="#53a98b" stroke-width="5" stroke-linecap="round"/>'+
    '<path class="kp49-flow kp49-flow1" d="M203 90 Q216 87 223 81" fill="none" stroke="#42b999" stroke-width="3.5" stroke-linecap="round"/>'+
    '<path class="kp49-flow kp49-flow2" d="M203 96 Q220 96 225 99" fill="none" stroke="#42b999" stroke-width="3" stroke-linecap="round"/>'+
    '<path class="kp49-sideflow" d="M110 120 Q137 133 171 111" fill="none" stroke="#42b999" stroke-width="3.5" stroke-linecap="round"/>'+
    '<circle class="kp49-contact" cx="175" cy="82" r="7" fill="none" stroke="#edaa65" stroke-width="2.5"/>'+
    '</svg><span class="kp49-side-caption">'+(n?'鼻へ声が抜ける':l?'舌の左右から声が通る':t?'舌を離して息を強く':'舌を軽く離す')+'</span></div>'
  }
  function front(letter){
    var n=letter==='n',l=letter==='l';
    return '<div class="kp49-face kp49-'+letter+'" role="img" aria-label="'+letter+' の正面。歯と舌の動き">'+
    '<svg viewBox="0 0 180 166" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<path d="M38 12 Q90 -1 142 12 Q164 43 158 109 Q144 152 90 157 Q36 152 22 109 Q16 43 38 12Z" fill="#fff2ea" stroke="#e6c7bb" stroke-width="2"/>'+
    '<path d="M73 26 Q67 43 72 54 M107 26 Q113 43 108 54" fill="none" stroke="#dbb5a8" stroke-width="3.5" stroke-linecap="round"/>'+
    '<path d="M61 57 Q70 68 90 68 Q110 68 119 57 Q109 81 90 80 Q71 81 61 57Z" fill="#f4c9b8" stroke="#dba99d" stroke-width="2"/>'+
    '<ellipse cx="77" cy="70" rx="7" ry="3.3" fill="#ae7971"/><ellipse cx="103" cy="70" rx="7" ry="3.3" fill="#ae7971"/>'+
    '<path d="M41 110 Q90 92 139 110 Q133 143 90 146 Q47 143 41 110Z" fill="#c96e74" stroke="#bd7573" stroke-width="2"/>'+
    '<path d="M48 110 Q90 99 132 110 L128 121 Q91 130 52 121Z" fill="#fffaf5" stroke="#e5c6bd" stroke-width="2"/>'+
    '<path d="M60 110 V124 M75 105 V127 M90 104 V129 M105 105 V127 M120 110 V124" stroke="#e9d7cf" stroke-width="1.5"/>'+
    '<path class="kp49-front-tongue" d="M57 135 Q76 115 90 112 Q104 115 123 135 Q95 151 57 135Z" fill="#ee8f8c" stroke="#d66f77" stroke-width="2"/>'+
    '<path class="kp49-front-nasal" d="M57 59 Q39 42 44 29 M123 59 Q141 42 136 29" stroke="#50ae8b" stroke-width="4" fill="none" stroke-linecap="round"/>'+
    '<path class="kp49-front-air" d="M129 126 Q147 118 158 113 M51 126 Q32 118 22 113" stroke="#50b996" stroke-width="3" fill="none" stroke-linecap="round"/>'+
    '</svg></div>'
  }
  function renderFocus(){var it=guide[selected];el('dtnlFocusLetter').textContent=selected;el('dtnlFocusGuide').textContent=it.hanzi+' '+it.pinyin+' · '+it.ipa;el('dtnlFocusTip').textContent=it.tip;var act=el('dtnlActions');act.replaceChildren();var a=document.createElement('button');a.type='button';a.className='dtnl-guide-btn';a.textContent='▶ お手本（'+it.hanzi+'）';a.onclick=function(){playGuide(selected)};var b=document.createElement('button');b.type='button';b.className='dtnl-raw-btn';b.textContent='舌・息だけ';b.onclick=function(){playRaw(selected)};act.append(a,b);el('dtnlArticulation').innerHTML='<div class="dtnl-stage-head"><span>口の動きアニメーション</span><small>正面で口の形、横から舌先の位置</small></div>'+'<div class="dtnl-front-view"><span class="dtnl-view-label">正面</span>'+front(selected)+'</div><div class="dtnl-side-view"><span class="dtnl-view-label">横から</span>'+diagram(selected)+'</div><div class="dtnl-art-copy"><b>'+it.title+'</b><small>'+it.sub+'</small><em>'+it.cue+'</em></div>'}
  function select(letter,listen){selected=letter;document.querySelectorAll('.dtnl-letter-card,.dtnl-free-choice button').forEach(function(x){x.classList.toggle('is-active',x.dataset.letter===letter)});renderFocus();if(listen)playGuide(letter)}
  function renderLetters(){var grid=el('dtnlLetterGrid'),free=el('dtnlFreeChoice');if(!grid||!free)return;grid.replaceChildren();free.replaceChildren();letters.forEach(function(letter){var it=guide[letter],b=document.createElement('button');b.type='button';b.className='dtnl-letter-card';b.dataset.letter=letter;b.innerHTML='<span class="big">'+letter+'</span><span class="ipa">'+it.ipa+'</span><span class="cue">'+it.cue+'</span>';b.onclick=function(){setStep(2);select(letter,true)};grid.appendChild(b);var f=document.createElement('button');f.type='button';f.dataset.letter=letter;f.textContent=letter;f.onclick=function(){setStep(3);select(letter,true)};free.appendChild(f)});select('d',false)}
  function mimeType(){
    if(typeof MediaRecorder==='undefined')return '';
    var arr=['audio/mp4','audio/webm;codecs=opus','audio/webm'];
    for(var i=0;i<arr.length;i++){try{if(MediaRecorder.isTypeSupported(arr[i]))return arr[i]}catch(e){}}
    return ''
  }
  function stopPracticeAudio(){
    stopSynthetic();
    try{if('speechSynthesis' in window)speechSynthesis.cancel()}catch(e){}
    try{if(playback){playback.pause();playback.currentTime=0}}catch(e2){}
  }
  async function toggleRecord(){
    var btn=el('dtnlRecord'),fb=el('dtnlPracticeFeedback');
    if(recorder&&recorder.state==='recording'){try{recorder.stop()}catch(e){}return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){
      if(fb){fb.textContent='このブラウザでは録音が使えません。';fb.className='dtnl-feedback is-bad'}return
    }
    try{
      stopPracticeAudio();chunks=[];stream=await navigator.mediaDevices.getUserMedia({audio:true});
      var mt=mimeType();recorder=new MediaRecorder(stream,mt?{mimeType:mt}:undefined);
      recorder.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      recorder.onstop=function(){
        var blob=new Blob(chunks,{type:recorder.mimeType||mt||'audio/mp4'});
        if(recordingUrl)URL.revokeObjectURL(recordingUrl);recordingUrl=URL.createObjectURL(blob);
        if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}
        btn.textContent='↻ もう一度録音';btn.classList.remove('is-recording');
        el('dtnlPlayback').disabled=false;
        if(fb){fb.textContent='録音できたよ。お手本と聞きくらべてみよう 👂';fb.className='dtnl-feedback is-good'}
        setStep(3)
      };
      recorder.start();btn.textContent='■ 録音を止める';btn.classList.add('is-recording');
      if(fb){fb.textContent='録音中… '+selected+' の舌先と息の出し方を意識してまねしよう';fb.className='dtnl-feedback'}
    }catch(e){if(fb){fb.textContent='マイクの許可を確認してね。';fb.className='dtnl-feedback is-bad'}}
  }
  function playRecording(){
    if(!recordingUrl)return;
    var btn=el('dtnlPlayback');if(btn){btn.classList.remove('is-pressed');void btn.offsetWidth;btn.classList.add('is-pressed');setTimeout(function(){btn.classList.remove('is-pressed')},180)}
    try{if(playback)playback.pause();playback=new Audio(recordingUrl);if(btn)btn.classList.add('is-playing');playback.addEventListener('ended',function(){if(btn)btn.classList.remove('is-playing')},{once:true});var p=playback.play();if(p&&p.catch)p.catch(function(){if(btn)btn.classList.remove('is-playing')})}catch(e){if(btn)btn.classList.remove('is-playing')}
  }
  function renderQuiz(){var box=el('dtnlQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.onclick=function(){answer(letter,b)};box.appendChild(b)});el('dtnlQuizCount').textContent=(quizIndex+1)+' / '+quizOrder.length;el('dtnlQuizFeedback').textContent='';el('dtnlQuizFeedback').className='dtnl-feedback';el('dtnlQuizNext').hidden=true;quizAnswered=false}
  function answer(letter,button){if(quizAnswered)return;quizAnswered=true;var right=quizOrder[quizIndex],fb=el('dtnlQuizFeedback');if(letter===right){quizScore++;button.classList.add('is-correct');fb.textContent='いい耳！ '+right+' だよ ✓';fb.className='dtnl-feedback is-good'}else{button.classList.add('is-wrong');Array.from(el('dtnlQuizChoices').children).forEach(function(x){if(x.textContent===right)x.classList.add('is-correct')});fb.textContent='今回は '+right+'。舌先と息の違いをもう一度見よう';fb.className='dtnl-feedback is-bad'}var next=el('dtnlQuizNext');if(quizIndex===quizOrder.length-1){next.hidden=true;window.setTimeout(function(){if(quizAnswered)finish()},650)}else{next.hidden=false;next.textContent='次の問題へ →'}}
  function nextQuiz(){if(!quizAnswered)return;if(quizIndex<quizOrder.length-1){quizIndex++;renderQuiz();playGuide(quizOrder[quizIndex]);return}finish()}
  function finish(){var pass=quizScore>=3,res=el('dtnlResult');el('dtnlQuizPanel').hidden=true;res.hidden=false;var badge=el('dtnlResultBadge');badge.textContent=pass?'✓':'↻';badge.className='dtnl-result-badge '+(pass?'':'is-retry');el('dtnlResultScore').textContent='4問中 '+quizScore+'問正解';el('dtnlResultMessage').textContent=pass?'舌先の場所と、息・鼻・左右の通り道をつかめたよ。':'もう一度ゆっくり聞き比べよう。';var a=el('dtnlResultAction');a.textContent=pass?'レッスン一覧へ戻る':'もう一度チェックする';a.onclick=pass?function(){try{localStorage.setItem('koepandaInitialP4Complete','1');window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P4:true}}))}catch(e){}var back=document.getElementById('pinyinLessonBack');if(back)back.click()}:function(){quizIndex=0;quizScore=0;res.hidden=true;el('dtnlQuizPanel').hidden=false;renderQuiz();setStep(4)};var celebration={score:quizScore,total:quizOrder.length,passed:pass,title:pass?'ミニチェック合格！':'あと一歩！',message:pass?(quizScore===quizOrder.length?'d・t・n・l、4問ぜんぶ正解！ 舌先と息の違いをしっかり聞き分けられたよ。':'d・t・n・l の違いがつかめたよ。あと1問で満点！'):'苦手な音を聞き直して、もう一度挑戦しよう。'};if(window.koepandaAttachResultReplay)window.koepandaAttachResultReplay(res,celebration);if(window.koepandaQueueResultCelebration)window.koepandaQueueResultCelebration(celebration,90);else if(window.koepandaShowResultCelebration)window.setTimeout(function(){window.koepandaShowResultCelebration(celebration)},90)}
  function init(){
    if(!el('kidsInitialsDTNLLesson'))return;
    renderLetters();
    var practice=document.querySelector('#kidsInitialsDTNLLesson .dtnl-practice-panel');
    if(practice)practice.hidden=false;
    el('dtnlQuizPanel').hidden=true;el('dtnlResult').hidden=true;
    el('dtnlPlayback').disabled=true;el('dtnlToQuiz').disabled=false;
    el('dtnlRecord').onclick=toggleRecord;
    el('dtnlPlayback').onclick=playRecording;
    el('dtnlToQuiz').onclick=function(){
      setStep(4);quizIndex=0;quizScore=0;if(practice)practice.hidden=true;el('dtnlQuizPanel').hidden=false;renderQuiz();
      requestAnimationFrame(function(){el('dtnlQuizPanel').scrollIntoView({block:'start',behavior:'smooth'})})
    };
    el('dtnlQuizListen').onclick=function(){playGuide(quizOrder[quizIndex])};el('dtnlQuizNext').onclick=nextQuiz
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
