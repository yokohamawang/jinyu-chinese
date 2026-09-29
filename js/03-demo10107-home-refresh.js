/* DEMO 10.107 homepage display helper only.
   Reads the existing streak state; it does not increment or reset it. */
(function(){
  function renderHomeStreak(){
    var el=document.getElementById('homeStreakLive');
    if(!el) return;
    var n=0;
    try{ if(typeof currentStreak==='function') n=Math.max(0,Number(currentStreak())||0); }catch(e){}
    el.textContent='🔥 '+n+'日連続';
    el.setAttribute('aria-label','連続学習 '+n+'日');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',renderHomeStreak,{once:true});
  else renderHomeStreak();
  window.addEventListener('pageshow',renderHomeStreak);
})();
