/* DEMO 10.107.4 homepage display helper only.
   Reads existing daily-goal state; does not increment/reset learning records. */
(function(){
  function readHomeStats(){
    var streak=0, days30=0, best=0;
    try{
      if(typeof currentStreak==='function') streak=Math.max(0,Number(currentStreak())||0);
      if(typeof readDailyGoal==='function'){
        var state=readDailyGoal();
        days30=state && Array.isArray(state.days) ? state.days.length : 0;
        best=state ? Math.max(0,Number(state.best)||0) : 0;
      }
    }catch(e){}
    return {streak:streak,days30:days30,best:best};
  }
  function renderHomeStats(){
    var s=readHomeStats();
    var streakEl=document.getElementById('homeStreakLive');
    var effectStreakEl=document.getElementById('homeEffectStreak');
    var daysEl=document.getElementById('homeStudyDays');
    var bestEl=document.getElementById('homeBestStreak');
    if(streakEl){streakEl.textContent=s.streak+'日';streakEl.setAttribute('aria-label','連続学習 '+s.streak+'日');}
    if(effectStreakEl){effectStreakEl.textContent=s.streak+'日連続';effectStreakEl.setAttribute('aria-label','連続学習 '+s.streak+'日');}
    if(daysEl){daysEl.textContent=s.days30+'日';daysEl.setAttribute('aria-label','直近30日の学習 '+s.days30+'日');}
    if(bestEl){bestEl.textContent=s.best+'日';bestEl.setAttribute('aria-label','最高連続学習 '+s.best+'日');}
  }
  function refreshSoon(){setTimeout(renderHomeStats,0);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',renderHomeStats,{once:true});
  else renderHomeStats();
  window.addEventListener('pageshow',renderHomeStats);
  window.addEventListener('hashchange',refreshSoon);
  document.addEventListener('visibilitychange',function(){if(!document.hidden) refreshSoon();});
  /* Keep the home counters current after the existing daily-goal completion logic runs. */
  if(typeof window.completeDailyGoal==='function' && !window.completeDailyGoal.__koepandaHomeWrapped){
    var originalComplete=window.completeDailyGoal;
    var wrapped=function(){var result=originalComplete.apply(this,arguments);refreshSoon();return result;};
    wrapped.__koepandaHomeWrapped=true;
    window.completeDailyGoal=wrapped;
  }
})();
