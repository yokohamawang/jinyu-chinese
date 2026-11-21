/* 301.353 — lesson quiz: listening, pinyin input, stroke order and real handwriting.
   Uses the existing handwriting canvas; does not implement a second handwriting recognizer. */
(()=>{
 'use strict';
 const popup=document.createElement('section');popup.id='kp351Test';popup.className='kp351-test';popup.hidden=true;
 popup.setAttribute('role','dialog');popup.setAttribute('aria-modal','true');popup.setAttribute('aria-label','漢字のミニテスト');
 popup.innerHTML='<div class="kp351-test-card"><header><div><small id="kp353TestLesson">今日の漢字</small><h2>ミニテスト</h2></div><button type="button" id="kp351Close" aria-label="テストを閉じる">×</button></header><div id="kp351TestBody" class="kp351-test-body" aria-live="polite"></div></div>';
 document.body.append(popup);
 const body=popup.querySelector('#kp351TestBody'),subtitle=popup.querySelector('#kp353TestLesson');
 let feedbackOverlay=null,entries=[],questions=[],index=0,score=0,errors=[],corrects=[],locked=false,awaitingWriting=false,writingMistake=false,writingWrongStroke=0,lessonId='',reviewOnly=false,reviewRows=[],saving=false,previewOnly=false;
 const shuffle=arr=>{const result=arr.slice();for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result};
 const add=(tag,cls,text,parent=body)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;parent.append(n);return n};
 const button=(label,fn,cls='')=>{const n=add('button','kp351-action '+cls,label);n.type='button';n.onclick=fn;return n};
 const answerKey=q=>q.type==='pinyin'?q.item.pinyin:q.type==='stroke'?String(q.stroke+1):q.item.char;
 const normalize=value=>{
   // Accept both tone marks (nǐ) and numbered Hanyu pinyin (ni3).
   const raw=String(value||'').trim().normalize('NFC').toLowerCase().replace(/\s+/g,'');
   return raw.replace(/([a-züv]+)([1-5])/g,(_,word,tone)=>{
     word=word.replace(/v/g,'ü');const n=Number(tone);if(n===5)return word;
     const chars=[...word];let at=chars.indexOf('a');if(at<0)at=chars.indexOf('e');
     if(at<0&&word.includes('ou'))at=chars.indexOf('o');
     if(at<0){for(let i=chars.length-1;i>=0;i--)if('aeiouü'.includes(chars[i])){at=i;break}}
     if(at<0)return word;
     const vowels={a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù','ü':'ǖǘǚǜ'};
     chars[at]=vowels[chars[at]][n-1];return chars.join('');
   });
 };
 const allRows=()=>entries.map(e=>e.char);
 const play=char=>{try{if(typeof playHanziSystemVoice==='function')playHanziSystemVoice(char);else if(typeof playHanziRecognitionCharacter==='function')playHanziRecognitionCharacter(char)}catch(_){}};
 popup.querySelector('#kp351Close').onclick=()=>{if(!saving){popup.hidden=true;awaitingWriting=false}};
 function makeQuestions(){
   // A six-question lesson assessment with all four required question families.
   const order=shuffle(entries);
   const pick=i=>order[i%order.length];
   questions=[{type:'listen',item:pick(0)},{type:'pinyin',item:pick(1)},
     {type:'stroke',item:pick(2)},{type:'writing',item:pick(0)},
     {type:'listen',item:pick(1)},{type:'pinyin',item:pick(2)}];
   if(lessonId===window.KP_HANZI_SCOPE?.unitId&&entries.length>3){
     questions=shuffle(entries).slice(0,10).map((item,i)=>({item,type:['listen','pinyin','stroke','writing'][i%4]}));
   }
   if(reviewOnly){
     const allowed=new Set(['listen','pinyin','stroke','writing']);
     questions=reviewRows.filter(row=>allowed.has(row.type)).map(row=>({type:row.type,item:entries.find(e=>e.char===row.char)})).filter(q=>q.item);
     if(!questions.length)questions=[{type:'listen',item:pick(0)}];
   }
   questions.forEach(q=>{if(q.type==='stroke')q.stroke=Math.floor(Math.random()*q.item.strokes.length)});
   index=0;score=0;errors=[];corrects=[];locked=false;awaitingWriting=false;writingMistake=false;
 }
 async function getProgress(){
   const client=await window.KP_ACCOUNT_API?.getClient?.();const auth=client?(await client.auth.getUser()).data:null;
   if(!auth?.user)return null;
   const unitId=window.KP_HANZI_SCOPE?.unitId||'pre4-u01';
   const {data,error}=await client.from('course_progress').select('status,completed_at,review_checks').eq('user_id',auth.user.id).eq('course_id','hanzi-pre4-course').eq('unit_id',unitId).maybeSingle();
   if(error)throw error;return {client,user:auth.user,unitId,data};
 }
 // Keep mistake history (attempt count, last wrong answer and correction status).
 // A correct later answer marks a record reviewed, but never erases the mistake.
 const passingScore=()=>lessonId===window.KP_HANZI_SCOPE?.unitId?8:5;
 function canCompleteAfterReview(checks){
   const fullTotal=passingScore()===8?10:6;
   const records=checks['mistakes:'+lessonId]||[];
   return !checks['unitTest:'+lessonId]?.passed_at&&records.length>0&&records.every(row=>row.reviewed_at)&&
     (checks['testHistory:'+lessonId]||[]).some(a=>a.total===fullTotal&&a.review!==true);
 }
 function updateAttempt(checks){
   const key='mistakes:'+lessonId,historyKey='testHistory:'+lessonId;
   const records=Array.isArray(checks[key])?checks[key].map(row=>({...row})):[];
   const history=checks[historyKey]||[],now=new Date().toISOString();
   errors.forEach(err=>{
     let row=records.find(r=>r.char===err.char&&r.type===err.type);
     if(!row){row={char:err.char,type:err.type,first_at:now,attempts:0};records.push(row)}
     row.attempts++;row.last_at=now;row.wrong=err.wrong;row.correct=err.correct;row.reviewed_at=null;
   });
   corrects.forEach(item=>{
     const row=records.find(r=>r.char===item.char&&r.type===item.type);
     if(row&&!errors.some(err=>err.char===item.char&&err.type===item.type))row.reviewed_at=now;
   });
   checks[key]=records;
   checks[historyKey]=[...history,{date:now,score,total:questions.length,review:reviewOnly,
     errors:errors.map(err=>({char:err.char,type:err.type}))}].slice(-25);
   return reviewOnly&&errors.length===0&&corrects.length>0&&canCompleteAfterReview(checks);
 }
 async function recordAttempt(){
   if(previewOnly)return {correctedPass:false};
   const account=await getProgress();
   if(!account){
     const unit=window.KP_HANZI_SCOPE?.unitId||'pre4-u01';
     let correctedPass=false;
     window.KP_HANZI_GUEST?.update(unit,checks=>{correctedPass=updateAttempt(checks)});
     return {correctedPass};
   }
   const {client,user,unitId,data}=account,checks={...(data?.review_checks||{})};
   const correctedPass=updateAttempt(checks);
   const now=new Date().toISOString();
   const payload={user_id:user.id,course_id:'hanzi-pre4-course',unit_id:unitId,status:data?.status||'started',review_checks:checks,last_visited_at:now,updated_at:now};
   if(data?.completed_at)payload.completed_at=data.completed_at;
   const {error}=await client.from('course_progress').upsert(payload,{onConflict:'user_id,course_id,unit_id'});
   if(error)throw error;
   return {correctedPass};
 }
 function intro(){
   body.replaceChildren();add('div','kp351-mascot','🐼');add('h3','kp351-title','今日の漢字、覚えたかな？');
   add('p','kp351-description',reviewOnly?'以前まちがえた問題を復習しよう。':('聞く・ピンイン・筆順・書く の'+(lessonId===window.KP_HANZI_SCOPE?.unitId?'10問。8問':'6問。5問')+'正解でクリア！'));
   add('p','kp351-description','まちがえても大丈夫。答えを確認して、もう一度挑戦しよう。');
   button('テストを始める',()=>{makeQuestions();renderQuestion()},'primary');
   const note=add('p','kp351-description','まちがえた問題は復習記録に残ります。');note.style.fontSize='12px';
 }
 function resolve(q,value,correct){
   if(locked)return;locked=true;
   if(correct){score++;corrects.push({char:q.item.char,type:q.type})}
   else errors.push({char:q.item.char,type:q.type,wrong:String(value),correct:answerKey(q)});
   const message=correct?'○ 正解！ よくできました。':q.type==='writing'
     ?('× '+String(value)+'。その筆画の始点・方向を確認して、もう一度練習しよう。')
     :('× 「'+q.item.char+'」は「'+q.item.pinyin+'」。正解：'+answerKey(q));
   showAnswerFeedback(q,value,correct,message);
 
 }
 function showAnswerFeedback(q,value,correct,message){
   // Separate feedback layer: avoids pushing the question, input and next action offscreen.
   const overlay=document.createElement('div');overlay.id='kp361AnswerOverlay';overlay.className='kp361-answer-overlay';
   overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');body.append(overlay);feedbackOverlay=overlay;
   const inner=document.createElement('section');inner.className='kp361-answer-card';overlay.append(inner);
   const head=document.createElement('h3');head.className=correct?'kp361-correct':'kp361-incorrect';head.textContent=correct?'○ 正解！':'× おしい！';inner.append(head);
   const summary=document.createElement('p');summary.className='kp361-answer-summary';summary.textContent=message.replace(/^[○×]\\s*/, '');inner.append(summary);
   if(!correct){
     const given=document.createElement('p');given.className='kp361-answer-detail';given.textContent='あなたの答え：'+String(value);inner.append(given);
     const expected=document.createElement('p');expected.className='kp361-answer-detail';expected.textContent='正解：'+answerKey(q)+(q.type==='pinyin'?'':('（'+q.item.pinyin+'）'));inner.append(expected);
   }
   const next=document.createElement('button');next.type='button';next.className='kp351-action primary';
   next.textContent=index===questions.length-1?'結果を見る':'次の問題へ';
   next.onclick=()=>{overlay.hidden=true;if(index===questions.length-1)result();else{index++;renderQuestion()}};
   inner.append(next);next.focus({preventScroll:true});
 }
 function hideAnswerFeedback(){if(feedbackOverlay)feedbackOverlay.hidden=true;feedbackOverlay=null}
 function choices(options,correct,q){
   const grid=add('div','kp351-options');
   options.forEach(value=>{
     const n=add('button','',value,grid);n.type='button';n.onclick=()=>{
       if(locked)return;grid.querySelectorAll('button').forEach(b=>{b.disabled=true;if(normalize(b.textContent)===normalize(correct))b.classList.add('is-correct')});
       if(normalize(value)!==normalize(correct))n.classList.add('is-wrong');
       resolve(q,value,normalize(value)===normalize(correct));
     };
   });
 }
 function renderQuestion(){
   hideAnswerFeedback();locked=false;awaitingWriting=false;body.replaceChildren();const q=questions[index];
   add('div','kp351-counter',(index+1)+' / '+questions.length+'問');
   const line=add('div','kp351-bar');add('span','',undefined,line).style.width=((index+1)/questions.length*100)+'%';
   const labels={listen:'音を聞いて、漢字を選ぼう',pinyin:'この字のピンインを書こう',stroke:'色のついた線は何画目？',writing:'いつもの書き方で、最後まで書こう'};
   add('h3','kp351-question',labels[q.type]);
   const display=add('div','kp351-stimulus');
   if(q.type==='listen'){
     const audio=add('button','kp351-audio','🔊',display);audio.type='button';audio.setAttribute('aria-label','発音を聞く');audio.onclick=()=>play(q.item.char);
     const others=shuffle(entries.filter(x=>x.char!==q.item.char)).map(x=>x.char);
     choices(shuffle([q.item.char,...others].slice(0,3)),q.item.char,q);
     play(q.item.char);
   }else if(q.type==='pinyin'){
     add('strong','',q.item.char,display);
     const input=add('input','kp353-pinyin-input');input.type='text';input.autocapitalize='off';input.autocomplete='off';input.spellcheck=false;
     input.placeholder='例：ma3 または mǎ';input.setAttribute('aria-label','ピンインを入力');
     add('p','kp351-description','声調は数字でも入力できます。例：ma3');
     button('答え合わせ',()=>{if(!input.value.trim())return;input.disabled=true;resolve(q,input.value,normalize(input.value)===normalize(q.item.pinyin))},'primary');
   }else if(q.type==='stroke'){
     const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 1024 1024');svg.setAttribute('class','kp353-stroke-quiz');
     // Match the learning-page SVG coordinate system. Source stroke paths use Y-up coordinates.
     const glyph=document.createElementNS('http://www.w3.org/2000/svg','g');
     glyph.setAttribute('transform','scale(1,-1) translate(0,-900)');
     q.item.strokes.forEach((path,i)=>{const shape=document.createElementNS('http://www.w3.org/2000/svg','path');shape.setAttribute('d',path);shape.setAttribute('fill',i===q.stroke?'#14957b':'#d4dcd6');glyph.append(shape)});
     svg.append(glyph);display.append(svg);
     const indexes=Array.from({length:q.item.strokes.length},(_,i)=>String(i+1));
     choices(shuffle([String(q.stroke+1),...shuffle(indexes.filter(x=>x!==String(q.stroke+1))).slice(0,3)]),String(q.stroke+1),q);
   }else{
     add('strong','',q.item.char,display);
     add('p','kp351-description','下のボタンから、いつもの手書き画面で書いてね。');
     button('手書きで答える',()=>{
       if(locked)return;awaitingWriting=true;writingMistake=false;writingWrongStroke=0;popup.hidden=true;
       window.dispatchEvent(new CustomEvent('kp-hanzi-test-writing-start',{detail:{char:q.item.char,lessonId}}));
     },'primary');
   }
 }
 window.addEventListener('kp-hanzi-test-writing-error',event=>{if(awaitingWriting){writingMistake=true;writingWrongStroke=Number(event.detail?.stroke)||0}});
 window.addEventListener('kp-hanzi-test-writing-complete',event=>{
   if(!awaitingWriting||!questions[index]||event.detail?.char!==questions[index].item.char)return;
   awaitingWriting=false;popup.hidden=false;body.replaceChildren();
   add('h3','kp351-question',writingMistake?'最後まで書けたね。まちがえた筆画も復習しよう。':'最後まで書けたね！');
   resolve(questions[index],writingMistake?(writingWrongStroke?('第'+writingWrongStroke+'画で修正'):'筆画の修正あり'):'完了',!writingMistake);
 });
 window.addEventListener('kp-hanzi-test-writing-cancel',()=>{if(awaitingWriting){awaitingWriting=false;popup.hidden=false;renderQuestion()}});
 function confirmPass(score,total){
   button('合格を記録してごほうびへ',()=>{
     if(popup.hidden)return;
     popup.hidden=true;
     window.dispatchEvent(new CustomEvent('kp-hanzi-unit-test-passed',{detail:{score,total,lessonId}}));
   },'primary');
 }
 async function recoverCorrectedTest(){
   saving=true;
   body.replaceChildren();add('h3','kp351-title','訂正した記録を確認しています…');
   try{
     const account=await getProgress();
     const checks=account?account.data?.review_checks:window.KP_HANZI_GUEST?.checks(window.KP_HANZI_SCOPE?.unitId);
     body.replaceChildren();
     if(canCompleteAfterReview(checks||{})){
       add('h3','kp351-title','訂正が終わりました');
       confirmPass(6,6);
     }else add('h3','kp351-title','訂正の記録を確認できませんでした');
   }catch(error){
     body.replaceChildren();add('h3','kp351-title','記録を読み込めませんでした');
     button('もう一度確認する',recoverCorrectedTest,'primary');
   }finally{
     saving=false;button('戻る',()=>{popup.hidden=true});
   }
 }
 async function result(){
   if(saving)return;saving=true;body.replaceChildren();add('h3','kp351-title','学習記録を保存しています…');
   let saved=null;try{saved=await recordAttempt()}catch(error){console.warn('[Koepanda] mistakes save failed',error)}
   saving=false;
   if(!saved){body.replaceChildren();add('h3','kp351-title','記録を保存できませんでした');add('p','kp351-description','ログインと通信を確認して、もう一度保存しよう。');button('保存を再試行',result,'primary');return}
   const passed=reviewOnly?saved.correctedPass:score>=passingScore();
   body.replaceChildren();add('div','kp351-mascot',passed?'🎉':'🌱');
   const title=previewOnly?'テストモードの結果':passed?'合格！ レッスンクリア！':
     reviewOnly?(errors.length?'もう一度、まちがいを確認しよう':'復習ができました'):'あと少し！ 復習してみよう';
   add('h3','kp351-title',title);
   add('div','kp351-score',score+' / '+questions.length+'問 正解');
   if(errors.length){
     if(!previewOnly)add('p','kp351-description','まちがえた問題は復習ノートに記録しました。');
     const review=add('div','kp351-review');errors.forEach(e=>add('span','',e.char+' · '+e.type+' · '+e.correct,review));
   }
   if(passed&&!previewOnly){
     const total=reviewOnly?(passingScore()===8?10:6):questions.length;
     confirmPass(reviewOnly?total:score,total);
   }
   else if(reviewOnly||previewOnly)button('戻る',()=>{popup.hidden=true},'primary');
   else{button('もう一度チャレンジ',()=>{makeQuestions();renderQuestion()},'primary');button('学習に戻る',()=>{popup.hidden=true})}

 }
 window.KP_HANZI_UNIT_TEST={
   open(chars,options={}){
     if(saving||!Array.isArray(chars)||chars.length<3)return;
     lessonId=options.lessonId||'pre4-u01';
     entries=chars.map(char=>{const source=HANZI_LESSONS.find(x=>x.char===char);return source?{char,pinyin:source.pinyin,strokes:source.strokes}:null}).filter(Boolean);
     if(entries.length!==chars.length||entries.some(e=>!e.pinyin||!Array.isArray(e.strokes)||!e.strokes.length))return;
     hideAnswerFeedback();subtitle.textContent=options.lessonTitle||'今日の漢字';previewOnly=!!options.previewOnly;reviewOnly=!!options.reviewOnly;reviewRows=options.reviewRows||[];popup.hidden=false;
     if(options.resumeCorrected&&reviewOnly&&!previewOnly)void recoverCorrectedTest();else intro();
   },close(){popup.hidden=true;awaitingWriting=false},isWriting:()=>awaitingWriting,isOpen:()=>!popup.hidden||awaitingWriting
 };
})();
