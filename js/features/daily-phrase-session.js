(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let audioEpoch=0;
function clearReading(){document.querySelectorAll('.fx-ruby ruby').forEach(el=>el.classList.remove('is-speaking'))}
function speak(text,rate=0.65){const epoch=++audioEpoch;clearReading();try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=rate;const voices=speechSynthesis.getVoices(),v=voices.find(x=>/^zh[-_](CN|Hans)/i.test(x.lang))||voices.find(x=>/^zh/i.test(x.lang));if(v)u.voice=v;
 const mark=(index,length=1)=>{if(epoch!==audioEpoch)return;document.querySelectorAll('.fx-ruby ruby').forEach(el=>el.classList.toggle('is-speaking',Number(el.dataset.index)>=index&&Number(el.dataset.index)<index+length))};u.onstart=()=>mark(0);u.onboundary=e=>mark([...text.slice(0,e.charIndex)].length,e.charLength||1);u.onend=()=>{if(epoch===audioEpoch)clearReading()};u.onerror=()=>{if(epoch===audioEpoch){clearReading();const note=document.getElementById('rec-note');if(note){note.textContent='音声を再生できません。端末の中国語音声設定をご確認ください。';note.hidden=false}}};speechSynthesis.resume();(window.KP_AUDIO_SESSION&&window.KP_AUDIO_SESSION.preparePlayback(),window.speechSynthesis.speak(u))}catch(_){const note=document.getElementById('rec-note');if(note){note.textContent='この端末では音声を再生できません。';note.hidden=false}}}
