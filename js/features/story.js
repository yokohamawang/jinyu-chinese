(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};

  const STORIES=[
    {id:'hanzi-origin',title:'漢字のはじまり',subtitle:'絵から生まれた文字の物語',theme:'文字の歴史',art:'🪨',tone:'amber',summary:'むかしの人は、見たものをどのように文字にしたのでしょう。',lines:[
      {py:'Hěnjiǔ yǐqián, Zhōngguó rén hái méiyǒu xiànzài zhèyàng de wénzì.',zh:'很久以前，中国人还没有现在这样的文字。',ja:'ずっと昔、中国には今のような文字がまだありませんでした。'},
      {py:'Chuánshuō, Cāngjié guānchá niǎoshòu de jiǎoyìn hé shānchuān de xíngzhuàng, shìzhe bǎ kàndào de yàngzi huà xiàlái.',zh:'传说，仓颉观察鸟兽的脚印和山川的形状，试着把看到的样子画下来。',ja:'伝説によると、倉頡は鳥や動物の足あと、山や川の形を観察し、見たものを絵にしました。'},
      {py:'Yì tiáo tiáo túxíng mànmàn biànchéng le zǎoqī de wénzì.',zh:'一条条图形慢慢变成了早期的文字。',ja:'絵は少しずつ、初期の文字になっていきました。'},
      {py:'Hòulái, rénmen bǎ Hànzì xiě zài jiǎgǔ, zhújiǎn hé zhǐ shàng.',zh:'后来，人们把汉字写在甲骨、竹简和纸上。',ja:'その後、人々は漢字を甲骨や竹簡、紙に書くようになりました。'}
    ]},
    {id:'movable-type',title:'活字印刷の発明',subtitle:'一つずつの文字から、本が生まれる',theme:'発明ものがたり',art:'📖',tone:'mint',summary:'北宋の職人・畢昇が考えた、くり返し使える印刷の工夫です。',lines:[
      {py:'Běi Sòng shíqī, gōngjiàng Bì Shēng fāmíng le huózì yìnshuā.',zh:'北宋时期，工匠毕昇发明了活字印刷。',ja:'北宋の時代、職人の畢昇が活字印刷を発明しました。'},
      {py:'Tā bǎ yí gè gè Hànzì kè zài xiǎoxiǎo de ní kuài shàng, zài shāo yìng.',zh:'他把一个个汉字刻在小小的泥块上，再烧硬。',ja:'一つずつの漢字を小さな粘土のかけらに刻み、焼いて固めました。'},
      {py:'Yìn shū de shíhou, rénmen bǎ zìkuài pái zài yìqǐ, tú shàng mò, gài shàng zhǐ.',zh:'印书的时候，人们把字块排在一起，涂上墨，盖上纸。',ja:'本を印刷するときは、字のブロックを並べ、墨をつけて紙を重ねます。'},
      {py:'Yìn wán yǐhòu, zìkuài hái kěyǐ chāi xiàlái, chóngxīn páiliè.',zh:'印完以后，字块还可以拆下来，重新排列。',ja:'印刷が終わったら、字のブロックを外して、別の順に並べ直せます。'}
    ]},
    {id:'three-kingdoms',title:'三国志のなかまたち',subtitle:'三つの国がならび立った時代',theme:'歴史のぼうけん',art:'🏯',tone:'violet',summary:'魏・蜀・呉の時代に生まれた、友情と知恵の物語です。',lines:[
      {py:'Hěnjiǔ yǐqián, Zhōngguó chūxiàn le Wèi, Shǔ, Wú sān gè guójiā.',zh:'很久以前，中国出现了魏、蜀、吴三个国家。',ja:'ずっと昔、中国には魏・蜀・呉という三つの国がありました。'},
      {py:'Liú Bèi, Guān Yǔ hé Zhāng Fēi zài Táoyuán xiāngshí, jié wéi xiōngdì.',zh:'刘备、关羽和张飞在桃园相识，结为兄弟。',ja:'劉備・関羽・張飛は桃園で出会い、兄弟のちぎりを結びました。'},
      {py:'Zhūgě Liàng bāngzhù Liú Bèi zhìdìng jìhuà, yě chángcháng xiǎng bànfǎ jiějué kùnnan.',zh:'诸葛亮帮助刘备制定计划，也常常想办法解决困难。',ja:'諸葛亮は劉備の計画を助け、知恵を使って困りごとを解決しました。'},
      {py:'Sān gè guójiā shí’ér hézuò, shí’ér jiāozhàn, liúxià le xǔduō yǒumíng de gùshi.',zh:'三个国家时而合作，时而交战，留下了许多有名的故事。',ja:'三つの国は協力したり戦ったりしながら、たくさんの物語を残しました。'}
    ]}
  ];
  let selectedId=null,rate=.68,playToken=0,isPaused=false,lastCompletedId=null;
  const safe=value=>String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const selected=()=>STORIES.find(s=>s.id===selectedId);
  function stop(){playToken++;isPaused=false;if('speechSynthesis'in window)window.speechSynthesis.cancel();document.querySelectorAll('.kp-story-line.is-speaking').forEach(el=>el.classList.remove('is-speaking'));}
  function escapeClick(e){if(e.target.closest('.kp-feature-nav [data-go],.kp-brand[data-go]'))stop();}
  if(!window.__kpStoryStopBound){document.addEventListener('click',escapeClick,true);window.addEventListener('pagehide',stop);window.__kpStoryStopBound=true;}
  function listMarkup(head){return `${head('物語で中国語にふれよう','ストーリー','文字の歴史や三国志を、聞いて楽しむ短い物語。')}<section class="kp-story-intro"><div class="kp-story-intro-art"><span>✨</span><img src="./assets/brand/xiaoyin-mascot.png" alt="小音"></div><div><b>物語を聞いてみよう</b><p>中国語の全文を見ながら、ゆっくり聞けます。</p></div></section><section class="kp-story-list" aria-label="ストーリー一覧">${STORIES.map(s=>`<button type="button" class="kp-story-choice tone-${s.tone}" data-action="story-open" data-story="${s.id}"><span class="kp-story-choice-art" aria-hidden="true">${s.art}</span><span class="kp-story-choice-copy"><small>${safe(s.theme)}</small><b>${safe(s.title)}</b><span>${safe(s.summary)}</span></span><span class="kp-story-choice-arrow" aria-hidden="true">›</span></button>`).join('')}</section><p class="kp-story-prototype-note">物語を最後まで聞くと、今日の学習として記録されます。</p>`;}
  function articleMarkup(head,s){return `${head('ストーリー','聞いて読む','全文を表示しています。聞こえている文が順に光ります。')}<button type="button" class="kp-story-back" data-action="story-back">‹　ストーリー一覧</button><section class="kp-story-article tone-${s.tone}"><header class="kp-story-article-hero"><div class="kp-story-article-art" aria-hidden="true"><span>${s.art}</span><img src="./assets/brand/xiaoyin-mascot.png" alt="小音"></div><div><small>${safe(s.theme)}</small><h2>${safe(s.title)}</h2><p>${safe(s.subtitle)}</p></div></header><p class="kp-story-summary">${safe(s.summary)}</p><div class="kp-story-lines" lang="zh-CN">${s.lines.map((line,i)=>`<article class="kp-story-line" data-story-line="${i}"><small class="kp-story-pinyin" lang="zh-Latn-pinyin">${safe(line.py)}</small><p class="kp-story-hanzi">${safe(line.zh)}</p><p class="kp-story-translation" lang="ja">${safe(line.ja)}</p></article>`).join('')}</div>${lastCompletedId===s.id?'<p class="kp-story-done" role="status">🎉 故事听完了！今天的学习记录好了。</p>':''}</section><div class="kp-story-player" role="group" aria-label="ストーリー再生"><button type="button" class="kp-story-play" data-action="story-play">▶　物語を聞く</button><label class="kp-story-speed">速度<select data-action="story-rate" aria-label="再生速度"><option value="0.68" ${rate===.68?'selected':''}>ゆっくり</option><option value="0.9" ${rate===.9?'selected':''}>ふつう</option></select></label><button type="button" class="kp-story-stop" data-action="story-stop" aria-label="再生を止める">■</button></div><p class="kp-story-status" data-story-status role="status" aria-live="polite">「ゆっくり」は聞き取りやすい速度です。</p>`;}
  function feature({head}){const s=selected();return s?articleMarkup(head,s):listMarkup(head);}
  function finishStory(s,ctx){lastCompletedId=s.id;const today=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Tokyo'}));const day=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');if(typeof window.completeDailyGoal==='function')window.completeDailyGoal();window.dispatchEvent(new CustomEvent('kp-learning-activity-recorded',{detail:{day,source:'story',unitId:s.id}}));ctx.render();}
  function speakAt(index,token,s,ctx){if(token!==playToken)return;if(index>=s.lines.length){stop();finishStory(s,ctx);return;}const line=document.querySelector(`[data-story-line="${index}"]`);document.querySelectorAll('.kp-story-line').forEach(el=>el.classList.toggle('is-speaking',el===line));line?.scrollIntoView({behavior:'smooth',block:'nearest'});const status=document.querySelector('[data-story-status]');if(status)status.textContent=`${index+1} / ${s.lines.length} 文を聞いています。`;try{const u=new SpeechSynthesisUtterance(s.lines[index].zh);u.lang='zh-CN';u.rate=rate;const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>/^zh[-_](CN|Hans)/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang))||null;u.onend=()=>{if(token===playToken)speakAt(index+1,token,s,ctx)};u.onerror=()=>{if(token!==playToken)return;stop();if(status)status.textContent='音声を再生できませんでした。端末の音声設定をご確認ください。';};window.speechSynthesis.resume();window.speechSynthesis.speak(u);}catch(_){stop();if(status)status.textContent='この端末では音声を再生できません。';}}
  feature.actions={
    'story-open':(ctx,button)=>{stop();selectedId=button.dataset.story;lastCompletedId=null;ctx.render();},
    'story-back':(ctx)=>{stop();selectedId=null;lastCompletedId=null;ctx.render();},
    'story-play':(ctx)=>{const s=selected();if(!s)return;if(!('speechSynthesis'in window)||!window.SpeechSynthesisUtterance){const status=document.querySelector('[data-story-status]');if(status)status.textContent='この端末では音声再生を利用できません。';return;}stop();lastCompletedId=null;const token=playToken; speakAt(0,token,s,ctx);},
    'story-stop':()=>{stop();const status=document.querySelector('[data-story-status]');if(status)status.textContent='再生を止めました。最初から聞き直せます。';},
    'story-pause':()=>{if(!('speechSynthesis'in window))return;if(isPaused){window.speechSynthesis.resume();isPaused=false;}else{window.speechSynthesis.pause();isPaused=true;}}
  };
  feature.change=(ctx,event)=>{if(event.target?.dataset.action==='story-rate'){rate=Number(event.target.value)===.9?.9:.68;return true;}return false;};
  window.KoepandaFeatures.story=feature;
})();
