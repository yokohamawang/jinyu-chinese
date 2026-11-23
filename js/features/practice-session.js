(()=>{'use strict';
const main=document.getElementById('practiceSession'),params=new URLSearchParams(location.search),track=params.get('track')||'chapter',unitId=params.get('unit')||'',mode=params.get('mode')||'meaning',activityId=params.get('activity')||'',reviewKey=params.get('review')||'',reviewLesson=params.get('reviewLesson');
let courseData,catalog,entriesById=new Map(),questions=[],position=0,score=0,selected=[],answered=false,reviewOnly=Boolean(reviewKey||reviewLesson),reviewWrites=[],referenceAudio=null;
// Keep the action outside the scrolling question pane. Native clicks work for
// touch, mouse and keyboard without cancelling Safari's pointer events.
function prepareQuestionLayout(){
 document.body.classList.add('ps-question-session');
 const title=reviewLesson==='words'?'保存したことば':reviewLesson?'まちがいレッスン':reviewOnly?'もういちどチャレンジ':pageTitles[track]||'練習';
 document.getElementById('practiceTopTitle').textContent=title;
 const heading=main.querySelector('.ps-session-heading');
 if(heading)heading.hidden=true;
 document.body.append(document.querySelector('.ps-action-dock'));
}
function revealQuestion(){
 const card=main.querySelector('.ps-question-card');
 if(!card)return;
 // Skip the decorative heading on later questions, keeping the prompt and
 // answer rows together. Only the question pane scrolls; the action stays put.
 main.scrollTop=Math.max(0,card.offsetTop-main.offsetTop-8);
}

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>a.map(x=>[Math.random(),x]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
const byId=id=>entriesById.get(id);
const testUnlocked=()=>{try{return typeof window.koepandaDevUnlockEnabled==='function'?Boolean(window.koepandaDevUnlockEnabled()):localStorage.getItem('koepandaDevUnlock12')==='1'}catch(_){return false}};

const pageTitles={chapter:'章ごとの練習',theme:'テーマ練習',daily:'日常のひとこと',scenario:'場面で会話'};
const courseForTheme=id=>'practice-theme-'+id;
function backHref(){if(reviewLesson)return './index.html?open=records';const route=track==='daily'||reviewKey.startsWith('daily:')?'daily':track==='scenario'||reviewKey.startsWith('dialogue:')?'scenario':track;return './practice-routes.html?track='+encodeURIComponent(route)+(route==='chapter'&&unitId&&!reviewOnly?'&unit='+encodeURIComponent(unitId):'')}
function speak(text){if(!text)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.88;const voice=speechSynthesis.getVoices().find(v=>/^zh(-|_)/i.test(v.lang));if(voice)u.voice=voice;(window.KP_AUDIO_SESSION&&window.KP_AUDIO_SESSION.preparePlayback(),window.speechSynthesis.speak(u))}catch(_){}}
function makeChoiceQuestion(entry,pool,kind,course){
 let choices,answerId,prompt,target='',audioText=entry.simplified,explain=`${entry.simplified} · ${entry.pinyin} · ${entry.ja_meaning}`,review;
 if(kind==='meaning'){
  const distractors=shuffle(pool.filter(e=>e.entry_id!==entry.entry_id&&e.ja_meaning!==entry.ja_meaning));choices=shuffle([entry,...distractors.slice(0,3)]).map(e=>({id:e.entry_id,label:e.ja_meaning,pinyin:e.pinyin,imageData:''}));answerId=entry.entry_id;prompt='この中国語の意味は？';target=entry.simplified;review='pre4-entry:'+entry.entry_id;
 }else if(kind==='word'){
  const distractors=shuffle(pool.filter(e=>e.entry_id!==entry.entry_id&&e.simplified!==entry.simplified));choices=shuffle([entry,...distractors.slice(0,3)]).map(e=>({id:e.entry_id,label:e.simplified,pinyin:e.pinyin,imageData:e.recognition?.image_data||''}));answerId=entry.entry_id;prompt='この意味に合うことばは？';target=entry.ja_meaning;review='pre4-entry:'+entry.entry_id;
 }else{
  const chars=entry.character_sequence||[],pys=entry.recognition?.character_pinyin||[];const charIndex=Number(entry._charIndex||0),character=chars[charIndex]||chars[0],correctPy=pys[charIndex]||pys[0]||'';
  const charPool=[];for(const e of pool){(e.character_sequence||[]).forEach((ch,i)=>{const py=e.recognition?.character_pinyin?.[i];if(py&&!charPool.some(x=>x.char===ch))charPool.push({char:ch,pinyin:py})})}
  const distractors=shuffle(charPool.filter(x=>x.char!==character&&x.pinyin!==correctPy));choices=shuffle([{id:character,label:correctPy,pinyin:'',imageData:''},...distractors.slice(0,3).map(x=>({id:x.char,label:x.pinyin,pinyin:'',imageData:''}))]);answerId=character;prompt='この漢字の読み方は？';target=character;audioText=character;explain=`${character} · ${correctPy} ／ ${entry.simplified}：${entry.ja_meaning}`;review='pre4-char:'+course+':'+character;
 }
 return{kind:'choice',context:'',prompt,target,audioText,choices,answerId,explain,reviewKey:review,course};
}
function unlockedUnitIds(){if(testUnlocked())return new Set(courseData.units.map(u=>u.unit_id));const done=(()=>{try{return new Set(JSON.parse(localStorage.getItem('koepanda.hanzi.unit-progress.v1')||'[]'))}catch(_){return new Set()}})(),current=courseData.units.findIndex(x=>!done.has(x.unit_id)),ci=current<0?courseData.units.length:current;return new Set(courseData.units.filter((u,i)=>done.has(u.unit_id)||i<=ci).map(u=>u.unit_id))}
function buildChapter(){const unit=courseData.units.find(x=>x.unit_id===unitId);if(!unit)throw Error('章が見つかりません');if(!unlockedUnitIds().has(unitId))throw Error('unlock:'+unitId);const bank=courseData.vocabulary_entries.filter(e=>e.unit_id===unitId);if(mode==='reading'){
 const seen=new Set(),items=[];for(const e of bank)(e.character_sequence||[]).forEach((ch,i)=>{const py=e.recognition?.character_pinyin?.[i];if(py&&!seen.has(ch)){seen.add(ch);items.push({...e,_charIndex:i})}});return shuffle(items).slice(0,5).map(e=>makeChoiceQuestion(e,bank,'reading',unitId));}
 return shuffle(bank).slice(0,5).map(e=>makeChoiceQuestion(e,bank,mode==='word'?'word':'meaning',unitId));}
function buildTheme(){const theme=catalog.themes.find(x=>x.id===activityId);if(!theme)throw Error('テーマが見つかりません');const eligible=unlockedUnitIds(),pool=courseData.vocabulary_entries.filter(e=>theme.unit_ids.includes(e.unit_id)&&eligible.has(e.unit_id));if(!pool.length)throw Error('このテーマは章を学ぶと開きます');return shuffle(pool).slice(0,5).map(e=>makeChoiceQuestion(e,pool,'meaning',courseForTheme(theme.id)))}
function buildDaily(){const activity=catalog.daily_activities.find(x=>x.id===activityId);if(!activity)throw Error('日常会話ルートが見つかりません');const phrases=new Map(catalog.daily_phrase_bank.map(x=>[x.id,x]));return activity.question_ids.map(id=>{const q=catalog.daily_questions.find(x=>x.id===id),prompt=phrases.get(q?.prompt_id);if(!q||!prompt)throw Error('日常フレーズの参照先がありません');return{kind:'choice',context:q.context,prompt:'音声にぴったりの返事は？',target:'音声を聞いて選ぼう',audioText:prompt.simplified,choices:q.choice_ids.map(cid=>{const x=phrases.get(cid);return{id:cid,label:x.simplified,pinyin:x.pinyin}}),answerId:q.answer_id,explain:`${prompt.simplified} → ${phrases.get(q.answer_id).simplified} · ${phrases.get(q.answer_id).ja_meaning}`,reviewKey:'daily:'+q.id,course:'practice-daily'}})}
function buildScenario(){const activity=catalog.scenario_activities.find(x=>x.id===activityId);if(!activity)throw Error('会話ルートが見つかりません');const done=(()=>{try{return new Set(JSON.parse(localStorage.getItem('koepanda.hanzi.unit-progress.v1')||'[]'))}catch(_){return new Set()}})();if(!done.has(activity.unlock_unit))throw Error('unlock:'+activity.unlock_unit);return shuffle(activity.question_ids.map(id=>{const q=catalog.scenario_questions.find(x=>x.id===id);if(!q)throw Error('会話問題の参照先がありません');return{kind:'order',context:q.context,prompt:'音声に合う返事を並べよう',audioText:q.heard||q.text,tileIds:q.tile_ids,answerIds:q.answer_ids,punctuationAfter:q.punctuation_after||[],text:q.text,explain:`${q.heard||''} → ${q.text}`,reviewKey:'scenario:'+q.id,course:'practice-scenario'}})).slice(0,5)}
function buildReview(reviewKey= params.get('review')||''){if(reviewKey.startsWith('pre4-entry:')){const entry=courseData.vocabulary_entries.find(e=>e.entry_id===reviewKey.slice(11));if(!entry)throw Error('復習する語句が見つかりません');const pool=courseData.vocabulary_entries.filter(e=>e.unit_id===entry.unit_id);return[makeChoiceQuestion(entry,pool,'meaning',entry.unit_id)]}
 if(reviewKey.startsWith('pre4-char:')){const rest=reviewKey.slice(10),split=rest.indexOf(':'),course=split<0?'hanzi-basic':rest.slice(0,split),character=split<0?rest:rest.slice(split+1);const bank=courseData.vocabulary_entries.filter(e=>e.unit_id===course),reading=[];for(const e of bank)(e.character_sequence||[]).forEach((ch,i)=>{if(ch===character)reading.push({...e,_charIndex:i})});if(!reading.length)throw Error('漢字の復習データが見つかりません');const q=makeChoiceQuestion(reading[0],bank,'reading',course);return[q]}
 if(reviewKey.startsWith('daily:')){const q=catalog.daily_questions.find(x=>x.id===reviewKey.slice(6));if(!q)throw Error('日常フレーズの復習が見つかりません');return buildDailyQuestion(q)}
 if(reviewKey.startsWith('scenario:')){const q=catalog.scenario_questions.find(x=>x.id===reviewKey.slice(9));if(!q)throw Error('場面会話の復習が見つかりません');return[{kind:'order',context:q.context,prompt:'音声に合う返事を並べよう',audioText:q.heard||q.text,tileIds:q.tile_ids,answerIds:q.answer_ids,punctuationAfter:q.punctuation_after||[],text:q.text,explain:`${q.heard||''} → ${q.text}`,reviewKey:'scenario:'+q.id,course:'practice-scenario'}]}
 throw Error('この問題形式の復習ルートが見つかりません')}
function fromDialogue(row, dialogues){
 const [,dialogueId,exerciseId]=row.item_key.split(':');
 const dialogue=dialogues.find(item=>item.id===dialogueId);
 const exercise=dialogue?.exercises.find(item=>item.id===exerciseId);
 if(!exercise)return null;
 const turns=new Map(dialogue.turns.map(turn=>[turn.id,turn]));
 const words=new Map(dialogue.turns.flatMap(turn=>turn.words.map(word=>[word.id,word])));
 const turn=turns.get(exercise.turn_id);
 const q={kind:'choice',context:dialogue.context,prompt:exercise.prompt||'聞いて選ぼう',audioText:turn?.hanzi,
   explain:turn?.translation,reviewKey:row.item_key,course:row.course_key};
 const textChoices=labels=>labels.map((label,index)=>({id:index,label}));
 if(exercise.type==='listen_meaning'||exercise.type==='pinyin_choice'){
   if(exercise.type==='pinyin_choice')q.audioText=words.get(exercise.word_id)?.hanzi||q.audioText;
   q.choices=textChoices(exercise.choices);q.answerId=exercise.answer;
 }else if(exercise.type==='reply_choice'){
   q.choices=exercise.choice_turn_ids.map(id=>({id,label:turns.get(id).hanzi}));
   q.answerId=exercise.answer_turn_id;
   q.explain=turns.get(q.answerId).translation;
 }else if(exercise.type==='fill_word'){
   let cursor=0;
   const word=words.get(exercise.blank_word_id);
   q.target=turn?.hanzi;
   for(const token of turn?.words||[]){
     const index=q.target.indexOf(token.hanzi,cursor);
     if(index<0)continue;
     if(token.id===exercise.blank_word_id){q.target=q.target.slice(0,index)+'＿＿'+q.target.slice(index+word.hanzi.length);break}
     cursor=index+token.hanzi.length;
   }
   q.audioText='';
   q.choices=exercise.choice_word_ids.map(id=>({id,label:words.get(id).hanzi}));
   q.answerId=exercise.blank_word_id;q.explain=word.meaning;
 }else if(exercise.type==='word_order'){
   const prefix=dialogueId+':';
   for(const [id,word] of words)entriesById.set(prefix+id,{simplified:word.hanzi,pinyin:word.pinyin});
   q.kind='order';q.answerIds=turn.words.map(word=>prefix+word.id);
   q.tileIds=shuffle([...q.answerIds,...(exercise.distractor_word_ids||[]).map(id=>prefix+id)]);
   q.text=turn.hanzi;
 }else return null;
 return q;
}
async function buildReviewLesson(){
 const wordsOnly=reviewLesson==='words';
 const rows=await window.KP_ACCOUNT_API?.getPracticeReviewQueue?.(wordsOnly?'reading-vocabulary':null,
   wordsOnly?undefined:{excludeCourse:'reading-vocabulary',dueOnly:true});
 if(!Array.isArray(rows))throw Error('ログインすると、学習の記録から復習できます。');
 const selectedRows=rows;
 let dialogues=[];
 if(selectedRows.some(row=>row.item_key.startsWith('dialogue:'))){
   const response=await fetch('./data/practice-dialogues-0.1.json?v=301.240');
   if(response.ok)dialogues=(await response.json()).dialogues||[];
 }
 const result=[];
 for(const row of selectedRows){
   if(result.length===5)break;
   const key=row.item_key;
   let q=null;
   try{
    if(wordsOnly&&key.startsWith('reading-word:')){
      const saved=key.slice(13);
      const packed=saved.startsWith('[')?JSON.parse(saved):[saved];
      const [term,reading,gloss]=packed;
      const entry=await window.KP_READING_LOOKUP.lookup(term,gloss?[reading,gloss]:null);
      if(entry)q={kind:'recall',prompt:'意味を思い出してみよう。',target:term,audioText:term,
        explain:entry.readings.join(' / ')+' · '+(entry.japanese?'':'英語：')+entry.gloss};
    }else if(key.startsWith('chapter-sound:')){
      const [correct,other,clip]=JSON.parse(key.slice('chapter-sound:'.length));
      if(/^[a-z0-9_./-]+\.wav$/i.test(clip)&&!clip.includes('..')&&!clip.startsWith('/')&&correct!==other){
        q={kind:'choice',prompt:'聞こえた音はどれ？',audioUrl:'./assets/audio/'+clip,answerId:correct,
          choices:shuffle([correct,other].map(label=>({id:label,label}))),explain:correct+' と '+other+' を聞き分けよう。'};
      }
    }else if(key.startsWith('pinyin:')){
      const item=window.KP_PINYIN_REVIEW.questionForKey(key);
      if(item)q={kind:'choice',prompt:'聞こえた音はどれ？',audioUrl:item.audioUrl,answerId:item.answer,
        choices:shuffle(item.choices.map(label=>({id:label,label}))),explain:item.note};
    }else if(key.startsWith('dialogue:'))q=fromDialogue(row,dialogues);
    else if(key.startsWith('quiz:')){
      const item=window.KoepandaFeatures?.practice?.questions?.find(q=>'quiz:'+q.id===key);
      if(item)q={kind:'choice',prompt:item.q,answerId:item.correct,
        choices:shuffle(item.a.map((label,id)=>({id,label}))),explain:item.why};
    }else if(/^(pre4-entry|pre4-char|daily|scenario):/.test(key))q=buildReview(key)[0];
   }catch(error){console.warn('[Koepanda] review item unavailable',key,error)}
   if(q)result.push({...q,reviewKey:key,course:row.course_key});
 }
 if(!result.length)throw Error(wordsOnly?'保存したことばがありません。中国探索やストーリーで、ことばを選んで保存してみよう。':'今日の復習はありません。');
 return result;
}
function stopReference(){if(referenceAudio){referenceAudio.pause();referenceAudio=null;}}
function listenReference(q){
 stopReference();
 if(!q.audioUrl){speak(q.audioText);return;}
 try{
   const clip=new Audio(q.audioUrl);
   referenceAudio=clip;
   const feedback=document.getElementById('feedback');
   const fail=()=>{if(referenceAudio===clip)feedback.textContent='音声を再生できませんでした。もう一度お試しください。';};
   clip.onerror=fail;clip.play().catch(fail);
 }catch(_){}
}
function nextLabel(){return position===questions.length-1?(reviewOnly?'復習を終える':'結果を見る'):'次の問題へ';}
function buildDailyQuestion(q){const phrases=new Map(catalog.daily_phrase_bank.map(x=>[x.id,x])),p=phrases.get(q.prompt_id);return[{kind:'choice',context:q.context,prompt:'音声にぴったりの返事は？',target:'音声を聞いて選ぼう',audioText:p.simplified,choices:q.choice_ids.map(id=>{const x=phrases.get(id);return{id,label:x.simplified,pinyin:x.pinyin}}),answerId:q.answer_id,explain:`${p.simplified} → ${phrases.get(q.answer_id).simplified} · ${phrases.get(q.answer_id).ja_meaning}`,reviewKey:'daily:'+q.id,course:'practice-daily'}]}
function loadQuestion(q){stopReference();if(window.speechSynthesis)speechSynthesis.cancel();answered=false;selected=[];document.getElementById('questionCount').textContent=`${position+1} / ${questions.length}`;document.getElementById('progressFill').style.width=`${Math.round(position/questions.length*100)}%`;const context=document.getElementById('sceneLabel'),prompt=document.getElementById('promptText'),target=document.getElementById('promptTarget'),audio=document.getElementById('listenButton'),slots=document.getElementById('answerSlots'),choices=document.getElementById('choiceGrid'),feedback=document.getElementById('feedback'),primary=document.getElementById('primaryAction'),detail=document.getElementById('answerDetail');context.textContent=q.context||'';context.hidden=!q.context;prompt.textContent=q.prompt;target.textContent=q.target||'';audio.hidden=!q.audioText&&!q.audioUrl;audio.onclick=()=>listenReference(q);slots.hidden=q.kind!=='order';slots.replaceChildren();choices.replaceChildren();feedback.textContent='';feedback.className='ps-feedback';detail.textContent='';primary.disabled=true;primary.textContent=q.kind==='order'?'ことばを選んでね':(reviewOnly?'答え合わせ': '答えを選んでね');primary.onclick=()=>{if(q.kind==='order'&&!answered){checkOrder(q);return}if(!answered){return}advance()};
 if(q.kind==='order'){for(let i=0;i<q.answerIds.length;i++){const b=document.createElement('button');b.type='button';b.className='ps-slot is-empty';b.textContent='＋';b.setAttribute('aria-label',`空欄 ${i+1}`);b.onclick=()=>{if(answered)return;const ix=Number(b.dataset.selectedIndex);if(Number.isInteger(ix)){selected.splice(ix,1);drawOrder(q)}};slots.append(b)}drawOrder(q);}
 else if(q.kind==='recall'){
   primary.disabled=false;primary.textContent='答えを見る';
   primary.onclick=()=>{
     detail.textContent=q.explain;primary.disabled=true;
     for(const [label,ok] of [['覚えていた',true],['もう一度復習する',false]]){
       const button=document.createElement('button');button.type='button';button.className='ps-choice';button.textContent=label;
       button.onclick=()=>{if(answered)return;answered=true;score+=ok?1:0;record(q,ok);advance();};
       choices.append(button);
     }
   };
 }
 else q.choices.forEach((choice,i)=>{const b=document.createElement('button');b.type='button';b.className='ps-choice';if(choice.imageData){const img=document.createElement('img');img.src=choice.imageData;img.alt='';b.append(img)}const label=document.createElement('span');label.innerHTML=`${esc(choice.label)}${choice.pinyin?`<small class="ps-choice-pinyin">${esc(choice.pinyin)}</small>`:''}`;b.append(label);b.onclick=()=>{if(answered)return;b.classList.add('is-tapped');setTimeout(()=>b.classList.remove('is-tapped'),170);answered=true;const ok=choice.id===q.answerId;score+=ok?1:0;b.classList.add(ok?'is-correct':'is-wrong');[...choices.children].forEach(x=>x.disabled=true);if(!ok){const right=q.choices.find(x=>x.id===q.answerId);[...choices.children].find(x=>x.textContent.includes(right.label))?.classList.add('is-correct')}showAnswer(q,ok);record(q,ok);primary.disabled=false;primary.textContent=nextLabel()};choices.append(b)});
 if(q.kind==='order'&&window.speechSynthesis)speechSynthesis.getVoices();if(position>0)revealQuestion();else main.scrollTop=0;
 // Question navigation is a user gesture: speak promptly, without blocking choices.
 if(q.audioText||q.audioUrl)listenReference(q);
}
function drawOrder(q){const slots=document.getElementById('answerSlots'),choices=document.getElementById('choiceGrid');slots.replaceChildren();q.answerIds.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.className='ps-slot';if(selected[i]){const token=byId(selected[i]);b.textContent=token?.simplified||'';b.dataset.selectedIndex=String(i);b.setAttribute('aria-label',`${token?.simplified||''} を取り消す`);b.onclick=()=>{if(answered)return;selected.splice(i,1);drawOrder(q)}}else{b.classList.add('is-empty');b.textContent='＋';b.setAttribute('aria-label',`空欄 ${i+1}`)}slots.append(b);if(q.punctuationAfter?.includes(i+1)){const punctuation=document.createElement('span');punctuation.className='ps-punctuation';punctuation.textContent='，';slots.append(punctuation)}if(i===q.answerIds.length-1&&/[。？！]$/.test(q.text||'')){const punctuation=document.createElement('span');punctuation.className='ps-punctuation';punctuation.textContent=q.text.slice(-1);slots.append(punctuation)}});choices.replaceChildren();q.tileIds.forEach(id=>{const token=byId(id);if(!token)return;const b=document.createElement('button');b.type='button';b.className='ps-choice ps-order-choice';b.dataset.itemId=id;b.disabled=answered||selected.includes(id);b.innerHTML=`<small>${esc(token.pinyin)}</small><b>${esc(token.simplified)}</b>`;b.setAttribute('aria-label',`${token.pinyin} ${token.simplified}`);b.onclick=()=>{if(answered||selected.length>=q.answerIds.length)return;selected.push(id);drawOrder(q)};choices.append(b)});document.getElementById('primaryAction').disabled=answered||selected.length!==q.answerIds.length;document.getElementById('primaryAction').textContent=answered?(reviewOnly?'復習を終える':position===questions.length-1?'結果を見る':'答え合わせ'):selected.length===q.answerIds.length?'答え合わせ':`ことばを選んでね（${selected.length}/${q.answerIds.length}）`}
function checkOrder(q){if(selected.length!==q.answerIds.length)return;answered=true;const ok=selected.every((id,i)=>id===q.answerIds[i]);score+=ok?1:0;drawOrder(q);showAnswer(q,ok);record(q,ok);document.getElementById('primaryAction').disabled=false;document.getElementById('primaryAction').textContent=nextLabel()}
function showAnswer(q,ok){const f=document.getElementById('feedback'),detail=document.getElementById('answerDetail');f.textContent=ok?'できた！ぴったりだよ ✨':'おしい！ここを確認しよう';f.className='ps-feedback '+(ok?'':'is-wrong');const explanation=q.explain||q.text||'';if(!ok&&q.kind==='order'){const expected=q.answerIds.map(id=>byId(id)?.simplified||'').join('');const actual=selected.map(id=>byId(id)?.simplified||'').join('');const first=selected.findIndex((id,i)=>id!==q.answerIds[i]);detail.textContent=`あなたの答え：${actual}\n正しい順番：${expected}\n${first>=0?`${first+1}番目から語順が違います。`:'語順をもう一度確認しましょう。'}\n${explanation}`;}else if(!ok&&q.kind==='choice'){const right=q.choices.find(x=>x.id===q.answerId);detail.textContent=`正しい答え：${right?.label||''}${right?.pinyin?' · '+right.pinyin:''}\n${explanation}\n選んだ答えと、正しい意味・発音を比べてみよう。`;}else detail.textContent=explanation}
function record(q,ok){
 const api=window.KP_ACCOUNT_API;
 if(!api?.recordPracticeAttempt)return;
 const write=api.recordPracticeAttempt(q.reviewKey,q.course,ok).catch(error=>{
   console.warn('[Koepanda] practice answer sync unavailable:',error);return false;
 });
 if(reviewLesson)reviewWrites.push(write);
}
function advance(){
 position++;
 if(position>=questions.length){finish(reviewOnly);return;}
 loadQuestion(questions[position]);
}
function finish(isReview){stopReference();
 if(reviewLesson){
   document.querySelector('.ps-action-dock')?.remove();
   if(window.speechSynthesis)speechSynthesis.cancel();
   main.scrollTop=0;document.getElementById('questionCount').textContent='';
   document.getElementById('progressFill').style.width='100%';
   main.innerHTML=`<section class="ps-finish-card"><h2>復習の結果</h2><p>確認できた問題 ${score}問 · 次に復習する問題 ${questions.length-score}問</p><p role="status" id="reviewSaveStatus">復習を記録しています…</p><a class="ps-primary ps-return" href="${backHref()}">学習の記録に戻る</a></section>`;
   Promise.all(reviewWrites).then(results=>{
     const status=document.getElementById('reviewSaveStatus');
     if(status)status.textContent=results.length===questions.length&&results.every(Boolean)?'復習を記録しました。':'一部の復習を保存できませんでした。';
   });
   return;
 }document.querySelector('.ps-action-dock')?.remove();main.scrollTop=0;const completion=window.KP_ACCOUNT_API?.recordLearningCompletion?.('practice',unitId||activityId||reviewKey);if(window.speechSynthesis)speechSynthesis.cancel();window.scrollTo(0,0);document.getElementById('questionCount').textContent='';document.getElementById('progressFill').style.width='100%';main.innerHTML=`<section class="ps-finish-card"><img src="./assets/hanzi/teacher-speaking.webp" alt="小音"><h2>🎉 ${isReview?'復習できたね！':'チャレンジ完了！'}</h2><span class="ps-score">${isReview?'✓':`${score} / ${questions.length}`}</span><p>🏅 今日のチャレンジ達成！<br>学習日は記録され、まちがえた問題は復習ノートからやり直せます。</p><p id="ps-record-status" role="status">学習記録を更新しています…</p><a class="ps-primary ps-return" href="${backHref()}">次の学習へ</a><a class="ps-secondary ps-return" href="./index.html?open=practice">復習・練習ひろばへ</a></section>`;Promise.resolve(completion).then(saved=>{const status=document.getElementById('ps-record-status');if(status)status.textContent=saved?'✓ 学習記録を保存しました。':'✓ この端末に学習日を記録しました。ログインすると学習履歴も同期できます。'}).catch(()=>{const status=document.getElementById('ps-record-status');if(status)status.textContent='学習日を記録しました。オンライン同期はあとで確認してください。'})}
