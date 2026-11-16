(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  const WEEK=['日','月','火','水','木','金','土'];
  let dashboardStatus='idle',dashboardUserId=null,cloudStickers=null,cloudDays=null,activeContext=null,requestSeq=0;
  const recentAwardStickers=new Map(),recentActivityDays=new Set();
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
  function weeklyCalendar(days){
    const today=new Date(),monday=new Date(today);monday.setDate(today.getDate()-((today.getDay()+6)%7));const loading=days===null;
    return Array.from({length:7},(_,index)=>{
      const date=new Date(monday);date.setDate(monday.getDate()+index);
      const key=localDateKey(date),done=!loading&&days.includes(key),current=key===localDateKey(today);
      return `<span class="kp-study-day${done?' is-done':''}${current?' is-today':''}"><small>${WEEK[date.getDay()]}</small><b>${loading?'—':done?'✓':'·'}</b></span>`;
    }).join('');
  }
  function recordCard(){
    const days=displayedDays(),local=dailyRecord();
    const streak=days===null?'確認中…':dashboardStatus==='ready'?consecutiveStreak(days):(typeof window.currentStreak==='function'?window.currentStreak():Math.max(0,Number(local.streak)||0));
    return `<section class="kp-study-record" aria-label="学習の記録">
      <div class="kp-study-record-main"><span class="kp-study-flame" aria-hidden="true">🎋</span><div><b>学習の記録</b><small>累計 ${days===null?'…':days.length} 日</small></div><strong>${streak}<small>${streak==='確認中…'?'':'日連続'}</small></strong></div>
      <div class="kp-study-calendar" aria-label="直近7日の学習記録">${weeklyCalendar(days)}</div>
      <a href="#self" class="kp-study-link" data-action="open-records">カレンダーを見る <span aria-hidden="true">›</span></a>
    </section>`;
  }
  function stampCard(state,STICKERS,img,safe){
    let countLabel,shown=[];
    if(dashboardStatus==='ready'&&Array.isArray(cloudStickers)){
      countLabel=cloudStickers.length+'枚';
      shown=cloudStickers.slice(-7).map(row=>STICKERS.find(item=>item.id===row.sticker_key)).filter(Boolean);
    }else if(dashboardStatus==='loading'||dashboardStatus==='idle'){
      countLabel='確認中…';
    }else if(dashboardStatus==='error'){
      countLabel='—';
    }else{
      const owned=STICKERS.filter(item=>state.unlocked.includes(item.id));
      countLabel=owned.length+'枚';shown=owned.slice(-7);
    }
    const stamps=shown.length?shown.map(item=>`<span class="kp-study-stamp" title="${safe(item.name)}"><img src="${img(item.id)}" alt="${safe(item.glyph)}"></span>`).join(''):`<span class="kp-study-stamp-empty">${dashboardStatus==='error'?'シールを読み込めませんでした':dashboardStatus==='loading'||dashboardStatus==='idle'?'シールを確認中…':'学習してシールを集めよう'}</span>`;
    return `<section class="kp-study-stamps" aria-label="集めたスタンプ"><div class="kp-study-stamps-head"><div><b>集めたスタンプ</b><small>${countLabel}</small></div><a href="#rewards" data-action="open-rewards">一覧を見る <span aria-hidden="true">›</span></a></div><div class="kp-study-stamp-row">${stamps}</div></section>`;
  }
  function mergeRecentAwards(rows){
    const result=new Map((rows||[]).map(row=>[row.id,row]));
    for(const [id,row] of recentAwardStickers)result.set(id,row);
    return [...result.values()].sort((a,b)=>String(a.obtained_at||'').localeCompare(String(b.obtained_at||'')));
  }
  window.addEventListener('kp-auth-state-changed',()=>{
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
      ${stampCard(state,STICKERS,img,safe)}
      <div class="kp-learning-map">
        <img class="kp-learning-art" src="./assets/home/koepanda-learning-roadmap.png?v=301.196" alt="ピンイン、漢字、中国語検定の学習ロード" width="739" height="1454">
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
    activeContext=ctx;
    if(dashboardStatus==='guest'||dashboardStatus==='loading'||dashboardStatus==='ready'||dashboardStatus==='error')return;
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
    'open-records':(ctx,button,event)=>{event.preventDefault();ctx.setPage('records');ctx.render();},
    'open-rewards':(ctx,button,event)=>{event.preventDefault();ctx.setPage('rewards');ctx.render();},
    'roadmap-coming':(ctx,button)=>ctx.modal(`${ctx.safe(button.dataset.level)}コース`,`<p class="kp-modal-copy">このコースは準備中です。公開後、この島から学習を始められます。</p><button class="kp-primary" data-action="modal-close">閉じる</button>`)
  };
})();

