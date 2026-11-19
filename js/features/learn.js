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
  function pinyinContinueCard(){
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
      ${pinyinContinueCard()}
      ${stampCard(state,STICKERS,img,safe)}
      <div class="kp-learning-map">
        <img class="kp-learning-art" src="./assets/home/koepanda-learning-roadmap.png?v=301.266" alt="ピンイン、漢字、中国語検定の学習ロード" width="739" height="1454" loading="eager" decoding="async" fetchpriority="high">
        <section class="kp-map-recovery" role="status"><p>学習マップを表示できませんでした。</p><button type="button" data-action="retry-home-map">マップをもう一度読み込む</button><button type="button" data-action="pinyin-course">ピンインのぼうけんへ</button><a href="./hanzi-practice.html">漢字のたんけんへ</a><a href="./help-station.html?v=10.108.301.64">手書き漢字辞典へ</a></section>
        <button type="button" class="kp-home-hotspot kp-home-pinyin" data-action="pinyin-course" aria-label="ピンインのぼうけんを始める"></button>
        <a class="kp-home-hotspot kp-help-station" href="./help-station.html?v=10.108.301.64" aria-label="小音の手書き漢字辞典：手書きで文字を調べる">
          <img src="./assets/home/help-station-handwriting-dictionary.svg?v=301.197" alt="" width="128" height="77">
        </a>
        <a class="kp-home-hotspot kp-home-hanzi" href="./hanzi-practice.html" aria-label="漢字のたんけんを開く"></a>
        <a class="kp-home-hotspot kp-home-pre4" href="./hanzi-practice.html" aria-label="準4級の漢字ルートを開く"></a>
        <button type="button" class="kp-home-hotspot kp-home-grade4" data-action="roadmap-coming" data-level="4級" aria-label="4級コースの案内"></button>
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

