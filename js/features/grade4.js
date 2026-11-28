'use strict';
const main=document.querySelector('main');
const back=document.querySelector('.pr-back');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function mapHeader(title, description, icon) {
    return `<header class="pre4-map-heading">
      <div><h1>${escape(title)}</h1><p>${escape(description)}</p></div>
      ${icon ? `<span class="pre4-map-heading-icon" aria-hidden="true">${icon}</span>` :
        '<img src="./assets/hanzi/teacher-avatar.webp" alt="" width="92" height="92">'}
    </header>`;
  }

  function landmark({href, anchor, palette, icon, title, note, topic}, index) {
    return `<li${anchor ? ` id="${escape(anchor)}"` : ''} data-landscape="${palette}" style="--trail-row:${Math.floor(index/2)+1}">
      <a class="pre4-landmark" href="${href}">
        <span class="pre4-landmark-pin" aria-hidden="true">${icon}</span>
        <span class="pre4-landmark-label">
          <strong>${escape(title)}</strong>
          ${topic ? `<span>${escape(topic)}</span>` : ''}
          ${note ? `<small>${escape(note)}</small>` : ''}
        </span>
      </a>
    </li>`;
  }

  function trailMap(level, label, stops) {
    return `<section class="pre4-trail pre4-trail--${level}" aria-label="${escape(label)}">
      <canvas class="pre4-trail-path" aria-hidden="true"></canvas>
      <ol class="pre4-trail-stops" role="list">${stops.map(landmark).join('')}</ol>
    </section>`;
  }

  function drawTrail() {
    const canvas = main.querySelector('.pre4-trail-path');
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const pins = [...main.querySelectorAll('.pre4-landmark-pin')];
    const paint = () => {
      const {x,y,width,height} = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio,0,0,ratio,0,0);
      const points = pins.map(pin => {
        const rect = pin.getBoundingClientRect();
        return [rect.x-x+rect.width/2, rect.y-y+rect.height/2];
      });
      context.beginPath();
      points.forEach(([x2,y2], index) => {
        if (!index) { context.moveTo(x2,y2); return; }
        const [x1,y1] = points[index-1];
        if (Math.abs(y2-y1) < 22) {
          const rise = Math.min(27,Math.abs(x2-x1)*.14);
          context.bezierCurveTo(x1+(x2-x1)*.30,y1-rise,x2-(x2-x1)*.30,y2+rise,x2,y2);
        } else {
          const bend = Math.min(30,width*.065) * (x1 > width/2 ? 1 : -1);
          context.bezierCurveTo(x1+bend,y1+(y2-y1)*.25,x2+bend,y2-(y2-y1)*.25,x2,y2);
        }
      });
      context.lineCap = 'round';
      context.strokeStyle = '#dfc793';
      context.lineWidth = 14;
      context.stroke();
      context.strokeStyle = '#fff3d6';
      context.lineWidth = 9;
      context.stroke();
      context.strokeStyle = '#c39e62';
      context.lineWidth = 1.5;
      context.setLineDash([2,7]);
      context.stroke();
    };
    paint();
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(paint);
      observer.observe(canvas.parentElement);
      window.addEventListener('pagehide', () => observer.disconnect(), {once:true});
      window.addEventListener('pageshow', event => {
        if (event.persisted) observer.observe(canvas.parentElement);
      });
    } else window.addEventListener('resize', paint);
  }

