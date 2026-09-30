/* DEMO 10.107.5 — navigation binding fix for the effect-image homepage.
   Visual homepage only: feature internals are unchanged. */
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

    const initialArea=AREA_BY_HASH[location.hash];
    if(initialArea){
      window.openHomeArea(initialArea);
    }else{
      setBodyMode(null);
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',bindHomeNavigation,{once:true});
  }else{
    bindHomeNavigation();
  }
})();
