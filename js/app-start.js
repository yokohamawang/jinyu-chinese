/* Generated application startup. Edit the separate source modules and rebuild. */

/* Source: js/audio-session.js */
try {
/* Recover Safari's page audio session before a new playback request. */
(function () {
  'use strict';
  var needsReconnect = true;
  var microphoneStreams = new Set(), pendingMicrophones = 0, captureGeneration = 0, microphoneWatch = null;
  var externalCaptures = new Set();
  function pruneMicrophones() {
    microphoneStreams.forEach(function (stream) {
      if (stream.getTracks().every(function (track) { return track.readyState === 'ended'; })) microphoneStreams.delete(stream);
    });
    if (!microphoneStreams.size && microphoneWatch !== null) {
      clearInterval(microphoneWatch); microphoneWatch = null;
    }
  }
  function otherMicrophoneActive() {
    var resources = window.KP134 && window.KP134.audioResources();
    return resources && (resources.microphoneStreams || resources.pendingMicrophones);
  }
  function restoreAfterRecording() {
    pruneMicrophones();
    if (pendingMicrophones || microphoneStreams.size || externalCaptures.size || otherMicrophoneActive()) return;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (_) {}
  }
  function releaseMicrophone(stream) {
    if (stream) { stream.getTracks().forEach(function (track) { track.stop(); }); microphoneStreams.delete(stream); }
    restoreAfterRecording();
  }
  function getMicrophone(constraints) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error('microphone_unavailable'));
    var generation = captureGeneration;
    pendingMicrophones++;
    try {
      // Safari rejects audio capture while the page explicitly requests playback.
      if (navigator.audioSession) navigator.audioSession.type = 'play-and-record';
      return Promise.resolve(navigator.mediaDevices.getUserMedia(constraints || {audio:true})).then(function (stream) {
        pendingMicrophones--;
        if (generation !== captureGeneration) {
          releaseMicrophone(stream);
          throw new DOMException('Recording view closed', 'AbortError');
        }
        microphoneStreams.add(stream);
        stream.getTracks().forEach(function (track) { track.addEventListener('ended', restoreAfterRecording); });
        // Legacy recorders call track.stop(), which does not emit an ended event.
        if (microphoneWatch === null) microphoneWatch = setInterval(function () {
          pruneMicrophones();
          if (!microphoneStreams.size) restoreAfterRecording();
        }, 250);
        return stream;
      }, function (error) { pendingMicrophones--; restoreAfterRecording(); throw error; });
    } catch (error) { pendingMicrophones--; restoreAfterRecording(); return Promise.reject(error); }
  }
  function beginCapture() {
    if (navigator.audioSession) navigator.audioSession.type = 'play-and-record';
    var active = true;
    function release() {
      if (!active) return;
      active = false; externalCaptures.delete(release); restoreAfterRecording();
    }
    externalCaptures.add(release);
    return release;
  }
  function createRecorder(stream) {
    var Recorder = window.MediaRecorder;
    var mime = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(function (type) {
      return Recorder.isTypeSupported && Recorder.isTypeSupported(type);
    });
    return mime ? new Recorder(stream, {mimeType:mime}) : new Recorder(stream);
  }
  function microphoneErrorMessage(error) {
    if (error && error.name === 'NotAllowedError') return 'マイクの使用が許可されていません。Safariのサイト設定でマイクを許可して、もう一度押してください。';
    if (error && error.name === 'NotFoundError') return 'マイクが見つかりません。接続を確認して、もう一度押してください。';
    return '録音を開始できませんでした。もう一度、録音ボタンを押してください。';
  }
  function preparePlayback() {
    var session = navigator.audioSession;
    if (!session) return;
    var hadMicrophones = microphoneStreams.size;
    pruneMicrophones();
    if (hadMicrophones && !microphoneStreams.size) restoreAfterRecording();
    if (pendingMicrophones || microphoneStreams.size || externalCaptures.size) return;
    var resources = window.KP134 && window.KP134.audioResources();
    if (resources && (resources.microphoneStreams || resources.pendingMicrophones)) return;
    // Never switch the session away from an active recording in another feature.
    if (session.type === 'play-and-record') return;
    try {
      // Reassigning the same category does not repair a stale Safari session.
      // Do this only on a new playback after a page lifecycle transition.
      if (needsReconnect && session.type === 'playback') session.type = 'auto';
      session.type = 'playback';
      needsReconnect = false;
    } catch (error) {
      console.warn('[Koepanda] audio session unavailable:', error.name);
    }
  }
  function reconnectOnNextPlay() { needsReconnect = true; }
  window.addEventListener('pageshow', reconnectOnNextPlay);
  window.addEventListener('focus', reconnectOnNextPlay);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) reconnectOnNextPlay();
  });
  // Includes reference clips and recorded-voice playback in standalone pages.
  document.addEventListener('play', preparePlayback, true);
  window.addEventListener('pagehide', function () {
    captureGeneration++;
    Array.from(externalCaptures).forEach(function (release) { release(); });
    Array.from(microphoneStreams).forEach(releaseMicrophone);
  });
  window.KP_AUDIO_SESSION = { preparePlayback: preparePlayback, getMicrophone: getMicrophone, releaseMicrophone: releaseMicrophone, createRecorder: createRecorder, microphoneErrorMessage: microphoneErrorMessage, beginCapture: beginCapture };
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/audio-session.js", error); }

/* Source: js/koepanda-update-check.js */
try {
/* The application no longer displays a release notification. */

} catch (error) { console.error("[Koepanda] startup module failed: js/koepanda-update-check.js", error); }

/* Source: js/koepanda-cloud-config-301.165.js */
try {
/* Public browser config. This publishable key is designed for browser use with RLS enabled. Never put a secret/service_role key here. */
window.KP_CLOUD_CONFIG = {
  url: 'https://sfwvoxsrmnravsvwagdm.supabase.co',
  publishableKey: 'sb_publishable_y9A4B7Z193G8E0Y-VXQzgA_13WRmzkU'
};

} catch (error) { console.error("[Koepanda] startup module failed: js/koepanda-cloud-config-301.165.js", error); }