function record(key,ok){const api=window.KP_ACCOUNT_API;if(api?.recordPracticeAttempt)api.recordPracticeAttempt(key,'practice-daily',ok).catch(e=>console.warn('[Koepanda] practice answer sync unavailable:',e))}
window.KoepandaDailyPhrase={async start({main,catalog,activityId,reviewKey,backHref}){
 const activity=catalog.daily_activities.find(x=>x.id===activityId)||catalog.daily_activities[0],bank=new Map(catalog.daily_phrase_bank.map(x=>[x.id,x])),questions=new Map(catalog.daily_questions.map(x=>[x.id,x]));if(!activity)throw Error('日常フレーズのルートが見つかりません');
 main.classList.add('is-daily-session');
 const phraseIds=activity.phrase_ids||[],phrases=phraseIds.map(id=>bank.get(id)).filter(Boolean);let phase='shadow',pos=0,check=0,correct=0,capture=null,viewEpoch=0;
 function ruby(p){
  const chars=[...p.simplified],py=p.pinyin.trim().split(/\s+/u),parts=[];
  let syllable=0;
  for(let index=0;index<chars.length;index++){
   const c=chars[index];
   if(!/\p{Script=Han}/u.test(c)){parts.push(esc(c));continue}
   let unit=`<ruby data-index="${index}">${esc(c)}<rt>${esc(py[syllable++]||'')}</rt></ruby>`;
   let ending='';
   while(index+1<chars.length && /[。！？；：，、…）”’」』]/u.test(chars[index+1])) ending+=chars[++index];
   if(ending)unit=`<span style="white-space:nowrap">${unit}${esc(ending)}</span>`;
   parts.push(unit);
  }
  return parts.join('');
 }
 const header=(label,sub)=>`<div class="fx-head"><small>${esc(label)}</small><h1>${esc(activity.title)}</h1><p>${esc(sub)}</p></div>`;
 function stopRec(){if(capture){capture.dispose();capture=null}}
 function render(){audioEpoch++;speechSynthesis.cancel();clearReading();viewEpoch++;stopRec();main.classList.toggle('is-daily-session',phase==='shadow');window.scrollTo(0,0);const count=document.getElementById('questionCount'),fill=document.getElementById('progressFill');const i=phase==='check'?check:pos,total=phase==='check'?activity.question_ids.length:phrases.length;if(count)count.textContent=`${i+1} / ${total}`;if(fill)fill.style.width=`${Math.round((i+1)/total*100)}%`;if(phase==='listen'){
  const p=phrases[pos];main.innerHTML=`${header(`聞く · ${pos+1}/${phrases.length}`,'まずは文字を見ずに、短いフレーズの音を聞いてみよう。')}<section class="fx-card fx-audio-first"><div class="fx-orb">🎧</div><h2>どんな音が聞こえるかな？</h2><p>聞き取れなくても大丈夫。何度か聞いたあとで、文字を見て練習します。</p><button class="fx-button" id="play" type="button">▶ もう一度聞く</button></section><button class="fx-primary" id="next">聞いたよ · 次へ</button>`;
  document.getElementById('play').onclick=()=>speak(p.simplified);document.getElementById('next').onclick=()=>{if(pos<phrases.length-1){pos++;render()}else{phase='shadow';pos=0;render()}};speak(p.simplified);return;
 }
 if(phase==='shadow'){
  const p=phrases[pos];main.innerHTML=`<div class="fx-head fx-head-compact"><h1>${esc(activity.title)}</h1></div><section class="fx-card fx-phrase"><h2 class="fx-ruby">${ruby(p)}</h2><p>${esc(p.ja_meaning)}</p></section><div class="fx-daily-dock"><div class="fx-controls"><button class="fx-button" id="normal">▶ お手本</button><button class="fx-button fx-light" id="slow">🐢 ゆっくり</button><button class="fx-button fx-light" id="own" hidden>▷ 録音を聞く</button></div><div class="fx-daily-nav"><button class="fx-button fx-nav-button" id="prev" ${pos===0?'disabled':''} aria-label="前のフレーズ">‹ 前へ</button><button class="fx-button fx-record-btn" id="record">● 録音する</button><button class="fx-button fx-nav-button" id="next" aria-label="${pos<phrases.length-1?'次のフレーズ':'会話で確認'}">${pos<phrases.length-1?'次へ ›':'確認へ ›'}</button></div><p id="rec-note" class="fx-daily-status" hidden></p></div>`;
  const stopSpeech=()=>{audioEpoch++;speechSynthesis.cancel();clearReading()};
  document.getElementById('prev').onclick=()=>{stopRec();stopSpeech();if(pos>0){pos--;render()}};
  document.getElementById('normal').onclick=()=>speak(p.simplified);
  document.getElementById('slow').onclick=()=>speak(p.simplified,.4);
  capture=window.KoepandaPracticeRecorder.create({button:document.getElementById('record'),replay:document.getElementById('own'),note:document.getElementById('rec-note'),listenButtons:[document.getElementById('normal'),document.getElementById('slow')],beforeRecord:stopSpeech,beforeReplay:stopSpeech});
  document.getElementById('next').onclick=()=>{stopRec();stopSpeech();if(pos<phrases.length-1){pos++;render()}else{phase='check';pos=0;render()}};return;
 }
 if(phase==='check'){
  const qid=activity.question_ids[check],q=questions.get(qid),prompt=q&&bank.get(q.prompt_id);if(!q||!prompt){finish();return}main.innerHTML=`${header(`ちょこっと確認 · ${check+1}/${activity.question_ids.length}`,'聞いて覚えたフレーズを、会話の中で確かめよう。')}<section class="fx-card fx-check"><span class="fx-context">${esc(q.context)}</span><button class="fx-button" id="play">▶ 音声を聞く</button><h2>${q.kind==='meaning'?'この意味の中国語を選んでね':'自然な返事を選んでね'}</h2><div class="fx-choices">${q.choice_ids.map((id,i)=>{const p=bank.get(id);return `<button class="fx-choice" data-id="${esc(id)}"><small>${i+1}</small><b>${esc(p?.simplified||'')}</b><span>${esc(p?.pinyin||'')}</span></button>`}).join('')}</div><p id="fb" class="fx-feedback"></p></section><button class="fx-primary" id="continue" disabled>次へ</button>`;document.getElementById('play').onclick=()=>speak(prompt.simplified);if(q.kind!=='meaning')speak(prompt.simplified);document.querySelectorAll('.fx-choice').forEach(b=>b.onclick=()=>{if(b.disabled)return;document.querySelectorAll('.fx-choice').forEach(x=>x.disabled=true);const ok=b.dataset.id===q.answer_id;b.classList.add(ok?'is-right':'is-wrong');if(!ok)document.querySelector(`[data-id="${CSS.escape(q.answer_id)}"]`)?.classList.add('is-right');const fb=document.getElementById('fb');fb.textContent=ok?'そのとおり！':`正解は ${bank.get(q.answer_id).simplified} · ${bank.get(q.answer_id).pinyin}`;fb.classList.add(ok?'is-right':'is-wrong');record('daily:'+q.id,ok);if(ok)correct++;document.getElementById('continue').disabled=false});document.getElementById('continue').onclick=()=>{if(check<activity.question_ids.length-1){check++;render()}else finish()};return;
 }}
 function finish(){main.classList.remove('is-daily-session');audioEpoch++;speechSynthesis.cancel();clearReading();window.KP_ACCOUNT_API?.recordLearningCompletion?.('daily',activity.id);viewEpoch++;stopRec();phase='done';document.getElementById('questionCount').textContent='✓';document.getElementById('progressFill').style.width='100%';window.scrollTo(0,0);main.innerHTML=`${header('できた！','聞いて、声に出して、会話でも使えました。')}<section class="fx-card fx-finish"><div class="fx-orb fx-xiaoyin"><img src="./assets/brand/xiaoyin-mascot.png" alt="小音"></div><h2>今日のひとこと、ばっちり！</h2><p>会話チェック ${correct} / ${activity.question_ids.length}</p><a class="fx-primary fx-link" href="${esc(backHref)}">ルートに戻る</a><a class="fx-secondary fx-link" href="./index.html?open=practice">練習ひろばへ</a></section>`}
 if((reviewKey||'').startsWith('daily:')){const q=questions.get(reviewKey.slice(6));if(!q)throw Error('復習する日常フレーズが見つかりません');activity.question_ids=[q.id];phraseIds.splice(0,phraseIds.length,q.prompt_id);phrases.splice(0,phrases.length,bank.get(q.prompt_id));phase='check'}render();
 window.addEventListener('pagehide',()=>{viewEpoch++;audioEpoch++;stopRec();speechSynthesis.cancel()});
 window.addEventListener('pageshow',event=>{if(event.persisted)render()});
}}})();
