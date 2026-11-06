/* Koepanda DEMO 10.108.07 — reliable Home escape from the pinyin/kids course.
   Navigation-only hotfix. Audio, lesson progress, scoring and unlock logic are unchanged. */
(function(){
  var returnPending=false;

  function closeCourseLayers(fromBrowserBack){
    var body=document.body;
    if(!body)return;

    /* The explicit Home control consumes the same history step as browser Back. */
    if(!fromBrowserBack&&history.state&&history.state.koepandaPinyinEntry){
      if(!returnPending){
        returnPending=true;
        try{history.back();return}catch(e){returnPending=false}
      }
    }
    returnPending=false;

    /* Stop course-only visual layers before returning home. */
    body.classList.remove('app-kids-mode');
    var course=document.getElementById('kidsCourse');
    if(course)course.setAttribute('aria-hidden','true');

    var celebration=document.getElementById('kidsVowelCelebration');
    if(celebration&&celebration.parentNode)celebration.parentNode.removeChild(celebration);

    /* Reuse the canonical homepage navigation reset when available. */
    if(typeof window.returnToAppHome==='function'){
      window.returnToAppHome();
    }else{
      body.classList.remove('app-function-mode','app-area-listen','app-area-chat','app-area-repeat','app-area-settings');
      body.classList.add('app-home-mode');
      try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
      try{window.scrollTo(0,0)}catch(e){}
    }

    /* iOS Safari can restore a stale scroll position one frame later. */
    requestAnimationFrame(function(){
      try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch(e){try{window.scrollTo(0,0)}catch(_){} }
    });
  }

  window.koepandaReturnHomeFromCourse=closeCourseLayers;

  /* Android Back first pops the in-app pinyin entry and restores the homepage. */
  window.addEventListener('popstate',function(ev){
    var body=document.body;
    if(!body)return;
    if(ev.state&&ev.state.koepandaPinyinEntry){
      if(!body.classList.contains('app-kids-mode')&&typeof window.koepandaEnterKidsCourse==='function'){
        window.koepandaEnterKidsCourse(null,{restore:true});
      }
      return;
    }
    if(body.classList.contains('app-kids-mode'))closeCourseLayers(true);
  });

  function bind(){
    var home=document.getElementById('kidsBackHome');
    if(!home||home.dataset.homeEscape107==='1')return;
    home.dataset.homeEscape107='1';

    /* Capture phase makes this resilient even if another course handler stops bubbling. */
    home.addEventListener('click',function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();
      closeCourseLayers();
    },true);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();

  /* Re-bind defensively after BFCache/page restore. */
  window.addEventListener('pageshow',bind);
})();
