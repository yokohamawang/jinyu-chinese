/* The recommended schedule follows the lessons actually available on the course map. */
(function(){
  'use strict';
  const groups=[
    {name:'四声と単母音',goal:'四声の違いを聞き取り、6つの母音を声調つきでまねできる',units:[
      ['P0-U1','四声の感じ',2],['P1','a・o・e',3],['P2','i・u・ü',3]
    ]},
    {name:'声母',goal:'息の強さと舌の位置に注意して、似た子音を聞き分ける',units:[
      ['P3','b・p・m・f',2],['P4','d・t・n・l',2],['P5','g・k・h',2],
      ['P6','j・q・x',2],['P7','zh・ch・sh・r',2],['P8','z・c・s',2]
    ]},
    {name:'複韻母と鼻韻母',goal:'つながる母音と前・後の鼻音を聞き分ける',units:[
      ['P9','ai・ei・ui',2],['P10','ao・ou・iu',2],['P11','ie・üe・er',2],
      ['P12','an・en・in・un・ün',2],['P13','ang・eng・ing・ong',2]
    ]},
    {name:'二拼・三拼',goal:'音を一つずつ確認してから、なめらかにつなげて読める',units:[['P16','二拼',3],['P17','三拼',3]]},
    {name:'整体認読',goal:'音節を分けずに、そのまま聞いて読める',units:[['P14','整体認読①',2],['P15','整体認読②',2]]},
    {name:'仕上げ',goal:'軽声を含めて聞き分け、総合練習で迷う音を復習する',units:[
      ['P19','軽声',2],['P18','総合練習',3],['P21','最終テスト',2]
    ]}
  ];
  const units=groups.flatMap(g=>g.units.map(([id,title,days])=>({id,title,days,group:g.name})));
  const tasks=[
    '音を聞く → 口の動きを見る → 3回まねする',
    '前回の音を聞き直す → 録音して比べる → ミニチェック',
    '音をつなげて練習 → 苦手な音を復習 → もう一度チェック'
  ];

  // Study sessions are movable: a missed day does not advance or reset the plan.
  function sessions(){
    const result=[];
    let chapterCount=0;
    for(const unit of units){
      for(let i=0;i<unit.days;i++)result.push({id:unit.id,title:unit.title,task:tasks[i],kind:'lesson',part:i+1,parts:unit.days});
      chapterCount++;
      if(chapterCount%3===0)result.push({id:unit.id,title:'まとめの復習',task:'直近3章の音を聞く → 苦手な音を練習 → ミニチェック',kind:'review'});
    }
    const byId=new Map();
    result.forEach((day,index)=>{
      if(day.kind==='lesson'&&!byId.has(day.id))byId.set(day.id,index);
      const due=units.filter(u=>{
        const first=byId.get(u.id);
        return first!==undefined&&[1,3,7].includes(index-first)&&u.id!==day.id;
      }).map(u=>u.title);
      day.review=due.slice(0,2);
      day.session=index+1;
    });
    return result;
  }
  const calendar=sessions();

  function nextSessions(id){
    let index=calendar.findIndex(d=>d.id===id&&d.kind==='lesson');
    if(index<0)index=0;
    return calendar.slice(index,index+3);
  }
  function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function html(nextId){
    const next=nextSessions(nextId);
    return `
      <section class="kids-plan-next" aria-labelledby="kidsPlanNextTitle">
        <h3 id="kidsPlanNextTitle">📖 これからの学習と復習</h3>
        <p>今の進みぐあいに合わせた予定です。</p>
        <ol class="kids-plan-session-list">${next.map((d,i)=>`
          <li><span class="kids-plan-session-day">${i+1}回目</span><div>
            <b>${safe(d.title)}${d.kind==='lesson'?`（全${d.parts}回のうち${d.part}回目）`:''}</b>
            <small>${safe(d.task)}</small>
            ${d.review.length?`<em>復習：${safe(d.review.join('・'))}</em>`:''}
          </div></li>`).join('')}</ol>
      </section>
      <section class="kids-plan-chapters" aria-labelledby="kidsPlanChaptersTitle">
        <h3 id="kidsPlanChaptersTitle">🗺️ 全章の進み方</h3>
        <p>1単元につき2〜3回が目安。できたら次の単元へ。</p>
        ${groups.map((g,index)=>`<details>
          <summary>${index+1}. ${safe(g.name)} <small>${g.units.reduce((n,u)=>n+u[2],0)}回＋復習</small></summary>
          <p class="kids-plan-goal">できるようになること：${safe(g.goal)}</p>
          <ul>${g.units.map(([id,title,days])=>`<li><span>${safe(id)} · ${safe(title)}</span><b>${days}回</b></li>`).join('')}</ul>
        </details>`).join('')}
        <p class="kids-plan-review-tip">復習は翌回・3回後・7回後。3単元ごとにまとめ直し。迷う音はもう一度。</p>
      </section>`;
  }
  window.KP_PINYIN_PLAN_SCHEDULE={units,calendar,nextSessions,html};
})();
