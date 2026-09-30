/* DEMO 10.107.33 — robust startup/refresh home reset for Safari/iOS.
   Navigation only: feature internals, audio, mouth timing, recording and scoring are unchanged. */
(function(){
  const AREA_BY_HASH={
    '#listeningGame':'listen',
    '#pandaChat':'chat',
    '#examplePractice':'repeat',
    '#voicePrivacy':'settings'
  };

  function setBodyMode(area){
    document.body.classList.remove(
      'app-home-mode','app-function-mode',
      'app-area-listen','app-area-chat','app-area-repeat','app-area-settings'
    );
    if(!area){
      document.body.classList.add('app-home-mode');
      return;
    }
    document.body.classList.add('app-function-mode','app-area-'+area);
  }

  function areaTarget(area){
    if(area==='listen') return document.getElementById('listeningGame');
    if(area==='chat') return document.getElementById('pandaChat');
    if(area==='repeat') return document.getElementById('examplePractice');
    if(area==='settings') return document.getElementById('voicePrivacy');
    return null;
  }

  window.openHomeArea=function(area){
    setBodyMode(area);
    const target=areaTarget(area);
    requestAnimationFrame(function(){
      if(target) target.scrollIntoView({block:'start',behavior:'auto'});
    });
  };

  window.returnToAppHome=function(){
    setBodyMode(null);
    try{ history.replaceState(null,'',location.pathname+location.search); }catch(e){}
    requestAnimationFrame(function(){ window.scrollTo({top:0,left:0,behavior:'auto'}); });
  };

  function bindAreaLink(link){
    if(!link || link.dataset.koepandaNavBound==='1') return;
    const hash=link.getAttribute('href');
    const area=AREA_BY_HASH[hash];
    if(!area) return;
    link.dataset.koepandaNavBound='1';
    link.addEventListener('click',function(e){
      e.preventDefault();
      try{ history.replaceState(null,'',hash); }catch(err){}
      window.openHomeArea(area);
    });
  }

  function forceStartupHome(){
    try{ if('scrollRestoration' in history) history.scrollRestoration='manual'; }catch(e){}
    setBodyMode(null);
    try{ history.replaceState(null,'',location.pathname+location.search); }catch(e){}
    try{ window.scrollTo(0,0); }catch(e){}
    requestAnimationFrame(function(){
      try{ window.scrollTo(0,0); }catch(e){}
      requestAnimationFrame(function(){ try{ window.scrollTo(0,0); }catch(e){} });
    });
    setTimeout(function(){
      setBodyMode(null);
      try{ window.scrollTo(0,0); }catch(e){}
    },80);
  }

  function bindHomeNavigation(){
    /* Old card navigation + new image-home transparent hotspots. */
    document.querySelectorAll('.lesson-steps a[href], .home-effect-live a.home-effect-hotspot[href]').forEach(bindAreaLink);

    const home=document.querySelector('.floating-home');
    if(home && home.dataset.koepandaHomeBound!=='1'){
      home.dataset.koepandaHomeBound='1';
      home.addEventListener('click',function(e){
        e.preventDefault();
        window.returnToAppHome();
      });
    }

    /* Every real page load/refresh starts at the homepage.
       In-page feature navigation still works normally after startup. */
    forceStartupHome();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',bindHomeNavigation,{once:true});
  }else{
    bindHomeNavigation();
  }

  /* Safari/iOS can restore the old scroll position after DOMContentLoaded.
     pageshow runs after that restoration, so reset once more on an actual load/restore. */
  window.addEventListener('pageshow',function(){
    forceStartupHome();
  });
})();
