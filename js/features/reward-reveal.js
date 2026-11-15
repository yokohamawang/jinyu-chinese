/* Reusable full-page reward issue + reveal flow. Call KoepandaRewardReveal.award(ctx, options). */
(function(){
  'use strict';
  const MOTION_QUERY='(prefers-reduced-motion: reduce)';
  const SOUND_KEY='koepanda.reward.sound.enabled';
  const PRESENTATION_MODES=Object.freeze({
    standard:{label:'KOEPANDA · REWARD TIME',notes:[523.25,659.25,783.99,1046.5],color:'standard'},
    bonus:{label:'KOEPANDA · DOUBLE REWARD',notes:[392,523.25,659.25,783.99,1046.5],color:'bonus'},
    campaign:{label:'KOEPANDA · SPECIAL DROP',notes:[587.33,739.99,880,1174.66],color:'campaign'}
  });
  let active=null;
  let rewardAudio=null;
  let activeTones=[];
  function safe(value){return String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function token(){return window.crypto?.randomUUID?window.crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16);});}
  function soundEnabled(){try{return localStorage.getItem(SOUND_KEY)!=='false';}catch(_){return true;}}
  function setSoundEnabled(value){try{localStorage.setItem(SOUND_KEY,String(!!value));}catch(_){} }
  function prepareRewardAudio(){try{const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return null;if(!rewardAudio)rewardAudio=new AudioCtor();if(rewardAudio.state==='suspended')rewardAudio.resume().catch(()=>{});return rewardAudio;}catch(_){return null;}}
  function playNote(ctx,frequency,start,duration,wave,volume){const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=wave;osc.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.025);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(gain);gain.connect(ctx.destination);activeTones.push(osc);osc.onended=()=>{activeTones=activeTones.filter(t=>t!==osc);};osc.start(start);osc.stop(start+duration+.04);}
  function stopFanfare(){activeTones.forEach(t=>{try{t.stop();}catch(_){}});activeTones=[];}
  function playFanfare(modeKey){const ctx=prepareRewardAudio();if(!ctx)return false;if(ctx.state!=='running'){ctx.resume().then(()=>{if(ctx.state==='running'&&soundEnabled())playFanfare(modeKey);}).catch(()=>{});return false;}stopFanfare();const mode=PRESENTATION_MODES[modeKey]||PRESENTATION_MODES.standard,now=ctx.currentTime+.025,spacing=modeKey==='bonus' ? 0.15 : 0.19;mode.notes.forEach((note,i)=>{const at=now+i*spacing;playNote(ctx,note,at,.48,'sine',.085);if(i===0||i===mode.notes.length-1)playNote(ctx,note/2,at,.62,'triangle',.045);});return true;}
  function resolveMode(options,items,eventName){if(PRESENTATION_MODES[options.mode])return options.mode;if(eventName)return'campaign';if(items.length>1)return'bonus';return'standard';}
  function remove(){stopFanfare();if(!active)return;clearTimeout(active.timer);document.removeEventListener('keydown',active.keydown);active.node.remove();active=null;document.body.classList.remove('kp-reward-open');}
  function award(ctx,options){
    options=options||{};if(soundEnabled())prepareRewardAudio();remove();
    document.getElementById('koepandaResultStage')?.remove();
    const node=document.createElement('section');node.className='kp-reward-screen is-loading';node.setAttribute('role','dialog');node.setAttribute('aria-modal','true');node.setAttribute('aria-labelledby','kpRewardTitle');
    node.innerHTML='<div class="kp-reward-stars" aria-hidden="true">'+Array.from({length:24},(_,i)=>'<i style="left:'+((i*43+7)%100)+'%;top:'+((i*67+11)%100)+'%;font-size:'+(10+(i%4)*5)+'px;animation-delay:'+(i*24)+'ms">✦</i>').join('')+'</div><div class="kp-reward-halo" aria-hidden="true"></div><div class="kp-reward-content"><div class="kp-reward-brand">KOEPANDA · REWARD TIME</div><div class="kp-reward-mascot"><img src="./assets/brand/xiaoyin-mascot.png" alt="小音"></div><p class="kp-reward-kicker">よくがんばったね！</p><h1 id="kpRewardTitle">ごほうびを開けよう</h1><p class="kp-reward-subtitle">小音からのプレゼントを準備中…</p><div class="kp-reward-box" aria-hidden="true"><span>✦</span><b>?</b></div><div class="kp-reward-items" aria-live="polite"></div><div class="kp-reward-actions"></div></div>';
    document.body.appendChild(node);document.body.classList.add('kp-reward-open');
    const keydown=e=>{if(e.key==='Escape'&&active){e.preventDefault();e.stopPropagation();if(!active.node.classList.contains('is-loading'))remove();}};
    document.addEventListener('keydown',keydown,true);active={node,keydown,timer:0};
    requestAnimationFrame(()=>node.classList.add('is-celebrating'));
    const showError=(message,canRetry)=>{
      node.classList.remove('is-loading','is-celebrating');
      node.querySelector('.kp-reward-subtitle').textContent=message;
      node.querySelector('.kp-reward-box').hidden=true;
      node.querySelector('.kp-reward-actions').innerHTML=(canRetry?'<button type="button" class="kp-reward-primary" data-retry>もう一度受け取る</button>':'<button type="button" class="kp-reward-primary" data-login>ログインする</button>')+'<button type="button" class="kp-reward-secondary" data-close>閉じる</button>';
      node.querySelector('[data-close]').onclick=remove;
      const retry=node.querySelector('[data-retry]');if(retry)retry.onclick=()=>award(ctx,options);
      const login=node.querySelector('[data-login]');if(login)login.onclick=()=>{remove();document.getElementById('kpAccountTrigger')?.click();};
    };
    (async()=>{
      try{
        const api=window.KP_ACCOUNT_API;if(!api||typeof api.getClient!=='function')throw new Error('login');
        const client=await api.getClient();if(!client)throw new Error('connection');
        const session=await client.auth.getSession();if(!session.data?.session)throw new Error('login');
        const total=Math.max(1,Math.min(1000,Number(options.total)||1));
        const score=Math.max(0,Math.min(total,Number(options.score)||0));
        const result=await client.rpc('kp_award_learning_stickers',{
          p_claim_token:options.claimToken||token(),p_score:score,p_total:total,p_source_key:'learning',p_activity_key:options.activityKey||'learning.complete'
        });
        if(result.error)throw result.error;
        const items=Array.isArray(result.data)?result.data:[];if(!items.length)throw new Error('empty_reward');
        if(active?.node!==node)return;
        const ordered=items.slice().sort((a,b)=>a.ordinal-b.ordinal);
        if(typeof window.completeDailyGoal==='function')window.completeDailyGoal();
        const now=new Date(),tokyo=new Date(now.toLocaleString('en-US',{timeZone:'Asia/Tokyo'})),today=[tokyo.getFullYear(),String(tokyo.getMonth()+1).padStart(2,'0'),String(tokyo.getDate()).padStart(2,'0')].join('-');
        const eventName=ordered.find(x=>x.campaign_name)?.campaign_name;
        const modeKey=resolveMode(options,ordered,eventName);
        const mode=PRESENTATION_MODES[modeKey];
        node.classList.add('mode-'+mode.color);
        ordered.forEach(item=>{
          const catalog=(ctx.STICKERS||[]).find(s=>s.id===item.sticker_key);
          if(!ctx.state.unlocked.includes(item.sticker_key))ctx.state.unlocked.push(item.sticker_key);
          if(Array.isArray(ctx.state.bookInventory)&&!ctx.state.bookInventory.some(s=>s.id===item.sticker_instance_id))ctx.state.bookInventory.push({id:item.sticker_instance_id,sticker_key:item.sticker_key});
          const img=catalog?ctx.img(item.sticker_key):'';
          const title=catalog?.name||item.title||item.glyph||'Koepanda sticker';
          const figure=document.createElement('figure');figure.className='kp-reveal-sticker is-sealed';
          figure.innerHTML='<span class="kp-reveal-card-back" aria-hidden="true"><b>小音</b><i>✦</i></span><div class="kp-reveal-card-front"><img src="'+safe(img)+'" alt="'+safe(title)+'"><figcaption>'+safe(title)+'</figcaption></div>';
          node.querySelector('.kp-reward-items').appendChild(figure);
        });
        if(Array.isArray(ctx.state.rewardStickerKeys)){
          const keys=new Set(ctx.state.rewardStickerKeys);ordered.forEach(item=>keys.add(item.sticker_key));
          ctx.state.rewardStickerKeys=[...keys];ctx.state.rewardStickerCountLabel=keys.size+' 種類';
        }
        const priorStickerCount=Number.parseInt(ctx.state.selfStickerCountLabel,10);
        if(ctx.state.selfStickerCountUserId&&Number.isFinite(priorStickerCount))ctx.state.selfStickerCountLabel=(priorStickerCount+ordered.length)+'枚';
        ctx.save();
        window.dispatchEvent(new CustomEvent('kp-learning-activity-recorded',{detail:{day:today,stickers:ordered.map(item=>({id:item.sticker_instance_id,sticker_key:item.sticker_key,obtained_at:now.toISOString()}))}}));
        node.querySelector('.kp-reward-brand').textContent=eventName?String(eventName).toUpperCase()+' · SPECIAL DROP':mode.label;
        node.querySelector('.kp-reward-subtitle').textContent=modeKey==='campaign'?'今日は特別なごほうびの日！':modeKey==='bonus'?'すごい！ごほうびが2枚届いたよ':'シール帳に新しいシールが届いたよ';
        node.querySelector('.kp-reward-box').classList.add('is-open');
        node.classList.remove('is-loading');node.classList.add('has-rewards');
        node.querySelectorAll('.kp-reveal-sticker').forEach((figure,i)=>{
          const reducedMotion=window.matchMedia(MOTION_QUERY).matches,delay=reducedMotion?0:700+i*400;
          setTimeout(()=>{figure.classList.remove('is-sealed');if(i===0&&soundEnabled())playFanfare(modeKey);setTimeout(()=>figure.classList.add('is-revealed'),reducedMotion?0:500);},delay);
        });
        const actions=node.querySelector('.kp-reward-actions');
        actions.innerHTML='<button type="button" class="kp-reward-sound" data-sound-toggle aria-pressed="'+soundEnabled()+'">'+(soundEnabled()?'🔊 お祝い音 ON':'🔇 お祝い音 OFF')+'</button><button type="button" class="kp-reward-primary" data-book>シール帳で見る <span>→</span></button><button type="button" class="kp-reward-secondary" data-close>学習を続ける</button><p class="kp-reward-idempotent" hidden>このごほうびは受け取り済みです</p>';
        if(ordered.every(x=>x.already_claimed))actions.querySelector('.kp-reward-idempotent').hidden=false;
        actions.querySelector('[data-sound-toggle]').onclick=e=>{const enabled=e.currentTarget.getAttribute('aria-pressed')!=='true';setSoundEnabled(enabled);e.currentTarget.setAttribute('aria-pressed',String(enabled));e.currentTarget.textContent=enabled?'🔊 お祝い音 ON':'🔇 お祝い音 OFF';if(enabled)playFanfare(modeKey);else stopFanfare();};
        actions.querySelector('[data-close]').onclick=remove;
        actions.querySelector('[data-book]').onclick=()=>{
          remove();
          if(typeof window.KP_OPEN_STICKER_BOOK==='function'){window.KP_OPEN_STICKER_BOOK();return;}
          ctx.state.bookOpen=true;ctx.state.coversOpen=false;ctx.state.bookReady=false;ctx.setPage('book');ctx.render();
        };
      }catch(error){
        console.warn('[Koepanda] reward issue failed:',error);
        if(active?.node!==node)return;
        showError(error?.message==='login'?'ログインすると、ごほうびシールを受け取ってシール帳に保存できます。':'通信がつながらず、ごほうびを受け取れませんでした。',error?.message!=='login');
      }
    })();
  }
  function installCourseResultHook(){
    const show=window.koepandaShowResultCelebration;
    if(typeof show!=='function'||show.__kpRewardHooked)return;
    const wrapped=function(config){
      const eligible=config&&typeof config==='object'&&!config.__kpRewardIssued&&Number.isFinite(Number(config.score))&&Number.isFinite(Number(config.total));
      let claimToken=null;
      if(eligible){
        if(soundEnabled())prepareRewardAudio();
        claimToken=token();
        config.__kpRewardIssued=true;
        config.__kpRewardClaimToken=claimToken;
      }
      const result=show.apply(this,arguments);
      if(eligible){
        window.setTimeout(()=>{
          const context=window.KP_REWARD_CONTEXT?.();
          if(context)award(context,{claimToken,score:Number(config.score),total:Number(config.total),activityKey:'course.quiz.complete'});
        },240);
      }
      return result;
    };
    wrapped.__kpRewardHooked=true;
    window.koepandaShowResultCelebration=wrapped;
  }
  window.KoepandaRewardReveal={award,installCourseResultHook,modes:Object.keys(PRESENTATION_MODES)};
  installCourseResultHook();
})();
