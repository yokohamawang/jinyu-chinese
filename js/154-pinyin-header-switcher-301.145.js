/* 301.145 — keep sound navigation beside the fixed return button. */
(function(){
  'use strict';
  var raf=0;
  function visible(el){
    if(!el||el.closest('[hidden]'))return false;
    var s=getComputedStyle(el),r=el.getBoundingClientRect();
    return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
  }
  function pair(prev,next,count){return prev&&next&&visible(prev)&&visible(next)?{prev:prev,next:next,count:count}:null}
  function singleVowelPair(){
    var root=document.querySelector('#kidsVowelDrill:not([hidden])');if(!root)return null;
    return pair(root.querySelector('#kidsVowelTonePrev'),root.querySelector('#kidsVowelToneNext'),root.querySelector('#kidsVowelToneNavCount'));
  }
  function lessonPair(){
    var root=document.querySelector('#kidsCourse > .kids-lesson-card.is-roadmap-lesson-active');if(!root)return null;
    if(root.id==='kidsInitialsLesson'){var initials=pair(root.querySelector('#initialsLetterPrev'),root.querySelector('#initialsLetterNext'),root.querySelector('#initialsLetterCount'));if(initials)return initials}
    var nav=root.querySelector('.kp-single-item-nav');
    if(nav){var single=pair(nav.querySelector('button[data-step="-1"]'),nav.querySelector('button[data-step="1"]'),nav.querySelector('span'));if(single)return single}
    if(root.id==='kidsWholeSyllableLesson'||root.id==='kidsWholeSyllableP15'){
      var controls=root.querySelector('.kp205-controls');
      if(controls){var items=controls.querySelectorAll('button');var counter=root.querySelector('#kp167Progress,#kp175Progress');var whole=pair(items[0],items[items.length-1],counter);if(whole)return whole}
    }
    if(root.id==='kidsTwoSpellingP16'){var two=pair(root.querySelector('#kp192Prev'),root.querySelector('#kp192Next'),root.querySelector('#kp192Count'));if(two)return two}
    if(root.id==='kidsThreeSpellingLesson'){var three=pair(root.querySelector('.kp223-prev'),root.querySelector('.kp223-next-practice'),root.querySelector('.kp223-count'));if(three)return three}
    return null;
  }
  function activePair(){return singleVowelPair()||lessonPair()}
  function makeNav(){
    var nav=document.createElement('nav');nav.className='kp145-header-stepper';nav.setAttribute('aria-label','音を切り替える');
    nav.innerHTML='<button type="button" data-step="-1" aria-label="前の音"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 5-7 7 7 7"/></svg></button><span aria-live="polite"></span><button type="button" data-step="1" aria-label="次の音"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5 7 7-7 7"/></svg></button>';
    return nav;
  }
  function wireHeader(header,host,title){
    if(!header||!host)return;
    var controls=header.querySelector('.kp145-header-stepper'),pairNow=activePair();
    if(!pairNow){if(controls)controls.remove();header.classList.remove('kp145-has-stepper');if(title)title.hidden=false;return}
    if(!controls){controls=makeNav();host.appendChild(controls)}
    header.classList.add('kp145-has-stepper');if(title)title.hidden=true;
    var buttons=controls.querySelectorAll('button'),count=controls.querySelector('span');
    buttons[0].disabled=pairNow.prev.disabled;buttons[1].disabled=pairNow.next.disabled;
    count.textContent=pairNow.count?pairNow.count.textContent.trim():'';count.hidden=!count.textContent;
    if(!controls.dataset.wired){controls.dataset.wired='1';controls.addEventListener('click',function(event){
      var control=event.target.closest('button[data-step]');if(!control||control.disabled)return;
      var current=activePair();if(!current)return;
      (control.dataset.step==='-1'?current.prev:current.next).click();schedule();
    })}
  }
  function refresh(){
    raf=0;
    var lessonHeader=document.querySelector('.kp148-lesson-header');
    if(lessonHeader)wireHeader(lessonHeader,lessonHeader,lessonHeader.querySelector('.kp148-lesson-name'));
    var vowelHeader=document.querySelector('#kp148VowelHeader');
    if(vowelHeader){var head=vowelHeader.querySelector('.kids-vowel-drill-head');wireHeader(head,head,head&&head.querySelector('.kids-vowel-drill-title'))}
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(refresh)}
  document.addEventListener('click',schedule,true);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','disabled']});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
