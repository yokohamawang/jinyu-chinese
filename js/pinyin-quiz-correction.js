/* Chapter quiz feedback and ungraded practice for the sounds missed in this attempt. */
(function(){
  'use strict';
  const toneTips=['高く平らに保つ','低めから上げる','いったん低くしてから上げる','高いところから下げる'];
  const tips={
    b:'唇を開くとき、息を強く出さない',p:'唇を開くとき、息を強く出す',m:'唇を閉じたまま鼻に響かせる',f:'上の歯を下唇に当てて息を出す',
    d:'舌先を離すとき、息を強く出さない',t:'舌先を離すとき、息を強く出す',n:'舌先を歯ぐきにつけ、鼻に響かせる',l:'舌先を歯ぐきにつけ、舌の横に音を通す',
    g:'舌の奥を離すとき、息を強く出さない',k:'舌の奥を離すとき、息を強く出す',h:'舌の奥のすき間から息を出す',
    j:'舌の前を上あごに近づけ、強い息を出さない',q:'舌の前を上あごに近づけ、息を強く出す',x:'舌の前と上あごのすき間から息を続ける',
    zh:'舌先を少し反らせ、強い息を出さない',ch:'舌先を少し反らせ、息を強く出す',sh:'舌先を少し反らせ、すき間から息を続ける',r:'舌先を少し反らせ、声を響かせる',
    z:'舌先を前歯の裏に近づけ、強い息を出さない',c:'舌先を前歯の裏に近づけ、息を強く出す',s:'舌先を前歯の裏に近づけ、すき間から息を続ける',
    ai:'a から i へ',ei:'e から i へ',ui:'u から ei へ',ao:'a から o へ',ou:'o から u へ',iu:'i から ou へ',
    ie:'i から e へ','üe':'唇を丸めた ü から e へ',er:'舌先を反らせて響かせる',
    an:'a から舌先で n に閉じる',en:'e から舌先で n に閉じる',in:'i から舌先で n に閉じる',un:'u から舌先で n に閉じる','ün':'唇を丸めた ü から n に閉じる',
    ang:'a から舌の奥で ng に閉じる',eng:'e から舌の奥で ng に閉じる',ing:'i から舌の奥で ng に閉じる',ong:'唇を丸め、舌の奥で ng に閉じる',
    yu:'唇を丸めた母音を一つ伸ばす',ye:'唇を丸めず i に近い音から e へ',yue:'唇を丸めた音から e へ',
    yuan:'最後は舌先で n に閉じる',yin:'i のあとに n',yun:'唇を丸めた音のあとに n',ying:'i のあとに舌の奥で ng',yi:'唇を丸めず i の音',wu:'唇を丸めて u の音'
  };
  let clip=null,voiceStop=null,generation=0;
  const rounds=new Map();
  const vowels={i:'yi',u:'wu','ü':'yu'};
  const course=key=>'./assets/audio/course-134/'+key+'.wav';
  const tone=(key,n,label)=>({label,tip:toneTips[n-1],url:course((vowels[key]||key)+n)});
  const model=(key,label=key,tip)=>({label,tip:tip||tips[key]||tips[key.replace(/i$/,'')]||'',url:window.KP134_DATA?.[key]?.audio});
  const sound=(label,url,tip)=>({label,url,tip});
  function stop(){
    generation++;
    if(clip){clip.onplaying=clip.onended=clip.onerror=null;clip.pause();clip=null;}
    if(voiceStop){voiceStop();voiceStop=null;}
  }
  function play(url,status,onReady,voice){
    stop();
    window.KP134?.stop();
    const ticket=generation;
    const fail=()=>{if(ticket===generation){stop();status.textContent='音声を再生できませんでした。もう一度押してね。';}};
    if(!url&&voice){
      try{voiceStop=window.KP_AUDIO_SESSION.speakMandarin(voice,{onStart:onReady,onError:fail});}catch(_){fail();}
      return;
    }
    if(!url)return;
    try{
      clip=new Audio(url);
      clip.playsInline=true;
      clip.onplaying=()=>{if(ticket===generation)onReady?.();};
      clip.onerror=fail;
      clip.play().catch(fail);
    }catch(_){fail();}
  }
  function node(tag,text){
    const item=document.createElement(tag);
    if(text)item.textContent=text;
    return item;
  }
  function button(text,action){
    const item=node('button',text);item.type='button';item.onclick=action;return item;
  }
  function panel(owner){
    let box=owner.querySelector(':scope > .kp-chapter-correction');
    if(!box){box=node('section');box.className='kp-chapter-correction';owner.append(box);}
    box.hidden=false;
    return box;
  }
  function clear(owner){
    const box=owner?.querySelector(':scope > .kp-chapter-correction');
    if(box)box.remove();
  }
  function reset(key,...owners){
    rounds.set(key,new Map());owners.forEach(clear);stop();
  }
  function cue(box,pair,status){
    for(const [label,item] of [['えらんだ答え',pair.wrong],['正解',pair.correct]]){
      const row=node('div');
      if(item.url||item.voice)row.append(button('▶ '+label+' '+item.label,()=>play(item.url,status,null,item.voice)));
      else row.append(node('strong',label+'：'+item.label));
      if(item.tip)row.append(node('span',item.tip));
      box.append(row);
    }
  }
  function recordMissedSound({correct,wrong}) {
    const selected=wrong.label;
    const audio=correct.url?.match(/^(?:\.\/)?assets\/audio\/([a-z0-9_./-]+\.wav)(?:\?.*)?$/i);
    if(!audio||correct.label===selected)return;
    const key='chapter-sound:'+JSON.stringify([correct.label,selected,audio[1]]);
    if([...key].length>100)return;
    window.KP_ACCOUNT_API?.recordPracticeAttempt?.(key,'pinyin-chapter-review',false)
      .catch(error=>console.warn('[Koepanda] chapter review sync unavailable:',error));
  }
  function wrong(key,owner,correct,selected,prompt){
    if(!rounds.has(key))rounds.set(key,new Map());
    const pair={correct,wrong:selected,prompt};
    const signature=JSON.stringify([prompt,correct.label,selected.label]);
    const round=rounds.get(key);
    if(!round.has(signature))recordMissedSound(pair);
    round.set(signature,pair);
    const box=panel(owner),status=node('p');status.setAttribute('role','status');
    box.replaceChildren(node('strong',correct.url?'小音と聞きくらべ':'答えを見くらべよう'));
    cue(box,pair,status);box.append(status);
  }
  function finish(key,owner){
    const pairs=Array.from(rounds.get(key)?.values()||[]);
    clear(owner);
    if(!pairs.length)return false;
    const box=panel(owner);
    const launch=button('まちがえた問題だけ復習（'+pairs.length+'）',()=>draw(0));
    function draw(index){
      stop();
      if(index===pairs.length){
        box.replaceChildren(node('strong','復習ができたね！'),launch);launch.focus();return;
      }
      const pair=pairs[index],listen=!!pair.correct.url,status=node('p');
      status.setAttribute('role','status');
      const heading=node('strong','復習 '+(index+1)+' / '+pairs.length);
      const options=node('div');
      const next=button(index+1===pairs.length?'復習を終える':'次へ',()=>draw(index+1));
      next.hidden=true;
      function choose(item){
        if(item===pair.correct){
          options.querySelectorAll('button').forEach(option=>{option.disabled=true;});
          status.textContent='正解！';next.hidden=false;next.focus();return;
        }
        status.textContent='もう一度、ちがいを確かめよう。';
        let comparison=box.querySelector('.kp-chapter-review-compare');
        if(!comparison){comparison=node('div');comparison.className='kp-chapter-review-compare';cue(comparison,pair,status);box.insertBefore(comparison,next);}
      }
      const list=[pair.correct,pair.wrong];
      if(Math.random()<.5)list.reverse();
      list.forEach(item=>{
        const option=button(item.label,()=>choose(item));option.disabled=listen;options.append(option);
      });
      box.replaceChildren(heading,node('p',pair.prompt||'音を聞いて選ぼう。'));
      if(listen)box.append(button('▶ 問題の音を聞く',()=>play(pair.correct.url,status,()=>{
        if(next.hidden)options.querySelectorAll('button').forEach(option=>{option.disabled=false;});
      })));
      box.append(options,status,next,button('結果に戻る',()=>{stop();box.replaceChildren(launch);launch.focus();}));
      box.querySelector('button')?.focus();
    }
    box.append(launch);return true;
  }
  function listen(url,feedback,options,canAnswer){
    options.querySelectorAll('button').forEach(b=>{b.disabled=true;});
    play(url,feedback,()=>{if(canAnswer)options.querySelectorAll('button').forEach(b=>{b.disabled=false;});});
  }
  document.addEventListener('click',event=>{
    if(event.target.closest('#kidsCourse button')&&!event.target.closest('.kp-chapter-correction'))stop();
  },true);
  window.addEventListener('pagehide',stop);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  window.KP_CHAPTER_CORRECTION={tone,model,sound,reset,clear,wrong,finish,listen,example:(word,status)=>play(null,status,null,word)};
})();