/* Source: js/features/sticker-data.js */
try {
(function(){
  'use strict';
  window.KoepandaCatalog={STICKERS:[
    {id:'a',name:'あいうえおの a',glyph:'a',series:'拼音小芽',art:'a.svg',rarity:'ふつう',color:'pink'},
    {id:'o',name:'まるい音の o',glyph:'o',series:'拼音小芽',art:'o.svg',rarity:'ふつう',color:'orange'},
    {id:'e',name:'はねる音の e',glyph:'e',series:'拼音小芽',art:'e.svg',rarity:'きらきら',color:'yellow'},
    {id:'n',name:'鼻音の n',glyph:'n',series:'拼音小芽',art:'n.svg',rarity:'ふつう',color:'mint'},
    {id:'shan',name:'山',glyph:'山',series:'汉字探险',art:'shan.svg',rarity:'ふつう',color:'blue'},
    {id:'shui',name:'水',glyph:'水',series:'汉字探险',art:'shui.svg',rarity:'きらきら',color:'cyan'},
    {id:'ren',name:'人',glyph:'人',series:'汉字探险',art:'ren.svg',rarity:'ふつう',color:'purple'},
    {id:'hao',name:'好',glyph:'好',series:'汉字探险',art:'hao.svg',rarity:'きらきら',color:'rose'},
    {id:'zodiac_rat_pinyin',name:'鼠（shǔ）',glyph:'shǔ',series:'声调果冻',art:'zodiac/rat-pinyin.svg',rarity:'ふつう',color:'#68c49a'},
    {id:'zodiac_rat_kanji',name:'鼠（shǔ）',glyph:'鼠',series:'生肖印章',art:'zodiac/rat-kanji.svg',rarity:'ふつう',color:'#a9433b'},
    {id:'zodiac_ox_pinyin',name:'牛（niú）',glyph:'niú',series:'声调果冻',art:'zodiac/ox-pinyin.svg',rarity:'きらきら',color:'#f0a46c'},
    {id:'zodiac_ox_kanji',name:'牛（niú）',glyph:'牛',series:'生肖印章',art:'zodiac/ox-kanji.svg',rarity:'きらきら',color:'#26745d'},
    {id:'zodiac_tiger_pinyin',name:'虎（hǔ）',glyph:'hǔ',series:'声调果冻',art:'zodiac/tiger-pinyin.svg',rarity:'レア',color:'#f6a84d'},
    {id:'zodiac_tiger_kanji',name:'虎（hǔ）',glyph:'虎',series:'生肖印章',art:'zodiac/tiger-kanji.svg',rarity:'レア',color:'#465a9a'},
    {id:'zodiac_rabbit_pinyin',name:'兔（tù）',glyph:'tù',series:'声调果冻',art:'zodiac/rabbit-pinyin.svg',rarity:'ふつう',color:'#dd8fb0'},
    {id:'zodiac_rabbit_kanji',name:'兔（tù）',glyph:'兔',series:'生肖印章',art:'zodiac/rabbit-kanji.svg',rarity:'ふつう',color:'#8d4569'},
    {id:'zodiac_dragon_pinyin',name:'龙（lóng）',glyph:'lóng',series:'声调果冻',art:'zodiac/dragon-pinyin.svg',rarity:'きらきら',color:'#55b68a'},
    {id:'zodiac_dragon_kanji',name:'龙（lóng）',glyph:'龙',series:'生肖印章',art:'zodiac/dragon-kanji.svg',rarity:'きらきら',color:'#26785e'},
    {id:'zodiac_snake_pinyin',name:'蛇（shé）',glyph:'shé',series:'声调果冻',art:'zodiac/snake-pinyin.svg',rarity:'レア',color:'#5aa99a'},
    {id:'zodiac_snake_kanji',name:'蛇（shé）',glyph:'蛇',series:'生肖印章',art:'zodiac/snake-kanji.svg',rarity:'レア',color:'#39768b'},
    {id:'zodiac_horse_pinyin',name:'马（mǎ）',glyph:'mǎ',series:'声调果冻',art:'zodiac/horse-pinyin.svg',rarity:'ふつう',color:'#60afd0'},
    {id:'zodiac_horse_kanji',name:'马（mǎ）',glyph:'马',series:'生肖印章',art:'zodiac/horse-kanji.svg',rarity:'ふつう',color:'#b94b39'},
    {id:'zodiac_goat_pinyin',name:'羊（yáng）',glyph:'yáng',series:'声调果冻',art:'zodiac/goat-pinyin.svg',rarity:'きらきら',color:'#a18bd1'},
    {id:'zodiac_goat_kanji',name:'羊（yáng）',glyph:'羊',series:'生肖印章',art:'zodiac/goat-kanji.svg',rarity:'きらきら',color:'#4f775d'},
    {id:'zodiac_monkey_pinyin',name:'猴（hóu）',glyph:'hóu',series:'声调果冻',art:'zodiac/monkey-pinyin.svg',rarity:'レア',color:'#e78a69'},
    {id:'zodiac_monkey_kanji',name:'猴（hóu）',glyph:'猴',series:'生肖印章',art:'zodiac/monkey-kanji.svg',rarity:'レア',color:'#744c76'},
    {id:'zodiac_rooster_pinyin',name:'鸡（jī）',glyph:'jī',series:'声调果冻',art:'zodiac/rooster-pinyin.svg',rarity:'ふつう',color:'#729fd0'},
    {id:'zodiac_rooster_kanji',name:'鸡（jī）',glyph:'鸡',series:'生肖印章',art:'zodiac/rooster-kanji.svg',rarity:'ふつう',color:'#3d547c'},
    {id:'zodiac_dog_pinyin',name:'狗（gǒu）',glyph:'gǒu',series:'声调果冻',art:'zodiac/dog-pinyin.svg',rarity:'きらきら',color:'#8dbd69'},
    {id:'zodiac_dog_kanji',name:'狗（gǒu）',glyph:'狗',series:'生肖印章',art:'zodiac/dog-kanji.svg',rarity:'きらきら',color:'#597a91'},
    {id:'zodiac_pig_pinyin',name:'猪（zhū）',glyph:'zhū',series:'声调果冻',art:'zodiac/pig-pinyin.svg',rarity:'レア',color:'#de8298'},
    {id:'zodiac_pig_kanji',name:'猪（zhū）',glyph:'猪',series:'生肖印章',art:'zodiac/pig-kanji.svg',rarity:'レア',color:'#ad5d4b'}
  ]};
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/features/sticker-data.js", error); }

/* Source: js/features/learning-goal-sync.js */
try {
(function(){
  'use strict';
  const LEGACY='koepanda.continuous-goal.v2',OWNER=LEGACY+'.owner';
  let userId=null,ready=false,sequence=Promise.resolve(),status='loading',revision=0;
  const readKey=key=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(_){return{}}};
  const key=()=>LEGACY+'.'+(userId||'guest');
  const valid=g=>Number.isInteger(g.base)&&g.base>=0&&Number.isInteger(g.target)&&g.target>0&&g.target>=g.base&&/^\d{4}-\d{2}-\d{2}$/.test(g.end||'');
  function notify(s){status=s;window.dispatchEvent(new CustomEvent('kp-goal-sync-changed'))}
  async function sync(){
    const api=window.KP_ACCOUNT_API;if(!api){notify('error');return}
    const session=await api.getSession(),next=session?.user?.id||null;
    if(!ready||next!==userId){
      userId=next;ready=true;revision++;
      // Claim pre-sync goals once, so a different account cannot inherit them.
      const owner=localStorage.getItem(OWNER),legacy=readKey(LEGACY),guest=readKey(LEGACY+'.guest');
      if(userId&&!localStorage.getItem(key())&&valid(guest)&&(!owner||owner==='guest')){
        localStorage.setItem(key(),JSON.stringify({...guest,pending:true}));
        localStorage.setItem(OWNER,userId);
      }
      if(!localStorage.getItem(key())&&valid(legacy)&&(!owner||owner===(userId||'guest'))){
        localStorage.setItem(key(),JSON.stringify({...legacy,pending:true}));
        localStorage.setItem(OWNER,userId||'guest');
      }
    }
    if(!userId){notify('local');return}
    const id=userId,rev=revision,c=await api.getClient();
    let local=readKey(key());
    notify('saving');
    if(valid(local)&&local.pending){
      const result=await c.from('kp_learning_goals').upsert({user_id:id,base:local.base,target:local.target,end_date:local.end,updated_at:new Date().toISOString()},{onConflict:'user_id'}).select('base,target,end_date').single();
      if(result.error)throw result.error;
      if(userId!==id||revision!==rev)return;
      localStorage.setItem(key(),JSON.stringify({...local,pending:false}));
    }else{
      const result=await c.from('kp_learning_goals').select('base,target,end_date').eq('user_id',id).maybeSingle();
      if(result.error)throw result.error;
      if(userId!==id||revision!==rev)return;
      if(result.data){const g=result.data;localStorage.setItem(key(),JSON.stringify({base:g.base,target:g.target,end:g.end_date,pending:false}))}
    }
    notify('saved');
  }
  function queue(){sequence=sequence.then(sync).catch(e=>{console.warn('[Koepanda] goal sync failed',e);notify('error')});return sequence}
  window.KP_GOAL_STORE={
    read(){return ready?readKey(key()):readKey(LEGACY)},
    write(g){
      if(!valid(g))throw Error('Invalid learning goal');
      revision++;
      const value={...g,pending:true};
      if(ready)localStorage.setItem(key(),JSON.stringify(value));
      else localStorage.setItem(LEGACY,JSON.stringify(value));
      notify(userId?'saving':'local');queue();
    },
    message(){return {loading:'目標を確認中…',saving:'目標を同期中…',saved:'アカウントに保存済み',local:'この端末に保存済み・ログインすると同期します',error:'同期できませんでした。目標は端末に保存済みです。接続後に再試行します。'}[status]},
    sync:queue
  };
  window.addEventListener('kp-auth-state-changed',()=>setTimeout(queue,0));
  window.addEventListener('online',queue);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)queue()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/features/learning-goal-sync.js", error); }

/* Source: js/features/learn.js */
try {
(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  const GOAL_KEY='koepanda.learning-goal-target.v1';
  let dashboardStatus='idle',dashboardUserId=null,cloudStickers=null,cloudDays=null,activeContext=null,requestSeq=0;
  const recentAwardStickers=new Map(),recentActivityDays=new Set();
  function mountMap(main){
    const image=main.querySelector('.kp-learning-art');
    if(!image||image.dataset.recoveryBound)return;
    image.dataset.recoveryBound='1';
    const map=image.closest('.kp-learning-map');
    image.addEventListener('load',()=>{map.classList.remove('is-failed');});
    const recover=()=>{
      if(image.dataset.recoveryAttempt==='1'){map.classList.add('is-failed');return;}
      image.dataset.recoveryAttempt='1';
      const url=new URL(image.getAttribute('src'),document.baseURI);
      url.searchParams.set('kp_image_retry',String(Date.now()));
      image.src=url.href;
    };
    image.addEventListener('error',recover);
    if(image.complete&&!image.naturalWidth)recover();
  }
  function localDateKey(date){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');}
  function dailyRecord(){
    try{
      const record=typeof window.readDailyGoal==='function'?window.readDailyGoal():null;
      if(record&&Array.isArray(record.days))return record;
    }catch(_){}
    return {lastDay:'',streak:0,days:[]};
  }
  function consecutiveStreak(days){
    const set=new Set(days||[]),cursor=new Date();
    let key=localDateKey(cursor);
    if(!set.has(key)){cursor.setDate(cursor.getDate()-1);key=localDateKey(cursor);}
    let count=0;
    while(set.has(key)&&count<366){count++;cursor.setDate(cursor.getDate()-1);key=localDateKey(cursor);}
    return count;
  }
  function displayedDays(){
    if(dashboardStatus==='ready'&&Array.isArray(cloudDays))return cloudDays;
    if(dashboardStatus==='loading')return null;
    return dailyRecord().days;
  }
  const goalModel=window.KP_GOAL={
    key:'koepanda.continuous-goal.v2',
    read(){return window.KP_GOAL_STORE.read()},
    write(g){window.KP_GOAL_STORE.write(g)},
    date(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')},
    range(end){const a=[];for(const d=new Date();this.date(d)<=end;d.setDate(d.getDate()+1)){a.push(this.date(d));if(a.length>3660)break}return a},
    model(days){const set=new Set(days||[]),today=this.date(new Date()),d=new Date();if(!set.has(today))d.setDate(d.getDate()-1);let streak=0;while(set.has(this.date(d))&&streak<10000){streak++;d.setDate(d.getDate()-1)}const g=this.read(),base=Number.isInteger(g.base)?g.base:streak,options=[base+5,base+10,base+15];return {g,streak,options,remaining:g.target?Math.max(0,g.target-streak):0}},
    choose(target,days){const m=this.model(days),d=new Date();d.setDate(d.getDate()+Math.max(0,target-m.streak)-(new Set(days).has(this.date(d))?0:1));this.write({base:m.g.base??m.streak,target,end:this.date(d)});},
    summary(m){return m.g.target?`<b>目標：${m.g.target}日連続</b><p>あと ${m.remaining} 日 · 終了日 ${m.g.end.replaceAll('-','/')}</p>${m.remaining===0?'<small>目標達成！おめでとう！</small>':''}`:'<b>目標を設定しよう</b>'}
  };
  window.addEventListener('kp-goal-sync-changed',()=>{if(activeContext)activeContext.render()});
  window.addEventListener('kp-pinyin-chapter-state-changed',()=>{if(activeContext)activeContext.render()});
  function recordCard(){
    const days=displayedDays(),local=dailyRecord();
    const total=days===null?Math.max(0,Number(local.days?.length)||0):days.length;
    const goal=goalModel.model(days||local.days);
    const streak=days===null?'確認中…':dashboardStatus==='ready'?consecutiveStreak(days):(typeof window.currentStreak==='function'?window.currentStreak():Math.max(0,Number(local.streak)||0));
    return `<section class="kp-study-record" aria-label="学習の記録">
      <div class="kp-study-record-main"><span class="kp-study-flame" aria-hidden="true">🎋</span><div><b>次の目標</b><small>累計 ${days===null?'…':total} 日</small></div><strong>${streak}<small>${streak==='確認中…'?'':'日連続'}</small></strong></div>
      <div class="kp-study-goal-summary" role="status">${goalModel.summary(goal)}<small>${window.KP_GOAL_STORE.message()}</small></div>
      <div class="kp-study-goal-picker" aria-label="次の目標を選ぶ">${goal.options.map(value=>`<button type="button" class="kp-study-goal-option${goal.g.target===value?' is-selected':''}" data-action="select-goal" data-goal="${value}" aria-pressed="${goal.g.target===value}"><b>${value}日</b><small>あと ${Math.max(0,value-goal.streak)} 日</small></button>`).join('')}</div>
      <a href="#self" class="kp-study-link" data-action="open-records">${goal.g.target?'目標を変更':'連続目標を設定'} <span aria-hidden="true">›</span></a>
    </section>`;
  }
  function stampCard(state,STICKERS,img,safe){
    let countLabel,shown=[];
    if(dashboardStatus==='ready'&&Array.isArray(cloudStickers)){
      countLabel=cloudStickers.length+'枚';
      shown=cloudStickers.slice(-5).map(row=>STICKERS.find(item=>item.id===row.sticker_key)).filter(Boolean);
    }else if(dashboardStatus==='loading'||dashboardStatus==='idle'){
      countLabel='確認中…';
    }else if(dashboardStatus==='error'){
      countLabel='—';
    }else{
      const owned=STICKERS.filter(item=>state.unlocked.includes(item.id));
      countLabel=owned.length+'枚';shown=owned.slice(-5);
    }
    const stamps=shown.length?shown.map(item=>`<span class="kp-study-stamp" title="${safe(item.name)}"><img src="${img(item.id)}" alt="${safe(item.glyph)}"></span>`).join(''):`<span class="kp-study-stamp-empty">${dashboardStatus==='error'?'シールを読み込めませんでした':dashboardStatus==='loading'||dashboardStatus==='idle'?'シールを確認中…':'学習してシールを集めよう'}</span>`;
    return `<section class="kp-study-stamps" aria-label="集めたスタンプ"><div class="kp-study-stamps-head"><div><b>集めたスタンプ</b><small>${countLabel}</small></div><a href="#rewards" data-action="open-rewards">一覧を見る <span aria-hidden="true">›</span></a></div><div class="kp-study-stamp-row">${stamps}</div></section>`;
  }
  function pinyinContinueCard(safe){
    const chapterState=window.KP_PINYIN_CHAPTER_STATE;
    const lastUnit=chapterState?.read()?.lastUnit;
    const chapter=window.KP_PINYIN_PLAN_SCHEDULE?.units?.find(unit=>unit.id===lastUnit);
    if(chapter){
      const review=chapterState.reviewDue().slice(0,2);
      const readableTitle=title=>title==='三拼'?'三つの音をつなぐ練習':title==='四声の感じ'?'声の上がり下がりの練習':title;
      const reviewNames=review.map(id=>window.KP_PINYIN_PLAN_SCHEDULE?.units?.find(unit=>unit.id===id)?.title).filter(Boolean).map(readableTitle);
      const reviewLine=reviewNames.length?' · 今日のおさらい：'+reviewNames.join('・'):'';
      return `<section class="kp-pinyin-continue" aria-label="前回のつづき"><div><b>前回のつづき</b><small>${safe(readableTitle(chapter.title))}${safe(reviewLine)}</small></div><button type="button" data-action="pinyin-resume">つづきから学ぶ <span aria-hidden="true">›</span></button></section>`;
    }
    const vowels=['a','o','e','i','u','ü'];
    let passed=[];
    try{
      const mastery=JSON.parse(localStorage.getItem('koepandaVowelMastery69')||'{}');
      passed=vowels.filter(letter=>mastery?.[letter]?.passed===true);
    }catch(_){passed=[];}
    const next=vowels.find(letter=>!passed.includes(letter));
    const summary=passed.length
      ?`学習した母音：${passed.join(' · ')}（${passed.length}/6）`
      :'最初の目標：4つの声調を聞き分けよう';
    const label=passed.length?(next?`続きから学ぶ · ${next}`:'ピンインの復習へ'):'四声を学ぶ';
    const action=passed.length?'pinyin-course':'pinyin-tone-start';
    return `<section class="kp-pinyin-continue" aria-label="ピンイン学習の続き"><div><b>ピンインのぼうけん</b><small>${summary}</small></div><button type="button" data-action="${action}">${label} <span aria-hidden="true">›</span></button></section>`;
  }
  function mergeRecentAwards(rows){
    const result=new Map((rows||[]).map(row=>[row.id,row]));
    for(const [id,row] of recentAwardStickers)result.set(id,row);
    return [...result.values()].sort((a,b)=>String(a.obtained_at||'').localeCompare(String(b.obtained_at||'')));
  }
  window.addEventListener('kp-auth-state-changed',event=>{
    const nextUserId=event.detail?.user?.id||null;
    if(nextUserId===dashboardUserId&&(dashboardStatus==='guest'||dashboardStatus==='ready'||dashboardStatus==='loading'))return;
    dashboardStatus='idle';dashboardUserId=null;cloudStickers=null;cloudDays=null;recentAwardStickers.clear();recentActivityDays.clear();
    if(activeContext)activeContext.render();
  });
  window.addEventListener('kp-learning-activity-recorded',event=>{
    const detail=event.detail||{};
    if(detail.day)recentActivityDays.add(detail.day);
    (detail.stickers||[]).forEach(row=>{if(row&&row.id)recentAwardStickers.set(row.id,row);});
    if(Array.isArray(cloudDays))cloudDays=[...new Set([...cloudDays,...recentActivityDays])].sort();
    if(Array.isArray(cloudStickers))cloudStickers=mergeRecentAwards(cloudStickers);
    if(activeContext)activeContext.render();
  });
  const feature=window.KoepandaFeatures.learn=function({state,STICKERS,img,safe}){
    return `<section class="kp-learning-home" aria-label="学習ホーム">
      ${recordCard()}
      ${pinyinContinueCard(safe)}
      ${stampCard(state,STICKERS,img,safe)}
      <div class="kp-learning-map">
        <img class="kp-learning-art" src="./assets/home/koepanda-learning-roadmap.png?v=301.266" alt="ピンイン、漢字、中国語検定の学習ロード" width="739" height="1454" loading="eager" decoding="async" fetchpriority="high">
        <section class="kp-map-recovery" role="status"><p>学習マップを表示できませんでした。</p><button type="button" data-action="retry-home-map">マップをもう一度読み込む</button><button type="button" data-action="pinyin-course">ピンインのぼうけんへ</button><a href="./pre4.html">準4級のぼうけんへ</a><a href="./hanzi-practice.html">漢字のたんけんへ</a><a href="./help-station.html?v=10.108.301.64">手書き漢字辞典へ</a></section>
        <button type="button" class="kp-home-hotspot kp-home-pinyin" data-action="pinyin-course" aria-label="ピンインのぼうけんを始める"></button>
        <a class="kp-home-hotspot kp-help-station" href="./help-station.html?v=10.108.301.64" aria-label="小音の手書き漢字辞典：手書きで文字を調べる">
          <img src="./assets/home/help-station-handwriting-dictionary.svg?v=301.197" alt="" width="128" height="77">
        </a>
        <a class="kp-home-hotspot kp-home-hanzi" href="./hanzi-practice.html" aria-label="漢字のたんけんを開く"></a>
        <a class="kp-home-hotspot kp-home-pre4" href="./pre4.html" aria-label="準4級のぼうけんを開く"></a>
        <a class="kp-home-hotspot kp-home-grade4" href="./grade4.html" aria-label="4級のぼうけんを開く"></a>
        <button type="button" class="kp-home-hotspot kp-home-grade3" data-action="roadmap-coming" data-level="3級" aria-label="3級コースの案内"></button>
        <button type="button" class="kp-home-hotspot kp-home-grade2" data-action="roadmap-coming" data-level="2級" aria-label="2級コースの案内"></button>
        <button type="button" class="kp-home-hotspot kp-home-grade-pre1" data-action="roadmap-coming" data-level="準1級" aria-label="準1級コースの案内"></button>
        <button type="button" class="kp-home-hotspot kp-home-grade1" data-action="roadmap-coming" data-level="1級" aria-label="1級コースの案内"></button>
      </div>
    </section>`;
  };
  feature.mount=async ctx=>{
    mountMap(ctx.main);
    activeContext=ctx;
    if(dashboardStatus==='guest'||dashboardStatus==='loading'||dashboardStatus==='ready'||dashboardStatus==='error')return;
    dashboardStatus='loading';
    const request=++requestSeq;
    try{
      const api=window.KP_ACCOUNT_API,client=api&&await api.getClient();
      if(request!==requestSeq)return;
      if(!client){dashboardStatus='guest';cloudStickers=null;cloudDays=null;ctx.render();return;}
      const session=await client.auth.getSession();if(session?.error)throw session.error;
      const user=session?.data?.session?.user;
      if(request!==requestSeq)return;
      if(!user){dashboardStatus='guest';dashboardUserId=null;cloudStickers=null;cloudDays=null;ctx.render();return;}
      if(dashboardUserId===user.id&&dashboardStatus==='ready')return;
      dashboardUserId=user.id;dashboardStatus='loading';ctx.render();
      const [stickers,days]=await Promise.all([
        client.from('kp_user_stickers').select('id,sticker_key,obtained_at').eq('user_id',user.id).order('obtained_at',{ascending:true}),
        client.from('learning_days').select('study_date').eq('user_id',user.id).order('study_date',{ascending:true}).limit(1000)
      ]);
      if(request!==requestSeq)return;
      if(stickers.error)throw stickers.error;if(days.error)throw days.error;
      cloudStickers=mergeRecentAwards(stickers.data||[]);
      cloudDays=[...new Set([...(days.data||[]).map(row=>row.study_date),...recentActivityDays])].sort();
      dashboardStatus='ready';ctx.render();
    }catch(error){
      if(request!==requestSeq)return;
      dashboardStatus='error';console.warn('[Koepanda] learning dashboard load failed:',error);ctx.render();
    }
  };
  feature.actions={
    'retry-home-map':ctx=>{
      const image=ctx.root.querySelector('.kp-learning-art');if(!image)return;
      image.dataset.recoveryAttempt='0';
      const url=new URL(image.getAttribute('src'),document.baseURI);url.searchParams.set('kp_image_retry',String(Date.now()));image.src=url.href;
    },
    'select-goal':(ctx,button)=>{goalModel.choose(Number(button.dataset.goal),displayedDays()||dailyRecord().days);ctx.render();},
    'open-records':(ctx,button,event)=>{event.preventDefault();ctx.setPage('records');ctx.render();},
    'open-rewards':(ctx,button,event)=>{event.preventDefault();ctx.setPage('rewards');ctx.render();},
    'roadmap-coming':(ctx,button)=>ctx.modal(`${ctx.safe(button.dataset.level)}コース`,`<p class="kp-modal-copy">このコースは準備中です。公開後、この島から学習を始められます。</p><button class="kp-primary" data-action="modal-close">閉じる</button>`)
  };
})();
} catch (error) { console.error("[Koepanda] startup module failed: js/features/learn.js", error); }

/* Source: js/features/practice.js */
try {
(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  function renderChapterPractice(data,safe){
    if(!data)return `<section class="kp-section kp-chapter-practice"><div class="kp-section-title"><h2>今の章を復習</h2><span>学習順に進むコース練習</span></div><p class="kp-chapter-loading">準4級の章を読み込んでいます…</p></section>`;
    if(data.error)return `<section class="kp-section kp-chapter-practice"><div class="kp-section-title"><h2>今の章を復習</h2></div><p class="kp-chapter-loading">章の練習を読み込めませんでした。学習ページから続けてください。</p></section>`;
    const u=data.currentUnit;
    const completed=data.completed||[];
    const completedList=completed.length?`<details class="kp-chapter-past"><summary>修了した章を練習する（${completed.length}）</summary>${completed.map(x=>`<button data-action="chapter-practice" data-unit="${safe(x.unit_id)}" data-mode="meaning"><span>${safe(x.title_ja)}</span><small>ことば・意味に再挑戦</small></button>`).join('')}</details>`:'';
    return `<section class="kp-section kp-chapter-practice"><div class="kp-section-title"><h2>今の章を復習</h2><span>今学んでいる章から5問ずつ</span></div><article class="kp-chapter-current"><span class="kp-eyebrow">${data.isComplete?'修了した章':'次のチャレンジ'} · ${String(u.index+1).padStart(2,'0')}</span><h3>${safe(u.title_ja)}</h3><p>${u.wordCount}語・${u.characterCount}字から出題。学習中の章を、3つの方法で復習できます。</p><div class="kp-chapter-modes"><button data-action="chapter-practice" data-unit="${safe(u.unit_id)}" data-mode="word"><b>絵からことば</b><small>場面を見て、ぴったりの中国語を選ぶ</small></button><button data-action="chapter-practice" data-unit="${safe(u.unit_id)}" data-mode="reading"><b>読み方パズル</b><small>漢字に合うピンインと声調を選ぶ</small></button><button data-action="chapter-practice" data-unit="${safe(u.unit_id)}" data-mode="meaning"><b>意味を思い出す</b><small>中国語から日本語の意味を選ぶ</small></button></div></article>${completedList}${data.lockedCount?`<p class="kp-chapter-footnote">次の章は、今の章の学習を終えると開きます。</p>`:''}</section>`;
  }
  function renderPracticeTracks(catalog,completed,safe){
    if(!catalog)return `<section class="kp-practice-routes"><p class="kp-chapter-loading">練習コースを準備しています…</p></section>`;
    const routes=[
      {id:'chapter',icon:'🗺️',title:'学習章の練習',description:'学習した章を、読み・意味・ことばのミッションで復習',meta:`${catalog.unit_summaries?.length||11}章`},
      {id:'daily',icon:'💬',title:'日常でよく使う中国語',description:'よく使うひとことを聞いて、声に出して練習',meta:'テーマ別'},
      {id:'scenario',icon:'🎭',title:'場面練習',description:'食事・移動・買い物など、場面ごとの会話を練習',meta:`${catalog.scenario_activities?.length||0}場面`}
    ];
    return `<section class="kp-practice-routes" aria-label="練習コース"><div class="kp-practice-route-grid">${routes.map(route=>`<button class="kp-practice-route kp-route-${route.id}" data-action="practice-route" data-track="${route.id}"><span class="kp-route-icon" aria-hidden="true">${route.icon}</span><span class="kp-route-copy"><b>${safe(route.title)}</b><small>${safe(route.description)}</small><em>${safe(route.meta)}</em></span><span class="kp-route-arrow" aria-hidden="true">›</span></button>`).join('')}</div></section>`;
  }
  window.KoepandaFeatures.practice = function({head,state,safe,QUESTIONS}){
    return `${head('どの練習にする？','練習ひろば','好きなコースを選んで、ゆっくり進もう。')}<div class="kp-practice-welcome"><span aria-hidden="true">🌱</span><p>ひとつずつで大丈夫。気になる練習からはじめよう。</p></div><section class="kp-practice-routes" aria-label="復習"><div class="kp-practice-route-grid"><button class="kp-practice-route" data-action="pinyin-due-review"><span class="kp-route-copy"><b>ピンインの今日の復習</b><small>聞きまちがえた音をもう一度</small></span></button><button class="kp-practice-route" data-action="review"><span class="kp-route-copy"><b>ことば・会話の復習</b><small>まちがいノートをひらく</small></span></button></div></section>${renderPracticeTracks(state.practiceCatalog,state.completedUnitIds||[],safe)}`;
  }
  window.KoepandaFeatures.practice.mount=function(ctx){
    const requestedAction=new URLSearchParams(location.search);
    if(ctx.state.practiceCatalog&&!ctx.state.practiceAutoAction&&requestedAction.get('review')==='1'){ctx.state.practiceAutoAction=true;setTimeout(()=>review(ctx),0)}
    if(ctx.state.practiceCatalog&&!ctx.state.practiceAutoAction&&requestedAction.get('quiz')==='1'){ctx.state.practiceAutoAction=true;setTimeout(()=>startQuiz(ctx),0)}
    if(!ctx.state.practiceCatalogLoading&&!ctx.state.practiceCatalog){ctx.state.practiceCatalogLoading=true;fetch('./data/practice-catalog-0.1.json?v=301.240').then(response=>{if(!response.ok)throw new Error('practice_catalog_unavailable');return response.json()}).then(catalog=>{ctx.state.practiceCatalog=catalog;ctx.state.practiceCatalogLoading=false;ctx.render()}).catch(error=>{console.warn('[Koepanda] practice catalog unavailable:',error);ctx.state.practiceCatalog={tracks:[],themes:[],daily_activities:[],scenario_activities:[]};ctx.state.practiceCatalogLoading=false;ctx.render()})}
    const progressKey='koepanda.hanzi.unit-progress.v1';try{const ids=JSON.parse(localStorage.getItem(progressKey)||'[]');if(Array.isArray(ids))ctx.state.completedUnitIds=ids.filter(x=>typeof x==='string')}catch(_){}
  };
  const QUESTIONS=[
    {id:'nihao',q:'「你好」はどんなあいさつ？',a:['こんにちは','ありがとう','おやすみ'],correct:0,sticker:'a',why:'你好（nǐ hǎo）は相手に会ったときのあいさつ。ありがとうは「谢谢」です。'},
    {id:'shui',q:'「水」の意味は？',a:['山','水','人'],correct:1,sticker:'shui',why:'水（shuǐ）は飲む水。山は shān、人は rén です。'},
    {id:'ren',q:'「人」のピンインは？',a:['rén','shuǐ','hǎo'],correct:0,sticker:'ren',why:'人は rén（2声）。低めから上げる音です。shuǐ は水、hǎo は好です。'},
    {id:'hao',q:'「好」の意味に近いのは？',a:['よい','大きい','あした'],correct:0,sticker:'hao',why:'好（hǎo）は「よい・好き」の意味。大きいは「大」、明日は「明天」です。'},
    {id:'shan',q:'「山」のピンインは？',a:['mā','shān','nǐ'],correct:1,sticker:'shan',why:'山は shān（1声）。高い声を平らに保ちます。mā と nǐ は別の音です。'}
  ];
  let quizIndex=0,quizSet=[],quizMode='challenge',quizClaimToken=null,quizScore=0;
  window.KoepandaFeatures.practice.actions={
    quiz:ctx=>startQuiz(ctx),
    'chapter-practice':(ctx,b)=>{const params=new URLSearchParams({track:'chapter',unit:b.dataset.unit,mode:b.dataset.mode});window.location.href='./practice-session.html?'+params.toString();},
    'practice-route':(ctx,b)=>{if(b.getAttribute('aria-disabled')==='true')return;window.location.href='./practice-routes.html?track='+encodeURIComponent(b.dataset.track);},
    review:ctx=>review(ctx),
    'quiz-answer':(ctx,b)=>answer(ctx,+b.dataset.answer),
    'quiz-next':ctx=>nextQuestion(ctx),
    'finish-quiz':ctx=>finishQuiz(ctx),
    'sticker-award-retry':ctx=>window.KoepandaRewardReveal?.award(ctx,{claimToken:quizClaimToken,score:quizScore,total:quizSet.length,activityKey:'practice.mini-quiz'})
  };
  window.KoepandaFeatures.practice.questions=QUESTIONS;
  function startQuiz(ctx){quizMode='challenge';quizClaimToken=newClaimToken();quizScore=0;quizSet=QUESTIONS.map((q,i)=>i).sort(()=>Math.random()-.5);quizIndex=0;renderQuiz(ctx);}
  function renderQuiz(ctx,feedback){const main=ctx.root.querySelector('#kpFeatureMain'),q=QUESTIONS[quizSet[quizIndex]];main.innerHTML=`${ctx.head('ミニクイズ',quizMode==='review'?'まちがい復習':'5問チャレンジ','答えた問題は、次の復習タイミングに反映するよ。')}<div class="kp-quiz-progress"><span style="width:${(quizIndex/quizSet.length)*100}%"></span></div><section class="kp-quiz-card"><span class="kp-eyebrow">${quizIndex+1} / ${quizSet.length} 問</span><h2>${q.q}</h2><div class="kp-quiz-options">${q.a.map((x,i)=>`<button data-action="quiz-answer" data-answer="${i}" ${feedback?'disabled':''}>${ctx.safe(x)}${feedback&&i===q.correct?' ✓':''}${feedback&&i===feedback.selected&&!feedback.ok?' ✕':''}</button>`).join('')}</div>${feedback?`<div class="kp-quiz-feedback ${feedback.ok?'good':'again'}" role="status">${feedback.ok?'せいかい！ ✨':'おしい！ 正解は「'+ctx.safe(q.a[q.correct])+'」です。'}<p class="kp-quiz-explanation">${ctx.safe(q.why)}</p><button data-action="quiz-next" class="kp-primary">${quizIndex===quizSet.length-1?'結果を見る':'つぎへ'}</button></div>`:''}</section><button class="kp-text-button" data-go="practice">練習ひろばへ戻る</button>`;}
  function answer(ctx,index){const q=QUESTIONS[quizSet[quizIndex]],ok=index===q.correct;ctx.state.lastQuiz=Date.now();recordAttempt(q.id,'intro-mini-quiz',ok);if(ok){quizScore++;ctx.state.mastered[q.id]=(ctx.state.mastered[q.id]||0)+1;const old=ctx.state.wrongs[q.id];if(old){old.streak=(old.streak||0)+1;if(old.streak>=5)delete ctx.state.wrongs[q.id];else{const intervals=[3,7,14,30];old.due=Date.now()+intervals[Math.min(old.streak-1,intervals.length-1)]*86400000;}}}else{const old=ctx.state.wrongs[q.id]||{count:0,streak:0};old.count++;old.streak=0;old.due=Date.now()+86400000;old.question=q.id;ctx.state.wrongs[q.id]=old;}ctx.save();renderQuiz(ctx,{ok,selected:index});}
  function recordAttempt(itemKey,courseKey,isCorrect){
    const api=window.KP_ACCOUNT_API;
    if(api&&typeof api.recordPracticeAttempt==='function')api.recordPracticeAttempt('quiz:'+itemKey,courseKey,isCorrect).catch(error=>console.warn('[Koepanda] answer sync unavailable:',error));
  }
  function nextQuestion(ctx){quizIndex++;if(quizIndex>=quizSet.length){finishQuiz(ctx);return;}renderQuiz(ctx);}
  function finishQuiz(ctx){
    ctx.save();
    const isFullChallenge=quizMode==='challenge'&&quizSet.length===QUESTIONS.length;
    if(isFullChallenge&&window.KoepandaRewardReveal&&typeof window.koepandaShowResultCelebration==='function'){
      window.koepandaShowResultCelebration({score:quizScore,total:quizSet.length,kicker:'ミニクイズ',title:'チャレンジ完了！',__kpRewardContext:ctx,__kpRewardClaimToken:quizClaimToken,__kpRewardActivityKey:'practice.mini-quiz'});
      return;
    }
    ctx.setPage('practice');ctx.render();
    ctx.modal('チャレンジできたね！',`<p class="kp-modal-copy">復習する問題をまちがいノートに入れました。</p><button data-action="modal-close" class="kp-primary">とじる</button>`);
  }
  function newClaimToken(){if(window.crypto?.randomUUID)return window.crypto.randomUUID();return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16);});}
  async function review(ctx){
    const api=window.KP_ACCOUNT_API;
    if(api&&typeof api.getPracticeReviewQueue==='function'){
      let cloudRows=null;
      try{
        const queue=await api.getPracticeReviewQueue();
        const rows=queue?.filter(row=>row.course_key!=='pinyin-listening')??null;
        if(Array.isArray(rows)){cloudRows=rows;const dueRows=rows.filter(x=>new Date(x.due_at).getTime()<=Date.now());if(dueRows.length){
          const row=dueRows[0];
          if(row.item_key.startsWith('pre4-char:')&&row.course_key==='hanzi-basic'){
            const params=new URLSearchParams({review:row.item_key,course:row.course_key});window.location.href='./hanzi-practice.html?'+params.toString();return;
          }
          if(row.item_key.startsWith('pre4-prep:')||row.item_key.startsWith('pre4-entry:')||row.item_key.startsWith('pre4-char:')||row.item_key.startsWith('daily:')||row.item_key.startsWith('scenario:')||row.item_key.startsWith('dialogue:')){
            const params=new URLSearchParams({review:row.item_key,course:row.course_key});window.location.href='./practice-session.html?'+params.toString();return;
          }
          const q=QUESTIONS.find(x=>'quiz:'+x.id===row.item_key);
          if(q){quizMode='review';quizClaimToken=null;quizSet=dueRows.map(item=>QUESTIONS.findIndex(x=>'quiz:'+x.id===item.item_key)).filter(i=>i>=0).slice(0,5);quizScore=0;quizIndex=0;renderQuiz(ctx);return;}
        }
        }
        if(rows===null)throw new Error('signed_out');
        if(cloudRows&&cloudRows.length){const nextAt=new Date(cloudRows[0].due_at);ctx.modal('次の復習まで待とう',`<p class="kp-modal-copy">記録した問題は${new Intl.DateTimeFormat('ja-JP',{month:'numeric',day:'numeric'}).format(nextAt)}から復習できます。未復習の問題は消えずに残ります。</p><button data-action="modal-close" class="kp-primary">わかった</button>`);return;}
      }catch(error){if(error.message!=='signed_out')console.warn('[Koepanda] cloud review unavailable:',error);}
    }
    const due=Object.values(ctx.state.wrongs).filter(x=>x.due<=Date.now());
    if(!due.length){ctx.modal('まちがいノート',`<p class="kp-modal-copy">今は復習する問題がないよ。学習ページの単元練習かミニクイズに挑戦してみよう。</p><button data-action="modal-close" class="kp-primary">とじる</button>`);return;}
    quizSet=due.map(item=>QUESTIONS.findIndex(x=>x.id===item.question)).filter(i=>i>=0).slice(0,5);if(!quizSet.length)return;quizMode='review';quizClaimToken=null;quizScore=0;quizIndex=0;renderQuiz(ctx);
  }
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/features/practice.js", error); }

/* Source: js/features/reward-reveal.js */
try {
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
  function playFanfare(modeKey){const ctx=prepareRewardAudio();if(!ctx)return false;if(ctx.state!=='running'){ctx.resume().then(()=>{if(ctx.state==='running'&&soundEnabled())playFanfare(modeKey);}).catch(()=>{});return false;}stopFanfare();const now=ctx.currentTime+.03,notes=[523.25,659.25,783.99,1046.5,783.99,1046.5,1318.51,1567.98];notes.forEach((note,i)=>{const at=now+[0,.16,.32,.52,.82,1.02,1.22,1.48][i];playNote(ctx,note,at,i===7?.85:.3,i===7?'triangle':'sine',i===7?.11:.07);if(i===3||i===7){playNote(ctx,note/2,at,.75,'triangle',.05);playNote(ctx,note*1.25,at,.6,'sine',.035);}});return true;}
  function playCompletionFanfare(){
    if(!soundEnabled())return;
    const ctx=prepareRewardAudio();if(!ctx||ctx.state!=='running')return;
    stopFanfare();
    const start=ctx.currentTime+.05;
    // Original three-part victory fanfare: low pulse, brass-like melody, full final chord.
    const melody=[[392,0,.32],[523.25,.24,.32],[659.25,.48,.45],[783.99,.87,.32],[659.25,1.12,.26],[880,1.38,.39],[1046.5,1.74,1.35]];
    melody.forEach(([note,offset,length],i)=>{
      playNote(ctx,note,start+offset,length,'sawtooth',i===6?.058:.043);
      playNote(ctx,note/2,start+offset,length+.09,'triangle',i===6?.075:.038);
    });
    [0,.48,.98,1.48].forEach(offset=>{playNote(ctx,130.81,start+offset,.2,'triangle',.09);playNote(ctx,261.63,start+offset,.14,'sine',.05);});
    [523.25,659.25,783.99,1046.5].forEach(note=>playNote(ctx,note,start+1.74,1.3,'sine',.05));
  }
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
        node.querySelector('.kp-reward-brand').textContent='KOEPANDA · REWARD TIME';
        node.querySelector('.kp-reward-subtitle').textContent='どんなシールかな？';
        node.querySelector('.kp-reward-box').classList.add('is-open');
        node.classList.remove('is-loading');node.classList.add('has-rewards');
        const figures=[...node.querySelectorAll('.kp-reveal-sticker')];
        figures.slice(1).forEach(figure=>figure.hidden=true);
        figures.forEach((figure,i)=>{
          const reducedMotion=window.matchMedia(MOTION_QUERY).matches;
          const delay=reducedMotion?i*450:700+i*2500;
          setTimeout(()=>{
            if(active?.node!==node)return;
            figure.hidden=false;
            figure.classList.remove('is-sealed');
            if(soundEnabled()&&(i===0||i===figures.length-1))playFanfare(modeKey);
            setTimeout(()=>{
              if(active?.node!==node)return;
              figure.classList.add('is-revealed');
              if(figures.length>1&&i===0)node.querySelector('.kp-reward-subtitle').textContent='あれ？ まだ何かあるみたい…！';
              if(i===figures.length-1){node.querySelector('.kp-reward-brand').textContent=eventName?String(eventName).toUpperCase()+' · SPECIAL DROP':mode.label;node.querySelector('.kp-reward-subtitle').textContent=figures.length>1?'やったね！ ごほうびが2枚！':'シール帳に新しいシールが届いたよ';}
            },reducedMotion?0:550);
          },delay);
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
      const eligible=config&&typeof config==='object'&&config.passed!==false&&!config.__kpRewardIssued&&Number.isFinite(Number(config.score))&&Number.isFinite(Number(config.total));
      let claimToken=null;
      if(eligible){
        if(soundEnabled())prepareRewardAudio();
        claimToken=config.__kpRewardClaimToken||token();
        config.__kpRewardIssued=true;
        config.__kpRewardClaimToken=claimToken;
      }
      if(eligible){
        const previousOnClose=config.onClose;
        let transitioned=false;
        config.onClose=function(){
          try{if(typeof previousOnClose==='function')previousOnClose();}
          finally{if(!transitioned){transitioned=true;window.setTimeout(()=>{const context=config.__kpRewardContext||window.KP_REWARD_CONTEXT?.();if(context)award(context,{claimToken,score:Number(config.score),total:Number(config.total),activityKey:config.__kpRewardActivityKey||'course.quiz.complete'});},330);}}
        };
        playCompletionFanfare();
      }
      const result=show.apply(this,arguments);
      return result;
    };
    wrapped.__kpRewardHooked=true;
    window.koepandaShowResultCelebration=wrapped;
  }
  window.KoepandaRewardReveal={award,installCourseResultHook,modes:Object.keys(PRESENTATION_MODES)};
  installCourseResultHook();
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/features/reward-reveal.js", error); }

/* Source: js/features/story.js */
try {
(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  const STORIES=[
    {id:'hanzi-origin',title:'漢字のはじまり',subtitle:'絵から生まれた文字の物語',theme:'文字の歴史',image:'hanzi-origin.png',caption:'倉頡は足あとや鳥の姿を観察し、見たものを絵にしました。',tone:'amber',summary:'むかしの人は、見たものをどのように文字にしたのでしょう。',lines:[
      {zh:'很久以前，中国人还没有现在这样的文字。',py:'Hěn jiǔ yǐ qián Zhōng guó rén hái méi yǒu xiàn zài zhè yàng de wén zì',ja:'ずっと昔、中国には今のような文字がまだありませんでした。'},
      {zh:'传说，仓颉观察鸟兽的脚印和山川的形状，试着把看到的样子画下来。',py:'Chuán shuō Cāng jié guān chá niǎo shòu de jiǎo yìn hé shān chuān de xíng zhuàng shì zhe bǎ kàn dào de yàng zi huà xià lái',ja:'伝説によると、倉頡は鳥や動物の足あと、山や川の形を観察し、見たものを絵にしました。'},
      {zh:'一条条图形慢慢变成了早期的文字。',py:'Yì tiáo tiáo tú xíng màn màn biàn chéng le zǎo qī de wén zì',ja:'絵は少しずつ、初期の文字になっていきました。'},
      {zh:'后来，人们把汉字写在甲骨、竹简和纸上。',py:'Hòu lái rén men bǎ Hàn zì xiě zài jiǎ gǔ zhú jiǎn hé zhǐ shàng',ja:'その後、人々は漢字を甲骨や竹簡、紙に書くようになりました。'},
      {zh:'一个个小小的文字，像种子一样长大，慢慢走进了今天的一本本书。',py:'Yí gè gè xiǎo xiǎo de wén zì xiàng zhǒng zi yí yàng zhǎng dà màn màn zǒu jìn le jīn tiān de yì běn běn shū',ja:'小さな文字は種のように育ち、やがて今の本の一ページ一ページへと広がっていきました。'}
    ]},
    {id:'movable-type',title:'活字印刷の発明',subtitle:'一つずつの文字から、本が生まれる',theme:'発明ものがたり',image:'movable-type.png',caption:'畢昇は一字ずつの粘土の活字を並べて、本を印刷しました。',tone:'mint',summary:'北宋の職人・畢昇が考えた、くり返し使える印刷の工夫です。',lines:[
      {zh:'北宋时期，工匠毕昇发明了活字印刷。',py:'Běi Sòng shí qī gōng jiàng Bì Shēng fā míng le huó zì yìn shuā',ja:'北宋の時代、職人の畢昇が活字印刷を発明しました。'},
      {zh:'他把一个个汉字刻在小小的泥块上，再烧硬。',py:'Tā bǎ yí gè gè Hàn zì kè zài xiǎo xiǎo de ní kuài shàng zài shāo yìng',ja:'一つずつの漢字を小さな粘土のかけらに刻み、焼いて固めました。'},
      {zh:'印书的时候，人们把字块排在一起，涂上墨，盖上纸。',py:'Yìn shū de shí hou rén men bǎ zì kuài pái zài yì qǐ tú shàng mò gài shàng zhǐ',ja:'本を印刷するときは、字のブロックを並べ、墨をつけて紙を重ねます。'},
      {zh:'印完以后，字块还可以拆下来，重新排列。',py:'Yìn wán yǐ hòu zì kuài hái kě yǐ chāi xià lái chóng xīn pái liè',ja:'印刷が終わったら、字のブロックを外して、別の順に並べ直せます。'},
      {zh:'这些小字块像排队的小士兵，把故事印在纸上。后来，印刷技术越走越快，变成了今天的自动印刷。',py:'Zhè xiē xiǎo zì kuài xiàng pái duì de xiǎo shì bīng bǎ gù shi yìn zài zhǐ shàng Hòu lái yìn shuā jì shù yuè zǒu yuè kuài biàn chéng le jīn tiān de zì dòng yìn shuā',ja:'小さな活字たちは、整列する兵隊のように物語を紙に写しました。その技術は進歩を重ね、今の高速な自動印刷へとつながっています。'}
    ]},
    {id:'three-kingdoms',title:'三国志のなかまたち',subtitle:'三つの国がならび立った時代',theme:'歴史のぼうけん',image:'three-kingdoms.png',caption:'桃園で出会った三人と、知恵を出し合う諸葛亮。',tone:'violet',summary:'魏・蜀・呉の時代に生まれた、友情と知恵の物語です。',lines:[
      {zh:'很久以前，中国出现了魏、蜀、吴三个国家。',py:'Hěn jiǔ yǐ qián Zhōng guó chū xiàn le Wèi Shǔ Wú sān gè guó jiā',ja:'ずっと昔、中国には魏・蜀・呉という三つの国がありました。'},
      {zh:'刘备、关羽和张飞在桃园相识，结为兄弟。',py:'Liú Bèi Guān Yǔ hé Zhāng Fēi zài Táo yuán xiāng shí jié wéi xiōng dì',ja:'劉備・関羽・張飛は桃園で出会い、兄弟のちぎりを結びました。'},
      {zh:'诸葛亮帮助刘备制定计划，也常常想办法解决困难。',py:'Zhū gě Liàng bāng zhù Liú Bèi zhì dìng jì huà yě cháng cháng xiǎng bàn fǎ jiě jué kùn nán',ja:'諸葛亮は劉備の計画を助け、知恵を使って困りごとを解決しました。'},
      {zh:'三个国家时而合作，时而交战，留下了许多有名的故事。',py:'Sān gè guó jiā shí ér hé zuò shí ér jiāo zhàn liú xià le xǔ duō yǒu míng de gù shi',ja:'三つの国は協力したり戦ったりしながら、たくさんの物語を残しました。'},
      {zh:'直到今天，刘备和朋友们还在书本、戏台和动画里继续他们的冒险。',py:'Zhí dào jīn tiān Liú Bèi hé péng you men hái zài shū běn xì tái hé dòng huà lǐ jì xù tā men de mào xiǎn',ja:'今でも劉備たちは、本やお芝居、アニメの中で冒険を続けているようです。'}
    ]}
  ];
  let activeUtterance=null;
  let selectedId=null,rate=.22,playToken=0,isPlaying=false,isPaused=false,lastCompletedId=null,fallbackTimers=[],highlightState=null,currentLine=0,resumeLine=null,currentContext=null;
  const safe=value=>String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const selected=()=>STORIES.find(s=>s.id===selectedId);
  function clearFallback(){fallbackTimers.forEach(id=>{clearTimeout(id);clearInterval(id)});fallbackTimers=[];highlightState=null;}
  function clearHighlights(){document.querySelectorAll('.kp-story-line.is-speaking,.kp-story-char.is-speaking-char').forEach(el=>el.classList.remove('is-speaking','is-speaking-char'));}
  function syncPlayButton(){const button=document.querySelector('[data-action="story-toggle"]');if(!button)return;button.innerHTML=isPlaying?(isPaused?'▶　再開':'Ⅱ　一時停止'):(resumeLine!==null?'▶　この文から再開':'▶　物語を聞く');button.setAttribute('aria-label',isPlaying?(isPaused?'再生を再開':'物語を一時停止'):(resumeLine!==null?'この文から再開':'物語を聞く'));}
  function stop(){activeUtterance=null;playToken++;isPlaying=false;isPaused=false;clearFallback();if('speechSynthesis'in window)window.speechSynthesis.cancel();clearHighlights();syncPlayButton();}
  window.addEventListener('kp-story-lookup-open',()=>{if(isPlaying)resumeLine=currentLine;stop();});
  function escapeClick(e){if(e.target.closest('.kp-feature-nav [data-go],.kp-brand[data-go]'))stop();}
  if(!window.__kpStoryStopBound){document.addEventListener('click',escapeClick,true);window.addEventListener('pagehide',stop);window.__kpStoryStopBound=true;}
  function storyImage(s,kind){return `<img class="${kind}" src="./assets/story/${safe(s.image)}" alt="${safe(s.caption)}" loading="lazy">`;}
  function listMarkup(head){return `${head('物語で中国語にふれよう','ストーリー','絵を見ながら中国語を聞く、短い読みもの。')}<p class="kp-story-prototype-note kp-story-record-note">一篇を最後まで聞くと、今日の学習として記録されます。</p><section class="kp-story-intro"><img src="./assets/brand/xiaoyin-mascot.png" alt="小音"><div><b>絵を見ながら聞いてみよう</b><p>全文のピンインを一字ずつ表示。読み上げ中の文字が光ります。</p></div></section><section class="kp-story-list" aria-label="ストーリー一覧">${STORIES.map(s=>`<button type="button" class="kp-story-choice tone-${s.tone}" data-action="story-open" data-story="${s.id}">${storyImage(s,'kp-story-choice-image')}<span class="kp-story-choice-copy"><small>${safe(s.theme)}</small><b>${safe(s.title)}</b><span>${safe(s.summary)}</span></span><span class="kp-story-choice-arrow" aria-hidden="true">›</span></button>`).join('')}</section>`;}
  function lineMarkup(line,index){let syllables=line.py.trim().split(/\s+/),pyIndex=0;const chars=[...line.zh].map((char,charIndex)=>{const han=/\p{Script=Han}/u.test(char),py=han?(syllables[pyIndex++]||''):'';return `<span class="kp-story-char${han?'':' is-punct'}" data-audio-char-index="${charIndex}"><small>${safe(py)}</small><b>${safe(char)}</b></span>`;}).join('');return `<article class="kp-story-line" data-story-line="${index}"><p class="kp-story-hanzi" lang="zh-CN">${chars}</p><p class="kp-story-translation" lang="ja">${safe(line.ja)}</p></article>`;}
  function articleMarkup(head,s){const text=s.lines.map((line,i)=>lineMarkup(line,i)+(i===1?`<figure class="kp-story-comic">${storyImage(s,'kp-story-comic-image')}<figcaption>${safe(s.caption)}</figcaption></figure>`:'')).join('');return `${head('ストーリー','聞いて読む','全文を表示。読み上げ中の漢字が一字ずつ光ります。')}<button type="button" class="kp-story-back" data-action="story-back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 5-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>ストーリー一覧</span></button><section class="kp-story-article tone-${s.tone}"><header class="kp-story-article-hero"><div><small>${safe(s.theme)}</small><h2>${safe(s.title)}</h2><p>${safe(s.subtitle)}</p></div></header><p class="kp-story-prototype-note">一篇を最後まで聞くと、今日の学習として記録されます。</p><p class="kp-story-summary">${safe(s.summary)}</p><div class="kp-story-lines">${text}</div>${lastCompletedId===s.id?'<p class="kp-story-done" role="status">🎉 最後まで聞けたね！今日の学習を記録しました。</p>':''}</section><div class="kp-story-player" role="group" aria-label="ストーリー再生"><button type="button" class="kp-story-play" data-action="story-toggle">▶　物語を聞く</button><label class="kp-story-speed">速度<select data-action="story-rate" aria-label="再生速度"><option value="0.22" ${rate===.22?'selected':''}>ゆっくり</option><option value="0.45" ${rate===.45?'selected':''}>ふつう</option></select></label><button type="button" class="kp-story-return" data-action="story-back" aria-label="ストーリー一覧へ戻る"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 5-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><p class="kp-story-status" data-story-status role="status" aria-live="polite">${rate===.22?'ゆっくり':'ふつう'}再生を選択中です。</p>`;}
  function feature({head}){const s=selected();return s?articleMarkup(head,s):listMarkup(head);}
  function storyVisibleBounds(){
    const player=document.querySelector('.kp-story-player');
    const nav=document.querySelector('.kp-feature-nav');
    const viewport=window.visualViewport?.height||window.innerHeight;
    return {top:Math.max(12,(nav?.getBoundingClientRect().bottom||0)+12),bottom:Math.min(viewport-18,(player?.getBoundingClientRect().top||viewport)-18)};
  }
  function focusStoryLine(line){
    if(!line)return;
    const rect=line.getBoundingClientRect(),band=storyVisibleBounds();
    if(rect.top<band.top||rect.bottom>band.bottom)line.scrollIntoView({behavior:'auto',block:'start'});
  }
  function activeChar(lineIndex,charIndex,length=1){
    const line=document.querySelector(`[data-story-line="${lineIndex}"]`);if(!line)return;
    let focus=null;
    line.querySelectorAll('.kp-story-char').forEach((el,i)=>{
      const active=i>=charIndex&&i<charIndex+length;
      el.classList.toggle('is-speaking-char',active);
      if(active&&!focus)focus=el;
    });
    line.classList.add('is-speaking');
    if(focus&&isPlaying){const rect=focus.getBoundingClientRect(),band=storyVisibleBounds();
      if(rect.top<band.top||rect.bottom>band.bottom)focus.scrollIntoView({behavior:'smooth',block:'center'});
    }
  }
  function fallbackHighlight(lineIndex,line,token){clearFallback();const chars=[...line.zh];highlightState={lineIndex,chars,index:-1,token};const state=highlightState,interval=Math.round(210/rate);activeChar(lineIndex,0);state.index=0;const timer=setInterval(()=>{if(isPaused)return;if(token!==playToken||highlightState!==state){clearInterval(timer);return;}if(state.index<chars.length-1){state.index++;activeChar(lineIndex,state.index);}else{clearInterval(timer);}},interval);fallbackTimers.push(timer);}
  function completeFallback(token,done){const state=highlightState;if(!state||state.token!==token){done();return;}fallbackTimers.forEach(clearInterval);fallbackTimers=[];const advance=()=>{if(token!==playToken||highlightState!==state)return;if(state.index<state.chars.length-1){state.index++;activeChar(state.lineIndex,state.index);const timer=setTimeout(advance,75);fallbackTimers.push(timer);}else{highlightState=null;done();}};advance();}
  function persistStoryDay(day){Promise.resolve().then(async()=>{try{const api=window.KP_ACCOUNT_API,client=api&&await api.getClient();if(!client)return;const session=await client.auth.getSession(),user=session?.data?.session?.user;if(!user)return;const result=await client.from('learning_days').insert({user_id:user.id,study_date:day,source:'completed_story'});if(result.error&&result.error.code!=='23505')throw result.error;}catch(error){console.warn('[Koepanda] story day sync failed:',error);}});}
  function finishStory(s,ctx){lastCompletedId=s.id;const today=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Tokyo'}));const day=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');if(typeof window.completeDailyGoal==='function')window.completeDailyGoal();persistStoryDay(day);window.dispatchEvent(new CustomEvent('kp-learning-activity-recorded',{detail:{day,source:'story',unitId:s.id}}));ctx.render();}
  function speakAt(index,token,s,ctx){if(token!==playToken)return;currentLine=index;currentContext=ctx;if(index>=s.lines.length){stop();finishStory(s,ctx);return;}const lineData=s.lines[index],line=document.querySelector(`[data-story-line="${index}"]`);document.querySelectorAll('.kp-story-line').forEach(el=>el.classList.toggle('is-speaking',el===line));focusStoryLine(line);const status=document.querySelector('[data-story-status]');if(status)status.textContent=`${index+1} / ${s.lines.length} 文を聞いています。`;try{const u=new SpeechSynthesisUtterance(lineData.zh);activeUtterance=u;u.lang='zh-CN';u.rate=rate;const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>/^zh[-_](CN|Hans)/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang))||null;u.onstart=()=>fallbackHighlight(index,lineData,token);u.onboundary=e=>{if(token!==playToken||isPaused||e.name==='sentence')return;fallbackTimers.forEach(clearInterval);fallbackTimers=[];activeChar(index,[...lineData.zh.slice(0,e.charIndex)].length,e.charLength||1);};u.onend=()=>{if(token!==playToken)return;clearFallback();const next=()=>{if(token!==playToken)return;if(isPaused){fallbackTimers.push(setTimeout(next,150));return;}speakAt(index+1,token,s,ctx)};fallbackTimers.push(setTimeout(next,rate===.22?1400:1000));};u.onerror=event=>{if(token!==playToken)return;console.warn('[Koepanda] story speech failed:',event.error);stop();if(status)status.textContent='音声を開始できませんでした。もう一度、再生ボタンを押してください。';};window.speechSynthesis.resume();(window.KP_AUDIO_SESSION&&window.KP_AUDIO_SESSION.preparePlayback(),window.speechSynthesis.speak(u));}catch(_){stop();if(status)status.textContent='この端末では音声を再生できません。';}}
  function start(ctx){const s=selected();if(!s)return;if(!('speechSynthesis'in window)||!window.SpeechSynthesisUtterance){const status=document.querySelector('[data-story-status]');if(status)status.textContent='この端末では音声再生を利用できません。';return;}const line=resumeLine??0;resumeLine=null;stop();lastCompletedId=null;isPlaying=true;const token=playToken;syncPlayButton();speakAt(line,token,s,ctx);}
  feature.actions={
    'story-open':(ctx,button)=>{resumeLine=null;stop();selectedId=button.dataset.story;lastCompletedId=null;ctx.render();},
    'story-back':(ctx)=>{resumeLine=null;stop();selectedId=null;lastCompletedId=null;ctx.render();},
    'story-toggle':(ctx)=>{if(!isPlaying){start(ctx);return;}if(isPaused){window.speechSynthesis.resume();isPaused=false;}else{window.speechSynthesis.pause();isPaused=true;}syncPlayButton();},
  };
  feature.change=(ctx,event)=>{if(event.target?.dataset.action==='story-rate'){rate=Number(event.target.value)===.45?.45:.22;if(isPlaying){const s=selected();stop();isPlaying=true;const token=playToken;syncPlayButton();speakAt(currentLine,token,s,currentContext||ctx)}return true;}return false;};
  window.KoepandaFeatures.story=feature;
})();
} catch (error) { console.error("[Koepanda] startup module failed: js/features/story.js", error); }

/* Source: js/features/learning-records.js */
try {
(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  const KEY='koepanda.learning-records.v1',GOAL_KEY='koepanda.learning-goal-target.v1';
  window.addEventListener('kp-goal-sync-changed',()=>{if(ctxRef)ctxRef.render()});
  const DAY=['日','月','火','水','木','金','土'];
  let cursor=new Date(),days=null,loading=false,loadState='idle',ctxRef=null,loadId=0;
  const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  function localDays(){try{const r=window.readDailyGoal?.();return Array.isArray(r?.days)?r.days:[]}catch(_){return[]}}
  function settings(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return{}}}
  function save(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(_){}}
  function streakOf(list){const set=new Set(list),d=new Date();if(!set.has(dateKey(d)))d.setDate(d.getDate()-1);let n=0;while(set.has(dateKey(d))&&n<366){n++;d.setDate(d.getDate()-1)}return n}
  function weekMarkup(set){const now=new Date(),monday=new Date(now);monday.setDate(now.getDate()-((now.getDay()+6)%7));return Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);const done=set.has(dateKey(d));return `<div class="kp-record-weekday${done?' is-done':''}${dateKey(d)===dateKey(now)?' is-today':''}"><small>${DAY[d.getDay()]}</small><b>${done?'✓':d.getDate()}</b></div>`}).join('')}
  function dateRange(cfg){if(!cfg.planStart||!cfg.planEnd)return[];const start=new Date(cfg.planStart+'T12:00:00'),end=new Date(cfg.planEnd+'T12:00:00');if(Number.isNaN(+start)||Number.isNaN(+end)||start>end)return[];const out=[];for(const d=new Date(start);d<=end;d.setDate(d.getDate()+1))out.push(dateKey(d));return out}
  function monthMarkup(set,cfg,required){const first=new Date(cursor.getFullYear(),cursor.getMonth(),1),start=new Date(first);start.setDate(1-((first.getDay()+6)%7));const planned=new Set(dateRange(cfg)),today=dateKey(new Date());return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);const key=dateKey(d),inMonth=d.getMonth()===cursor.getMonth(),isPlanned=planned.has(key),atStart=key===cfg.planStart,atEnd=key===cfg.planEnd,prior=new Date(d);prior.setDate(prior.getDate()-1);const next=new Date(d);next.setDate(next.getDate()+1);const canAdd=!planned.size||key===dateKey(prior)||key===dateKey(next);const hasRoom=planned.size<required;const enabled=key>=today;return `<button type="button" class="kp-record-date${inMonth?'':' is-outside'}${set.has(key)?' is-done':''}${isPlanned?' is-planned':''}${atStart?' is-plan-start':''}${atEnd?' is-plan-end':''}${key===today?' is-today':''}" data-action="record-plan-date" data-date="${key}" aria-pressed="${isPlanned}" aria-label="${key}${set.has(key)?' 学習済み':''}${isPlanned?' 目標日':''}" ${enabled?'':'disabled'}>${d.getDate()}</button>`}).join('')}
  function render({head}){
    const local=localDays(),all=days===null?local:days,set=new Set(all),total=set.size,streak=streakOf(all),cfg=settings(),options=window.KP_GOAL.model(all).options;
    const model=window.KP_GOAL.model(all),goal=model.g.target||0,required=0,planned=dateRange(cfg);const celebration='';
    const weekCount=all.filter(x=>{const d=new Date(x+'T12:00:00'),n=new Date();const monday=new Date(n);monday.setDate(n.getDate()-((n.getDay()+6)%7));monday.setHours(0,0,0,0);const next=new Date(monday);next.setDate(next.getDate()+7);return d>=monday&&d<next}).length;
    return `${head('学習の記録','学習カレンダー','学習・練習・ストーリーを、今日の一日として記録します。')}${celebration}<section class="kp-record-week"><div class="kp-record-section-head"><h2>まちがいレッスン</h2></div><p>聞き違えた音・漢字の読み方・会話を、今日の復習から少しずつ。</p><button type="button" class="kp-primary" data-action="record-review-start" data-review-kind="mistakes">今日の復習を始める</button> <button type="button" class="kp-secondary" data-action="record-review-start" data-review-kind="words">保存したことば</button> <a class="kp-secondary" href="./grade4.html?review=1">4級の復習</a></section><section class="kp-record-goal"><div class="kp-record-goal-top"><span aria-hidden="true">🎋</span><div><small>連続学習の目標</small><h2>${goal?`${goal}日連続まであと ${model.remaining} 日`:'目標を設定しよう'}</h2></div><strong>${streak}<small>日連続</small></strong></div><div class="kp-record-goal-track"><i style="width:${Math.min(100,(goal?Math.round(streak/goal*100):0))}%"></i></div><p>${goal?`終了日：${model.g.end.replaceAll('-','/')}。目標は変更できます。`:'下のボタン、またはカレンダーの終了日から目標を設定できます。'}</p><p role="status">${window.KP_GOAL_STORE.message()}</p><div class="kp-record-goal-options">${options.map(value=>`<button type="button" class="kp-record-goal-option${goal===value?' is-selected':''}" data-action="record-select-goal" data-goal="${value}" aria-pressed="${goal===value}"><b>${value}日</b><small>あと ${value-streak} 日</small></button>`).join('')}</div></section><section class="kp-record-week"><div class="kp-record-section-head"><h2>今週の学習</h2><span>${weekCount} / 7 日</span></div><div class="kp-record-week-grid">${weekMarkup(set)}</div></section><section class="kp-record-month"><div class="kp-record-section-head"><h2>${cursor.getFullYear()}年 ${cursor.getMonth()+1}月</h2><div><button type="button" data-action="record-month" data-step="-1" aria-label="前の月">‹</button><button type="button" data-action="record-month" data-step="1" aria-label="次の月">›</button></div></div><p class="kp-record-plan-help">目標の終了日を選んでください。今日からその日まで、すべての日を連続して選択します。</p><div class="kp-record-month-grid kp-record-week-labels">${['月','火','水','木','金','土','日'].map(x=>`<small>${x}</small>`).join('')}</div><div class="kp-record-month-grid">${monthMarkup(set,cfg,required)}</div><p class="kp-record-plan-status">${planned.length?`${cfg.planSaved?'目標日程を保存しました：':'選択中：'}${planned.length} 日（${cfg.planStart} 〜 ${cfg.planEnd}） <button type="button" data-action="record-plan-clear">クリア</button>`:`目標の終了日を選択してください。`}${loading?'　記録を同期中…':''}</p><button type="button" class="kp-record-plan-save" data-action="record-plan-save" ${planned.length>0?'':'disabled'}>この連続日程で目標を設定</button><p class="kp-record-total">累計学習日数 <strong>${total}</strong> 日</p></section><button type="button" class="kp-record-back" data-go="learn">学習ページへ戻る</button>`
  }
  const feature=window.KoepandaFeatures.learning_records=render;
  feature.mount=async ctx=>{ctxRef=ctx;if(loadState==='loading'||loadState==='ready')return;loadState='loading';const id=++loadId;loading=true;try{const client=await window.KP_ACCOUNT_API?.getClient();const session=client&&await client.auth.getSession();const user=session?.data?.session?.user;if(!user){days=localDays();loading=false;loadState='ready';ctx.render();return}const res=await client.from('learning_days').select('study_date').eq('user_id',user.id).order('study_date',{ascending:true}).limit(1000);if(res.error)throw res.error;if(id!==loadId)return;days=[...new Set([...(res.data||[]).map(x=>x.study_date),...localDays()])].sort();loadState='ready'}catch(e){days=localDays();loadState='ready';console.warn('[Koepanda] learning calendar load failed:',e)}finally{if(id===loadId){loading=false;ctx.render()}}};
  window.addEventListener('kp-auth-state-changed',()=>{days=null;loadState='idle';if(ctxRef)ctxRef.render()});
  window.addEventListener('kp-learning-activity-recorded',event=>{const day=event.detail?.day;days=[...new Set([...(days||[]),...localDays(),...(day?[day]:[])])].sort();if(ctxRef)ctxRef.render()});
  feature.actions={'record-review-start':(ctx,b)=>{location.href='./practice-session.html?reviewLesson='+b.dataset.reviewKind;},'record-month':(ctx,b)=>{cursor.setDate(1);cursor.setMonth(cursor.getMonth()+Number(b.dataset.step));ctx.render()}, 'record-select-goal':(ctx,b)=>{window.KP_GOAL.choose(Number(b.dataset.goal),days===null?localDays():days);const cfg=settings();delete cfg.planStart;delete cfg.planEnd;cfg.planSaved=false;save(cfg);ctx.render()},
    'record-plan-save':ctx=>{const cfg=settings(),all=days===null?localDays():days,m=window.KP_GOAL.model(all),range=dateRange(cfg);if(range.length&&cfg.planStart===dateKey(new Date())){const additional=range.filter(d=>!new Set(all).has(d)).length;window.KP_GOAL.write({base:m.g.base??m.streak,target:m.streak+additional,end:cfg.planEnd});cfg.planSaved=true;save(cfg);ctx.render()}},
    'record-plan-clear':ctx=>{const cfg=settings();delete cfg.planStart;delete cfg.planEnd;cfg.planSaved=false;save(cfg);ctx.render()},
    'record-plan-date':(ctx,b)=>{const cfg=settings(),key=b.dataset.date;if(key<dateKey(new Date()))return;cfg.planStart=dateKey(new Date());cfg.planEnd=key;cfg.planSaved=false;save(cfg);ctx.render()}};
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/features/learning-records.js", error); }

