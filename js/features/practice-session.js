(()=>{'use strict';
const main=document.getElementById('practiceSession'),params=new URLSearchParams(location.search),track=params.get('track')||'chapter',unitId=params.get('unit')||'',mode=params.get('mode')||'meaning',activityId=params.get('activity')||'',reviewKey=params.get('review')||'',reviewLesson=params.get('reviewLesson');
const pre4 = window.KP_PRE4;
const lookup = window.KP_PRE4_LOOKUP;
const py=window.KP_PRE4_PINYIN;
const pre4JapaneseChoices=q=>q.group==='number'||q.reviewKey?.startsWith(pre4.prefix+'meaning:')||q.reviewKey?.endsWith(':listen')||/:context-\d+$/.test(q.reviewKey||'');
const pre4Teach=q=>q.course===pre4.course&&!q.reviewKey?.startsWith(pre4.prefix+'mock:')&&!q.reviewKey?.startsWith(pre4.prefix+'reading:')&&!q.reviewKey?.endsWith(':sound')&&unitId!=='exam';
let lookupEntries;
let lookupWords;
function localWords(){
 if(lookupEntries!==courseData?.vocabulary_entries || !lookupWords){
   lookupEntries=courseData?.vocabulary_entries;
   lookupWords=lookup.words(lookupEntries);
 }
 return lookupWords;
}
const reviewOnly = Boolean(reviewKey || reviewLesson);
const pre4Quiz = track === 'pre4' && !reviewOnly;
const pre4Review = reviewLesson === 'pre4' || reviewKey.startsWith(pre4.prefix);
const lesson = Number(params.get('lesson'));
const mockPaper = pre4Quiz && unitId === 'mock' && mode === 'paper';
const mockAnswers = [];
const missed = [];
let immediateRetry = false;
let quizMarkup = '', quizDock;
let mockClock, mockTimedOut = false;

function startMockClock(){
 const title=document.getElementById('practiceTopTitle');
 const timer=document.createElement('time');
 timer.className='ps-mock-clock';
 timer.setAttribute('aria-label','試験の残り時間');
 title.after(timer);
 const deadline=Date.now()+50*60*1000;
 function tick(){
   const seconds=Math.max(0,Math.ceil((deadline-Date.now())/1000));
   timer.textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
   if(seconds===0){
     mockTimedOut=true;
     finishPre4Quiz();
   }
 }
 mockClock=window.setInterval(tick,250);
 tick();
}

let courseData,catalog,entriesById=new Map(),questions=[],position=0,score=0,selected=[],answered=false,reviewWrites=[],referenceAudio=null;
lookup.mount(main,localWords);
// Keep the action outside the scrolling question pane. Native clicks work for
// touch, mouse and keyboard without cancelling Safari's pointer events.
function prepareQuestionLayout(){
 document.body.classList.add('ps-question-session');
 const title=mockPaper?'準4級 模擬試験 第'+lesson+'回':reviewLesson==='words'?'保存したことば':reviewLesson?'まちがいレッスン':reviewOnly?'もういちどチャレンジ':pageTitles[track]||'練習';
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
function byId(id){
 if(typeof id==='string'&&id.startsWith('station/')){
   const simplified=id.split('/')[2];
   const pinyin=localWords().get(simplified)?.[0] || py.pairs(simplified).map(pair=>pair.p).filter(Boolean).join(' ');
   return {simplified,pinyin};
 }
 return entriesById.get(id);
}
const testUnlocked=()=>{try{return typeof window.koepandaDevUnlockEnabled==='function'?Boolean(window.koepandaDevUnlockEnabled()):localStorage.getItem('koepandaDevUnlock12')==='1'}catch(_){return false}};

const pageTitles={pre4:'中検 準4級',chapter:'章ごとの練習',theme:'テーマ練習',daily:'日常のひとこと',scenario:'場面で会話'};
const courseForTheme=id=>'practice-theme-'+id;
function backHref(){
 if(pre4Review)return './pre4.html';
 if(pre4Quiz){
   if(unitId==='mock'){
     if(params.get('from')==='past'){
       const query=new URLSearchParams({unit:'past',edition:params.get('edition')||''});
       return './pre4.html?'+query.toString();
     }
     return './pre4.html?unit='+(mockPaper?'exam':'practice');
   }
   const query=new URLSearchParams({unit:unitId});
   if(window.KP_PRE4_STATIONS[unitId]?.[lesson-1])query.set('station',lesson);
   return './pre4.html?'+query.toString();
 }
 if(reviewLesson)return './index.html?open=records';const route=track==='daily'||reviewKey.startsWith('daily:')?'daily':track==='scenario'||reviewKey.startsWith('dialogue:')?'scenario':track;return './practice-routes.html?track='+encodeURIComponent(route)+(route==='chapter'&&unitId&&!reviewOnly?'&unit='+encodeURIComponent(unitId):'')}
function speak(text,onError){
 if(onError && (!window.speechSynthesis || !window.SpeechSynthesisUtterance)){onError();return;}
 if(!text)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.88;if(onError)u.onerror=event=>{
 if(!['canceled','interrupted'].includes(event.error))onError();
 };const voice=speechSynthesis.getVoices().find(v=>/^zh(-|_)/i.test(v.lang));if(voice)u.voice=voice;(window.KP_AUDIO_SESSION&&window.KP_AUDIO_SESSION.preparePlayback(),window.speechSynthesis.speak(u))}catch(_){onError?.()}}
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
function buildReview(reviewKey= params.get('review')||''){
 if(reviewKey.startsWith(pre4.prefix)){
   const question=pre4.restore(reviewKey,courseData.vocabulary_entries,shuffle);
   if(!question)throw Error('準4級の復習する問題が見つかりません。');
   return [question];
 }
 if(reviewKey.startsWith('pre4-entry:')){const entry=courseData.vocabulary_entries.find(e=>e.entry_id===reviewKey.slice(11));if(!entry)throw Error('復習する語句が見つかりません');const pool=courseData.vocabulary_entries.filter(e=>e.unit_id===entry.unit_id);return[makeChoiceQuestion(entry,pool,'meaning',entry.unit_id)]}
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
 const rows=await window.KP_ACCOUNT_API?.getPracticeReviewQueue?.(wordsOnly?'reading-vocabulary':reviewLesson==='pre4'?pre4.course:null,
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
    }else if(key.startsWith(pre4.prefix))q=buildReview(key)[0];
    else if(/^(pre4-entry|pre4-char|daily|scenario):/.test(key))q=buildReview(key)[0];
   }catch(error){console.warn('[Koepanda] review item unavailable',key,error)}
   if(q)result.push({...q,reviewKey:key,course:row.course_key});
 }
 if(!result.length)throw Error(wordsOnly?'保存したことばがありません。中国探索やストーリーで、ことばを選んで保存してみよう。':'今日の復習はありません。');
 return result;
}
function stopReference(){if(referenceAudio){referenceAudio.pause();referenceAudio=null;}}
function listenReference(q){
 stopReference();
 if(!q.audioUrl){
   speak(q.audioText,q.course===pre4.course?()=>{
     if(questions[position]===q&&!answered)document.getElementById('feedback').textContent='中国語の音声を再生できませんでした。';
   }:undefined);
   return;
 }
 try{
   const clip=new Audio(q.audioUrl);
   referenceAudio=clip;
   const feedback=document.getElementById('feedback');
   const fail=()=>{if(referenceAudio===clip)feedback.textContent='音声を再生できませんでした。もう一度お試しください。';};
   clip.onerror=fail;clip.play().catch(fail);
 }catch(_){}
}
function nextLabel(){return position===questions.length-1?(reviewOnly?'復習を終える':mockPaper&&!immediateRetry?'提出して採点':'結果を見る'):'次の問題へ';}
function buildDailyQuestion(q){const phrases=new Map(catalog.daily_phrase_bank.map(x=>[x.id,x])),p=phrases.get(q.prompt_id);return[{kind:'choice',context:q.context,prompt:'音声にぴったりの返事は？',target:'音声を聞いて選ぼう',audioText:p.simplified,choices:q.choice_ids.map(id=>{const x=phrases.get(id);return{id,label:x.simplified,pinyin:x.pinyin}}),answerId:q.answer_id,explain:`${p.simplified} → ${phrases.get(q.answer_id).simplified} · ${phrases.get(q.answer_id).ja_meaning}`,reviewKey:'daily:'+q.id,course:'practice-daily'}]}
function loadQuestion(q){document.getElementById('pre4AnswerReading').replaceChildren();stopReference();if(window.speechSynthesis)speechSynthesis.cancel();answered=false;selected=[];document.getElementById('questionCount').textContent=`${position+1} / ${questions.length}`;document.getElementById('progressFill').style.width=`${Math.round(position/questions.length*100)}%`;const context=document.getElementById('sceneLabel'),prompt=document.getElementById('promptText'),target=document.getElementById('promptTarget'),audio=document.getElementById('listenButton'),slots=document.getElementById('answerSlots'),choices=document.getElementById('choiceGrid'),feedback=document.getElementById('feedback'),primary=document.getElementById('primaryAction'),detail=document.getElementById('answerDetail');context.textContent=q.context||'';context.hidden=!q.context;prompt.textContent=q.prompt;target.textContent=q.target||'';if(pre4Teach(q)&&q.kind!=='dictation'&&q.kind!=='order')target.innerHTML=py.target(q.target);audio.hidden=!q.audioText&&!q.audioUrl;audio.onclick=()=>listenReference(q);slots.hidden=q.kind!=='order';slots.replaceChildren();choices.replaceChildren();feedback.textContent='';feedback.className='ps-feedback';detail.textContent='';primary.disabled=true;primary.textContent=q.kind==='order'?'ことばを選んでね':(reviewOnly?'答え合わせ': '答えを選んでね');primary.onclick=()=>{if(q.kind==='order'&&!answered){checkOrder(q);return}if(!answered){return}advance()};
 if(q.words&&q.kind==='order'){
   const builder=window.KP_SENTENCE_TILES({words:q.words,bank:q.tileIds.map(id=>q.answerIds.indexOf(id)),slots,choices,onChange(values){
     selected=values.map(i=>i===null?null:q.answerIds[i]);
     primary.disabled=selected.includes(null);
     primary.textContent=primary.disabled?'ことばを並べよう':'答え合わせ';
   }});
   primary.onclick=()=>{
     if(answered){advance();return;}
     if(selected.includes(null))return;
     builder.lock();answered=true;
     const swapped=[q.answerIds[1],q.answerIds[0],...q.answerIds.slice(2)];
     const ok=selected.every((id,i)=>q.answerIds[i]===id)||(q.flexible&&selected.every((id,i)=>swapped[i]===id));
     if(ok)score++;
     showAnswer(q,ok);record(q,ok,selected.map(id=>byId(id).simplified).join(''));
     primary.disabled=false;primary.textContent=position===questions.length-1?'結果を見る':'次の問題へ';
   };
 }
 else if(q.kind==='order'){for(let i=0;i<q.answerIds.length;i++){const b=document.createElement('button');b.type='button';b.className='ps-slot is-empty';b.textContent='＋';b.setAttribute('aria-label',`空欄 ${i+1}`);b.onclick=()=>{if(answered)return;const ix=Number(b.dataset.selectedIndex);if(Number.isInteger(ix)){selected.splice(ix,1);drawOrder(q)}};slots.append(b)}drawOrder(q);}
 else if(q.kind==='dictation')loadDictation(q,choices,primary);
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
 else q.choices.forEach((choice,i)=>{const b=document.createElement('button');b.type='button';b.className='ps-choice';if(choice.imageData){const img=document.createElement('img');img.src=choice.imageData;img.alt='';b.append(img)}const label=document.createElement('span');label.innerHTML=`${esc(q.choiceAudio?'選択肢 '+(i+1):choice.label)}${choice.pinyin&&(q.course!==pre4.course||pre4Teach(q))?`<small class="ps-choice-pinyin">${esc(choice.pinyin)}</small>`:''}`;if(pre4Teach(q)&&!pre4JapaneseChoices(q)&&!q.choiceAudio&&py.chinese(choice.label))label.innerHTML=py.html(choice.label);b.append(label);b.onclick=()=>{if(answered)return;b.classList.add('is-tapped');setTimeout(()=>b.classList.remove('is-tapped'),170);answered=true;const ok=choice.id===q.answerId;score+=ok?1:0;b.classList.add(mockPaper&&!immediateRetry?'is-selected':ok?'is-correct':'is-wrong');[...choices.querySelectorAll('.ps-choice')].forEach(x=>x.disabled=true);if(!ok&&(!mockPaper||immediateRetry)){const right=q.choices.find(x=>x.id===q.answerId);choices.querySelectorAll('.ps-choice')[q.choices.indexOf(right)]?.classList.add('is-correct')}if(!mockPaper||immediateRetry)showAnswer(q,ok);
 if(q.course===pre4.course&&!ok&&(!mockPaper||immediateRetry)){
   detail.textContent=`あなたの答え：${choice.label}\n${detail.textContent.split('\n').slice(0,2).join('\n')}`;
   detail.scrollIntoView({block:'nearest'});
 }
 record(q,ok,choice.label);primary.disabled=false;primary.textContent=nextLabel()};
 if(q.choiceAudio){
   const option=document.createElement('div');
   option.className='ps-pre4-audio-option';
   const play=document.createElement('button');
   play.type='button';
   play.className='ps-audio';
   play.textContent='🔊';
   play.setAttribute('aria-label',`選択肢 ${i+1} を聞く`);
   play.onclick=()=>speak(choice.label,()=>{
     if(questions[position]===q&&!answered)feedback.textContent='中国語の音声を再生できませんでした。';
   });
   option.append(b,play);
   choices.append(option);
 }else choices.append(b);
 });
 if(q.kind==='order'&&window.speechSynthesis)speechSynthesis.getVoices();if(position>0)revealQuestion();else main.scrollTop=0;
 // Question navigation is a user gesture: speak promptly, without blocking choices.
 if(q.audioText||q.audioUrl)listenReference(q);
}
function loadDictation(q,choices,primary){
 const pad=document.createElement('div');
 choices.append(pad);
 document.getElementById('promptText').textContent=q.prompt.replace('入力','手書き');
 primary.textContent='マスに手書きしよう';
 window.KP_HANDWRITE(pad,q.answerId,(ok,actual)=>{
   if(answered)return;
   answered=true;
   if(ok)score++;
   if(!mockPaper||immediateRetry)showAnswer(q,ok);
   record(q,ok,actual);
   primary.disabled=false;primary.textContent=nextLabel();primary.onclick=advance;
 });
}
function drawOrder(q){const slots=document.getElementById('answerSlots'),choices=document.getElementById('choiceGrid');slots.replaceChildren();q.answerIds.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.className='ps-slot';if(selected[i]){const token=byId(selected[i]);b.textContent=token?.simplified||'';if(pre4Teach(q))b.innerHTML=py.html(token?.simplified||'');b.dataset.selectedIndex=String(i);b.setAttribute('aria-label',`${token?.simplified||''} を取り消す`);b.onclick=()=>{if(answered)return;selected.splice(i,1);drawOrder(q)}}else{b.classList.add('is-empty');b.textContent='＋';b.setAttribute('aria-label',`空欄 ${i+1}`)}slots.append(b);if(q.punctuationAfter?.includes(i+1)){const punctuation=document.createElement('span');punctuation.className='ps-punctuation';punctuation.textContent='，';slots.append(punctuation)}if(i===q.answerIds.length-1&&/[。？！]$/.test(q.text||'')){const punctuation=document.createElement('span');punctuation.className='ps-punctuation';punctuation.textContent=q.text.slice(-1);slots.append(punctuation)}});choices.replaceChildren();q.tileIds.forEach(id=>{const token=byId(id);if(!token)return;const b=document.createElement('button');b.type='button';b.className='ps-choice ps-order-choice';b.dataset.itemId=id;b.disabled=answered||selected.includes(id);b.innerHTML=`<small>${esc(token.pinyin)}</small><b>${esc(token.simplified)}</b>`;if(pre4Teach(q))b.innerHTML=py.html(token.simplified);else if(q.course===pre4.course)b.textContent=token.simplified;b.setAttribute('aria-label',pre4Teach(q)?`${token.pinyin} ${token.simplified}`:token.simplified);b.onclick=()=>{if(answered||selected.length>=q.answerIds.length)return;selected.push(id);drawOrder(q)};choices.append(b)});document.getElementById('primaryAction').disabled=answered||selected.length!==q.answerIds.length;document.getElementById('primaryAction').textContent=answered?(reviewOnly?'復習を終える':position===questions.length-1?'結果を見る':'答え合わせ'):selected.length===q.answerIds.length?'答え合わせ':`ことばを選んでね（${selected.length}/${q.answerIds.length}）`}
function checkOrder(q){if(selected.length!==q.answerIds.length)return;answered=true;const ok=selected.every((id,i)=>id===q.answerIds[i] || (q.reviewKey?.startsWith(pre4.prefix+'station:') && byId(id)?.simplified===byId(q.answerIds[i])?.simplified));score+=ok?1:0;drawOrder(q);showAnswer(q,ok);record(q,ok,selected.map(id=>byId(id).simplified).join(""));document.getElementById('primaryAction').disabled=false;document.getElementById('primaryAction').textContent=nextLabel()}
function showAnswer(q,ok){const f=document.getElementById('feedback'),detail=document.getElementById('answerDetail');f.textContent=ok?'できた！ぴったりだよ ✨':'おしい！ここを確認しよう';f.className='ps-feedback '+(ok?'':'is-wrong');const explanation=q.explain||q.text||'';if(!ok&&q.kind==='order'){const expected=q.answerIds.map(id=>byId(id)?.simplified||'').join('');const actual=selected.map(id=>byId(id)?.simplified||'').join('');const first=selected.findIndex((id,i)=>byId(id)?.simplified!==byId(q.answerIds[i])?.simplified);detail.textContent=`あなたの答え：${actual}\n正しい順番：${expected}\n${first>=0?`${first+1}番目から語順が違います。`:'語順をもう一度確認しましょう。'}\n${explanation}`;}else if(!ok&&q.kind==='choice'){const right=q.choices.find(x=>x.id===q.answerId);detail.textContent=`正しい答え：${right?.label||''}${right?.pinyin?' · '+right.pinyin:''}\n${explanation}\n選んだ答えと、正しい意味・発音を比べてみよう。`;}else detail.textContent=explanation}
function offerMockFeedback(q,ok,actual){
 const area=document.getElementById('pre4AnswerReading');
 area.innerHTML=`<details class="ps-pre4-question-review">
   <summary>正誤・解説を見る</summary>
   <div class="ps-pre4-question-review-body"></div>
 </details>`;
 const panel=area.querySelector('details');
 panel.addEventListener('toggle',()=>{
   if(!panel.open||panel.dataset.revealed)return;
   panel.dataset.revealed='true';
   const correct=q.choices?.find(choice=>choice.id===q.answerId)?.label ?? q.answerId;
   panel.querySelector('summary').textContent='正誤・解説';
   panel.querySelector('.ps-pre4-question-review-body').innerHTML=`
     <p class="ps-pre4-verdict ${ok?'is-correct':'is-wrong'}">${ok?'○ 正解':'× 不正解'}</p>
     <p>あなたの答え：${pre4JapaneseChoices(q)?esc(actual):py.choice(actual)}<br>正解：<strong>${pre4JapaneseChoices(q)?esc(correct):py.choice(correct)}</strong></p>
     <p>${py.explanation(q.explain)}</p>${lookup.review(q)}`;
 });
}
function record(q,ok,actual){
 if(q.course===pre4.course&&(!mockPaper||immediateRetry)){
   const detail=document.getElementById('answerDetail');if(detail.textContent)detail.innerHTML=py.explanation(detail.textContent);
   document.getElementById('pre4AnswerReading').innerHTML=lookup.review(q);
 }
 if(pre4Quiz&&!ok)missed.push({...q,actual,number:position+1});
 if(mockPaper&&!immediateRetry){
   mockAnswers.push({question:q,actual,ok,number:position+1});
   offerMockFeedback(q,ok,actual);
 }
 // A retry during the same quiz leaves the scheduled review date intact.
 if(immediateRetry)return;
 const api=window.KP_ACCOUNT_API;
 if(!api?.recordPracticeAttempt)return;
 const write=api.recordPracticeAttempt(q.reviewKey,q.course,ok).catch(error=>{
   console.warn('[Koepanda] practice answer sync unavailable:',error);return false;
 });
 if(reviewLesson||pre4Quiz||pre4Review)reviewWrites.push(write);
}
function advance(){
 position++;
 if(position>=questions.length){finish(reviewOnly);return;}
 loadQuestion(questions[position]);
}
function renderMockReview(entries,fullResult){
 if(!entries.length)return '';
 const reviewRow=({question:q,actual,ok,number})=>{
   const audio=q.audioText||(q.kind==="order"&&q.text)||q.choices&&q.choiceAudio&&q.answerId;
   const choiceIndex=q.choices?.findIndex(choice=>choice.id===q.answerId);
   const correct=q.kind==='order'?q.text:q.choiceAudio?`${choiceIndex+1}：${q.answerId}`:q.answerId;
   const selected=actual===null?'未解答':q.choiceAudio?`${q.choices.findIndex(choice=>choice.label===actual)+1}：${actual}`:actual;
   return `<li value="${number}" class="ps-pre4-review-item">
     <details><summary>${number}. ${esc(q.context)} · ${actual===null?'未解答':ok?'正解':'不正解'}</summary>
       <p>${[q.prompt,q.target].filter(Boolean).map(esc).join(' · ')}</p>
       <p>あなたの答え：${pre4JapaneseChoices(q)?esc(selected):py.choice(selected)}<br>正解：<strong>${pre4JapaneseChoices(q)?esc(correct):py.choice(correct)}</strong></p>
       <p>${py.explanation(q.explain)}</p>
       ${lookup.review(q)}
       ${audio?`<button class="pre4-button" type="button" data-pre4-review-audio="${esc(audio)}">
         ${q.choiceAudio?'正解の音声を聞く':'問題の音声を聞く'}</button><p role="status"></p>`:''}
     </details></li>`;
 };
 const section=(name,items)=>items.length?
   `<section><h3>${name}</h3><ol>${items.map(reviewRow).join('')}</ol></section>`:'';
 return `<details class="ps-pre4-corrections"><summary>${fullResult?'全問の答えと解説':'まちがいの解説'}（${entries.length}問）</summary>
   ${fullResult?section('聞き取り',entries.filter(({question})=>question.section==='listen'))+
     section('筆記',entries.filter(({question})=>question.section==='written')):section('まちがえた問題',entries)}
   </details>`;
}
function finishPre4Quiz(){
 stopReference();
 window.clearInterval(mockClock);
 document.querySelector('.ps-mock-clock')?.remove();
 quizDock.remove();
 window.speechSynthesis?.cancel();
 document.getElementById('questionCount').textContent='';
 main.scrollTop=0;
 const pending=missed.splice(0);
 const fullResult=mockPaper&&!immediateRetry;
 const points=section=>mockAnswers.reduce((sum,{question,ok})=>
   sum+(ok&&question.section===section?question.points:0),0);
 const listen=points('listen'), written=points('written');
 const unanswered = fullResult ? questions.slice(mockAnswers.length).map((question,index)=>({
   question, actual:null, number:mockAnswers.length+index+1, ok:false
 })) : [];
 const entries=fullResult?[...mockAnswers,...unanswered]:pending.map(question=>({
   question, actual:question.actual, number:question.number, ok:false
 }));
 const corrections=renderMockReview(entries,fullResult);
 main.innerHTML=`<section class="ps-finish-card"><img src="./assets/hanzi/teacher-speaking.webp" alt="">
   <h2>${immediateRetry?'解き直しの結果':mockTimedOut?'時間になりました':'テストの結果'}</h2>
   <span class="ps-score">${fullResult?`${listen+written} / 100`:`${score} / ${questions.length}`}</span>
   ${fullResult?`<p>聞き取り ${listen} / 50 · 筆記 ${written} / 50<br>練習の目安：60点 / 100点</p>`:''}
   <p>${pending.length?`まちがえた問題 ${pending.length}問`:unanswered.length?(mockAnswers.length?'解答した問題はすべて正解です。':'解答なし'):'全問正解！'}</p>
   ${unanswered.length?`<p>未解答 ${unanswered.length}問</p>`:''}
   ${corrections}<p role="status" id="pre4SaveStatus"></p>
   ${pending.length?'<button type="button" id="pre4Retry" class="ps-primary ps-return">まちがえた問題を解き直す</button>':''}
   <a class="ps-secondary ps-return" href="./practice-session.html?reviewLesson=pre4">準4級のまちがいレッスンへ</a>
   <a class="ps-secondary ps-return" href="${backHref()}">${params.get('from')==='past'?'過去問に戻る':unitId==='exam'||unitId==='mock'?'テスト一覧に戻る':'レッスンに戻る'}</a></section>`;
 for(const button of main.querySelectorAll('[data-pre4-review-audio]')){
   button.onclick=()=>{
     const status=button.nextElementSibling;
     status.textContent='';
     speak(button.dataset.pre4ReviewAudio,()=>{status.textContent='音声を再生できませんでした。';});
   };
 }
 if(!immediateRetry&&pending.length){
   const status=document.getElementById('pre4SaveStatus');
   status.textContent='復習の記録を確認しています…';
   Promise.all(reviewWrites).then(results=>{
     status.textContent=results.length===questions.length&&results.every(Boolean)?
       'まちがえた問題は、学習の記録から復習できます。':
       '復習記録を確認できませんでした。この画面で解き直せます。';
   });
 }
 const retry=document.getElementById('pre4Retry');
 if(retry)retry.onclick=()=>{
   immediateRetry=true;
   mockTimedOut=false;
   questions=pending.map(q=>({...q,choices:q.choices&&shuffle(q.choices),tileIds:q.tileIds&&shuffle(q.tileIds)}));
   position=0;
   score=0;
   main.innerHTML=quizMarkup;
   document.body.append(quizDock);
   loadQuestion(questions[0]);
 };
}
function finish(isReview){stopReference();
 if(pre4Quiz){finishPre4Quiz();return;}
 if(reviewLesson||pre4Review){
   document.querySelector('.ps-action-dock')?.remove();
   if(window.speechSynthesis)speechSynthesis.cancel();
   main.scrollTop=0;document.getElementById('questionCount').textContent='';
   document.getElementById('progressFill').style.width='100%';
   main.innerHTML=`<section class="ps-finish-card"><h2>復習の結果</h2><p>確認できた問題 ${score}問 · まちがえた問題 ${questions.length-score}問</p><p role="status" id="reviewSaveStatus">復習を記録しています…</p><a class="ps-primary ps-return" href="${backHref()}">${pre4Review?'準4級のルートに戻る':'学習の記録に戻る'}</a></section>`;
   Promise.all(reviewWrites).then(results=>{
     const status=document.getElementById('reviewSaveStatus');
     if(status)status.textContent=results.length===questions.length&&results.every(Boolean)?'復習を記録しました。':'一部の復習を保存できませんでした。';
   });
   return;
 }document.querySelector('.ps-action-dock')?.remove();main.scrollTop=0;const completion=window.KP_ACCOUNT_API?.recordLearningCompletion?.('practice',unitId||activityId||reviewKey);if(window.speechSynthesis)speechSynthesis.cancel();window.scrollTo(0,0);document.getElementById('questionCount').textContent='';document.getElementById('progressFill').style.width='100%';main.innerHTML=`<section class="ps-finish-card"><img src="./assets/hanzi/teacher-speaking.webp" alt="小音"><h2>🎉 ${isReview?'復習できたね！':'チャレンジ完了！'}</h2><span class="ps-score">${isReview?'✓':`${score} / ${questions.length}`}</span><p>🏅 今日のチャレンジ達成！<br>学習日は記録され、まちがえた問題は復習ノートからやり直せます。</p><p id="ps-record-status" role="status">学習記録を更新しています…</p><a class="ps-primary ps-return" href="${backHref()}">次の学習へ</a><a class="ps-secondary ps-return" href="./index.html?open=practice">復習・練習ひろばへ</a></section>`;Promise.resolve(completion).then(saved=>{const status=document.getElementById('ps-record-status');if(status)status.textContent=saved?'✓ 学習記録を保存しました。':'✓ この端末に学習日を記録しました。ログインすると学習履歴も同期できます。'}).catch(()=>{const status=document.getElementById('ps-record-status');if(status)status.textContent='学習日を記録しました。オンライン同期はあとで確認してください。'})}
