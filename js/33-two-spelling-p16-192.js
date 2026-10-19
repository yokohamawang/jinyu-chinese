/* Koepanda 206 — spaced P16 lessons with reliable audio paths. */
(function(){'use strict';
var items=[
 {s:'bo',tone:'bō',a:'b',f:'o',cue:'波の「波」',file:'bo1.wav'},
 {s:'po',tone:'pō',a:'p',f:'o',cue:'坂道の「坡」',file:'po1.wav'},
 {s:'mo',tone:'mō',a:'m',f:'o',cue:'さわる「摸」',file:'mo1.wav'},
 {s:'fo',tone:'fō',a:'f',f:'o',cue:'声母 f と韻母 o',file:'fo1.wav'},
 {s:'de',tone:'dē',a:'d',f:'e',cue:'声母 d と韻母 e',file:'de1.wav'},
 {s:'te',tone:'tē',a:'t',f:'e',cue:'声母 t と韻母 e',file:'te1.wav'},
 {s:'ne',tone:'nē',a:'n',f:'e',cue:'声母 n と韻母 e',file:'ne1.wav'},
 {s:'le',tone:'lē',a:'l',f:'e',cue:'声母 l と韻母 e',file:'le1.wav'},
 {s:'ge',tone:'gē',a:'g',f:'e',cue:'お兄さんの「哥」',file:'ge1.wav'},
 {s:'ke',tone:'kē',a:'k',f:'e',cue:'声母 k と韻母 e',file:'ke1.wav'},
 {s:'he',tone:'hē',a:'h',f:'e',cue:'水を飲む「喝」',file:'he1.wav'},
 {s:'ji',tone:'jī',a:'j',f:'i',cue:'にわとりの「鶏」',file:'ji1.wav'},
 {s:'qi',tone:'qī',a:'q',f:'i',cue:'七つの「七」',file:'qi1.wav'},
 {s:'xi',tone:'xī',a:'x',f:'i',cue:'西の「西」',file:'xi1.wav'}
],root=document.createElement('section');
root.id='kidsTwoSpellingP16';root.className='kids-lesson-card kp192 kp205';root.hidden=true;
var current=0,token=0,audio=null,timers=[],rec=null,stream=null,clips={},urlCache={},quiz=[],qi=0,score=0,answered=false;
function q(id){return root.querySelector('#'+id)}
function stop(){token++;timers.forEach(clearTimeout);timers=[];if(audio){audio.pause();audio.onended=null;audio.onerror=null;audio=null}var blend=q('kp192Blend');if(blend)blend.className='kp192-blend'}
function timer(fn,ms){timers.push(setTimeout(fn,ms))}
function source(it){return new URL('/assets/audio/p16/'+it.file,window.location.origin).href}
function play(it,animate){stop();var t=token;audio=new Audio(source(it));audio.preload='auto';
 q('kp192Status').textContent='音を聞きながら、二つの音のつながりを見よう。';
 if(animate){timer(function(){if(t!==token)return;q('kp192Blend').classList.add('is-onset')},120);timer(function(){if(t!==token)return;q('kp192Blend').classList.remove('is-onset');q('kp192Blend').classList.add('is-vowel')},560);timer(function(){if(t!==token)return;q('kp192Blend').classList.remove('is-vowel');q('kp192Blend').classList.add('is-complete')},1080)}
 audio.onended=function(){if(t!==token)return;q('kp192Blend').className='kp192-blend is-complete';q('kp192Status').textContent='声母と韻母がつながって、一つの音になったね。'};
 audio.onerror=function(){if(t===token)q('kp192Status').textContent='音声を読み込めません。再生ボタンでもう一度試してね。'};
 var p=audio.play();if(p&&p.catch)p.catch(function(){if(t===token)q('kp192Status').textContent='もう一度「音を聞く」を押してね。'});
}
root.innerHTML='<div class="kp192-title"><span>二拼 · 1つずつ音をつなごう</span><h2>二拼・音をつなごう</h2><p>声母と韻母を合わせて、一つの音節を作ろう。</p></div><div class="kp192-progress"><span id="kp192Count">1 / 14</span><div class="kp205-progress-track"><i id="kp192ProgressFill"></i></div></div><details class="kp205-picker"><summary><span>音節をえらぶ</span><strong id="kp192CurrentChoice">bō</strong><small>一覧をひらく　⌄</small></summary><div class="kp192-picker" id="kp192Picker" aria-label="二拼の音節"></div></details><article class="kp192-lesson"><div class="kp192-top"><div class="kp192-reading"><span id="kp192Syllable">bō</span><button type="button" id="kp192Hear" aria-label="音を聞く">▶</button></div><p id="kp192Cue">波の「波」</p><small id="kp192Parts">声母 b ＋ 韻母 o</small></div><div class="kp205-hero"><img class="kp205-lesson-art" src="./assets/pinyin/lesson-illustrations/p16-two-part-panda-205.webp" alt="小音が声母と韻母をつなぐ順番を木のボードで説明している"><div class="kp192-blend" id="kp192Blend" aria-label="声母と韻母をつなぐ動き"><strong id="kp192Onset"></strong><strong id="kp192Final"></strong><strong id="kp192Together"></strong></div></div><p class="kp192-status" id="kp192Status" role="status" aria-live="polite">音を聞きながら、二つの音のつながりを見よう。</p><div class="kp205-controls"><button type="button" id="kp192Prev">← 前の音</button><button type="button" id="kp192Next">次の音 →</button></div><div class="kp192-actions"><button type="button" id="kp192Record">● 録音する</button><button type="button" id="kp192Replay" disabled>▶ 自分の声を聞く</button></div><div id="kp192RecordState" class="kp192-record-state" role="status" aria-live="polite"></div><div class="kp192-quiz-entrance"><button type="button" id="kp192QuizGo">ミニテストへ →</button></div><div class="kp192-quiz" id="kp192Quiz" hidden><b id="kp192Question"></b><button type="button" id="kp192QuizHear">▶ もう一度聞く</button><div id="kp192Choices" class="kp192-choices"></div><p id="kp192QuizStatus" aria-live="polite"></p><button type="button" id="kp192QuizNext" hidden>次へ →</button></div></article>';
var host=document.getElementById('kidsCourse');if(!host)return;host.appendChild(root);
items.forEach(function(it,i){var b=document.createElement('button');b.type='button';b.textContent=it.tone;b.dataset.s=it.s;b.addEventListener('click',function(){q('kp205Picker').open=false;select(i,true)});q('kp192Picker').appendChild(b)});
function select(i,auto){stop();current=(i+items.length)%items.length;var it=items[current];
 q('kp192Count').textContent=(current+1)+' / '+items.length;q('kp192ProgressFill').style.width=((current+1)/items.length*100)+'%';q('kp192CurrentChoice').textContent=it.tone;q('kp192Syllable').textContent=it.tone;q('kp192Cue').textContent=it.cue;q('kp192Parts').textContent='声母 '+it.a+' ＋ 韻母 '+it.f;q('kp192Onset').textContent=it.a;q('kp192Final').textContent=it.f;q('kp192Together').textContent=it.tone;
 q('kp192Picker').querySelectorAll('button').forEach(function(b,j){b.classList.toggle('is-selected',current===j);b.setAttribute('aria-pressed',String(current===j))});q('kp192Prev').disabled=current===0;q('kp192Next').disabled=current===items.length-1;q('kp192Replay').disabled=!clips[it.s];q('kp192Status').textContent='音を聞きながら、二つの音のつながりを見よう。';q('kp192RecordState').textContent='';if(auto)play(it,true)
}
q('kp192Hear').addEventListener('click',function(){play(items[current],true)});q('kp192Prev').addEventListener('click',function(){select(current-1,true)});q('kp192Next').addEventListener('click',function(){select(current+1,true)});
q('kp192Record').addEventListener('click',async function(){if(rec&&rec.state==='recording'){rec.stop();return}if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){q('kp192RecordState').textContent='この環境では録音できません。';return}stop();try{stream=await navigator.mediaDevices.getUserMedia({audio:true});var parts=[],key=items[current].s;rec=new MediaRecorder(stream);rec.ondataavailable=function(e){if(e.data.size)parts.push(e.data)};rec.onstop=function(){var blob=new Blob(parts,{type:rec.mimeType||'audio/webm'});if(urlCache[key])URL.revokeObjectURL(urlCache[key]);urlCache[key]=URL.createObjectURL(blob);clips[key]=urlCache[key];q('kp192Replay').disabled=!clips[items[current].s];q('kp192Record').textContent='● 録音する';q('kp192RecordState').textContent='録音できたよ！';stream.getTracks().forEach(function(t){t.stop()});stream=null};rec.start();q('kp192Record').textContent='■ 録音を止める';q('kp192RecordState').textContent='録音中…';setTimeout(function(){if(rec&&rec.state==='recording')rec.stop()},5000)}catch(e){q('kp192RecordState').textContent='マイクの許可を確認してください。'}});
q('kp192Replay').addEventListener('click',function(){var s=clips[items[current].s];if(!s)return;stop();audio=new Audio(s);audio.play().catch(function(){q('kp192RecordState').textContent='録音を再生できません。'})});
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),x=a[i];a[i]=a[j];a[j]=x}return a}
function ask(){answered=false;q('kp192QuizNext').hidden=true;q('kp192Question').textContent=(qi+1)+' / 5　聞こえた音はどれ？';q('kp192QuizStatus').textContent='';q('kp192Choices').replaceChildren();var truth=quiz[qi];var candidates=shuffle([truth].concat(shuffle(items.filter(function(x){return x!==truth})).slice(0,3)));candidates.forEach(function(it){var b=document.createElement('button');b.textContent=it.tone;b.type='button';b.addEventListener('click',function(){if(answered)return;answered=true;var ok=it===truth;if(ok)score++;q('kp192QuizStatus').textContent=ok?'正解！ やった！':'正解は '+truth.tone;q('kp192QuizNext').hidden=false;q('kp192Choices').querySelectorAll('button').forEach(function(c){c.disabled=true;if(c.textContent===truth.tone)c.classList.add('is-correct')})});q('kp192Choices').appendChild(b)});play(truth,false)}
q('kp192QuizGo').addEventListener('click',function(){quiz=shuffle(items.slice()).slice(0,5);qi=0;score=0;q('kp192Quiz').hidden=false;ask();q('kp192Quiz').scrollIntoView({block:'nearest'})});q('kp192QuizHear').addEventListener('click',function(){if(quiz[qi])play(quiz[qi],false)});
q('kp192QuizNext').addEventListener('click',function(){qi++;if(qi<quiz.length){ask();return}stop();q('kp192Question').textContent='結果　'+score+' / 5';q('kp192Choices').replaceChildren();q('kp192QuizStatus').textContent=score===5?'全問正解！ 小音も大よろこび！':'よくがんばりました！';q('kp192QuizNext').hidden=true;try{localStorage.setItem('koepandaCompoundP16Complete','1')}catch(e){}window.dispatchEvent(new Event('koepandaCompoundProgressChanged'))});
window.addEventListener('koepandaP16Open',function(){select(current,true)});window.addEventListener('koepandaP16Close',function(){stop();if(rec&&rec.state==='recording')rec.stop()});select(0,false);
})();