/* Source: js/features/friends.js */
try {
(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};

  const CARDS={
    study_together:{icon:'📚',text:'いっしょに勉強しよう！'},
    great_job:{icon:'🌟',text:'今日もがんばったね！'},
    nice_stickers:{icon:'🎟️',text:'シール帳すてきだね！'},
    see_you_soon:{icon:'🌈',text:'またいっしょに遊ぼう！'}
  };
  const TRADE_STATUS={pending:'返事待ち',completed:'交換成立',declined:'お断り',cancelled:'取り消し',expired:'期限切れ'};
  const AVATARS={
    xiaoyin:{image:'./assets/brand/xiaoyin-mascot.png',label:'小音',color:'mint'},
    panda:{emoji:'🐼',label:'パンダ',color:'blue'},
    rabbit:{emoji:'🐰',label:'うさぎ',color:'pink'},
    fox:{emoji:'🦊',label:'きつね',color:'orange'},
    tiger:{emoji:'🐯',label:'とら',color:'gold'},
    frog:{emoji:'🐸',label:'かえる',color:'green'},
    cat:{emoji:'🐱',label:'ねこ',color:'lavender'},
    dog:{emoji:'🐶',label:'いぬ',color:'peach'},
    koala:{emoji:'🐨',label:'コアラ',color:'gray'}
  };
  let loadSequence=0;
  let authSubscription=null;
  let snapshot=null;
  let activeTab='friends';
  let onlineByFriend={};
  let friendPresenceChannels=[];
  let qrScanFrame=0;
  let qrVideoStream=null;
  let qrScanSession=0;
  const qrScriptLoads={};

  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function shortDate(value){try{return new Date(value).toLocaleDateString('ja-JP',{month:'numeric',day:'numeric'});}catch(_){return '';}}
  function friendName(userId,profiles){return profiles[userId]?.nickname||'Koepanda learner';}
  function avatarMarkup(key,label,extra=''){const avatar=AVATARS[key]||AVATARS.xiaoyin;return `<span class="kp-avatar-art ${esc(avatar.color)} ${extra}" role="img" aria-label="${esc(label||avatar.label)}のアバター">${avatar.image?`<img src="${esc(avatar.image)}" alt="">`:avatar.emoji}</span>`;}
  function clearFriendPresence(){const channels=friendPresenceChannels.splice(0);channels.forEach(channel=>{try{snapshot?.client?.removeChannel(channel);}catch(_){}});onlineByFriend={};}
  function paintPresence(userId){
    const visible=snapshot?.profiles?.[userId]?.online_visible;
    const state=onlineByFriend[userId];
    document.querySelectorAll(`[data-presence-user="${userId}"]`).forEach(el=>{
      el.classList.toggle('is-online',state===true);
      const text=el.querySelector('[data-presence-label]');
      if(text)text.textContent=!visible?'オンライン状態は非公開':state===true?'オンライン':state===false?'オフライン':state==='error'?'状態を取得できません':'確認中';
    });
    const count=document.querySelector('[data-kp-online-count]');
    if(count&&snapshot)count.textContent=String(Object.values(onlineByFriend).filter(Boolean).length);
  }
  function listenForFriendPresence(client,userId){
    onlineByFriend[userId]=null;
    const channel=client.channel(`kp-presence-${userId}`,{config:{private:true,presence:{key:userId}}});
    const sync=()=>{
      const states=channel.presenceState()||{};
      onlineByFriend[userId]=Object.values(states).flat().some(item=>item&&item.user_id===userId);
      paintPresence(userId);
    };
    channel.on('presence',{event:'sync'},sync);
    channel.subscribe(status=>{
      if(status==='SUBSCRIBED')sync();
      else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED'){
        onlineByFriend[userId]='error';paintPresence(userId);
      }
    });
    friendPresenceChannels.push(channel);
  }
  function attachFriendPresence(data){
    clearFriendPresence();
    data.accepted.forEach(row=>{
      const id=row.user_low===data.user.id?row.user_high:row.user_low;
      if(data.profiles[id]?.online_visible)listenForFriendPresence(data.client,id);
    });
  }
  function errText(error){
    const msg=String(error&&(error.message||error)||'');
    if(/sign_in_required/i.test(msg))return '先にアカウントへログインしてください。';
    if(/friendship_required/i.test(msg))return '友だちになってから利用できます。';
    if(/not_found/i.test(msg))return '対象が見つかりませんでした。画面を更新してください。';
    if(/both_sides_required/i.test(msg))return '自分が渡すシールと、相手に希望するシールを1枚ずつ選んでください。';
    if(/sticker_unavailable|trade_items_changed/i.test(msg))return '選んだシールは交換できなくなりました。画面を更新してください。';
    return '通信に失敗しました。接続を確認して、もう一度お試しください。';
  }
  function setMessage(main,message,isError){const el=main.querySelector('#kpFriendsMessage');if(el){el.textContent=message||'';el.classList.toggle('is-error',!!isError);}}
  function loadQrScript(url,globalName){
    if(window[globalName])return Promise.resolve();
    if(qrScriptLoads[globalName])return qrScriptLoads[globalName];
    qrScriptLoads[globalName]=new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src=url;script.async=true;
      script.onload=()=>window[globalName]?resolve():reject(new Error('qr_library_unavailable'));
      script.onerror=()=>reject(new Error('qr_library_unavailable'));
      document.head.appendChild(script);
    });
    return qrScriptLoads[globalName];
  }
  function loadQrGenerator(){return loadQrScript('https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js','qrcode');}
  function loadQrReader(){return loadQrScript('https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js','jsQR');}
  function renderInviteQr(main,code){
    const host=main.querySelector('[data-kp-my-friend-qr]');if(!host)return;
    host.textContent='QRコードを準備しています…';
    loadQrGenerator().then(()=>{
      if(!host.isConnected)return;
      const qr=window.qrcode(0,'M');qr.addData(String(code));qr.make();
      host.innerHTML=qr.createSvgTag({cellSize:5,margin:4,scalable:true});
      const svg=host.querySelector('svg');if(svg){svg.setAttribute('role','img');svg.setAttribute('aria-label','あなたの招待コードのQRコード');}
    }).catch(()=>{if(host.isConnected)host.textContent='QRを表示できません。招待コードを使ってください。';});
  }
  function stopQrCamera(){
    qrScanSession++;
    if(qrScanFrame)cancelAnimationFrame(qrScanFrame);qrScanFrame=0;
    if(qrVideoStream){qrVideoStream.getTracks().forEach(track=>track.stop());qrVideoStream=null;}
  }
  function inviteCodeFromQr(raw){
    const value=String(raw||'').trim();
    const valid=code=>/^KP-[A-Z0-9]{4}-[A-Z0-9]{3}$/.test(String(code||'').trim().toUpperCase());
    if(valid(value))return value.toUpperCase();
    try{const url=new URL(value);if(url.origin!==location.origin)return'';const code=(url.searchParams.get('friend')||url.searchParams.get('invite')||'').trim();return valid(code)?code.toUpperCase():'';}catch(_){return'';}
  }
  async function openQrScanner(ctx){
    stopQrCamera();
    const session=qrScanSession;
    ctx.modal('QRコードを読み取る',`<div class="kp-friend-qr-scanner"><div class="kp-friend-qr-camera"><video id="kpFriendQrVideo" playsinline muted aria-label="友だちの招待QRコードを映すカメラ"></video><span aria-hidden="true"></span></div><p id="kpFriendQrStatus" role="status" aria-live="polite">カメラを準備しています…</p><small>QRが枠に入るように、ゆっくり合わせてください。読み取り後、申請内容を確認できます。</small></div>`);
    const dialog=ctx.root.querySelector('#kpModal'),video=ctx.root.querySelector('#kpFriendQrVideo'),status=ctx.root.querySelector('#kpFriendQrStatus');
    const isCurrent=()=>session===qrScanSession && dialog?.open && video?.isConnected;
    dialog?.addEventListener('close',()=>{if(session===qrScanSession)stopQrCamera();},{once:true});
    try{
      await loadQrReader();
      if(!isCurrent())return;
      if(!navigator.mediaDevices?.getUserMedia)throw new Error('camera_unavailable');
      const stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'}}});
      if(!isCurrent()){stream.getTracks().forEach(track=>track.stop());return;}
      qrVideoStream=stream;
      video.srcObject=stream;await video.play();
      if(!isCurrent())return;
      if(status)status.textContent='QRコードを枠に合わせてください';
      const canvas=document.createElement('canvas'),scanContext=canvas.getContext('2d',{willReadFrequently:true});let lastScan=0;
      const scan=now=>{
        if(!isCurrent()){if(session===qrScanSession)stopQrCamera();return;}
        if(video.readyState>=2&&video.videoWidth&&now-lastScan>140){
          lastScan=now;const scale=Math.min(1,720/video.videoWidth);canvas.width=Math.round(video.videoWidth*scale);canvas.height=Math.round(video.videoHeight*scale);
          scanContext.drawImage(video,0,0,canvas.width,canvas.height);
          const result=window.jsQR(scanContext.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height,{inversionAttempts:'dontInvert'});
          if(result?.data){
            const code=inviteCodeFromQr(result.data);
            if(code){
              const input=ctx.root.querySelector('#kpFriendForm #kpFriendCodeInput');
              stopQrCamera();
              ctx.closeModal();
              if(!input){
                ctx.toast('申請画面を開いて、もう一度QRコードを読み取ってください。');
                return;
              }
              input.value=code;
              setMessage(ctx.root,'QRコードを読み取りました。コードを確認してから友だち申請を送ってください。',false);
              input.focus({preventScroll:true});
              input.scrollIntoView({behavior:'smooth',block:'center'});
              return;
            }
            status.textContent='Koepandaの招待QRではありません。手入力もできます。';
          }
        }
        qrScanFrame=requestAnimationFrame(scan);
      };
      qrScanFrame=requestAnimationFrame(scan);
    }catch(error){
      if(!isCurrent())return;
      stopQrCamera();if(status)status.textContent=/NotAllowed|Permission|denied/i.test(String(error))?'カメラの使用が許可されませんでした。ブラウザの設定を確認するか、招待コードを手入力してください。':'カメラを起動できませんでした。招待コードを手入力してください。';
    }
  }
  function shell({head}){
    return `${head('つながる・応援する','友だち','招待コードでつながり、定型カードで応援し合えます。')}
      <div class="kp-friends-status" id="kpFriendsMessage" role="status" aria-live="polite">アカウント情報を確認しています…</div>
      <div id="kpFriendsBody"><section class="kp-friends-card kp-friends-loading"><span class="kp-friends-spinner" aria-hidden="true"></span><p>友だち情報を読み込んでいます…</p></section></div>`;
  }
  async function getClientAndUser(){
    const api=window.KP_ACCOUNT_API;
    if(!api||typeof api.getClient!=='function')throw new Error('cloud_client_unavailable');
    const client=await api.getClient();
    if(!client)throw new Error('cloud_not_configured');
    const result=await client.auth.getSession();
    if(result.error)throw result.error;
    return {client,user:result.data.session&&result.data.session.user||null};
  }
  function mount(ctx){
    const sequence=++loadSequence;
    const main=ctx.main;
    clearFriendPresence();
    load(ctx,main,sequence).catch(error=>{
      if(sequence!==loadSequence)return;
      const body=main.querySelector('#kpFriendsBody');
      if(body)body.innerHTML=`<section class="kp-friends-card kp-friends-error"><span aria-hidden="true">☁️</span><b>友だち情報を読み込めませんでした</b><p>${esc(errText(error))}</p><button class="kp-secondary" data-action="friends-retry">もう一度読み込む</button></section>`;
      setMessage(main,'',true);
    });
  }
  async function load(ctx,main,sequence){
    const {client,user}=await getClientAndUser();
    if(sequence!==loadSequence)return;
    if(!authSubscription){
      authSubscription=client.auth.onAuthStateChange((event)=>{
        if(event==='INITIAL_SESSION')return;
        setTimeout(()=>{
          if(document.querySelector('#kpFeatureRoot .kp-feature-nav [data-go="friends"].is-active'))ctx.render();
        },0);
      }).data.subscription;
    }
    const body=main.querySelector('#kpFriendsBody');
    if(!user){
      snapshot=null;
      setMessage(main,'ログインすると友だち機能を使えます。',false);
      body.innerHTML=`<section class="kp-friends-card kp-friends-login"><img class="kp-friends-xiaoyin" src="./assets/brand/xiaoyin-friends.webp" alt="小音"><div class="kp-friends-login-copy"><h2>アカウントで友だちとつながろう</h2><p>招待コード、申請、カード、シール交換はアカウントに保存されます。端末を変えても続けられます。</p><button class="kp-primary" data-action="account">新規登録・ログイン</button></div></section>`;
      return;
    }
    setMessage(main,'データベースと同期しています…',false);
    const relationFilter=`user_low.eq.${user.id},user_high.eq.${user.id}`;
    const participantFilter=`from_user.eq.${user.id},to_user.eq.${user.id}`;
    const [profileRes,relationsRes,greetingsRes,tradesRes]=await Promise.all([
      client.from('kp_social_profiles').select('user_id,friend_code,nickname,avatar_key,progress_visible,online_visible').eq('user_id',user.id).maybeSingle(),
      client.from('kp_friendships').select('id,user_low,user_high,requested_by,status,created_at,accepted_at').or(relationFilter).order('created_at',{ascending:false}).limit(100),
      client.from('kp_greeting_cards').select('id,from_user,to_user,card_key,created_at,read_at').or(participantFilter).order('created_at',{ascending:false}).limit(20),
      client.from('kp_sticker_trades').select('id,from_user,to_user,status,created_at,expires_at').or(participantFilter).order('created_at',{ascending:false}).limit(20)
    ]);
    for(const result of [profileRes,relationsRes,greetingsRes,tradesRes])if(result.error)throw result.error;
    const relations=relationsRes.data||[];
    const accepted=relations.filter(row=>row.status==='accepted');
    const pending=relations.filter(row=>row.status==='pending');
    const acceptedIds=accepted.map(row=>row.user_low===user.id?row.user_high:row.user_low);
    const relatedIds=pending.map(row=>row.user_low===user.id?row.user_high:row.user_low);
    const greetingIds=(greetingsRes.data||[]).map(row=>row.from_user===user.id?row.to_user:row.from_user);
    const tradeIds=(tradesRes.data||[]).map(row=>row.from_user===user.id?row.to_user:row.from_user);
    const profileIds=[...new Set([...acceptedIds,...relatedIds,...greetingIds,...tradeIds])].filter(id=>id!==user.id);
    let profiles={};
    if(profileIds.length){
      const profilesRes=await client.from('kp_social_profiles').select('user_id,nickname,avatar_key,progress_visible,online_visible').in('user_id',profileIds);
      if(profilesRes.error)throw profilesRes.error;
      profiles=Object.fromEntries((profilesRes.data||[]).map(row=>[row.user_id,row]));
    }
    const progress=await Promise.all(accepted.map(async row=>{
      const id=row.user_low===user.id?row.user_high:row.user_low;
      if(!profiles[id]?.progress_visible)return [id,null];
      const result=await client.rpc('kp_friend_learning_summary',{p_friend:id});
      return [id,result.error?null:(Array.isArray(result.data)?result.data[0]:result.data)||null];
    }));
    let tradeItems=[];
    const tradeRows=tradesRes.data||[];
    if(tradeRows.length){
      const result=await client.rpc('kp_list_sticker_trade_items',{p_trade_ids:tradeRows.map(t=>t.id)});
      if(result.error)throw result.error;
      tradeItems=result.data||[];
    }
    snapshot={client,user,profile:profileRes.data,relations,accepted,pending,profiles,greetings:greetingsRes.data||[],trades:tradeRows,tradeItems,progress:Object.fromEntries(progress)};
    if(sequence!==loadSequence)return;
    body.innerHTML=renderBody(snapshot);
    renderInviteQr(body,profileRes.data?.friend_code);
    attachFriendPresence(snapshot);
    setMessage(main,'最新の情報を表示しています。',false);
  }
  function requestRows(rows,user,profiles,incoming){
    if(!rows.length)return `<div class="kp-friends-empty-inline">${incoming?'新しい申請はありません。':'申請中の友だちはいません。'}</div>`;
    return `<div class="kp-friends-list">${rows.map(row=>{
      const other=row.user_low===user.id?row.user_high:row.user_low;
      const name=friendName(other,profiles);
      if(incoming)return `<article class="kp-friend-item">${avatarMarkup(profiles[other]?.avatar_key,name)}<div class="kp-friend-info"><b>${esc(name)}</b><small>あなたに友だち申請を送りました · ${shortDate(row.created_at)}</small></div><div class="kp-friend-actions"><button class="kp-primary kp-friend-action" data-action="friend-response" data-id="${esc(row.id)}" data-accept="true">承認</button><button class="kp-secondary kp-friend-action" data-action="friend-response" data-id="${esc(row.id)}" data-accept="false">断る</button></div></article>`;
      return `<article class="kp-friend-item">${avatarMarkup(profiles[other]?.avatar_key,name)}<div class="kp-friend-info"><b>${esc(name)}</b><small>申請を送信しました · ${shortDate(row.created_at)}</small></div><span class="kp-friends-pill">返事待ち</span></article>`;
    }).join('')}</div>`;
  }
  function renderBody(data){
    const {user,profile,accepted,pending,profiles,greetings,trades,tradeItems,progress}=data;
    if(!profile)return `<section class="kp-friends-card kp-friends-error"><b>アカウントの友だちプロフィールが見つかりません。</b><p>ログアウトして再度ログインしてください。解消しない場合は管理者に連絡してください。</p></section>`;
    const incoming=pending.filter(row=>row.requested_by!==user.id);
    const outgoing=pending.filter(row=>row.requested_by===user.id);
    const friends=accepted.map(row=>row.user_low===user.id?row.user_high:row.user_low);
    const incomingGreetings=greetings.filter(row=>row.to_user===user.id);
    const incomingTrades=trades.filter(row=>row.to_user===user.id&&row.status==='pending');
    const incomingGreetingsUnread=incomingGreetings.filter(g=>!g.read_at).length;
    const onlineCount=Object.values(onlineByFriend).filter(Boolean).length;
    const tab=(id,label,count)=>`<button class="kp-friends-tab ${activeTab===id?'is-active':''}" role="tab" aria-selected="${activeTab===id}" data-action="friends-tab" data-tab="${id}">${label}${count?`<span>${count}</span>`:''}</button>`;
    const friendsPanel=`<section class="kp-friends-card"><div class="kp-friends-section-heading"><span class="kp-friends-section-icon"><img src="./assets/brand/xiaoyin-friends.webp" alt=""></span><div><h2>友だち一覧</h2><p>学習の様子を見て、カードやシールで応援できます。</p></div></div>
      ${friends.length?`<div class="kp-friends-list">${friends.map(id=>{
        const p=profiles[id]||{};const summary=progress[id];
        const presence=!p.online_visible?'オンライン状態は非公開':onlineByFriend[id]===true?'オンライン':onlineByFriend[id]===false?'オフライン':'確認中';
        const learning=!p.progress_visible?`<div class="kp-learning-private">学習記録は非公開</div>`:summary?`<div class="kp-learning-summary"><span>${summary.studied_today?'今日は学習したよ':'今日はまだ学習していないよ'}</span><span>今週 <b>${Number(summary.weekly_days)||0}</b> 日</span><span><b>${Number(summary.completed_units)||0}</b> 単元完了</span></div>`:`<div class="kp-learning-private">学習記録を読み込めません</div>`;
        return `<article class="kp-friend-item kp-friend-card-row"><div class="kp-friend-identity">${avatarMarkup(p.avatar_key,friendName(id,profiles))}<div class="kp-friend-info"><b>${esc(friendName(id,profiles))}</b><span class="kp-presence ${onlineByFriend[id]===true?'is-online':''}" data-presence-user="${esc(id)}"><i aria-hidden="true"></i><small data-presence-label>${esc(presence)}</small></span></div></div>${learning}<div class="kp-friend-actions"><button class="kp-secondary kp-friend-action" data-action="greet-friend" data-id="${esc(id)}">応援カード</button><button class="kp-primary kp-friend-action" data-action="trade-open" data-id="${esc(id)}">シール交換</button></div></article>`;
      }).join('')}</div>`:`<div class="kp-friends-empty"><span aria-hidden="true">🌱</span><b>友だちはまだいません</b><p>「申請」から招待コードを使って、友だちを追加できます。</p><button class="kp-secondary" data-action="friends-tab" data-tab="requests">招待コードでつながる</button></div>`}</section>`;
    const requestsPanel=`<section class="kp-friends-card kp-my-friend-card"><div class="kp-my-friend-top"><div><span class="kp-eyebrow">あなたの招待コード</span><p class="kp-friend-code-value">${esc(profile.friend_code)}</p><small>QRを見せるか、コードを伝えて友だち申請を受け取れます。</small></div><button class="kp-secondary" data-action="copy-friend-code">コードをコピー</button></div><div class="kp-my-friend-qr-row"><div class="kp-my-friend-qr" data-kp-my-friend-qr aria-label="あなたの招待QRコード">QRコードを準備しています…</div><div><b>QRコードでつながる</b><p>友だちにこのQRを見せてもらい、下の「読み取る」から追加できます。</p></div></div></section>
      <section class="kp-friends-card kp-friend-add-card"><div class="kp-friends-section-heading"><span class="kp-friends-section-icon">🔎</span><div><h2>友だちを追加</h2><p>QRコードを読み取るか、招待コードを入力します。</p></div></div><button type="button" class="kp-qr-scan-button" data-action="friends-scan-qr"><span aria-hidden="true">▦</span> QRコードを読み取る</button><div class="kp-manual-code-divider"><span>またはコードを手入力</span></div><form class="kp-add-friend-form" id="kpFriendForm"><label for="kpFriendCodeInput">招待コード</label><div class="kp-add-friend-controls"><input id="kpFriendCodeInput" name="code" maxlength="12" placeholder="KP-AB12-XYZ" autocapitalize="characters" autocomplete="off" required><button class="kp-primary">申請を送る</button></div><small>読み取ったコードも、送信前にここで確認できます。</small></form></section>
      <section class="kp-friends-card"><div class="kp-friends-section-heading"><span class="kp-friends-section-icon">💌</span><div><h2>届いた申請</h2><p>承認すると友だちに追加されます。</p></div><span class="kp-friends-count">${incoming.length}件</span></div>${requestRows(incoming,user,profiles,true)}<div class="kp-friends-subheading kp-friends-subheading-spaced">送った申請 <span>${outgoing.length}</span></div>${requestRows(outgoing,user,profiles,false)}</section>`;
    const activityPanel=`<section class="kp-friends-card"><div class="kp-friends-section-heading"><span class="kp-friends-section-icon">🎟️</span><div><h2>シール交換</h2><p>内容を確認してから承認・お断りできます。</p></div><span class="kp-friends-count">${incomingTrades.length}件の返事待ち</span></div>
      ${trades.length?`<div class="kp-friends-list">${trades.slice(0,8).map(t=>{const isIncoming=t.to_user===user.id;const other=isIncoming?t.from_user:t.to_user;const items=tradeItems.filter(x=>x.trade_id===t.id);const giving=items.filter(x=>x.offered_by===user.id);const receiving=items.filter(x=>x.offered_by!==user.id);const itemNames=list=>list.length?list.map(x=>`<span class="kp-trade-sticker-chip"><span aria-hidden="true">${esc(x.glyph||'🎟️')}</span>${esc(x.title||'シール')}</span>`).join(''):'<span class="kp-trade-no-items">なし</span>';const details=items.length?`<div class="kp-trade-details"><div><small>あなたが渡す</small><div>${itemNames(giving)}</div></div><div><small>あなたが受け取る</small><div>${itemNames(receiving)}</div></div></div>`:`<p class="kp-trade-details-error">交換内容を読み込めません。更新して確認してください。</p>`;return `<article class="kp-friend-item kp-trade-item"><span class="kp-friend-avatar" aria-hidden="true">🎟️</span><div class="kp-friend-info"><b>${esc(friendName(other,profiles))}</b><small>${items.length}枚を含む交換 · ${shortDate(t.created_at)}</small></div><span class="kp-friends-pill">${esc(TRADE_STATUS[t.status]||t.status)}</span>${details}${t.status==='pending'?(isIncoming?`<div class="kp-friend-actions"><button class="kp-primary kp-friend-action" data-action="trade-reply" data-id="${esc(t.id)}" data-accept="true" ${items.length?'':'disabled'}>内容を確認して承認</button><button class="kp-secondary kp-friend-action" data-action="trade-reply" data-id="${esc(t.id)}" data-accept="false">断る</button></div>`:`<button class="kp-secondary kp-friend-action" data-action="trade-cancel" data-id="${esc(t.id)}">取り消す</button>`):''}</article>`;}).join('')}</div>`:`<div class="kp-friends-empty-inline">交換の申請はまだありません。</div>`}</section>
      <section class="kp-friends-card"><div class="kp-friends-section-heading"><span class="kp-friends-section-icon">💌</span><div><h2>応援カード</h2><p>友だちから届いたカードを確認できます。</p></div><span class="kp-friends-count">${incomingGreetingsUnread}件 未読</span></div>${incomingGreetings.length?`<div class="kp-greeting-inbox">${incomingGreetings.slice(0,10).map(g=>`<article class="kp-greeting-item ${g.read_at?'is-read':'is-unread'}"><span aria-hidden="true">${esc(CARDS[g.card_key]?.icon||'💌')}</span><div><b>${esc(friendName(g.from_user,profiles))}</b><p>${esc(CARDS[g.card_key]?.text||'応援カードが届きました')}</p><small>${shortDate(g.created_at)}</small></div>${!g.read_at?`<button class="kp-secondary kp-friend-action" data-action="greeting-read" data-id="${esc(g.id)}">既読にする</button>`:''}</article>`).join('')}</div>`:`<div class="kp-friends-empty-inline">カードが届いたらここに表示されます。</div>`}</section>`;
    const panel=activeTab==='requests'?requestsPanel:activeTab==='activity'?activityPanel:friendsPanel;
    return `<section class="kp-friends-card kp-friends-profile-strip"><div class="kp-friend-identity">${avatarMarkup(profile.avatar_key,profile.nickname)}<div><b>${esc(profile.nickname||'あなた')}</b><small>あなたの友だちプロフィール</small></div></div><button class="kp-secondary" data-action="profile-open">プロフィール設定</button></section>
      <div class="kp-friends-overview" aria-label="友だちの状況"><div><b>${onlineCount}</b><span>オンライン中</span></div><div><b>${friends.length}</b><span>友だち</span></div><div><b>${incoming.length}</b><span>届いた申請</span></div></div>
      <div class="kp-friends-tabs" role="tablist" aria-label="友だちメニュー">${tab('friends','友だち')}${tab('requests','申請',incoming.length)}${tab('activity','交流',incomingTrades.length+incomingGreetingsUnread)}</div>
      ${panel}<p class="kp-friends-safety">オンライン表示と学習記録はプロフィール設定で個別に公開できます。自由入力のチャットやメール検索はありません。</p>`;
  }
  async function safeAction(ctx,fn){try{await fn();}catch(error){ctx.toast(errText(error));}}
  async function refresh(ctx){ctx.render();}
  function openProfile(ctx){
    const p=snapshot.profile||{};
    const choices=Object.entries(AVATARS).map(([key,item])=>`<button type="button" class="kp-avatar-choice ${p.avatar_key===key?'is-selected':''}" data-action="avatar-select" data-avatar="${key}" aria-pressed="${p.avatar_key===key}">${avatarMarkup(key,item.label)}<small>${item.label}</small></button>`).join('');
    ctx.modal('プロフィール設定',`<form id="kpFriendProfileForm" class="kp-profile-editor"><label for="kpFriendNickname">友だちに表示する名前</label><input id="kpFriendNickname" name="nickname" maxlength="24" required value="${esc(p.nickname||'')}" autocomplete="nickname"><input type="hidden" name="avatar_key" value="${esc(AVATARS[p.avatar_key]?p.avatar_key:'xiaoyin')}"><fieldset><legend>自分のアバター</legend><div class="kp-avatar-picker">${choices}</div></fieldset><label class="kp-friend-privacy"><span><b>学習の様子を友だちに見せる</b><small>今日の学習、今週の日数、完了した単元数を表示します。</small></span><input type="checkbox" name="progress_visible" ${p.progress_visible?'checked':''}></label><label class="kp-friend-privacy"><span><b>オンライン状態を友だちに見せる</b><small>使用中はオンラインと表示します。オフライン時刻は公開しません。</small></span><input type="checkbox" name="online_visible" ${p.online_visible?'checked':''}></label><button class="kp-primary kp-profile-save">設定を保存</button></form>`);
  }
  async function updateProfile(ctx,form){
    if(!snapshot?.user)throw new Error('sign_in_required');
    const data=new FormData(form);const nickname=String(data.get('nickname')||'').trim();
    if(!nickname||nickname.length>24){ctx.toast('表示名は1〜24文字で入力してください。');return;}
    const avatar_key=String(data.get('avatar_key')||'xiaoyin');
    if(!AVATARS[avatar_key]){ctx.toast('アバターを選び直してください。');return;}
    const values={nickname,avatar_key,progress_visible:form.elements.progress_visible.checked,online_visible:form.elements.online_visible.checked};
    const result=await snapshot.client.from('kp_social_profiles').update(values).eq('user_id',snapshot.user.id);
    if(result.error)throw result.error;
    ctx.closeModal();ctx.toast('プロフィール設定を保存しました。');window.KP_PRESENCE_MANAGER?.refresh?.();await refresh(ctx);
  }
  async function sendRequest(ctx,form){
    const code=String(new FormData(form).get('code')||'').trim().toUpperCase();
    if(!/^KP-[A-Z0-9]{4}-[A-Z0-9]{3}$/.test(code)){ctx.toast('KP-AB12-XYZ の形式で入力してください。');return;}
    const result=await snapshot.client.rpc('kp_request_friend',{p_friend_code:code});
    if(result.error)throw result.error;
    const messages={request_sent:'友だち申請を送りました。',already_sent:'この相手には申請済みです。',incoming_request:'相手からの申請が届いています。申請一覧を確認してください。',already_friends:'この相手はすでに友だちです。',not_found:'招待コードが見つかりません。もう一度確認してください。',self:'自分の招待コードは使えません。',unavailable:'この相手には現在申請できません。'};
    ctx.toast(messages[result.data]||'申請を処理しました。');await refresh(ctx);
  }
  async function setPrivacy(ctx,input){
    const result=await snapshot.client.from('kp_social_profiles').update({progress_visible:input.checked}).eq('user_id',snapshot.user.id);
    if(result.error){input.checked=!input.checked;throw result.error;}
    ctx.toast(input.checked?'今週の学習日数を友だちに表示します。':'学習日数を非公開にしました。');
  }
  function greet(ctx,friendId){
    const name=friendName(friendId,snapshot.profiles);
    const cards=Object.entries(CARDS).map(([key,item])=>`<button class="kp-friend-card-choice" data-action="greeting-send" data-friend="${esc(friendId)}" data-card="${esc(key)}"><span>${item.icon}</span><b>${esc(item.text)}</b></button>`).join('');
    ctx.modal('応援カードを送る',`<p class="kp-modal-copy">${esc(name)}さんに送るカードを選んでください。</p><div class="kp-friend-card-choices">${cards}</div><p class="kp-friends-modal-note">メッセージは用意されたカードから選びます。</p>`);
  }
  async function sendGreeting(ctx,button){
    const result=await snapshot.client.rpc('kp_send_greeting',{p_friend:button.dataset.friend,p_card_key:button.dataset.card});
    if(result.error)throw result.error;
    ctx.closeModal();ctx.toast('応援カードを送りました。');await refresh(ctx);
  }
  async function markGreetingRead(ctx,id){
    const result=await snapshot.client.from('kp_greeting_cards').update({read_at:new Date().toISOString()}).eq('id',id).eq('to_user',snapshot.user.id).is('read_at',null);
    if(result.error)throw result.error;await refresh(ctx);
  }
  async function openTrade(ctx,friendId){
    const [mineRes,theirsRes]=await Promise.all([
      snapshot.client.from('kp_user_stickers').select('id,sticker_key').eq('user_id',snapshot.user.id).eq('is_favorite',false).is('locked_trade_id',null),
      snapshot.client.rpc('kp_list_friend_stickers',{p_friend:friendId})
    ]);
    if(mineRes.error)throw mineRes.error;if(theirsRes.error)throw theirsRes.error;
    const mine=mineRes.data||[],theirs=theirsRes.data||[];
    if(!mine.length||!theirs.length){
      const why=!mine.length?'あなたのアカウントに交換できるシールがまだありません。':'相手に交換できるシールがまだありません。';
      ctx.modal('シール交換',`<div class="kp-trade-empty"><span aria-hidden="true">🎟️</span><b>交換の準備ができていません</b><p>${esc(why)}</p><small>交換に使えるシールはデータベース上の所持数で確認します。お気に入りや申請中のシールは選べません。</small></div>`);return;
    }
    const allKeys=[...new Set([...mine.map(x=>x.sticker_key),...theirs.map(x=>x.sticker_key)])];
    const catalogRes=await snapshot.client.from('kp_sticker_catalog').select('sticker_key,title,glyph').in('sticker_key',allKeys);
    if(catalogRes.error)throw catalogRes.error;
    const catalog=Object.fromEntries((catalogRes.data||[]).map(row=>[row.sticker_key,row]));
    const option=(item,isMine)=>{const c=catalog[item.sticker_key]||{};const id=isMine?item.id:item.sticker_instance_id;return `<label class="kp-trade-option"><input type="checkbox" name="${isMine?'offer_ids':'want_ids'}" value="${esc(id)}"><span>${esc(c.glyph||'🎟️')}</span><b>${esc(c.title||item.title||'シール')}</b></label>`;};
    const name=friendName(friendId,snapshot.profiles);
    ctx.modal('シール交換を申し込む',`<form id="kpTradeCreateForm" class="kp-trade-create-form" data-friend="${esc(friendId)}"><p class="kp-modal-copy">${esc(name)}さんに渡すシールと、相手から受け取りたいシールを選びます。どちらも相手の承認前に交換が成立することはありません。</p><fieldset><legend>あなたが渡すシール</legend><div class="kp-trade-options">${mine.map(x=>option(x,true)).join('')}</div></fieldset><fieldset><legend>相手から受け取りたいシール</legend><div class="kp-trade-options">${theirs.map(x=>option(x,false)).join('')}</div></fieldset><p class="kp-modal-copy">双方のシールは返事があるまで一時的に予約されます。申請後も相手は断ることができます。</p><button class="kp-primary">交換を申し込む</button></form>`);
  }
  async function createTrade(ctx,form){
    const data=new FormData(form);const offers=data.getAll('offer_ids').map(String);const wants=data.getAll('want_ids').map(String);
    if(!offers.length||!wants.length){ctx.toast('両方から交換するシールを選んでください。');return;}
    if(offers.length>10||wants.length>10){ctx.toast('一度に選べるシールは各10枚までです。');return;}
    const result=await snapshot.client.rpc('kp_create_sticker_trade',{p_friend:form.dataset.friend,p_offer_ids:offers,p_want_ids:wants});
    if(result.error)throw result.error;ctx.closeModal();ctx.toast('交換を申し込みました。相手の返事を待ちましょう。');await refresh(ctx);
  }
  async function replyTrade(ctx,id,accept){
    const result=await snapshot.client.rpc('kp_reply_sticker_trade',{p_trade_id:id,p_accept:accept});
    if(result.error)throw result.error;
    ctx.toast(result.data==='completed'?'交換が成立しました。':result.data==='declined'?'交換を断りました。':result.data==='expired'?'申請の期限が切れています。':'処理しました。');await refresh(ctx);
  }
  async function cancelTrade(ctx,id){
    const result=await snapshot.client.rpc('kp_cancel_sticker_trade',{p_trade_id:id});
    if(result.error)throw result.error;ctx.toast('交換申請を取り消しました。');await refresh(ctx);
  }
  window.KoepandaFeatures.friends=shell;
  window.KoepandaFeatures.friends.mount=mount;
  window.KoepandaFeatures.friends.actions={
    'friends-retry':ctx=>safeAction(ctx,()=>refresh(ctx)),
    'friends-scan-qr':ctx=>safeAction(ctx,()=>openQrScanner(ctx)),
    'copy-friend-code':ctx=>safeAction(ctx,async()=>{
      const code=snapshot?.profile?.friend_code;if(!code)throw new Error('profile_missing');
      try{await navigator.clipboard.writeText(code);ctx.toast('招待コードをコピーしました。');}
      catch(_){ctx.toast(`あなたの招待コード：${code}`);}
    }),
    account:()=>document.getElementById('kpAccountTrigger')?.click(),
    'friends-tab':(ctx,b)=>{activeTab=['friends','requests','activity'].includes(b.dataset.tab)?b.dataset.tab:'friends';ctx.render();},
    'profile-open':ctx=>openProfile(ctx),
    'avatar-select':(ctx,b)=>{const form=b.closest('form');if(!form||!AVATARS[b.dataset.avatar])return;form.elements.avatar_key.value=b.dataset.avatar;form.querySelectorAll('.kp-avatar-choice').forEach(choice=>{const selected=choice===b;choice.classList.toggle('is-selected',selected);choice.setAttribute('aria-pressed',String(selected));});},
    'greet-friend':(ctx,b)=>greet(ctx,b.dataset.id),
    'greeting-send':(ctx,b)=>safeAction(ctx,()=>sendGreeting(ctx,b)),
    'friend-response':(ctx,b)=>safeAction(ctx,async()=>{
      const result=await snapshot.client.rpc('kp_reply_friend',{p_request_id:b.dataset.id,p_accept:b.dataset.accept==='true'});
      if(result.error)throw result.error;ctx.toast(result.data==='accepted'?'友だちになりました。':'申請を断りました。');await refresh(ctx);
    }),
    'trade-open':(ctx,b)=>safeAction(ctx,()=>openTrade(ctx,b.dataset.id)),
    'trade-reply':(ctx,b)=>safeAction(ctx,()=>replyTrade(ctx,b.dataset.id,b.dataset.accept==='true')),
    'trade-cancel':(ctx,b)=>safeAction(ctx,()=>cancelTrade(ctx,b.dataset.id)),
    'greeting-read':(ctx,b)=>safeAction(ctx,()=>markGreetingRead(ctx,b.dataset.id))
  };
  window.KoepandaFeatures.friends.submit=(ctx,event)=>{
    const form=event.target;
    if(form.id==='kpFriendForm'){event.preventDefault();safeAction(ctx,()=>sendRequest(ctx,form));return true;}
    if(form.id==='kpFriendProfileForm'){event.preventDefault();safeAction(ctx,()=>updateProfile(ctx,form));return true;}
    if(form.id==='kpTradeCreateForm'){event.preventDefault();safeAction(ctx,()=>createTrade(ctx,form));return true;}
    return false;
  };
  window.KoepandaFeatures.friends.change=(ctx,event)=>{
    if(event.target.dataset.action!=='friend-privacy')return false;
    safeAction(ctx,()=>setPrivacy(ctx,event.target));return true;
  };
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/features/friends.js", error); }