const stages=['人と出会う','毎日のくらし','ことばの森','買い物と食事','場所とお出かけ','気持ちとお願い'];
const icons=['🏡','🌤️','🌳','🧺','🚋','🌷'];
const palettes=['hello','daily','grammar','town','out','talk'];
const params=new URLSearchParams(location.search);
const indexParam=(name,max)=>/^\d+$/.test(params.get(name)||'') && Number(params.get(name))<max ? Number(params.get(name)) : -1;
const lesson=indexParam('lesson',lessons.length);
const stage=lesson>=0 ? Math.floor(lesson/4) : indexParam('stage',6);
const dictionary=window.KP_PRE4_LOOKUP.words();
Object.entries(baseGlosses).forEach(([w,g])=>dictionary.set(w,g));
lessons.forEach(([,word,reading,meaning])=>dictionary.set(word,[reading,meaning]));
window.KP_PRE4_LOOKUP.mount(main,()=>dictionary);
const line=(zh,ja)=>'<div><p class="pre4-lookup-sentence g4-cn" lang="zh-Hans">'+escape(zh)+'</p><p class="jp">'+escape(ja)+'</p></div>';
const card=body=>'<section class="g4-card">'+body+'</section>';
const link=(url,title)=>'<a class="g4-go" href="'+url+'">'+title+'</a>';
function show(body){window.KP_TEACHER_SPEECH?.stop();window.speechSynthesis?.cancel();main.innerHTML=body;main.classList.add('pre4-journey');main.removeAttribute('aria-busy');window.scrollTo(0,0);}
function button(title,action,primary=false){return '<button type="button" data-act="'+action+'" class="'+(primary?'primary':'')+'">'+escape(title)+'</button>';}
function speak(text){if(!window.speechSynthesis){return false;}window.KP_TEACHER_SPEECH?.stop();speechSynthesis.cancel();window.KP_AUDIO_SESSION?.preparePlayback();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='zh-CN';utterance.rate=.9;(window.KP_TEACHER_SPEECH?.bind(utterance),speechSynthesis.speak(utterance));return true;}
window.addEventListener('pagehide',()=>window.speechSynthesis?.cancel());
function map(){
 const world=stage<0;
 const stops=(world?stages:lessons.slice(stage*4,stage*4+4).map(row=>row[0])).map((title,i)=>({
   href:world?'?stage='+i:'?lesson='+(stage*4+i),icon:world?icons[i]:['🌱','🍃','🌼','🍀'][i],
   palette:palettes[world?i:stage],title,note:world?'4つの小さな旅':lessons[stage*4+i][1]
 }));
 back.href=world?'./index.html?open=learn':'./grade4.html';
 show(mapHeader(world?'4級のぼうけん':stages[stage],world?'今日のテーマを選ぼう':'気になる場面から始めよう',world?'':icons[stage])+trailMap(world?'world':'lessons','学習ルート',stops)+
 (world?'':'<nav class="pre4-journey-links"><a href="?challenge='+stage+'">章末チャレンジ · '+stories[stage][0]+'</a></nav>')+'<nav class="pre4-journey-links"><a href="?review=1">まちがえた問題を復習</a></nav>');drawTrail();
}
function study(){
 const [title,word,py,meaning,a,ja,b,jb,,,,,tip]=lessons[lesson];
 back.href='?stage='+stage;
 show(mapHeader(title,'会話を聞いて、気になることばをタップ',icons[stage])+card(button('▶ 会話を聞く','audio')+line(a,ja)+line(b,jb)+'<hr><section id="wordCard"><h2>'+word+' <small>'+py+'</small></h2><p>'+meaning+'</p></section><p>'+tip+'</p>'+button('▶ '+word+'を聞く','word')+button('練習へ','start',true)));
}
const types=['読解','ピンイン','語の意味','漢字を書く','聞き取り','日本語から中国語へ'];
types.push('まとまりのある読解','まとまりのある聴解','別の場面で使う','一文を組み立てる');
const challenge=indexParam('challenge',6);
const key=(i,t)=>'grade4:'+i+':'+t;
const getKey=k=>/^grade4:(\d+):([0-9])$/.test(k)&&lessons[Number(k.split(':')[1])];
const missed=new Set();
let queue=[],position=0,score=0,answered=false,reviewing=false;
const mix=items=>{const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function exercise(k){
 const [,ix,tx]=k.split(':');const i=Number(ix),t=Number(tx);
 const [title,w,p,m,a,ja,b,jb,prompt,yes,no,other,tip]=lessons[i];
 if(t===9){const [prompt,...words]=sentenceOrder[i];return {prompt,words,tip,solution:words.join('')};}
 if(t===8){const [sentence,yes,no,other,tip]=transfer[i];return {prompt:'空欄に合うことばは？',body:line(sentence,''),choices:[yes,no,other],tip};}
 if(t>=6){
   const story=stories[Math.floor(i/4)],at=t===6?2:7;
   return {prompt:story[at],body:t===6?line(story[1],''):'',audio:t===7?story[1]:null,choices:story.slice(at+1,at+4),tip:story[at+4],transcript:story[1]};
 }
 const peers=[lessons[(i+1)%24],lessons[(i+7)%24]];
 if(t===0)return {prompt,body:'<div class="g4-reading"><small>会話を読もう · ことばをタップすると意味が見られます</small>'+line(a,'')+line(b,'')+'</div><h3>答えをひとつ選ぼう</h3>',choices:[yes,no,other],tip};
 if(t===1||t===2){const col=t===1?2:3;return {prompt:t===1?'このことばの読み方は？':'このことばの意味は？',body:line(w,''),choices:[lessons[i][col],...(t===1?toneChoices[i]:peers.map(r=>r[col]))],tip:w+'（'+p+'）＝ '+m+'。'+tip};}
 if(t===3)return {prompt:'簡体字で書いてみよう',body:'<p>'+p+' ／ '+m+'</p>',word:w,tip:w+'（'+p+'）＝ '+m};
 if(t===4)return {prompt:'音声に合う日本語を選ぼう',audio:b,choices:[jb,...peers.map(r=>r[7])],tip:b+' ／ '+jb};
 return {prompt:'中国語でどう言う？',body:'<p>'+ja+'</p>',model:a,tip};
}
let currentOptions=[];
function question(){
 const q=exercise(queue[position]);answered=false;
 if(q.words){
   show(card('<small>一文を組み立てる · '+(position+1)+' / '+queue.length+'</small><h2>'+escape(q.prompt)+'</h2><p>ことばをドラッグ、または順番にタップ</p><div id="g4slots"></div><hr><div id="g4bank"></div>'+button('答え合わせ','order',true)+'<div id="feedback" aria-live="polite"></div>'));
   const submit=main.querySelector('[data-act="order"]');
   let order;
   const builder=window.KP_SENTENCE_TILES({words:q.words,bank:mix(q.words.map((_,i)=>i)),slots:main.querySelector('#g4slots'),choices:main.querySelector('#g4bank'),onChange(values){order=values;submit.disabled=values.includes(null);}});
   submit.onclick=()=>{if(order.includes(null)||answered)return;builder.lock();grade(order.every((v,i)=>v===i));};
   return;
 }
 currentOptions=q.choices?mix(q.choices):[];
 const input=q.word?'<div id="g4write"></div>':currentOptions.length?'<div class="choices">'+currentOptions.map((v,j)=>button(v,'pick'+j)).join('')+'</div>':'<textarea aria-label="中国語の答え" lang="zh" id="response"></textarea>'+button(q.model?'解答例と見比べる':'答え合わせ','check',true);
 show(card('<small>'+types[Number(queue[position].split(':')[2])]+' · '+(position+1)+' / '+queue.length+'</small><h2>'+q.prompt+'</h2>'+(q.body||'')+(q.audio?button('▶ 聞く','listen'):'')+input+'<div id="feedback" aria-live="polite"></div>'));
 if(q.word)window.KP_HANDWRITE(main.querySelector('#g4write'),q.word,grade);
}
const writes=[];
function grade(ok,selectedIndex){
 if(answered)return;answered=true;
 const k=queue[position],q=exercise(k);if(ok){score++;missed.delete(k);}else missed.add(k);
 if(q.choices){main.querySelectorAll('.choices button').forEach((b,i)=>{const right=currentOptions[i]===q.choices[0];if(right||i===selectedIndex){b.classList.add(right?'g4-correct':'g4-wrong');b.textContent=(right?'○ ':'× ')+currentOptions[i];}});}
 main.querySelectorAll('button[data-act]:not([data-act="listen"]),textarea').forEach(el=>el.disabled=true);
 document.querySelector('#feedback').innerHTML='<div class="g4-feedback"><strong>'+(ok?'○ 正解！':'× 不正解 · ここを確認しよう')+'</strong><p>'+escape(q.choices?.[0]||q.word||q.model||q.solution)+'</p>'+escape(q.tip)+(q.transcript?'<details><summary>本文を読む</summary>'+line(q.transcript,'')+'</details>':'')+'</div>'+button(position+1===queue.length?'結果を見る':'次へ','next',true);
 document.querySelector('#feedback').scrollIntoView({block:'nearest'});
 const api=window.KP_ACCOUNT_API;if(api?.recordPracticeAttempt)writes.push(Promise.resolve().then(()=>api.recordPracticeAttempt(k,'grade4',ok)).catch(()=>false));
}
function finish(){
 if(!reviewing)window.KP_ACCOUNT_API?.recordLearningCompletion('practice',challenge>=0?'grade4-stage-'+challenge:'grade4-'+lesson);
 show(card('<h2>おつかれさま！</h2><p>'+queue.length+'問中 '+score+'問できました。</p>'+(missed.size?button('まちがえた問題をもう一度','retry',true):'')+link(challenge>=0?'?stage='+challenge:lesson>=0?'?stage='+stage:'./grade4.html','ルートへ戻る')));
}
async function review(){
 back.href='./grade4.html';let rows;
 try{rows=await window.KP_ACCOUNT_API?.getPracticeReviewQueue('grade4');}catch{show(card('復習の記録を読み込めませんでした。'+button('もう一度','load')));return;}
 queue=(rows||[]).filter(r=>r.wrong_count>0&&getKey(r.item_key)).map(r=>r.item_key);
 if(queue.length){reviewing=true;position=score=0;question();}else show(card('<h2>復習する問題はありません</h2><p>ゲストは練習結果から、その場で解き直せます。</p>'+link('./grade4.html','ルートに戻る')));
}
main.addEventListener('click',e=>{
 const selected=e.target.closest('.kp-lookup-word');
 const card=main.querySelector('#wordCard');
 if(selected && card){
   const word=selected.dataset.term;
   const listen=main.querySelector('[data-act="word"]');
   listen.dataset.word=word;
   listen.textContent='▶ '+word+'を聞く';
   main.querySelectorAll('.kp-lookup-word').forEach(el=>el.setAttribute('aria-pressed',String(el===selected)));
   const display=(reading,meaning)=>{
     card.innerHTML='<h2>'+escape(word)+' <small>'+escape(reading)+'</small></h2><p>'+escape(meaning)+'</p>';
   };
   const gloss=dictionary.get(word);
   if(gloss)display(gloss[0],gloss[1]);
   else {
     display('','辞書を確認中…');
     window.KP_READING_LOOKUP.lookup(word).then(entry=>{
       if(card.isConnected && listen.dataset.word===word)display(entry?.readings.join(' / ')||'',entry?.gloss||'辞書に見つかりませんでした。');
     }).catch(()=>{if(card.isConnected && listen.dataset.word===word)display('','辞書を読み込めませんでした。');});
   }
   return;
 }
 const action=e.target.closest('[data-act]')?.dataset.act;if(!action)return;
 if(action==='load'){review();return;}
 if(action==='audio'||action==='word'){const r=lessons[lesson];speak(action==='audio'?r[4]+r[6]:(e.target.closest('[data-act]').dataset.word||r[1]));return;}
 if(action==='start'){queue=[0,1,2,3,4,5,8,9].map(t=>key(lesson,t));question();return;}
 if(action==='retry'){queue=[...missed];position=score=0;reviewing=true;question();return;}
 const q=exercise(queue[position]);
 if(action==='listen'){if(!speak(q.audio))document.querySelector('#feedback').textContent=q.audio;return;}
 if(action.startsWith('pick'))grade(currentOptions[Number(action.slice(4))]===q.choices[0],Number(action.slice(4)));
 if(action==='check'){
   const input=document.querySelector('#response');if(!input.value.trim()){input.focus();return;}
   input.readOnly=true;e.target.disabled=true;document.querySelector('#feedback').innerHTML='<h3>解答例</h3>'+line(q.model,'')+'<p>'+escape(q.tip)+'</p>'+button('意味と語順が合っていた','yes')+button('復習に入れる','no');return;
 }
 if(action==='yes'||action==='no')grade(action==='yes');
 if(action==='next'&&answered){position++;if(position<queue.length)question();else finish();}
});
if(challenge>=0){
 back.href='?stage='+challenge;
 queue=[key(challenge*4,7),key(challenge*4,6)];question();
}else if(params.has('review'))review();else if(lesson>=0)study();else map();