async function start(){document.getElementById('routeBack').href=backHref();try{const b=await fetch('./data/practice-catalog-0.1.json?v=301.256');if(!b.ok)throw Error('練習データを読み込めません');catalog=await b.json();if(!reviewLesson&&(track==='scenario'||reviewKey.startsWith('dialogue:'))){await window.KoepandaScenarioDialogue.start({main,catalog,activityId,reviewKey,backHref:backHref()});return}if(!reviewLesson&&(track==='daily'||reviewKey.startsWith('daily:'))){await window.KoepandaDailyPhrase.start({main,catalog,activityId,reviewKey,backHref:backHref()});return}prepareQuestionLayout();const a=await fetch('./data/pre4-content-package-0.1.json');if(!a.ok)throw Error('練習データを読み込めません');courseData=await a.json();courseData.vocabulary_entries.forEach(e=>entriesById.set(e.entry_id,e));(catalog.support_tokens||[]).forEach(e=>entriesById.set(e.id,e));catalog.daily_phrase_bank.forEach(e=>entriesById.set(e.id,e));if(reviewLesson)questions=await buildReviewLesson();else if(reviewKey)questions=buildReview(reviewKey);else if(track==='chapter')questions=buildChapter();else if(track==='theme')questions=buildTheme();else if(track==='daily')questions=buildDaily();else if(track==='scenario')questions=buildScenario();if(!questions.length)throw Error('このルートには問題がありません');document.title=document.getElementById('practiceTopTitle').textContent+' | KoePanda';document.getElementById('sessionTitle').textContent=reviewOnly?'もういちどチャレンジ':pageTitles[track]||'練習';loadQuestion(questions[0])}catch(e){const locked=String(e.message).startsWith('unlock:');document.querySelector('.ps-action-dock')?.remove();main.innerHTML=`<div class="ps-error"><b>${locked?'この章はまだ開いていません':'練習を開けませんでした'}</b><p>${locked?'学習ルートで前の章を学んでから、もう一度開いてください。':esc(e.message||'データを読み込めませんでした。')}</p><a class="ps-secondary ps-return" href="${backHref()}">${reviewLesson?'学習の記録に戻る':'ルートに戻る'}</a></div>`}}
window.addEventListener('pagehide',()=>{stopReference();if(window.speechSynthesis)speechSynthesis.cancel()});
start();
})();