/* Source: js/features/self.js */
try {
(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  function syncAccountBox(box,user){if(!box)return;const status=box.querySelector('[data-self-status]'),hint=box.querySelector('[data-self-hint]'),button=box.querySelector('.kp-account-login');if(user){status.textContent='ログイン中';hint.textContent='シール帳の表紙・ページ・貼った位置と、友だち情報はアカウントに保存されます。';button.hidden=true;}else{status.textContent='ゲストとして学習中';hint.textContent='シール帳と友だち機能はログイン後に使えます。表紙や貼った位置はアカウントに保存されます。';button.hidden=false;}}
  window.addEventListener('kp-auth-state-changed',event=>syncAccountBox(document.querySelector('.kp-self-account'),event.detail?.user||null));
  const feature=window.KoepandaFeatures.self=function({head,state}){
    return `${head('記録とコレクション','自分のページ','学習記録を保存して、集めたシールを楽しもう。')}<section class="kp-self-account"><img src="./assets/brand/xiaoyin-mascot.png" alt="小音"><div><b data-self-status>アカウントを確認中…</b><small data-self-hint>シール帳の表紙や貼った位置はアカウントに保存されます。シール帳と友だち機能はログインして利用できます。</small></div><button class="kp-account-login" data-action="account"><span class="kp-account-login-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="9" cy="7.5" r="3.1"></circle><path d="M3.4 19c.5-3.2 2.3-4.8 5.6-4.8s5.1 1.6 5.6 4.8M19 14.4v5.2m-2.6-2.6h5.2"></path></svg></span><span class="kp-account-login-copy"><b>新規登録・ログイン</b><small>学習記録を引き継ぐ</small></span><span class="kp-account-login-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13m-5-5 5 5-5 5"></path></svg></span></button></section><section class="kp-section"><div class="kp-section-title"><h2>コレクション</h2><span>${state.selfStickerCountLabel||'確認中…'}</span></div><div class="kp-self-collection"><button data-go="book"><span>📒</span><b>シール帳</b><small>シールを自由に貼って飾ろう</small><strong>開く ›</strong></button><button data-go="rewards"><span>🎁</span><b>ごほうびボックス</b><small>シリーズとお気に入りを管理</small><strong>開く ›</strong></button></div></section><section class="kp-section"><div class="kp-section-title"><h2>学習の記録</h2></div><div class="kp-self-record"><span>🌱</span><p>続けた分だけ、学習ロードとシールが育っていくよ。</p></div><button type="button" class="kp-primary" data-go="records">学習の記録を見る</button></section>`;
  };
  feature.mount=async ctx=>{
    const box=ctx.root.querySelector('.kp-self-account');if(!box)return;
    const status=box.querySelector('[data-self-status]'),hint=box.querySelector('[data-self-hint]'),button=box.querySelector('.kp-account-login');
    try{
      const api=window.KP_ACCOUNT_API,client=api&&await api.getClient();
      const result=client&&await client.auth.getSession(),user=result?.data?.session?.user;
      syncAccountBox(box,user);
      if(!user){const guestCount=`${ctx.state.unlocked.length}枚`;ctx.state.selfStickerCountUserId=null;ctx.state.selfStickerCountLoadFailed=false;if(ctx.state.selfStickerCountLabel!==guestCount){ctx.state.selfStickerCountLabel=guestCount;ctx.render();}return;}
      if(ctx.state.selfStickerCountUserId===user.id||ctx.state.selfStickerCountLoadFailed)return;
      ctx.state.selfStickerCountUserId=user.id;
      ctx.state.selfStickerCountLabel='確認中…';
      ctx.render();
      const {data,error}=await client.from('kp_user_stickers').select('id').eq('user_id',user.id);
      if(error)throw error;
      ctx.state.selfStickerCountLabel=`${(data||[]).length}枚`;
      ctx.render();
    }catch(_){
      ctx.state.selfStickerCountLabel='—枚';
      ctx.state.selfStickerCountLoadFailed=true;
      status.textContent='アカウントを確認できません';hint.textContent='通信状態を確認してください。シール帳と友だち機能はログインが必要です。';button.hidden=false;
      ctx.render();
    }
  };
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/features/self.js", error); }

/* Source: js/features/sticker-book.js */
try {
(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  const COVERS=[
    {id:'zodiac_rat',name:'十二支・ねずみ',sub:'好奇心いっぱいのねずみ',className:'cover-rat',mark:'子',image:'assets/stickers/zodiac/rat.png'},
    {id:'zodiac_ox',name:'十二支・うし',sub:'ゆったりやさしいうし',className:'cover-zodiac',mark:'丑',image:'assets/stickers/zodiac/ox.png'},
    {id:'zodiac_tiger',name:'十二支・とら',sub:'元気いっぱいのとら',className:'cover-tiger',mark:'寅',image:'assets/stickers/zodiac/tiger.png'},
    {id:'clear_rabbit',name:'十二支・うさぎ',sub:'草花と遊ぶうさぎ',className:'cover-rabbit',mark:'卯',image:'assets/stickers/zodiac/rabbit.png'},
    {id:'zodiac_dragon',name:'十二支・たつ',sub:'きらめく辰（たつ）',className:'cover-zodiac',mark:'辰',image:'assets/stickers/zodiac/dragon.png'},
    {id:'zodiac_snake',name:'十二支・へび',sub:'すてきな模様のへび',className:'cover-zodiac',mark:'巳',image:'assets/stickers/zodiac/snake.png'},
    {id:'xiaoyin_sparkle',name:'小音のきらきら',sub:'やさしいピンクと星の箔',className:'cover-sparkle',mark:'✦',art:'🌙'},
    {id:'xiaoyin_study',name:'小音のひみつノート',sub:'小音といっしょに学ぶノート風',className:'cover-study',mark:'NOTE',image:'assets/stickers/covers/xiaoyin-hearts-cover.png'},
    {id:'xiaoyin_reader',name:'小音と読書',sub:'本を読む小音のきらきら表紙',className:'cover-character-pink',mark:'BOOK',image:'assets/stickers/covers/xiaoyin-reader.png'},
    {id:'zodiac_horse',name:'十二支・うま',sub:'風のように走るうま',className:'cover-zodiac',mark:'午',image:'assets/stickers/zodiac/horse.png'},
    {id:'peach_goat',name:'十二支・ひつじ',sub:'もも色のやさしいひつじ',className:'cover-peach',mark:'未',image:'assets/stickers/zodiac/goat.png'},
    {id:'zodiac_monkey',name:'十二支・さる',sub:'遊ぶのが大好きなさる',className:'cover-zodiac',mark:'申',image:'assets/stickers/zodiac/monkey.png'},
    {id:'zodiac_rooster',name:'十二支・とり',sub:'朝を知らせるにわとり',className:'cover-zodiac',mark:'酉',image:'assets/stickers/zodiac/rooster.png'},
    {id:'zodiac_dog',name:'十二支・いぬ',sub:'いつもいっしょのいぬ',className:'cover-zodiac',mark:'戌',image:'assets/stickers/zodiac/dog.png'},
    {id:'zodiac_pig',name:'十二支・いのしし',sub:'のんびりかわいいいのしし',className:'cover-zodiac',mark:'亥',image:'assets/stickers/zodiac/pig.png'},
    {id:'zodiac_album',name:'十二支コレクション',sub:'十二支となかよくなる表紙',className:'cover-zodiac',mark:'十二支',art:'🐉'},
    {id:'clear_mint',name:'クリアミント',sub:'すっきり透明感のあるデザイン',className:'cover-mint',mark:'✧',art:'🍃'},
    {id:'xiaoyin_friends',name:'小音とパンダ',sub:'パンダといっしょの小音',className:'cover-character-blue',mark:'♡',image:'assets/stickers/covers/xiaoyin-friends.png'}
  ];
  const COVERS_PER_PAGE=9;
  const MAX_TRAILING_EMPTY_PAGES=2;
  let drag=null, dragGhost=null, suppressInventoryClick='', suppressPlacedClick='', suppressClickUntil=0, loadSequence=0, saveTimer=0, account=null;
  const feature=window.KoepandaFeatures.sticker_book=function({state,safe}){
    if(!state.bookReady)return `<section class="kp-book-loading"><span>📖</span><b>シール帳を準備中…</b></section>`;
    if(state.bookLoadError)return `<section class="kp-book-login"><span>☁️</span><h1>データに接続できません</h1><p>ネットワークを確認して、もう一度お試しください。</p><button class="kp-primary" data-action="retry">再読み込み</button></section>`;
    if(!account)return `<section class="kp-book-login"><span>📚</span><h1>シール帳をひらこう</h1><p>集めたシールやページの配置を、アカウントに保存します。</p><button class="kp-primary" data-action="account">ログインして使う</button></section>`;
    if(!state.bookOpen)return renderCover(state);
    const pages=state.bookPages||[], page=pages[state.bookPage]||{items:[]},items=page.items||[];
    const emptyTail=trailingEmptyPageCount(pages),pageAddDisabled=emptyTail>=MAX_TRAILING_EMPTY_PAGES||state.bookPageCreating;
    const owned=state.bookInventory||[], used=new Set(items.map(i=>i.userStickerId));
    return `<section class="kp-book-shell ${coverById(state.bookCover).className}"><div class="kp-open-book-head"><button class="kp-book-back" data-action="close-book" aria-label="自分のページへ戻る"><span aria-hidden="true">←</span> 自分のページへ戻る</button><div><span>MY STICKER BOOK</span><b>${escapeText(page.title||`シールページ ${state.bookPage+1}`)}</b></div><button class="kp-cover-change-mini" data-action="show-covers" aria-label="表紙を変更">表紙を変更</button></div>${owned.length?`<aside class="kp-book-inventory-notice" role="status"><span>🎁</span><div><b>シールケースに${owned.length}枚あるよ</b><small>ケースからタップして貼るか、ページへ直接ドラッグ。</small></div><button data-action="jump-to-inventory">シールケース ↓</button></aside>`:''}<div class="kp-book-page-wrap"><div class="kp-page-spine" aria-hidden="true">⋮</div><div class="kp-sticker-book" id="kpStickerBook" aria-label="シールを置くページ"><div class="kp-page-caption">${state.bookPage===0?'わたしのお気に入り':'シールコレクション'}</div>${items.map((it,i)=>{const s=state.bookCatalog.find(x=>x.id===it.stickerKey);if(!s)return'';return `<button class="kp-placed-sticker ${state.selectedBookSticker===it.id?'selected':''}" data-action="select-sticker" data-index="${i}" style="left:${it.x}%;top:${it.y}%" aria-label="${safe(s.name)}"><img draggable="false" src="./assets/stickers/${safe(s.art)}" alt="${safe(s.name)}"></button>`;}).join('')}${!items.length&&owned.length?'<div class="kp-empty-page-hint">このページはまだ空です。下のシールケースからタップするか、シールを直接ドラッグして貼れます。</div>':''}<div class="kp-book-hint">空いているマスへドラッグ／貼ったシールも移動できます</div></div></div>${state.selectedBookSticker?'<div class="kp-selected-sticker-bar"><span>シールを選択中</span><button data-action="remove-sticker">このシールをはがす</button></div>':''}<div class="kp-page-navigation"><button class="kp-page-arrow" data-action="previous-page" ${state.bookPage===0?'disabled':''} aria-label="前のページ">‹</button><span><b>${state.bookPage+1}</b><small> / ${pages.length} ページ</small></span><button class="kp-page-arrow" data-action="next-page" ${state.bookPage>=pages.length-1?'disabled':''} aria-label="次のページ">›</button><button class="kp-add-page" data-action="add-page" ${pageAddDisabled?'disabled':''}>${state.bookPageCreating?'ページ作成中…':'＋ 新しいページ'}</button></div>${emptyTail>=MAX_TRAILING_EMPTY_PAGES?'<p class="kp-page-limit-note" role="status">空白ページは2ページまでです。貼りはじめると追加できます。</p>':''}<div class="kp-inventory-heading" id="kpStickerInventory"><div><b>シールケース</b><small>${owned.length} 枚</small></div><span>タップで貼る／ドラッグで移動</span></div><div class="kp-sticker-inventory">${owned.map(st=>{const s=state.bookCatalog.find(x=>x.id===st.sticker_key);if(!s)return'';return `<button class="kp-inventory-sticker ${used.has(st.id)?'is-used':''}" data-action="place-sticker" data-sticker-instance="${safe(st.id)}" aria-label="${safe(s.name)}を貼る"><img src="./assets/stickers/${safe(s.art)}" alt=""><small>${safe(s.name)}</small></button>`;}).join('')||'<div class="kp-empty-stickers"><b>シールはまだありません</b><br>シールを受け取ると、ここに追加されます。ログイン中のアカウントに保存されます。</div>'}</div>${state.coversOpen?renderCoverPicker(state.bookCover,state.bookCoverOptionPage):''}<div class="kp-book-save-state" aria-live="polite">${state.bookSaving?'保存中…':state.bookError?'保存できませんでした。通信を確認してください。':'変更は自動で保存されます'}</div></section>`;
  };
  feature.mount=ctx=>{if(ctx.state.bookReady)return;const seq=++loadSequence;loadBook(ctx,seq).catch(e=>{if(seq!==loadSequence)return;console.warn('[Koepanda] sticker book sync failed',e);ctx.state.bookReady=true;ctx.state.bookLoadError=true;ctx.render();});};
  feature.actions={
    account:ctx=>document.getElementById('kpAccountTrigger')?.click(),
    retry:ctx=>{ctx.state.bookReady=false;ctx.state.bookError=false;ctx.state.bookLoadError=false;ctx.render();},
    'open-book':ctx=>{ctx.state.bookOpen=true;ctx.save();ctx.render();requestAnimationFrame(()=>{normalizePageLayout(ctx);ctx.root.querySelector('.kp-open-book-head')?.scrollIntoView({behavior:'smooth',block:'start'});});},
    'close-book':ctx=>{ctx.state.bookOpen=false;ctx.state.coversOpen=false;ctx.setSelectedSticker(null);ctx.setPage('self');ctx.render();},
    'show-covers':ctx=>{ctx.state.coversOpen=true;ctx.state.bookCoverOptionPage=Math.floor(Math.max(0,COVERS.findIndex(c=>c.id===ctx.state.bookCover))/COVERS_PER_PAGE);ctx.render();},
    'hide-covers':ctx=>{ctx.state.coversOpen=false;ctx.render();},
    'cover-page':(ctx,b)=>{ctx.state.bookCoverOptionPage=clamp(+b.dataset.page||0,0,1);ctx.render();},
    'choose-cover':(ctx,b)=>{ctx.state.bookCover=b.dataset.cover;ctx.state.coversOpen=false;ctx.render();saveSettings(ctx);},
    'previous-page':ctx=>flip(ctx,-1), 'next-page':ctx=>flip(ctx,1),
    'add-page':ctx=>addPage(ctx),
    'jump-to-inventory':ctx=>ctx.root.querySelector('#kpStickerInventory')?.scrollIntoView({behavior:'smooth',block:'center'}),
    'place-sticker':(ctx,b)=>place(ctx,b.dataset.stickerInstance),
    'select-sticker':(ctx,b)=>{const item=ctx.state.bookPages[ctx.state.bookPage].items[+b.dataset.index];if(suppressPlacedClick===item?.id&&Date.now()<suppressClickUntil){suppressPlacedClick='';return;}ctx.state.selectedBookSticker=item?.id;ctx.setSelectedSticker(ctx.state.selectedBookSticker);ctx.render();},
    'remove-sticker':ctx=>removeSelected(ctx)
  };
  feature.pointerDown=(ctx,e)=>{
    const placed=e.target.closest('.kp-placed-sticker');
    const inventory=e.target.closest('.kp-inventory-sticker');
    const pageEl=ctx.root.querySelector('#kpStickerBook');
    if(!pageEl)return;
    if(placed){
      const page=ctx.state.bookPages[ctx.state.bookPage],item=page.items[+placed.dataset.index];if(!item)return;
      e.preventDefault();
      const rect=placed.getBoundingClientRect();ctx.state.selectedBookSticker=item.id;placed.classList.add('selected');
      const repaired=separateOverlappedAt(ctx,page,pageEl,+placed.dataset.index);
      drag={kind:'move',el:placed,item,page,pageEl,pointer:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,offsetX:e.clientX-rect.left,offsetY:e.clientY-rect.top,moved:false,repaired};
      placed.setPointerCapture?.(e.pointerId);return;
    }
    if(inventory){
      const instanceId=inventory.dataset.stickerInstance,sticker=ctx.state.bookInventory.find(x=>x.id===instanceId);if(!sticker)return;
      e.preventDefault();
      drag={kind:'place',instanceId,sticker,pageEl,pointer:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};
      inventory.setPointerCapture?.(e.pointerId);
    }
  };
  feature.pointerMove=(ctx,e)=>{
    if(!drag||drag.pointer!==e.pointerId)return;
    drag.lastX=e.clientX;drag.lastY=e.clientY;
    const moved=Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>6;
    if(moved)drag.moved=true;
    if(drag.kind==='move'){
      if(!drag.moved)return;
      drag.el.classList.add('is-dragging');
      if(!dragGhost){dragGhost=drag.el.querySelector('img').cloneNode();dragGhost.className='kp-sticker-drag-ghost is-placed-ghost';dragGhost.alt='';ctx.root.appendChild(dragGhost);}
      dragGhost.style.left=e.clientX+'px';dragGhost.style.top=e.clientY+'px';
      const r=drag.pageEl.getBoundingClientRect(),inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
      drag.pageEl.classList.toggle('is-drop-target',inside);return;
    }
    if(!drag.moved)return;
    if(!dragGhost){dragGhost=document.createElement('img');dragGhost.className='kp-sticker-drag-ghost';dragGhost.alt='';dragGhost.src=stickerImage(ctx,drag.sticker.sticker_key);ctx.root.appendChild(dragGhost);}
    dragGhost.style.left=e.clientX+'px';dragGhost.style.top=e.clientY+'px';
    const bounds=drag.pageEl.getBoundingClientRect(),inside=e.clientX>=bounds.left&&e.clientX<=bounds.right&&e.clientY>=bounds.top&&e.clientY<=bounds.bottom;
    drag.pageEl.classList.toggle('is-drop-target',inside);
  };
  feature.pointerUp=(ctx,e)=>{
    if(!drag||e&&drag.pointer!==e.pointerId)return;
    const current=drag;if(e&&Number.isFinite(e.clientX)&&Number.isFinite(e.clientY)){current.lastX=e.clientX;current.lastY=e.clientY;}drag=null;clearDragPreview(ctx);
    if(current.kind==='move'){
      current.el.classList.remove('is-dragging');
      if(current.moved){
        const bounds=pageMetrics(current.pageEl),width=current.el.offsetWidth,height=current.el.offsetHeight;
        const left=clamp(current.lastX-current.offsetX-bounds.left,0,Math.max(0,bounds.width-width));
        const top=clamp(current.lastY-current.offsetY-bounds.top,0,Math.max(0,bounds.height-height));
        const preferred={x:left/bounds.width*100,y:top/bounds.height*100};
        const position=nearestFreeCell(current.page.items.filter(item=>item.id!==current.item.id),bounds,width,height,preferred);
        if(!position){clearPlacedSelection(ctx);ctx.toast('このページはいっぱいです。新しいページを追加してください');return;}
        current.item.x=position.x;current.item.y=position.y;current.el.style.left=position.x+'%';current.el.style.top=position.y+'%';
        clearPlacedSelection(ctx);suppressPlacedClick=current.item.id;suppressClickUntil=Date.now()+450;saveLayout(ctx);
      }else if(current.repaired)saveLayout(ctx);return;
    }
    if(current.moved){
      suppressInventoryClick=current.instanceId;suppressClickUntil=Date.now()+450;
      const bounds=pageMetrics(current.pageEl),r=current.pageEl.getBoundingClientRect();
      if(current.lastX>=r.left&&current.lastX<=r.right&&current.lastY>=r.top&&current.lastY<=r.bottom){
        const stickerSize=getStickerSize();
        const x=clamp(current.lastX-bounds.left-stickerSize/2,0,Math.max(0,bounds.width-stickerSize))/bounds.width*100;
        const y=clamp(current.lastY-bounds.top-stickerSize/2,0,Math.max(0,bounds.height-stickerSize))/bounds.height*100;
        const position=nearestFreeCell(ctx.state.bookPages[ctx.state.bookPage].items,bounds,stickerSize,stickerSize,{x,y});
        if(position)placeAt(ctx,current.instanceId,position.x,position.y);else ctx.toast('このページはいっぱいです。新しいページを追加してください');
      }
    }
  };
  function coverArtwork(c,mini=false){return c.image?`<span class="kp-cover-artwork ${mini?'is-mini':''}"><img src="./${c.image}" alt="" decoding="async"></span>`:`<span class="kp-cover-art-emoji ${mini?'is-mini':''}" aria-hidden="true">${c.art||'✦'}</span>`;}
  function renderCover(state){const c=coverById(state.bookCover);return `<section class="kp-book-cover-stage"><button class="kp-cover-back" data-action="close-book" aria-label="自分のページへ戻る"><span aria-hidden="true">←</span> 自分のページへ戻る</button><button type="button" class="kp-book-cover ${c.className}" data-action="open-book" aria-label="シール帳をひらく"><div class="kp-cover-ring" aria-hidden="true"><i></i><i></i><i></i></div><div class="kp-cover-art">${coverArtwork(c)}</div><span class="kp-cover-kicker">KOEPANDA · MY COLLECTION</span><h1>わたしの<br>シール帳</h1><p>${c.sub}</p><div class="kp-cover-sticker">${c.mark}</div><div class="kp-cover-strap" aria-hidden="true"><span>✦</span></div></button><div class="kp-cover-actions"><button class="kp-secondary" data-action="show-covers">表紙を変更</button></div><p class="kp-cover-tip">表紙をタップして開く · デザインはあとから変更できます</p>${state.coversOpen?renderCoverPicker(state.bookCover,state.bookCoverOptionPage):''}</section>`;}
  function renderCoverPicker(selected,page=0){const start=clamp(Number(page)||0,0,1),covers=COVERS.slice(start*COVERS_PER_PAGE,(start+1)*COVERS_PER_PAGE);return `<div class="kp-cover-picker-backdrop" data-action="hide-covers"><section class="kp-cover-picker" role="dialog" aria-modal="true" aria-label="表紙を変更" data-picker="true"><button class="kp-cover-picker-close" data-action="hide-covers" aria-label="閉じる">×</button><span class="kp-eyebrow">MY BOOK COVER</span><h2>表紙を変更しよう</h2><p>十二支と小音の表紙から選べます。</p><div class="kp-cover-options">${covers.map(c=>`<button class="kp-cover-option ${selected===c.id?'is-selected':''}" data-action="choose-cover" data-cover="${c.id}"><span class="kp-cover-mini ${c.className}">${coverArtwork(c,true)}<b>${c.mark}</b></span><strong>${c.name}</strong><small>${selected===c.id?'使用中':'この表紙にする'}</small></button>`).join('')}</div><nav class="kp-cover-pagination" aria-label="表紙一覧のページ"><button data-action="cover-page" data-page="0" ${start===0?'disabled':''} aria-label="前の表紙">‹</button><span><b>${start+1}</b> / 2</span><button data-action="cover-page" data-page="1" ${start===1?'disabled':''} aria-label="次の表紙">›</button></nav></section></div>`;}
  function coverById(id){return COVERS.find(c=>c.id===id)||COVERS[0];}
  function escapeText(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  async function loadBook(ctx,seq){const api=window.KP_ACCOUNT_API;if(!api||typeof api.getClient!=='function')throw Error('Account API unavailable');const client=await api.getClient();if(!client)throw Error('Database unavailable');const {data:sessionData,error:authError}=await client.auth.getSession();if(authError)throw authError;const user=sessionData?.session?.user;if(!user){account=null;ctx.state.bookReady=true;ctx.render();return;}account={client,user};
    const [settings,pages,inventory]=await Promise.all([
      client.from('kp_sticker_book_settings').select('cover_key').eq('user_id',user.id).maybeSingle(),
      client.from('kp_sticker_book_pages').select('id,title,page_order').eq('user_id',user.id).order('page_order'),
      client.from('kp_user_stickers').select('id,sticker_key').eq('user_id',user.id)
    ]);for(const r of [settings,pages,inventory])if(r.error)throw r.error;if(seq!==loadSequence)return;
    ctx.state.bookCover=settings.data?.cover_key||ctx.state.bookCover||'xiaoyin_sparkle';ctx.state.bookInventory=inventory.data||[];ctx.state.bookCatalog=ctx.STICKERS;let cloudPages=pages.data||[];
    if(!cloudPages.length){const created=await client.from('kp_sticker_book_pages').insert({user_id:user.id,title:'シールページ 1',page_order:0}).select('id,title,page_order').single();if(created.error)throw created.error;cloudPages=[created.data];}
    const pageIds=cloudPages.map(p=>p.id);const itemResult=await client.from('kp_sticker_book_items').select('id,page_id,user_sticker_id,x,y,z_order').eq('user_id',user.id).in('page_id',pageIds).order('z_order');if(itemResult.error)throw itemResult.error;
    const byInstance=new Map(ctx.state.bookInventory.map(x=>[x.id,x]));ctx.state.bookPages=cloudPages.map(p=>({id:p.id,title:p.title,items:(itemResult.data||[]).filter(i=>i.page_id===p.id).map(i=>{const own=byInstance.get(i.user_sticker_id);return own?{id:i.id,userStickerId:own.id,stickerKey:own.sticker_key,x:Number(i.x),y:Number(i.y)}:null;}).filter(Boolean)}));ctx.state.bookPage=Math.max(0,Math.min(ctx.state.bookPages.length-1,ctx.state.bookPage||0));ctx.state.bookReady=true;ctx.state.bookError=false;const focusInventory=ctx.state.bookFocusInventory;ctx.state.bookFocusInventory=false;ctx.render();requestAnimationFrame(()=>{normalizePageLayout(ctx);if(focusInventory)ctx.root.querySelector('#kpStickerInventory')?.scrollIntoView({behavior:'smooth',block:'center'});});
  }
  async function saveSettings(ctx){if(!account)return;ctx.state.bookSaving=true;ctx.render();const {error}=await account.client.from('kp_sticker_book_settings').upsert({user_id:account.user.id,cover_key:ctx.state.bookCover,updated_at:new Date().toISOString()},{onConflict:'user_id'});ctx.state.bookSaving=false;ctx.state.bookError=!!error;if(error)console.warn('[Koepanda] cover save failed',error);ctx.render();}
  function trailingEmptyPageCount(pages){let count=0;for(let i=pages.length-1;i>=0&&!(pages[i].items||[]).length;i--)count++;return count;}
  function addPage(ctx){const pages=ctx.state.bookPages||[];if(!account||ctx.state.bookPageCreating||trailingEmptyPageCount(pages)>=MAX_TRAILING_EMPTY_PAGES)return;ctx.state.bookPageCreating=true;ctx.state.bookSaving=true;ctx.render();account.client.from('kp_sticker_book_pages').insert({user_id:account.user.id,title:`シールページ ${pages.length+1}`,page_order:pages.length}).select('id,title,page_order').single().then(({data,error})=>{ctx.state.bookPageCreating=false;ctx.state.bookSaving=false;if(error){ctx.state.bookError=true;ctx.render();return;}pages.push({id:data.id,title:data.title,items:[]});ctx.state.bookPages=pages;ctx.state.bookPage=pages.length-1;ctx.render();}).catch(()=>{ctx.state.bookPageCreating=false;ctx.state.bookSaving=false;ctx.state.bookError=true;ctx.render();});}
  function flip(ctx,n){ctx.state.bookPage=clamp(ctx.state.bookPage+n,0,ctx.state.bookPages.length-1);ctx.state.selectedBookSticker=null;ctx.render();requestAnimationFrame(()=>normalizePageLayout(ctx));}
  function stickerImage(ctx,key){const s=ctx.STICKERS.find(x=>x.id===key);return s?'./assets/stickers/'+s.art:'';}
  function pageMetrics(pageEl){const r=pageEl.getBoundingClientRect(),s=getComputedStyle(pageEl),bl=parseFloat(s.borderLeftWidth)||0,br=parseFloat(s.borderRightWidth)||0,bt=parseFloat(s.borderTopWidth)||0,bb=parseFloat(s.borderBottomWidth)||0;return{left:r.left+bl,top:r.top+bt,width:Math.max(1,r.width-bl-br),height:Math.max(1,r.height-bt-bb)};}
  function clearPlacedSelection(ctx){ctx.state.selectedBookSticker=null;ctx.setSelectedSticker(null);ctx.root.querySelectorAll('.kp-placed-sticker.selected').forEach(el=>el.classList.remove('selected'));ctx.root.querySelector('.kp-selected-sticker-bar')?.remove();}
  function getStickerSize(){return Math.min(76,Math.max(56,window.innerWidth*.17));}
  function clearDragPreview(ctx){if(dragGhost){dragGhost.remove();dragGhost=null;}ctx.root.querySelector('.kp-placed-sticker.is-dragging')?.classList.remove('is-dragging');ctx.root.querySelector('#kpStickerBook')?.classList.remove('is-drop-target');}
  function place(ctx,instanceId){if(suppressInventoryClick===instanceId&&Date.now()<suppressClickUntil){suppressInventoryClick='';return;}const board=ctx.root.querySelector('#kpStickerBook'),metrics=pageMetrics(board),size=getStickerSize(),page=ctx.state.bookPages[ctx.state.bookPage],position=nearestFreeCell(page.items,metrics,size,size,null);if(position)placeAt(ctx,instanceId,position.x,position.y);else ctx.toast('このページはいっぱいです。新しいページを追加してください');}
  async function placeAt(ctx,instanceId,x,y){if(!account)return;const page=ctx.state.bookPages[ctx.state.bookPage];if(page.items.some(i=>i.userStickerId===instanceId)){ctx.toast('このページにはもう貼ってあるよ。シールを動かしてみよう');return;}const sticker=ctx.state.bookInventory.find(s=>s.id===instanceId);if(!sticker)return;ctx.state.bookSaving=true;ctx.render();const {data,error}=await account.client.from('kp_sticker_book_items').insert({user_id:account.user.id,page_id:page.id,user_sticker_id:instanceId,x,y,z_order:page.items.length}).select('id').single();ctx.state.bookSaving=false;if(error){ctx.state.bookError=true;ctx.render();return;}page.items.push({id:data.id,userStickerId:instanceId,stickerKey:sticker.sticker_key,x,y});clearPlacedSelection(ctx);ctx.render();}
  function nearestFreeCell(occupied,bounds,width,height,preferred){
    const cols=4,rows=5,cellW=bounds.width/cols,cellH=bounds.height/rows,used=new Set();
    occupied.forEach(item=>{
      const cx=(Number(item.x)||0)/100*bounds.width+width/2,cy=(Number(item.y)||0)/100*bounds.height+height/2;
      const col=clamp(Math.floor(cx/cellW),0,cols-1),row=clamp(Math.floor(cy/cellH),0,rows-1);
      used.add(`${row}:${col}`);
    });
    let preferredCol=0,preferredRow=0;
    if(preferred){
      const cx=clamp(preferred.x/100*bounds.width+width/2,0,bounds.width),cy=clamp(preferred.y/100*bounds.height+height/2,0,bounds.height);
      preferredCol=clamp(Math.floor(cx/cellW),0,cols-1);preferredRow=clamp(Math.floor(cy/cellH),0,rows-1);
    }
    const candidates=[];
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++)if(!used.has(`${row}:${col}`))candidates.push({row,col,distance:Math.hypot((col-preferredCol)*cellW,(row-preferredRow)*cellH)});
    candidates.sort((a,b)=>a.distance-b.distance||a.row-b.row||a.col-b.col);
    const cell=candidates[0];if(!cell)return null;
    const left=clamp(cell.col*cellW+(cellW-width)/2,0,Math.max(0,bounds.width-width));
    const top=clamp(cell.row*cellH+(cellH-height)/2,0,Math.max(0,bounds.height-height));
    return{x:left/bounds.width*100,y:top/bounds.height*100};
  }
  function separateOverlappedAt(ctx,page,board,selectedIndex){
    const selected=board.querySelector(`.kp-placed-sticker[data-index="${selectedIndex}"]`);if(!selected)return false;
    const target=selected.getBoundingClientRect(),bounds=pageMetrics(board),entries=page.items.map((item,index)=>({item,index,el:board.querySelector(`.kp-placed-sticker[data-index="${index}"]`)})).filter(x=>x.el);
    const overlaps=entries.filter(x=>x.index!==selectedIndex&&(()=>{const r=x.el.getBoundingClientRect();return target.left<r.right&&target.right>r.left&&target.top<r.bottom&&target.bottom>r.top;})());
    if(!overlaps.length)return false;
    const moving=new Set(overlaps.map(x=>x.index)),accepted=entries.filter(x=>!moving.has(x.index)).map(x=>x.item);let changed=false;
    overlaps.forEach(({item,el})=>{const pos=nearestFreeCell(accepted,bounds,el.offsetWidth,el.offsetHeight,{x:item.x,y:item.y});if(!pos)return;item.x=pos.x;item.y=pos.y;el.style.left=pos.x+'%';el.style.top=pos.y+'%';accepted.push(item);changed=true;});
    return changed;
  }
  function normalizePageLayout(ctx){const board=ctx.root.querySelector('#kpStickerBook'),page=ctx.state.bookPages?.[ctx.state.bookPage];if(!board||!page)return;const bounds=pageMetrics(board);let changed=false;const accepted=[];page.items.forEach((item,i)=>{const el=board.querySelector(`.kp-placed-sticker[data-index="${i}"]`);if(!el)return;const preferred={x:Number(item.x)||0,y:Number(item.y)||0},position=nearestFreeCell(accepted,bounds,el.offsetWidth,el.offsetHeight,preferred);if(!position)return;if(Math.abs(position.x-item.x)>.02||Math.abs(position.y-item.y)>.02){item.x=position.x;item.y=position.y;el.style.left=position.x+'%';el.style.top=position.y+'%';changed=true;}accepted.push(item);});if(changed)saveLayout(ctx);}
  function saveLayout(ctx){const page=ctx.state.bookPages[ctx.state.bookPage];if(!page||!account)return;const client=account.client,userId=account.user.id,updates=page.items.map(i=>({id:i.id,x:i.x,y:i.y}));ctx.state.bookSaving=true;ctx.state.bookError=false;const status=ctx.root.querySelector('.kp-book-save-state');if(status)status.textContent='保存中…';clearTimeout(saveTimer);saveTimer=setTimeout(async()=>{const results=await Promise.all(updates.map(i=>client.from('kp_sticker_book_items').update({x:i.x,y:i.y}).eq('id',i.id).eq('user_id',userId)));ctx.state.bookSaving=false;ctx.state.bookError=results.some(r=>r.error);const currentStatus=ctx.root.querySelector('.kp-book-save-state');if(currentStatus)currentStatus.textContent=ctx.state.bookError?'保存できませんでした。通信を確認してください。':'変更は自動で保存されます';if(ctx.state.bookError)console.warn('[Koepanda] sticker positions failed to save',results.filter(r=>r.error));},180);}
  async function removeSelected(ctx){const page=ctx.state.bookPages[ctx.state.bookPage],id=ctx.state.selectedBookSticker;if(!id||!account)return;const {error}=await account.client.from('kp_sticker_book_items').delete().eq('id',id).eq('user_id',account.user.id);if(error){ctx.state.bookError=true;ctx.render();return;}page.items=page.items.filter(i=>i.id!==id);ctx.state.selectedBookSticker=null;ctx.render();}
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/features/sticker-book.js", error); }

/* Source: js/features/rewards.js */
try {
(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  const SERIES_IDS={pinyin:new Set(['a','o','e','n']),hanzi:new Set(['shan','shui','ren','hao'])};
  function seriesItems(catalog,key){const items=Array.isArray(catalog)?catalog:[];if(SERIES_IDS[key])return items.filter(s=>SERIES_IDS[key].has(s.id));if(key==='zodiac-pinyin')return items.filter(s=>s.id.startsWith('zodiac_')&&s.id.endsWith('_pinyin'));if(key==='zodiac-hanzi')return items.filter(s=>s.id.startsWith('zodiac_')&&s.id.endsWith('_kanji'));return [];}
  window.KoepandaFeatures.rewards = function({head,state,safe,img,STICKERS}){
    const ownedIds=Array.isArray(state.rewardStickerKeys)?state.rewardStickerKeys:state.unlocked;
    const unlocked=state.rewardStickerCountLabel||'確認中…';
    const countLoading=unlocked==='確認中…';
    const seriesCard=(key,title,caption,items)=>{const owned=items.filter(s=>ownedIds.includes(s.id));return `<button class="kp-series-card" data-action="show-series" data-series="${key}" aria-label="${safe(title)}、全${items.length}種類を見る"><span class="kp-series-art">${items.slice(0,4).map(s=>`<img src="${img(s.id)}" alt="">`).join('')}</span><b>${safe(title)}</b><small>${safe(caption)}</small><span class="kp-series-count">${countLoading?'—':owned.length} / ${items.length}</span><span class="kp-series-open">全${items.length}種類を見る　›</span></button>`;};
    const pinyin=seriesItems(STICKERS,'pinyin'),hanzi=seriesItems(STICKERS,'hanzi'),zodiacPinyin=seriesItems(STICKERS,'zodiac-pinyin'),zodiacHanzi=seriesItems(STICKERS,'zodiac-hanzi');
    return `${head('がんばりが形になる','ごほうびボックス','学んだ文字が、集めて飾れるシールに。お気に入りも管理できるよ。')}<div class="kp-reward-hero"><span>🎁</span><div><b>獲得済みシール：${unlocked}</b><small>ミニクイズを最後までクリアすると、ごほうびシールを1枚受け取れます。</small></div><button data-go="book" class="kp-primary">シール帳を開く</button></div><section class="kp-section"><div class="kp-section-title"><h2>シリーズ</h2><span>デザインを見てみよう</span></div><div class="kp-series-grid">${seriesCard('pinyin','拼音小芽','音と文字のシール',pinyin)}${seriesCard('hanzi','汉字探险','漢字のなかまたち',hanzi)}${seriesCard('zodiac-pinyin','声調果冻','声調を楽しむ十二生肖',zodiacPinyin)}${seriesCard('zodiac-hanzi','生肖印章','漢字を集める十二生肖',zodiacHanzi)}</div></section><section class="kp-section"><div class="kp-section-title"><h2>お気に入り</h2><span>シール帳に飾るものを選ぼう</span></div><div class="kp-favorite-grid">${ownedIds.map(id=>{const s=STICKERS.find(x=>x.id===id);if(!s)return'';return `<button data-action="favorite" data-id="${id}" class="${state.favorites.includes(id)?'is-favorite':''}"><img src="${img(id)}" alt=""><span>${state.favorites.includes(id)?'★':'☆'} ${safe(s.glyph)}</span></button>`;}).join('')||'<div class="kp-empty-favorites">シールを集めると、ここからお気に入りを選べます。</div>'}</div></section><section class="kp-season-teaser compact"><div class="kp-limited-badge">近日予告</div><div><h3>季節限定・特別デザイン</h3><p>ぷっくり、透け感、きらきらなど、見た目のちがうシールも登場予定。</p></div><button data-go="book" class="kp-secondary">シール帳を見る</button></section><div class="kp-soft-note">学習のごほうびは、ログイン中のアカウントとシール帳に保存されます。</div>`;
  };
  window.KoepandaFeatures.rewards.mount=async ctx=>{
    try{
      const api=window.KP_ACCOUNT_API,client=api&&await api.getClient();
      const session=client&&await client.auth.getSession(),user=session?.data?.session?.user;
      if(!user){const ids=[...new Set(ctx.state.unlocked)];ctx.state.rewardStickerKeys=ids;const label=`${ids.length} 種類`;if(ctx.state.rewardStickerCountLabel!==label){ctx.state.rewardStickerCountLabel=label;ctx.render();}return;}
      if(ctx.state.rewardStickerUserId===user.id||ctx.state.rewardStickerLoadFailed)return;
      ctx.state.rewardStickerUserId=user.id;
      ctx.state.rewardStickerCountLabel='確認中…';
      ctx.render();
      const {data,error}=await client.from('kp_user_stickers').select('sticker_key').eq('user_id',user.id);
      if(error)throw error;
      const ids=[...new Set((data||[]).map(row=>row.sticker_key).filter(Boolean))];
      ctx.state.rewardStickerKeys=ids;
      ctx.state.rewardStickerCountLabel=`${ids.length} 種類`;
      ctx.render();
    }catch(_){
      ctx.state.rewardStickerCountLabel='— 種類';
      ctx.state.rewardStickerLoadFailed=true;
      ctx.render();
    }
  };
  window.KoepandaFeatures.rewards.actions={
    favorite:(ctx,b)=>{const id=b.dataset.id;ctx.state.favorites=ctx.state.favorites.includes(id)?ctx.state.favorites.filter(x=>x!==id):ctx.state.favorites.concat(id);ctx.save();ctx.render();},
    'show-series':(ctx,b)=>{const catalog=Array.isArray(window.KoepandaCatalog?.STICKERS)?window.KoepandaCatalog.STICKERS:ctx.STICKERS;const groups={pinyin:{title:'拼音小芽',items:seriesItems(catalog,'pinyin')},hanzi:{title:'汉字探险',items:seriesItems(catalog,'hanzi')},'zodiac-pinyin':{title:'声調果冻',items:seriesItems(catalog,'zodiac-pinyin')},'zodiac-hanzi':{title:'生肖印章',items:seriesItems(catalog,'zodiac-hanzi')}};const group=groups[b.dataset.series];if(!group)return;ctx.modal(group.title,`<p class="kp-modal-copy">${group.items.length}種類のデザイン</p><div class="kp-series-gallery">${group.items.map(s=>`<figure><img src="${ctx.img(s.id)}" alt="${ctx.safe(s.name)}"><figcaption>${ctx.safe(s.glyph)}</figcaption></figure>`).join('')}</div>`);}
  };
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/features/rewards.js", error); }

/* Source: js/koepanda-account-301.168.js */
try {
/* 10.108.301.168 — isolated Supabase account and read-only cloud record view.
   Existing lesson flows and local progress keys are intentionally untouched. */
(function () {
  'use strict';

  var config = window.KP_CLOUD_CONFIG || {};
  var clientPromise = null;
  var client = null;
  var currentUser = null;
  var activeTab = 'signin';
  var dialog;
  var trigger;
  var content;
  var status;
  var renderVersion = 0;

  function configured() {
    return Boolean(config.url && config.publishableKey);
  }

  function getClient() {
    if (!clientPromise) {
      clientPromise = (async function () {
        if (!configured()) return null;
        var module = await import('https://esm.sh/@supabase/supabase-js@2');
        client = module.createClient(config.url, config.publishableKey, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
        return client;
      })();
    }
    return clientPromise;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function setStatus(message, kind) {
    if (!status) return;
    status.textContent = message || '';
    status.dataset.kind = kind || 'info';
    if (message && dialog.open) {
      var bounds = status.getBoundingClientRect();
      var panel = dialog.getBoundingClientRect();
      if (bounds.top < panel.top || bounds.bottom > panel.bottom) {
        status.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }

  function friendlyError(error) {
    var message = String(error && (error.message || error) || '');
    if (/Invalid login credentials/i.test(message)) return 'メールアドレスまたはパスワードを確認してください。';
    if (/already registered|User already registered/i.test(message)) return 'このメールアドレスは登録済みです。ログインしてください。';
    if (/Password should be|password.*(characters|length)/i.test(message)) return 'パスワードは8文字以上で入力してください。';
    if (/Email not confirmed/i.test(message)) return '確認メールのリンクを開いてからログインしてください。';
    if (/Failed to fetch|NetworkError/i.test(message)) return '通信できませんでした。接続とSupabase設定を確認してください。';
    return '処理に失敗しました。入力内容とSupabase設定を確認してください。';
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function makeTrigger() {
    var home = document.getElementById('kpFeatureRoot');
    if (!home || document.getElementById('kpAccountTrigger')) return;
    trigger = el('button', 'kp-account-trigger', 'ログインして学習記録を見る');
    trigger.id = 'kpAccountTrigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.addEventListener('click', openDialog);
    home.insertAdjacentElement('afterend', trigger);
  }

  function createDialog() {
    if (dialog) return;
    dialog = el('dialog', 'kp-account-dialog');
    dialog.id = 'kpAccountDialog';
    dialog.setAttribute('aria-labelledby', 'kpAccountTitle');
    var shell = el('section', 'kp-account-shell');
    var header = el('header', 'kp-account-header');
    var titleWrap = el('div');
    titleWrap.append(el('p', 'kp-account-eyebrow', 'KOEPANDA ACCOUNT'));
    var heading = el('h2', '', '学習記録');
    heading.id = 'kpAccountTitle';
    titleWrap.append(heading);
    var close = el('button', 'kp-account-close', '閉じる');
    close.type = 'button';
    close.setAttribute('aria-label', '閉じる');
    close.addEventListener('click', function () { dialog.close(); });
    header.append(titleWrap, close);
    content = el('div', 'kp-account-content');
    status = el('p', 'kp-account-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    shell.append(header, content, status);
    dialog.append(shell);
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
    document.body.append(dialog);
  }

  function openDialog() {
    createDialog();
    render();
    if (!dialog.open) dialog.showModal();
    if (configured()) refreshSession();
  }

  function addLabel(form, labelText, input) {
    var wrap = el('label', 'kp-account-field');
    wrap.append(el('span', '', labelText), input);
    form.append(wrap);
  }

  function input(type, name, autocomplete, placeholder) {
    var field = document.createElement('input');
    field.type = type;
    field.name = name;
    field.autocomplete = autocomplete;
    field.placeholder = placeholder || '';
    field.required = type !== 'text';
    if (type === 'password') field.minLength = 8;
    return field;
  }

  function renderAuth() {
    renderVersion += 1;
    clear(content);
    var form = el('form', 'kp-account-form');
    form.noValidate = true;
    if (activeTab === 'signup') {
      var name = input('text', 'display_name', 'name', '例：パンダ');
      name.required = false;
      addLabel(form, '表示名（任意）', name);
    }
    addLabel(form, 'メールアドレス', input('email', 'email', 'email', 'name@example.com'));
    addLabel(form, 'パスワード（8文字以上）', input('password', 'password', activeTab === 'signup' ? 'new-password' : 'current-password'));
    var submit = el('button', 'kp-account-primary', activeTab === 'signup' ? 'アカウントを作成' : 'ログイン');
    submit.type = 'submit';
    var switcher = el('button', 'kp-account-link', activeTab === 'signup' ? 'すでに登録済みの方はこちら' : '初めての方はこちらから登録');
    switcher.type = 'button';
    switcher.addEventListener('click', function () {
      activeTab = activeTab === 'signup' ? 'signin' : 'signup';
      setStatus('');
      renderAuth();
    });
    form.append(status, submit, switcher);
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var email = String(data.get('email') || '').trim();
      var password = String(data.get('password') || '');
      if (!email || form.elements.email.validity.typeMismatch) {
        setStatus('メールアドレスを正しく入力してください。', 'error');
        return;
      }
      if (password.length < 8) {
        setStatus('パスワードは8文字以上で入力してください。', 'error');
        return;
      }
      setStatus(activeTab === 'signup' ? 'アカウントを作成しています…' : 'ログインしています…');
      submit.disabled = true;
      try {
        var c = await getClient();
        if (!c) throw new Error('cloud_not_configured');
        var result = activeTab === 'signup'
          ? await c.auth.signUp({
              email: email,
              password: password,
              options: { emailRedirectTo: window.location.origin, data: { display_name: String(data.get('display_name') || '').trim(), timezone: 'Asia/Tokyo' } }
            })
          : await c.auth.signInWithPassword({ email: email, password: password });
        if (result.error) throw result.error;
        if (activeTab === 'signup' && result.data && result.data.user && !result.data.session) {
          activeTab = 'signin';
          renderAuth();
          setStatus('確認メールを送信しました。メール内のリンクを開いてからログインしてください。', 'success');
          return;
        }
        currentUser = result.data.user || null;
        if (trigger) trigger.textContent = '学習記録を開く';
        window.dispatchEvent(new CustomEvent('kp-auth-state-changed', { detail: { user: currentUser } }));
        if (dialog && dialog.open) dialog.close();
        setStatus('ログインしました。', 'success');
      } catch (error) {
        setStatus(friendlyError(error), 'error');
      } finally {
        submit.disabled = false;
      }
    });
    content.append(form);
    var reset = el('button', 'kp-account-link kp-account-reset', 'パスワードを忘れた場合');
    reset.type = 'button';
    reset.addEventListener('click', async function () {
      var email = form.elements.email.value.trim();
      if (!email) { setStatus('先にメールアドレスを入力してください。', 'error'); return; }
      setStatus('再設定メールを送信しています…');
      try {
        var c = await getClient();
        var result = await c.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        if (result.error) throw result.error;
        setStatus('パスワード再設定メールを送信しました。', 'success');
      } catch (error) { setStatus(friendlyError(error), 'error'); }
    });
    content.append(reset);
    if (!configured()) {
      setStatus('SupabaseのProject URLと公開用キーを設定すると利用できます。', 'error');
    }
  }

  function statCard(label, value) {
    var card = el('div', 'kp-account-stat');
    card.append(el('span', '', label), el('strong', '', String(value)));
    return card;
  }

  function listSection(title, rows, formatter, emptyText) {
    var section = el('section', 'kp-account-list-section');
    section.append(el('h3', '', title));
    if (!rows || !rows.length) {
      section.append(el('p', 'kp-account-empty', emptyText));
      return section;
    }
    var list = el('ul', 'kp-account-list');
    rows.forEach(function (row) {
      var item = el('li', '', formatter(row));
      list.append(item);
    });
    section.append(list);
    return section;
  }

  function renderAccount() {
    content.after(status);
    var requestVersion = ++renderVersion;
    clear(content);
    if (!currentUser) { renderAuth(); return; }
    var top = el('div', 'kp-account-user');
    top.append(el('p', 'kp-account-greeting', 'ログイン中'));
    top.append(el('strong', '', currentUser.email || ''));
    content.append(top);
    var loading = el('p', 'kp-account-loading', '学習記録を読み込んでいます…');
    content.append(loading);
    loadAccountData().then(function (result) {
      if (requestVersion !== renderVersion || result.userId !== (currentUser && currentUser.id)) return;
      loading.remove();
      var profileName = result.profile && result.profile.display_name || currentUser.user_metadata && currentUser.user_metadata.display_name || '学習者';
      top.insertBefore(el('h3', '', profileName), top.firstChild);
      var profileForm = el('form', 'kp-account-profile-form');
      var profileInput = input('text', 'display_name', 'nickname', '表示名');
      profileInput.required = false;
      profileInput.value = result.profile && result.profile.display_name || '';
      addLabel(profileForm, '表示名を変更', profileInput);
      var saveProfile = el('button', 'kp-account-secondary', '表示名を保存');
      saveProfile.type = 'submit';
      profileForm.append(saveProfile);
      profileForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        var displayName = profileInput.value.trim().slice(0, 60);
        if (!displayName) { setStatus('表示名を入力してください。', 'error'); return; }
        saveProfile.disabled = true;
        setStatus('表示名を保存しています…');
        try {
          var c = await getClient();
          var saved = await c.from('profiles').update({ display_name: displayName }).eq('user_id', currentUser.id).select('user_id').maybeSingle();
          if (saved.error) throw saved.error;
          if (!saved.data) throw new Error('profile_not_found');
          top.querySelector('h3').textContent = displayName;
          setStatus('表示名を保存しました。', 'success');
        } catch (error) { setStatus(friendlyError(error), 'error'); }
        finally { saveProfile.disabled = false; }
      });
      content.insertBefore(profileForm, top.nextSibling);
      var stats = el('div', 'kp-account-stats');
      stats.append(statCard('学習日数', result.dayCount), statCard('修了した単元', result.completedCount), statCard('ごほうび', result.rewardCount));
      content.insertBefore(stats, profileForm.nextSibling);
      content.append(listSection('最近の学習', result.progress.slice(0, 6), function (row) {
        return row.course_id + ' / ' + row.unit_id + '　' + (row.status === 'completed' ? '修了' : '学習中') + (row.score != null && row.total ? '　' + row.score + '/' + row.total : '');
      }, '学習記録はまだありません。'), listSection('ごほうび', result.rewards.slice(0, 6), function (row) {
        return row.reward_id + '　' + new Date(row.earned_at).toLocaleDateString('ja-JP');
      }, '獲得したごほうびはまだありません。'));
      setStatus('このアカウントの記録を表示しています。', 'success');
    }).catch(function (error) {
      if (requestVersion !== renderVersion) return;
      loading.textContent = friendlyError(error);
      setStatus('記録を読み込めませんでした。データベースのRLSと列名を確認してください。', 'error');
    });
    var signout = el('button', 'kp-account-secondary', 'ログアウト');
    signout.type = 'button';
    signout.addEventListener('click', async function () {
      try {
        var c = await getClient();
        var result = await c.auth.signOut();
        if (result.error) throw result.error;
        currentUser = null;
        if (trigger) trigger.textContent = 'ログインして学習記録を見る';
        window.dispatchEvent(new CustomEvent('kp-auth-state-changed', { detail: { user: null } }));
        activeTab = 'signin';
        setStatus('ログアウトしました。', 'success');
        renderAuth();
      } catch (error) { setStatus(friendlyError(error), 'error'); }
    });
    content.append(signout);
  }

  async function loadAccountData() {
    var c = await getClient();
    var user = currentUser;
    if (!c || !user) throw new Error('sign_in_required');
    var results = await Promise.all([
      c.from('profiles').select('display_name,timezone').eq('user_id', user.id).maybeSingle(),
      c.from('learning_days').select('study_date', { count: 'exact', head: true }).eq('user_id', user.id),
      c.from('course_progress').select('unit_id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
      c.from('course_progress').select('course_id,unit_id,status,score,total,updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(30),
      c.from('earned_rewards').select('reward_id', { count: 'exact', head: true }).eq('user_id', user.id),
      c.from('earned_rewards').select('reward_id,earned_at').eq('user_id', user.id).order('earned_at', { ascending: false }).limit(30)
    ]);
    var failed = results.find(function (item) { return item.error; });
    if (failed) throw failed.error;
    return { userId: user.id, profile: results[0].data, dayCount: results[1].count || 0, completedCount: results[2].count || 0, progress: results[3].data || [], rewardCount: results[4].count || 0, rewards: results[5].data || [] };
  }

  function updateSessionUser(session) {
    var previousId = currentUser && currentUser.id;
    currentUser = session && session.user || null;
    if (dialog && dialog.open && previousId !== (currentUser && currentUser.id)) {
      render();
    }
  }

  async function refreshSession() {
    try {
      var c = await getClient();
      if (!c) return;
      var result = await c.auth.getSession();
      if (result.error) throw result.error;
      updateSessionUser(result.data.session);
      if (currentUser && trigger) trigger.textContent = '学習記録を開く';
      else if (trigger) trigger.textContent = 'ログインして学習記録を見る';
    } catch (error) {
      if (dialog && dialog.open) setStatus(friendlyError(error), 'error');
    }
  }

  window.KP_ACCOUNT_API = {
    open: openDialog,
    getClient: getClient,
    getSession: async function () {
      var c = await getClient();
      if (!c) return null;
      var result = await c.auth.getSession();
      if (result.error) throw result.error;
      return result.data.session || null;
    },
    recordLearningCompletion: async function (source, unitId) {
      var now = new Date(), day = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
      try {
        if (typeof window.completeDailyGoal === 'function') window.completeDailyGoal();
        else {
          var state = JSON.parse(localStorage.getItem('toneCoachDailyGoalV1') || '{}');
          var days = Array.isArray(state.days) ? state.days.filter(function(d){return /^\d{4}-\d{2}-\d{2}$/.test(d);}) : [];
          if(state.lastDay && !days.includes(state.lastDay))days.push(state.lastDay);
          if(state.lastDay !== day){
            var previous = new Date(now); previous.setDate(now.getDate()-1);
            var yesterday = previous.getFullYear()+'-'+String(previous.getMonth()+1).padStart(2,'0')+'-'+String(previous.getDate()).padStart(2,'0');
            state.streak = state.lastDay === yesterday ? (Number(state.streak)||0)+1 : 1;
            state.best = Math.max(Number(state.best)||0,state.streak);state.lastDay=day;
          }
          state.days=Array.from(new Set(days.concat(day))).sort().slice(-30);
          localStorage.setItem('toneCoachDailyGoalV1',JSON.stringify(state));
        }
        window.dispatchEvent(new CustomEvent('kp-learning-activity-recorded',{detail:{day:day,source:source,unitId:unitId}}));
      } catch(error) { console.warn('[Koepanda] local completion unavailable:',error); }
      try {
        var c=await getClient();if(!c)return false;
        var session=await c.auth.getSession();if(session.error)throw session.error;
        var user=session.data.session&&session.data.session.user;if(!user)return false;
        var result=await c.from('learning_days').insert({user_id:user.id,study_date:day,source:'completed_practice'});
        if(result.error&&result.error.code!=='23505')throw result.error;
        return true;
      } catch(error) { console.warn('[Koepanda] completion sync unavailable:',error);return false; }
    },
    recordPracticeAttempt: async function (itemKey, courseKey, isCorrect) {
      var c = await getClient();
      if (!c) return false;
      var sessionResult = await c.auth.getSession();
      if (sessionResult.error) throw sessionResult.error;
      if (!sessionResult.data.session) return false;
      var result = await c.rpc('kp_record_practice_attempt', {
        p_item_key: String(itemKey),
        p_course_key: String(courseKey),
        p_correct: Boolean(isCorrect)
      });
      if (result.error) throw result.error;
      window.dispatchEvent(new CustomEvent('kp-practice-state-changed'));
      return true;
    },
    getPracticeReviewQueue: async function (courseKey, options) {
      var c = await getClient();
      if (!c) return null;
      var sessionResult = await c.auth.getSession();
      if (sessionResult.error) throw sessionResult.error;
      if (!sessionResult.data.session) return null;
      var query = c.from('kp_item_mastery')
        .select('item_key,course_key,correct_streak,wrong_count,interval_days,due_at,last_seen_at,mastered_at')
        .is('mastered_at', null)
        .order('due_at', { ascending: true })
        .limit(100);
      if (courseKey) query = query.eq('course_key', String(courseKey));
      if (options?.excludeCourse) query = query.neq('course_key', options.excludeCourse);
      if (options?.dueOnly) query = query.lte('due_at', new Date().toISOString());
      var result = await query;
      if (result.error) throw result.error;
      return result.data || [];
    }
  };

  function render() {
    if (currentUser) renderAccount();
    else renderAuth();
  }

  function boot() {
    makeTrigger();
    createDialog();
    if (configured()) {
      getClient().then(function (c) {
        if (!c) return;
        c.auth.getSession().then(function (result) {
          updateSessionUser(result.data && result.data.session);
          if (currentUser && trigger) trigger.textContent = '学習記録を開く';
        });
        c.auth.onAuthStateChange(function (_event, session) {
          updateSessionUser(session);
          window.dispatchEvent(new CustomEvent('kp-auth-state-changed', { detail: { user: currentUser } }));
          if (trigger) trigger.textContent = currentUser ? '学習記録を開く' : 'ログインして学習記録を見る';
        });
      }).catch(function () {
        if (trigger) trigger.textContent = 'アカウント設定を確認';
      });
    }
  }

  window.KPCloud = window.KPCloud || {};
  window.KPCloud.configured = configured;
  window.KPCloud.client = getClient;
  window.KPCloud.loadAccountData = loadAccountData;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/koepanda-account-301.168.js", error); }

/* Source: js/app-shell.js */
try {
/* Koepanda app shell — shared routing, state and UI shell.
   Feature modules are isolated so a missing page module cannot stop the whole shell. */
(function(){
  'use strict';
  const KEY='koepanda.community.301166';
  const STICKERS=(window.KoepandaCatalog&&Array.isArray(window.KoepandaCatalog.STICKERS))?window.KoepandaCatalog.STICKERS:[];
  const QUESTIONS=(window.KoepandaFeatures&&window.KoepandaFeatures.practice&&Array.isArray(window.KoepandaFeatures.practice.questions))?window.KoepandaFeatures.practice.questions:[];
  const initial={pages:[[]], activePage:0, wrongs:{}, mastered:{}, unlocked:[], favorites:[], lastQuiz:0};
  let state;
  try{state=Object.assign({},initial,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(_){state=Object.assign({},initial);}
  if(state.stickerCollectionVersion!==1){state.unlocked=[];state.favorites=[];state.stickerCollectionVersion=1;}
  ['pages','unlocked','favorites'].forEach(k=>{if(!Array.isArray(state[k]))state[k]=initial[k].slice();});
  ['friends','greetings','trades','friendCode','progressVisible'].forEach(k=>delete state[k]);
  ['wrongs','mastered'].forEach(k=>{if(!state[k]||typeof state[k]!=='object'||Array.isArray(state[k]))state[k]={};});
  if(!state.pages.length)state.pages=[[]];
  state.pages=state.pages.map(p=>Array.isArray(p)?p:[]);
  state.activePage=Math.max(0,Math.min(state.pages.length-1,Number.isInteger(state.activePage)?state.activePage:0));
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}}
  save();
  function img(id){const s=STICKERS.find(x=>x.id===id);return s?'./assets/stickers/'+s.art:'';}
  function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
  function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  const initialPage=new URLSearchParams(location.search).get('open');
  let root, page=['practice','book','records'].includes(initialPage)?initialPage:'learn', selectedSticker=null, pendingPinyin=false;
  if(initialPage==='book'){state.bookOpen=true;state.bookReady=false;state.bookFocusInventory=true;}
  let ownPresenceClient=null,ownPresenceChannel=null,ownPresenceAuth=null,ownPresenceBusy=false;
  async function syncOwnPresence(){
    if(ownPresenceBusy)return;ownPresenceBusy=true;
    try{
      const api=window.KP_ACCOUNT_API;if(!api||typeof api.getClient!=='function')return;
      const client=await api.getClient();if(!client)return;ownPresenceClient=client;
      const sessionResult=await client.auth.getSession();const user=sessionResult.data?.session?.user;
      const stop=async()=>{if(ownPresenceChannel){const channel=ownPresenceChannel;ownPresenceChannel=null;try{await client.removeChannel(channel);}catch(_){}}};
      if(!user){await stop();return;}
      const profile=await client.from('kp_social_profiles').select('online_visible').eq('user_id',user.id).maybeSingle();
      if(profile.error||!profile.data?.online_visible){await stop();return;}
      if(ownPresenceChannel&&ownPresenceChannel.topic===`realtime:kp-presence-${user.id}`)return;
      await stop();
      const channel=client.channel(`kp-presence-${user.id}`,{config:{private:true,presence:{key:user.id}}});ownPresenceChannel=channel;
      channel.subscribe(async status=>{if(status==='SUBSCRIBED'&&ownPresenceChannel===channel){const result=await channel.track({user_id:user.id});if(result==='error')console.warn('[Koepanda] presence publish failed');}});
    }catch(error){console.warn('[Koepanda] presence sync unavailable:',error);}
    finally{ownPresenceBusy=false;}
  }
  function startPresenceManager(){
    window.KP_PRESENCE_MANAGER={refresh:syncOwnPresence,stop:async()=>{if(ownPresenceClient&&ownPresenceChannel){const channel=ownPresenceChannel;ownPresenceChannel=null;try{await ownPresenceClient.removeChannel(channel);}catch(_){}}}};
    Promise.resolve().then(syncOwnPresence);
    const api=window.KP_ACCOUNT_API;if(api&&typeof api.getClient==='function')Promise.resolve(api.getClient()).then(client=>{if(client&&!ownPresenceAuth)ownPresenceAuth=client.auth.onAuthStateChange(()=>setTimeout(syncOwnPresence,0)).data.subscription;}).catch(()=>{});
  }
  function boot(){
    if(root)return;
    root=document.getElementById('kpFeatureRoot');
    if(!root){
    root=el('div','kp-feature-root');root.id='kpFeatureRoot';root.setAttribute('aria-hidden','true');root.innerHTML=`<div class="kp-feature-frame"><header class="kp-feature-header"><a href="./about.html" class="kp-about-link" style="display:grid;justify-items:center;color:#426957;text-decoration:none"><span class="kp-brand"><img class="kp-logo-art" src="./assets/brand/koepanda-logo.jpeg?v=10.108.301.185" alt="小音と声調コーチ Koepanda" width="1536" height="864"></span><span style="font-size:12px;line-height:1.6">Koepandaについて</span></a></header><nav class="kp-feature-nav" aria-label="メインメニュー"><button data-go="learn"><span>学習</span></button><button data-go="practice"><span>練習</span></button><button data-go="story"><span>中国探索</span></button><button data-go="friends"><span>友だち</span></button><button data-go="self"><span>自分</span></button></nav><main class="kp-feature-main" id="kpFeatureMain"></main><p class="kp-prototype-note">友だち機能はログイン後に使えます。自由入力のチャットはありません。</p></div><dialog class="kp-modal" id="kpModal"><div class="kp-modal-body"></div></dialog></div>`;
    document.body.append(root);
    }
    root.addEventListener('click',onClick);
    root.addEventListener('submit',onSubmit);
    root.addEventListener('change',onChange);
    root.addEventListener('pointerdown',e=>dispatchFeaturePointer('pointerDown',e));
    root.addEventListener('pointermove',e=>dispatchFeaturePointer('pointerMove',e));
    root.addEventListener('pointerup',e=>dispatchFeaturePointer('pointerUp',e));
    root.addEventListener('pointercancel',e=>dispatchFeaturePointer('pointerUp',e));
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('is-open'))open('learn');});
    render();
    root.scrollTop=0;
    root.querySelectorAll('[data-shell-wait]').forEach(button=>{button.disabled=false;button.removeAttribute('aria-disabled');button.removeAttribute('data-shell-wait');});
    root.dataset.shellState='ready';
    window.dispatchEvent(new Event('kp-shell-ready'));
    root.classList.add('is-open');root.setAttribute('aria-hidden','false');document.body.classList.add('kp-feature-active');
    startPresenceManager();
    window.addEventListener('kp-auth-state-changed',()=>{state.remoteReviewLoadedAt=0;if(page==='practice')render();});
    window.addEventListener('kp-practice-state-changed',()=>{state.remoteReviewLoadedAt=0;});
    window.addEventListener('pageshow',event=>{if(event.persisted){state.remoteReviewLoadedAt=0;if(page==='practice')render();}});
    const bindHomeReturn=()=>{const previousHome=window.returnToAppHome;window.returnToAppHome=function(){if(previousHome)previousHome();open('learn');};};
    const lessonsReady=()=>{bindHomeReturn();};
    window.addEventListener('kp-pinyin-ready',()=>{if(pendingPinyin&&page==='learn'){const tone=pendingPinyin==='tone';enterPinyin();if(tone)requestAnimationFrame(()=>window.koepandaOpenPinyinUnit?.('P0-U1'));}});
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(lessonsReady,0),{once:true});else lessonsReady();
  }
  function open(where='practice'){pendingPinyin=false;page=where;root.scrollTop=0;window.scrollTo(0,0);root.classList.add('is-open');root.setAttribute('aria-hidden','false');document.body.classList.add('kp-feature-active');render();}
  function close(){root.classList.remove('is-open');root.setAttribute('aria-hidden','true');document.body.classList.remove('kp-feature-active');}
  function updateMain(main,html){
    // Background account/goal updates must not detach the image being downloaded.
    const current=page==='learn'&&main.querySelector('.kp-learning-home');
    if(current){
      const template=document.createElement('template');template.innerHTML=html;
      const next=template.content.querySelector('.kp-learning-home');
      const sections=['.kp-study-record','.kp-study-stamps'];
      if(next&&current.querySelector('.kp-learning-map')&&sections.every(selector=>current.querySelector(selector)&&next.querySelector(selector))){
        sections.forEach(selector=>current.querySelector(selector).replaceWith(next.querySelector(selector)));
        return;
      }
    }
    main.innerHTML=html;
  }
  function render(){
    if(!root)return;
    const main=root.querySelector('#kpFeatureMain');
    const active=page==='book'||page==='rewards'?'self':page==='records'?'learn':page;
    root.querySelectorAll('.kp-feature-nav [data-go]').forEach(b=>b.classList.toggle('is-active',b.dataset.go===active));
    const key=page==='book'?'sticker_book':page==='records'?'learning_records':page==='learn'?'learn':page==='practice'?'practice':page==='friends'?'friends':page==='story'?'story':page==='self'?'self':'rewards';
    const view=window.KoepandaFeatures&&window.KoepandaFeatures[key];
    if(typeof view!=='function'){
      main.innerHTML=`<section class="kp-feature-error" role="alert"><h1>このページを読み込めませんでした</h1><p>読み込みが途中で止まった可能性があります。学習ホームへ戻るか、ページを再読み込みしてください。</p><button class="kp-primary" data-go="learn">学習ホームへ戻る</button></section>`;
      return;
    }
    try{updateMain(main,view({state,img,head,safe,save,STICKERS,QUESTIONS,selectedSticker}));if(typeof view.mount==='function')view.mount({state,img,head,safe,save,STICKERS,QUESTIONS,selectedSticker,main,root,render,toast,modal,closeModal});}
    catch(error){console.error('[Koepanda] feature render failed:',key,error);main.innerHTML=`<section class="kp-feature-error" role="alert"><h1>ページを表示できませんでした</h1><p>このページの読み込み中に問題が起きました。ほかのページへ移動できます。</p><button class="kp-primary" data-go="learn">学習ホームへ戻る</button></section>`;}
  }
  function head(eyebrow,title,sub){return `<div class="kp-page-head"><span class="kp-eyebrow">${eyebrow}</span><h1>${title}</h1><p>${sub}</p></div>`;}
  function actionContext(){return {state,save,safe,img,head,STICKERS,QUESTIONS,selectedSticker,setSelectedSticker:value=>{selectedSticker=value;},setPage:value=>{page=value;root.scrollTop=0;window.scrollTo(0,0);},root,render,toast,modal,closeModal};}
  window.KP_REWARD_CONTEXT=actionContext;
  window.KP_OPEN_STICKER_BOOK=function(){state.bookOpen=true;state.coversOpen=false;state.bookReady=false;state.bookLoadError=false;state.bookError=false;state.bookFocusInventory=true;open('book');};
  function enterPinyin(){
    if(!window.KP_PINYIN_READY||typeof window.koepandaEnterKidsCourse!=='function'){toast('教材を準備しています。準備ができると自動で開きます。');return;}
    pendingPinyin=false;
    close();window.koepandaEnterKidsCourse();
  }
  function onClick(e){
    const go=e.target.closest('[data-go]');if(go){pendingPinyin=false;if(go.dataset.go==='book'){state.bookOpen=false;state.bookReady=false;state.coversOpen=false;}page=go.dataset.go;root.scrollTop=0;window.scrollTo(0,0);render();return;}
    const b=e.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;
    if(action==='close'){open('learn');return;}
    if(action==='account'){const account=window.KP_ACCOUNT_API;if(account&&typeof account.open==='function')account.open();else toast('ログイン画面を読み込めませんでした。ページを再読み込みしてください。');return;}
    if(action==='pinyin-course'){if(!window.KP_PINYIN_READY){pendingPinyin=true;toast('ピンイン教材を準備しています。準備ができると自動で開きます。');return;}enterPinyin();return;}
    if(action==='pinyin-due-review'){
      const review=window.KP_PINYIN_REVIEW;
      if(!window.KP_PINYIN_READY||!review){toast('ピンイン教材を準備しています。');return;}
      b.disabled=true;
      review.load().then(items=>{
        if(!b.isConnected||page!=='practice')return;
        if(items===null){toast('ログインするとピンインの復習を使えます。');return;}
        if(!items.length){toast('今日は復習するピンインの問題がありません。');return;}
        enterPinyin();
        if(!review.open(items))open('practice');
      }).catch(()=>toast('復習を読み込めませんでした。もう一度お試しください。')).finally(()=>{b.disabled=false});
      return;
    }
    if(action==='pinyin-tone-start'){if(!window.KP_PINYIN_READY){pendingPinyin='tone';toast('四声の学習を準備しています。');return;}enterPinyin();requestAnimationFrame(()=>window.koepandaOpenPinyinUnit?.('P0-U1'));return;}
    if(action==='pinyin-resume'){
      const id=window.KP_PINYIN_CHAPTER_STATE?.read()?.lastUnit;
      if(!window.KP_PINYIN_READY||!id){enterPinyin();return;}
      enterPinyin();
      requestAnimationFrame(()=>{if(!window.koepandaOpenPinyinUnit?.(id))toast('この章を開けません。学習ロードから選んでね。');});
      return;
    }
    if(action==='legacy'){close();const area=b.dataset.mode==='listen'?'listen':b.dataset.mode==='talk'?'chat':'repeat';if(window.openHomeArea)window.openHomeArea(area);return;}
    if(action==='modal-close'){closeModal();return;}
    const ctx=actionContext();for(const feature of Object.values(window.KoepandaFeatures||{})){const handler=feature&&feature.actions&&feature.actions[action];if(handler){try{handler(ctx,b,e);}catch(error){console.error('[Koepanda] action failed:',action,error);toast('操作を完了できませんでした。もう一度お試しください。');}return;}}
  }
  function dispatchFeaturePointer(name,e){const feature=window.KoepandaFeatures.sticker_book,handler=feature&&feature[name];if(handler)handler(actionContext(),e);}
  function onSubmit(e){for(const feature of Object.values(window.KoepandaFeatures||{})){if(feature&&feature.submit){try{if(feature.submit(actionContext(),e))return;}catch(error){console.error('[Koepanda] form action failed:',error);toast('送信を完了できませんでした。入力内容を確認してもう一度お試しください。');return;}}}}
  function onChange(e){for(const feature of Object.values(window.KoepandaFeatures||{})){if(feature&&feature.change){try{if(feature.change(actionContext(),e))return;}catch(error){console.error('[Koepanda] setting update failed:',error);toast('設定を保存できませんでした。もう一度お試しください。');return;}}}}
  function modal(title,body){const d=root.querySelector('#kpModal');d.querySelector('.kp-modal-body').innerHTML=`<button class="kp-modal-x" data-action="modal-close" aria-label="閉じる">×</button><span class="kp-eyebrow">KOEPANDA</span><h2>${title}</h2>${body}`;d.showModal();}
  function closeModal(){const d=root.querySelector('#kpModal');if(d.open)d.close();}
  function toast(message){let t=root.querySelector('.kp-toast');if(!t){t=el('div','kp-toast');root.querySelector('.kp-feature-frame').append(t);}t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3200);}
  if(document.getElementById('kpFeatureRoot'))boot();else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

} catch (error) { console.error("[Koepanda] startup module failed: js/app-shell.js", error); }