async function start(){
 if(pre4Quiz && mode==='lesson'){
   if(!window.KP_PRE4_STATIONS[unitId]?.[lesson-1]){
     location.replace(backHref());
     return;
   }
   params.set('mode','station');
   location.replace('./practice-session.html?'+params.toString());
   return;
 }
 document.getElementById('routeBack').href=backHref();try{const b=await fetch('./data/practice-catalog-0.1.json?v=301.256');if(!b.ok)throw Error('練習データを読み込めません');catalog=await b.json();if(!reviewLesson&&(track==='scenario'||reviewKey.startsWith('dialogue:'))){await window.KoepandaScenarioDialogue.start({main,catalog,activityId,reviewKey,backHref:backHref()});return}if(!reviewLesson&&(track==='daily'||reviewKey.startsWith('daily:'))){await window.KoepandaDailyPhrase.start({main,catalog,activityId,reviewKey,backHref:backHref()});return}prepareQuestionLayout();const a=await fetch('./data/pre4-content-package-0.1.json');if(!a.ok)throw Error('練習データを読み込めません');courseData=await a.json();if(pre4Quiz||pre4Review)courseData=await pre4.extend(courseData);courseData.vocabulary_entries.forEach(e=>entriesById.set(e.entry_id,e));(catalog.support_tokens||[]).forEach(e=>entriesById.set(e.id,e));catalog.daily_phrase_bank.forEach(e=>entriesById.set(e.id,e));if(reviewLesson)questions=await buildReviewLesson();else if(reviewKey)questions=buildReview(reviewKey);else if(pre4Quiz)questions=pre4.build(courseData,unitId,lesson,mode,shuffle);else if(track==='chapter')questions=buildChapter();else if(track==='theme')questions=buildTheme();else if(track==='daily')questions=buildDaily();else if(track==='scenario')questions=buildScenario();if(!questions.length)throw Error('このルートには問題がありません');document.title=document.getElementById('practiceTopTitle').textContent+' | KoePanda';document.getElementById('sessionTitle').textContent=reviewOnly?'もういちどチャレンジ':pageTitles[track]||'練習';if(pre4Quiz){quizMarkup=main.innerHTML;quizDock=document.querySelector('.ps-action-dock');}loadQuestion(questions[0]);if(mockPaper)startMockClock();}catch(e){const locked=String(e.message).startsWith('unlock:');document.querySelector('.ps-action-dock')?.remove();main.innerHTML=`<div class="ps-error"><b>${locked?'この章はまだ開いていません':'練習を開けませんでした'}</b><p>${locked?'学習ルートで前の章を学んでから、もう一度開いてください。':esc(e.message||'データを読み込めませんでした。')}</p><a class="ps-secondary ps-return" href="${backHref()}">${pre4Review||pre4Quiz?'準4級へ戻る':reviewLesson?'学習の記録に戻る':'ルートに戻る'}</a></div>`}}
window.addEventListener('pagehide',()=>{stopReference();if(window.speechSynthesis)speechSynthesis.cancel()});
start();
})();
