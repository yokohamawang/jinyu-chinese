/* 10.108.131: prepare current lesson models before the first sound tap. */
(function(){
  'use strict';
  var models={"kidsCompoundAOOUIULesson": ["凹", "欧", "优"], "kidsFrontNasalLesson": ["安", "恩", "音", "温", "晕"], "kidsInitialsZCSLesson": ["字", "次", "四"], "kidsCompoundIEUEERLesson": ["耶", "约", "儿"], "kidsInitialsJQXLesson": ["鸡", "七", "西"], "kidsInitialsZHRLesson": ["智", "赤", "是", "日"], "kidsCompoundAIEIUILesson": ["唉", "诶", "微"]};
  function init(){
    Object.keys(models).forEach(function(id){
      var root=document.getElementById(id);if(!root)return;
      function warm(){
        if(root.hidden||!root.classList.contains('is-roadmap-lesson-active'))return;
        if(typeof window.prefetchTTS==='function')models[id].forEach(window.prefetchTTS);
      }
      new MutationObserver(warm).observe(root,{attributes:true,attributeFilter:['hidden','class']});warm();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
